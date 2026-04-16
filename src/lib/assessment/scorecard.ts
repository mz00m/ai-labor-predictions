/**
 * Scorecard computation for Layer 1: Instant AI Score
 *
 * Uses the existing occupation-level `exposure` field (0-10) directly
 * as the AI Score. No API calls, no forms, zero marginal cost.
 *
 * Score bands:
 *   1-3  Getting Started
 *   4-6  Building Momentum
 *   7-8  AI-Powered
 *   9-10 AI-Native
 *
 * Task breakdown derived from taskComposition categories:
 *   AI can do now:  information-processing + technical-specialized (exposure > 0.7 threshold)
 *   AI can assist:  analysis-decision + creative-generative + communication
 *   Human domain:   interpersonal + coordination-management + physical-manual
 */

import enrichedData from "@/data/enriched-occupations.json";
import { getToolsForAssessment } from "@/data/tools";
import actionTemplates from "@/data/assessment/action-templates.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ScoreBand =
  | "getting-started"
  | "building-momentum"
  | "ai-powered"
  | "ai-native";

export type GoalPreference = "productivity" | "time" | "both";

export interface TaskBreakdown {
  /** Fraction of tasks AI can handle autonomously (0-1) */
  aiCanDoNow: number;
  /** Fraction of tasks AI can assist with (0-1) */
  aiCanAssist: number;
  /** Fraction of tasks that remain human domain (0-1) */
  humanDomain: number;
}

export interface ScorecardTool {
  name: string;
  category: string;
  description: string;
  url?: string;
  pricingDetails: string;
}

export interface LevelUpAction {
  title: string;
  description: string;
  scoreImpact: string;
  tag: "productivity" | "time" | "both";
}

export interface ScorecardResult {
  slug: string;
  title: string;
  category: string;
  score: number;
  band: ScoreBand;
  bandLabel: string;
  taskBreakdown: TaskBreakdown;
  taskCount: number;
  tools: ScorecardTool[];
  actions: LevelUpAction[];
  timeSavingsHoursPerWeek: number;
  exposure_rationale: string;
  pay: number;
  jobs: number;
  education: string;
}

// ---------------------------------------------------------------------------
// Occupation index (built once at module level, server-only)
// ---------------------------------------------------------------------------

const occupationsBySlug = new Map(
  enrichedData.occupations.map((o) => [o.slug, o])
);

export function getAllOccupationSlugs(): string[] {
  return enrichedData.occupations.map((o) => o.slug);
}

export function getOccupationBySlug(slug: string) {
  return occupationsBySlug.get(slug) ?? null;
}

// ---------------------------------------------------------------------------
// Score band logic
// ---------------------------------------------------------------------------

export function getScoreBand(score: number): ScoreBand {
  if (score <= 3) return "getting-started";
  if (score <= 6) return "building-momentum";
  if (score <= 8) return "ai-powered";
  return "ai-native";
}

const BAND_LABELS: Record<ScoreBand, string> = {
  "getting-started": "Getting Started",
  "building-momentum": "Building Momentum",
  "ai-powered": "AI-Powered",
  "ai-native": "AI-Native",
};

// ---------------------------------------------------------------------------
// Task breakdown
// ---------------------------------------------------------------------------

function computeTaskBreakdown(
  taskComposition: Record<string, number>
): TaskBreakdown {
  // Categories where AI can operate with high autonomy
  const aiNowCategories = [
    "information-processing",
    "technical-specialized",
  ];
  // Categories where AI assists but humans lead
  const aiAssistCategories = [
    "analysis-decision",
    "creative-generative",
    "communication",
  ];
  // Remaining categories are human domain
  // interpersonal, coordination-management, physical-manual

  const aiCanDoNow = aiNowCategories.reduce(
    (sum, key) => sum + (taskComposition[key] ?? 0),
    0
  );
  const aiCanAssist = aiAssistCategories.reduce(
    (sum, key) => sum + (taskComposition[key] ?? 0),
    0
  );
  const humanDomain = Math.max(0, 1 - aiCanDoNow - aiCanAssist);

  return { aiCanDoNow, aiCanAssist, humanDomain };
}

