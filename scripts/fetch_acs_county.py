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


OCC_RISK_PATH = REPO / "src" / "data" / "risk" / "occupation-risk.json"
MSA_OCC_PATH = REPO / "src" / "data" / "regional" / "msa-occupation-employment.json"
MSA_SUMMARY_PATH = REPO / "src" / "data" / "regional" / "msa-summary.json"
CROSSWALK_PATH = REPO / "src" / "data" / "regional" / "cbsa-county-crosswalk.json"
NONMETRO_PATH = REPO / "src" / "data" / "regional" / "nonmetro-by-state.json"


def load_msa_imputation_inputs():
    """Returns (county_to_cbsa, msa_summary_by_cbsa, msa_detail_by_cbsa,
                 nonmetro_by_state).

    For metro counties: scale the parent MSA's detailed-SOC distribution.
    For non-metro counties: scale the state's BOS (Balance of State)
    non-metro detailed-SOC distribution from BLS OEWS. Both are real
    data sources at detailed-SOC level — only the geographic crosswalk
    is approximated.
    """
    crosswalk = json.loads(CROSSWALK_PATH.read_text())
    county_to_cbsa: dict[str, str] = crosswalk.get("countyToCbsa", {})

    msa_summary = json.loads(MSA_SUMMARY_PATH.read_text())
    msa_summary_by_cbsa: dict[str, dict] = {a["cbsa"]: a for a in msa_summary["areas"]}

    msa_detail = json.loads(MSA_OCC_PATH.read_text())
    msa_detail_by_cbsa: dict[str, dict] = {a["cbsa"]: a for a in msa_detail["areas"]}

    nonmetro = json.loads(NONMETRO_PATH.read_text())
    nonmetro_by_state: dict[str, dict] = nonmetro.get("states", {})

    return county_to_cbsa, msa_summary_by_cbsa, msa_detail_by_cbsa, nonmetro_by_state


def impute_county_detailed_occupations(
    county_total: int,
    cbsa: str | None,
    state_fips: str,
    msa_summary_by_cbsa: dict,
    msa_detail_by_cbsa: dict,
    nonmetro_by_state: dict,
) -> tuple[list[dict] | None, str | None]:
    """Scale a parent-region's top detailed-SOC occupations down to the county.

    Path 1 (metro counties): scale by county / parent-MSA total.
        county_emp_for_soc = msa_emp_for_soc * (county_total / msa_total)

    Path 2 (non-metro counties): scale by county / parent-state's
        non-metro total from BLS OEWS BOS data.
        county_emp_for_soc = bos_emp_for_soc * (county_total / state_nonmetro_total)

    Returns (rows, sourceLabel) where sourceLabel describes the
    imputation basis for the UI."""
    if county_total <= 0:
        return None, None

    # Path 1: metro
    if cbsa:
        summ = msa_summary_by_cbsa.get(cbsa)
        detail = msa_detail_by_cbsa.get(cbsa)
        if summ and detail:
            msa_total = summ.get("totalEmployment") or 0
            if msa_total > 0:
                scale = county_total / msa_total
                out: list[dict] = []
                for o in detail.get("topOccupations", []):
                    msa_emp = o.get("employment") or 0
                    county_emp = round(msa_emp * scale)
                    if county_emp <= 0:
                        continue
                    out.append({
                        "slug": o["slug"],
                        "title": o["title"],
                        "category": o.get("category"),
                        "soc": o.get("soc"),
                        "msaShare": o.get("share"),
                        "estimatedEmployment": county_emp,
                        "estimatedShare": round(county_emp / county_total * 100, 2),
                        "netRisk100": o.get("netRisk100"),
                    })
                out.sort(key=lambda r: r["estimatedEmployment"], reverse=True)
                return out[:15], "metro"

    # Path 2: non-metro (state BOS)
    state = nonmetro_by_state.get(state_fips)
    if state:
        nonmetro_total = state.get("totalEmployment") or 0
        if nonmetro_total > 0:
            scale = county_total / nonmetro_total
            out2: list[dict] = []
            for o in state.get("topOccupations", []):
                state_emp = o.get("employment") or 0
                county_emp = round(state_emp * scale)
                if county_emp <= 0:
                    continue
                out2.append({
                    "slug": o["slug"],
                    "title": o["title"],
                    "category": o.get("category"),
                    "soc": o.get("soc"),
                    "msaShare": o.get("share"),
                    "estimatedEmployment": county_emp,
                    "estimatedShare": round(county_emp / county_total * 100, 2),
                    "netRisk100": o.get("netRisk100"),
                })
            out2.sort(key=lambda r: r["estimatedEmployment"], reverse=True)
            return out2[:15], "nonmetro-state"

    return None, None


