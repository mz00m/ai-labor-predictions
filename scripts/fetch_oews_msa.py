#!/usr/bin/env python3
"""
Fetch BLS OEWS metro/non-metro area occupation employment + wages (May 2024).
Emits two files:
  src/data/regional/msa-occupation-employment.json   (per-MSA top-30 occupations)
  src/data/regional/msa-summary.json                 (per-MSA roll-up metrics)

Source: https://www.bls.gov/oes/special-requests/oesm24ma.zip
        (MSA_M2024_dl.xlsx — ~150k rows, AREA_TYPE 4=metro, 6=non-metro)

Run: npm run build:oews-msa
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
ZIP_URL = "https://www.bls.gov/oes/special-requests/oesm24ma.zip"
ZIP_PATH = CACHE / "oesm24ma.zip"
XLSX_PATH = CACHE / "oesm24ma" / "MSA_M2024_dl.xlsx"
OUT_FULL = REPO / "src" / "data" / "regional" / "msa-occupation-employment.json"
OUT_SUM = REPO / "src" / "data" / "regional" / "msa-summary.json"

ENRICHED_PATH = REPO / "src" / "data" / "enriched-occupations.json"
OCC_RISK_PATH = REPO / "src" / "data" / "risk" / "occupation-risk.json"


def download_if_missing() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    if not ZIP_PATH.exists():
        print(f"Downloading {ZIP_URL} ...", file=sys.stderr)
        req = urllib.request.Request(
            ZIP_URL,
            headers={"User-Agent": "Mozilla/5.0 (Macintosh) jobsdata-ai-bot"},
        )
        with urllib.request.urlopen(req, timeout=180) as r, open(ZIP_PATH, "wb") as out:
            out.write(r.read())
        print(f"Wrote {ZIP_PATH} ({ZIP_PATH.stat().st_size:,} bytes)", file=sys.stderr)
    if not XLSX_PATH.exists():
        with zipfile.ZipFile(ZIP_PATH) as zf:
            zf.extractall(CACHE)
        print(f"Extracted {XLSX_PATH}", file=sys.stderr)


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
    """slug -> {title, netRisk100, pctHighRiskTime}."""
    data = json.loads(OCC_RISK_PATH.read_text())
    return {
        o["slug"]: {
            "title": o["title"],
            "netRisk100": o["netRisk100"],
            "netRisk": o["netRisk"],
            "pctHighRiskTime": o["pctHighRiskTime"],
            "category": o["category"],
        }
        for o in data["occupations"]
    }


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
    occ_risk = load_occ_risk()

    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True, data_only=True)
    ws = wb.active
    rows = ws.iter_rows(values_only=True)
    headers = list(next(rows))
    col = {name: i for i, name in enumerate(headers)}

    # area_code -> dict
    areas: dict[str, dict] = {}

    for row in rows:
        area_type = row[col["AREA_TYPE"]]
        # 4 = metro, 6 = nonmetro. Skip BOS (Balance of State, area_type 7 in some files).
        if area_type not in ("4", "6", 4, 6):
            continue
        if row[col["NAICS"]] != "000000":
            continue

        area = str(row[col["AREA"]])
        title = row[col["AREA_TITLE"]]
        prim_state = row[col["PRIM_STATE"]]

        a = areas.setdefault(area, {
            "cbsa": area,
            "title": title,
            "primState": prim_state,
            "type": "metro" if str(area_type) == "4" else "nonmetro",
            "totalEmployment": None,
            "occupations": [],
        })

        if row[col["OCC_CODE"]] == "00-0000":
            a["totalEmployment"] = _to_int(row[col["TOT_EMP"]])
            continue

        if row[col["O_GROUP"]] != "detailed":
            continue

        soc = row[col["OCC_CODE"]]
        slug = soc_to_slug.get(soc)
        if not slug:
            continue
        risk = occ_risk.get(slug)
        if not risk:
            continue

        emp = _to_int(row[col["TOT_EMP"]])
        a["occupations"].append({
            "slug": slug,
            "soc": soc,
            "title": risk["title"],
            "employment": emp,
            "medianWage": _to_float(row[col["A_MEDIAN"]]),
            "netRisk100": risk["netRisk100"],
            "category": risk["category"],
        })

    # Build summary + truncated detail
    summary = []
    detail = []
    for cbsa, a in sorted(areas.items()):
        occs = [o for o in a["occupations"] if o["employment"]]
        if not occs:
            continue
        total_emp = a["totalEmployment"] or sum(o["employment"] for o in occs)

        sum_emp = sum(o["employment"] for o in occs)
        weighted_risk = sum(o["netRisk100"] * o["employment"] for o in occs) / sum_emp

        occs.sort(key=lambda o: o["employment"], reverse=True)
        top_by_emp = occs[:30]

        # Top by risk × employment (highest absolute "risk-weight" jobs in MSA)
        by_risk = sorted(occs, key=lambda o: o["netRisk100"], reverse=True)[:5]

        summary.append({
            "cbsa": cbsa,
            "title": a["title"],
            "primState": a["primState"],
            "type": a["type"],
            "totalEmployment": total_emp,
            "matchedEmployment": sum_emp,
            "coverage": sum_emp / total_emp if total_emp else 0,
            "weightedNetRisk100": round(weighted_risk),
            "topRiskOccupations": [
                {"slug": o["slug"], "title": o["title"], "employment": o["employment"],
                 "netRisk100": o["netRisk100"]}
                for o in by_risk
            ],
            "occupationCount": len(occs),
        })

        # Add employment shares to the detailed top-30
        for o in top_by_emp:
            o["share"] = round(o["employment"] / total_emp * 100, 2) if total_emp else 0
        detail.append({
            "cbsa": cbsa,
            "title": a["title"],
            "primState": a["primState"],
            "type": a["type"],
            "totalEmployment": total_emp,
            "topOccupations": top_by_emp,
        })

    summary.sort(key=lambda r: r["weightedNetRisk100"], reverse=True)

    print(f"Areas processed: {len(summary)}", file=sys.stderr)
    print(f"  Metro:    {sum(1 for s in summary if s['type'] == 'metro')}", file=sys.stderr)
    print(f"  Nonmetro: {sum(1 for s in summary if s['type'] == 'nonmetro')}", file=sys.stderr)

    return {
        "summary": {
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "year": 2024,
            "source": "BLS OEWS May 2024 metro+nonmetro (oesm24ma)",
            "sourceUrl": ZIP_URL,
            "count": len(summary),
            "areas": summary,
        },
        "detail": {
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "year": 2024,
            "source": "BLS OEWS May 2024 metro+nonmetro (oesm24ma) — top 30 occupations per area by employment",
            "areas": detail,
        },
    }


def main() -> None:
    download_if_missing()
    out = parse()
    OUT_SUM.parent.mkdir(parents=True, exist_ok=True)
    OUT_SUM.write_text(json.dumps(out["summary"], indent=2))
    OUT_FULL.write_text(json.dumps(out["detail"]))
    print(f"Wrote {OUT_SUM} ({OUT_SUM.stat().st_size:,} bytes)", file=sys.stderr)
    print(f"Wrote {OUT_FULL} ({OUT_FULL.stat().st_size:,} bytes)", file=sys.stderr)


if __name__ == "__main__":
    main()
