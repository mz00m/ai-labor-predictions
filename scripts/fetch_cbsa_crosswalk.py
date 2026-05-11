#!/usr/bin/env python3
"""
Fetch the Census CBSA→county delineation file and emit a clean JSON crosswalk.

Source: https://www2.census.gov/programs-surveys/metro-micro/geographies/reference-files/2023/delineation-files/list1_2023.xlsx

The XLSX has a few header rows on top, then columns:
  CBSA Code | Metropolitan Division Code | CSA Code | CBSA Title |
  Metro/Micro Statistical Area | Metropolitan Division Title | CSA Title |
  County/County Equivalent | State Name | FIPS State Code | FIPS County Code |
  Central/Outlying County

Output: src/data/regional/cbsa-county-crosswalk.json
  { generatedAt, vintage, cbsas: [
      { cbsa: "10180", title: "Abilene, TX", type: "Metropolitan Statistical Area",
        counties: [{fips: "48059", name: "Callahan County", role: "Outlying"}, ...]
      }, ... ],
    countyToCbsa: { "48059": "10180", ... } }

Run: npm run build:cbsa-crosswalk
"""
from __future__ import annotations

import json
import ssl
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import openpyxl

try:
    import certifi
    _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    _SSL_CTX = None

REPO = Path(__file__).resolve().parent.parent
CACHE = Path("/tmp/cbsa")
URL = "https://www2.census.gov/programs-surveys/metro-micro/geographies/reference-files/2023/delineation-files/list1_2023.xlsx"
XLSX = CACHE / "list1_2023.xlsx"
OUT = REPO / "src" / "data" / "regional" / "cbsa-county-crosswalk.json"


def download_if_missing() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    if XLSX.exists():
        print(f"Using cached {XLSX}", file=sys.stderr)
        return
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (Macintosh) jobsdata-ai-bot"})
    with urllib.request.urlopen(req, timeout=120, context=_SSL_CTX) as r, open(XLSX, "wb") as out:
        out.write(r.read())
    print(f"Wrote {XLSX} ({XLSX.stat().st_size:,} bytes)", file=sys.stderr)


def parse() -> dict:
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb.active

    # Find the header row by scanning for one that contains "CBSA Code"
    rows = list(ws.iter_rows(values_only=True))
    header_idx = None
    for i, row in enumerate(rows[:10]):
        if row and any(c == "CBSA Code" for c in row if isinstance(c, str)):
            header_idx = i
            break
    if header_idx is None:
        raise SystemExit("Could not find header row containing 'CBSA Code'")

    headers = [str(c).strip() if c is not None else "" for c in rows[header_idx]]
    idx = {h: i for i, h in enumerate(headers)}

    cbsas: dict[str, dict] = {}
    county_to_cbsa: dict[str, str] = {}

    for row in rows[header_idx + 1:]:
        if not row or row[idx["CBSA Code"]] is None:
            # Skip footer rows (Census typically appends notes at the bottom)
            if row and isinstance(row[0], str) and row[0].startswith("Note"):
                break
            continue

        cbsa = str(row[idx["CBSA Code"]]).strip()
        if not cbsa or not cbsa.isdigit():
            continue

        title = str(row[idx["CBSA Title"]]).strip()
        mtype = str(row[idx["Metropolitan/Micropolitan Statistical Area"]]).strip()
        fips_state = str(row[idx["FIPS State Code"]]).strip().zfill(2)
        fips_county = str(row[idx["FIPS County Code"]]).strip().zfill(3)
        county_fips = f"{fips_state}{fips_county}"
        county_name = str(row[idx["County/County Equivalent"]]).strip()
        role = str(row[idx["Central/Outlying County"]]).strip()

        c = cbsas.setdefault(cbsa, {
            "cbsa": cbsa,
            "title": title,
            "type": mtype,  # "Metropolitan Statistical Area" or "Micropolitan Statistical Area"
            "counties": [],
        })
        c["counties"].append({"fips": county_fips, "name": county_name, "role": role})
        county_to_cbsa[county_fips] = cbsa

    cbsa_list = sorted(cbsas.values(), key=lambda c: c["title"])

    metros = sum(1 for c in cbsa_list if c["type"].startswith("Metro"))
    micros = sum(1 for c in cbsa_list if c["type"].startswith("Micro"))
    print(f"CBSAs parsed: {len(cbsa_list)}  (metros: {metros}, micros: {micros})", file=sys.stderr)
    print(f"Counties mapped: {len(county_to_cbsa)}", file=sys.stderr)

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "vintage": "Census 2023 delineation (list1)",
        "sourceUrl": URL,
        "cbsaCount": len(cbsa_list),
        "countyToCbsa": county_to_cbsa,
        "cbsas": cbsa_list,
    }


def main() -> None:
    download_if_missing()
    data = parse()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data))
    print(f"Wrote {OUT} ({OUT.stat().st_size:,} bytes)", file=sys.stderr)


if __name__ == "__main__":
    main()
