/**
 * Human Capabilities Context for Assessment Pipeline
 *
 * Pulls relevant human capabilities from the knowledge base and formats
 * them for injection into assessment prompts. This enables the "skills to
 * invest in" section backed by the appreciation framework.
 *
 * Uses ES module import (not fs.readFileSync) so it works on Vercel serverless.
 */

import compiledKB from "@/data/knowledge-base/compiled.json";
import type { IndustryCategory } from "./types";

interface KBCapability {
  name: string;
  function: string;
  alsoRelevantTo: string[];
  whyAppreciating: string;
  howToDevelop: string;
  automationResistance: string[];
  taskCategories: string[];
  appreciationScore: number;
  verified: string;
  confidence: string;
}

// Map assessment industries to relevant function categories
const INDUSTRY_FUNCTION_MAP: Record<string, string[]> = {
  "nonprofit": ["administrative", "communications", "people-management", "finance", "operations"],
  "restaurant-hospitality": ["operations", "customer-service", "people-management", "marketing", "finance"],
  "manufacturing": ["operations", "technology", "people-management", "finance", "administrative"],
  "healthcare": ["healthcare", "administrative", "people-management", "technology", "customer-service"],
  "retail": ["sales", "customer-service", "operations", "marketing", "people-management"],
  "professional-services": ["administrative", "sales", "communications", "finance", "technology"],
  "accounting-finance": ["finance", "administrative", "technology", "legal", "communications"],
  "legal": ["legal", "administrative", "communications", "technology", "finance"],
  "education": ["education", "administrative", "communications", "technology", "people-management"],
  "construction": ["operations", "administrative", "finance", "people-management", "technology"],
  "real-estate": ["sales", "administrative", "marketing", "finance", "customer-service"],
  "technology": ["technology", "operations", "people-management", "sales", "creative-design"],
  "media-marketing": ["creative-design", "marketing", "communications", "technology", "sales"],
  "logistics-transportation": ["operations", "administrative", "technology", "finance", "customer-service"],
  "agriculture": ["operations", "technology", "finance", "administrative"],
  "government": ["administrative", "communications", "operations", "people-management", "legal"],
  "other": ["administrative", "operations", "communications", "finance", "technology"],
};

// Map intake function names to KB function categories
const FUNCTION_NAME_MAP: Record<string, string> = {
  "Finance & Accounting": "finance",
  "Human Resources": "people-management",
  "Marketing": "marketing",
  "Sales": "sales",
  "Customer Service": "customer-service",
  "Operations": "operations",
  "IT / Technology": "technology",
  "Legal": "legal",
  "Administrative": "administrative",
  "Communications": "communications",
  "Education / Training": "education",
  "Healthcare / Clinical": "healthcare",
  "Creative / Design": "creative-design",
};

/**
 * Get capabilities relevant to a specific assessment context.
 * Filters by industry-mapped functions and the user's stated functions.
 */
function getRelevantCapabilities(
  industry: IndustryCategory,
  primaryFunctions: string[]
): KBCapability[] {
  const capabilities = (compiledKB as { capabilities?: Record<string, KBCapability[]> }).capabilities;
  if (!capabilities) return [];

  // Combine industry-mapped functions with user's stated functions
  const relevantFunctions = new Set<string>(
    INDUSTRY_FUNCTION_MAP[industry] || INDUSTRY_FUNCTION_MAP["other"]
  );

  for (const fn of primaryFunctions) {
    const mapped = FUNCTION_NAME_MAP[fn];
    if (mapped) relevantFunctions.add(mapped);
  }

  // Collect capabilities from relevant functions
  const result: KBCapability[] = [];
  const seen = new Set<string>();

  for (const funcName of Array.from(relevantFunctions)) {
    const funcCapabilities = capabilities[funcName] || [];
    for (const cap of funcCapabilities) {
      if (!seen.has(cap.name)) {
        seen.add(cap.name);
        result.push(cap);
      }
    }
  }

  // Also add capabilities from other functions that list our functions in alsoRelevantTo
  for (const [, funcCapabilities] of Object.entries(capabilities)) {
    for (const cap of funcCapabilities) {
      if (seen.has(cap.name)) continue;
      const isRelevant = cap.alsoRelevantTo?.some((f) => relevantFunctions.has(f));
      if (isRelevant) {
        seen.add(cap.name);
        result.push(cap);
      }
    }
  }

  // Sort by appreciation score (highest first)
  return result.sort((a, b) => b.appreciationScore - a.appreciationScore);
}

/**
 * Format human capabilities as a prompt section for the assessment pipeline.
 * Gives Claude specific skills to recommend investing in, with evidence.
 */
export function formatCapabilitiesForPrompt(
  industry: IndustryCategory,
  primaryFunctions: string[]
): string {
  const capabilities = getRelevantCapabilities(industry, primaryFunctions);

  if (capabilities.length === 0) {
    return "";
  }

  // Take top 8 most relevant (reduced from 15 to cut prompt size)
  const topCapabilities = capabilities.slice(0, 8);

  const lines: string[] = [
    "## Human Capabilities That Appreciate With AI (Skills to Invest In)",
    "USE THIS DATA to recommend specific skills to develop.",
    "These capabilities become MORE valuable as AI handles routine work.",
    "Include 3-5 of the most relevant in your report.",
    "",
  ];

  for (const cap of topCapabilities) {
    lines.push(`### ${cap.name} (Score: ${cap.appreciationScore}/10)`);
    lines.push(`Function: ${cap.function} | Resistance: ${cap.automationResistance.join(", ")}`);
    lines.push(`Why appreciating: ${cap.whyAppreciating.slice(0, 200)}${cap.whyAppreciating.length > 200 ? "..." : ""}`);
    lines.push(`How to develop: ${cap.howToDevelop.slice(0, 150)}${cap.howToDevelop.length > 150 ? "..." : ""}`);
    lines.push("");
  }

  lines.push(
    "When recommending skills:",
    "- Name specific capabilities from this list",
    "- Explain WHY each appreciates in their context",
    "- Include development actions in the roadmap"
  );

  return lines.join("\n");
}