def load_sector_archetype_mix() -> dict[str, dict]:
    """For each BLS major-group slug, the national archetype employment-share
    distribution. Used to derive a county's archetypeMix from its sector
    composition (since ACS doesn't give us per-county occupations)."""
    data = json.loads(OCC_RISK_PATH.read_text())
    by_cat: dict[str, dict] = {}
    for o in data["occupations"]:
        cat = o.get("category")
        if not cat:
            continue
        bucket = by_cat.setdefault(cat, {
            "automation-risk": 0.0,
            "reorganize": 0.0,
            "grow": 0.0,
            "less-change": 0.0,
            "total": 0.0,
        })
        arc = o.get("archetype", "less-change")
        jobs = o.get("jobs") or 0
        bucket[arc] = bucket.get(arc, 0.0) + jobs
        bucket["total"] += jobs
    out: dict[str, dict] = {}
    for cat, b in by_cat.items():
        t = b["total"] or 1
        out[cat] = {
            "automation-risk": b["automation-risk"] / t,
            "reorganize": b["reorganize"] / t,
            "grow": b["grow"] / t,
            "less-change": b["less-change"] / t,
        }
    return out


PRETTY_CATEGORY = {
    "office-and-administrative-support": "Office & Administrative Support",
    "business-and-financial": "Business & Financial Operations",
    "computer-and-information-technology": "Computer & IT",
    "math": "Mathematical",
    "architecture-and-engineering": "Architecture & Engineering",
    "life-physical-and-social-science": "Life, Physical & Social Science",
    "community-and-social-service": "Community & Social Service",
    "legal": "Legal",
    "education-training-and-library": "Education & Library",
    "arts-and-design": "Arts & Design",
    "media-and-communication": "Media & Communication",
    "entertainment-and-sports": "Entertainment & Sports",
    "healthcare": "Healthcare",
    "protective-service": "Protective Service",
    "food-preparation-and-serving": "Food Preparation & Serving",
    "building-and-grounds-cleaning": "Building & Grounds Cleaning",
    "personal-care-and-service": "Personal Care & Service",
    "sales": "Sales",
    "farming-fishing-and-forestry": "Farming, Fishing & Forestry",
    "construction-and-extraction": "Construction & Extraction",
    "installation-maintenance-and-repair": "Installation, Maintenance & Repair",
    "production": "Production",
    "transportation-and-material-moving": "Transportation & Material Moving",
    "management": "Management",
    "military": "Military",
}

ARCHETYPE_LABEL = {
    "automation-risk": "automation-pressure",
    "reorganize": "reorganization",
    "grow": "growth",
    "less-change": "stability",
}

ARCHETYPE_STORY = {
    "automation-risk": "automation pressure on routine cognitive work as AI handles more of what these jobs do day-to-day",
    "reorganize": "reorganization more than displacement — workers stay essential, but the task mix and staffing levels shift around AI",
    "grow": "expanding access and output as cheaper AI-assisted services unlock new demand",
    "less-change": "limited near-term disruption, with work tied to AI-resistant tasks",
}


