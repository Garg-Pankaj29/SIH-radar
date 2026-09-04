"""
Analytics Engine — SIH Opportunity Radar
------------------------------------------
All derived and heuristic metrics calculated from observed data.

Metric categories (per PRD):
1. Observed: directly from source (ps_number, title, ideas_submitted, etc.)
2. Derived: mathematically calculated (fill_percentage, velocity, etc.)
3. Heuristic: rules-based assessments (competition_level, deadline_pressure, etc.)
"""
from datetime import datetime, timedelta
import math


# ── Competition Level Thresholds (configurable) ──────────────────────────────
COMPETITION_THRESHOLDS = {
    "high": 50,       # >= 50% fill
    "medium": 10,     # >= 10% fill
    "low": 0.1,       # > 0 but < 10%
    "none": 0,        # exactly 0
}


def competition_level(fill_pct):
    """Classify competition level from fill percentage.

    Categories: High / Medium / Low / None yet
    This is a HEURISTIC metric.
    """
    if fill_pct >= COMPETITION_THRESHOLDS["high"]:
        return "High"
    elif fill_pct >= COMPETITION_THRESHOLDS["medium"]:
        return "Medium"
    elif fill_pct > COMPETITION_THRESHOLDS["none"]:
        return "Low"
    return "None yet"


# ── Deadline Intelligence ────────────────────────────────────────────────────

def days_remaining(deadline_date_str, reference_date=None):
    """Calculate days remaining until deadline.

    Returns int or None if deadline is unparseable.
    """
    if not deadline_date_str:
        return None
    try:
        deadline = datetime.strptime(deadline_date_str, "%Y-%m-%d")
        ref = reference_date or datetime.now()
        ref_date = ref.date() if isinstance(ref, datetime) else ref
        delta = (deadline.date() - ref_date).days
        return max(delta, 0)
    except ValueError:
        return None


def deadline_pressure(fill_pct, days_left, velocity_per_day=0):
    """Assess deadline pressure combining fill, time, and velocity.

    Categories: Critical / High / Moderate / Low
    This is a HEURISTIC metric.
    """
    if days_left is None:
        return "Unknown"
    if days_left <= 0:
        return "Closed"
    if days_left <= 3:
        return "Critical"
    if days_left <= 7:
        if fill_pct >= 50 or velocity_per_day >= 10:
            return "Critical"
        return "High"
    if days_left <= 14:
        if fill_pct >= 70:
            return "Critical"
        if fill_pct >= 30 or velocity_per_day >= 5:
            return "High"
        return "Moderate"
    if fill_pct >= 80:
        return "High"
    if fill_pct >= 40:
        return "Moderate"
    return "Low"


# ── Submission Velocity ──────────────────────────────────────────────────────

