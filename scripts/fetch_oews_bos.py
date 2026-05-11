#!/usr/bin/env python3
"""
Fetch BLS OEWS Balance-of-State (non-metro) detailed-SOC employment, and
aggregate to per-state non-metro totals so non-metro counties can borrow
their state's non-metro distribution for the same MSA-imputation trick we
use for metro counties.

Source: oesm24ma.zip / BOS_M2024_dl.xlsx — 137 non-metro areas (one or
more per state). AREA_TYPE=6.

Output: src/data/regional/nonmetro-by-state.json
  {
    generatedAt, source,
    states: {
      "01": {
        stateFips: "01", abbr: "AL",
        nonmetroAreas: [{ area: "0100001", title: "Northwest Alabama..." }, ...],
        totalEmployment: 1230456,
        topOccupations: [{slug, soc, title, employment, share, netRisk100, category}, ...]
      },
      ...
    }
  }

Run: npm run build:oews-bos
"""
from __future__ import annotations

import json
import sys
import urllib.request
import ssl
import zipfile
from datetime import datetime, timezone
from pathlib import Path
import openpyxl

try:
    import certifi
    _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    _SSL_CTX = None

REPO = Path(__file__).resolve().parent.parent
CACHE = Path("/tmp/oews")
ZIP_URL = "https://www.bls.gov/oes/special-requests/oesm24ma.zip"
ZIP_PATH = CACHE / "oesm24ma.zip"
XLSX_PATH = CACHE / "oesm24ma" / "BOS_M2024_dl.xlsx"
ENRICHED_PATH = REPO / "src" / "data" / "enriched-occupations.json"
OCC_RISK_PATH = REPO / "src" / "data" / "risk" / "occupation-risk.json"
OUT_PATH = REPO / "src" / "data" / "regional" / "nonmetro-by-state.json"


def download_if_missing() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    if not ZIP_PATH.exists():
        req = urllib.request.Request(ZIP_URL, headers={"User-Agent": "Mozilla/5.0 (Macintosh) jobsdata-ai-bot"})
        with urllib.request.urlopen(req, timeout=180, context=_SSL_CTX) as r, open(ZIP_PATH, "wb") as out:
            out.write(r.read())
    if not XLSX_PATH.exists():
        with zipfile.ZipFile(ZIP_PATH) as zf:
            zf.extractall(CACHE)


def soc_from_onet(onet_code: str) -> str:
    return onet_code.split(".")[0]


def load_soc_to_slug() -> dict[str, str]:
    data = json.loads(ENRICHED_PATH.read_text())
    out: dict[str, str] = {}
    for occ in data["occupations"]:
        soc = soc_from_onet(occ["onetCode"])
        if soc not in out:
            out[soc] = occ["slug"]
    return out


def load_occ_risk() -> dict[str, dict]:
    data = json.loads(OCC_RISK_PATH.read_text())
    return {
        o["slug"]: {
            "title": o["title"],
            "netRisk100": o["netRisk100"],
            "category": o["category"],
            "archetype": o.get("archetype", "less-change"),
        }
        for o in data["occupations"]
    }


def _to_int(v):
    if v in (None, "", "*", "**"):
        return None
    try:
        return int(v)
    except (TypeError, ValueError):
        try:
            return int(float(v))
        except (TypeError, ValueError):
            return None


def parse() -> dict:
    soc_to_slug = load_soc_to_slug()
    occ_risk = load_occ_risk()

    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True, data_only=True)
    ws = wb.active
    rows = ws.iter_rows(values_only=True)
    headers = list(next(rows))
    col = {name: i for i, name in enumerate(headers)}

    # Index BOS rows by state FIPS — accumulate employment per SOC across
    # all nonmetro areas in the same state.
    # state_fips -> {abbr, areaList, totalEmp, byOcc: {soc -> emp}}
    states: dict[str, dict] = {}

    for row in rows:
        if row[col["AREA_TYPE"]] not in ("6", 6):
            continue
        if row[col["NAICS"]] != "000000":
            continue

        area = str(row[col["AREA"]])
        title = row[col["AREA_TITLE"]]
        abbr = row[col["PRIM_STATE"]]
        # BLS uses 7-digit area codes for BOS where the first 2 digits are state FIPS
        state_fips = area[:2].zfill(2)

        st = states.setdefault(state_fips, {
            "stateFips": state_fips,
            "abbr": abbr,
            "nonmetroAreas": {},
            "totalEmployment": 0,
            "occEmp": {},  # soc -> employment
        })
        if area not in st["nonmetroAreas"]:
            st["nonmetroAreas"][area] = title

        occ_code = row[col["OCC_CODE"]]
        if occ_code == "00-0000":
            emp = _to_int(row[col["TOT_EMP"]]) or 0
            st["totalEmployment"] += emp
            continue
        if row[col["O_GROUP"]] != "detailed":
            continue

        slug = soc_to_slug.get(occ_code)
        if not slug or slug not in occ_risk:
            continue

        emp = _to_int(row[col["TOT_EMP"]]) or 0
        if emp <= 0:
            continue
        st["occEmp"][occ_code] = st["occEmp"].get(occ_code, 0) + emp

    # Materialize per-state output
    out_states: dict[str, dict] = {}
    for fips, st in states.items():
        top: list[dict] = []
        for soc, emp in st["occEmp"].items():
            slug = soc_to_slug[soc]
            risk = occ_risk[slug]
            top.append({
                "slug": slug,
                "soc": soc,
                "title": risk["title"],
                "employment": emp,
                "share": round(emp / st["totalEmployment"] * 100, 2) if st["totalEmployment"] else 0,
                "netRisk100": risk["netRisk100"],
                "category": risk["category"],
            })
        top.sort(key=lambda r: r["employment"], reverse=True)
        out_states[fips] = {
            "stateFips": fips,
            "abbr": st["abbr"],
            "nonmetroAreas": [{"area": k, "title": v} for k, v in st["nonmetroAreas"].items()],
            "totalEmployment": st["totalEmployment"],
            "topOccupations": top[:50],  # top 50 SOC codes per state non-metro
        }

    print(f"States with non-metro data: {len(out_states)}", file=sys.stderr)
    sample = sorted(out_states.values(), key=lambda r: r["totalEmployment"], reverse=True)[:5]
    print("Top 5 by non-metro employment:", file=sys.stderr)
    for s in sample:
        print(f"  {s['abbr']}  nonmetro={s['totalEmployment']:,}  top SOC: {s['topOccupations'][0]['title'] if s['topOccupations'] else '—'}", file=sys.stderr)

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "year": 2024,
        "source": "BLS OEWS May 2024 BOS (oesm24ma/BOS_M2024_dl.xlsx)",
        "sourceUrl": ZIP_URL,
        "stateCount": len(out_states),
        "states": out_states,
    }


def main() -> None:
    download_if_missing()
    data = parse()
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(data))
    print(f"Wrote {OUT_PATH} ({OUT_PATH.stat().st_size:,} bytes)", file=sys.stderr)


if __name__ == "__main__":
    main()
