/**
 * US Workforce by Major Occupation Group
 *
 * Data: Bureau of Labor Statistics, Occupational Employment and Wage Statistics (OEWS)
 * May 2024 release (most recent as of March 2026)
 * https://www.bls.gov/oes/current/oes_nat.htm
 *
 * Employment and wage figures sourced from BLS Table 1 (national employment
 * and wage data, May 2024 OEWS release, published April 2025).
 * Total OEWS-covered employment: 154,187,380.
 *
 * 17 of 22 groups have employment confirmed directly from BLS Table 1.
 * 5 groups (Office/Admin, Farming, Construction, Installation/Repair,
 * Production, Transportation) use estimates based on May 2023 data + trends.
 *
 * Each occupation group has:
 *   - employment: thousands of workers
 *   - medianWageHr: median hourly wage
 *   - medianWageAnnual: median annual wage (hourly x 2080)
 *   - taskComposition: estimated breakdown of time across task categories
 *     (derived from O*NET Generalized Work Activities mapped to each SOC group)
 *   - incomeTier: low / middle / high based on median wage
 *
 * Task composition estimates are informed by O*NET work activity prevalence
 * data for detailed occupations within each major group, aggregated to the
 * major group level. These are approximations.
 */

// Import shared task category definitions (single source of truth)
import type { TaskCategory } from "./task-categories";
import { TASK_CATEGORY_META, CATEGORY_DECLINE_RATES, CATEGORY_ADOPTION_LAG } from "./task-categories";
import { SOC_INDUSTRY_SPEED } from "./industry-adoption-speed";

// Re-export for consumers
export { type TaskCategory, TASK_CATEGORY_META, CATEGORY_DECLINE_RATES } from "./task-categories";

export type IncomeTier = "low" | "middle" | "high";

export interface AdaptiveCapacityComponents {
  netLiquidWealth: number;    // SIPP 2022-2024 (0-1)
  skillTransferability: number; // O*NET + BLS projections (0-1)
  geographicDensity: number;  // Lightcast CBSA density (0-1)
  ageFraction55Plus: number;  // ACS (inverted: lower = better) (0-1)
}

export interface OccupationGroup {
  id: string;
  socCode: string; // SOC major group code
  title: string;
  shortTitle: string; // for chart labels
  employment: number; // thousands
  medianWageHr: number;
  medianWageAnnual: number;
  incomeTier: IncomeTier;
  taskComposition: Record<TaskCategory, number>; // sums to 1.0
  /** Estimated compute cost ($/hr) to automate the average hour of work in this group */
  avgComputeCostPerHr: number;
  /** Annual cost decline rate for the blended task mix */
  blendedCostDeclineRate: number;
  /** Percentage of workers who are women (BLS CPS 2024 annual averages) */
  womenPercent: number;
  /** Adaptive capacity index (0-1) from Manning/Aguirre NBER w34705 */
  adaptiveCapacity: number;
  /** AC subcomponents (0-1 each) */
  adaptiveCapacityComponents: AdaptiveCapacityComponents;
  /** AI exposure score from Eloundou et al. E1+0.5E2 (0-1) */
  aiExposure: number;
}

// CATEGORY_DECLINE_RATES imported from ./task-categories above

/**
 * Base compute cost per hour by task category (2026 estimates)
 */
export const CATEGORY_COMPUTE_COSTS: Record<TaskCategory, number> = {
  "information-processing": 3,
  "communication": 6,
  "analysis-decision": 25,
  "creative-generative": 12,
  "coordination-management": 35,
  "physical-manual": 350,
  "interpersonal": 100,
  "technical-specialized": 15,
};

export const INCOME_TIER_META: Record<IncomeTier, { label: string; color: string; range: string }> = {
  low: { label: "Lower income", color: "#F59E0B", range: "Under $35K/yr" },
  middle: { label: "Middle income", color: "#6366F1", range: "$35K-$75K/yr" },
  high: { label: "Higher income", color: "#10B981", range: "Over $75K/yr" },
};

// TASK_CATEGORY_META imported from ./task-categories above (multi-hue palette)

function computeBlended(tc: Record<TaskCategory, number>): { avgCost: number; declineRate: number } {
  let avgCost = 0;
  let declineRate = 0;
  for (const [cat, share] of Object.entries(tc) as [TaskCategory, number][]) {
    avgCost += CATEGORY_COMPUTE_COSTS[cat] * share;
    declineRate += CATEGORY_DECLINE_RATES[cat] * share;
  }
  return { avgCost: Math.round(avgCost * 100) / 100, declineRate: Math.round(declineRate * 1000) / 1000 };
}

