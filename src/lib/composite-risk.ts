/**
 * Composite Displacement Risk Scoring
 *
 * Combines five research-backed dimensions into a single net displacement risk
 * score (0-10) for each major occupation group. This goes beyond simple
 * "AI exposure" scores (a la Karpathy, Eloundou et al.) by incorporating:
 *
 * 1. Technical Exposure - how many tasks CAN AI do? (Eloundou et al., Felten et al., Yale Budget Lab)
 * 2. Institutional Adoption Speed - how fast WILL the sector adopt? (Acemoglu & Restrepo, Brynjolfsson)
 * 3. Worker Adaptability - can displaced workers transition? (Manning & Aguirre NBER w34705)
 * 4. Demand Elasticity - does cheaper output create more demand? (Bessen 2019, Jevons Paradox)
 * 5. Complementarity - does AI replace or enhance? (Baslandze et al. 2026 CFO Survey,
 *    informed by job dimensionality per Gans & Goldfarb 2024 O-Ring Automation)
 *
 * The first two are "pressure" dimensions (drive displacement up).
 * The last three are "absorption" dimensions (soften displacement).
 *
 * Net Risk = w1*Exposure + w2*AdoptionSpeed - w3*Adaptability - w4*Elasticity - w5*Complementarity
 * (bounded to 0-10)
 */

import {
  OCCUPATION_GROUPS,
  SOC_EXPOSURE_SCORES,
  DEMAND_ELASTICITY,
  CFO_SURVEY_NEI,
  type OccupationGroup,
} from "@/data/economy-occupations";
import { SOC_INDUSTRY_SPEED } from "@/data/industry-adoption-speed";
import {
  WEIGHTS,
  ELASTICITY_SCORES,
  adoptionSpeedScore,
  complementarityFromNEI,
  estimateComplementarityFromTasks,
  getEffectiveDimensions as getEffectiveDimsFromComposition,
  dimensionalityAdjustment,
  clamp010,
  computeNetRisk,
} from "./scoring-shared";

export interface DimensionScores {
  technicalExposure: number;    // 0-10: higher = more exposed
  adoptionSpeed: number;        // 0-10: higher = faster adoption (more pressure)
  adaptability: number;         // 0-10: higher = more adaptable (less risk)
  demandElasticity: number;     // 0-10: higher = more elastic (less risk)
  complementarity: number;      // 0-10: higher = more enhancement (less risk)
  netRisk: number;              // 0-10: composite displacement risk
}

export interface DimensionalityMeta {
  effectiveDimensions: number;  // task clusters with >= 10% time share
  complementarityBase: number;  // score before dimensionality adjustment
  dimensionalityAdj: number;    // the ±adjustment applied
  source: "cfo" | "heuristic";  // whether base came from CFO survey or task heuristic
}

export interface ScoredOccupation {
  group: OccupationGroup;
  scores: DimensionScores;
  rationales: Record<keyof DimensionScores, string>;
  dimensionality: DimensionalityMeta;
}

/**
 * Wrapper for backward compatibility: delegates to shared getEffectiveDimensions.
 */
export function getEffectiveDimensions(group: OccupationGroup): number {
  return getEffectiveDimsFromComposition(group.taskComposition);
}

export function scoreOccupation(group: OccupationGroup): ScoredOccupation {
  // 1. Technical Exposure (0-10)
  const exposureData = SOC_EXPOSURE_SCORES[group.id];
  const technicalExposure = exposureData?.mean ?? group.aiExposure * 10;

  // 2. Adoption Speed (0-10, higher = faster)
  const speedMultiplier = SOC_INDUSTRY_SPEED[group.id] ?? 1.0;
  const adoptionSpeed = adoptionSpeedScore(speedMultiplier);

  // 3. Adaptability (0-10)
  const adaptability = group.adaptiveCapacity * 10;

  // 4. Demand Elasticity (0-10)
  const elasticityData = DEMAND_ELASTICITY[group.id];
  const demandElasticity = elasticityData
    ? ELASTICITY_SCORES[elasticityData.elasticity]
    : 5;

  // 5. Complementarity (0-10), informed by job dimensionality
  const cfoData = CFO_SURVEY_NEI[group.id];
  const effectiveDims = getEffectiveDimensions(group);
  let complementarityBase: number;
  let dimensionalityAdj: number;
  const dimSource: "cfo" | "heuristic" = cfoData ? "cfo" : "heuristic";

  if (cfoData) {
    complementarityBase = complementarityFromNEI(cfoData.nei);
    dimensionalityAdj = dimensionalityAdjustment(effectiveDims, true);
  } else {
    complementarityBase = estimateComplementarityFromTasks(group.taskComposition);
    dimensionalityAdj = dimensionalityAdjustment(effectiveDims, false);
  }
  const complementarity = clamp010(complementarityBase + dimensionalityAdj);

  // Composite net risk
  const netRisk = computeNetRisk({
    technicalExposure, adoptionSpeed, adaptability, demandElasticity, complementarity,
  });

  const dimContext = effectiveDims <= 2
    ? ` Job has only ${effectiveDims} effective task dimension${effectiveDims === 1 ? "" : "s"}. Low-dimensional, strong firm incentive to fully automate (O-Ring risk).`
    : effectiveDims >= 5
      ? ` Job has ${effectiveDims} effective task dimensions. High-dimensional, partial automation likely augments workers (O-Ring focus effect).`
      : "";

  const rationales: Record<keyof DimensionScores, string> = {
    technicalExposure: exposureData
      ? `GPT-scored mean ${exposureData.mean.toFixed(1)}/10 across ${exposureData.count} occupations (range: ${exposureData.min}-${exposureData.max})`
      : `Eloundou et al. E1+0.5E2 score: ${(group.aiExposure * 10).toFixed(1)}/10`,
    adoptionSpeed: `Industry speed multiplier: ${speedMultiplier.toFixed(2)}x (${speedMultiplier < 1 ? "faster" : speedMultiplier > 1 ? "slower" : "baseline"} than average)`,
    adaptability: `Manning & Aguirre composite: ${group.adaptiveCapacity.toFixed(2)} (wealth: ${group.adaptiveCapacityComponents.netLiquidWealth.toFixed(2)}, skills: ${group.adaptiveCapacityComponents.skillTransferability.toFixed(2)})`,
    demandElasticity: elasticityData?.rationale ?? "No elasticity data available",
    complementarity: (cfoData
      ? `CFO survey NEI: ${cfoData.nei.toFixed(2)} (${cfoData.label})`
      : "Estimated from task composition (no CFO survey data)") + dimContext,
    netRisk: `Composite of 5 dimensions, weighted: exposure (${(WEIGHTS.technicalExposure * 100).toFixed(0)}%), speed (${(WEIGHTS.adoptionSpeed * 100).toFixed(0)}%), adaptability (${(WEIGHTS.adaptability * 100).toFixed(0)}%), elasticity (${(WEIGHTS.demandElasticity * 100).toFixed(0)}%), complementarity (${(WEIGHTS.complementarity * 100).toFixed(0)}%)`,
  };

  return {
    group,
    scores: {
      technicalExposure,
      adoptionSpeed,
      adaptability,
      demandElasticity,
      complementarity,
      netRisk,
    },
    rationales,
    dimensionality: {
      effectiveDimensions: effectiveDims,
      complementarityBase,
      dimensionalityAdj,
      source: dimSource,
    },
  };
}

