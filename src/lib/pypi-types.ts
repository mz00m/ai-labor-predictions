// --- Package taxonomy ---

export interface PyPIPackageTier {
  label: string;
  description: string;
  color: string;
}

export interface PyPIDomain {
  label: string;
  color: string;
}

export interface PyPIPackageConfig {
  name: string;
  tier: "tier1" | "tier2" | "tier3";
  domain: string;
  description: string;
  occupationalSignal: string;
}

export interface PyPITaxonomy {
  schemaVersion: number;
  tiers: Record<string, PyPIPackageTier>;
  domains: Record<string, PyPIDomain>;
  packages: PyPIPackageConfig[];
}

// --- Time series data ---

export interface MonthlyDownloadPoint {
  month: string; // "2025-01"
  downloads: number;
}

export interface PackageTimeSeries {
  package: string;
  data: MonthlyDownloadPoint[];
}

export interface MonthlyDownloadsData {
  fetchedAt: string;
  packages: PackageTimeSeries[];
}

// --- Calculated metrics ---

export interface PackageMetrics {
  package: string;
  tier: "tier1" | "tier2" | "tier3";
  domain: string;
  latestMonthlyDownloads: number;
  momGrowth: number;
  rollingAvg3mGrowth: number;
  rollingAvg6mGrowth: number;
  isBreakout: boolean;
  breakoutReason?: string;
  sparkline: number[];
}

export interface DomainMetrics {
  domain: string;
  label: string;
  color: string;
  avgGrowth3m: number;
  avgGrowth6m: number;
  totalDownloads: number;
  packageCount: number;
  packages: string[];
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
  packages: PackageMetrics[];
  domains: DomainMetrics[];
  breakoutPackages: string[];
}