def calculate_velocity(history):
    """Calculate submission velocity metrics from historical data.

    Input: list of {timestamp, submitted} sorted chronologically.

    Returns dict with:
    - velocity_24h, velocity_48h, velocity_7d, velocity_overall
    - growth_24h, growth_48h, growth_7d
    - momentum classification

    All are DERIVED metrics except momentum (HEURISTIC).
    """
    if not history or len(history) < 2:
        return {
            "velocity_24h": None,
            "velocity_48h": None,
            "velocity_7d": None,
            "velocity_overall": None,
            "growth_24h": None,
            "growth_48h": None,
            "growth_7d": None,
            "momentum": "Insufficient data",
            "has_history": False,
        }

    now_rec = history[-1]
    now_sub = now_rec["submitted"]
    now_ts = datetime.fromisoformat(now_rec["timestamp"])

    def find_closest(target_dt):
        """Find the record closest to target datetime."""
        best = None
        best_diff = float("inf")
        for h in history:
            ts = datetime.fromisoformat(h["timestamp"])
            diff = abs((ts - target_dt).total_seconds())
            if diff < best_diff:
                best_diff = diff
                best = h
        return best, best_diff

    results = {}

    for label, hours in [("24h", 24), ("48h", 48), ("7d", 168)]:
        target = now_ts - timedelta(hours=hours)
        closest, diff_seconds = find_closest(target)

        if closest and diff_seconds < hours * 3600 * 1.5:
            growth = max(0, now_sub - closest["submitted"])
            elapsed_days = max((now_ts - datetime.fromisoformat(closest["timestamp"])).total_seconds() / 86400, 0.01)
            velocity = round(growth / elapsed_days, 1)
            results[f"velocity_{label}"] = velocity
            results[f"growth_{label}"] = growth
        else:
            results[f"velocity_{label}"] = None
            results[f"growth_{label}"] = None

    # Overall velocity
    first = history[0]
    first_ts = datetime.fromisoformat(first["timestamp"])
    total_days = max((now_ts - first_ts).total_seconds() / 86400, 0.01)
    total_growth = max(0, now_sub - first["submitted"])
    results["velocity_overall"] = round(total_growth / total_days, 1)

    # Momentum classification (HEURISTIC)
    v24 = results.get("velocity_24h")
    v7d = results.get("velocity_7d")

    if v24 is not None and v7d is not None:
        if v24 >= 15:
            results["momentum"] = "Rising rapidly"
        elif v24 >= 5:
            results["momentum"] = "Rising"
        elif v24 >= 0:
            results["momentum"] = "Stable"
        else:
            results["momentum"] = "Stable"
    elif v24 is not None:
        if v24 >= 10:
            results["momentum"] = "Rising rapidly"
        elif v24 >= 3:
            results["momentum"] = "Rising"
        else:
            results["momentum"] = "Stable"
    else:
        results["momentum"] = "Insufficient data"

    results["has_history"] = True
    return results


# ── Submission Cap Forecast ──────────────────────────────────────────────────

def cap_forecast(submitted, capacity, velocity_per_day, days_left):
    """Estimate when submission cap will be reached.

    Returns dict with:
    - estimated_cap_days: days until cap (None if velocity <= 0)
    - cap_before_deadline: bool
    - forecast_available: bool

    This is a DERIVED metric (linear extrapolation).
    Explicitly presented as a forecast, not guaranteed.
    """
    if velocity_per_day is None or velocity_per_day <= 0:
        return {
            "estimated_cap_days": None,
            "cap_before_deadline": None,
            "forecast_available": False,
            "note": "Forecast unavailable — insufficient velocity data.",
        }

    remaining = capacity - submitted
    if remaining <= 0:
        return {
            "estimated_cap_days": 0,
            "cap_before_deadline": True,
            "forecast_available": True,
            "note": "Submission capacity already reached.",
        }

    est_days = round(remaining / velocity_per_day, 1)

    cap_before = None
    if days_left is not None:
        cap_before = est_days <= days_left

    return {
        "estimated_cap_days": est_days,
        "cap_before_deadline": cap_before,
        "forecast_available": True,
        "note": f"At current velocity (~{velocity_per_day}/day), cap may be reached in ~{est_days} days. This is an estimate.",
    }


# ── Theme Saturation ─────────────────────────────────────────────────────────

