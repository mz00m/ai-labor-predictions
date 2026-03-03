#!/usr/bin/env python3
"""
Fetch StackOverflow question volume for tracked packages.

For each unique stackOverflowTag in taxonomy.json:
  - Monthly new question counts for the last 12 months

Uses the Stack Exchange API v2.3.

Writes to src/data/signals/stackoverflow_activity.json.

Usage:
    python3 scripts/signals/fetch_stackoverflow.py
    # Optional: STACKOVERFLOW_KEY=... for higher rate limits
"""

import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests
except ImportError:
    print("Missing dependency: pip install requests")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent.parent
TAXONOMY_PATH = ROOT / "src" / "data" / "signals" / "taxonomy.json"
OUTPUT_PATH = ROOT / "src" / "data" / "signals" / "stackoverflow_activity.json"

SE_API_BASE = "https://api.stackexchange.com/2.3"


def get_months_range(n_months=12):
    """Get a list of (start_epoch, end_epoch, month_key) tuples for the last n months."""
    now = datetime.now(timezone.utc)
    months = []
    for i in range(n_months):
        year = now.year
        month = now.month - i
        while month <= 0:
            month += 12
            year -= 1

        start = datetime(year, month, 1, tzinfo=timezone.utc)
        next_month = month + 1
        next_year = year
        if next_month > 12:
            next_month = 1
            next_year += 1
        end = datetime(next_year, next_month, 1, tzinfo=timezone.utc)

        month_key = f"{year}-{month:02d}"
        months.append((int(start.timestamp()), int(end.timestamp()), month_key))

    months.reverse()
    return months


def build_tag_map(taxonomy):
    """Build a map of unique SO tags to their associated packages."""
    tag_map = {}  # "tag" -> [package_names]
    for pkg in taxonomy["packages"]:
        tag = pkg.get("stackOverflowTag")
        if not tag:
            continue
        if tag not in tag_map:
            tag_map[tag] = []
        tag_map[tag].append(pkg["name"])
    return tag_map


def fetch_tag_questions(tag, start_epoch, end_epoch, api_key=None):
    """Fetch the total number of questions for a tag in a date range."""
    params = {
        "tagged": tag,
        "site": "stackoverflow",
        "fromdate": start_epoch,
        "todate": end_epoch,
        "filter": "total",
    }
    if api_key:
        params["key"] = api_key

    try:
        resp = requests.get(f"{SE_API_BASE}/search", params=params, timeout=30)
    except requests.RequestException as e:
        print(f"    ERROR: request failed for tag '{tag}': {e}")
        return 0

    if resp.status_code != 200:
        print(f"    ERROR: API returned {resp.status_code} for tag '{tag}'")
        # Check for throttle
        data = resp.json() if resp.content else {}
        if "backoff" in data:
            backoff = data["backoff"]
            print(f"    Throttled, backing off {backoff}s")
            time.sleep(backoff)
        return 0

    data = resp.json()

    # Handle backoff from SE API
    if "backoff" in data:
        backoff = data["backoff"]
        print(f"    Backoff requested: {backoff}s")
        time.sleep(backoff)

    return data.get("total", 0)


def main():
    api_key = os.environ.get("STACKOVERFLOW_KEY", "")
    if not api_key:
        print("NOTE: No STACKOVERFLOW_KEY set. Rate limit is ~300 req/day.")
        print("  Set: export STACKOVERFLOW_KEY=your_key_here for higher limits\n")

    with open(TAXONOMY_PATH) as f:
        taxonomy = json.load(f)

    tag_map = build_tag_map(taxonomy)
    unique_tags = list(tag_map.keys())
    print(f"Found {len(unique_tags)} unique StackOverflow tags across {sum(len(v) for v in tag_map.values())} packages\n")

    months = get_months_range(12)

    results = []
    for i, tag in enumerate(unique_tags, 1):
        packages = tag_map[tag]
        print(f"[{i}/{len(unique_tags)}] [{tag}] (packages: {', '.join(packages)})")
        print(f"    Fetching {len(months)} months...", end=" ", flush=True)

        monthly_questions = []
        total = 0
        for start_epoch, end_epoch, month_key in months:
            count = fetch_tag_questions(tag, start_epoch, end_epoch, api_key)
            monthly_questions.append({"month": month_key, "questions": count})
            total += count

            # Respectful rate limiting — SE API allows ~30 req/sec with key, less without
            time.sleep(1.0)

        print(f"{total} total questions")

        results.append({
            "tag": tag,
            "packages": packages,
            "monthlyQuestions": monthly_questions,
        })

    output = {
        "fetchedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "tags": results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {len(results)} tags to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
