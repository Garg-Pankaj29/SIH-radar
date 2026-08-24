"""
Data Fetcher — SIH Opportunity Radar
-------------------------------------
Fetches SIH 2026 problem-statement data from the community-maintained
GitHub mirror and normalizes it into our internal schema.

Data source: community-maintained scrape of sih.gov.in (unofficial).
"""
import json
import re
import urllib.request
from datetime import datetime

PRIMARY_URL = (
    "https://raw.githubusercontent.com/vedantchalke36/"
    "sih-2026-problem-statements/main/data/sih2026_ps.json"
)

USER_AGENT = "SIH-Opportunity-Radar/1.0 (student-project; not affiliated with SIH/MIC/AICTE)"


def fetch_raw_data(url=PRIMARY_URL, timeout=30):
    """Fetch raw JSON data from the community GitHub mirror.

    Returns the parsed JSON list on success, or raises on failure.
    Never silently returns empty/invalid data.
    """
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read().decode("utf-8")

    data = json.loads(raw)
    if not isinstance(data, list) or len(data) == 0:
        raise ValueError("Fetched data is empty or not a list")
    return data


def parse_ideas(ideas_str):
    """Parse 'X/Y' format into (submitted, capacity).

    '37/500' -> (37, 500)
    Falls back to (0, 500) if unparseable — flagged as parse fallback.
    """
    m = re.match(r"(\d+)\s*/\s*(\d+)", str(ideas_str or ""))
    if m:
        return int(m.group(1)), int(m.group(2))
    return 0, 500


def normalize_record(raw):
    """Convert a raw PS record into our internal schema."""
    submitted, capacity = parse_ideas(raw.get("ideas"))
    fill_pct = round(100 * submitted / capacity, 2) if capacity else 0.0
    deadline_str = raw.get("deadline_date", "")

    # Parse deadline
    deadline_date = None
    if deadline_str:
        try:
            deadline_date = datetime.strptime(deadline_str, "%Y-%m-%d").strftime("%Y-%m-%d")
        except ValueError:
            deadline_date = None

    return {
        "ps_number": raw.get("ps_number", ""),
        "sno": raw.get("sno", 0),
        "title": raw.get("title", "").strip(),
        "organization": raw.get("org", "").strip(),
        "department": raw.get("department", "").strip(),
        "category": raw.get("category", "").strip(),
        "theme": raw.get("theme", "").strip(),
        "deadline": raw.get("deadline", "").strip(),
        "deadline_date": deadline_date,
        "ideas_submitted": submitted,
        "submission_capacity": capacity,
        "fill_percentage": fill_pct,
        "description": raw.get("description", "").strip(),
        "dataset_link": raw.get("dataset_link", "").strip(),
        "youtube": raw.get("youtube", "").strip(),
        "contact": raw.get("contact", "").strip(),
        "scraped_at": raw.get("scraped_at", ""),
        "source": "community-github-mirror",
        "source_url": PRIMARY_URL,
    }


def fetch_and_normalize(url=PRIMARY_URL):
    """Fetch data and return list of normalized records.

    Validates each record and skips invalid ones.
    """
    raw_data = fetch_raw_data(url)
    records = []
    seen_ps = set()

    for raw in raw_data:
        ps_num = raw.get("ps_number", "")
        if not ps_num:
            continue  # skip records without PS number
        if ps_num in seen_ps:
            continue  # skip duplicates
        seen_ps.add(ps_num)
        records.append(normalize_record(raw))

    return records


if __name__ == "__main__":
    records = fetch_and_normalize()
    print(f"Fetched and normalized {len(records)} problem statements.")
    print(f"Sample: {records[0]['ps_number']} — {records[0]['title'][:60]}...")
