import { Prediction } from "./types";

import techSector from "@/data/predictions/displacement/tech-sector.json";
import customerService from "@/data/predictions/displacement/customer-service.json";
import overall from "@/data/predictions/displacement/overall.json";
import totalJobsLost from "@/data/predictions/displacement/total-jobs-lost.json";
import whiteCollar from "@/data/predictions/displacement/white-collar-professional.json";
import creative from "@/data/predictions/displacement/creative-industry.json";
import healthcareAdmin from "@/data/predictions/displacement/healthcare-admin.json";
import education from "@/data/predictions/displacement/education-sector.json";
import highSkillPremium from "@/data/predictions/wages/high-skill-premium.json";
import medianWage from "@/data/predictions/wages/median-wage-impact.json";
import freelancerRate from "@/data/predictions/wages/freelancer-rate-impact.json";
import entryLevel from "@/data/predictions/wages/entry-level-impact.json";
import geoDivergence from "@/data/predictions/wages/geographic-divergence.json";
import aiAdoption from "@/data/predictions/adoption/ai-adoption-rate.json";
import earningsCallMentions from "@/data/predictions/signals/earnings-call-mentions.json";

const allPredictions: Prediction[] = [
  techSector as Prediction,
  customerService as Prediction,
  overall as Prediction,
  totalJobsLost as Prediction,
  whiteCollar as Prediction,
  creative as Prediction,
  healthcareAdmin as Prediction,
  education as Prediction,
  highSkillPremium as Prediction,
  medianWage as Prediction,
  freelancerRate as Prediction,
  entryLevel as Prediction,
  geoDivergence as Prediction,
  aiAdoption as Prediction,
  earningsCallMentions as Prediction,
];

export function getAllPredictions(): Prediction[] {
  return allPredictions;
}

export function getPredictionBySlug(slug: string): Prediction | undefined {
  return allPredictions.find((p) => p.slug === slug);
}

export function getPredictionsByCategory(
  category: "displacement" | "wages" | "adoption" | "signals"
): Prediction[] {
  return allPredictions.filter((p) => p.category === category);
}
