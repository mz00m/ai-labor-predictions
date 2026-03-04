import { MetricType } from "./types";

export interface MetricTypeConfig {
  type: MetricType;
  label: string;
  shortLabel: string;
  shape: "circle" | "diamond" | "square" | "triangle" | "star";
  color: string;
  description: string;
}

export const METRIC_TYPE_CONFIGS: MetricTypeConfig[] = [
  {
    type: "employment",
    label: "Employment Data",
    shortLabel: "Employment",
    shape: "circle",
    color: "#16a34a",
    description: "Government employment statistics (BLS, Census, OECD)",
  },
  {
    type: "postings",
    label: "Job Postings",
    shortLabel: "Postings",
    shape: "diamond",
    color: "#2563eb",
    description: "Job posting aggregators (Indeed, Lightcast, LinkedIn)",
  },
  {
    type: "survey",
    label: "Survey Data",
    shortLabel: "Survey",
    shape: "square",
    color: "#8b5cf6",
    description: "Industry and workforce surveys (Gartner, McKinsey, PwC)",
  },
  {
    type: "projection",
    label: "Model Projection",
    shortLabel: "Projection",
    shape: "triangle",
    color: "#ea580c",
    description: "Economic models and forecasts (Goldman, Acemoglu, WEF)",
  },
  {
    type: "corporate",
    label: "Corporate Report",
    shortLabel: "Corporate",
    shape: "star",
    color: "#0891b2",
    description: "SEC filings, earnings reports, corporate disclosures",
  },
];

export function getMetricTypeConfig(type: MetricType): MetricTypeConfig {
  const config = METRIC_TYPE_CONFIGS.find((c) => c.type === type);
  if (!config) {
    throw new Error(`Unknown metric type: ${type}`);
  }
  return config;
}
