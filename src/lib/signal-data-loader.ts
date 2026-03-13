import type {
  SignalTaxonomy,
  MonthlyDownloadsData,
  SignalMetrics,
  BLSEmploymentData,
  GitHubActivityData,
  StackOverflowActivityData,
  HuggingFaceData,
} from "./signal-types";
import {
  SignalTaxonomySchema,
  MonthlyDownloadsDataSchema,
  SignalMetricsSchema,
  BLSEmploymentDataSchema,
  GitHubActivityDataSchema,
  StackOverflowActivityDataSchema,
  HuggingFaceDataSchema,
} from "./signal-schemas";

import taxonomyData from "@/data/signals/taxonomy.json";
import downloadsData from "@/data/signals/monthly_downloads.json";
import metricsData from "@/data/signals/metrics.json";
import blsData from "@/data/signals/bls_employment.json";
import githubData from "@/data/signals/github_activity.json";
import soData from "@/data/signals/stackoverflow_activity.json";
import hfData from "@/data/signals/huggingface_downloads.json";

// Zod validates at runtime; cast to hand-written types for downstream compatibility
const taxonomy = SignalTaxonomySchema.parse(taxonomyData) as SignalTaxonomy;
const downloads = MonthlyDownloadsDataSchema.parse(downloadsData) as MonthlyDownloadsData;
const metrics = SignalMetricsSchema.parse(metricsData) as SignalMetrics;
const bls = BLSEmploymentDataSchema.parse(blsData) as BLSEmploymentData;
const github = GitHubActivityDataSchema.parse(githubData) as GitHubActivityData;
const so = StackOverflowActivityDataSchema.parse(soData) as StackOverflowActivityData;
const huggingface = HuggingFaceDataSchema.parse(hfData) as HuggingFaceData;

export function getSignalTaxonomy(): SignalTaxonomy {
  return taxonomy;
}

export function getMonthlyDownloads(): MonthlyDownloadsData {
  return downloads;
}

export function getSignalMetrics(): SignalMetrics {
  return metrics;
}

export function getBLSEmployment(): BLSEmploymentData {
  return bls;
}

export function getGitHubActivity(): GitHubActivityData {
  return github;
}

export function getStackOverflowActivity(): StackOverflowActivityData {
  return so;
}

export function getHuggingFaceData(): HuggingFaceData {
  return huggingface;
}

export function getLastFetchDate(): string {
  return downloads.fetchedAt;
}
