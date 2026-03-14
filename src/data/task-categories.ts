/**
 * Shared task category definitions used across both the individual
 * job task visualizer and the economy-wide automation model.
 *
 * Single source of truth for: type, labels, colors, and cost decline rates.
 */

export type TaskCategory =
  | "information-processing"
  | "communication"
  | "analysis-decision"
  | "creative-generative"
  | "coordination-management"
  | "physical-manual"
  | "interpersonal"
  | "technical-specialized";

export const TASK_CATEGORY_META: Record<
  TaskCategory,
  { label: string; color: string; description: string }
> = {
  "information-processing": {
    label: "Information Processing",
    color: "#5C61F6",
    description: "Data entry, document handling, lookups, form filling",
  },
  communication: {
    label: "Communication",
    color: "#F66B5C",
    description: "Emails, reports, presentations, correspondence",
  },
  "analysis-decision": {
    label: "Analysis & Decisions",
    color: "#10B981",
    description: "Research, evaluation, strategic planning, judgment calls",
  },
  "creative-generative": {
    label: "Creative & Generative",
    color: "#F59E0B",
    description: "Design, writing, ideation, novel problem-solving",
  },
  "coordination-management": {
    label: "Coordination",
    color: "#8B5CF6",
    description: "Scheduling, project management, delegation, oversight",
  },
  "physical-manual": {
    label: "Physical & Manual",
    color: "#6B7280",
    description: "Hands-on tasks, equipment operation, physical presence",
  },
  interpersonal: {
    label: "Interpersonal",
    color: "#EC4899",
    description: "Relationship building, negotiation, counseling, empathy",
  },
  "technical-specialized": {
    label: "Technical & Specialized",
    color: "#06B6D4",
    description: "Domain-specific skills, tools, certifications",
  },
};

/**
 * Cost decline rates by task category (annual fractional decline).
 * Derived from observed AI inference cost trends 2020-2026.
 *
 * Sources:
 * - Stanford HAI AI Index 2025: inference cost ~280x decline in 18 months
 * - Epoch AI: algorithmic efficiency doubling annually
 * - a16z LLMflation: 1,000x cost decline for equivalent MMLU performance in 3 years
 */
export const CATEGORY_DECLINE_RATES: Record<TaskCategory, number> = {
  "information-processing": 0.44,
  "communication": 0.41,
  "analysis-decision": 0.33,
  "creative-generative": 0.36,
  "coordination-management": 0.24,
  "physical-manual": 0.12,
  "interpersonal": 0.20,
  "technical-specialized": 0.36,
};
