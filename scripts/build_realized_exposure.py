#!/usr/bin/env python3
"""
Compute per-occupation realized AI exposure from OpenAI Signals IWA data.

Inputs:
  src/data/openai-signals/usa_share_of_work_related_messages_by_onet_iwa_month.csv
      (165 IWAs * 21 months, share of work-related ChatGPT messages)
  src/data/enriched-occupations.json (342 occupations, each with O*NET tasks
      named at the Generalized Work Activity level + importance)

Method:
  1. Aggregate IWA shares to GWA level. Each IWA code is "<gwa>.Inn" so the
     GWA element ID is everything before ".I". Sum IWA shares within each
     GWA to get the GWA's total share of work-related messages.
  2. Use the latest available month (2026-03).
  3. For each occupation, weight its task GWAs by O*NET importance, then
     dot-product with the GWA signal shares.
  4. Normalize to 0-100 across the 342 occupations (max observed -> 100).

This is the paper's "realized exposure" concept — what AI is actually being
used for vs. what it could theoretically be used for. Gap between this and
theoretical exposure = the capability overhang.

Output: src/data/risk/occupation-realized-exposure.json

Run: npm run build:realized-exposure
"""
from __future__ import annotations

import csv
import json
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SIGNALS_CSV = REPO / "src" / "data" / "openai-signals" / "usa_share_of_work_related_messages_by_onet_iwa_month.csv"
ENRICHED_PATH = REPO / "src" / "data" / "enriched-occupations.json"
OCC_RISK_PATH = REPO / "src" / "data" / "risk" / "occupation-risk.json"
OUT_PATH = REPO / "src" / "data" / "risk" / "occupation-realized-exposure.json"

# O*NET 27.x Generalized Work Activities element_id -> canonical name.
# Stable across O*NET versions; sourced from the public content model.
GWA_NAME_BY_ID: dict[str, str] = {
    "4.A.1.a.1": "Getting Information",
    "4.A.1.a.2": "Monitoring Processes, Materials, or Surroundings",
    "4.A.1.b.1": "Identifying Objects, Actions, and Events",
    "4.A.1.b.2": "Inspecting Equipment, Structures, or Materials",
    "4.A.1.b.3": "Estimating the Quantifiable Characteristics of Products, Events, or Information",
    "4.A.2.a.1": "Judging the Qualities of Objects, Services, or People",
    "4.A.2.a.2": "Processing Information",
    "4.A.2.a.3": "Evaluating Information to Determine Compliance with Standards",
    "4.A.2.a.4": "Analyzing Data or Information",
    "4.A.2.b.1": "Making Decisions and Solving Problems",
    "4.A.2.b.2": "Thinking Creatively",
    "4.A.2.b.3": "Updating and Using Relevant Knowledge",
    "4.A.2.b.4": "Developing Objectives and Strategies",
    "4.A.2.b.5": "Scheduling Work and Activities",
    "4.A.2.b.6": "Organizing, Planning, and Prioritizing Work",
    "4.A.3.a.1": "Performing General Physical Activities",
    "4.A.3.a.2": "Handling and Moving Objects",
    "4.A.3.a.3": "Controlling Machines and Processes",
    "4.A.3.a.4": "Operating Vehicles, Mechanized Devices, or Equipment",
    "4.A.3.b.1": "Working with Computers",  # also called "Interacting With Computers"
    "4.A.3.b.2": "Drafting, Laying Out, and Specifying Technical Devices, Parts, and Equipment",
    "4.A.3.b.4": "Repairing and Maintaining Mechanical Equipment",
    "4.A.3.b.5": "Repairing and Maintaining Electronic Equipment",
    "4.A.3.b.6": "Documenting/Recording Information",
    "4.A.4.a.1": "Interpreting the Meaning of Information for Others",
    "4.A.4.a.2": "Communicating with Supervisors, Peers, or Subordinates",
    "4.A.4.a.3": "Communicating with People Outside the Organization",
    "4.A.4.a.4": "Establishing and Maintaining Interpersonal Relationships",
    "4.A.4.a.5": "Assisting and Caring for Others",
    "4.A.4.a.6": "Selling or Influencing Others",
    "4.A.4.a.7": "Resolving Conflicts and Negotiating with Others",
    "4.A.4.a.8": "Performing for or Working Directly with the Public",
    "4.A.4.b.1": "Coordinating the Work and Activities of Others",
    "4.A.4.b.2": "Developing and Building Teams",
    "4.A.4.b.3": "Training and Teaching Others",
    "4.A.4.b.4": "Guiding, Directing, and Motivating Subordinates",
    "4.A.4.b.5": "Coaching and Developing Others",
    "4.A.4.b.6": "Provide Consultation and Advice to Others",
    "4.A.4.c.1": "Performing Administrative Activities",
    "4.A.4.c.2": "Staffing Organizational Units",
    "4.A.4.c.3": "Monitoring and Controlling Resources",
}

# Normalize task names (lowercased, alnum) -> GWA element ID
def _norm(name: str) -> str:
    return "".join(c.lower() for c in name if c.isalnum())