// ---------------------------------------------------------------------------
// Time savings estimate
// ---------------------------------------------------------------------------

/**
 * Conservative heuristic:
 *   40hrs/week * (exposure/10) * 0.3 discount
 *
 * The 0.3 discount accounts for the gap between "AI could theoretically
 * handle this task" and "AI actually saves time in practice today."
 * Exposure-8 occupation → ~9.6 hrs/week. Defensible, not sensational.
 */
function estimateTimeSavings(exposure: number): number {
  return Math.round(40 * (exposure / 10) * 0.3 * 10) / 10;
}

// ---------------------------------------------------------------------------
// Tool recommendations (top 3 from existing KB)
// ---------------------------------------------------------------------------

/**
 * Maps occupation categories to the closest IndustryCategory for tool lookup.
 * Not all 15 occupation categories have a 1:1 match, so we approximate.
 */
const CATEGORY_TO_INDUSTRY: Record<string, string> = {
  "business-and-financial": "accounting-finance",
  "computer-and-mathematical": "technology",
  "architecture-and-engineering": "technology",
  "life-physical-and-social-science": "education",
  "community-and-social-service": "nonprofit",
  "legal": "legal",
  "education-training-and-library": "education",
  "arts-design-entertainment-sports-and-media": "media-marketing",
  "healthcare-practitioners-and-technical": "healthcare",
  "healthcare-support": "healthcare",
  "food-preparation-and-serving-related": "restaurant-hospitality",
  "building-and-grounds-cleaning-and-maintenance": "construction",
  "personal-care-and-service": "professional-services",
  "sales-and-related": "retail",
  "office-and-administrative-support": "professional-services",
  "farming-fishing-and-forestry": "agriculture",
  "construction-and-extraction": "construction",
  "installation-maintenance-and-repair": "manufacturing",
  "production": "manufacturing",
  "transportation-and-material-moving": "logistics-transportation",
  "management": "professional-services",
  "protective-service": "government",
  "military-specific": "government",
};

function getTopTools(category: string): ScorecardTool[] {
  const industry = CATEGORY_TO_INDUSTRY[category] ?? "other";
  const tools = getToolsForAssessment(industry, "11-50");
  return tools.slice(0, 3).map((t) => ({
    name: t.name,
    category: t.category,
    description: t.description,
    url: t.url,
    pricingDetails: t.pricingDetails,
  }));
}

// ---------------------------------------------------------------------------
// Action templates
// ---------------------------------------------------------------------------

interface ActionTemplate {
  band: ScoreBand;
  actions: LevelUpAction[];
}

const templates = actionTemplates as ActionTemplate[];

function getActionsForBand(
  band: ScoreBand,
  goal: GoalPreference = "both"
): LevelUpAction[] {
  const bandActions =
    templates.find((t) => t.band === band)?.actions ?? [];

  if (goal === "both") return bandActions.slice(0, 3);

  // Sort: matching goal first, then "both", then other
  const sorted = [...bandActions].sort((a, b) => {
    const aMatch =
      a.tag === goal ? 0 : a.tag === "both" ? 1 : 2;
    const bMatch =
      b.tag === goal ? 0 : b.tag === "both" ? 1 : 2;
    return aMatch - bMatch;
  });

  return sorted.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function getScorecard(
  slug: string,
  goal: GoalPreference = "both"
): ScorecardResult | null {
  const occ = occupationsBySlug.get(slug);
  if (!occ) return null;

  const score = Math.max(1, Math.min(10, occ.exposure));
  const band = getScoreBand(score);

  return {
    slug: occ.slug,
    title: occ.title,
    category: occ.category,
    score,
    band,
    bandLabel: BAND_LABELS[band],
    taskBreakdown: computeTaskBreakdown(occ.taskComposition),
    taskCount: occ.tasks.length,
    tools: getTopTools(occ.category),
    actions: getActionsForBand(band, goal),
    timeSavingsHoursPerWeek: estimateTimeSavings(score),
    exposure_rationale: occ.exposure_rationale,
    pay: occ.pay ?? 0,
    jobs: occ.jobs ?? 0,
    education: occ.education ?? "Not specified",
  };
}
