import { EvidenceTier, Prediction } from "./types";
import { computeAggregate } from "./prediction-stats";
import lastUpdatedMeta from "@/data/last-updated.json";

import techSector from "@/data/predictions/displacement/tech-sector.json";
import customerService from "@/data/predictions/displacement/customer-service.json";
import overall from "@/data/predictions/displacement/overall.json";
import whiteCollar from "@/data/predictions/displacement/white-collar-professional.json";
import creative from "@/data/predictions/displacement/creative-industry.json";
import healthcareAdmin from "@/data/predictions/displacement/healthcare-admin.json";
import education from "@/data/predictions/displacement/education-sector.json";
import financialServices from "@/data/predictions/displacement/financial-services.json";
import robotsPhysicalAutomation from "@/data/predictions/displacement/robots-physical-automation.json";
import highSkillPremium from "@/data/predictions/wages/high-skill-premium.json";
import medianWage from "@/data/predictions/wages/median-wage-impact.json";
import freelancerRate from "@/data/predictions/wages/freelancer-rate-impact.json";
import entryLevel from "@/data/predictions/wages/entry-level-impact.json";
import aiAdoption from "@/data/predictions/adoption/ai-adoption-rate.json";
import genaiWorkAdoption from "@/data/predictions/adoption/genai-work-adoption.json";
import aiBusinessFormation from "@/data/predictions/adoption/ai-business-formation.json";
import earningsCallMentions from "@/data/predictions/signals/earnings-call-mentions.json";
import workforceExposure from "@/data/predictions/exposure/workforce-exposure.json";

const allPredictions: Prediction[] = [
  // Displacement: broadest population → sector → niche roles
  overall as Prediction,
  whiteCollar as Prediction,
  techSector as Prediction,
  creative as Prediction,
  education as Prediction,
  healthcareAdmin as Prediction,
  financialServices as Prediction,
  customerService as Prediction,
  robotsPhysicalAutomation as Prediction,
  // Wages: all workers → demographic → niche
  medianWage as Prediction,
  entryLevel as Prediction,
  highSkillPremium as Prediction,
  freelancerRate as Prediction,
  // Adoption, Exposure & Signals
  aiAdoption as Prediction,
  genaiWorkAdoption as Prediction,
  aiBusinessFormation as Prediction,
  workforceExposure as Prediction,
  earningsCallMentions as Prediction,
];

export function getAllPredictions(): Prediction[] {
  return allPredictions;
}

export function getPredictionBySlug(slug: string): Prediction | undefined {
  return allPredictions.find((p) => p.slug === slug);
}

export function getPredictionsByCategory(
  category: "displacement" | "wages" | "adoption" | "signals" | "exposure"
): Prediction[] {
  return allPredictions.filter((p) => p.category === category);
}

export function getLastUpdated(): string {
  return lastUpdatedMeta.lastUpdated;
}

export interface HeroStats {
  projectedJobLoss: number;
  projectedEstimateCount: number;
  measuredJobLoss: number;
}

/**
 * Compute hero stats from actual prediction data instead of hardcoding.
 * - projectedJobLoss: weighted average from overall-us-displacement (all tiers)
 * - projectedEstimateCount: number of data points in overall-us-displacement
 * - measuredJobLoss: latest observed-only data point (dataType === "observed")
 */
export function getHeroStats(): HeroStats {
  const allTiers: EvidenceTier[] = [1, 2, 3, 4];
  const overallDisplacement = allPredictions.find(
    (p) => p.slug === "overall-us-displacement"
  );

  if (!overallDisplacement) {
    throw new Error(
      "getHeroStats: overall-us-displacement prediction not found in data-loader. " +
      "Ensure src/data/predictions/displacement/overall.json exists and is imported."
    );
  }

  const agg = computeAggregate(overallDisplacement, allTiers);
  const estimateCount = overallDisplacement.history.length;

  // Measured job loss: most recent observed data point
  const observed = overallDisplacement.history
    .filter((d) => d.dataType === "observed")
    .sort((a, b) => a.date.localeCompare(b.date));
  const measuredJobLoss = observed.length > 0
    ? Math.round(observed[observed.length - 1].value)
    : 0;

  return {
    projectedJobLoss: Math.round(Math.abs(agg.mean)),
    projectedEstimateCount: estimateCount,
    measuredJobLoss: Math.abs(measuredJobLoss),
  };
}
