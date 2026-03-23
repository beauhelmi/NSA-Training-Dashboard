"""
fetch_data.py
-------------
Fetches all activities from Intervals.icu API and saves them to
public/data.json so the React dashboard can read them.

Usage:
  python fetch_data.py           # fetch from 2025-07-28 to today
  python fetch_data.py --days 7  # fetch only last 7 days (quick update)

For subT activities, fetches interval segments to get workout-only HR
(excluding warmup and cooldown).
"""

import requests
import json
import os
import re
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
TRAINING_START = "2025-07-28"
OUTPUT_FILE    = Path("public/data.json")

FIELDS = ",".join([
    "id", "name", "start_date_local", "type",
    "moving_time", "distance",
    "average_heartrate", "max_heartrate",
    "intensity_factor", "training_load",
    "tags",
])

# ── Argument parsing ──────────────────────────────────────────────────────────
parser = argparse.ArgumentParser()
parser.add_argument("--days", type=int, default=None,
                    help="Only fetch last N days (default: full history)")
args = parser.parse_args()

oldest = (date.today() - timedelta(days=args.days)).isoformat() if args.days else TRAINING_START
newest = date.today().isoformat()

print(f"🔄  Fetching activities from {oldest} → {newest} ...")

# ── Main activities API call ──────────────────────────────────────────────────
url = (
    f"{BASE_URL}/athlete/{ATHLETE_ID}/activities"
    f"?oldest={oldest}&newest={newest}&fields={FIELDS}"
)

response = requests.get(url, auth=("API_KEY", API_KEY), timeout=30)

if response.status_code != 200:
    raise SystemExit(
        f"\n❌  API error {response.status_code}: {response.text}\n"
        "    Check your ATHLETE_ID and API_KEY in the .env file.\n"
    )

raw = response.json()
print(f"✅  Got {len(raw)} activities from API")

# ── Helpers ───────────────────────────────────────────────────────────────────
TRAINING_START_DATE = date.fromisoformat(TRAINING_START)

