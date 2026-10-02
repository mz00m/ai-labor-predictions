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

/**
 * Fallback: days after lastIngested at which a series counts as overdue when
 * `nextExpected` has no parseable date. Nominal cadence plus a short grace
 * period. The earlier thresholds (monthly 60d, quarterly 120d) let Challenger,
 * BFS and Ramp sit a full release behind without being flagged (Sep 2026).
 */
const OVERDUE_THRESHOLD_DAYS: Record<string, number> = {
  biweekly: 21,
  monthly: 42,
  quarterly: 105,
  semiannual: 200,
  annual: 380,
  biennial: 760,
  continuous: 120,
};

/** Days past the expected release date before a series is flagged. */
const RELEASE_GRACE_DAYS = 5;

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/**
 * Pull the first release date out of the free-text `nextExpected` field, e.g.
 * "September 4, 2026 (August data)", "2026-10-14", "Early November 2026",
 * "~September 2026". Month-only dates resolve to the 10th for "early", the
 * 20th for "mid", otherwise the last day of the month. Returns null when the
 * text has no date ("Continuous", "Rolling").
 */
export function parseNextExpected(text: string | undefined): Date | null {
  if (!text) return null;
  const iso = text.match(/\b(20\d\d)-(\d\d)-(\d\d)\b/);
  if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
  const lower = text.toLowerCase();
  const full = lower.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(20\d\d)\b/
  );
  if (full) return new Date(Date.UTC(+full[3], MONTHS.indexOf(full[1]), +full[2]));
  const month = lower.match(
    /\b(early|mid|late)?[\s-]*(january|february|march|april|may|june|july|august|september|october|november|december)\s+(20\d\d)\b/
  );
  if (month) {
    const y = +month[3];
    const m = MONTHS.indexOf(month[2]);
    const day =
      month[1] === "early" ? 10 : month[1] === "mid" ? 20 : new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return new Date(Date.UTC(y, m, day));
  }
  return null;
}

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
    // Prefer the registry's own expected release date. Ignore it when it is
    // not after the last ingest (stale text left over from a prior edition).
    const expected = parseNextExpected(s.nextExpected);
    const expectedUsable =
      expected !== null && expected.getTime() > new Date(lastDate).getTime();
    const due = expectedUsable
      ? now > expected!.getTime() + RELEASE_GRACE_DAYS * 86_400_000
      : ageDays >= threshold;
    if (!due) continue;

    const graphs = (s.targetGraphs ?? []).join(", ");
    // Rank by how far past cadence the series is, so the most neglected series
    // sort highest. Floored above the research-candidate band (~0.45 observed)
    // so a stale series is never crowded out by a fresh but unrelated paper.
    const overdueRatio = Math.max(1, ageDays / threshold);
    const priorityScore = Math.min(
      1,
      0.9 + 0.1 * Math.min(1, Math.log2(overdueRatio))
    );
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
      priorityScore,
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