function makeGroup(
  id: string,
  socCode: string,
  title: string,
  shortTitle: string,
  employment: number,
  medianWageHr: number,
  medianWageAnnual: number,
  incomeTier: IncomeTier,
  taskComposition: Record<TaskCategory, number>,
  womenPercent: number,
  adaptiveCapacity: number,
  adaptiveCapacityComponents: AdaptiveCapacityComponents,
  aiExposure: number
): OccupationGroup {
  const { avgCost, declineRate } = computeBlended(taskComposition);
  return {
    id, socCode, title, shortTitle, employment,
    medianWageHr, medianWageAnnual, incomeTier, taskComposition,
    avgComputeCostPerHr: avgCost, blendedCostDeclineRate: declineRate,
    womenPercent, adaptiveCapacity, adaptiveCapacityComponents, aiExposure,
  };
}

/**
 * Gender data: Women's share of employment by SOC major group.
 * Source: BLS Current Population Survey (CPS) 2024 annual averages, Table 11:
 * "Employed persons by detailed occupation, sex, race, and Hispanic or Latino ethnicity"
 * https://www.bls.gov/cps/cpsaat11.htm
 *
 * Adaptive capacity data: Manning & Aguirre, NBER w34705 (January 2026).
 * "How Adaptable Are American Workers to AI-Induced Job Displacement?"
 * Composite index (0-1) from net liquid wealth, skill transferability, geographic
 * density, and age (fraction 55+). Covers 356 occupations (95.9% of US workforce).
 *
 * The paper reports 7 major occupation categories that map imperfectly to our
 * 22 SOC groups. Groups sharing a paper category share the same AC score.
 * Education and healthcare practitioners are interpolated from surrounding data.
 * AI exposure from Eloundou et al. (2024) E1+0.5E2 estimates (0-1 scale).
 */
