#!/usr/bin/env python3
"""
Fetch BLS employment data from the Bureau of Labor Statistics API v2.

Pulls monthly employment data for all CES series defined in taxonomy.json.
The API supports up to 50 series per request and requires an API key for v2.

Usage:
    python3 scripts/signals/fetch_bls.py

Environment:
    BLS_API_KEY - required, get one free at https://data.bls.gov/registrationEngine/
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests
except ImportError:
    print("Missing dependency: pip install requests")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent.parent
TAXONOMY_PATH = ROOT / "src" / "data" / "signals" / "taxonomy.json"
OUTPUT_PATH = ROOT / "src" / "data" / "signals" / "bls_employment.json"
ENV_PATH = ROOT / ".env"

BLS_API_URL = "https://api.bls.gov/publicAPI/v2/timeseries/data/"


def load_api_key() -> str:
    """Load BLS_API_KEY from environment or .env file."""
    key = os.environ.get("BLS_API_KEY")
    if key:
        return key

    # Try loading from .env
    if ENV_PATH.exists():
        with open(ENV_PATH) as f:
            for line in f:
                line = line.strip()
                if line.startswith("BLS_API_KEY="):
                    return line.split("=", 1)[1].strip()

    print("ERROR: BLS_API_KEY not found.")
    print("Set it as an environment variable or add to .env file.")
    print("Get a free key at: https://data.bls.gov/registrationEngine/")
    sys.exit(1)


def load_bls_series() -> list[dict]:
    """Load all BLS series from taxonomy, with industry mapping."""
    with open(TAXONOMY_PATH) as f:
        taxonomy = json.load(f)

    series = []
    for industry_key, industry in taxonomy["industries"].items():
        for s in industry.get("blsSeries", []):
            series.append({
                "id": s["id"],
                "name": s["name"],
                "industry": industry_key,
            })
    return series


def fetch_bls_data(series_ids: list[str], api_key: str, start_year: int, end_year: int) -> dict:
    """Fetch data from BLS API v2. Returns raw API response."""
    payload = {
        "seriesid": series_ids,
        "startyear": str(start_year),
        "endyear": str(end_year),
        "registrationkey": api_key,
    }

    try:
        resp = requests.post(BLS_API_URL, json=payload, timeout=60)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR: BLS API request failed: {e}")
        return {}

    return resp.json()


def parse_bls_response(api_response: dict, series_info: dict[str, dict]) -> list[dict]:
    """Parse BLS API response into our data format."""
    results = []

    for series_data in api_response.get("Results", {}).get("series", []):
        series_id = series_data.get("seriesID", "")
        info = series_info.get(series_id, {})

        data_points = []
        for item in series_data.get("data", []):
            year = item.get("year", "")
            period = item.get("period", "")

            # BLS uses M01-M12 for monthly, M13 for annual average
            if not period.startswith("M") or period == "M13":
                continue

            month_num = int(period[1:])
            month_str = f"{year}-{month_num:02d}"
            value = float(item.get("value", 0))

            data_points.append({
                "month": month_str,
                "value": value,
            })

        # Sort chronologically (BLS returns newest first)
        data_points.sort(key=lambda x: x["month"])

        results.append({
            "id": series_id,
            "name": info.get("name", series_id),
            "industry": info.get("industry", "unknown"),
            "data": data_points,
        })

    return results


def main():
    api_key = load_api_key()
    series_list = load_bls_series()
    series_ids = [s["id"] for s in series_list]
    series_info = {s["id"]: s for s in series_list}

    print(f"Fetching BLS employment data for {len(series_ids)} series...")
    for s in series_list:
        print(f"  {s['id']}: {s['name']} ({s['industry']})")

    # BLS v2 allows up to 50 series per request, 20 years of data
    # We need 2020-2026
    start_year = 2020
    end_year = 2026

    # BLS API limits: max 10 years per request with v2 key
    print(f"\nRequesting data for {start_year}-{end_year}...")
    api_response = fetch_bls_data(series_ids, api_key, start_year, end_year)

    status = api_response.get("status", "UNKNOWN")
    print(f"  API status: {status}")

    if status != "REQUEST_SUCCEEDED":
        messages = api_response.get("message", [])
        for msg in messages:
            print(f"  Message: {msg}")
        if status != "REQUEST_SUCCEEDED":
            print("  WARNING: Request may have partially failed")

    results = parse_bls_response(api_response, series_info)
    print(f"\nParsed {len(results)} series:")
    for r in results:
        months = len(r["data"])
        latest = r["data"][-1] if r["data"] else {"month": "N/A", "value": 0}
        print(f"  {r['id']} ({r['name']}): {months} months, latest: {latest['value']:.1f}K ({latest['month']})")

    output = {
        "fetchedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "series": results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {len(results)} series to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
