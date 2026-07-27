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
import { OCCUPATION_TOOLS } from "@/data/tools/occupational";
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
  description: string;
  url: string;
  pricingDetails: string;
  /** Procured by an employer rather than adopted by the worker. */
  employerDeployed: boolean;
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

const MAX_TOOLS = 4;

/**
 * Tools someone in this job would recognize, drawn from the occupation-keyed
 * registry rather than the horizontal office-software catalog.
 *
 * Slug matches rank above category matches so that occupations which diverge
 * from their category get the right answer — court reporters need
 * transcription, not the contract tooling the rest of `legal` uses.
 *
 * Returns fewer than MAX_TOOLS, including none, when the registry has nothing
 * genuine. Many occupations have little worker-facing AI tooling, and the
 * previous behavior of backfilling from a generic industry bucket is exactly
 * what made these recommendations untrustworthy.
 */
function getTopTools(category: string, slug: string): ScorecardTool[] {
  // `occupationSlugs` is a restriction, not a boost: a tool that names its
  // occupations is offered to those and no others. Without that, contract
  // drafting tools scoped to lawyers spilled onto the court reporter page
  // just because both sit in the `legal` category.
  const forSlug = OCCUPATION_TOOLS.filter((t) => t.occupationSlugs?.includes(slug));
  const forCategory = OCCUPATION_TOOLS.filter(
    (t) => !t.occupationSlugs && t.occupationCategories.includes(category)
  );

  return [...forSlug, ...forCategory].slice(0, MAX_TOOLS).map((t) => ({
    name: t.name,
    description: t.description,
    url: t.url,
    pricingDetails: t.pricingDetails,
    employerDeployed: t.employerDeployed ?? false,
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
    tools: getTopTools(occ.category, slug),
    actions: getActionsForBand(band, goal),
    timeSavingsHoursPerWeek: estimateTimeSavings(score),
    exposure_rationale: occ.exposure_rationale,
    pay: occ.pay ?? 0,
    jobs: occ.jobs ?? 0,
    education: occ.education ?? "Not specified",
  };
}
