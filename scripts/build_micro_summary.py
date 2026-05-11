#!/usr/bin/env python3
"""
Build a per-CBSA summary covering both metros AND micros, by aggregating
the county-level ACS data through the CBSA→county crosswalk.

This complements (and partially overlaps) src/data/regional/msa-summary.json,
which is OEWS-based and metro-only. The two files have different methodologies:

  msa-summary.json    — BLS OEWS detailed-SOC weighted; metros only (393).
  cbsa-summary.json   — ACS county-aggregated, SOC-major-group weighted;
                        metros + micros (935 total). Lower SOC granularity
                        but full coverage of CBSAs in the Census delineation.

Output: src/data/regional/cbsa-summary.json

Run: npm run build:cbsa-summary
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CROSSWALK_PATH = REPO / "src" / "data" / "regional" / "cbsa-county-crosswalk.json"
COUNTY_RISK_PATH = REPO / "src" / "data" / "risk" / "county-risk.json"
OUT_PATH = REPO / "src" / "data" / "regional" / "cbsa-summary.json"


def main() -> None:
    crosswalk = json.loads(CROSSWALK_PATH.read_text())
    county_risk = json.loads(COUNTY_RISK_PATH.read_text())

    # Index counties by FIPS
    by_fips = {c["fips"]: c for c in county_risk["counties"]}
    print(f"Counties with risk data: {len(by_fips)}", file=sys.stderr)

    out_cbsas = []
    skipped = 0

    for cbsa in crosswalk["cbsas"]:
        member_counties = [by_fips[c["fips"]] for c in cbsa["counties"] if c["fips"] in by_fips]
        if not member_counties:
            skipped += 1
            continue

        total_emp = sum(c["totalEmployment"] for c in member_counties)
        if total_emp == 0:
            skipped += 1
            continue

        # Weighted risk across counties
        weighted = sum(c["weightedNetRisk100"] * c["totalEmployment"] for c in member_counties) / total_emp

        # Aggregate top-group exposure across all counties: pool the topGroups
        # by slug, sum employment, weight risk
        group_emp: dict[str, dict] = {}
        for c in member_counties:
            for g in c.get("topGroups", []):
                slug = g["slug"]
                emp = c["totalEmployment"] * (g["share"] / 100.0)
                gr = group_emp.setdefault(slug, {
                    "slug": slug,
                    "employment": 0.0,
                    "netRisk100": g["netRisk100"],
                })
                gr["employment"] += emp

        # Top-5 by employment (these are the dominant occupational groups in the CBSA)
        top_groups = sorted(group_emp.values(), key=lambda g: g["employment"], reverse=True)[:5]
        for g in top_groups:
            g["employment"] = round(g["employment"])
            g["share"] = round(g["employment"] / total_emp * 100, 2) if total_emp else 0

        out_cbsas.append({
            "cbsa": cbsa["cbsa"],
            "title": cbsa["title"],
            "type": cbsa["type"],
            "category": "metro" if cbsa["type"].startswith("Metro") else "micro",
            "primState": member_counties[0]["stateFips"],
            "countyCount": len(member_counties),
            "totalEmployment": total_emp,
            "weightedNetRisk100": round(weighted, 1),
            "topGroups": top_groups,
            "source": "acs-county-aggregated",
        })

    out_cbsas.sort(key=lambda r: r["weightedNetRisk100"], reverse=True)

    metros = sum(1 for c in out_cbsas if c["category"] == "metro")
    micros = sum(1 for c in out_cbsas if c["category"] == "micro")
    print(f"CBSAs summarized: {len(out_cbsas)}  (metros: {metros}, micros: {micros})", file=sys.stderr)
    print(f"  Skipped (no county risk data): {skipped}", file=sys.stderr)

    print("\nTop 5 by risk (any category):", file=sys.stderr)
    for c in out_cbsas[:5]:
        print(f"  {c['category'][:5]:<5} {c['title']:<50} risk={c['weightedNetRisk100']}  emp={c['totalEmployment']:,}", file=sys.stderr)

    print("\nTop 5 micros by risk:", file=sys.stderr)
    micros_only = [c for c in out_cbsas if c["category"] == "micro"]
    for c in micros_only[:5]:
        print(f"  {c['title']:<50} risk={c['weightedNetRisk100']}  emp={c['totalEmployment']:,}", file=sys.stderr)

    out = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "ACS S2401 county data aggregated via Census 2023 CBSA delineation",
        "methodology": (
            "For each CBSA (metro or micro), the constituent counties' "
            "weighted-net-risk100 from county-risk.json is employment-weighted "
            "to produce a CBSA-level risk score. Top-5 occupation groups pool "
            "the constituent counties' topGroups by slug. This is a uniform "
            "method across all 935 CBSAs but uses ACS major-group SOC "
            "granularity; for metros specifically, msa-summary.json provides "
            "a higher-fidelity OEWS-based view at detailed SOC level."
        ),
        "cbsaCount": len(out_cbsas),
        "metros": metros,
        "micros": micros,
        "cbsas": out_cbsas,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out))
    print(f"\nWrote {OUT_PATH} ({OUT_PATH.stat().st_size:,} bytes)", file=sys.stderr)


if __name__ == "__main__":
    main()