export function scoreAllOccupations(): ScoredOccupation[] {
  return OCCUPATION_GROUPS.map(scoreOccupation);
}

export type DimensionKey = keyof DimensionScores;

export const DIMENSION_META: Record<
  DimensionKey,
  {
    label: string;
    shortLabel: string;
    description: string;
    source: string;
    colorScale: [string, string]; // [low, high]
    isPressure: boolean; // true = higher is worse for workers
  }
> = {
  technicalExposure: {
    label: "Technical AI Exposure",
    shortLabel: "Exposure",
    description:
      "How many of this occupation's tasks can current or near-term AI systems perform? Based on GPT-scored analysis of 342 BLS occupations validated against 6 academic exposure indices.",
    source: "Yale Budget Lab; Eloundou et al. (2023); Felten et al. (2023)",
    colorScale: ["#DCFCE7", "#DC2626"],
    isPressure: true,
  },
  adoptionSpeed: {
    label: "Institutional Adoption Speed",
    shortLabel: "Speed",
    description:
      "How quickly will firms in this sector actually deploy AI? Accounts for regulatory burden, digital maturity, competitive pressure, union density, and organizational complexity.",
    source:
      "OECD Product Market Regulation; McKinsey Digital America; Acemoglu & Restrepo (2020); Brynjolfsson et al. (2021)",
    colorScale: ["#DCFCE7", "#DC2626"],
    isPressure: true,
  },
  adaptability: {
    label: "Worker Adaptability",
    shortLabel: "Adaptability",
    description:
      "How well can workers in this group transition to new roles? Composite of net liquid wealth (financial buffer), skill transferability, geographic job density, and age demographics.",
    source: "Manning & Aguirre, NBER w34705 (2026); O*NET; SIPP 2022-2024",
    colorScale: ["#FEE2E2", "#16A34A"],
    isPressure: false,
  },
  demandElasticity: {
    label: "Demand Elasticity",
    shortLabel: "Elasticity",
    description:
      "When AI makes this sector's output cheaper, does demand expand enough to offset job losses? High elasticity means the Jevons Paradox may preserve or even grow employment.",
    source:
      "Bessen (2019); Autor & Salomons (2018); historical precedent (ATMs, textile looms, etc.)",
    colorScale: ["#FEE2E2", "#16A34A"],
    isPressure: false,
  },
  complementarity: {
    label: "AI Complementarity",
    shortLabel: "Complement",
    description:
      "Is AI primarily enhancing workers in this occupation or replacing them? Based on CFO survey data where available, estimated from task composition and job dimensionality otherwise. Jobs with more distinct task clusters (high dimensionality) tend toward augmentation via the O-Ring \"focus effect\". Automating some tasks lets workers concentrate on remaining ones, multiplying output quality.",
    source:
      "Baslandze et al. (2026) CFO Survey; Gans & Goldfarb (2024) O-Ring Automation; Autor (2024) new-tasks framework",
    colorScale: ["#FEE2E2", "#16A34A"],
    isPressure: false,
  },
  netRisk: {
    label: "Net Displacement Risk",
    shortLabel: "Net Risk",
    description:
      "Composite score combining all five dimensions. Accounts for both the pressure toward displacement AND the factors that absorb or redirect that pressure.",
    source: "Weighted composite of 5 research-backed dimensions",
    colorScale: ["#DCFCE7", "#DC2626"],
    isPressure: true,
  },
};
