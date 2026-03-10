import blsData from "@/data/signals/bls_employment.json";
import taxonomy from "@/data/signals/taxonomy.json";

interface BlsSeries {
  id: string;
  name: string;
  industry: string;
  data: { month: string; value: number }[];
}

export interface BlsTrend {
  industry: string;
  label: string;
  /** % change over 3 months */
  m3: number | null;
  /** % change over 12 months */
  m12: number | null;
  /** % change over 36 months */
  m36: number | null;
  /** Most recent month in the data */
  asOf: string;
  /** Series names averaged */
  seriesNames: string[];
}

/**
 * Slug → industry mapping.
 * Maps each prediction slug to its most relevant BLS industry from taxonomy.
 */
const SLUG_TO_INDUSTRY: Record<string, string> = {
  // Displacement
  "tech-sector-displacement": "software_it",
  "white-collar-professional-displacement": "office",
  "creative-industry-displacement": "creative",
  "education-sector-displacement": "education",
  "healthcare-admin-displacement": "healthcare",
  "customer-service-automation": "customer_service",
  // Wages
  "median-wage-impact": "manufacturing", // broad economy proxy
  "entry-level-wage-impact": "office",
  "geographic-wage-divergence": "software_it",
  "freelancer-rate-impact": "creative",
};

function computePercentChange(
  data: { month: string; value: number }[],
  monthsBack: number
): number | null {
  if (data.length < 2) return null;
  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month));
  const latest = sorted[sorted.length - 1];
  const targetIndex = sorted.length - 1 - monthsBack;
  if (targetIndex < 0) return null;
  const baseline = sorted[targetIndex];
  if (baseline.value === 0) return null;
  return ((latest.value - baseline.value) / baseline.value) * 100;
}

/**
 * Compute trend for a BLS industry by averaging across all its CES series.
 */
function computeIndustryTrend(industry: string): BlsTrend | null {
  const series = (blsData.series as BlsSeries[]).filter(
    (s) => s.industry === industry
  );
  if (series.length === 0) return null;

  const industryDef = (taxonomy.industries as Record<string, { label: string }>)[industry];
  if (!industryDef) return null;

  const changes3 = series.map((s) => computePercentChange(s.data, 3)).filter((v): v is number => v !== null);
  const changes12 = series.map((s) => computePercentChange(s.data, 12)).filter((v): v is number => v !== null);
  const changes36 = series.map((s) => computePercentChange(s.data, 36)).filter((v): v is number => v !== null);

  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

  // Find the most recent month across all series
  const allMonths = series.flatMap((s) => s.data.map((d) => d.month));
  const asOf = allMonths.sort().pop() || "";

  return {
    industry,
    label: industryDef.label,
    m3: avg(changes3),
    m12: avg(changes12),
    m36: avg(changes36),
    asOf,
    seriesNames: series.map((s) => s.name),
  };
}

// Cache computed trends
let trendsCache: Map<string, BlsTrend> | null = null;

function getTrendsMap(): Map<string, BlsTrend> {
  if (trendsCache) return trendsCache;
  trendsCache = new Map();
  for (const industry of Object.keys(taxonomy.industries)) {
    const trend = computeIndustryTrend(industry);
    if (trend) trendsCache.set(industry, trend);
  }
  return trendsCache;
}

/**
 * Get BLS employment trend for a prediction slug.
 * Returns null if no BLS mapping exists for this slug.
 */
export function getBlsTrendForSlug(slug: string): BlsTrend | null {
  const industry = SLUG_TO_INDUSTRY[slug];
  if (!industry) return null;
  return getTrendsMap().get(industry) || null;
}

/**
 * Get all available BLS trends keyed by prediction slug.
 */
export function getAllBlsTrends(): Record<string, BlsTrend> {
  const result: Record<string, BlsTrend> = {};
  for (const [slug, industry] of Object.entries(SLUG_TO_INDUSTRY)) {
    const trend = getTrendsMap().get(industry);
    if (trend) result[slug] = trend;
  }
  return result;
}
