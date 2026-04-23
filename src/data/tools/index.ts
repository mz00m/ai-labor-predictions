/**
 * Office Automation Tools Knowledge Base — Index
 *
 * Central access point for the tools KB. Provides:
 * - Full catalog access
 * - Filtering by category, industry, company size, pricing
 * - Prompt-ready formatting for the assessment pipeline
 *
 * To add new tools: append entries to the relevant category file.
 * 11 categories across office, operations, finance, marketing, sales,
 * customer management, data, HR, compliance, IT, and supply chain.
 */

import type { ToolEntry, ToolCategory, CompanySizeFit } from "./types";
import { TOOL_CATEGORY_META } from "./types";
import { OFFICE_TOOLS } from "./office";
import { ADMINISTRATIVE_TOOLS } from "./administrative";
import { BILLING_TOOLS } from "./billing";
import { MARKETING_TOOLS } from "./marketing";
import { CUSTOMER_MANAGEMENT_TOOLS } from "./customer-management";
import { DATA_ANALYTICS_TOOLS } from "./data-analytics";
import { HR_RECRUITING_TOOLS } from "./hr-recruiting";
import { COMPLIANCE_LEGAL_TOOLS } from "./compliance-legal";
import { SALES_ENABLEMENT_TOOLS } from "./sales-enablement";
import { IT_SECURITY_TOOLS } from "./it-security";
import { INVENTORY_SUPPLY_CHAIN_TOOLS } from "./inventory-supply-chain";

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
  ...DATA_ANALYTICS_TOOLS,
  ...HR_RECRUITING_TOOLS,
  ...COMPLIANCE_LEGAL_TOOLS,
  ...SALES_ENABLEMENT_TOOLS,
  ...IT_SECURITY_TOOLS,
  ...INVENTORY_SUPPLY_CHAIN_TOOLS,
];

