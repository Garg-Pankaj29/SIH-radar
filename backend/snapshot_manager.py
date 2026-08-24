"""
Snapshot Manager — SIH Opportunity Radar
-----------------------------------------
Manages timestamped snapshots of PS data for historical tracking.
Each snapshot is a JSON file: data/snapshots/YYYY-MM-DD_HHMMSS.json
"""
import json
import os
from datetime import datetime
from pathlib import Path

SNAPSHOTS_DIR = Path(__file__).parent.parent / "data" / "snapshots"


def ensure_dir():
    """Create snapshots directory if it doesn't exist."""
    SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)


def save_snapshot(records, timestamp=None):
    """Save a timestamped snapshot of PS records.

    Never overwrites an existing snapshot — creates a new one.
    Returns the path to the saved snapshot.
    """
    ensure_dir()
    if timestamp is None:
        timestamp = datetime.now()

    filename = timestamp.strftime("%Y-%m-%d_%H%M%S") + ".json"
    filepath = SNAPSHOTS_DIR / filename

    snapshot = {
        "timestamp": timestamp.isoformat(),
        "record_count": len(records),
        "records": records,
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=2, ensure_ascii=False)

    return str(filepath)


def list_snapshots():
    """List all available snapshots, sorted newest first."""
    ensure_dir()
    files = sorted(SNAPSHOTS_DIR.glob("*.json"), reverse=True)
    return [str(f) for f in files]


def load_snapshot(filepath):
    """Load a snapshot from file."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def load_latest_snapshot():
    """Load the most recent snapshot. Returns None if no snapshots exist."""
    snapshots = list_snapshots()
    if not snapshots:
        return None
    return load_snapshot(snapshots[0])


def load_snapshot_by_date(date_str):
    """Load a snapshot matching a date string (YYYY-MM-DD).

    Returns the most recent snapshot from that date, or None.
    """
    ensure_dir()
    matches = sorted(SNAPSHOTS_DIR.glob(f"{date_str}*.json"), reverse=True)
    if matches:
        return load_snapshot(str(matches[0]))
    return None


def compute_deltas(current_records, previous_records):
    """Compute changes between two snapshots.

    Returns a dict mapping ps_number to delta info.
    """
    prev_map = {r["ps_number"]: r for r in previous_records}
    curr_map = {r["ps_number"]: r for r in current_records}

    deltas = {}
    for ps_num, curr in curr_map.items():
        prev = prev_map.get(ps_num)
        if prev is None:
            # New PS
            deltas[ps_num] = {
                "ps_number": ps_num,
                "status": "new",
                "submission_change": curr["ideas_submitted"],
                "previous_submitted": 0,
                "current_submitted": curr["ideas_submitted"],
                "fill_change": curr["fill_percentage"],
            }
        else:
            change = curr["ideas_submitted"] - prev["ideas_submitted"]
            fill_change = round(curr["fill_percentage"] - prev["fill_percentage"], 2)
            deltas[ps_num] = {
                "ps_number": ps_num,
                "status": "changed" if change != 0 else "unchanged",
                "submission_change": change,
                "previous_submitted": prev["ideas_submitted"],
                "current_submitted": curr["ideas_submitted"],
                "fill_change": fill_change,
            }

    # Detect removed PSs
    for ps_num in prev_map:
        if ps_num not in curr_map:
            deltas[ps_num] = {
                "ps_number": ps_num,
                "status": "removed",
                "submission_change": 0,
                "previous_submitted": prev_map[ps_num]["ideas_submitted"],
                "current_submitted": 0,
                "fill_change": 0,
            }

    return deltas


def get_historical_submissions(ps_number, max_snapshots=30):
    """Get submission history for a PS from available snapshots.

    Returns list of {timestamp, submitted, fill_percentage}.
    """
    snapshots = list_snapshots()
    history = []

    for snap_path in snapshots[:max_snapshots]:
        snap = load_snapshot(snap_path)
        for rec in snap.get("records", []):
            if rec["ps_number"] == ps_number:
                history.append({
                    "timestamp": snap["timestamp"],
                    "submitted": rec["ideas_submitted"],
                    "fill_percentage": rec["fill_percentage"],
                })
                break

    history.reverse()  # chronological order
    return history
