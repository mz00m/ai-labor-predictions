import type {
  PyPITaxonomy,
  MonthlyDownloadsData,
  SignalMetrics,
} from "./pypi-types";

import taxonomyData from "@/data/pypi/packages.json";
import downloadsData from "@/data/pypi/monthly_downloads.json";
import metricsData from "@/data/pypi/metrics.json";

const taxonomy = taxonomyData as unknown as PyPITaxonomy;
const downloads = downloadsData as unknown as MonthlyDownloadsData;
const metrics = metricsData as unknown as SignalMetrics;

export function getPyPITaxonomy(): PyPITaxonomy {
  return taxonomy;
}

export function getMonthlyDownloads(): MonthlyDownloadsData {
  return downloads;
}

export function getSignalMetrics(): SignalMetrics {
  return metrics;
}

export function getLastFetchDate(): string {
  return downloads.fetchedAt;
}
