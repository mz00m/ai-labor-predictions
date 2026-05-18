/**
 * Maps Karpathy's 342 BLS occupations to our 5-dimensional risk framework.
 *
 * Each occupation inherits dimension scores from its parent SOC major group,
 * with the exposure dimension using Karpathy's per-occupation GPT score (0-10).
 *
 * Complementarity is informed by job dimensionality (Gans & Goldfarb 2024):
 * jobs with more distinct task clusters tend toward augmentation, while
 * low-dimensional jobs face stronger firm incentive for full automation.
 */

import { DIMENSION_META, type DimensionKey, type DimensionalityMeta } from "./composite-risk";
import {
  OCCUPATION_GROUPS,
  DEMAND_ELASTICITY,
  CFO_SURVEY_NEI,
} from "@/data/economy-occupations";
import { SOC_INDUSTRY_SPEED } from "@/data/industry-adoption-speed";
import {
  WEIGHTS,
  ELASTICITY_SCORES,
  adoptionSpeedScore,
  complementarityFromNEI,
  estimateComplementarityFromTasks,
  dimensionalityAdjustment,
  clamp010,
  computeNetRisk,
} from "./scoring-shared";

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
  dimensionality: DimensionalityMeta;
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


export interface KarpathyScoringOptions {
  dimensionalityEnabled?: boolean; // default true
  useRlFeasibility?: boolean; // swap Dimension 1 to Tomei RL Feasibility Index
  rlScores?: Record<string, number>; // slug → RL score (0-10)
}

export function scoreKarpathyOccupations(
  rawData: KarpathyOccupation[],
  options: KarpathyScoringOptions = {}
): ScoredKarpathyOccupation[] {
  const { dimensionalityEnabled = true, useRlFeasibility = false, rlScores } = options;
  // Build lookup for SOC group data
  const socLookup = new Map(OCCUPATION_GROUPS.map((g) => [g.id, g]));

  return rawData
    .filter((occ) => occ.jobs && occ.jobs > 0)
    .map((occ) => {
      const socGroupId = getSocGroupId(occ);
      const socGroup = socLookup.get(socGroupId);

      // 1. Technical Exposure: Karpathy GPT score or Tomei RL Feasibility
      const technicalExposure = (useRlFeasibility && rlScores?.[occ.slug] != null)
        ? rlScores[occ.slug]
        : occ.exposure;

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

      // 5. Complementarity: from CFO survey or task composition estimate,
      //    informed by job dimensionality (O-Ring model)
      const cfoData = CFO_SURVEY_NEI[socGroupId];
      let complementarity: number;
      let complementarityBase: number;
      let dimensionalityAdj: number;
      let dimSource: "cfo" | "heuristic";
      const effectiveDims = socGroup
        ? Object.values(socGroup.taskComposition).filter((share) => share >= 0.10).length
        : 4; // default mid-range

      if (cfoData) {
        dimSource = "cfo";
        complementarityBase = complementarityFromNEI(cfoData.nei);
        dimensionalityAdj = (socGroup && dimensionalityEnabled)
          ? dimensionalityAdjustment(effectiveDims, true, 3)
          : 0;
        complementarity = clamp010(complementarityBase + dimensionalityAdj);
      } else if (socGroup) {
        dimSource = "heuristic";
        complementarityBase = estimateComplementarityFromTasks(socGroup.taskComposition);
        dimensionalityAdj = dimensionalityEnabled
          ? dimensionalityAdjustment(effectiveDims, false, 3)
          : 0;
        complementarity = clamp010(complementarityBase + dimensionalityAdj);
      } else {
        dimSource = "heuristic";
        complementarityBase = 5;
        dimensionalityAdj = 0;
        complementarity = 5;
      }

      // Composite net risk
      const netRisk = computeNetRisk({
        technicalExposure, adoptionSpeed, adaptability, demandElasticity, complementarity,
      });

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
        dimensionality: {
          effectiveDimensions: effectiveDims,
          complementarityBase,
          dimensionalityAdj,
          source: dimSource,
        },
      };
    });
}

export { DIMENSION_META, type DimensionKey };
