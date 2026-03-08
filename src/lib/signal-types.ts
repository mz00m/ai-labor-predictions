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
  githubRepo?: string; // "owner/repo" format
  stackOverflowTag?: string; // exact SO tag name
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

// --- GitHub activity data ---

export interface MonthlyStarPoint {
  month: string;
  stars: number;
}

export interface MonthlyIssuePoint {
  month: string;
  issues: number;
}

export interface WeeklyCommitPoint {
  week: string; // "YYYY-MM-DD"
  commits: number;
}

export interface GitHubRepoData {
  repo: string;
  packages: string[];
  totalStars: number;
  forks: number;
  openIssues: number;
  weeklyCommits: WeeklyCommitPoint[];
  monthlyIssues: MonthlyIssuePoint[];
}

export interface GitHubActivityData {
  fetchedAt: string;
  repos: GitHubRepoData[];
}

// --- StackOverflow activity data ---

export interface MonthlyQuestionPoint {
  month: string;
  questions: number;
}

export interface SOTagData {
  tag: string;
  packages: string[];
  monthlyQuestions: MonthlyQuestionPoint[];
}

export interface StackOverflowActivityData {
  fetchedAt: string;
  tags: SOTagData[];
}

// --- HuggingFace model data ---

export interface HFModelEntry {
  id: string;
  downloads: number;
  likes: number;
}

export interface HFCategory {
  pipelineTag: string;
  label: string;
  industries: string[];
  totalDownloads: number;
  totalLikes: number;
  modelCount: number;
  models: HFModelEntry[];
}

export interface HuggingFaceData {
  fetchedAt: string;
  categories: HFCategory[];
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
  // GitHub community signals (null when no repo mapping)
  githubStars?: number | null;
  githubStarGrowthMoM?: number | null;
  githubMonthlyIssues?: number | null;
  githubForks?: number | null;
  githubOpenIssues?: number | null;
  githubWeeklyCommits?: number | null; // avg commits/week over last 4 weeks
  // StackOverflow signal (null when no tag mapping)
  soMonthlyQuestions?: number | null;
  soQuestionGrowthMoM?: number | null;
  // Signal quality: downloads-to-stars ratio (lower = stronger community signal)
  signalQuality?: "strong" | "moderate" | "noisy" | null;
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
