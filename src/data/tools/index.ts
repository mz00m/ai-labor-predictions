/**
 * Office Automation Tools Knowledge Base — Index
 *
 * Central access point for the tools KB. Provides:
 * - Full catalog access
 * - Filtering by category, industry, company size, pricing
 * - Prompt-ready formatting for the assessment pipeline
 *
 * To add new tools: append entries to the relevant category file
 * (office.ts, administrative.ts, billing.ts, marketing.ts, customer-management.ts).
 */

import type { ToolEntry, ToolCategory, CompanySizeFit } from "./types";
import { TOOL_CATEGORY_META } from "./types";
import { OFFICE_TOOLS } from "./office";
import { ADMINISTRATIVE_TOOLS } from "./administrative";
import { BILLING_TOOLS } from "./billing";
import { MARKETING_TOOLS } from "./marketing";
import { CUSTOMER_MANAGEMENT_TOOLS } from "./customer-management";

// Re-export types
export type { ToolEntry, ToolCategory, CompanySizeFit } from "./types";
export { TOOL_CATEGORY_META } from "./types";

/** All tools across every category */
export const ALL_TOOLS: ToolEntry[] = [
  ...OFFICE_TOOLS,
  ...ADMINISTRATIVE_TOOLS,
  ...BILLING_TOOLS,
  ...MARKETING_TOOLS,
  ...CUSTOMER_MANAGEMENT_TOOLS,
];

/** Tools grouped by category */
export const TOOLS_BY_CATEGORY: Record<ToolCategory, ToolEntry[]> = {
  office: OFFICE_TOOLS,
  administrative: ADMINISTRATIVE_TOOLS,
  billing: BILLING_TOOLS,
  marketing: MARKETING_TOOLS,
  "customer-management": CUSTOMER_MANAGEMENT_TOOLS,
};

/** Look up a single tool by ID */
export function getToolById(id: string): ToolEntry | undefined {
  return ALL_TOOLS.find((t) => t.id === id);
}

/** Filter tools by industry relevance */
export function getToolsForIndustry(industry: string): ToolEntry[] {
  return ALL_TOOLS.filter(
    (t) => !t.relevantIndustries || t.relevantIndustries.includes(industry)
  );
}

/** Filter tools by company size fit */
export function getToolsForSize(size: CompanySizeFit): ToolEntry[] {
  return ALL_TOOLS.filter((t) => t.bestFor.includes(size));
}

/** Filter tools that are free or have a free tier */
export function getFreeTools(): ToolEntry[] {
  return ALL_TOOLS.filter(
    (t) => t.pricingModel === "free" || t.pricingModel === "freemium"
  );
}

/**
 * Map company size string (from assessment intake) to CompanySizeFit.
 */
function mapCompanySize(companySize: string): CompanySizeFit[] {
  switch (companySize) {
    case "1-10":
      return ["solo", "small"];
    case "11-50":
      return ["small"];
    case "51-200":
      return ["small", "mid"];
    case "201-500":
      return ["mid"];
    case "501-1000":
      return ["mid", "enterprise"];
    case "1001-5000":
    case "5001+":
      return ["enterprise"];
    default:
      return ["small", "mid"];
  }
}

/**
 * Get tools relevant to a specific assessment context.
 * Filters by industry + company size, sorted by relevance.
 */
export function getToolsForAssessment(
  industry: string,
  companySize: string
): ToolEntry[] {
  const sizes = mapCompanySize(companySize);

  return ALL_TOOLS.filter((t) => {
    const sizeMatch = t.bestFor.some((s) => sizes.includes(s));
    const industryMatch =
      !t.relevantIndustries || t.relevantIndustries.includes(industry);
    return sizeMatch && industryMatch;
  }).sort((a, b) => {
    // Prioritize: industry-specific > general, free/freemium > paid
    const aIndustryScore = a.relevantIndustries?.includes(industry) ? 1 : 0;
    const bIndustryScore = b.relevantIndustries?.includes(industry) ? 1 : 0;
    if (aIndustryScore !== bIndustryScore) return bIndustryScore - aIndustryScore;

    const pricingOrder: Record<string, number> = {
      free: 0,
      freemium: 1,
      "free-trial": 2,
      "usage-based": 3,
      "per-seat": 4,
      paid: 5,
    };
    return (pricingOrder[a.pricingModel] ?? 5) - (pricingOrder[b.pricingModel] ?? 5);
  });
}

/**
 * Format the tools KB as a prompt-ready string for the assessment pipeline.
 * Compact format designed to inform Claude's tool recommendations with
 * real product data without consuming excessive tokens.
 */
export function formatToolsForPrompt(
  industry: string,
  companySize: string
): string {
  const tools = getToolsForAssessment(industry, companySize);

  if (tools.length === 0) {
    return "";
  }

  const lines: string[] = [
    "## Office Automation Tools Reference",
    `Tools filtered for: ${industry}, ${companySize} employees`,
    "",
  ];

  // Group by category for readability
  const grouped = new Map<ToolCategory, ToolEntry[]>();
  for (const tool of tools) {
    const list = grouped.get(tool.category) || [];
    list.push(tool);
    grouped.set(tool.category, list);
  }

  for (const [category, categoryTools] of grouped) {
    const meta = TOOL_CATEGORY_META[category];
    lines.push(`### ${meta.label}`);

    for (const t of categoryTools) {
      lines.push(
        `- **${t.name}** (${t.subcategory}) — ${t.pricingDetails}`
      );
      lines.push(`  ${t.description}`);
      lines.push(
        `  Automates: ${t.automationCapabilities.slice(0, 3).join("; ")}`
      );
      if (t.limitations && t.limitations.length > 0) {
        lines.push(`  Note: ${t.limitations[0]}`);
      }
    }

    lines.push("");
  }

  lines.push(
    "When recommending tools, reference specific products from this list where relevant.",
    "Include both the product name and general category so users can evaluate alternatives.",
    "Prioritize free and freemium options for solo workers and very small teams."
  );

  return lines.join("\n");
}

/** Quick stats for the KB */
export function getToolsStats(): {
  total: number;
  byCategory: Record<string, number>;
  freeCount: number;
} {
  return {
    total: ALL_TOOLS.length,
    byCategory: Object.fromEntries(
      Object.entries(TOOLS_BY_CATEGORY).map(([k, v]) => [k, v.length])
    ),
    freeCount: getFreeTools().length,
  };
}
