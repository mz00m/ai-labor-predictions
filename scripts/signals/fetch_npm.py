#!/usr/bin/env python3
"""
Fetch npm download stats from the npm registry API.

Pulls daily download data for every npm package in taxonomy.json,
aggregates to monthly totals, and appends to the same
monthly_downloads.json used by PyPI data.

The npm API returns daily download counts for a date range.
Scoped packages (e.g., @ai-sdk/openai) need URL encoding.

Usage:
    python3 scripts/signals/fetch_npm.py
"""

import json
import time
import sys
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.parse import quote

try:
    import requests
except ImportError:
    print("Missing dependency: pip install requests")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent.parent
TAXONOMY_PATH = ROOT / "src" / "data" / "signals" / "taxonomy.json"
OUTPUT_PATH = ROOT / "src" / "data" / "signals" / "monthly_downloads.json"

NPM_API_BASE = "https://api.npmjs.org/downloads/range"


def load_npm_packages() -> list[dict]:
    with open(TAXONOMY_PATH) as f:
        taxonomy = json.load(f)
    return [p for p in taxonomy["packages"] if p["source"] == "npm"]


def fetch_npm_package(npm_name: str, start: str, end: str) -> list[dict] | None:
    """Fetch daily download data from npm registry and aggregate to monthly."""
    # Scoped packages need encoding: @scope/name -> @scope%2Fname
    encoded_name = quote(npm_name, safe="@")
    url = f"{NPM_API_BASE}/{start}:{end}/{encoded_name}"

    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR fetching {npm_name}: {e}")
        return None

    data = resp.json()
    downloads = data.get("downloads", [])
    if not downloads:
        print(f"  WARNING: no data returned for {npm_name}")
        return None

    # Aggregate daily counts into monthly totals
    monthly: dict[str, int] = defaultdict(int)
    for row in downloads:
        day = row.get("day", "")
        count = row.get("downloads", 0)
        if not day:
            continue
        month_key = day[:7]
        monthly[month_key] += count

    sorted_months = sorted(monthly.items())

    # Drop the current (incomplete) month
    today = datetime.now(timezone.utc).strftime("%Y-%m")
    if sorted_months and sorted_months[-1][0] == today:
        sorted_months = sorted_months[:-1]

    # Drop first month too (likely incomplete)
    if len(sorted_months) > 1:
        first_month_start = sorted_months[0][0]
        if start[:7] == first_month_start:
            sorted_months = sorted_months[1:]

    return [{"month": m, "downloads": d} for m, d in sorted_months]


def main():
    packages = load_npm_packages()
    print(f"Fetching npm download data for {len(packages)} packages...\n")

    # npm API supports up to 18 months of data per request
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=540)  # ~18 months
    start_str = start_date.strftime("%Y-%m-%d")
    end_str = end_date.strftime("%Y-%m-%d")

    npm_results = []
    for i, pkg in enumerate(packages, 1):
        # Use npmName if provided, otherwise use the package name
        npm_name = pkg.get("npmName", pkg["name"])
        our_name = pkg["name"]
        print(f"[{i}/{len(packages)}] {our_name} (npm: {npm_name})...", end=" ", flush=True)

        data = fetch_npm_package(npm_name, start_str, end_str)
        if data:
            total = sum(d["downloads"] for d in data)
            latest = data[-1]["downloads"] if data else 0
            print(f"{len(data)} months, latest: {latest:,}/mo, total: {total:,}")
            npm_results.append({"package": our_name, "source": "npm", "data": data})
        else:
            print("SKIPPED")
        time.sleep(0.5)  # Rate limiting

    # Load existing data to preserve PyPI entries
    existing_pypi = []
    fetch_time = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH) as f:
            existing = json.load(f)
        existing_pypi = [p for p in existing.get("packages", []) if p.get("source") == "pypi"]
        fetch_time = existing.get("fetchedAt", fetch_time)

    output = {
        "fetchedAt": fetch_time,
        "packages": existing_pypi + npm_results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {len(npm_results)} npm packages to {OUTPUT_PATH}")
    if existing_pypi:
        print(f"  (preserved {len(existing_pypi)} existing PyPI packages)")


if __name__ == "__main__":
    main()
