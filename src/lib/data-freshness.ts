import recurringSources from "@/data/recurring-sources.json";
import { HistoricalDataPoint } from "@/lib/types";

// Per-chart data freshness. The site-wide "Updated [date]" reflects the last
// ingestion anywhere on the site; an individual chart can still be several
// release cycles behind the series that feed it. This module derives each
// chart's "data through" date and whether it is stale relative to the
// cadence of the recurring series that target it (recurring-sources.json).

const CADENCE_DAYS: Record<string, number> = {
  biweekly: 14,
  monthly: 31,
  quarterly: 92,
  semiannual: 183,
  annual: 366,
  biennial: 731,
};

interface RecurringSeries {
  id: string;
  cadence: string;
  targetGraphs: string[];
}

const series: RecurringSeries[] = (recurringSources.series as RecurringSeries[]) ?? [];

/** Shortest release cadence (days) among recurring series feeding this graph, or null if none tracked. */
export function cadenceDaysForSlug(slug: string): number | null {
  let min: number | null = null;
  for (const s of series) {
    if (!s.targetGraphs?.includes(slug)) continue;
    const days = CADENCE_DAYS[s.cadence];
    if (days && (min === null || days < min)) min = days;
  }
  return min;
}

export interface Freshness {
  /** ISO date of the newest history point */
  through: string | null;
  /** Newest point formatted for display, e.g. "May 2026" */
  throughLabel: string | null;
  /** True when the newest point is more than two cadence intervals behind today */
  stale: boolean;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getFreshness(slug: string, history: HistoricalDataPoint[]): Freshness {
  if (!history || history.length === 0) {
    return { through: null, throughLabel: null, stale: false };
  }
  // Only observed/measured points say how current the chart's evidence is; a
  // 2023 projection "for 2030" doesn't make a chart fresh. Fall back to all
  // points for charts that are purely projections.
  const observed = history.filter((h) => h.dataType === "observed");
  const pool = observed.length > 0 ? observed : history;
  const through = pool.reduce((m, h) => (h.date > m ? h.date : m), pool[0].date);

  const [y, m] = through.split("-");
  const throughLabel = `${MONTHS[parseInt(m, 10) - 1]} ${y}`;

  const cadence = cadenceDaysForSlug(slug);
  let stale = false;
  if (cadence !== null) {
    const ageDays = (Date.now() - new Date(through).getTime()) / 86400000;
    stale = ageDays > cadence * 2;
  }
  return { through, throughLabel, stale };
}
