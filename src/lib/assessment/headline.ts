/**
 * Derives the single headline figure for an assessment report.
 *
 * The model already emits per-task estimates as ranges ("3-5 hrs/week"), so
 * the headline aggregates those rather than inventing a new number. It stays
 * a range for the reason the /assessment-review skill spells out: these are
 * LLM estimates over self-reported inputs, and a precise "11.5 hrs/week"
 * would assert more confidence than the method supports.
 *
 * The sum is an upper-ish bound — tasks overlap and nobody implements all of
 * them — so callers must display `qualifier` alongside the number.
 */

import type { AssessmentReport, TaskAnalysis } from "./types";

export interface Headline {
  low: number;
  high: number;
  unit: "hours a week";
  /** Tasks that yielded a weekly figure. */
  taskCount: number;
  /** Tasks analyzed in total, including ones with no weekly estimate. */
  totalTasks: number;
  qualifier: string;
  readinessScore: number;
}

const PERIOD_TO_WEEKLY: Record<string, number> = {
  day: 5,
  week: 1,
  wk: 1,
  month: 12 / 52,
  mo: 12 / 52,
  quarter: 4 / 52,
  qtr: 4 / 52,
  year: 1 / 52,
  yr: 1 / 52,
};

/**
 * Matches an explicit time-per-period estimate: a number (or range), a time
 * unit, and a recognized period, all adjacent.
 *
 * The adjacency requirement is the whole point. The model writes free text
 * here, and loose number-grabbing produced real nonsense in production data —
 * "Replaces $500-1,500 consultant review per proposal" became 500 hours a
 * week, and "4-6 hrs per advocacy cycle; more cycles completed per year"
 * got divided by 52 because the word "year" appeared 30 characters later.
 * Anything whose denominator is an episode rather than a period ("per
 * proposal", "per grant", "per board cycle") is deliberately unparseable:
 * without knowing how often the episode recurs, there is no honest weekly
 * number to derive.
 */
const ESTIMATE_RE = new RegExp(
  [
    /(\d+(?:\.\d+)?)/, // low
    /(?:\s*(?:[–—-]|to)\s*(\d+(?:\.\d+)?))?/, // optional high
    /\s*(hrs?|hours?|mins?|minutes?)/, // time unit
    /\s*(?:\/\s*|per\s+|a\s+)/, // separator
    /(day|week|wk|month|mo|quarter|qtr|year|yr)s?\b/, // period
  ]
    .map((r) => r.source)
    .join(""),
  "i"
);

/**
 * Parse strings like "3-5 hrs/week", "15–20 hrs/month", "45 min per day".
 * Returns weekly [low, high] hours, or null when the string has no
 * unambiguous time-per-period estimate.
 */
export function parseTimeSaved(raw: string | undefined): [number, number] | null {
  if (!raw) return null;

  const match = ESTIMATE_RE.exec(raw);
  if (!match) return null;

  const [, lowRaw, highRaw, unit, period] = match;

  let low = parseFloat(lowRaw);
  let high = highRaw ? parseFloat(highRaw) : low;
  if (high < low) [low, high] = [high, low];

  if (/^min/i.test(unit)) {
    low /= 60;
    high /= 60;
  }

  const factor = PERIOD_TO_WEEKLY[period.toLowerCase()];
  return [low * factor, high * factor];
}

function roundSensibly(n: number): number {
  if (n >= 20) return Math.round(n / 5) * 5;
  return Math.round(n);
}

export function computeHeadline(report: AssessmentReport): Headline | null {
  const tasks: TaskAnalysis[] = report.taskAnalysis ?? [];

  let low = 0;
  let high = 0;
  let counted = 0;

  for (const t of tasks) {
    const parsed = parseTimeSaved(t.estimatedTimeSaved);
    if (!parsed) continue;
    low += parsed[0];
    high += parsed[1];
    counted++;
  }

  if (counted === 0) return null;

  const roundedLow = roundSensibly(low);
  const roundedHigh = roundSensibly(high);

  const coverage =
    counted === tasks.length
      ? `all ${counted} task${counted === 1 ? "" : "s"} analyzed`
      : `${counted} of the ${tasks.length} tasks analyzed`;

  return {
    low: roundedLow,
    high: Math.max(roundedHigh, roundedLow + 1),
    unit: "hours a week",
    taskCount: counted,
    totalTasks: tasks.length,
    qualifier: `Combined estimate across ${coverage}. The rest are quality or capability gains rather than time savings. What you actually save depends on which ones you take on.`,
    readinessScore: report.organizationProfile?.aiReadinessScore ?? 0,
  };
}
