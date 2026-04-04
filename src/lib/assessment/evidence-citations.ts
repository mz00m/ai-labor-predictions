/**
 * Evidence Citations for Assessment Pipeline
 *
 * Pulls industry-specific research citations from confirmed-sources.json
 * and prediction files so assessment reports reference actual studies.
 *
 * Uses ES module import (not fs.readFileSync) so it works on Vercel serverless.
 */

import confirmedSourcesDB from "@/data/confirmed-sources.json";
import type { IndustryCategory } from "./types";

interface ConfirmedSource {
  id: string;
  title: string;
  url: string;
  publisher: string;
  evidenceTier: number;
  datePublished: string;
  excerpt?: string;
  usedIn: string[];
  verified: boolean;
}

// Map assessment industries to relevant prediction graph slugs for citation lookup
const INDUSTRY_CITATION_GRAPHS: Record<string, string[]> = {
  "nonprofit": ["overall-us-displacement", "white-collar-professional-displacement", "ai-adoption-rate", "genai-work-adoption"],
  "restaurant-hospitality": ["overall-us-displacement", "customer-service-automation", "entry-level-wage-impact"],
  "manufacturing": ["overall-us-displacement", "ai-adoption-rate", "median-wage-impact"],
  "healthcare": ["healthcare-admin-displacement", "overall-us-displacement", "ai-adoption-rate", "workforce-ai-exposure"],
  "retail": ["overall-us-displacement", "customer-service-automation", "entry-level-wage-impact", "ai-adoption-rate"],
  "professional-services": ["white-collar-professional-displacement", "high-skill-wage-premium", "ai-adoption-rate", "genai-work-adoption"],
  "accounting-finance": ["financial-services-displacement", "white-collar-professional-displacement", "high-skill-wage-premium", "ai-adoption-rate"],
  "legal": ["white-collar-professional-displacement", "high-skill-wage-premium", "ai-adoption-rate", "workforce-ai-exposure"],
  "education": ["education-sector-displacement", "overall-us-displacement", "ai-adoption-rate", "genai-work-adoption"],
  "construction": ["overall-us-displacement", "ai-adoption-rate", "median-wage-impact"],
  "real-estate": ["overall-us-displacement", "white-collar-professional-displacement", "ai-adoption-rate"],
  "technology": ["tech-sector-displacement", "high-skill-wage-premium", "ai-adoption-rate", "genai-work-adoption", "earnings-call-ai-mentions"],
  "media-marketing": ["creative-industry-displacement", "freelancer-rate-impact", "ai-adoption-rate", "genai-work-adoption"],
  "logistics-transportation": ["overall-us-displacement", "ai-adoption-rate", "workforce-ai-exposure"],
  "agriculture": ["overall-us-displacement", "ai-adoption-rate"],
  "government": ["overall-us-displacement", "white-collar-professional-displacement", "ai-adoption-rate", "workforce-ai-exposure"],
  "other": ["overall-us-displacement", "ai-adoption-rate", "genai-work-adoption", "median-wage-impact"],
};

/**
 * Get the most relevant, high-quality citations for a given industry.
 * Prioritizes Tier 1 sources, recent publications, and sources with excerpts.
 */
function getIndustryCitations(industry: IndustryCategory): ConfirmedSource[] {
  const db = confirmedSourcesDB as { sources?: Record<string, ConfirmedSource> };
  if (!db?.sources) return [];

  const relevantGraphs = new Set(
    INDUSTRY_CITATION_GRAPHS[industry] || INDUSTRY_CITATION_GRAPHS["other"]
  );

  // Find sources that are used in relevant graphs
  const relevantSources: ConfirmedSource[] = [];
  for (const source of Object.values(db.sources)) {
    if (!source.verified) continue;
    const isRelevant = source.usedIn.some((graph) => relevantGraphs.has(graph));
    if (isRelevant && source.excerpt) {
      relevantSources.push(source);
    }
  }

  // Sort by: tier (lower = better), then date (newer = better)
  relevantSources.sort((a, b) => {
    if (a.evidenceTier !== b.evidenceTier) return a.evidenceTier - b.evidenceTier;
    return b.datePublished.localeCompare(a.datePublished);
  });

  // Return top 8 most relevant citations (reduced from 12)
  return relevantSources.slice(0, 8);
}

/**
 * Format evidence citations as a prompt section for the assessment pipeline.
 * Gives Claude real research citations to reference in the report.
 */
export function formatEvidenceCitationsForPrompt(industry: IndustryCategory): string {
  const citations = getIndustryCitations(industry);

  if (citations.length === 0) {
    return "";
  }

  const tierLabels: Record<number, string> = {
    1: "Peer-Reviewed/Government",
    2: "Institutional Analysis",
    3: "Journalism",
  };

  const lines: string[] = [
    "## Evidence Base (Real Research Citations)",
    "These are REAL, VERIFIED sources from the jobsdata.ai research database.",
    "Reference these by publisher name and finding when supporting claims.",
    "",
  ];

  for (const source of citations) {
    const tierLabel = tierLabels[source.evidenceTier] || `Tier ${source.evidenceTier}`;
    lines.push(`- **${source.publisher}** (${source.datePublished}, ${tierLabel})`);
    lines.push(`  "${source.title}"`);
    if (source.excerpt) {
      const excerpt = source.excerpt.length > 200
        ? source.excerpt.slice(0, 200) + "..."
        : source.excerpt;
      lines.push(`  Finding: ${excerpt}`);
    }
    lines.push("");
  }

  lines.push(
    "Use at least 2-3 citations in the executive summary and risk assessment."
  );

  return lines.join("\n");
}
