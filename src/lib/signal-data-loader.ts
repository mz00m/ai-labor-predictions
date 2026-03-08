import type {
  SignalTaxonomy,
  MonthlyDownloadsData,
  SignalMetrics,
  BLSEmploymentData,
  GitHubActivityData,
  StackOverflowActivityData,
  HuggingFaceData,
} from "./signal-types";

import taxonomyData from "@/data/signals/taxonomy.json";
import downloadsData from "@/data/signals/monthly_downloads.json";
import metricsData from "@/data/signals/metrics.json";
import blsData from "@/data/signals/bls_employment.json";
import githubData from "@/data/signals/github_activity.json";
import soData from "@/data/signals/stackoverflow_activity.json";
import hfData from "@/data/signals/huggingface_downloads.json";

const taxonomy = taxonomyData as unknown as SignalTaxonomy;
const downloads = downloadsData as unknown as MonthlyDownloadsData;
const metrics = metricsData as unknown as SignalMetrics;
const bls = blsData as unknown as BLSEmploymentData;
const github = githubData as unknown as GitHubActivityData;
const so = soData as unknown as StackOverflowActivityData;
const huggingface = hfData as unknown as HuggingFaceData;

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