export const OCCUPATION_GROUPS: OccupationGroup[] = [
  // Professional, Managerial, and Technical — AC=0.734, exposure=0.400 (Table 5)
  makeGroup("management", "11-0000", "Management Occupations", "Management",
    10967, 58.70, 122090, "high",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.20,
      "creative-generative": 0.05, "coordination-management": 0.25, "physical-manual": 0.00,
      "interpersonal": 0.20, "technical-specialized": 0.05 }, 47,
    0.734, { netLiquidWealth: 0.85, skillTransferability: 0.72, geographicDensity: 0.70, ageFraction55Plus: 0.58 }, 0.400),

  makeGroup("business-financial", "13-0000", "Business and Financial Operations", "Business & Finance",
    10351, 38.90, 80910, "high",
    { "information-processing": 0.25, "communication": 0.15, "analysis-decision": 0.25,
      "creative-generative": 0.03, "coordination-management": 0.10, "physical-manual": 0.00,
      "interpersonal": 0.12, "technical-specialized": 0.10 }, 35,
    0.734, { netLiquidWealth: 0.78, skillTransferability: 0.74, geographicDensity: 0.72, ageFraction55Plus: 0.62 }, 0.400),

  makeGroup("computer-math", "15-0000", "Computer and Mathematical Occupations", "Tech & Computing",
    5193, 50.89, 105850, "high",
    { "information-processing": 0.15, "communication": 0.10, "analysis-decision": 0.15,
      "creative-generative": 0.10, "coordination-management": 0.05, "physical-manual": 0.00,
      "interpersonal": 0.10, "technical-specialized": 0.35 }, 26,
    0.800, { netLiquidWealth: 0.82, skillTransferability: 0.80, geographicDensity: 0.78, ageFraction55Plus: 0.68 }, 0.400),

  makeGroup("architecture-engineering", "17-0000", "Architecture and Engineering", "Architecture & Engineering",
    2567, 45.37, 94370, "high",
    { "information-processing": 0.10, "communication": 0.10, "analysis-decision": 0.20,
      "creative-generative": 0.15, "coordination-management": 0.10, "physical-manual": 0.05,
      "interpersonal": 0.05, "technical-specialized": 0.25 }, 16,
    0.734, { netLiquidWealth: 0.76, skillTransferability: 0.70, geographicDensity: 0.68, ageFraction55Plus: 0.60 }, 0.400),

  makeGroup("life-physical-social-science", "19-0000", "Life, Physical, and Social Science", "Sciences",
    1447, 39.35, 81860, "high",
    { "information-processing": 0.20, "communication": 0.10, "analysis-decision": 0.30,
      "creative-generative": 0.10, "coordination-management": 0.05, "physical-manual": 0.10,
      "interpersonal": 0.05, "technical-specialized": 0.10 }, 48,
    0.734, { netLiquidWealth: 0.70, skillTransferability: 0.78, geographicDensity: 0.74, ageFraction55Plus: 0.60 }, 0.400),

  // Service Occupations — AC=0.454, exposure=0.161 (Table 5)
  makeGroup("community-social", "21-0000", "Community and Social Service", "Social Services",
    2570, 27.66, 57530, "middle",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.10,
      "creative-generative": 0.02, "coordination-management": 0.10, "physical-manual": 0.05,
      "interpersonal": 0.40, "technical-specialized": 0.08 }, 67,
    0.454, { netLiquidWealth: 0.35, skillTransferability: 0.55, geographicDensity: 0.52, ageFraction55Plus: 0.48 }, 0.161),

  // Professional, Managerial, and Technical
  makeGroup("legal", "23-0000", "Legal Occupations", "Legal",
    1273, 48.07, 99990, "high",
    { "information-processing": 0.25, "communication": 0.20, "analysis-decision": 0.20,
      "creative-generative": 0.05, "coordination-management": 0.05, "physical-manual": 0.00,
      "interpersonal": 0.15, "technical-specialized": 0.10 }, 53,
    0.734, { netLiquidWealth: 0.88, skillTransferability: 0.68, geographicDensity: 0.76, ageFraction55Plus: 0.56 }, 0.400),

  // Education — interpolated: AC=0.600, exposure=0.350
  makeGroup("education", "25-0000", "Educational Instruction and Library", "Education",
    8948, 28.47, 59220, "middle",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.10,
      "creative-generative": 0.10, "coordination-management": 0.05, "physical-manual": 0.05,
      "interpersonal": 0.40, "technical-specialized": 0.05 }, 73,
    0.600, { netLiquidWealth: 0.42, skillTransferability: 0.68, geographicDensity: 0.65, ageFraction55Plus: 0.50 }, 0.350),

  // Professional, Managerial, and Technical
  makeGroup("arts-media", "27-0000", "Arts, Design, Entertainment, Sports, and Media", "Arts & Media",
    2099, 28.91, 60130, "middle",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.05,
      "creative-generative": 0.40, "coordination-management": 0.05, "physical-manual": 0.10,
      "interpersonal": 0.10, "technical-specialized": 0.05 }, 52,
    0.734, { netLiquidWealth: 0.55, skillTransferability: 0.76, geographicDensity: 0.80, ageFraction55Plus: 0.65 }, 0.400),

  // Healthcare Practitioners — interpolated: AC=0.550, exposure=0.200
  makeGroup("healthcare-practitioners", "29-0000", "Healthcare Practitioners and Technical", "Healthcare (Clinical)",
    9593, 42.28, 87930, "high",
    { "information-processing": 0.15, "communication": 0.05, "analysis-decision": 0.15,
      "creative-generative": 0.02, "coordination-management": 0.05, "physical-manual": 0.30,
      "interpersonal": 0.15, "technical-specialized": 0.13 }, 76,
    0.550, { netLiquidWealth: 0.60, skillTransferability: 0.52, geographicDensity: 0.58, ageFraction55Plus: 0.52 }, 0.200),

  // Service Occupations — AC=0.454, exposure=0.161
  makeGroup("healthcare-support", "31-0000", "Healthcare Support Occupations", "Healthcare (Support)",
    7448, 17.13, 35620, "low",
    { "information-processing": 0.10, "communication": 0.05, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.45,
      "interpersonal": 0.25, "technical-specialized": 0.05 }, 87,
    0.454, { netLiquidWealth: 0.22, skillTransferability: 0.48, geographicDensity: 0.58, ageFraction55Plus: 0.52 }, 0.161),

  makeGroup("protective-service", "33-0000", "Protective Service Occupations", "Protective Services",
    3655, 24.42, 50800, "middle",
    { "information-processing": 0.10, "communication": 0.10, "analysis-decision": 0.10,
      "creative-generative": 0.00, "coordination-management": 0.10, "physical-manual": 0.35,
      "interpersonal": 0.20, "technical-specialized": 0.05 }, 22,
    0.454, { netLiquidWealth: 0.45, skillTransferability: 0.42, geographicDensity: 0.50, ageFraction55Plus: 0.42 }, 0.161),

  makeGroup("food-serving", "35-0000", "Food Preparation and Serving Related", "Food & Serving",
    13613, 14.69, 30550, "low",
    { "information-processing": 0.05, "communication": 0.05, "analysis-decision": 0.02,
      "creative-generative": 0.03, "coordination-management": 0.05, "physical-manual": 0.60,
      "interpersonal": 0.15, "technical-specialized": 0.05 }, 62,
    0.454, { netLiquidWealth: 0.18, skillTransferability: 0.52, geographicDensity: 0.55, ageFraction55Plus: 0.62 }, 0.161),

  makeGroup("building-grounds", "37-0000", "Building and Grounds Cleaning and Maintenance", "Building & Grounds",
    4496, 16.18, 33650, "low",
    { "information-processing": 0.03, "communication": 0.02, "analysis-decision": 0.02,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.80,
      "interpersonal": 0.03, "technical-specialized": 0.05 }, 37,
    0.454, { netLiquidWealth: 0.20, skillTransferability: 0.45, geographicDensity: 0.52, ageFraction55Plus: 0.50 }, 0.161),

  makeGroup("personal-care", "39-0000", "Personal Care and Service Occupations", "Personal Care",
    3160, 16.22, 33740, "low",
    { "information-processing": 0.05, "communication": 0.05, "analysis-decision": 0.03,
      "creative-generative": 0.05, "coordination-management": 0.02, "physical-manual": 0.40,
      "interpersonal": 0.35, "technical-specialized": 0.05 }, 76,
    0.454, { netLiquidWealth: 0.20, skillTransferability: 0.50, geographicDensity: 0.55, ageFraction55Plus: 0.52 }, 0.161),

  // Sales and Related — AC=0.487, exposure=0.348 (Table 5)
  makeGroup("sales", "41-0000", "Sales and Related Occupations", "Sales",
    13352, 18.01, 37460, "middle",
    { "information-processing": 0.15, "communication": 0.20, "analysis-decision": 0.05,
      "creative-generative": 0.03, "coordination-management": 0.02, "physical-manual": 0.15,
      "interpersonal": 0.35, "technical-specialized": 0.05 }, 49,
    0.487, { netLiquidWealth: 0.38, skillTransferability: 0.55, geographicDensity: 0.52, ageFraction55Plus: 0.50 }, 0.348),

  // Administrative Support — AC=0.360, exposure=0.525 (Table 5, highest exposure + lowest AC of white-collar)
  makeGroup("office-admin", "43-0000", "Office and Administrative Support", "Office & Admin",
    18200, 20.82, 43310, "middle",
    { "information-processing": 0.40, "communication": 0.20, "analysis-decision": 0.05,
      "creative-generative": 0.02, "coordination-management": 0.10, "physical-manual": 0.05,
      "interpersonal": 0.10, "technical-specialized": 0.08 }, 42,
    0.360, { netLiquidWealth: 0.25, skillTransferability: 0.40, geographicDensity: 0.45, ageFraction55Plus: 0.42 }, 0.525),

  // Natural Resources, Construction, Maintenance — AC=0.449, exposure=0.041 (Table 5)
  makeGroup("farming-fishing", "45-0000", "Farming, Fishing, and Forestry", "Farming & Forestry",
    470, 17.35, 36090, "low",
    { "information-processing": 0.03, "communication": 0.02, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.75,
      "interpersonal": 0.02, "technical-specialized": 0.08 }, 24,
    0.449, { netLiquidWealth: 0.35, skillTransferability: 0.38, geographicDensity: 0.25, ageFraction55Plus: 0.42 }, 0.041),

  makeGroup("construction", "47-0000", "Construction and Extraction Occupations", "Construction",
    7000, 25.54, 53120, "middle",
    { "information-processing": 0.05, "communication": 0.03, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.65,
      "interpersonal": 0.02, "technical-specialized": 0.15 }, 11,
    0.449, { netLiquidWealth: 0.42, skillTransferability: 0.40, geographicDensity: 0.48, ageFraction55Plus: 0.48 }, 0.041),

  makeGroup("installation-repair", "49-0000", "Installation, Maintenance, and Repair", "Installation & Repair",
    5950, 25.76, 53580, "middle",
    { "information-processing": 0.05, "communication": 0.03, "analysis-decision": 0.10,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.55,
      "interpersonal": 0.02, "technical-specialized": 0.20 }, 4,
    0.449, { netLiquidWealth: 0.40, skillTransferability: 0.45, geographicDensity: 0.50, ageFraction55Plus: 0.45 }, 0.041),

  // Production, Transportation, Material Moving — AC=0.401, exposure=0.131 (Table 5)
  makeGroup("production", "51-0000", "Production Occupations", "Production",
    8700, 19.53, 40630, "middle",
    { "information-processing": 0.05, "communication": 0.03, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.02, "physical-manual": 0.70,
      "interpersonal": 0.02, "technical-specialized": 0.13 }, 29,
    0.401, { netLiquidWealth: 0.30, skillTransferability: 0.38, geographicDensity: 0.42, ageFraction55Plus: 0.45 }, 0.131),

  makeGroup("transportation", "53-0000", "Transportation and Material Moving", "Transportation",
    13100, 18.61, 38710, "middle",
    { "information-processing": 0.10, "communication": 0.03, "analysis-decision": 0.03,
      "creative-generative": 0.00, "coordination-management": 0.02, "physical-manual": 0.70,
      "interpersonal": 0.02, "technical-specialized": 0.10 }, 20,
    0.401, { netLiquidWealth: 0.28, skillTransferability: 0.40, geographicDensity: 0.44, ageFraction55Plus: 0.45 }, 0.131),
];

