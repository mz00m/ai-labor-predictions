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
import { TASK_CATEGORY_META, CATEGORY_DECLINE_RATES } from "./task-categories";

// Re-export for consumers
export { type TaskCategory, TASK_CATEGORY_META, CATEGORY_DECLINE_RATES } from "./task-categories";

export type IncomeTier = "low" | "middle" | "high";

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
  womenPercent: number
): OccupationGroup {
  const { avgCost, declineRate } = computeBlended(taskComposition);
  return {
    id, socCode, title, shortTitle, employment,
    medianWageHr, medianWageAnnual, incomeTier, taskComposition,
    avgComputeCostPerHr: avgCost, blendedCostDeclineRate: declineRate,
    womenPercent,
  };
}

/**
 * Gender data: Women's share of employment by SOC major group.
 * Source: BLS Current Population Survey (CPS) 2024 annual averages, Table 11:
 * "Employed persons by detailed occupation, sex, race, and Hispanic or Latino ethnicity"
 * https://www.bls.gov/cps/cpsaat11.htm
 */
export const OCCUPATION_GROUPS: OccupationGroup[] = [
  makeGroup("management", "11-0000", "Management Occupations", "Management",
    10967, 58.70, 122090, "high",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.20,
      "creative-generative": 0.05, "coordination-management": 0.25, "physical-manual": 0.00,
      "interpersonal": 0.20, "technical-specialized": 0.05 }, 47),

  makeGroup("business-financial", "13-0000", "Business and Financial Operations", "Business & Finance",
    10351, 38.90, 80910, "high",
    { "information-processing": 0.25, "communication": 0.15, "analysis-decision": 0.25,
      "creative-generative": 0.03, "coordination-management": 0.10, "physical-manual": 0.00,
      "interpersonal": 0.12, "technical-specialized": 0.10 }, 35),

  makeGroup("computer-math", "15-0000", "Computer and Mathematical Occupations", "Tech & Computing",
    5193, 50.89, 105850, "high",
    { "information-processing": 0.15, "communication": 0.10, "analysis-decision": 0.15,
      "creative-generative": 0.10, "coordination-management": 0.05, "physical-manual": 0.00,
      "interpersonal": 0.10, "technical-specialized": 0.35 }, 26),

  makeGroup("architecture-engineering", "17-0000", "Architecture and Engineering", "Architecture & Engineering",
    2567, 45.37, 94370, "high",
    { "information-processing": 0.10, "communication": 0.10, "analysis-decision": 0.20,
      "creative-generative": 0.15, "coordination-management": 0.10, "physical-manual": 0.05,
      "interpersonal": 0.05, "technical-specialized": 0.25 }, 16),

  makeGroup("life-physical-social-science", "19-0000", "Life, Physical, and Social Science", "Sciences",
    1447, 39.35, 81860, "high",
    { "information-processing": 0.20, "communication": 0.10, "analysis-decision": 0.30,
      "creative-generative": 0.10, "coordination-management": 0.05, "physical-manual": 0.10,
      "interpersonal": 0.05, "technical-specialized": 0.10 }, 48),

  makeGroup("community-social", "21-0000", "Community and Social Service", "Social Services",
    2570, 27.66, 57530, "middle",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.10,
      "creative-generative": 0.02, "coordination-management": 0.10, "physical-manual": 0.05,
      "interpersonal": 0.40, "technical-specialized": 0.08 }, 67),

  makeGroup("legal", "23-0000", "Legal Occupations", "Legal",
    1273, 48.07, 99990, "high",
    { "information-processing": 0.25, "communication": 0.20, "analysis-decision": 0.20,
      "creative-generative": 0.05, "coordination-management": 0.05, "physical-manual": 0.00,
      "interpersonal": 0.15, "technical-specialized": 0.10 }, 53),

  makeGroup("education", "25-0000", "Educational Instruction and Library", "Education",
    8948, 28.47, 59220, "middle",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.10,
      "creative-generative": 0.10, "coordination-management": 0.05, "physical-manual": 0.05,
      "interpersonal": 0.40, "technical-specialized": 0.05 }, 73),

  makeGroup("arts-media", "27-0000", "Arts, Design, Entertainment, Sports, and Media", "Arts & Media",
    2099, 28.91, 60130, "middle",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.05,
      "creative-generative": 0.40, "coordination-management": 0.05, "physical-manual": 0.10,
      "interpersonal": 0.10, "technical-specialized": 0.05 }, 52),

  makeGroup("healthcare-practitioners", "29-0000", "Healthcare Practitioners and Technical", "Healthcare (Clinical)",
    9593, 42.28, 87930, "high",
    { "information-processing": 0.15, "communication": 0.05, "analysis-decision": 0.15,
      "creative-generative": 0.02, "coordination-management": 0.05, "physical-manual": 0.30,
      "interpersonal": 0.15, "technical-specialized": 0.13 }, 76),

  makeGroup("healthcare-support", "31-0000", "Healthcare Support Occupations", "Healthcare (Support)",
    7448, 17.13, 35620, "low",
    { "information-processing": 0.10, "communication": 0.05, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.45,
      "interpersonal": 0.25, "technical-specialized": 0.05 }, 87),

  makeGroup("protective-service", "33-0000", "Protective Service Occupations", "Protective Services",
    3655, 24.42, 50800, "middle",
    { "information-processing": 0.10, "communication": 0.10, "analysis-decision": 0.10,
      "creative-generative": 0.00, "coordination-management": 0.10, "physical-manual": 0.35,
      "interpersonal": 0.20, "technical-specialized": 0.05 }, 22),

  makeGroup("food-serving", "35-0000", "Food Preparation and Serving Related", "Food & Serving",
    13613, 14.69, 30550, "low",
    { "information-processing": 0.05, "communication": 0.05, "analysis-decision": 0.02,
      "creative-generative": 0.03, "coordination-management": 0.05, "physical-manual": 0.60,
      "interpersonal": 0.15, "technical-specialized": 0.05 }, 62),

  makeGroup("building-grounds", "37-0000", "Building and Grounds Cleaning and Maintenance", "Building & Grounds",
    4496, 16.18, 33650, "low",
    { "information-processing": 0.03, "communication": 0.02, "analysis-decision": 0.02,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.80,
      "interpersonal": 0.03, "technical-specialized": 0.05 }, 37),

  makeGroup("personal-care", "39-0000", "Personal Care and Service Occupations", "Personal Care",
    3160, 16.22, 33740, "low",
    { "information-processing": 0.05, "communication": 0.05, "analysis-decision": 0.03,
      "creative-generative": 0.05, "coordination-management": 0.02, "physical-manual": 0.40,
      "interpersonal": 0.35, "technical-specialized": 0.05 }, 76),

  makeGroup("sales", "41-0000", "Sales and Related Occupations", "Sales",
    13352, 18.01, 37460, "middle",
    { "information-processing": 0.15, "communication": 0.20, "analysis-decision": 0.05,
      "creative-generative": 0.03, "coordination-management": 0.02, "physical-manual": 0.15,
      "interpersonal": 0.35, "technical-specialized": 0.05 }, 49),

  makeGroup("office-admin", "43-0000", "Office and Administrative Support", "Office & Admin",
    18200, 20.82, 43310, "middle",
    { "information-processing": 0.40, "communication": 0.20, "analysis-decision": 0.05,
      "creative-generative": 0.02, "coordination-management": 0.10, "physical-manual": 0.05,
      "interpersonal": 0.10, "technical-specialized": 0.08 }, 42),

  makeGroup("farming-fishing", "45-0000", "Farming, Fishing, and Forestry", "Farming & Forestry",
    470, 17.35, 36090, "low",
    { "information-processing": 0.03, "communication": 0.02, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.75,
      "interpersonal": 0.02, "technical-specialized": 0.08 }, 24),

  makeGroup("construction", "47-0000", "Construction and Extraction Occupations", "Construction",
    7000, 25.54, 53120, "middle",
    { "information-processing": 0.05, "communication": 0.03, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.65,
      "interpersonal": 0.02, "technical-specialized": 0.15 }, 11),

  makeGroup("installation-repair", "49-0000", "Installation, Maintenance, and Repair", "Installation & Repair",
    5950, 25.76, 53580, "middle",
    { "information-processing": 0.05, "communication": 0.03, "analysis-decision": 0.10,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.55,
      "interpersonal": 0.02, "technical-specialized": 0.20 }, 4),

  makeGroup("production", "51-0000", "Production Occupations", "Production",
    8700, 19.53, 40630, "middle",
    { "information-processing": 0.05, "communication": 0.03, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.02, "physical-manual": 0.70,
      "interpersonal": 0.02, "technical-specialized": 0.13 }, 29),

  makeGroup("transportation", "53-0000", "Transportation and Material Moving", "Transportation",
    13100, 18.61, 38710, "middle",
    { "information-processing": 0.10, "communication": 0.03, "analysis-decision": 0.03,
      "creative-generative": 0.00, "coordination-management": 0.02, "physical-manual": 0.70,
      "interpersonal": 0.02, "technical-specialized": 0.10 }, 20),
];

