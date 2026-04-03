/**
 * Research Context Module for Assessment Pipeline
 *
 * Pulls relevant displacement, wage, and adoption statistics from the
 * prediction JSON files and formats them for injection into assessment prompts.
 * Gives Claude real research data to cite, not generic industry claims.
 */

import { getAllPredictions } from "@/lib/data-loader";
import type { Prediction, Source, HistoricalDataPoint } from "@/lib/types";
import type { IndustryCategory } from "./types";

// Map assessment industry categories to relevant prediction graph slugs
const INDUSTRY_GRAPH_MAP: Record<string, string[]> = {
  "nonprofit": [
    "overall-us-displacement",
    "white-collar-professional-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "genai-work-adoption",
  ],
  "restaurant-hospitality": [
    "overall-us-displacement",
    "customer-service-automation",
    "entry-level-wage-impact",
    "ai-adoption-rate",
    "freelancer-rate-impact",
  ],
  "manufacturing": [
    "overall-us-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "workforce-ai-exposure",
    "robots-physical-automation",
  ],
  "healthcare": [
    "healthcare-admin-displacement",
    "overall-us-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "workforce-ai-exposure",
  ],
  "retail": [
    "overall-us-displacement",
    "customer-service-automation",
    "entry-level-wage-impact",
    "ai-adoption-rate",
    "genai-work-adoption",
  ],
  "professional-services": [
    "white-collar-professional-displacement",
    "overall-us-displacement",
    "high-skill-wage-premium",
    "ai-adoption-rate",
    "genai-work-adoption",
    "earnings-call-ai-mentions",
  ],
  "accounting-finance": [
    "financial-services-displacement",
    "white-collar-professional-displacement",
    "high-skill-wage-premium",
    "ai-adoption-rate",
    "workforce-ai-exposure",
  ],
  "legal": [
    "white-collar-professional-displacement",
    "overall-us-displacement",
    "high-skill-wage-premium",
    "ai-adoption-rate",
    "workforce-ai-exposure",
  ],
  "education": [
    "education-sector-displacement",
    "overall-us-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "genai-work-adoption",
  ],
  "construction": [
    "overall-us-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "entry-level-wage-impact",
    "robots-physical-automation",
  ],
  "real-estate": [
    "overall-us-displacement",
    "white-collar-professional-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "genai-work-adoption",
  ],
  "technology": [
    "tech-sector-displacement",
    "overall-us-displacement",
    "high-skill-wage-premium",
    "ai-adoption-rate",
    "genai-work-adoption",
    "earnings-call-ai-mentions",
  ],
  "media-marketing": [
    "creative-industry-displacement",
    "overall-us-displacement",
    "freelancer-rate-impact",
    "ai-adoption-rate",
    "genai-work-adoption",
  ],
  "logistics-transportation": [
    "overall-us-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "workforce-ai-exposure",
    "robots-physical-automation",
  ],
  "agriculture": [
    "overall-us-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "robots-physical-automation",
  ],
  "government": [
    "overall-us-displacement",
    "white-collar-professional-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "workforce-ai-exposure",
  ],
  "other": [
    "overall-us-displacement",
    "median-wage-impact",
    "ai-adoption-rate",
    "genai-work-adoption",
    "workforce-ai-exposure",
  ],
};

interface ResearchStat {
  graphTitle: string;
  graphSlug: string;
  category: string;
  value: number;
  unit: string;
  confidenceLow?: number;
  confidenceHigh?: number;
  date: string;
  publisher: string;
  sourceTitle: string;
  evidenceTier: number;
  dataType?: string;
}

/**
 * Extract the most relevant research statistics for a given industry.
 * Returns the latest Tier 1-2 data points from each relevant graph.
 */
