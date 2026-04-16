export interface ForecastPrediction {
  id: string;
  category: "displacement" | "wages" | "adoption" | "productivity";
  title: string;
  shortTitle: string;
  unit: string;
  timeHorizon: string;
  prediction: number;
  confidenceLow: number;
  confidenceHigh: number;
  currentObserved: number | null;
  conviction: "very-high" | "high" | "moderate" | "low";
  rationale: string;
  keyCitations: string[];
  sourceCount: number;
  relatedSlug?: string;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
}

export interface RadarDimension {
  dimension: string;
  score: number;
  label: string;
  role: "pressure" | "buffer";
  description: string;
}

export interface EconomistView {
  name: string;
  affiliation: string;
  stance: "optimistic" | "cautious" | "skeptical";
  stanceLabel: string;
  summary: string;
  keyQuote: string;
}

export const ECONOMY_RADAR: RadarDimension[] = [
  {
    dimension: "technicalExposure",
    score: 6.5,
    label: "Technical Exposure",
    role: "pressure",
    description:
      "67% of US jobs have some AI task overlap. But exposure measures capability, not deployment.",
  },
  {
    dimension: "adoptionSpeed",
    score: 5.0,
    label: "Adoption Speed",
    role: "pressure",
    description:
      "Census BTOS: 17.5% of firms using AI. Doubling every ~18 months but still early.",
  },
  {
    dimension: "adaptability",
    score: 5.5,
    label: "Worker Adaptability",
    role: "buffer",
    description:
      "Mixed: high-skill workers retrain well, but net liquid wealth and geographic mobility vary widely.",
  },
  {
    dimension: "demandElasticity",
    score: 6.0,
    label: "Demand Elasticity",
    role: "buffer",
    description:
      "Historically strong. Cheaper output expands markets. ATMs didn't kill teller jobs for 30 years.",
  },
  {
    dimension: "complementarity",
    score: 6.5,
    label: "AI Complementarity",
    role: "buffer",
    description:
      "Augmentation currently dominates. QJE: AI assistance boosts productivity 15% without replacing workers.",
  },
];