def generate_narrative(region_label: str, net_risk_100: float,
                       archetype_mix: dict, top_sectors: list) -> str:
    dominant = max(archetype_mix.items(), key=lambda kv: kv[1])[0]
    top1 = top_sectors[0] if len(top_sectors) > 0 else None
    top2 = top_sectors[1] if len(top_sectors) > 1 else None
    r = round(net_risk_100)

    if r >= 54:
        lead = f"**{region_label}** sits at the higher end of AI labor pressure among US counties (score {r}/100)."
    elif r >= 52:
        lead = f"**{region_label}** tracks roughly average AI labor pressure for a US county ({r}/100)."
    else:
        lead = f"**{region_label}** sits below the average US county on AI labor pressure ({r}/100)."

    if top1 and top2:
        t1n = PRETTY_CATEGORY.get(top1["slug"], top1["slug"])
        t2n = PRETTY_CATEGORY.get(top2["slug"], top2["slug"])
        composition = f" Its workforce is concentrated in {t1n} ({top1['share']:.0f}% of jobs) and {t2n} ({top2['share']:.0f}%)."
    elif top1:
        t1n = PRETTY_CATEGORY.get(top1["slug"], top1["slug"])
        composition = f" Its largest cluster is {t1n} at {top1['share']:.0f}% of jobs."
    else:
        composition = ""

    story = f" The dominant story is {ARCHETYPE_LABEL[dominant]}: {ARCHETYPE_STORY[dominant]}."
    return lead + composition + story


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
    sector_arch_mix = load_sector_archetype_mix()
    county_to_cbsa, msa_summary_by_cbsa, msa_detail_by_cbsa, nonmetro_by_state = load_msa_imputation_inputs()
    print(f"Loaded sector risk for {len(sector_risk)} jobsdata slugs", file=sys.stderr)
    print(f"Loaded sector archetype mix for {len(sector_arch_mix)} slugs", file=sys.stderr)
    print(f"Loaded CBSA mapping for {len(county_to_cbsa)} counties + {len(msa_detail_by_cbsa)} MSA details + {len(nonmetro_by_state)} state nonmetro datasets", file=sys.stderr)

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

        # Archetype mix: for each sector slug in the county, blend by the
        # sector's national archetype distribution × county employment share.
        archetype_emp = {"automation-risk": 0.0, "reorganize": 0.0, "grow": 0.0, "less-change": 0.0}
        for slug, emp in slug_emp.items():
            dist = sector_arch_mix.get(slug)
            if not dist:
                continue
            for arc in archetype_emp:
                archetype_emp[arc] += emp * dist.get(arc, 0)
        arc_total = sum(archetype_emp.values()) or 1
        archetype_mix = {k: round(v / arc_total, 4) for k, v in archetype_emp.items()}

        top_sectors_for_narrative = groups[:3]
        narrative = generate_narrative(
            region_label=name,
            net_risk_100=risk100,
            archetype_mix=archetype_mix,
            top_sectors=top_sectors_for_narrative,
        )

        # Detailed-SOC imputation: metro counties from parent MSA OEWS;
        # non-metro counties from state BOS OEWS.
        cbsa_for_county = county_to_cbsa.get(fips)
        imputed_detailed, imputed_source = impute_county_detailed_occupations(
            county_total=total,
            cbsa=cbsa_for_county,
            state_fips=state_fips,
            msa_summary_by_cbsa=msa_summary_by_cbsa,
            msa_detail_by_cbsa=msa_detail_by_cbsa,
            nonmetro_by_state=nonmetro_by_state,
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
            "archetypeMix": archetype_mix,
            "narrative": narrative,
            "parentCbsa": cbsa_for_county,
            "imputedDetailedOccupations": imputed_detailed,
            "imputedDetailedSource": imputed_source,  # "metro" | "nonmetro-state" | None
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
    # to import inline in the /map page. Carries archetypeMix so the map's
    # "% at automation risk" colormode can render counties without lazy load.
    summary = {
        **meta,
        "counties": [
            {
                "fips": c["fips"],
                "name": c["name"],
                "stateFips": c["stateFips"],
                "totalEmployment": c["totalEmployment"],
                "weightedNetRisk100": c["weightedNetRisk100"],
                "archetypeMix": c["archetypeMix"],
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
