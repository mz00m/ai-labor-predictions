#!/usr/bin/env python3
"""
Fetch PyPI download stats from pypistats.org API.

Pulls the last ~180 days of daily download data for every package in
packages.json, aggregates to monthly totals, and writes to
src/data/pypi/monthly_downloads.json.

Usage:
    python3 scripts/pypi/fetch_pypistats.py
"""

import json
import time
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

try:
    import requests
except ImportError:
    print("Missing dependency: pip install requests")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent.parent
PACKAGES_PATH = ROOT / "src" / "data" / "pypi" / "packages.json"
OUTPUT_PATH = ROOT / "src" / "data" / "pypi" / "monthly_downloads.json"

PYPISTATS_BASE = "https://pypistats.org/api/packages"


def load_package_list() -> list[str]:
    with open(PACKAGES_PATH) as f:
        taxonomy = json.load(f)
    return [p["name"] for p in taxonomy["packages"]]


def fetch_package_data(package_name: str) -> list[dict] | None:
    """Fetch daily download data from pypistats.org and aggregate to monthly."""
    url = f"{PYPISTATS_BASE}/{package_name}/overall?mirrors=false"

    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR fetching {package_name}: {e}")
        return None

    data = resp.json().get("data", [])
    if not data:
        print(f"  WARNING: no data returned for {package_name}")
        return None

    # Aggregate daily counts into monthly totals
    monthly: dict[str, int] = defaultdict(int)
    for row in data:
        # Each row: {"category": "without_mirrors", "date": "2025-01-01", "downloads": N}
        date_str = row.get("date", "")
        downloads = row.get("downloads", 0)
        if not date_str or downloads is None:
            continue
        # Extract YYYY-MM
        month_key = date_str[:7]
        monthly[month_key] += downloads

    # Sort by month and return
    sorted_months = sorted(monthly.items())

    # Drop the current (incomplete) month if it's partial
    today = datetime.utcnow().strftime("%Y-%m")
    if sorted_months and sorted_months[-1][0] == today:
        sorted_months = sorted_months[:-1]

    return [{"month": m, "downloads": d} for m, d in sorted_months]


def main():
    packages = load_package_list()
    print(f"Fetching pypistats data for {len(packages)} packages...\n")

    results = []
    for i, pkg in enumerate(packages, 1):
        print(f"[{i}/{len(packages)}] {pkg}...", end=" ", flush=True)
        data = fetch_package_data(pkg)
        if data:
            total = sum(d["downloads"] for d in data)
            latest = data[-1]["downloads"] if data else 0
            print(f"{len(data)} months, latest: {latest:,}/mo, total: {total:,}")
            results.append({"package": pkg, "data": data})
        else:
            print("SKIPPED")
        time.sleep(1)  # Respectful rate limiting

    output = {
        "fetchedAt": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "packages": results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {len(results)} packages to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