export const TOTAL_EMPLOYMENT = OCCUPATION_GROUPS.reduce((s, g) => s + g.employment, 0); // thousands

/**
 * Maps economy SOC groups to representative job profiles in the task visualizer.
 * Each SOC group links to the most relevant individual job(s) available.
 */
export const SOC_TO_JOB_IDS: Record<string, string[]> = {
  "management": ["project-manager", "construction-manager", "restaurant-manager", "retail-store-manager"],
  "business-financial": ["accountant", "financial-analyst", "hr-specialist", "supply-chain-analyst"],
  "computer-math": ["software-developer", "data-analyst", "product-manager"],
  "architecture-engineering": ["electrician", "construction-manager"],
  "life-physical-social-science": ["data-analyst"],
  "community-social": ["social-worker"],
  "legal": ["lawyer", "paralegal"],
  "education": ["teacher-k12"],
  "arts-media": ["graphic-designer", "ux-designer", "journalist"],
  "healthcare-practitioners": ["physician", "pharmacist", "registered-nurse", "dental-hygienist"],
  "healthcare-support": ["registered-nurse"],
  "protective-service": [],
  "food-serving": ["restaurant-manager"],
  "building-grounds": [],
  "personal-care": ["therapist"],
  "sales": ["sales-representative", "real-estate-agent"],
  "office-admin": ["executive-assistant", "customer-service-rep"],
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

export function getAutomationPercentAtYear(group: OccupationGroup, year: number): number {
  const yearsFromNow = year - 2026;
  if (yearsFromNow < 0) return 0;

  let automatedShare = 0;
  for (const [cat, share] of Object.entries(group.taskComposition) as [TaskCategory, number][]) {
    const computeCost = CATEGORY_COMPUTE_COSTS[cat] * DEPLOYMENT_OVERHEAD * Math.pow(1 - CATEGORY_DECLINE_RATES[cat], yearsFromNow);
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
  thresholdPercent: number = 50
): { total: number; byTier: Record<IncomeTier, number> } {
  const byTier: Record<IncomeTier, number> = { low: 0, middle: 0, high: 0 };
  let total = 0;

  for (const group of OCCUPATION_GROUPS) {
    const pct = getAutomationPercentAtYear(group, year);
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
  endYear: number = 2040
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
      const pct = getAutomationPercentAtYear(group, year);
      // Weight by how much of the group's tasks are automated
      tierAutomated[group.incomeTier] += group.employment * (pct / 100);
    }

    const workersSignificant = getWorkersAffectedAtYear(year, 50);

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