function getIndustryStats(industry: IndustryCategory): ResearchStat[] {
  const predictions = getAllPredictions();
  const relevantSlugs = INDUSTRY_GRAPH_MAP[industry] || INDUSTRY_GRAPH_MAP["other"];
  const stats: ResearchStat[] = [];

  for (const slug of relevantSlugs) {
    const pred = predictions.find((p) => p.slug === slug);
    if (!pred) continue;

    // Get the latest Tier 1-2 data points (most credible)
    const crediblePoints = pred.history
      .filter((dp) => dp.evidenceTier <= 2)
      .sort((a, b) => b.date.localeCompare(a.date));

    // Take the most recent data point
    const latest = crediblePoints[0];
    if (!latest) continue;

    // Find the source for this data point
    const sourceId = latest.sourceIds[0];
    const source = pred.sources.find((s) => s.id === sourceId);

    stats.push({
      graphTitle: pred.title,
      graphSlug: pred.slug,
      category: pred.category,
      value: latest.value,
      unit: pred.unit,
      confidenceLow: latest.confidenceLow,
      confidenceHigh: latest.confidenceHigh,
      date: latest.date,
      publisher: source?.publisher || "Research",
      sourceTitle: source?.title || "",
      evidenceTier: latest.evidenceTier,
      dataType: latest.dataType,
    });
  }

  return stats;
}

/**
 * Get key overlay signals (directional findings) relevant to an industry.
 * Returns recent Tier 1-2 overlays from relevant graphs.
 */
function getIndustrySignals(industry: IndustryCategory): string[] {
  const predictions = getAllPredictions();
  const relevantSlugs = INDUSTRY_GRAPH_MAP[industry] || INDUSTRY_GRAPH_MAP["other"];
  const signals: { label: string; date: string; tier: number }[] = [];

  for (const slug of relevantSlugs) {
    const pred = predictions.find((p) => p.slug === slug);
    if (!pred?.overlays) continue;

    const recentOverlays = pred.overlays
      .filter((o) => o.evidenceTier <= 2)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3); // Top 3 most recent per graph

    for (const overlay of recentOverlays) {
      signals.push({
        label: overlay.label,
        date: overlay.date,
        tier: overlay.evidenceTier,
      });
    }
  }

  // Sort by date descending, take top 10 overall
  return signals
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)
    .map((s) => `- ${s.label} (${s.date}, Tier ${s.tier})`);
}

/**
 * Format research context as a prompt section for the assessment pipeline.
 * This gives Claude real data points and signals to cite in the report.
 */
export function formatResearchContextForPrompt(industry: IndustryCategory): string {
  const stats = getIndustryStats(industry);
  const signals = getIndustrySignals(industry);

  if (stats.length === 0 && signals.length === 0) {
    return "";
  }

  const lines: string[] = [
    "## Research Data for This Industry",
    "USE THESE REAL STATISTICS in your analysis. Cite the publisher and finding when making claims about AI's impact.",
    "Do NOT fabricate statistics. Only reference numbers that appear below.",
    "",
  ];

  if (stats.length > 0) {
    lines.push("### Key Data Points (from jobsdata.ai research database)");
    for (const stat of stats) {
      const range =
        stat.confidenceLow !== undefined && stat.confidenceHigh !== undefined
          ? ` (range: ${stat.confidenceLow}–${stat.confidenceHigh})`
          : "";
      const type = stat.dataType === "observed" ? " [observed]" : " [projected]";
      lines.push(
        `- **${stat.graphTitle}**: ${stat.value}${stat.unit.startsWith("%") ? "" : " "}${stat.unit}${range}${type}`
      );
      lines.push(
        `  Source: ${stat.publisher} (${stat.date}, Tier ${stat.evidenceTier})`
      );
    }
    lines.push("");
  }

  if (signals.length > 0) {
    lines.push("### Recent Industry Signals (directional findings from research)");
    lines.push(...signals);
    lines.push("");
  }

  lines.push(
    "When writing the executive summary and risk assessment, ground your claims in these specific findings.",
    "Example: \"According to [Publisher], [specific finding]\" — not vague claims like \"studies show.\""
  );

  return lines.join("\n");
}