export const FORECAST_PREDICTIONS: ForecastPrediction[] = [
  {
    id: "overall-displacement",
    category: "displacement",
    title: "Overall US Job Displacement by 2030",
    shortTitle: "Overall displacement",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: 1.5,
    confidenceLow: 0.5,
    confidenceHigh: 3.5,
    currentObserved: 0,
    conviction: "high",
    rationale:
      "Yale Budget Lab CPS microdata shows near-zero measured displacement through 2026. Acemoglu bounds TFP gains at 0.5-0.7% per decade via Hulten's theorem. The primary channel is non-replacement of natural attrition, not mass layoffs.",
    keyCitations: [
      "Yale Budget Lab: 0% measured displacement (CPS 2025-2026)",
      "Acemoglu: 0.53-0.66% TFP over 10 years (NBER WP 32487)",
      "PWBM: 0.75% observed (2025)",
      "Anthropic DiD: 0% aggregate effect (2026)",
    ],
    sourceCount: 118,
    relatedSlug: "overall-us-displacement",
    sliderMin: 0,
    sliderMax: 15,
    sliderStep: 0.5,
  },
  {
    id: "entry-level-displacement",
    category: "displacement",
    title: "Entry-Level Employment Decline (Ages 22-25, AI-Exposed)",
    shortTitle: "Entry-level jobs",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: 15,
    confidenceLow: 10,
    confidenceHigh: 25,
    currentObserved: 13,
    conviction: "very-high",
    rationale:
      "The clearest signal across all sources. Multiple independent datasets converge: ADP payroll, BLS CES, job postings, and international replications all show entry-level contraction in AI-exposed roles. Mechanism is reduced hiring, not firing.",
    keyCitations: [
      "Brynjolfsson/ADP: -13% ages 22-25 in top AI-exposure quintile",
      "Dallas Fed: young worker share fell 16.4% to 15.5%",
      "World Bank: entry-level postings fell 18-20%",
      "Lodefalk (Sweden): -5.5% ages 22-25 in AI-exposed SOCs",
    ],
    sourceCount: 52,
    relatedSlug: "white-collar-professional-displacement",
    sliderMin: 0,
    sliderMax: 40,
    sliderStep: 1,
  },
  {
    id: "tech-displacement",
    category: "displacement",
    title: "Tech Sector Net Employment Change",
    shortTitle: "Tech sector net",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: -2,
    confidenceLow: -5,
    confidenceHigh: 3,
    currentObserved: -1.6,
    conviction: "moderate",
    rationale:
      "K-shaped: BLS programmers -27.5% (routine coding) while software developers +17.9%. Entry-level tech hiring collapsed but experienced roles growing. Net effect near zero depends entirely on age/experience composition.",
    keyCitations: [
      "BLS OEWS: computer programmers -27.5% (2-year observed)",
      "BLS projections: software developers +17.9% (2024-2034)",
      "Chen & Stratton: 0% firm-level employment effect from Copilot",
      "Brynjolfsson: ages 35-49 grew +9% in AI-exposed tech",
    ],
    sourceCount: 76,
    relatedSlug: "tech-sector-displacement",
    sliderMin: -15,
    sliderMax: 10,
    sliderStep: 0.5,
  },
  {
    id: "creative-displacement",
    category: "displacement",
    title: "Creative Industry Displacement",
    shortTitle: "Creative industry",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: 20,
    confidenceLow: 12,
    confidenceHigh: 35,
    currentObserved: 14.3,
    conviction: "moderate",
    rationale:
      "Widest confidence interval of any prediction. Freelance illustration and writing platforms show 20-30% declines already. But demand elasticity for creative content is very high -- near-zero marginal cost could create enormous new markets.",
    keyCitations: [
      "Kim/Jin/Lee: Pixiv illustrator uploads -14.3% (observed, Tier 1)",
      "Indeed: graphic artist postings -33% (2025)",
      "Fiverr FY2025: writing/translation categories -20%",
      "UoC: 30% creative task automation projected",
    ],
    sourceCount: 28,
    relatedSlug: "creative-industry-displacement",
    sliderMin: 0,
    sliderMax: 50,
    sliderStep: 1,
  },
  {
    id: "freelancer-rates",
    category: "wages",
    title: "Freelancer/Gig Worker Rate Decline",
    shortTitle: "Freelancer rates",
    unit: "%",
    timeHorizon: "By 2028",
    prediction: -25,
    confidenceLow: -40,
    confidenceHigh: -15,
    currentObserved: -19.5,
    conviction: "very-high",
    rationale:
      "Platform data is unambiguous. Fiverr active buyers -13.6%, writing -20%. Ramp: corporate freelance spend collapsed from 0.66% to 0.14%. INSEAD RCT confirms startups in-housing previously outsourced work. Most confident negative prediction.",
    keyCitations: [
      "Ramp: freelance spend 0.66% to 0.14% of total",
      "Fiverr FY2025: active buyers -13.6%, revenue guidance -3 to -12%",
      "INSEAD/HBS RCT: startups in-housing outsourced work",
      "FRI survey: almost all 5-day freelance SW jobs automatable by 2030",
    ],
    sourceCount: 18,
    relatedSlug: "freelancer-rate-impact",
    sliderMin: -50,
    sliderMax: 0,
    sliderStep: 1,
  },
  {
    id: "entry-level-wages",
    category: "wages",
    title: "Entry-Level Wage Impact",
    shortTitle: "Entry-level wages",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: -8,
    confidenceLow: -15,
    confidenceHigh: -4,
    currentObserved: -6.3,
    conviction: "high",
    rationale:
      "Converging signals from OECD, BLS, Dallas Fed, and multiple job posting datasets. Reduced hiring leverage compresses entry-level bargaining power. Brynjolfsson notes wages remain stable even as headcount falls -- adjustment through quantity, not price.",
    keyCitations: [
      "OECD youth employment: -8% in AI-exposed roles",
      "Dallas Fed: -0.28pp wage growth in zero-experience-premium jobs",
      "Goldman Sachs: +3.3pp entry-vs-experienced wage gap per 1SD exposure",
      "Burning Glass: 52% of Class of 2023 underemployed 1yr out",
    ],
    sourceCount: 52,
    relatedSlug: "entry-level-wage-impact",
    sliderMin: -25,
    sliderMax: 5,
    sliderStep: 0.5,
  },
  {
    id: "median-wage",
    category: "wages",
    title: "Median Wage Impact",
    shortTitle: "Median wage",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: -1,
    confidenceLow: -5,
    confidenceHigh: 3,
    currentObserved: -1.9,
    conviction: "high",
    rationale:
      "Near-zero at the median. Klump meta-analysis of 53 studies finds robot wage effect statistically indistinguishable from zero. NBER estimates precisely zero LLM wage effects over 2 years. The median hides dramatic distributional variation.",
    keyCitations: [
      "Klump et al.: ~zero robot wage effect (53 studies, 2,143 estimates)",
      "NBER: precisely estimated zero LLM wage effects (2 years)",
      "Dallas Fed: ~zero at median experience premium",
      "Freund & Mann: non-monotonic -- +4% moderate, -35% high exposure",
    ],
    sourceCount: 54,
    relatedSlug: "median-wage-impact",
    sliderMin: -15,
    sliderMax: 10,
    sliderStep: 0.5,
  },
  {
    id: "high-skill-premium",
    category: "wages",
    title: "High-Skill AI Wage Premium",
    shortTitle: "AI skill premium",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: 25,
    confidenceLow: 15,
    confidenceHigh: 40,
    currentObserved: 23.4,
    conviction: "high",
    rationale:
      "AI fluency commands growing premiums across every measurement. Oxford/OII finds 36% premium in STEM roles. PwC reports 30%. Even non-tech AI-skilled roles pay 28% more. Machine fluency is becoming the new credential premium.",
    keyCitations: [
      "Oxford/OII: 36% AI skills premium in STEM (10M UK vacancies)",
      "PwC: 30% AI talent salary premium",
      "Dallas Fed: +0.2pp wage growth for high-experience-premium jobs",
      "Anthropic: AI-exposed workers earn 47% more than unexposed",
    ],
    sourceCount: 39,
    relatedSlug: "high-skill-wage-premium",
    sliderMin: 5,
    sliderMax: 60,
    sliderStep: 1,
  },
  {
    id: "firm-adoption",
    category: "adoption",
    title: "AI Firm Adoption Rate (Census BTOS)",
    shortTitle: "Firm adoption",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: 35,
    confidenceLow: 25,
    confidenceHigh: 50,
    currentObserved: 17.5,
    conviction: "high",
    rationale:
      "Census BTOS is the gold standard -- 17.5% as of Feb 2026, up from 3.8% in Aug 2023. S-curve dynamics suggest doubling in 3-4 years. But OECD warns 50% of SMEs lack workforce skills for AI adoption, limiting upside.",
    keyCitations: [
      "Census BTOS: 3.8% (Aug 2023) to 17.5% (Feb 2026)",
      "Fed RPS: ~41% of workforce uses GenAI at work (Nov 2025)",
      "OECD: 50% of SMEs say employees lack AI skills",
      "Kolko: adoption pace similar to computer/internet eras",
    ],
    sourceCount: 69,
    relatedSlug: "ai-adoption-rate",
    sliderMin: 10,
    sliderMax: 80,
    sliderStep: 1,
  },
  {
    id: "worker-adoption",
    category: "adoption",
    title: "Worker GenAI Usage Rate",
    shortTitle: "Worker AI usage",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: 65,
    confidenceLow: 50,
    confidenceHigh: 80,
    currentObserved: 43,
    conviction: "moderate",
    rationale:
      "Currently 43% per Bick & Deming (NBER, 2026). But only 5.2% of actual work hours involve AI. Headline adoption will grow; effective depth will lag. College grads at 58.7% vs non-college 22.9% (NY Fed) -- adoption is bifurcated.",
    keyCitations: [
      "Bick & Deming (NBER): 43% of workers, 5.2% of work hours",
      "NY Fed SCE: 58.7% college grads vs 22.9% non-college",
      "FRI economists: 10.1% of work hours GenAI-assisted by 2030",
      "MIT/CCI: AI apps grew 6x but activity coverage only 1.2x",
    ],
    sourceCount: 44,
    relatedSlug: "genai-work-adoption",
    sliderMin: 25,
    sliderMax: 95,
    sliderStep: 1,
  },
  {
    id: "productivity",
    category: "productivity",
    title: "Cumulative Productivity Gain from AI",
    shortTitle: "Productivity gain",
    unit: "%",
    timeHorizon: "By 2030",
    prediction: 8,
    confidenceLow: 3,
    confidenceHigh: 15,
    currentObserved: null,
    conviction: "moderate",
    rationale:
      "Between Acemoglu's conservative bound (5%) and Brynjolfsson's J-curve optimism (15-20%). Current 2.7% annual productivity growth is above trend but unclear how much is AI. The J-curve may be starting to inflect upward.",
    keyCitations: [
      "Acemoglu: 0.53-0.66% TFP/decade (Hulten's theorem bound)",
      "Merali (Yale RCT): 8%/yr task time reduction",
      "Furman/BLS: 2.8% annual productivity, 2.2% above CBO forecast",
      "Jones & Tonetti: only 4% above trend by 2040",
    ],
    sourceCount: 35,
    relatedSlug: undefined,
    sliderMin: 0,
    sliderMax: 30,
    sliderStep: 1,
  },
  {
    id: "customer-service-automation",
    category: "displacement",
    title: "Customer Service Interaction Automation",
    shortTitle: "CS automation",
    unit: "%",
    timeHorizon: "By 2028",
    prediction: 55,
    confidenceLow: 40,
    confidenceHigh: 70,
    currentObserved: 41.2,
    conviction: "high",
    rationale:
      "Corporate data is clear: Klarna hit 66%, Shopify 40%, Salesforce 50% of interactions automated. But the Klarna reversal (re-hiring humans) shows quality limits. High automation rate does not equal equivalent job loss -- interactions expand when cheaper.",
    keyCitations: [
      "Klarna: 66% of interactions automated (then partially reversed)",
      "Salesforce: 50% of CS interactions via AI agents (2025)",
      "Gartner: 25% projected automation by 2026",
      "Brynjolfsson QJE: 15% productivity gain for CS agents",
    ],
    sourceCount: 33,
    relatedSlug: "customer-service-automation",
    sliderMin: 20,
    sliderMax: 90,
    sliderStep: 1,
  },
];