export const TOTAL_EMPLOYMENT = OCCUPATION_GROUPS.reduce((s, g) => s + g.employment, 0); // thousands

/**
 * Exposure measurement uncertainty by major occupation group.
 *
 * Source: Yale Budget Lab (Gimbel, Kendall, Kulsakdinun), February 2026.
 * "Labor Market AI Exposure: What Do We Know?"
 *
 * Values are the variance of z-scores across 6 AI exposure metrics
 * (Eloundou et al., Eisfeldt et al., Felten et al., Tomlinson et al.)
 * for 778 occupations. Higher variance = more disagreement between metrics
 * about how exposed the occupation group is.
 *
 * Also includes PCA-weighted exposure score (mean across metrics).
 */
export const EXPOSURE_UNCERTAINTY: Record<string, { variance: number; pcaScore: number }> = {
  "management":              { variance: 0.317, pcaScore: 1.3 },
  "business-financial":      { variance: 0.329, pcaScore: 2.1 },
  "computer-math":           { variance: 0.739, pcaScore: 4.2 },
  "architecture-engineering": { variance: 0.150, pcaScore: 1.6 },
  "life-physical-social-science": { variance: 0.210, pcaScore: 1.7 },
  "community-social":        { variance: 0.347, pcaScore: 0.9 },
  "legal":                   { variance: 0.581, pcaScore: 1.6 },
  "education":               { variance: 0.232, pcaScore: 1.7 },
  "arts-media":              { variance: 0.377, pcaScore: 0.9 },
  "healthcare-practitioners": { variance: 0.221, pcaScore: -0.4 },
  "healthcare-support":      { variance: 0.228, pcaScore: -1.4 },
  "protective-service":      { variance: 0.214, pcaScore: -0.7 },
  "food-serving":            { variance: 0.233, pcaScore: -1.5 },
  "building-grounds":        { variance: 0.085, pcaScore: -2.0 },
  "personal-care":           { variance: 0.272, pcaScore: -0.9 },
  "sales":                   { variance: 0.474, pcaScore: 1.7 },
  "office-admin":            { variance: 0.379, pcaScore: 2.5 },
  "farming-fishing":         { variance: 0.147, pcaScore: -2.2 },
  "construction":            { variance: 0.095, pcaScore: -2.6 },
  "installation-repair":     { variance: 0.103, pcaScore: -1.8 },
  "production":              { variance: 0.134, pcaScore: -1.9 },
  "transportation":          { variance: 0.199, pcaScore: -1.5 },
};

