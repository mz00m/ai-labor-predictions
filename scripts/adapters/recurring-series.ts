/**
 * Recurring Series Sweep — surfaces overdue recurring releases in the digest
 *
 * Reads src/data/recurring-sources.json (the registry that powers /data-sources)
 * and emits one RawItem per series whose last ingested date has aged past its
 * cadence threshold. These flow through digest scoring into the "items worth
 * watching" section, so the Monday digest PR flags stale series instead of
 * relying on ad-hoc manual freshness audits.
 *
 * Motivating incidents (July 2026): the BTOS biweekly wave was caught 79 days
 * late, FactSet Q1 2026 was 97 days late, and Census BFS had been stale for
 * 5 years — all three would have been flagged weekly by this sweep.
 *
 * No external fetches — pure registry read, cannot fail the pipeline.
 */

import fs from "fs";
import path from "path";
import type { RawItem } from "../types";

const REGISTRY_PATH = path.resolve(
  __dirname,
  "../../src/data/recurring-sources.json"
);

/** Days after lastIngested at which a series counts as overdue, by cadence. */
const OVERDUE_THRESHOLD_DAYS: Record<string, number> = {
  biweekly: 30,
  monthly: 60,
  quarterly: 120,
  annual: 400,
  biennial: 800,
  continuous: 120,
};

interface RecurringSeries {
  id: string;
  name: string;
  publisher: string;
  tier: number;
  cadence: string;
  url: string;
  targetGraphs?: string[];
  topicLine?: string;
  lastIngested?: { sourceId?: string; date?: string; value?: string };
  nextExpected?: string;
}

export async function fetchRecurringSeries(
  _query: string,
  _since: Date
): Promise<RawItem[]> {
  let registry: { series: RecurringSeries[] };
  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
  } catch (err) {
    console.warn(`[recurringSeries] could not read registry: ${err}`);
    return [];
  }

  const now = Date.now();
  const items: RawItem[] = [];

  for (const s of registry.series ?? []) {
    const lastDate = s.lastIngested?.date;
    if (!lastDate) continue;
    const threshold = OVERDUE_THRESHOLD_DAYS[s.cadence] ?? 120;
    const ageDays = Math.floor(
      (now - new Date(lastDate).getTime()) / 86_400_000
    );
    if (ageDays < threshold) continue;

    const graphs = (s.targetGraphs ?? []).join(", ");
    items.push({
      title: `SERIES DUE: ${s.name} — last ingested ${lastDate} (${ageDays}d ago, ${s.cadence} cadence)`,
      url: s.url,
      abstract:
        `Recurring release tracked on /data-sources is overdue for a fresh ingest. ` +
        `${s.topicLine ?? ""} Publisher: ${s.publisher} (Tier ${s.tier}). ` +
        `Feeds: ${graphs || "n/a"}. Next expected: ${s.nextExpected ?? "unknown"}. ` +
        `Check the source for a newer wave/edition and ingest if available.`,
      authors: [s.publisher],
      publishedAt: new Date(lastDate),
      citationCount: 0,
      source: "recurringSeries",
    });
  }

  if (items.length > 0) {
    console.log(
      `[recurringSeries] ${items.length} overdue series flagged: ${items
        .map((i) => i.title.split("—")[0].replace("SERIES DUE: ", "").trim())
        .join("; ")}`
    );
  }
  return items;
}
