/**
 * Maps Karpathy's 342 BLS occupations to our 5-dimensional risk framework.
 *
 * Each occupation inherits dimension scores from its parent SOC major group,
 * with the exposure dimension using Karpathy's per-occupation GPT score (0-10).
 */

import { DIMENSION_META, type DimensionKey } from "./composite-risk";
import {
  OCCUPATION_GROUPS,
  DEMAND_ELASTICITY,
  CFO_SURVEY_NEI,
  SOC_EXPOSURE_SCORES,
} from "@/data/economy-occupations";
import { SOC_INDUSTRY_SPEED } from "@/data/industry-adoption-speed";

/** Karpathy's raw occupation data */
export interface KarpathyOccupation {
  title: string;
  slug: string;
  category: string;
  pay: number | null;
  jobs: number | null;
  outlook: number | null;
  outlook_desc: string;
  education: string;
  exposure: number;
  exposure_rationale: string;
  url: string;
}

/** Our scored version */
export interface ScoredKarpathyOccupation {
  raw: KarpathyOccupation;
  socGroupId: string;
  scores: Record<DimensionKey, number>;
}

/** Map Karpathy categories → our SOC group IDs */
const CATEGORY_TO_SOC: Record<string, string> = {
  "management": "management",
  "business-and-financial": "business-financial",
  "computer-and-information-technology": "computer-math",
  "math": "computer-math",
  "architecture-and-engineering": "architecture-engineering",
  "life-physical-and-social-science": "life-physical-social-science",
  "community-and-social-service": "community-social",
  "legal": "legal",
  "education-training-and-library": "education",
  "arts-and-design": "arts-media",
  "media-and-communication": "arts-media",
  "entertainment-and-sports": "arts-media",
  "healthcare": "healthcare-practitioners", // maps to clinical by default
  "protective-service": "protective-service",
  "food-preparation-and-serving": "food-serving",
  "building-and-grounds-cleaning": "building-grounds",
  "personal-care-and-service": "personal-care",
  "sales": "sales",
  "office-and-administrative-support": "office-admin",
  "farming-fishing-and-forestry": "farming-fishing",
  "construction-and-extraction": "construction",
  "installation-maintenance-and-repair": "installation-repair",
  "production": "production",
  "transportation-and-material-moving": "transportation",
  "military": "protective-service",
};

/** Healthcare sub-mapping: support roles get healthcare-support SOC */
const HEALTHCARE_SUPPORT_SLUGS = new Set([
  "home-health-and-personal-care-aides",
  "nursing-assistants-and-orderlies",
  "medical-assistants",
  "dental-assistants",
  "phlebotomists",
  "psychiatric-technicians-and-aides",
  "massage-therapists",
  "veterinary-assistants-and-laboratory-animal-caretakers",
  "physical-therapist-assistants-and-aides",
  "occupational-therapy-assistants-and-aides",
  "medical-transcriptionists",
  "pharmacy-technicians",
]);

function getSocGroupId(occ: KarpathyOccupation): string {
  if (occ.category === "healthcare" && HEALTHCARE_SUPPORT_SLUGS.has(occ.slug)) {
    return "healthcare-support";
  }
  return CATEGORY_TO_SOC[occ.category] || "office-admin";
}

const WEIGHTS = {
  technicalExposure: 0.30,
  adoptionSpeed: 0.20,
  adaptability: 0.15,
  demandElasticity: 0.20,
  complementarity: 0.15,
};

const ELASTICITY_SCORES: Record<string, number> = {
  high: 8,
  moderate: 5,
  low: 2,
};

function adoptionSpeedScore(multiplier: number): number {
  return Math.max(0, Math.min(10, ((1.4 - multiplier) / 0.8) * 10));
}

function complementarityFromNEI(nei: number): number {
  return Math.max(0, Math.min(10, 10 - nei * 5));
}

export function scoreKarpathyOccupations(
  rawData: KarpathyOccupation[]
): ScoredKarpathyOccupation[] {
  // Build lookup for SOC group data
  const socLookup = new Map(OCCUPATION_GROUPS.map((g) => [g.id, g]));

  return rawData
    .filter((occ) => occ.jobs && occ.jobs > 0)
    .map((occ) => {
      const socGroupId = getSocGroupId(occ);
      const socGroup = socLookup.get(socGroupId);

      // 1. Technical Exposure: use Karpathy's per-occupation score directly
      const technicalExposure = occ.exposure;

      // 2. Adoption Speed: from SOC group
      const speedMultiplier = SOC_INDUSTRY_SPEED[socGroupId] ?? 1.0;
      const adoptionSpeed = adoptionSpeedScore(speedMultiplier);

      // 3. Adaptability: from SOC group
      const adaptability = socGroup ? socGroup.adaptiveCapacity * 10 : 5;

      // 4. Demand Elasticity: from SOC group
      const elasticityData = DEMAND_ELASTICITY[socGroupId];
      const demandElasticity = elasticityData
        ? ELASTICITY_SCORES[elasticityData.elasticity]
        : 5;

      // 5. Complementarity: from CFO survey or task composition estimate
      const cfoData = CFO_SURVEY_NEI[socGroupId];
      let complementarity: number;
      if (cfoData) {
        complementarity = complementarityFromNEI(cfoData.nei);
      } else if (socGroup) {
        const tc = socGroup.taskComposition;
        const compShare =
          tc["interpersonal"] +
          tc["physical-manual"] +
          tc["coordination-management"] * 0.5 +
          tc["analysis-decision"] * 0.3;
        const subShare =
          tc["information-processing"] + tc["communication"] * 0.5;
        const ratio = compShare / Math.max(0.1, subShare);
        complementarity = Math.max(1, Math.min(9, ratio * 3));
      } else {
        complementarity = 5;
      }

      // Net Risk composite — normalize pressure and absorption independently
      // so defensive factors (adaptability, elasticity, complementarity) can
      // fully counterbalance pressure factors (exposure, adoption speed).
      const pressureWeightSum = WEIGHTS.technicalExposure + WEIGHTS.adoptionSpeed;
      const absorptionWeightSum = WEIGHTS.adaptability + WEIGHTS.demandElasticity + WEIGHTS.complementarity;
      const pressureNorm =
        (WEIGHTS.technicalExposure * technicalExposure +
          WEIGHTS.adoptionSpeed * adoptionSpeed) / pressureWeightSum;
      const absorptionNorm =
        (WEIGHTS.adaptability * adaptability +
          WEIGHTS.demandElasticity * demandElasticity +
          WEIGHTS.complementarity * complementarity) / absorptionWeightSum;
      const netRisk = Math.max(0, Math.min(10, (pressureNorm - absorptionNorm + 10) / 2));

      return {
        raw: occ,
        socGroupId,
        scores: {
          technicalExposure,
          adoptionSpeed,
          adaptability,
          demandElasticity,
          complementarity,
          netRisk,
        },
      };
    });
}

export { DIMENSION_META, type DimensionKey };
