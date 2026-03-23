"""
fetch_data.py
-------------
Fetches all activities from Intervals.icu API and saves them to
src/data.json so the React dashboard can read them.

Usage:
  python fetch_data.py           # fetch from 2025-07-28 to today
  python fetch_data.py --days 7  # fetch only last 7 days (quick update)

Schedule this with Windows Task Scheduler to run automatically every day.
"""

import requests
import json
import os
import argparse
from datetime import date, timedelta
from pathlib import Path
from dotenv import load_dotenv

# ── Load secrets from .env ────────────────────────────────────────────────────
load_dotenv()

ATHLETE_ID = os.getenv("INTERVALS_ATHLETE_ID")
API_KEY    = os.getenv("INTERVALS_API_KEY")

if not ATHLETE_ID or not API_KEY:
    raise SystemExit(
        "\n❌  Missing credentials.\n"
        "    Create a .env file in this folder with:\n"
        "    INTERVALS_ATHLETE_ID=iXXXXXX\n"
        "    INTERVALS_API_KEY=your_key_here\n"
    )

# ── Config ────────────────────────────────────────────────────────────────────
BASE_URL       = "https://intervals.icu/api/v1"
TRAINING_START = "2025-07-28"          # first day of your training block
OUTPUT_FILE = Path("public/data.json")

# Fields we want — keeps the response small and fast
FIELDS = ",".join([
    "id", "name", "start_date_local", "type",
    "moving_time", "distance",
    "average_heartrate", "max_heartrate",
    "intensity_factor", "training_load",
    "tags",                             # ← the tag list we need
    "pace",                             # overall avg pace (sec/m)
])

# ── Argument parsing ──────────────────────────────────────────────────────────
parser = argparse.ArgumentParser()
parser.add_argument("--days", type=int, default=None,
                    help="Only fetch last N days (default: full history)")
args = parser.parse_args()

oldest = (date.today() - timedelta(days=args.days)).isoformat() if args.days else TRAINING_START
newest = date.today().isoformat()

print(f"🔄  Fetching activities from {oldest} → {newest} ...")

# ── API call ──────────────────────────────────────────────────────────────────
url = (
    f"{BASE_URL}/athlete/{ATHLETE_ID}/activities"
    f"?oldest={oldest}&newest={newest}&fields={FIELDS}"
)

response = requests.get(
    url,
    auth=("API_KEY", API_KEY),   # Basic auth: username is always "API_KEY"
    timeout=30,
)

if response.status_code != 200:
    raise SystemExit(
        f"\n❌  API error {response.status_code}: {response.text}\n"
        "    Check your ATHLETE_ID and API_KEY in the .env file.\n"
    )

raw = response.json()
print(f"✅  Got {len(raw)} activities from API")

# ── Process & tag ─────────────────────────────────────────────────────────────
TRAINING_START_DATE = date.fromisoformat(TRAINING_START)

def get_week(date_str):
    """Return training week number (1-indexed from TRAINING_START)."""
    d = date.fromisoformat(date_str[:10])
    delta = (d - TRAINING_START_DATE).days
    return max(1, delta // 7 + 1)

def sec_per_m_to_min_per_km(pace_sec_m):
    """Convert sec/m to decimal min/km."""
    if not pace_sec_m:
        return None
    return round(pace_sec_m / 60, 3)

def extract_interval_pace(name):
    """Pull split times from activity name like '8x3min (4:36, 4:40, 4:41)'."""
    import re
    paces = re.findall(r'(\d+):(\d+)', str(name))
    secs  = [int(m)*60 + int(s) for m, s in paces if int(m) < 10]
    if not secs:
        return None
    return round(sum(secs) / len(secs) / 60, 3)

def extract_duration(name):
    """Pull interval duration in minutes from name like '8x3min' or '3 x 10''."""
    import re
    m = re.search(r'\d+\s*[xX]\s*(\d+)', str(name))
    return int(m.group(1)) if m else None

def extract_reps(name):
    import re
    m = re.search(r'(\d+)\s*[xX]\s*\d+', str(name))
    return int(m.group(1)) if m else None

activities = []
for a in raw:
    if a.get("type") != "Run":
        continue

    date_str  = a["start_date_local"][:10]
    tags      = a.get("tags") or []                          # list of tag strings
    name      = a.get("name", "")
    avg_hr    = a.get("average_heartrate")
    intensity = a.get("intensity_factor")
    distance  = a.get("distance", 0)
    mov_time  = a.get("moving_time", 0)
    pace_raw  = a.get("pace")                                # sec/m from API

     # Always compute pace from distance + moving time
    if distance and mov_time:
        overall_pace = round((mov_time / distance) * 1000 / 60, 3)
    else:
        overall_pace = None

    activity = {
        "id":          a["id"],
        "date":        date_str,
        "week":        get_week(date_str),
        "name":        name,
        "tags":        tags,
        "avgHR":       int(avg_hr) if avg_hr else None,
        "intensity":   round(float(intensity) * 100, 1) if intensity else None,
        "distance":    round(distance / 1000, 2) if distance else None,  # km
        "movingTime":  mov_time,
        "pace":        overall_pace,
        # Sub-threshold extras (parsed from name)
        "duration":    extract_duration(name),
        "reps":        extract_reps(name),
        "intervalPace": extract_interval_pace(name),
    }
    activities.append(activity)

# Sort oldest → newest
activities.sort(key=lambda x: x["date"])

# ── Save to file ──────────────────────────────────────────────────────────────
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(activities, f, indent=2, ensure_ascii=False)

print(f"💾  Saved {len(activities)} runs → {OUTPUT_FILE}")

# ── Quick tag summary ─────────────────────────────────────────────────────────
easy  = [a for a in activities if "easy runs" in a["tags"]]
subt  = [a for a in activities if "SubT"    in a["tags"]]
print(f"\n📊  Tag breakdown:")
print(f"    #easy runs : {len(easy)} activities")
print(f"    #SubT    : {len(subt)} activities")
print(f"    (untagged: {len(activities) - len(easy) - len(subt)})")
print("\n✅  Done! Run `npm run dev` to see updates in the dashboard.")