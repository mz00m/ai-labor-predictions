import type {
  SignalTaxonomy,
  MonthlyDownloadsData,
  SignalMetrics,
  BLSEmploymentData,
} from "./signal-types";

import taxonomyData from "@/data/signals/taxonomy.json";
import downloadsData from "@/data/signals/monthly_downloads.json";
import metricsData from "@/data/signals/metrics.json";
import blsData from "@/data/signals/bls_employment.json";

const taxonomy = taxonomyData as unknown as SignalTaxonomy;
const downloads = downloadsData as unknown as MonthlyDownloadsData;
const metrics = metricsData as unknown as SignalMetrics;
const bls = blsData as unknown as BLSEmploymentData;

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

export function getLastFetchDate(): string {
  return downloads.fetchedAt;
}
