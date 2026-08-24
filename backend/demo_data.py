"""
Demo Data Generator — SIH Opportunity Radar
----------------------------------------------
Generates realistic simulated historical snapshots for demo purposes.
ALL SIMULATED DATA IS CLEARLY LABELED.
"""
import json
import random
import math
from datetime import datetime, timedelta
from pathlib import Path

SNAPSHOTS_DIR = Path(__file__).parent.parent / "data" / "snapshots"


def generate_demo_history(records, days=14, seed=42):
    """Generate simulated historical snapshots spanning `days` days."""
    random.seed(seed)
    now = datetime.now()
    start = now - timedelta(days=days)

    profiles = {}
    ps_list = [r["ps_number"] for r in records]
    random.shuffle(ps_list)
    n = len(ps_list)
    high_growth = set(ps_list[:int(n * 0.15)])
    moderate_growth = set(ps_list[int(n * 0.15):int(n * 0.45)])
    low_growth = set(ps_list[int(n * 0.45):int(n * 0.75)])

    for r in records:
        ps = r["ps_number"]
        if ps in high_growth:
            profiles[ps] = {"base_rate": random.uniform(8, 20), "variance": 0.4, "initial": random.randint(100, 300)}
        elif ps in moderate_growth:
            profiles[ps] = {"base_rate": random.uniform(2, 8), "variance": 0.3, "initial": random.randint(30, 150)}
        elif ps in low_growth:
            profiles[ps] = {"base_rate": random.uniform(0.5, 3), "variance": 0.5, "initial": random.randint(5, 50)}
        else:
            profiles[ps] = {"base_rate": random.uniform(0, 0.5), "variance": 0.8, "initial": random.randint(0, 15)}

    snapshots = []
    for day_offset in range(days + 1):
        ts = start + timedelta(days=day_offset)
        day_records = []
        for r in records:
            ps = r["ps_number"]
            p = profiles[ps]
            noise = random.gauss(0, p["variance"] * p["base_rate"])
            raw = p["initial"] + p["base_rate"] * day_offset + noise * math.sqrt(day_offset + 1)
            if random.random() < 0.05:
                raw += random.uniform(5, 25)
            submitted = max(0, min(int(raw), r.get("submission_capacity", 500)))
            capacity = r.get("submission_capacity", 500)
            fill_pct = round(100 * submitted / capacity, 2) if capacity else 0
            day_records.append({**r, "ideas_submitted": submitted, "fill_percentage": fill_pct, "_simulated": True})

        snapshots.append({
            "timestamp": ts.isoformat(),
            "record_count": len(day_records),
            "records": day_records,
            "_demo_mode": True,
            "_notice": "SIMULATED DATA — not from actual SIH submissions",
        })
    return snapshots


def save_demo_snapshots(records):
    """Generate and save demo snapshots to disk."""
    SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    snapshots = generate_demo_history(records)
    saved = []
    for snap in snapshots:
        ts = datetime.fromisoformat(snap["timestamp"])
        filename = ts.strftime("%Y-%m-%d_%H%M%S") + ".json"
        filepath = SNAPSHOTS_DIR / filename
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(snap, f, indent=2, ensure_ascii=False)
        saved.append(str(filepath))
    return saved


def apply_demo_overlay(records):
    """Apply simulated submission counts to current records for demo display."""
    random.seed(42)
    result = []
    for r in records:
        r = dict(r)
        ps_hash = hash(r["ps_number"]) % 100
        if ps_hash < 15:
            submitted = random.randint(200, 450)
        elif ps_hash < 45:
            submitted = random.randint(50, 200)
        elif ps_hash < 75:
            submitted = random.randint(10, 80)
        else:
            submitted = random.randint(0, 20)
        capacity = r.get("submission_capacity", 500)
        r["ideas_submitted"] = min(submitted, capacity)
        r["fill_percentage"] = round(100 * r["ideas_submitted"] / capacity, 2) if capacity else 0
        r["_simulated"] = True
        result.append(r)
    return result