GWA_ID_BY_NAME_NORM: dict[str, str] = {_norm(name): eid for eid, name in GWA_NAME_BY_ID.items()}
# Hand-added aliases for the few task names that don't match the canonical O*NET label exactly
GWA_ID_BY_NAME_NORM.setdefault(_norm("Interacting With Computers"), "4.A.3.b.1")
GWA_ID_BY_NAME_NORM.setdefault(_norm("Operating Vehicles or Mechanized Devices"), "4.A.3.a.4")
GWA_ID_BY_NAME_NORM.setdefault(_norm("Providing Consultation and Advice to Others"), "4.A.4.b.6")


def main() -> None:
    # 1) Aggregate IWA shares to GWA shares for the latest month
    monthly: dict[str, dict[str, float]] = defaultdict(dict)
    with SIGNALS_CSV.open() as f:
        for row in csv.DictReader(f):
            month = row["month"]
            iwa = row["iwa_cleaned"]
            share = float(row["share_of_messages"])
            gwa = iwa.rsplit(".I", 1)[0]
            monthly[month][gwa] = monthly[month].get(gwa, 0.0) + share

    latest_month = max(monthly.keys())
    gwa_share = monthly[latest_month]
    print(f"Latest month: {latest_month}  GWAs covered: {len(gwa_share)}", file=sys.stderr)

    # 2) Per-occupation realized exposure: weighted average of GWA shares by task importance
    enriched = json.loads(ENRICHED_PATH.read_text())
    rows: list[dict] = []
    unmatched_tasks: set[str] = set()
    for occ in enriched["occupations"]:
        total_imp = 0.0
        weighted_share = 0.0
        for t in occ.get("tasks", []) or []:
            imp = float(t.get("importance") or 0)
            if imp <= 0:
                continue
            gwa_id = GWA_ID_BY_NAME_NORM.get(_norm(t["name"]))
            if not gwa_id:
                unmatched_tasks.add(t["name"])
                continue
            share = gwa_share.get(gwa_id, 0.0)
            total_imp += imp
            weighted_share += imp * share
        if total_imp <= 0:
            continue
        realized = weighted_share / total_imp
        rows.append({"slug": occ["slug"], "title": occ["title"], "realized_raw": realized})

    if unmatched_tasks:
        print(f"Unmatched task names ({len(unmatched_tasks)}):", file=sys.stderr)
        for name in sorted(unmatched_tasks):
            print(f"  - {name}", file=sys.stderr)

    # 3) Normalize raw realized exposure to 0-100 across the 342 occupations
    max_raw = max((r["realized_raw"] for r in rows), default=0.001)
    for r in rows:
        r["realizedExposure100"] = round((r["realized_raw"] / max_raw) * 100, 1)
        del r["realized_raw"]

    # 4) Join with occupation-risk to compute the capability overhang gap
    occ_risk = json.loads(OCC_RISK_PATH.read_text())
    risk_by_slug = {o["slug"]: o for o in occ_risk["occupations"]}
    for r in rows:
        ro = risk_by_slug.get(r["slug"])
        theo = (ro or {}).get("technicalExposure")
        if isinstance(theo, (int, float)):
            theo100 = float(theo) * 10
            r["theoreticalExposure100"] = round(theo100, 1)
            r["capabilityOverhang"] = round(theo100 - r["realizedExposure100"], 1)

    # Sample print: top realized + top capability-overhang
    rows_sorted = sorted(rows, key=lambda r: r["realizedExposure100"], reverse=True)
    print("\nTop 10 by realized exposure:", file=sys.stderr)
    for r in rows_sorted[:10]:
        gap = r.get("capabilityOverhang", "—")
        theo = r.get("theoreticalExposure100", "—")
        print(f"  realized={r['realizedExposure100']:>5}  theo={theo:>5}  gap={gap:>5}  {r['title']}", file=sys.stderr)

    print("\nLargest capability overhangs (high theoretical, low realized):", file=sys.stderr)
    with_gap = [r for r in rows if "capabilityOverhang" in r]
    with_gap.sort(key=lambda r: r["capabilityOverhang"], reverse=True)
    for r in with_gap[:10]:
        print(f"  gap={r['capabilityOverhang']:>5}  theo={r['theoreticalExposure100']:>5}  realized={r['realizedExposure100']:>5}  {r['title']}", file=sys.stderr)

    out = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "OpenAI Signals (CC BY 4.0) usa_share_of_work_related_messages_by_onet_iwa_month",
        "version": "1.1",
        "monthUsed": latest_month,
        "method": (
            "IWA shares rolled up to 41 O*NET Generalized Work Activities by stripping "
            "the IWA suffix from each code. Per-occupation realized exposure is the "
            "importance-weighted average of GWA shares across the occupation's tasks, "
            "normalized 0-100 across the 342-occupation set. Capability overhang = "
            "theoretical exposure (0-100) minus realized exposure (0-100), in the "
            "spirit of OpenAI Jobs Transition Framework Fig. 5."
        ),
        "occupationCount": len(rows),
        "occupations": rows,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, indent=2))
    print(f"\nWrote {OUT_PATH} ({OUT_PATH.stat().st_size:,} bytes)", file=sys.stderr)


if __name__ == "__main__":
    main()
