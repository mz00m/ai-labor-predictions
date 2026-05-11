#!/usr/bin/env python3
"""
Fetch ACS 5-year Subject Table S2401 — Occupation by Sex for the Civilian
Employed Population 16 Years and Over — at the COUNTY level for every US
county. ACS publishes occupation only at the SOC major-group level (~22
groups), which matches our sector taxonomy with minor lumping.

Source: Census ACS 5-year subject table S2401 (2023 vintage = 2019-2023).
        https://api.census.gov/data/2023/acs/acs5/subject

We lump our 25 jobsdata sector slugs to the 22 ACS leaf groups (or, equivalently,
split a single ACS group's employment proportionally across our slugs by their
sector-level employment weight). The output is a per-county occupation
distribution + a weighted county-level risk score.

No Census API key needed for one-off bulk requests like this; if rate-limited,
set CENSUS_API_KEY env var and add ?key= to the URL.

Output:
  src/data/regional/county-occupation-employment.json

Run: npm run build:acs-county
"""
from __future__ import annotations

import json
import os
import ssl
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

try:
    import certifi
    _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:  # pragma: no cover
    _SSL_CTX = None

REPO = Path(__file__).resolve().parent.parent
SECTOR_RISK_PATH = REPO / "src" / "data" / "risk" / "sector-risk.json"
OUT_DETAIL_PATH = REPO / "src" / "data" / "regional" / "county-occupation-employment.json"
OUT_SUMMARY_PATH = REPO / "src" / "data" / "risk" / "county-risk.json"

ACS_YEAR = 2023  # 2019-2023 5-year vintage
API_BASE = f"https://api.census.gov/data/{ACS_YEAR}/acs/acs5/subject"

# ACS leaf variables (S2401 C01 estimates) -> jobsdata sector slug(s).
# When a single ACS variable maps to multiple of our slugs, we split its
# employment proportionally to those slugs' relative employment shares
# (computed from sector-risk.json totalJobs). When two ACS variables map to
# the same slug, we sum them.
ACS_VARS: dict[str, list[str]] = {
    # ACS major group variables (leaf level)
    "S2401_C01_004E": ["management"],
    "S2401_C01_005E": ["business-and-financial"],
    # ACS combines computer + math; we split it across our two slugs
    "S2401_C01_007E": ["computer-and-information-technology", "math"],
    "S2401_C01_008E": ["architecture-and-engineering"],
    "S2401_C01_009E": ["life-physical-and-social-science"],
    "S2401_C01_011E": ["community-and-social-service"],
    "S2401_C01_012E": ["legal"],
    "S2401_C01_013E": ["education-training-and-library"],
    # ACS lumps arts/design/entertainment/sports/media; we split across 3 slugs
    "S2401_C01_014E": ["arts-and-design", "media-and-communication", "entertainment-and-sports"],
    # ACS splits healthcare into 2 practitioner rows + 1 support row; we lump
    "S2401_C01_016E": ["healthcare"],
    "S2401_C01_017E": ["healthcare"],
    "S2401_C01_019E": ["healthcare"],
    # Protective service: ACS splits, we lump
    "S2401_C01_021E": ["protective-service"],
    "S2401_C01_022E": ["protective-service"],
    "S2401_C01_023E": ["food-preparation-and-serving"],
    "S2401_C01_024E": ["building-and-grounds-cleaning"],
    "S2401_C01_025E": ["personal-care-and-service"],
    "S2401_C01_027E": ["sales"],
    "S2401_C01_028E": ["office-and-administrative-support"],
    "S2401_C01_030E": ["farming-fishing-and-forestry"],
    "S2401_C01_031E": ["construction-and-extraction"],
    "S2401_C01_032E": ["installation-maintenance-and-repair"],
    "S2401_C01_034E": ["production"],
    # Transportation + material moving both -> our one slug
    "S2401_C01_035E": ["transportation-and-material-moving"],
    "S2401_C01_036E": ["transportation-and-material-moving"],
}

TOTAL_VAR = "S2401_C01_001E"


def load_sector_risk() -> dict[str, dict]:
    data = json.loads(SECTOR_RISK_PATH.read_text())
    return {
        s["category"]: {
            "totalJobs": s.get("totalJobs", 0),
            "weightedNetRisk100": s.get("weightedNetRisk100", 0),
            "weightedNetRisk": s.get("weightedNetRisk", 0),
            "occupationCount": s.get("occupationCount", 0),
        }
        for s in data["sectors"]
    }


def lookup_risk_for_acs_var(acs_var: str, sector_risk: dict[str, dict]) -> float:
    """Effective risk100 for an ACS variable = employment-weighted average of
    the risk100 of the jobsdata sector slugs that ACS variable maps to."""
    slugs = ACS_VARS[acs_var]
    rows = [sector_risk[s] for s in slugs if s in sector_risk]
    if not rows:
        return 0.0
    total_w = sum(r["totalJobs"] for r in rows)
    if total_w == 0:
        return sum(r["weightedNetRisk100"] for r in rows) / len(rows)
    return sum(r["weightedNetRisk100"] * r["totalJobs"] for r in rows) / total_w


def fetch_counties() -> list[list[str]]:
    """Fetch all counties in one API call. Returns list of rows where the
    first row is the header and subsequent rows are county records."""
    var_list = [TOTAL_VAR] + list(ACS_VARS.keys())
    get = ",".join(["NAME"] + var_list)
    url = f"{API_BASE}?get={get}&for=county:*&in=state:*"
    key = os.environ.get("CENSUS_API_KEY")
    if key:
        url += f"&key={key}"

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh) jobsdata-ai-bot"},
    )
    print(f"GET {url[:120]}...", file=sys.stderr)
    with urllib.request.urlopen(req, timeout=180, context=_SSL_CTX) as r:
        return json.loads(r.read())


