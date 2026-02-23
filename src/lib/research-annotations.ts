export type EstimateType = "exposure" | "observed" | "mixed";

export interface ResearchAnnotation {
  note: string;
  estimateType: EstimateType;
}

export const ESTIMATE_TYPE_LABELS: Record<EstimateType, string> = {
  exposure: "Exposure-based estimate",
  observed: "Observed effect",
  mixed: "Mixed evidence",
};

export const ESTIMATE_TYPE_DESCRIPTIONS: Record<EstimateType, string> = {
  exposure: "Projection based on task overlap and AI capability mapping",
  observed: "Based on RCTs, field experiments, or platform data showing actual changes",
  mixed: "Combines exposure-based projections with some observed empirical data",
};

const ANNOTATIONS: Record<string, ResearchAnnotation> = {
  "entry-level-wage-impact": {
    note:
      "Strong empirical support: Stanford payroll study found ~20% headcount decline for developers aged 22\u201325 (Brynjolfsson et al., 2025); Dallas Fed CPS data shows employment share of young workers in AI-exposed occupations fell from 16.4% to 15.5%; IMF finds employment 3.6% lower in AI-vulnerable occupations after 5 years, with young workers most exposed.",
    estimateType: "mixed",
  },
  "freelancer-rate-impact": {
    note:
      "Confirmed by multiple sources: Ramp firm spending data shows freelance marketplace spend fell from 0.66% to 0.14% of total business spend while AI provider spend rose to ~3%. Digital trace data confirms substitution in writing and translation (del Rio-Chanona et al., 2025).",
    estimateType: "observed",
  },
  "high-skill-wage-premium": {
    note:
      "Complicated by new evidence: AI exposure measures converge toward high-wage jobs (del Rio-Chanona et al., 2025), but Brookings research found high-skill freelancers are disproportionately affected \u2014 not insulated (Hosseini & Lichtinger, 2025). HBS data shows 22% increase in augmentation-prone job postings, suggesting the premium may accrue to AI-complementary skills specifically.",
    estimateType: "mixed",
  },
  "customer-service-automation": {
    note:
      "Supported: Stanford payroll data shows early-career CS worker declines similar to software developers (Brynjolfsson et al., 2025). One of few areas with both exposure estimates and observed substitution from field data.",
    estimateType: "mixed",
  },
  "tech-sector-displacement": {
    note:
      "Key nuance: HBS job postings data shows a 17% decrease in highly automatable tech occupations but a 22% increase in augmentation-prone roles (Chen et al., 2025) \u2014 net displacement may be lower than gross.",
    estimateType: "mixed",
  },
  "overall-us-displacement": {
    note:
      "Macro data remains reassuring: Yale Budget Lab and ICLE reviews find no clear economy-wide displacement through aggregate unemployment data, though the occupational mix is changing faster than past tech disruptions.",
    estimateType: "exposure",
  },
  "total-us-jobs-lost": {
    note:
      "Projection based on exposure models. Empirical data from ADP payroll analysis and job postings so far show occupational restructuring rather than net job destruction at the macro level.",
    estimateType: "exposure",
  },
  "white-collar-professional-displacement": {
    note:
      "Exposure-based projection. Early evidence from HBS shows job postings in automatable professional roles declining 17%, but augmentation-prone professional roles growing 22% (Chen et al., 2025).",
    estimateType: "exposure",
  },
  "creative-industry-displacement": {
    note:
      "Partially observed: Ramp spending data shows freelance marketplace spend (heavily creative) collapsed from 0.66% to 0.14% of total business spend. Upwork and Fiverr have reported significant volume declines in writing and design categories.",
    estimateType: "mixed",
  },
  "healthcare-admin-displacement": {
    note:
      "Mostly exposure-based. Healthcare admin has high task automability scores but adoption has been slower than tech or creative sectors due to regulatory requirements and EHR integration challenges.",
    estimateType: "exposure",
  },
  "education-sector-displacement": {
    note:
      "Exposure-based with early signals. The collapse of Chegg subscribers (~50%) after ChatGPT launch is an observed effect in adjacent education services, though core teaching roles remain among the least automatable.",
    estimateType: "exposure",
  },
  "median-wage-impact": {
    note:
      "Mixed signals: del Rio-Chanona et al. (2025) find productivity gains of 20\u201360% in experiments, which should push wages up, but the Anthropic Economic Index shows automation (45%) competing with augmentation (52%) \u2014 the net wage effect depends on which pattern dominates.",
    estimateType: "exposure",
  },
  "geographic-wage-divergence": {
    note:
      "Exposure-based projection reinforced by observed AI investment clustering. Each AI job in a hub city creates 3\u20135 additional local service jobs through spatial multiplier effects.",
    estimateType: "exposure",
  },
  "ai-adoption-rate": {
    note:
      "Directly observed from Census Bureau Business Trends survey data, supplemented by corporate earnings call disclosures and Ramp firm spending analysis.",
    estimateType: "observed",
  },
  "earnings-call-ai-mentions": {
    note:
      "Directly observed from NLP analysis of S&P 500 earnings call transcripts. Companies mentioning AI + workforce subsequently show headcount growth 3.2pp lower than non-mentioners.",
    estimateType: "observed",
  },
};

export function getResearchAnnotation(
  slug: string
): ResearchAnnotation | null {
  return ANNOTATIONS[slug] ?? null;
}
