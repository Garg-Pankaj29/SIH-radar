"""
Data Fetcher — SIH Opportunity Radar
-------------------------------------
Fetches SIH 2026 problem-statement data from the community-maintained
GitHub mirror (for rich metadata) and the official sih.gov.in page
(for live submission counts), then merges them into our internal schema.

Data sources:
  - GitHub mirror: descriptions, dataset links, contacts, etc.
  - sih.gov.in: live idea-submission counts (the ground truth).
"""
import json
import re
import urllib.request
from datetime import datetime

PRIMARY_URL = (
    "https://raw.githubusercontent.com/vedantchalke36/"
    "sih-2026-problem-statements/main/data/sih2026_ps.json"
)

SIH_GOV_URL = "https://sih.gov.in/sih2026PS"

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


def fetch_live_submission_counts(url=SIH_GOV_URL, timeout=30):
    """Scrape live idea-submission counts directly from sih.gov.in.

    The SIH PS page renders each problem statement in a table row with:
        <td>SIH26XXX</td>
        <td>X/500</td>

    Returns a dict mapping ps_number → (submitted, capacity).
    Returns empty dict on failure (caller falls back to mirror data).
    """
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml",
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            html = resp.read().decode("utf-8")

        # Pattern: <td>SIH26XXX</td> ... <td>X/500</td> ... <td>Theme</td> ... <td>Deadline</td>
        pattern = r"<td>(SIH\d+)</td>\s*<td>(\d+)/(\d+)</td>\s*<td>.*?</td>\s*<td>(.*?)</td>"
        matches = re.findall(pattern, html, re.DOTALL)

        counts = {}
        for ps_num, submitted, capacity, deadline_raw in matches:
            # Try to parse "30 September 2026" into "2026-09-30"
            deadline_date = None
            try:
                deadline_date = datetime.strptime(deadline_raw.strip(), "%d %B %Y").strftime("%Y-%m-%d")
            except ValueError:
                pass
            
            counts[ps_num] = (int(submitted), int(capacity), deadline_raw.strip(), deadline_date)

        return counts
    except Exception as e:
        print(f"Warning: Could not fetch live counts from sih.gov.in: {e}")
        print("Falling back to GitHub mirror submission counts.")
        return {}


def parse_ideas(ideas_str):
    """Parse 'X/Y' format into (submitted, capacity).

    '37/500' -> (37, 500)
    Falls back to (0, 500) if unparseable — flagged as parse fallback.
    """
    m = re.match(r"(\d+)\s*/\s*(\d+)", str(ideas_str or ""))
    if m:
        return int(m.group(1)), int(m.group(2))
    return 0, 500


def normalize_record(raw, live_counts=None):
    """Convert a raw PS record into our internal schema.

    If live_counts is provided, uses live data from sih.gov.in for
    submission counts instead of the (potentially stale) mirror data.
    """
    ps_number = raw.get("ps_number", "")

    live_deadline_raw = ""
    live_deadline_date = None

    # Prefer live submission counts from sih.gov.in over mirror data
    if live_counts and ps_number in live_counts:
        submitted, capacity, live_deadline_raw, live_deadline_date = live_counts[ps_number]
    else:
        submitted, capacity = parse_ideas(raw.get("ideas"))

    fill_pct = round(100 * submitted / capacity, 2) if capacity else 0.0

    # Prefer live deadline from sih.gov.in, otherwise use mirror
    final_deadline_raw = live_deadline_raw if live_deadline_raw else raw.get("deadline", "").strip()
    
    if live_deadline_date:
        final_deadline_date = live_deadline_date
    else:
        deadline_str = raw.get("deadline_date", "")
        final_deadline_date = None
        if deadline_str:
            try:
                final_deadline_date = datetime.strptime(deadline_str, "%Y-%m-%d").strftime("%Y-%m-%d")
            except ValueError:
                final_deadline_date = None

    return {
        "ps_number": ps_number,
        "sno": raw.get("sno", 0),
        "title": raw.get("title", "").strip(),
        "organization": raw.get("org", "").strip(),
        "department": raw.get("department", "").strip(),
        "category": raw.get("category", "").strip(),
        "theme": raw.get("theme", "").strip(),
        "deadline": final_deadline_raw,
        "deadline_date": final_deadline_date,
        "ideas_submitted": submitted,
        "submission_capacity": capacity,
        "fill_percentage": fill_pct,
        "description": raw.get("description", "").strip(),
        "dataset_link": raw.get("dataset_link", "").strip(),
        "youtube": raw.get("youtube", "").strip(),
        "contact": raw.get("contact", "").strip(),
        "scraped_at": raw.get("scraped_at", ""),
        "source": "community-github-mirror+sih-gov-live",
        "source_url": PRIMARY_URL,
    }


def fetch_and_normalize(url=PRIMARY_URL):
    """Fetch data and return list of normalized records.

    Merges rich metadata from the GitHub mirror with live submission
    counts scraped directly from sih.gov.in.
    Validates each record and skips invalid ones.
    """
    raw_data = fetch_raw_data(url)

    # Fetch live submission counts from sih.gov.in
    print("Fetching live submission counts from sih.gov.in...")
    live_counts = fetch_live_submission_counts()
    if live_counts:
        non_zero = sum(1 for v in live_counts.values() if v[0] > 0)
        total_subs = sum(v[0] for v in live_counts.values())
        print(f"Live counts: {len(live_counts)} PS found, "
              f"{non_zero} with submissions, {total_subs} total ideas.")
    else:
        print("No live counts available, using mirror data only.")

    records = []
    seen_ps = set()

    for raw in raw_data:
        ps_num = raw.get("ps_number", "")
        if not ps_num:
            continue  # skip records without PS number
        if ps_num in seen_ps:
            continue  # skip duplicates
        seen_ps.add(ps_num)
        records.append(normalize_record(raw, live_counts))

    return records


if __name__ == "__main__":
    records = fetch_and_normalize()
    print(f"Fetched and normalized {len(records)} problem statements.")
    print(f"Sample: {records[0]['ps_number']} — {records[0]['title'][:60]}...")
    total_subs = sum(r["ideas_submitted"] for r in records)
    non_zero = sum(1 for r in records if r["ideas_submitted"] > 0)
    print(f"Total submissions: {total_subs} across {non_zero} PS")