/** Tools grouped by category */
export const TOOLS_BY_CATEGORY: Record<ToolCategory, ToolEntry[]> = {
  office: OFFICE_TOOLS,
  administrative: ADMINISTRATIVE_TOOLS,
  billing: BILLING_TOOLS,
  marketing: MARKETING_TOOLS,
  "customer-management": CUSTOMER_MANAGEMENT_TOOLS,
  "data-analytics": DATA_ANALYTICS_TOOLS,
  "hr-recruiting": HR_RECRUITING_TOOLS,
  "compliance-legal": COMPLIANCE_LEGAL_TOOLS,
  "sales-enablement": SALES_ENABLEMENT_TOOLS,
  "it-security": IT_SECURITY_TOOLS,
  "inventory-supply-chain": INVENTORY_SUPPLY_CHAIN_TOOLS,
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
 * Map task signals (department + task names from Step 2) to relevant tool categories.
 * Uses keyword matching — intentionally loose to avoid missing relevant tools.
 */
function matchTasksToToolCategories(
  tasks: { department: string; taskName: string }[]
): Set<ToolCategory> {
  const categories = new Set<ToolCategory>();

  const KEYWORD_MAP: Record<string, ToolCategory[]> = {
    // Department/function keywords → tool categories
    "finance": ["billing"],
    "accounting": ["billing"],
    "budget": ["billing"],
    "invoice": ["billing"],
    "expense": ["billing"],
    "payroll": ["billing"],
    "marketing": ["marketing"],
    "content": ["marketing"],
    "social media": ["marketing"],
    "email campaign": ["marketing"],
    "seo": ["marketing"],
    "design": ["marketing"],
    "sales": ["sales-enablement"],
    "proposal": ["sales-enablement"],
    "pipeline": ["sales-enablement"],
    "outreach": ["sales-enablement"],
    "crm": ["customer-management", "sales-enablement"],
    "customer": ["customer-management"],
    "support": ["customer-management"],
    "client": ["customer-management"],
    "donor": ["customer-management"],
    "hr": ["hr-recruiting"],
    "hiring": ["hr-recruiting"],
    "recruit": ["hr-recruiting"],
    "onboard": ["hr-recruiting"],
    "people": ["hr-recruiting"],
    "performance review": ["hr-recruiting"],
    "data": ["data-analytics"],
    "report": ["data-analytics"],
    "analytics": ["data-analytics"],
    "dashboard": ["data-analytics"],
    "compliance": ["compliance-legal"],
    "legal": ["compliance-legal"],
    "contract": ["compliance-legal"],
    "policy": ["compliance-legal"],
    "grant": ["compliance-legal", "administrative"],
    "security": ["it-security"],
    "password": ["it-security"],
    "inventory": ["inventory-supply-chain"],
    "supply chain": ["inventory-supply-chain"],
    "procurement": ["inventory-supply-chain"],
    "scheduling": ["administrative"],
    "project manage": ["administrative"],
    "workflow": ["administrative"],
    "automat": ["administrative"],
    "document": ["administrative"],
    "writing": ["office"],
    "email": ["office"],
    "meeting": ["office"],
    "communic": ["office"],
    "research": ["office", "data-analytics"],
  };

  for (const task of tasks) {
    const signal = `${task.department} ${task.taskName}`.toLowerCase();
    for (const [keyword, cats] of Object.entries(KEYWORD_MAP)) {
      if (signal.includes(keyword)) {
        for (const cat of cats) categories.add(cat);
      }
    }
  }

  return categories;
}

/**
 * Format the tools KB as a prompt-ready string for the assessment pipeline.
 * Compact format designed to inform Claude's tool recommendations with
 * real product data without consuming excessive tokens.
 *
 * When taskSignals are provided (from Step 2 output), only tool categories
 * relevant to the identified tasks are included — typically cutting the
 * prompt from ~4K tokens to ~1.5K tokens.
 */
export function formatToolsForPrompt(
  industry: string,
  companySize: string,
  taskSignals?: { department: string; taskName: string }[]
): string {
  let tools = getToolsForAssessment(industry, companySize);

  // Pre-filter to relevant categories if we have task signals from Step 2
  if (taskSignals && taskSignals.length > 0) {
    const relevantCategories = matchTasksToToolCategories(taskSignals);
    // Always include office (general productivity) as a baseline
    relevantCategories.add("office");
    const filtered = tools.filter((t) => relevantCategories.has(t.category));
    // Only use filtered set if it's meaningfully smaller but still useful
    if (filtered.length >= 8 && filtered.length < tools.length * 0.85) {
      tools = filtered;
    }
  }

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

  // Cap at 3 tools per category and 18 tools total to keep prompt size manageable
  const MAX_TOOLS_TOTAL = 18;
  const MAX_PER_CATEGORY = 3;
  let toolCount = 0;

  for (const [category, categoryTools] of Array.from(grouped.entries())) {
    if (toolCount >= MAX_TOOLS_TOTAL) break;
    const meta = TOOL_CATEGORY_META[category];
    lines.push(`### ${meta.label}`);

    for (const t of categoryTools.slice(0, MAX_PER_CATEGORY)) {
      if (toolCount >= MAX_TOOLS_TOTAL) break;
      toolCount++;
      lines.push(
        `- **${t.name}** (${t.subcategory}) — ${t.pricingDetails}`
      );
      if (t.url) {
        lines.push(`  URL: ${t.url}`);
      }
      const shortDesc = t.description.length > 140 ? t.description.slice(0, 140).trimEnd() + "…" : t.description;
      lines.push(`  ${shortDesc}`);
      lines.push(
        `  Automates: ${t.automationCapabilities.slice(0, 2).join("; ")}`
      );
    }

    lines.push("");
  }

  lines.push(
    "Use these products as EXAMPLES within use-case-driven recommendations.",
    "Frame each recommendation around the problem it solves, then mention specific products as options to explore.",
    "Include both the product name and general category so users can evaluate alternatives.",
    "Prioritize free and freemium options for solo workers and very small teams.",
    "The implementation roadmap should be product-agnostic — focus on capabilities, not tool names."
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