export const ECONOMIST_VIEWS: EconomistView[] = [
  {
    name: "Daron Acemoglu",
    affiliation: "MIT (Nobel 2024)",
    stance: "skeptical",
    stanceLabel: "Structural Skeptic",
    summary:
      "The displacement estimates are reasonable but incomplete. Where is the reinstatement effect? New task creation is the historical norm and should be modeled. The bigger risk is 'so-so automation' -- AI just good enough to be adopted but not productive enough to justify the displacement.",
    keyQuote:
      "We currently have the wrong direction for AI. We're using it too much for automation and not enough for providing expertise and information to workers.",
  },
  {
    name: "Erik Brynjolfsson",
    affiliation: "Stanford",
    stance: "optimistic",
    stanceLabel: "Augmentation Optimist",
    summary:
      "The productivity estimate is too conservative. We are in the dip of the J-curve, not the steady state. The entry-level displacement is real -- our canaries paper documents it -- but augmentation-heavy sectors show positive youth employment. The design choice between automation and augmentation is what determines outcomes.",
    keyQuote:
      "Exposure is not destiny -- it depends on whether firms choose automation or augmentation.",
  },
  {
    name: "Martha Gimbel",
    affiliation: "Yale Budget Lab",
    stance: "skeptical",
    stanceLabel: "Data Realist",
    summary:
      "Show me the CPS microdata. The observed data says near-zero aggregate displacement through 2026. Projections are projections. The freelancer prediction is the most defensible because it rests on observed platform data. Everything else needs to distinguish AI from interest rates, tariffs, and immigration policy.",
    keyQuote:
      "If the AI apocalypse is coming, it's not helpful to declare it's here before it's here.",
  },
  {
    name: "James Bessen",
    affiliation: "Boston University",
    stance: "optimistic",
    stanceLabel: "Historical Institutionalist",
    summary:
      "Demand elasticity is undersold in these predictions. History says cost reductions expand demand more than expected. The creative industry prediction should account for the textile analogy: 98% labor reduction per unit, yet decades of employment growth from demand expansion. Adjustment costs are real but gradual.",
    keyQuote:
      "Technology does not automatically help workers. Yet so far AI has not led to large-scale job losses.",
  },
  {
    name: "Jed Kolko",
    affiliation: "PIIE",
    stance: "cautious",
    stanceLabel: "Measurement Methodologist",
    summary:
      "Which exposure measure are these predictions based on? Results are measure-sensitive. I would widen all confidence intervals by 50%. The research is in the first inning. Check for streetlamp bias -- we may be predicting displacement in occupations that are measurable rather than those that matter most.",
    keyQuote:
      "AI's biggest labor-market impact may be on precisely the kinds of workers who are most likely to write about it.",
  },
  {
    name: "Alex Imas",
    affiliation: "Chicago Booth",
    stance: "cautious",
    stanceLabel: "Behavioral Bridge",
    summary:
      "The micro-macro disconnect is the elephant in the room. Why aren't 15-40% task-level productivity gains showing up at the firm level? Either adoption is shallower than measured, or specification hazard means inequality in who benefits. Machine fluency is the new human capital -- and it is not equally distributed.",
    keyQuote:
      "You cannot assume demand will absorb supply -- that is doing all the work in these projections.",
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  displacement: "#F66B5C",
  wages: "#F59E0B",
  adoption: "#22C55E",
  productivity: "#5C61F6",
};

export const CONVICTION_COLORS: Record<string, string> = {
  "very-high": "#16a34a",
  high: "#3b82f6",
  moderate: "#f59e0b",
  low: "#ef4444",
};
