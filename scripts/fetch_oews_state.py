#!/usr/bin/env python3
"""
Fetch BLS OEWS state-level occupation employment + wages (May 2024) and emit
src/data/regional/state-occupation-employment.json.

Source: https://www.bls.gov/oes/special-requests/oesm24st.zip
        (state_M2024_dl.xlsx — single sheet, ~37k rows, cross-industry detail)

The output is filtered to:
  * AREA_TYPE == 2          (state-level rows)
  * NAICS == "000000"       (cross-industry totals; avoids double-counting)
  * O_GROUP == "detailed"   (specific 6-digit SOC codes, not majors/totals)
  * OCC_CODE matched to one of the 342 occupations in enriched-occupations.json

Output shape:
  {
    "generatedAt": "...",
    "year": 2024,
    "source": "BLS OEWS May 2024 state-level",
    "states": [
      {
        "fips": "01", "abbr": "AL", "title": "Alabama",
        "totalEmployment": 2091480,
        "occupations": [
          { "slug": "...", "soc": "13-2011", "employment": 12345,
            "meanWage": 78900, "medianWage": 72000 }
        ]
      }, ...
    ]
  }

Run: python3 scripts/fetch_oews_state.py
     or via npm script: npm run build:oews-state
"""
from __future__ import annotations

import json
import sys
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import openpyxl

REPO = Path(__file__).resolve().parent.parent
CACHE = Path("/tmp/oews")
ZIP_URL = "https://www.bls.gov/oes/special-requests/oesm24st.zip"
ZIP_PATH = CACHE / "oesm24st.zip"
XLSX_PATH = CACHE / "oesm24st" / "state_M2024_dl.xlsx"
OUT_PATH = REPO / "src" / "data" / "regional" / "state-occupation-employment.json"

ENRICHED_PATH = REPO / "src" / "data" / "enriched-occupations.json"


def download_if_missing() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    if not ZIP_PATH.exists():
        print(f"Downloading {ZIP_URL} ...", file=sys.stderr)
        req = urllib.request.Request(
            ZIP_URL,
            headers={"User-Agent": "Mozilla/5.0 (Macintosh) jobsdata-ai-bot"},
        )
        with urllib.request.urlopen(req, timeout=120) as r, open(ZIP_PATH, "wb") as out:
            out.write(r.read())
        print(f"Wrote {ZIP_PATH} ({ZIP_PATH.stat().st_size:,} bytes)", file=sys.stderr)
    else:
        print(f"Using cached {ZIP_PATH}", file=sys.stderr)
    if not XLSX_PATH.exists():
        with zipfile.ZipFile(ZIP_PATH) as zf:
            zf.extractall(CACHE)
        print(f"Extracted to {XLSX_PATH}", file=sys.stderr)


def soc_from_onet(onet_code: str) -> str:
    """O*NET code like '13-2011.00' or '13-2011.01' -> SOC '13-2011'."""
    return onet_code.split(".")[0]


def load_soc_to_slug() -> dict[str, str]:
    """Build SOC -> slug map from enriched-occupations.json.

    Multiple O*NET codes can map to the same SOC (e.g. 13-2011.00 and
    13-2011.01 both -> 13-2011 Accountants and Auditors). We keep the
    first slug seen, which matches the order in the source file."""
    data = json.loads(ENRICHED_PATH.read_text())
    out: dict[str, str] = {}
    for occ in data["occupations"]:
        soc = soc_from_onet(occ["onetCode"])
        if soc not in out:
            out[soc] = occ["slug"]
    return out


def _to_int(v) -> int | None:
    if v in (None, "", "*", "**"):
        return None
    try:
        return int(v)
    except (TypeError, ValueError):
        try:
            return int(float(v))
        except (TypeError, ValueError):
            return None


def _to_float(v) -> float | None:
    if v in (None, "", "*", "**", "#"):
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def parse() -> dict:
    soc_to_slug = load_soc_to_slug()
    print(f"Loaded {len(soc_to_slug)} SOC -> slug mappings", file=sys.stderr)

    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True, data_only=True)
    ws = wb.active

    rows = ws.iter_rows(values_only=True)
    headers = list(next(rows))
    col = {name: i for i, name in enumerate(headers)}

    needed = ["AREA", "AREA_TITLE", "AREA_TYPE", "PRIM_STATE", "NAICS",
              "OCC_CODE", "O_GROUP", "TOT_EMP", "A_MEAN", "A_MEDIAN"]
    for n in needed:
        if n not in col:
            raise SystemExit(f"OEWS schema missing expected column: {n}")

    states: dict[str, dict] = {}

    matched = 0
    seen_socs: set[str] = set()
    for row in rows:
        if row[col["AREA_TYPE"]] != "2":
            continue
        if row[col["NAICS"]] != "000000":
            continue
        if row[col["O_GROUP"]] != "detailed":
            # We also want the "All Occupations" total per state for context
            if row[col["OCC_CODE"]] == "00-0000":
                fips = str(row[col["AREA"]]).zfill(2)
                states.setdefault(fips, {
                    "fips": fips,
                    "abbr": row[col["PRIM_STATE"]],
                    "title": row[col["AREA_TITLE"]],
                    "occupations": [],
                    "totalEmployment": None,
                })
                states[fips]["totalEmployment"] = _to_int(row[col["TOT_EMP"]])
            continue

        soc = row[col["OCC_CODE"]]
        slug = soc_to_slug.get(soc)  # may be None for unscored SOCs

        fips = str(row[col["AREA"]]).zfill(2)
        st = states.setdefault(fips, {
            "fips": fips,
            "abbr": row[col["PRIM_STATE"]],
            "title": row[col["AREA_TITLE"]],
            "occupations": [],
            "totalEmployment": None,
        })

        emp = _to_int(row[col["TOT_EMP"]])
        # OEWS suppresses small cells with "**" — emp is None.
        # We keep every detailed SOC row, including unscored ones, so the
        # state risk roll-up can apply SOC-major-group fallback risk to
        # the unscored ~half of state employment and report full coverage.
        st["occupations"].append({
            "slug": slug,           # null when the SOC isn't in our framework
            "soc": soc,
            "employment": emp,
            "meanWage": _to_float(row[col["A_MEAN"]]),
            "medianWage": _to_float(row[col["A_MEDIAN"]]),
        })
        matched += 1
        if slug:
            seen_socs.add(soc)

    # Drop Puerto Rico, Guam, Virgin Islands — out of scope for US-50+DC map
    drop_fips = {"72", "78", "60", "66", "69"}
    states_list = [s for f, s in sorted(states.items()) if f not in drop_fips]

    print(f"States: {len(states_list)}", file=sys.stderr)
    print(f"SOC codes matched: {len(seen_socs)} of {len(soc_to_slug)}", file=sys.stderr)
    print(f"Total rows ingested: {matched:,}", file=sys.stderr)

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "year": 2024,
        "source": "BLS OEWS May 2024 state-level (oesm24st)",
        "sourceUrl": ZIP_URL,
        "soc_codes_matched": len(seen_socs),
        "soc_codes_total": len(soc_to_slug),
        "states": states_list,
    }


def main() -> None:
    download_if_missing()
    data = parse()
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(data, indent=2))
    print(f"Wrote {OUT_PATH} ({OUT_PATH.stat().st_size:,} bytes)", file=sys.stderr)


if __name__ == "__main__":
    main()
