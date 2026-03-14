/**
 * US Workforce by Major Occupation Group
 *
 * Data: Bureau of Labor Statistics, Occupational Employment and Wage Statistics (OEWS)
 * May 2024 release (most recent as of March 2026)
 * https://www.bls.gov/oes/current/oes_nat.htm
 *
 * Each occupation group has:
 *   - employment: thousands of workers
 *   - medianWageHr: median hourly wage
 *   - medianWageAnnual: median annual wage
 *   - taskComposition: estimated breakdown of time across task categories
 *     (derived from O*NET Generalized Work Activities mapped to each SOC group)
 *   - incomeTier: low / middle / high based on median wage
 *
 * Task composition estimates are informed by O*NET work activity prevalence
 * data for detailed occupations within each major group, aggregated to the
 * major group level. These are approximations.
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
}

/**
 * Cost decline rates by task category (same as job-tasks.ts)
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
  low: { label: "Lower income", color: "#F66B5C", range: "Under $35K/yr" },
  middle: { label: "Middle income", color: "#F59E0B", range: "$35K-$75K/yr" },
  high: { label: "Higher income", color: "#5C61F6", range: "Over $75K/yr" },
};

export const TASK_CATEGORY_META: Record<TaskCategory, { label: string; color: string }> = {
  "information-processing": { label: "Information Processing", color: "#5C61F6" },
  "communication": { label: "Communication", color: "#F66B5C" },
  "analysis-decision": { label: "Analysis & Decisions", color: "#10B981" },
  "creative-generative": { label: "Creative & Generative", color: "#F59E0B" },
  "coordination-management": { label: "Coordination", color: "#8B5CF6" },
  "physical-manual": { label: "Physical & Manual", color: "#6B7280" },
  "interpersonal": { label: "Interpersonal", color: "#EC4899" },
  "technical-specialized": { label: "Technical & Specialized", color: "#06B6D4" },
};

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
  taskComposition: Record<TaskCategory, number>
): OccupationGroup {
  const { avgCost, declineRate } = computeBlended(taskComposition);
  return {
    id, socCode, title, shortTitle, employment,
    medianWageHr, medianWageAnnual, incomeTier, taskComposition,
    avgComputeCostPerHr: avgCost, blendedCostDeclineRate: declineRate,
  };
}

export const OCCUPATION_GROUPS: OccupationGroup[] = [
  makeGroup("management", "11-0000", "Management Occupations", "Management",
    8530, 59.07, 122870, "high",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.20,
      "creative-generative": 0.05, "coordination-management": 0.25, "physical-manual": 0.00,
      "interpersonal": 0.20, "technical-specialized": 0.05 }),

  makeGroup("business-financial", "13-0000", "Business and Financial Operations", "Business & Finance",
    9740, 39.47, 82100, "high",
    { "information-processing": 0.25, "communication": 0.15, "analysis-decision": 0.25,
      "creative-generative": 0.03, "coordination-management": 0.10, "physical-manual": 0.00,
      "interpersonal": 0.12, "technical-specialized": 0.10 }),

  makeGroup("computer-math", "15-0000", "Computer and Mathematical Occupations", "Tech & Computing",
    4900, 52.88, 110000, "high",
    { "information-processing": 0.15, "communication": 0.10, "analysis-decision": 0.15,
      "creative-generative": 0.10, "coordination-management": 0.05, "physical-manual": 0.00,
      "interpersonal": 0.10, "technical-specialized": 0.35 }),

  makeGroup("architecture-engineering", "17-0000", "Architecture and Engineering", "Architecture & Engineering",
    2800, 45.37, 94370, "high",
    { "information-processing": 0.10, "communication": 0.10, "analysis-decision": 0.20,
      "creative-generative": 0.15, "coordination-management": 0.10, "physical-manual": 0.05,
      "interpersonal": 0.05, "technical-specialized": 0.25 }),

  makeGroup("life-physical-social-science", "19-0000", "Life, Physical, and Social Science", "Sciences",
    1460, 39.35, 81860, "high",
    { "information-processing": 0.20, "communication": 0.10, "analysis-decision": 0.30,
      "creative-generative": 0.10, "coordination-management": 0.05, "physical-manual": 0.10,
      "interpersonal": 0.05, "technical-specialized": 0.10 }),

  makeGroup("community-social", "21-0000", "Community and Social Service", "Social Services",
    2590, 25.02, 52050, "middle",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.10,
      "creative-generative": 0.02, "coordination-management": 0.10, "physical-manual": 0.05,
      "interpersonal": 0.40, "technical-specialized": 0.08 }),

  makeGroup("legal", "23-0000", "Legal Occupations", "Legal",
    1130, 45.76, 95170, "high",
    { "information-processing": 0.25, "communication": 0.20, "analysis-decision": 0.20,
      "creative-generative": 0.05, "coordination-management": 0.05, "physical-manual": 0.00,
      "interpersonal": 0.15, "technical-specialized": 0.10 }),

  makeGroup("education", "25-0000", "Educational Instruction and Library", "Education",
    9120, 28.82, 59950, "middle",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.10,
      "creative-generative": 0.10, "coordination-management": 0.05, "physical-manual": 0.05,
      "interpersonal": 0.40, "technical-specialized": 0.05 }),

  makeGroup("arts-media", "27-0000", "Arts, Design, Entertainment, Sports, and Media", "Arts & Media",
    2070, 29.68, 61730, "middle",
    { "information-processing": 0.10, "communication": 0.15, "analysis-decision": 0.05,
      "creative-generative": 0.40, "coordination-management": 0.05, "physical-manual": 0.10,
      "interpersonal": 0.10, "technical-specialized": 0.05 }),

  makeGroup("healthcare-practitioners", "29-0000", "Healthcare Practitioners and Technical", "Healthcare (Clinical)",
    9290, 42.28, 87930, "high",
    { "information-processing": 0.15, "communication": 0.05, "analysis-decision": 0.15,
      "creative-generative": 0.02, "coordination-management": 0.05, "physical-manual": 0.30,
      "interpersonal": 0.15, "technical-specialized": 0.13 }),

  makeGroup("healthcare-support", "31-0000", "Healthcare Support Occupations", "Healthcare (Support)",
    7110, 17.13, 35620, "low",
    { "information-processing": 0.10, "communication": 0.05, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.45,
      "interpersonal": 0.25, "technical-specialized": 0.05 }),

  makeGroup("protective-service", "33-0000", "Protective Service Occupations", "Protective Services",
    3430, 24.42, 50800, "middle",
    { "information-processing": 0.10, "communication": 0.10, "analysis-decision": 0.10,
      "creative-generative": 0.00, "coordination-management": 0.10, "physical-manual": 0.35,
      "interpersonal": 0.20, "technical-specialized": 0.05 }),

  makeGroup("food-serving", "35-0000", "Food Preparation and Serving Related", "Food & Serving",
    13290, 14.69, 30550, "low",
    { "information-processing": 0.05, "communication": 0.05, "analysis-decision": 0.02,
      "creative-generative": 0.03, "coordination-management": 0.05, "physical-manual": 0.60,
      "interpersonal": 0.15, "technical-specialized": 0.05 }),

  makeGroup("building-grounds", "37-0000", "Building and Grounds Cleaning and Maintenance", "Building & Grounds",
    5020, 16.18, 33650, "low",
    { "information-processing": 0.03, "communication": 0.02, "analysis-decision": 0.02,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.80,
      "interpersonal": 0.03, "technical-specialized": 0.05 }),

  makeGroup("personal-care", "39-0000", "Personal Care and Service Occupations", "Personal Care",
    3600, 16.22, 33740, "low",
    { "information-processing": 0.05, "communication": 0.05, "analysis-decision": 0.03,
      "creative-generative": 0.05, "coordination-management": 0.02, "physical-manual": 0.40,
      "interpersonal": 0.35, "technical-specialized": 0.05 }),

  makeGroup("sales", "41-0000", "Sales and Related Occupations", "Sales",
    13300, 16.02, 33320, "low",
    { "information-processing": 0.15, "communication": 0.20, "analysis-decision": 0.05,
      "creative-generative": 0.03, "coordination-management": 0.02, "physical-manual": 0.15,
      "interpersonal": 0.35, "technical-specialized": 0.05 }),

  makeGroup("office-admin", "43-0000", "Office and Administrative Support", "Office & Admin",
    17640, 20.82, 43310, "middle",
    { "information-processing": 0.40, "communication": 0.20, "analysis-decision": 0.05,
      "creative-generative": 0.02, "coordination-management": 0.10, "physical-manual": 0.05,
      "interpersonal": 0.10, "technical-specialized": 0.08 }),

  makeGroup("farming-fishing", "45-0000", "Farming, Fishing, and Forestry", "Farming & Forestry",
    530, 17.35, 36090, "low",
    { "information-processing": 0.03, "communication": 0.02, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.75,
      "interpersonal": 0.02, "technical-specialized": 0.08 }),

  makeGroup("construction", "47-0000", "Construction and Extraction Occupations", "Construction",
    7070, 25.54, 53120, "middle",
    { "information-processing": 0.05, "communication": 0.03, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.65,
      "interpersonal": 0.02, "technical-specialized": 0.15 }),

  makeGroup("installation-repair", "49-0000", "Installation, Maintenance, and Repair", "Installation & Repair",
    5880, 25.76, 53580, "middle",
    { "information-processing": 0.05, "communication": 0.03, "analysis-decision": 0.10,
      "creative-generative": 0.00, "coordination-management": 0.05, "physical-manual": 0.55,
      "interpersonal": 0.02, "technical-specialized": 0.20 }),

  makeGroup("production", "51-0000", "Production Occupations", "Production",
    8560, 19.53, 40630, "middle",
    { "information-processing": 0.05, "communication": 0.03, "analysis-decision": 0.05,
      "creative-generative": 0.00, "coordination-management": 0.02, "physical-manual": 0.70,
      "interpersonal": 0.02, "technical-specialized": 0.13 }),

  makeGroup("transportation", "53-0000", "Transportation and Material Moving", "Transportation",
    13640, 18.61, 38710, "middle",
    { "information-processing": 0.10, "communication": 0.03, "analysis-decision": 0.03,
      "creative-generative": 0.00, "coordination-management": 0.02, "physical-manual": 0.70,
      "interpersonal": 0.02, "technical-specialized": 0.10 }),
];

export const TOTAL_EMPLOYMENT = OCCUPATION_GROUPS.reduce((s, g) => s + g.employment, 0); // thousands

/**
 * Calculate the percentage of an occupation group's tasks that are
 * economically automatable at a given year, based on cost crossover.
 */
export function getAutomationPercentAtYear(group: OccupationGroup, year: number): number {
  const yearsFromNow = year - 2026;
  if (yearsFromNow < 0) return 0;

  let automatedShare = 0;
  for (const [cat, share] of Object.entries(group.taskComposition) as [TaskCategory, number][]) {
    const computeCost = CATEGORY_COMPUTE_COSTS[cat] * Math.pow(1 - CATEGORY_DECLINE_RATES[cat], yearsFromNow);
    // Task is automatable when compute cost < human wage for that task-share
    if (computeCost < group.medianWageHr) {
      automatedShare += share;
    }
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
