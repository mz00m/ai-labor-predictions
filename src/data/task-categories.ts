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
/**
 * Institutional adoption lag by task category (years beyond economic crossover).
 *
 * Economic crossover (when AI compute < human labor cost) is a necessary but
 * not sufficient condition for adoption. Real deployment requires process
 * redesign, staff retraining, regulatory compliance, and cultural buy-in.
 *
 * These lag estimates draw on historical technology diffusion research:
 * - Griliches (1957): hybrid corn adoption took 5-15 years after economic viability
 * - Comin & Hobijn (2010): cross-country technology adoption lags of 5-45 years
 * - Rogers (2003): diffusion of innovations framework (early majority at 3-5 years)
 *
 * Values are conservative estimates for the gap between cost parity and
 * probable firm-level adoption in the US context. They reflect the binding
 * constraint identified by labor economists: institutional change, not compute cost.
 */
export const CATEGORY_ADOPTION_LAG: Record<TaskCategory, number> = {
  "information-processing": 1.5,  // Low friction: clear ROI, easy to pilot, minimal process change
  "communication": 2.0,           // Moderate: quality/tone concerns, brand risk
  "analysis-decision": 3.5,       // High: liability exposure, trust requirements, judgment calls
  "creative-generative": 2.5,     // Medium: quality bar, brand consistency, taste
  "coordination-management": 3.0, // High: organizational restructuring required
  "physical-manual": 4.0,         // Very high: capital expenditure, safety regulation, union contracts
  "interpersonal": 4.5,           // Very high: trust, ethics review, regulatory approval
  "technical-specialized": 3.0,   // High: certification requirements, domain validation
};

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