/**
 * GPT-scored AI exposure by SOC major group (0-10 scale).
 *
 * Source: Yale Budget Lab data repo (rmmomin/jobs-ai-exposure), scoring
 * 342 BLS Occupational Outlook Handbook occupations via GPT across
 * direct automation, indirect productivity, and digital work emphasis.
 *
 * Validated against 6 academic exposure metrics:
 *   - Pearson 0.878 with Yale PCA reference
 *   - Pearson 0.885 with OpenAI GPTs-are-GPTs (Eloundou et al.)
 *
 * mean: unweighted average across occupations in the SOC major group
 * min/max: range of individual occupation scores within the group
 * count: number of BLS occupations scored in this group
 */
export const SOC_EXPOSURE_SCORES: Record<string, { mean: number; min: number; max: number; count: number }> = {
  "management":              { mean: 6.17, min: 4, max: 8, count: 24 },
  "business-financial":      { mean: 7.32, min: 5, max: 9, count: 22 },
  "computer-math":           { mean: 8.40, min: 8, max: 9, count: 10 },
  "architecture-engineering": { mean: 6.03, min: 3, max: 8, count: 30 },
  "life-physical-social-science": { mean: 6.07, min: 4, max: 8, count: 29 },
  "community-social":        { mean: 4.89, min: 4, max: 5, count: 9 },
  "legal":                   { mean: 7.67, min: 6, max: 9, count: 3 },
  "education":               { mean: 5.80, min: 4, max: 7, count: 10 },
  "arts-media":              { mean: 6.58, min: 2, max: 9, count: 26 },
  "healthcare-practitioners": { mean: 4.61, min: 3, max: 9, count: 33 },
  "healthcare-support":      { mean: 3.67, min: 2, max: 10, count: 9 },
  "protective-service":      { mean: 3.80, min: 2, max: 6, count: 5 },
  "food-serving":            { mean: 2.60, min: 2, max: 3, count: 5 },
  "building-grounds":        { mean: 2.00, min: 2, max: 2, count: 3 },
  "personal-care":           { mean: 2.67, min: 2, max: 5, count: 9 },
  "sales":                   { mean: 6.67, min: 5, max: 8, count: 9 },
  "office-admin":            { mean: 7.70, min: 4, max: 9, count: 10 },
  "farming-fishing":         { mean: 2.00, min: 2, max: 2, count: 3 },
  "construction":            { mean: 2.25, min: 1, max: 4, count: 16 },
  "installation-repair":     { mean: 2.78, min: 2, max: 3, count: 9 },
  "production":              { mean: 3.36, min: 2, max: 5, count: 11 },
  "transportation":          { mean: 4.20, min: 3, max: 5, count: 5 },
};

