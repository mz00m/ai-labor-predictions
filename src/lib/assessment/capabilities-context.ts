/**
 * Human Capabilities Context for Assessment Pipeline
 *
 * Pulls relevant human capabilities from the knowledge base and formats
 * them for injection into assessment prompts. This enables the "skills to
 * invest in" section backed by the appreciation framework.
 */

import fs from "fs";
import path from "path";
import type { IndustryCategory, AssessmentIntake } from "./types";

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

interface KBData {
  capabilities: Record<string, KBCapability[]>;
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

/**
 * Load the compiled knowledge base from disk.
 */
function loadKnowledgeBase(): KBData | null {
  try {
    const kbPath = path.join(process.cwd(), "src/data/knowledge-base/compiled.json");
    const raw = fs.readFileSync(kbPath, "utf-8");
    return JSON.parse(raw) as KBData;
  } catch {
    return null;
  }
}

/**
 * Get capabilities relevant to a specific assessment context.
 * Filters by industry-mapped functions and the user's stated functions.
 */
function getRelevantCapabilities(
  industry: IndustryCategory,
  primaryFunctions: string[]
): KBCapability[] {
  const kb = loadKnowledgeBase();
  if (!kb?.capabilities) return [];

  // Combine industry-mapped functions with user's stated functions
  const relevantFunctions = new Set<string>(
    INDUSTRY_FUNCTION_MAP[industry] || INDUSTRY_FUNCTION_MAP["other"]
  );

  // Map intake function names to KB function categories
  const functionMapping: Record<string, string> = {
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

  for (const fn of primaryFunctions) {
    const mapped = functionMapping[fn];
    if (mapped) relevantFunctions.add(mapped);
  }

  // Collect capabilities from relevant functions
  const capabilities: KBCapability[] = [];
  const seen = new Set<string>();

  for (const funcName of Array.from(relevantFunctions)) {
    const funcCapabilities = kb.capabilities[funcName] || [];
    for (const cap of funcCapabilities) {
      if (!seen.has(cap.name)) {
        seen.add(cap.name);
        capabilities.push(cap);
      }
    }
  }

  // Also add capabilities from other functions that list our functions in alsoRelevantTo
  for (const [, funcCapabilities] of Object.entries(kb.capabilities)) {
    for (const cap of funcCapabilities) {
      if (seen.has(cap.name)) continue;
      const isRelevant = cap.alsoRelevantTo?.some((f) => relevantFunctions.has(f));
      if (isRelevant) {
        seen.add(cap.name);
        capabilities.push(cap);
      }
    }
  }

  // Sort by appreciation score (highest first)
  return capabilities.sort((a, b) => b.appreciationScore - a.appreciationScore);
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

  // Take top 15 most relevant capabilities to keep prompt size manageable
  const topCapabilities = capabilities.slice(0, 15);

  const lines: string[] = [
    "## Human Capabilities That Appreciate With AI (Skills to Invest In)",
    "USE THIS DATA to recommend specific skills the organization should develop.",
    "These are capabilities that become MORE valuable as AI handles routine work.",
    "Include 3-5 of the most relevant capabilities in your report's risk assessment and roadmap.",
    "",
  ];

  for (const cap of topCapabilities) {
    lines.push(`### ${cap.name} (Score: ${cap.appreciationScore}/10)`);
    lines.push(`Function: ${cap.function} | Resistance: ${cap.automationResistance.join(", ")}`);
    lines.push(`Why appreciating: ${cap.whyAppreciating.slice(0, 300)}${cap.whyAppreciating.length > 300 ? "..." : ""}`);
    lines.push(`How to develop: ${cap.howToDevelop.slice(0, 200)}${cap.howToDevelop.length > 200 ? "..." : ""}`);
    lines.push("");
  }

  lines.push(
    "When making risk assessment and roadmap recommendations:",
    "- Name specific capabilities from this list that the organization should invest in",
    "- Explain WHY each capability appreciates in their specific context",
    "- Include development actions in the implementation roadmap (e.g., 'Month 2: Begin developing [capability] through [specific action]')",
    "- Frame these as competitive advantages, not just risk mitigation"
  );

  return lines.join("\n");
}