def calculate_theme_saturation(records):
    """Calculate saturation metrics per theme.

    Returns dict of theme -> metrics.
    All DERIVED metrics.
    """
    themes = {}
    for r in records:
        theme = r.get("theme", "Unknown")
        if theme not in themes:
            themes[theme] = {
                "theme": theme,
                "ps_count": 0,
                "total_submissions": 0,
                "fills": [],
                "ps_list": [],
            }
        themes[theme]["ps_count"] += 1
        themes[theme]["total_submissions"] += r.get("ideas_submitted", 0)
        themes[theme]["fills"].append(r.get("fill_percentage", 0))
        themes[theme]["ps_list"].append(r.get("ps_number", ""))

    results = {}
    for theme, data in themes.items():
        fills = sorted(data["fills"])
        avg_fill = round(sum(fills) / len(fills), 1) if fills else 0
        median_fill = fills[len(fills) // 2] if fills else 0
        max_fill = max(fills) if fills else 0

        # Saturation level (HEURISTIC)
        if avg_fill >= 40:
            saturation = "High"
        elif avg_fill >= 15:
            saturation = "Medium"
        elif avg_fill > 0:
            saturation = "Low"
        else:
            saturation = "None yet"

        results[theme] = {
            "theme": theme,
            "ps_count": data["ps_count"],
            "total_submissions": data["total_submissions"],
            "avg_fill": avg_fill,
            "median_fill": median_fill,
            "max_fill": max_fill,
            "saturation": saturation,
            "ps_numbers": data["ps_list"],
        }

    return results


# ── Trend Detection ──────────────────────────────────────────────────────────

def detect_biggest_movers(records_with_velocity, top_n=10):
    """Find PSs with largest recent submission increase.

    Returns top N movers sorted by 24h growth (or 7d if 24h unavailable).
    """
    movers = []
    for r in records_with_velocity:
        vel = r.get("velocity", {})
        growth = vel.get("growth_24h") or vel.get("growth_7d") or 0
        if growth > 0:
            movers.append({
                "ps_number": r["ps_number"],
                "title": r["title"],
                "growth": growth,
                "period": "24h" if vel.get("growth_24h") is not None else "7d",
                "current_submitted": r["ideas_submitted"],
                "fill_percentage": r["fill_percentage"],
            })

    movers.sort(key=lambda x: -x["growth"])
    return movers[:top_n]


def detect_threshold_crossings(current_records, previous_records, thresholds=None):
    """Detect PSs that crossed important fill thresholds since last snapshot.

    Returns list of crossing events.
    """
    if thresholds is None:
        thresholds = [10, 25, 50, 75, 90]

    prev_map = {r["ps_number"]: r for r in (previous_records or [])}
    crossings = []

    for r in current_records:
        ps = r["ps_number"]
        curr_fill = r["fill_percentage"]
        prev = prev_map.get(ps)
        prev_fill = prev["fill_percentage"] if prev else 0

        for t in thresholds:
            if prev_fill < t <= curr_fill:
                crossings.append({
                    "ps_number": ps,
                    "title": r["title"],
                    "threshold": t,
                    "current_fill": curr_fill,
                    "previous_fill": prev_fill,
                })

    return crossings


# ── Aggregate KPIs ───────────────────────────────────────────────────────────

def calculate_kpis(records):
    """Calculate dashboard-level KPI values.

    All DERIVED metrics from observed data.
    """
    total = len(records)
    software = sum(1 for r in records if r.get("category") == "Software")
    hardware = sum(1 for r in records if r.get("category") == "Hardware")
    total_submissions = sum(r.get("ideas_submitted", 0) for r in records)
    fills = [r.get("fill_percentage", 0) for r in records]
    avg_fill = round(sum(fills) / len(fills), 1) if fills else 0

    # Competition distribution
    comp_dist = {"None yet": 0, "Low": 0, "Medium": 0, "High": 0}
    for r in records:
        level = competition_level(r.get("fill_percentage", 0))
        comp_dist[level] = comp_dist.get(level, 0) + 1

    # Most crowded
    most_crowded = max(records, key=lambda r: r.get("fill_percentage", 0)) if records else None

    return {
        "total_ps": total,
        "software_count": software,
        "hardware_count": hardware,
        "total_submissions": total_submissions,
        "average_fill": avg_fill,
        "competition_distribution": comp_dist,
        "most_crowded": {
            "ps_number": most_crowded["ps_number"],
            "title": most_crowded["title"],
            "fill_percentage": most_crowded["fill_percentage"],
        } if most_crowded else None,
    }