/**
 * CFO-reported Negative Exposure Index (NEI) by SOC major occupation group.
 *
 * Source: Baslandze et al. (2026), "Artificial Intelligence, Productivity,
 * and the Workforce: Evidence from Corporate Executives."
 * Federal Reserve Bank of Atlanta / Duke University. Table 6.
 * Survey of ~750 CFOs (Nov 2025 - Jan 2026).
 *
 * NEI = Replacement Mentions / Enhancement Mentions.
 * Values > 1.0 indicate AI is more frequently described as replacing roles
 * than enhancing them. Only groups with >= 20 total mentions are reported.
 *
 * This provides a real-world executive signal complementing the algorithmic
 * exposure scores from Eloundou et al. and Yale Budget Lab.
 */
export const CFO_SURVEY_NEI: Record<string, { nei: number; label: string }> = {
  "office-admin":             { nei: 2.025, label: "Strongly negative (most at-risk)" },
  "business-financial":       { nei: 0.829, label: "Roughly balanced" },
  "computer-math":            { nei: 0.596, label: "More enhancement" },
  "legal":                    { nei: 0.471, label: "More enhancement" },
  "production":               { nei: 0.308, label: "More enhancement" },
  "sales":                    { nei: 0.298, label: "More enhancement" },
  "management":               { nei: 0.138, label: "Strongly positive (enhanced)" },
  "architecture-engineering": { nei: 0.100, label: "Strongly positive (enhanced)" },
};

/**
 * Get the CFO NEI signal label and color for display.
 * NEI > 1.0 = replacement-dominant (red), 0.7-1.0 = balanced (amber), < 0.7 = enhancement-dominant (green).
 */
export function getCfoSignal(groupId: string): { nei: number; label: string; shortLabel: string; color: string } | null {
  const data = CFO_SURVEY_NEI[groupId];
  if (!data) return null;
  if (data.nei > 1.0) return { nei: data.nei, label: data.label, shortLabel: "Replace", color: "#EF4444" };
  if (data.nei > 0.7) return { nei: data.nei, label: data.label, shortLabel: "Balanced", color: "#F59E0B" };
  return { nei: data.nei, label: data.label, shortLabel: "Enhance", color: "#10B981" };
}

/**
 * Demand elasticity by major occupation group.
 *
 * Classifies how much demand for an occupation's output is likely to expand
 * when AI reduces the cost of providing it. Based on historical precedent
 * from Bessen (2019) "Automation and Jobs: When Technology Boosts Employment"
 * and Autor & Salomons (2018) "Is Automation Labor-Displacing?"
 *
 * High elasticity: cheaper output historically drives large demand expansion.
 *   Example: ATMs reduced branch cost -> banks opened more branches -> teller
 *   employment *increased* for 30 years.
 *
 * Moderate elasticity: some unmet demand exists, but expansion has limits.
 *   Example: Legal research for SMBs is underserved; cheaper AI legal tools
 *   may expand the market, but total legal demand has natural limits.
 *
 * Low elasticity: demand is largely fixed or internally consumed.
 *   Example: Back-office admin work is a cost center, not a product.
 *   Cheaper admin doesn't create more admin demand — it just cuts costs.
 */
export type DemandElasticity = "high" | "moderate" | "low";

export const DEMAND_ELASTICITY: Record<string, { elasticity: DemandElasticity; rationale: string }> = {
  // High: cheaper output -> much more demand
  "sales":                    { elasticity: "high", rationale: "Cheaper outreach expands addressable market; historically elastic to CRM/automation" },
  "arts-media":               { elasticity: "high", rationale: "Near-zero-cost design/content could serve every SMB, social post, and internal doc" },
  "food-serving":             { elasticity: "high", rationale: "Restaurant demand is price-sensitive; lower costs expand casual dining and delivery" },
  "personal-care":            { elasticity: "high", rationale: "Personal services are price-elastic; cheaper services expand to new demographics" },
  "community-social":         { elasticity: "high", rationale: "Vast unmet demand for social services; supply-constrained, not demand-constrained" },

  // Moderate: some expansion, but not unlimited
  "management":               { elasticity: "moderate", rationale: "Better management tools improve quality but management demand is bounded by org size" },
  "business-financial":       { elasticity: "moderate", rationale: "Some unmet demand (SMB accounting, financial planning), but market partially saturated" },
  "computer-math":            { elasticity: "high", rationale: "Strong Jevons Paradox: every productivity wave (compilers, cloud, open source) expanded total software demand; vast latent demand for custom tooling and digital products remains cost-prohibitive" },
  "legal":                    { elasticity: "moderate", rationale: "Large unmet demand for SMB/individual legal services, but total legal market has limits" },
  "education":                { elasticity: "moderate", rationale: "Personalized tutoring demand is high, but institutional education is supply-constrained" },
  "healthcare-practitioners": { elasticity: "moderate", rationale: "Enormous unmet healthcare demand, but regulated supply limits expansion speed" },
  "healthcare-support":       { elasticity: "moderate", rationale: "Aging population drives demand; cost reduction enables broader access" },
  "architecture-engineering": { elasticity: "moderate", rationale: "Cheaper design expands renovation/custom work, but bounded by physical construction" },
  "life-physical-social-science": { elasticity: "moderate", rationale: "Cheaper analysis expands research volume, but funding-constrained" },

  // Low: demand is mostly fixed or cost-center
  "office-admin":             { elasticity: "low", rationale: "Internal cost center: cheaper admin reduces headcount, doesn't create more admin demand" },
  "protective-service":       { elasticity: "low", rationale: "Government-funded; budget-constrained, not demand-elastic" },
  "production":               { elasticity: "low", rationale: "Manufacturing demand set by product markets, not production labor cost" },
  "transportation":           { elasticity: "low", rationale: "Freight/logistics demand tied to trade volume, not labor cost" },
  "building-grounds":         { elasticity: "low", rationale: "Cleaning demand set by square footage, not labor cost" },
  "farming-fishing":          { elasticity: "low", rationale: "Agricultural demand is food consumption, which is highly inelastic" },
  "construction":             { elasticity: "low", rationale: "Construction demand set by housing/infrastructure markets, not labor cost" },
  "installation-repair":      { elasticity: "low", rationale: "Repair demand set by equipment base, not labor cost" },
};

