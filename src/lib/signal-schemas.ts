import { z } from "zod";

// --- Taxonomy ---

const BLSSeriesConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const IndustryConfigSchema = z.object({
  label: z.string(),
  icon: z.string(),
  color: z.string(),
  explainer: z.string(),
  blsSeries: z.array(BLSSeriesConfigSchema),
});

const PackageConfigSchema = z.object({
  name: z.string(),
  source: z.enum(["pypi", "npm"]),
  tier: z.enum(["tier1", "tier2"]),
  industries: z.array(z.string()),
  label: z.string(),
  npmName: z.string().optional(),
  githubRepo: z.string().optional(),
  stackOverflowTag: z.string().optional(),
});

export const SignalTaxonomySchema = z.object({
  schemaVersion: z.number(),
  industries: z.record(z.string(), IndustryConfigSchema),
  packages: z.array(PackageConfigSchema),
});

// --- Downloads ---

const MonthlyDownloadPointSchema = z.object({
  month: z.string(),
  downloads: z.number(),
});

const PackageTimeSeriesSchema = z.object({
  package: z.string(),
  source: z.enum(["pypi", "npm"]),
  data: z.array(MonthlyDownloadPointSchema),
});

export const MonthlyDownloadsDataSchema = z.object({
  fetchedAt: z.string(),
  packages: z.array(PackageTimeSeriesSchema),
});

// --- BLS ---

const BLSDataPointSchema = z.object({
  month: z.string(),
  value: z.number(),
});

const BLSSeriesDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string(),
  data: z.array(BLSDataPointSchema),
});

export const BLSEmploymentDataSchema = z.object({
  fetchedAt: z.string(),
  series: z.array(BLSSeriesDataSchema),
});

// --- GitHub ---

const WeeklyCommitPointSchema = z.object({
  week: z.string(),
  commits: z.number(),
});

const MonthlyIssuePointSchema = z.object({
  month: z.string(),
  issues: z.number(),
});

const MonthlyStarPointSchema = z.object({
  month: z.string(),
  stars: z.number(),
});

const GitHubRepoDataSchema = z.object({
  repo: z.string(),
  packages: z.array(z.string()),
  totalStars: z.number(),
  forks: z.number().optional(),
  openIssues: z.number().optional(),
  weeklyCommits: z.array(WeeklyCommitPointSchema).optional(),
  monthlyStars: z.array(MonthlyStarPointSchema).optional(),
  monthlyIssues: z.array(MonthlyIssuePointSchema).optional(),
});

export const GitHubActivityDataSchema = z.object({
  fetchedAt: z.string(),
  repos: z.array(GitHubRepoDataSchema),
});

// --- StackOverflow ---

const MonthlyQuestionPointSchema = z.object({
  month: z.string(),
  questions: z.number(),
});

const SOTagDataSchema = z.object({
  tag: z.string(),
  packages: z.array(z.string()),
  monthlyQuestions: z.array(MonthlyQuestionPointSchema),
});

export const StackOverflowActivityDataSchema = z.object({
  fetchedAt: z.string(),
  tags: z.array(SOTagDataSchema),
});

// --- HuggingFace ---

const HFModelEntrySchema = z.object({
  id: z.string(),
  downloads: z.number(),
  likes: z.number(),
});

const HFCategorySchema = z.object({
  pipelineTag: z.string(),
  label: z.string(),
  industries: z.array(z.string()),
  totalDownloads: z.number(),
  totalLikes: z.number(),
  modelCount: z.number(),
  models: z.array(HFModelEntrySchema),
});

export const HuggingFaceDataSchema = z.object({
  fetchedAt: z.string(),
  categories: z.array(HFCategorySchema),
});

// --- Metrics ---

const PackageMetricsSchema = z.object({
  package: z.string(),
  source: z.enum(["pypi", "npm"]),
  tier: z.enum(["tier1", "tier2"]),
  industries: z.array(z.string()),
  label: z.string(),
  latestMonthlyDownloads: z.number(),
  momGrowth: z.number(),
  rollingAvg3mGrowth: z.number(),
  rollingAvg6mGrowth: z.number(),
  isSurging: z.boolean(),
  surgingReason: z.string().optional(),
  sparkline: z.array(z.number()),
  githubStars: z.number().nullable().optional(),
  githubStarGrowthMoM: z.number().nullable().optional(),
  githubMonthlyIssues: z.number().nullable().optional(),
  githubForks: z.number().nullable().optional(),
  githubOpenIssues: z.number().nullable().optional(),
  githubWeeklyCommits: z.number().nullable().optional(),
  soMonthlyQuestions: z.number().nullable().optional(),
  soQuestionGrowthMoM: z.number().nullable().optional(),
  signalQuality: z.enum(["strong", "moderate", "noisy"]).nullable().optional(),
});

const IndustryMetricsSchema = z.object({
  industry: z.string(),
  label: z.string(),
  color: z.string(),
  toolGrowth3m: z.number(),
  employmentChangeSinceNov2022: z.number().nullable(),
  employmentChangeYoY: z.number().nullable(),
  toolCount: z.number(),
  surgingCount: z.number(),
  packages: z.array(z.string()),
});

const AAITimeSeriesSchema = z.object({
  month: z.string(),
  aai: z.number(),
  tier2AvgGrowth: z.number(),
  tier1AvgGrowth: z.number(),
});

export const SignalMetricsSchema = z.object({
  calculatedAt: z.string(),
  currentAAI: z.number(),
  aaiTrend: z.enum(["accelerating", "stable", "decelerating"]),
  aaiHistory: z.array(AAITimeSeriesSchema),
  industries: z.array(IndustryMetricsSchema),
  packages: z.array(PackageMetricsSchema),
  surgingPackages: z.array(z.string()),
  totalToolCount: z.number(),
});
