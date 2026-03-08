#!/usr/bin/env python3
"""
Fetch PyPI download stats from pypistats.org API.

Pulls the last ~180 days of daily download data for every PyPI package
in taxonomy.json, aggregates to monthly totals, and writes to
src/data/signals/monthly_downloads.json.

Usage:
    python3 scripts/signals/fetch_pypistats.py
"""

import json
import time
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests
except ImportError:
    print("Missing dependency: pip install requests")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent.parent
TAXONOMY_PATH = ROOT / "src" / "data" / "signals" / "taxonomy.json"
OUTPUT_PATH = ROOT / "src" / "data" / "signals" / "monthly_downloads.json"

PYPISTATS_BASE = "https://pypistats.org/api/packages"


def load_pypi_packages() -> list[dict]:
    with open(TAXONOMY_PATH) as f:
        taxonomy = json.load(f)
    return [p for p in taxonomy["packages"] if p["source"] == "pypi"]


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
        date_str = row.get("date", "")
        downloads = row.get("downloads", 0)
        if not date_str or downloads is None:
            continue
        month_key = date_str[:7]
        monthly[month_key] += downloads

    sorted_months = sorted(monthly.items())

    # Drop the current (incomplete) month
    today = datetime.now(timezone.utc).strftime("%Y-%m")
    if sorted_months and sorted_months[-1][0] == today:
        sorted_months = sorted_months[:-1]

    return [{"month": m, "downloads": d} for m, d in sorted_months]


def main():
    packages = load_pypi_packages()
    print(f"Fetching pypistats data for {len(packages)} PyPI packages...\n")

    results = []
    for i, pkg in enumerate(packages, 1):
        name = pkg["name"]
        print(f"[{i}/{len(packages)}] {name}...", end=" ", flush=True)
        data = fetch_package_data(name)
        if data:
            total = sum(d["downloads"] for d in data)
            latest = data[-1]["downloads"] if data else 0
            print(f"{len(data)} months, latest: {latest:,}/mo, total: {total:,}")
            results.append({"package": name, "source": "pypi", "data": data})
        else:
            print("SKIPPED")
        time.sleep(1)  # Respectful rate limiting

    # Load existing data to preserve npm entries
    existing_npm = []
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH) as f:
            existing = json.load(f)
        existing_npm = [p for p in existing.get("packages", []) if p.get("source") == "npm"]

    output = {
        "fetchedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "packages": results + existing_npm,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {len(results)} PyPI packages to {OUTPUT_PATH}")
    if existing_npm:
        print(f"  (preserved {len(existing_npm)} existing npm packages)")


if __name__ == "__main__":
    main()
