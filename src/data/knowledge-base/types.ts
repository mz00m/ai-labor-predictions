/**
 * Knowledge Base types for AI Action Plans.
 *
 * Two sides of the same coin:
 * - Tools: AI capabilities to automate high-pressure tasks
 * - Human Capabilities: skills that appreciate as AI handles the routine
 *
 * Organized by job function (how people identify their work),
 * mapped to task categories (how the automation model scores pressure).
 */

import type { TaskCategory } from "../task-categories";

// ---------------------------------------------------------------------------
// Function categories — how real people describe their work
// ---------------------------------------------------------------------------

export type FunctionCategory =
  | "administrative"
  | "marketing"
  | "sales"
  | "finance"
  | "operations"
  | "communications"
  | "people-management"
  | "customer-service"
  | "technology"
  | "healthcare"
  | "legal"
  | "education"
  | "creative-design";

export const FUNCTION_CATEGORY_META: Record<
  FunctionCategory,
  {
    label: string;
    description: string;
    /** Which task categories dominate this function (for KB filtering) */
    primaryTaskCategories: TaskCategory[];
  }
> = {
  administrative: {
    label: "Administrative & Office Support",
    description:
      "Scheduling, document management, data entry, office coordination",
    primaryTaskCategories: [
      "information-processing",
      "communication",
      "coordination-management",
    ],
  },
  marketing: {
    label: "Marketing & Brand",
    description:
      "Campaign strategy, content creation, analytics, brand management",
    primaryTaskCategories: [
      "creative-generative",
      "communication",
      "analysis-decision",
    ],
  },
  sales: {
    label: "Sales & Business Development",
    description:
      "Prospecting, relationship management, deal negotiation, pipeline management",
    primaryTaskCategories: [
      "interpersonal",
      "communication",
      "analysis-decision",
    ],
  },
  finance: {
    label: "Finance & Accounting",
    description:
      "Bookkeeping, financial analysis, compliance, tax, audit, forecasting",
    primaryTaskCategories: [
      "information-processing",
      "analysis-decision",
      "technical-specialized",
    ],
  },
  operations: {
    label: "Operations & Small Business",
    description:
      "Process management, supply chain, vendor coordination, general management",
    primaryTaskCategories: [
      "coordination-management",
      "analysis-decision",
      "physical-manual",
    ],
  },
  communications: {
    label: "Communications & Public Relations",
    description:
      "External messaging, media relations, crisis communication, stakeholder engagement",
    primaryTaskCategories: [
      "communication",
      "interpersonal",
      "creative-generative",
    ],
  },
  "people-management": {
    label: "HR & People Management",
    description:
      "Hiring, performance management, coaching, culture, conflict resolution",
    primaryTaskCategories: [
      "interpersonal",
      "coordination-management",
      "communication",
    ],
  },
  "customer-service": {
    label: "Customer Service & Support",
    description:
      "Issue resolution, client communication, escalation management, retention",
    primaryTaskCategories: [
      "interpersonal",
      "communication",
      "information-processing",
    ],
  },
  technology: {
    label: "Technology & Engineering",
    description:
      "Software development, IT, infrastructure, data engineering, security",
    primaryTaskCategories: [
      "technical-specialized",
      "analysis-decision",
      "creative-generative",
    ],
  },
  healthcare: {
    label: "Healthcare & Clinical",
    description:
      "Patient care, diagnostics, treatment planning, clinical documentation",
    primaryTaskCategories: [
      "interpersonal",
      "technical-specialized",
      "physical-manual",
    ],
  },
  legal: {
    label: "Legal & Compliance",
    description:
      "Contract review, regulatory interpretation, litigation, risk assessment",
    primaryTaskCategories: [
      "analysis-decision",
      "technical-specialized",
      "communication",
    ],
  },
  education: {
    label: "Education & Training",
    description:
      "Teaching, curriculum design, assessment, mentoring, professional development",
    primaryTaskCategories: [
      "interpersonal",
      "creative-generative",
      "communication",
    ],
  },
  "creative-design": {
    label: "Creative & Design",
    description:
      "Visual design, UX, writing, video production, art direction",
    primaryTaskCategories: [
      "creative-generative",
      "communication",
      "interpersonal",
    ],
  },
};

// ---------------------------------------------------------------------------
// AI Tool entries (what to automate)
// ---------------------------------------------------------------------------

export interface Tool {
  name: string;
  function: FunctionCategory;
  alsoUsefulFor: FunctionCategory[];
  pricing: string;
  url: string;
  verified: string; // YYYY-MM-DD
  confidence: "high" | "medium" | "low";
  pitch: string;
  bestFor: string;
  limitations: string;
  stale: boolean;
}

// ---------------------------------------------------------------------------
// Human Capability entries (what to invest in)
// ---------------------------------------------------------------------------

export type AutomationResistance =
  | "judgment-under-ambiguity"
  | "relationship-trust"
  | "embodied-knowledge"
  | "cultural-context"
  | "ethical-reasoning"
  | "creative-taste"
  | "crisis-adaptation"
  | "motivational-influence"
  | "physical-presence"
  | "institutional-knowledge";

export interface HumanCapability {
  name: string;
  function: FunctionCategory;
  alsoRelevantTo: FunctionCategory[];
  /** Why this skill becomes MORE valuable as AI handles adjacent tasks */
  whyAppreciating: string;
  /** Specific actions to develop this capability — not generic advice */
  howToDevelop: string;
  /** The structural reason AI can't replace this */
  automationResistance: AutomationResistance[];
  /** Which task categories this capability maps to (for visualizer connection) */
  taskCategories: TaskCategory[];
  /** 1-10 scale: how much this skill appreciates as AI adoption increases */
  appreciationScore: number;
  verified: string; // YYYY-MM-DD
  confidence: "high" | "medium" | "low";
  stale: boolean;
}

// ---------------------------------------------------------------------------
// Compiled KB output
// ---------------------------------------------------------------------------

export interface KnowledgeBase {
  compiledAt: string;
  totalTools: number;
  totalCapabilities: number;
  staleCount: number;
  tools: Record<FunctionCategory, Tool[]>;
  capabilities: Record<FunctionCategory, HumanCapability[]>;
}
