#!/usr/bin/env python3
"""
Parse OpenAI Signals CSVs (CC BY 4.0, differential-privacy-protected
aggregated ChatGPT usage) and produce per-state JSON that the /map can
consume as a new metric: realized ChatGPT use intensity.

Source: src/data/openai-signals/*.csv
        (originally https://openai.com/signals/data downloads)

Output: src/data/risk/state-chatgpt-use.json
  {
    generatedAt, source, version,
    year: 2025,
    states: [
      { stateCode: "DC", stateName: "...", rank: 1, useIntensity: 1.0,
        topTopics: [{topic, share}, ...] },
      ...
    ]
  }

useIntensity is rank-normalized (0..1, 1 = most intense). The raw rank
itself is also exposed so callers can choose either.

Run: npm run build:openai-signals
"""
from __future__ import annotations

import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "src" / "data" / "openai-signals"
OUT = REPO / "src" / "data" / "risk" / "state-chatgpt-use.json"

RANK_CSV = SRC / "usa_share_of_messages_by_state_2025_rank.csv"
TOPIC_STATE_CSV = SRC / "usa_share_of_messages_by_topic_state_2025.csv"


def main() -> None:
    if not RANK_CSV.exists():
        raise SystemExit(f"missing {RANK_CSV}")

    state_rank: dict[str, dict] = {}
    with RANK_CSV.open() as f:
        for row in csv.DictReader(f):
            code = row["state_code"]
            state_rank[code] = {
                "stateCode": code,
                "stateName": row["state_name"],
                "rank": int(row["rank"]),
            }

    # Compute rank-normalized intensity (1 = highest rank = most ChatGPT use)
    n = len(state_rank)
    for s in state_rank.values():
        s["useIntensity"] = round((n - s["rank"] + 1) / n, 4)

    # Top 3 topics per state
    if TOPIC_STATE_CSV.exists():
        topic_by_state: dict[str, list[dict]] = {}
        with TOPIC_STATE_CSV.open() as f:
            for row in csv.DictReader(f):
                code = row["state_code"]
                topic_by_state.setdefault(code, []).append({
                    "topic": row["topic"],
                    "share": float(row["share_of_messages"]),
                })
        for code, topics in topic_by_state.items():
            topics.sort(key=lambda r: r["share"], reverse=True)
            if code in state_rank:
                state_rank[code]["topTopics"] = topics[:3]

    states_out = sorted(state_rank.values(), key=lambda r: r["rank"])

    out = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "OpenAI Signals (CC BY 4.0)",
        "year": 2025,
        "version": "1.1",
        "stateCount": len(states_out),
        "states": states_out,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, indent=2))
    print(f"Wrote {OUT} ({OUT.stat().st_size:,} bytes) — {len(states_out)} states", file=sys.stderr)
    print("Top 5:", file=sys.stderr)
    for s in states_out[:5]:
        topics = ", ".join(t["topic"] for t in s.get("topTopics", []))
        print(f"  #{s['rank']} {s['stateCode']} {s['stateName']:<25} intensity={s['useIntensity']:.2f}  topics: {topics}", file=sys.stderr)


if __name__ == "__main__":
    main()