def main() -> None:
    sector_risk = load_sector_risk()
    print(f"Loaded sector risk for {len(sector_risk)} jobsdata slugs", file=sys.stderr)

    # Precompute effective risk100 per ACS variable
    acs_risk = {v: lookup_risk_for_acs_var(v, sector_risk) for v in ACS_VARS}

    rows = fetch_counties()
    header = rows[0]
    idx = {name: i for i, name in enumerate(header)}

    counties = []

    for row in rows[1:]:
        name = row[idx["NAME"]]
        state_fips = row[idx["state"]]
        county_fips = row[idx["county"]]
        fips = f"{state_fips}{county_fips}"

        total = _to_int(row[idx[TOTAL_VAR]])
        if not total:
            continue

        # Sum employment per jobsdata sector slug (after one-to-many splits)
        slug_emp: dict[str, float] = {}
        weighted = 0.0
        wsum = 0.0
        for acs_var in ACS_VARS:
            v = _to_int(row[idx[acs_var]]) or 0
            if v <= 0:
                continue
            slugs = ACS_VARS[acs_var]
            # When ACS var maps to multiple slugs, split employment by the
            # slugs' relative national-employment shares (preserves the total).
            if len(slugs) == 1:
                slug_emp[slugs[0]] = slug_emp.get(slugs[0], 0.0) + v
            else:
                weights = [sector_risk.get(s, {}).get("totalJobs", 0) for s in slugs]
                wsum_local = sum(weights)
                if wsum_local == 0:
                    share = 1 / len(slugs)
                    for s in slugs:
                        slug_emp[s] = slug_emp.get(s, 0.0) + v * share
                else:
                    for s, w in zip(slugs, weights):
                        slug_emp[s] = slug_emp.get(s, 0.0) + v * (w / wsum_local)
            weighted += v * acs_risk[acs_var]
            wsum += v

        if wsum == 0:
            continue
        risk100 = weighted / wsum

        # Build occupation distribution for this county
        groups = sorted(
            [
                {
                    "slug": slug,
                    "employment": round(emp),
                    "share": round(emp / total * 100, 2) if total else 0,
                    "netRisk100": int(sector_risk.get(slug, {}).get("weightedNetRisk100", 0)),
                }
                for slug, emp in slug_emp.items()
            ],
            key=lambda g: g["employment"],
            reverse=True,
        )

        counties.append({
            "fips": fips,
            "name": name,
            "stateFips": state_fips,
            "totalEmployment": total,
            "matchedEmployment": round(wsum),
            "coverage": round(wsum / total, 3) if total else 0,
            "weightedNetRisk100": round(risk100, 1),
            "occupationGroups": groups,
        })

    counties.sort(key=lambda r: r["weightedNetRisk100"], reverse=True)

    print(f"Counties processed: {len(counties)}", file=sys.stderr)
    print("Top 5 highest weighted netRisk100:", file=sys.stderr)
    for c in counties[:5]:
        print(f"  {c['fips']} {c['name']:<45} risk={c['weightedNetRisk100']}", file=sys.stderr)
    print("Bottom 5 lowest:", file=sys.stderr)
    for c in counties[-5:]:
        print(f"  {c['fips']} {c['name']:<45} risk={c['weightedNetRisk100']}", file=sys.stderr)

    meta = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "year": ACS_YEAR,
        "vintage": "ACS 5-year 2019-2023",
        "source": "Census ACS S2401 (Occupation by Sex)",
        "sourceUrl": API_BASE,
        "methodology": (
            "ACS publishes occupation only at the SOC major-group level (~22 ACS groups). "
            "We lump our 25 jobsdata sector slugs to match ACS leaves. Each county's "
            "weightedNetRisk100 is the employment-weighted average of the risk score of "
            "the ACS groups present, where each ACS group's risk is in turn the "
            "employment-weighted aggregate of the jobsdata sector slugs it covers."
        ),
        "countyCount": len(counties),
    }

    # Slim summary for the choropleth (no occupation arrays) — small enough
    # to import inline in the /map page.
    summary = {
        **meta,
        "counties": [
            {
                "fips": c["fips"],
                "name": c["name"],
                "stateFips": c["stateFips"],
                "totalEmployment": c["totalEmployment"],
                "weightedNetRisk100": c["weightedNetRisk100"],
                "topGroups": [
                    {"slug": g["slug"], "share": g["share"], "netRisk100": g["netRisk100"]}
                    for g in c["occupationGroups"][:3]
                ],
            }
            for c in counties
        ],
    }

    detail = {**meta, "counties": counties}

    OUT_SUMMARY_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_SUMMARY_PATH.write_text(json.dumps(summary))
    OUT_DETAIL_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_DETAIL_PATH.write_text(json.dumps(detail))
    print(f"Wrote {OUT_SUMMARY_PATH} ({OUT_SUMMARY_PATH.stat().st_size:,} bytes)", file=sys.stderr)
    print(f"Wrote {OUT_DETAIL_PATH} ({OUT_DETAIL_PATH.stat().st_size:,} bytes)", file=sys.stderr)


def _to_int(v) -> int | None:
    if v in (None, "", "*", "**", "-"):
        return None
    try:
        return int(v)
    except (TypeError, ValueError):
        try:
            return int(float(v))
        except (TypeError, ValueError):
            return None


if __name__ == "__main__":
    main()
