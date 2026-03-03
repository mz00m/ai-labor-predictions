#!/usr/bin/env python3
"""
BigQuery backfill script for historical PyPI download data.

This is a TEMPLATE — not run automatically. It pulls monthly download
counts from Google's public BigQuery dataset going back to 2022,
giving much deeper history than the pypistats.org API (180 days).

Setup:
    1. Create a Google Cloud project (free tier works)
    2. Enable the BigQuery API
    3. Either:
       a. Create a service account and download the JSON key:
          export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
       b. Or use default credentials:
          gcloud auth application-default login
    4. Install the Python client:
          pip install google-cloud-bigquery

Usage:
    python3 scripts/pypi/bigquery_backfill.py

Notes:
    - Each month of PyPI data is ~100GB to scan
    - The full query (2022-present) may use 200-400GB of your free 1TB/month quota
    - Run this ONCE for historical backfill, then use fetch_pypistats.py for ongoing updates
    - Results are merged with existing monthly_downloads.json (BigQuery for history,
      pypistats for recent months)
"""

import json
import sys
from datetime import datetime
from pathlib import Path

try:
    from google.cloud import bigquery
except ImportError:
    print("Missing dependency: pip install google-cloud-bigquery")
    print("Also ensure you have Google Cloud credentials configured.")
    print("See script docstring for setup instructions.")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent.parent
PACKAGES_PATH = ROOT / "src" / "data" / "pypi" / "packages.json"
OUTPUT_PATH = ROOT / "src" / "data" / "pypi" / "monthly_downloads.json"


def load_package_list() -> list[str]:
    with open(PACKAGES_PATH) as f:
        taxonomy = json.load(f)
    return [p["name"] for p in taxonomy["packages"]]


def build_query(packages: list[str], start_date: str = "2022-01-01") -> str:
    """Build the BigQuery SQL query for monthly download aggregation."""
    package_list = ", ".join(f"'{p}'" for p in packages)

    return f"""
    SELECT
        FORMAT_TIMESTAMP('%Y-%m', timestamp) AS month,
        file.project AS package,
        COUNT(*) AS downloads
    FROM `bigquery-public-data.pypi.file_downloads`
    WHERE file.project IN ({package_list})
        AND DATE(timestamp) >= '{start_date}'
        AND details.installer.name = 'pip'
    GROUP BY month, package
    ORDER BY month, package
    """


def merge_with_existing(bq_data: list[dict], existing_path: Path) -> dict:
    """
    Merge BigQuery historical data with existing pypistats data.
    BigQuery is authoritative for older months; pypistats wins for recent months.
    """
    # Load existing data if it exists
    existing: dict[str, dict[str, int]] = {}
    if existing_path.exists():
        with open(existing_path) as f:
            existing_json = json.load(f)
        for pkg_data in existing_json.get("packages", []):
            name = pkg_data["package"]
            existing[name] = {d["month"]: d["downloads"] for d in pkg_data["data"]}

    # Build merged data: start with BigQuery, overlay existing (pypistats) for recent months
    merged: dict[str, dict[str, int]] = {}
    for row in bq_data:
        name = row["package"]
        month = row["month"]
        downloads = row["downloads"]
        if name not in merged:
            merged[name] = {}
        merged[name][month] = downloads

    # Overlay pypistats data for recent months (it's more accurate for recent data)
    for name, months in existing.items():
        if name not in merged:
            merged[name] = {}
        for month, downloads in months.items():
            # pypistats wins for the last 6 months
            merged[name][month] = downloads

    # Format output
    packages = []
    for name in sorted(merged.keys()):
        months = merged[name]
        data = [{"month": m, "downloads": d} for m, d in sorted(months.items())]
        packages.append({"package": name, "data": data})

    return {
        "fetchedAt": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "packages": packages,
    }


def main():
    packages = load_package_list()
    print(f"Querying BigQuery for {len(packages)} packages...")

    client = bigquery.Client()
    query = build_query(packages)

    print("Running query (this may take a few minutes and use significant quota)...")
    print(f"Estimated scan: 200-400GB of the free 1TB/month quota\n")

    query_job = client.query(query)
    rows = list(query_job.result())

    print(f"Received {len(rows)} rows")

    # Convert to list of dicts
    bq_data = [{"package": row.package, "month": row.month, "downloads": row.downloads} for row in rows]

    # Merge with existing pypistats data
    output = merge_with_existing(bq_data, OUTPUT_PATH)

    # Write output
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    total_packages = len(output["packages"])
    total_months = sum(len(p["data"]) for p in output["packages"])
    print(f"\nWrote {total_packages} packages ({total_months} total data points) to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
