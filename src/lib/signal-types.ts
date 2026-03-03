// --- Industry taxonomy ---

export interface BLSSeriesConfig {
  id: string;
  name: string;
}

export interface IndustryConfig {
  label: string;
  icon: string;
  color: string;
  explainer: string;
  blsSeries: BLSSeriesConfig[];
}

export interface PackageConfig {
  name: string;
  source: "pypi" | "npm";
  tier: "tier1" | "tier2";
  industries: string[];
  label: string;
  npmName?: string; // for packages where npm name differs from our key
}

export interface SignalTaxonomy {
  schemaVersion: number;
  industries: Record<string, IndustryConfig>;
  packages: PackageConfig[];
}

// --- Time series data ---

export interface MonthlyDownloadPoint {
  month: string;
  downloads: number;
}

export interface PackageTimeSeries {
  package: string;
  source: "pypi" | "npm";
  data: MonthlyDownloadPoint[];
}

export interface MonthlyDownloadsData {
  fetchedAt: string;
  packages: PackageTimeSeries[];
}

// --- BLS employment data ---

export interface BLSDataPoint {
  month: string; // "2025-01"
  value: number; // employment in thousands
}

export interface BLSSeriesData {
  id: string;
  name: string;
  industry: string;
  data: BLSDataPoint[];
}

export interface BLSEmploymentData {
  fetchedAt: string;
  series: BLSSeriesData[];
}

// --- Calculated metrics ---

export interface PackageMetrics {
  package: string;
  source: "pypi" | "npm";
  tier: "tier1" | "tier2";
  industries: string[];
  label: string;
  latestMonthlyDownloads: number;
  momGrowth: number;
  rollingAvg3mGrowth: number;
  rollingAvg6mGrowth: number;
  isSurging: boolean;
  surgingReason?: string;
  sparkline: number[];
}

export interface IndustryMetrics {
  industry: string;
  label: string;
  color: string;
  toolGrowth3m: number; // avg 3-month rolling growth across tools
  employmentChangeSinceNov2022: number | null; // % change, null if no BLS data
  employmentChangeYoY: number | null; // year-over-year % change
  toolCount: number;
  surgingCount: number;
  packages: string[]; // package names in this industry
}

export interface AAITimeSeries {
  month: string;
  aai: number;
  tier2AvgGrowth: number;
  tier1AvgGrowth: number;
}

export interface SignalMetrics {
  calculatedAt: string;
  currentAAI: number;
  aaiTrend: "accelerating" | "stable" | "decelerating";
  aaiHistory: AAITimeSeries[];
  industries: IndustryMetrics[];
  packages: PackageMetrics[];
  surgingPackages: string[];
  totalToolCount: number;
}