export const DEMAND_ELASTICITY_META: Record<DemandElasticity, { label: string; color: string; description: string }> = {
  high: {
    label: "High",
    color: "#10B981",
    description: "Cheaper output historically drives large demand expansion — automation may increase employment",
  },
  moderate: {
    label: "Moderate",
    color: "#F59E0B",
    description: "Some unmet demand exists — cost reduction may partially offset displacement",
  },
  low: {
    label: "Low",
    color: "#EF4444",
    description: "Demand is largely fixed — cost reduction leads primarily to headcount reduction",
  },
};

/**
 * Maps economy SOC groups to representative job profiles in the task visualizer.
 * Each SOC group links to the most relevant individual job(s) available.
 */
export const SOC_TO_JOB_IDS: Record<string, string[]> = {
  "management": ["project-manager", "construction-manager", "restaurant-manager", "retail-store-manager"],
  "business-financial": ["accountant", "financial-analyst", "hr-specialist", "supply-chain-analyst", "compliance-officer", "claims-adjuster", "tax-preparer"],
  "computer-math": ["software-developer", "data-analyst", "product-manager"],
  "architecture-engineering": ["electrician", "construction-manager", "architect", "civil-engineer"],
  "life-physical-social-science": ["data-analyst", "research-scientist"],
  "community-social": ["social-worker"],
  "legal": ["lawyer", "paralegal"],
  "education": ["teacher-k12"],
  "arts-media": ["graphic-designer", "ux-designer", "journalist", "translator-interpreter", "photographer"],
  "healthcare-practitioners": ["physician", "pharmacist", "registered-nurse", "dental-hygienist", "radiologist"],
  "healthcare-support": ["registered-nurse"],
  "protective-service": [],
  "food-serving": ["restaurant-manager"],
  "building-grounds": [],
  "personal-care": ["home-health-aide"],
  "sales": ["sales-representative", "real-estate-agent"],
  "office-admin": ["executive-assistant", "customer-service-rep", "bookkeeper"],
  "farming-fishing": [],
  "construction": ["electrician", "plumber", "construction-manager"],
  "installation-repair": ["electrician", "plumber"],
  "production": [],
  "transportation": ["truck-driver"],
};

/**
 * Calculate the percentage of an occupation group's tasks that are
 * economically automatable at a given year, based on cost crossover.
 */
/**
 * Deployment overhead: real-world automation costs beyond raw API calls.
 * Same 5x multiplier used in job-tasks.ts crossover calculations.
 */
export const DEPLOYMENT_OVERHEAD = 5;

/**
 * Scenario multipliers for cost decline rate sensitivity analysis.
 *
 * The baseline decline rates (e.g. 44% annual for information-processing) are
 * extrapolated from 2020-2026 AI inference cost trends. These could plateau
 * (diminishing returns), continue (baseline), or accelerate (algorithmic
 * breakthroughs). Scenario analysis makes this uncertainty visible.
 */
export const DECLINE_RATE_SCENARIOS = {
  slow: { multiplier: 0.5, label: "Slow", description: "Cost improvements decelerate — diminishing returns on compute efficiency" },
  baseline: { multiplier: 1.0, label: "Baseline", description: "Current trends continue — inference costs decline at observed 2020-2026 rates" },
  fast: { multiplier: 1.5, label: "Fast", description: "Algorithmic breakthroughs accelerate — cost improvements compound faster" },
} as const;

export type ScenarioKey = keyof typeof DECLINE_RATE_SCENARIOS;