def get_week(date_str):
    d = date.fromisoformat(date_str[:10])
    delta = (d - TRAINING_START_DATE).days
    return max(1, delta // 7 + 1)

def extract_interval_pace(name):
    """Average the split times embedded in activity name."""
    paces = re.findall(r'(\d+):(\d+)', str(name))
    secs  = [int(m)*60 + int(s) for m, s in paces if int(m) < 10]
    if not secs:
        return None
    return round(sum(secs) / len(secs) / 60, 3)

def extract_duration(name):
    """Extract interval duration in minutes e.g. 8x3min -> 3."""
    m = re.search(r'\d+\s*[xX]\s*(\d+)', str(name))
    return int(m.group(1)) if m else None

def extract_reps(name):
    """Extract rep count e.g. 8x3min -> 8."""
    m = re.search(r'(\d+)\s*[xX]\s*\d+', str(name))
    return int(m.group(1)) if m else None

def fetch_workout_hr(activity_id):
    """
    Fetch intervals for a subT activity and return workout-only avg HR.

    Intervals.icu detects workout segments automatically. We filter for
    segments that are NOT rest/recovery (type != 'REST' and HR above
    a threshold), then average their HR — this gives true workout HR
    excluding warmup and cooldown.

    Falls back to None if the endpoint fails or returns no useful data.
    """
    # Try the intervals endpoint first
    intervals_url = f"{BASE_URL}/activity/{activity_id}/intervals"
    try:
        r = requests.get(intervals_url, auth=("API_KEY", API_KEY), timeout=15)

        if r.status_code == 200:
            data = r.json()

            # intervals endpoint returns a dict with an 'icu_intervals' key
            # or just a list depending on API version
            intervals = []
            if isinstance(data, list):
                intervals = data
            elif isinstance(data, dict):
                intervals = data.get("icu_intervals") or data.get("intervals") or []

            if intervals:
                # Filter out rest/warmup/cooldown segments
                # Work intervals have type 'WORK' or higher HR
                # We exclude the first and last segments as warmup/cooldown
                work_segments = [
                    seg for seg in intervals
                    if seg.get("type") not in ("REST", "WARMUP", "COOLDOWN", "RECOVERY")
                    and seg.get("average_heartrate")
                ]

                if not work_segments:
                    # fallback: skip first and last, take middle segments
                    if len(intervals) >= 3:
                        work_segments = [
                            seg for seg in intervals[1:-1]
                            if seg.get("average_heartrate")
                        ]

                if work_segments:
                    hr_values = [seg["average_heartrate"] for seg in work_segments]
                    return round(sum(hr_values) / len(hr_values))

    except Exception:
        pass

    # Try the laps endpoint as fallback
    laps_url = f"{BASE_URL}/activity/{activity_id}/laps"
    try:
        r = requests.get(laps_url, auth=("API_KEY", API_KEY), timeout=15)
        if r.status_code == 200:
            laps = r.json()
            if laps and len(laps) >= 3:
                # Skip first (warmup) and last (cooldown)
                workout_laps = laps[1:-1]
                hr_values = [
                    lap["average_heartrate"]
                    for lap in workout_laps
                    if lap.get("average_heartrate")
                ]
                if hr_values:
                    return round(sum(hr_values) / len(hr_values))
    except Exception:
        pass

    return None

# ── Process activities ────────────────────────────────────────────────────────
activities   = []
subt_count   = 0
lap_hr_count = 0

for a in raw:
    if a.get("type") != "Run":
        continue

    date_str  = a["start_date_local"][:10]
    tags      = a.get("tags") or []
    name      = a.get("name", "")
    avg_hr    = a.get("average_heartrate")
    intensity = a.get("intensity_factor")
    distance  = a.get("distance", 0)
    mov_time  = a.get("moving_time", 0)
    is_subt   = "SubT" in tags

    # Compute pace from distance + moving time
    if distance and mov_time:
        overall_pace = round((mov_time / distance) * 1000 / 60, 3)
    else:
        overall_pace = None

    # For subT activities fetch workout-only HR from intervals/laps
    workout_hr = None
    if is_subt:
        subt_count += 1
        workout_hr = fetch_workout_hr(a["id"])
        if workout_hr:
            lap_hr_count += 1

    activity = {
        "id":           a["id"],
        "date":         date_str,
        "week":         get_week(date_str),
        "name":         name,
        "tags":         tags,
        "avgHR":        int(avg_hr) if avg_hr else None,
        "workoutHR":    workout_hr,
        "intensity":    round(float(intensity) * 100, 1) if intensity else None,
        "distance":     round(distance / 1000, 2) if distance else None,
        "movingTime":   mov_time,
        "pace":         overall_pace,
        "duration":     extract_duration(name),
        "reps":         extract_reps(name),
        "intervalPace": extract_interval_pace(name),
    }
    activities.append(activity)

# Sort oldest → newest
activities.sort(key=lambda x: x["date"])

# ── Save ──────────────────────────────────────────────────────────────────────
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(activities, f, indent=2, ensure_ascii=False)

print(f"💾  Saved {len(activities)} runs → {OUTPUT_FILE}")

# ── Summary ───────────────────────────────────────────────────────────────────
easy = [a for a in activities if "easy runs" in a["tags"]]
subt = [a for a in activities if "SubT"      in a["tags"]]
print(f"\n📊  Tag breakdown:")
print(f"    #easy runs : {len(easy)} activities")
print(f"    #SubT      : {len(subt)} activities")
print(f"    (untagged  : {len(activities) - len(easy) - len(subt)})")
print(f"\n💓  Workout HR from intervals: {lap_hr_count}/{subt_count} subT activities")
print("\n✅  Done! Run `npm run dev` to see updates in the dashboard.")