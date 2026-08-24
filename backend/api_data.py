"""
API Data Generator — SIH Opportunity Radar
--------------------------------------------
Generates pre-computed JSON data files consumed by the Next.js frontend.
Run: python -m backend.api_data [--demo]
"""
import json
import sys
import os
from pathlib import Path
from datetime import datetime

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.data_fetcher import fetch_and_normalize
from backend.snapshot_manager import (
    save_snapshot, load_latest_snapshot, list_snapshots,
    load_snapshot, compute_deltas, get_historical_submissions
)
from backend.analytics_engine import (
    competition_level, days_remaining, deadline_pressure,
    calculate_velocity, cap_forecast, calculate_theme_saturation,
    detect_biggest_movers, calculate_kpis
)
from backend.intelligence_engine import (
    extract_technology_tags, assess_prototype_complexity,
    assess_demo_potential, calculate_resource_completeness,
    classify_opportunity, calculate_opportunity_score,
    is_crowded_but_strong, compute_tfidf_similarity
)
from backend.demo_data import apply_demo_overlay, save_demo_snapshots

API_DIR = Path(__file__).parent.parent / "data" / "api"
DEMO_MODE = "--demo" in sys.argv or os.environ.get("DEMO_MODE", "").lower() == "true"


def build_api_data():
    """Build all API data files."""
    API_DIR.mkdir(parents=True, exist_ok=True)

    print("Fetching latest SIH data...")
    records = fetch_and_normalize()
    print(f"Loaded {len(records)} problem statements.")

    # Save a snapshot
    snap_path = save_snapshot(records)
    print(f"Snapshot saved: {snap_path}")

    # Demo mode: generate simulated data
    if DEMO_MODE:
        print("DEMO MODE: Generating simulated historical data...")
        save_demo_snapshots(records)
        records = apply_demo_overlay(records)
        print("Demo overlay applied.")

    # Load historical data for velocity calculations
    snapshots = list_snapshots()
    prev_snapshot = None
    if len(snapshots) >= 2:
        prev_snapshot = load_snapshot(snapshots[1])

    # Compute similarity matrix
    print("Computing PS similarity matrix...")
    similarity = compute_tfidf_similarity(records)

    # Enrich each record with analytics + intelligence
    print("Enriching records with analytics...")
    enriched = []
    for r in records:
        ps = r["ps_number"]

        # Velocity from history
        history = []
        for sp in snapshots[:15]:
            snap = load_snapshot(sp)
            for sr in snap.get("records", []):
                if sr["ps_number"] == ps:
                    history.append({"timestamp": snap["timestamp"], "submitted": sr["ideas_submitted"]})
                    break
        history.reverse()

        vel = calculate_velocity(history)
        dl = days_remaining(r.get("deadline_date"))
        dp = deadline_pressure(r["fill_percentage"], dl, vel.get("velocity_24h") or 0)
        comp = competition_level(r["fill_percentage"])

        # Intelligence
        tech_tags = extract_technology_tags(r.get("description", ""), r.get("title", ""))
        complexity = assess_prototype_complexity(r.get("description", ""), r.get("title", ""), r.get("category", ""))
        demo = assess_demo_potential(r.get("description", ""), r.get("title", ""), r.get("category", ""))
        resources = calculate_resource_completeness(r)

        # Opportunity
        opp_category = classify_opportunity(
            r["fill_percentage"], vel.get("momentum", "Insufficient data"),
            dl, resources["score"], complexity["level"],
            vel.get("velocity_24h")
        )
        opp_score = calculate_opportunity_score(
            r["fill_percentage"], vel.get("momentum", "Insufficient data"),
            dl, resources["score"], resources["total"], complexity["level"]
        )
        crowded_strong = is_crowded_but_strong(r["fill_percentage"], resources["score"], complexity["level"])

        # Cap forecast
        v_best = vel.get("velocity_24h") or vel.get("velocity_7d") or vel.get("velocity_overall")
        forecast = cap_forecast(r["ideas_submitted"], r.get("submission_capacity", 500), v_best, dl)

        # Similar PSs
        similar = []
        for sim_ps, sim_score in similarity.get(ps, []):
            sim_rec = next((x for x in records if x["ps_number"] == sim_ps), None)
            if sim_rec:
                similar.append({
                    "ps_number": sim_ps, "title": sim_rec["title"],
                    "similarity": sim_score, "theme": sim_rec["theme"],
                })

        enriched.append({
            **r,
            "competition_level": comp,
            "days_remaining": dl,
            "deadline_pressure": dp,
            "velocity": vel,
            "technology_tags": tech_tags,
            "prototype_complexity": complexity,
            "demo_potential": demo,
            "resources": resources,
            "opportunity_category": opp_category,
            "opportunity_score": opp_score,
            "crowded_but_strong": crowded_strong,
            "cap_forecast": forecast,
            "similar_ps": similar,
            "history": history[-15:],
        })

    # KPIs
    kpis = calculate_kpis(enriched)

    # Find fastest growing and hidden gems for KPI cards
    fastest = None
    hidden_gem_count = 0
    for e in enriched:
        v24 = e["velocity"].get("growth_24h")
        if v24 is not None and (fastest is None or v24 > fastest.get("_growth", 0)):
            fastest = {**e, "_growth": v24}
        if e["opportunity_category"] == "HIDDEN GEM":
            hidden_gem_count += 1

    kpis["fastest_growing"] = {
        "ps_number": fastest["ps_number"], "title": fastest["title"],
        "growth_24h": fastest["_growth"],
    } if fastest and fastest.get("_growth", 0) > 0 else None
    kpis["hidden_gem_count"] = hidden_gem_count

    # Theme saturation
    themes = calculate_theme_saturation(enriched)

    # Trends
    movers = detect_biggest_movers(enriched)

    # Deltas from previous snapshot
    deltas = {}
    if prev_snapshot:
        deltas = compute_deltas(enriched, prev_snapshot.get("records", []))

    # Build metadata
    meta = {
        "generated_at": datetime.now().isoformat(),
        "demo_mode": DEMO_MODE,
        "record_count": len(enriched),
        "snapshot_count": len(snapshots),
        "source": "community-github-mirror (unofficial)",
        "source_url": "https://github.com/vedantchalke36/sih-2026-problem-statements",
        "disclaimer": "Data is based on publicly available SIH submission counts. This is not an official SIH product.",
    }

    # Write API files
    print("Writing API data files...")

    with open(API_DIR / "problem_statements.json", "w") as f:
        json.dump(enriched, f, indent=2, ensure_ascii=False)

    with open(API_DIR / "kpis.json", "w") as f:
        json.dump(kpis, f, indent=2)

    with open(API_DIR / "themes.json", "w") as f:
        json.dump(themes, f, indent=2, ensure_ascii=False)

    with open(API_DIR / "trends.json", "w") as f:
        json.dump({"biggest_movers": movers, "deltas": deltas}, f, indent=2)

    with open(API_DIR / "metadata.json", "w") as f:
        json.dump(meta, f, indent=2)

    print(f"API data written to {API_DIR}")
    print(f"Demo mode: {DEMO_MODE}")
    return enriched


if __name__ == "__main__":
    build_api_data()