/**
 * Calculate the percentage of an occupation group's tasks where AI has
 * economic viability at a given year, accounting for industry adoption speed.
 *
 * The industry speed multiplier shifts adoption timing per task category:
 * each task's pressure is evaluated at (yearsFromNow - adoptionLag), where
 * adoptionLag = CATEGORY_ADOPTION_LAG[cat] * industrySpeed. This delays
 * the sigmoid curve for slower-adopting industries.
 *
 * When applyIndustrySpeed is false (default for backward compatibility),
 * returns raw economic pressure without adoption lag.
 *
 * scenarioMultiplier scales the cost decline rates: 0.5 = slow (rates halve),
 * 1.0 = baseline, 1.5 = fast (rates 50% higher). This makes the model's
 * sensitivity to its most uncertain parameter visible to users.
 */
export function getAutomationPercentAtYear(
  group: OccupationGroup,
  year: number,
  applyIndustrySpeed: boolean = false,
  scenarioMultiplier: number = 1.0
): number {
  const yearsFromNow = year - 2026;
  if (yearsFromNow < 0) return 0;

  const industrySpeed = applyIndustrySpeed ? (SOC_INDUSTRY_SPEED[group.id] ?? 1.0) : 0;

  let automatedShare = 0;
  for (const [cat, share] of Object.entries(group.taskComposition) as [TaskCategory, number][]) {
    // For adoption-adjusted view, shift effective time by the institutional lag
    const adoptionLag = applyIndustrySpeed ? CATEGORY_ADOPTION_LAG[cat] * industrySpeed : 0;
    const effectiveYears = Math.max(0, yearsFromNow - adoptionLag);

    // Apply scenario multiplier to decline rate (clamped to [0, 0.95] to avoid negative costs)
    const effectiveDeclineRate = Math.min(0.95, CATEGORY_DECLINE_RATES[cat] * scenarioMultiplier);
    const computeCost = CATEGORY_COMPUTE_COSTS[cat] * DEPLOYMENT_OVERHEAD * Math.pow(1 - effectiveDeclineRate, effectiveYears);
    // Sigmoid-based automation pressure: smooth transition instead of binary cutoff.
    // When computeCost == humanWage, pressure is 50%. Steepness k=6 gives a reasonable
    // ramp: ~5% pressure at 2x human cost, ~95% pressure at 0.5x human cost.
    const ratio = computeCost / group.medianWageHr;
    const k = 6;
    const pressure = 1 / (1 + Math.exp(k * (ratio - 1)));
    automatedShare += share * pressure;
  }
  return Math.round(automatedShare * 100);
}

/**
 * Get total workers (thousands) affected at a given automation threshold
 * across the full economy at a given year.
 */
export function getWorkersAffectedAtYear(
  year: number,
  thresholdPercent: number = 50,
  applyIndustrySpeed: boolean = false,
  scenarioMultiplier: number = 1.0
): { total: number; byTier: Record<IncomeTier, number> } {
  const byTier: Record<IncomeTier, number> = { low: 0, middle: 0, high: 0 };
  let total = 0;

  for (const group of OCCUPATION_GROUPS) {
    const pct = getAutomationPercentAtYear(group, year, applyIndustrySpeed, scenarioMultiplier);
    if (pct >= thresholdPercent) {
      total += group.employment;
      byTier[group.incomeTier] += group.employment;
    }
  }

  return { total, byTier };
}

/**
 * Generate timeline data for the full economy.
 */
export function generateEconomyTimeline(
  startYear: number = 2026,
  endYear: number = 2040,
  applyIndustrySpeed: boolean = false,
  scenarioMultiplier: number = 1.0
): {
  year: number;
  lowAutomated: number;
  middleAutomated: number;
  highAutomated: number;
  totalWorkersSignificant: number;
}[] {
  const data = [];
  for (let year = startYear; year <= endYear; year++) {
    const tierEmployment: Record<IncomeTier, number> = { low: 0, middle: 0, high: 0 };
    const tierAutomated: Record<IncomeTier, number> = { low: 0, middle: 0, high: 0 };

    for (const group of OCCUPATION_GROUPS) {
      tierEmployment[group.incomeTier] += group.employment;
      const pct = getAutomationPercentAtYear(group, year, applyIndustrySpeed, scenarioMultiplier);
      // Weight by how much of the group's tasks are automated
      tierAutomated[group.incomeTier] += group.employment * (pct / 100);
    }

    const workersSignificant = getWorkersAffectedAtYear(year, 50, applyIndustrySpeed, scenarioMultiplier);

    data.push({
      year,
      lowAutomated: Math.round((tierAutomated.low / tierEmployment.low) * 100),
      middleAutomated: Math.round((tierAutomated.middle / tierEmployment.middle) * 100),
      highAutomated: Math.round((tierAutomated.high / tierEmployment.high) * 100),
      totalWorkersSignificant: workersSignificant.total,
    });
  }
  return data;
}
