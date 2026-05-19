// Composite Displacement Model — v0.2 engine
// Organized into 4 framework categories:
//   1) Adoption Speed     — how fast firms deploy
//   2) AI Capability      — what AI can actually do
//   3) Demand Elasticity  — does cheaper output grow the market
//   4) Friction Buffer    — what slows transitions independently
// Math is intentionally transparent; every knob maps to a specific term.

import capabilityAnchor from "@/data/capability-anchor.json";

export const CAPABILITY_ANCHOR = capabilityAnchor as {
  fetchedAt: string;
  source: string;
  modelCount: number;
  frontierReleases: number;
  derived: {
    capabilityDoublingMonths: number;
    computeCostDeclineRate: number;
  };
  currentFrontier: Array<{
    name: string;
    vendor: string;
    released: string | null;
    intelligenceIndex: number | null;
    blendedPricePerMtok: number | null;
  }>;
};

export interface SectorParams {
  // Capability
  exposureShare: number;       // 0-1: fraction of tasks technically AI-addressable
  verifiabilityShare: number;  // 0-1: fraction of tasks with machine-checkable outputs
  reliabilityFloor: number;    // 0.9-0.9999: deployment reliability threshold
  // Adoption
  trustCoef: number;           // 0-1: sectoral cultural willingness
  regSchemaDrag: number;       // 0-1: federal/sector approval pathway burden
  downtimeRisk: number;        // 0-1: asymmetric cost of AI failure
  // Demand
  elasticity: number;          // ε: Bessen price elasticity of derived demand
  complementarity: number;     // 0-1: share of residual tasks that augment
  // Friction
  frictionDrag: number;        // 0-1: baseline institutional friction
  genZShare: number;           // 0-1: workforce share under 27 (CPS)
  securityOverhead: number;    // 0-1: compliance burden (HIPAA/SOC/FedRAMP)
}

export interface BtosData {
  currentUse: number;
  plannedUse: number;
  genaiUse: number;
  replacesTask: number;
  empNoChange: number;
}

export interface Sector {
  naics: string;
  name: string;
  btos: BtosData;
  params: SectorParams;
  employmentMillions: number;  // US private employment (BLS QCEW)
}

export interface Knobs {
  // Horizon
  horizonYears: number;

  // Adoption Speed
  trustMultiplier: number;          // scales sector trustCoef
  regSchemaMultiplier: number;      // scales sector regSchemaDrag
  downtimeSensitivity: number;      // scales sector downtimeRisk effect

  // AI Capability
  capabilityDoublingMonths: number; // METR/Thompson Rising Tides
  verifiabilityRatio: number;       // RL feasibility divergence
  reliabilityFloorScale: number;    // loosens/tightens reliability floors

  // Demand Elasticity
  elasticityScale: number;          // scales sector ε
  productivityUplift: number;       // per-task cost savings (Acemoglu)

  // Friction Buffer
  genZAdoptionBoost: number;        // amplifies Gen Z's adoption-lifting effect
  stateRegMultiplier: number;       // independent state-level regulatory drag
  computeCostDeclineRate: number;   // annual rate (0-0.5) of token/energy cost decline
  securityOverheadMultiplier: number; // scales sector securityOverhead
}

export const DEFAULT_KNOBS: Knobs = {
  horizonYears: 5,
  // Adoption
  trustMultiplier: 1.0,
  regSchemaMultiplier: 1.0,
  downtimeSensitivity: 1.0,
  // Capability (live from Artificial Analysis — see scripts/fetch-capability.ts)
  capabilityDoublingMonths: CAPABILITY_ANCHOR.derived.capabilityDoublingMonths,
  verifiabilityRatio: 2.0,
  reliabilityFloorScale: 1.0,
  // Demand
  elasticityScale: 1.0,
  productivityUplift: 0.25,
  // Friction (computeCostDeclineRate from Artificial Analysis frontier price decline)
  genZAdoptionBoost: 1.0,
  stateRegMultiplier: 1.0,
  computeCostDeclineRate: CAPABILITY_ANCHOR.derived.computeCostDeclineRate,
  securityOverheadMultiplier: 1.0,
};

export interface SectorImpact {
  naics: string;
  name: string;
  employmentMillions: number;
  btosCurrent: number;
  btosPlanned: number;
  capabilityShare: number;
  deployableShare: number;
  economicViableShare: number;
  realizedAdoption: number;
  taskReplacement: number;
  productivityGain: number;
  employmentDelta: number;        // % change
  jobsImpacted: number;           // absolute jobs (positive = growth, negative = decline)
  wageImpact: number;
  archetype: Archetype;
}

export type Archetype = "auto-risk" | "reorganize" | "grow" | "less-change";

export function computeSector(sector: Sector, k: Knobs): SectorImpact {
  const p = sector.params;
  const T = k.horizonYears;

  // ── Module 2: AI CAPABILITY ─────────────────────────────────────
  // Task-share capability: what fraction of tasks the frontier can handle.
  // This is SEPARATE from firm-level adoption — kept distinct so each knob
  // moves something visible.
  const doublings = (T * 12) / k.capabilityDoublingMonths;
  const reach = 1 - Math.pow(0.5, doublings * 0.45);
  const capabilityShare = p.exposureShare * reach;

  // Verifiability acceleration (RL feasibility)
  const verifiabilityBoost =
    1 + (p.verifiabilityShare - 0.5) * (k.verifiabilityRatio - 1) * 0.35;

  // Reliability gate — high-floor sectors lose part of capability
  const floor = p.reliabilityFloor;
  const floorScaled = 1 - (1 - floor) * k.reliabilityFloorScale;
  const reliabilityPass =
    floorScaled <= 0.95 ? 1.0 :
    floorScaled <= 0.99 ? 0.85 :
    floorScaled <= 0.999 ? 0.55 : 0.30;

  const deployableShare = Math.min(
    0.95,
    capabilityShare * verifiabilityBoost * reliabilityPass
  );

  // ── Module 4: FRICTION (cost gate component) ────────────────────
  // Bidirectional cost trajectory.
  // Positive rate = costs declining (Wright's Law on inference) → more tasks viable.
  // Negative rate = costs rising (energy crisis, GPU shortage, capital costs) → fewer tasks viable.
  // tanh keeps the response bounded and symmetric around the neutral (rate = 0) baseline.
  const costFactor = Math.tanh(k.computeCostDeclineRate * T * 0.5);
  const costGate = clamp(0.20, 0.95, 0.55 + 0.40 * costFactor);
  const economicViableShare = Math.min(0.95, deployableShare * costGate);

  // ── Module 1: ADOPTION SPEED (firm-level, separate from capability) ─
  // Trust × Gen Z amplification
  const baselineTrust = Math.min(1.0, p.trustCoef * k.trustMultiplier);
  const genZAdjustedTrust = Math.min(
    1.0,
    baselineTrust * (1 + (p.genZShare - 0.15) * k.genZAdoptionBoost * 0.8)
  );

  // Composite friction — WEIGHTED SUM (not multiplicative compounding).
  // The old multiplicative formula compounded five 20-50% drags into 70%+
  // total friction, locking peak below BTOS for nearly every sector.
  // Weighted sum better reflects that institutional drags overlap rather
  // than stack independently.
  const regSchema = p.regSchemaDrag * k.regSchemaMultiplier;
  const downtime = p.downtimeRisk * k.downtimeSensitivity;
  const stateReg = 0.20 * k.stateRegMultiplier;
  const security = p.securityOverhead * k.securityOverheadMultiplier;
  const institutional = p.frictionDrag;

  const totalFriction = clamp(
    0.05,
    0.70,
    0.25 * regSchema +
      0.20 * downtime +
      0.15 * stateReg +
      0.15 * security +
      0.25 * institutional
  );

  // Firm-level adoption: anchored to BTOS planned-use (firm intent), then
  // pushed by horizon × trust and pulled down by friction. Decoupled from
  // capability — a construction firm can adopt for one task without 100%
  // of work being AI-able.
  const trustPull = (genZAdjustedTrust - 0.4) * 0.8;
  const horizonGrowth = 0.07 * T * (1 + trustPull * 1.5);
  const frictionDrag = totalFriction * 0.5;

  const peakFirmAdoption = Math.min(
    0.92,
    sector.btos.plannedUse / 100 + horizonGrowth - frictionDrag
  );

  // Soft floor at BTOS current — adopted firms don't un-adopt
  const anchor = sector.btos.currentUse / 100;
  const realizedAdoption = Math.max(anchor, peakFirmAdoption);

  // ── Task replacement ─────────────────────────────────────────────
  // adoption × task-share capability × substitution share
  // Multiplies the firm-adoption dimension with the task-capability dimension.
  const substitutionShare = 1 - p.complementarity;
  const taskReplacement = realizedAdoption * economicViableShare * substitutionShare;

  // ── Productivity ────────────────────────────────────────────────
  const productivityGain = taskReplacement * k.productivityUplift;

  // ── Module 3: DEMAND ELASTICITY (Bessen identity) ───────────────
  const epsilon = Math.max(0.05, p.elasticity * k.elasticityScale);
  const employmentDelta = (epsilon - 1) * productivityGain * 100;

  // Wage impact — productivity gains accrue partly to workers via complementarity
  const wageImpact = productivityGain * p.complementarity * 100;

  const archetype = classify(employmentDelta, taskReplacement);

  // Absolute jobs impact: % change × sector employment baseline
  const jobsImpacted = (employmentDelta / 100) * sector.employmentMillions * 1_000_000;

  return {
    naics: sector.naics,
    name: sector.name,
    employmentMillions: sector.employmentMillions,
    btosCurrent: sector.btos.currentUse,
    btosPlanned: sector.btos.plannedUse,
    capabilityShare: capabilityShare * 100,
    deployableShare: deployableShare * 100,
    economicViableShare: economicViableShare * 100,
    realizedAdoption: realizedAdoption * 100,
    taskReplacement: taskReplacement * 100,
    productivityGain: productivityGain * 100,
    employmentDelta,
    jobsImpacted,
    wageImpact,
    archetype,
  };
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function clamp(min: number, max: number, v: number) {
  return Math.max(min, Math.min(max, v));
}

function classify(empDelta: number, taskRepl: number): Archetype {
  if (empDelta < -3) return "auto-risk";
  if (empDelta > 3) return "grow";
  if (taskRepl > 0.10) return "reorganize";
  return "less-change";
}

export const ARCHETYPE_META: Record<Archetype, { label: string; color: string; description: string }> = {
  "auto-risk": {
    label: "Auto-risk",
    color: "#d4493a",
    description: "Pressure exceeds buffers; net employment contracts.",
  },
  "reorganize": {
    label: "Reorganize",
    color: "#c89531",
    description: "Significant task reshuffling, modest employment change.",
  },
  "grow": {
    label: "Grow",
    color: "#3a8a4f",
    description: "Demand elasticity dominates; productivity expands employment.",
  },
  "less-change": {
    label: "Less change",
    color: "#7a7e8b",
    description: "Capability, adoption, or friction holds displacement in check.",
  },
};

// ────────────────────────────────────────────────────────────────────
// FRAMEWORK — for the UI to render category cards + factor explainers
// ────────────────────────────────────────────────────────────────────

export type ImpactTier = "high" | "medium" | "low" | "informational";

export interface Factor {
  id: string;
  name: string;
  description: string;
  citation: { label: string; url?: string };
  knob?: keyof Knobs;
  impact: ImpactTier;
  impactNote?: string;
}

export const IMPACT_META: Record<ImpactTier, { label: string; color: string; bg: string; description: string }> = {
  high: {
    label: "High",
    color: "#a53024",
    bg: "#a5302418",
    description: "Moves sector outputs > 2pp across slider range; can flip employment sign for some sectors.",
  },
  medium: {
    label: "Medium",
    color: "#a36e1e",
    bg: "#a36e1e18",
    description: "Moves outputs 0.5–2pp; shifts ranking but rarely flips direction.",
  },
  low: {
    label: "Low",
    color: "#5a6770",
    bg: "#5a677018",
    description: "Moves outputs < 0.5pp; matters mainly at extremes or for narrow sector classes.",
  },
  informational: {
    label: "Info only",
    color: "#7a7e8b",
    bg: "#7a7e8b18",
    description: "Not user-adjustable; documents an underlying framework concept.",
  },
};

export interface Category {
  id: string;
  number: number;
  name: string;
  oneLiner: string;
  whyItMatters: string;
  factors: Factor[];
}

export const FRAMEWORK: Category[] = [
  {
    id: "adoption",
    number: 1,
    name: "Adoption Speed",
    oneLiner: "How fast firms actually deploy AI into workflows — independent of whether it's technically possible.",
    whyItMatters: "A technology can be cheap, capable, and approved for years before organizations actually use it. This is the dimension where most analyses overshoot — assuming capability translates directly into deployment.",
    factors: [
      {
        id: "census-btos",
        name: "Census BTOS adoption",
        description: "The US Census Business Trends & Outlook Survey samples ~1M firms biweekly on AI use. Currently 17.9% of firms use AI; 21.6% plan to in the next 6 months. We anchor t=0 of every sector's adoption curve to its BTOS current-use rate.",
        citation: { label: "US Census BTOS AI Supplement 2026", url: "https://www.census.gov/data/experimental-data-products/business-trends-and-outlook-survey.html" },
        impact: "high",
        impactNote: "Sets the t=0 anchor for every sector. Drives the floor of realized adoption — and the planned-use rate seeds the horizon projection.",
      },
      {
        id: "regulatory-schema",
        name: "Regulatory schema",
        description: "Sector-level approval pathway — licensure, liability allocation, disclosure rules, pre-approval requirements (FDA, FAA, OCC, state medical boards). Each is a real lever that workforce leaders and policymakers can attempt to move.",
        citation: { label: "Hand-coded per-sector schema from federal + sector regulators" },
        knob: "regSchemaMultiplier",
        impact: "high",
        impactNote: "Largest single weight in the friction sum (0.25). Moving this slider visibly shifts adoption for regulated sectors.",
      },
      {
        id: "sectoral-aversions",
        name: "Sectoral aversions (trust)",
        description: "Cultural norms slow deployment differently across sectors. Healthcare practitioners score 0.20 on AI trust; software engineers 0.80 (Gallup, NY Fed SCE). The trust multiplier pulls realized firm adoption above or below the BTOS planned-use trend.",
        citation: { label: "Gallup Workplace + NY Fed SCE 2025–26" },
        knob: "trustMultiplier",
        impact: "high",
        impactNote: "Enters via the horizonGrowth term (trustPull × 1.5). Strongest effect for sectors with trust above ~0.5.",
      },
      {
        id: "downtime-sensitivity",
        name: "Downtime sensitivity",
        description: "When AI failure has asymmetric cost (a wrong medical diagnosis, a stuck grid, a rogue trade), deployment is gated by failure tolerance, not just average accuracy. This compounds the reliability floor and stays binding even after capability passes.",
        citation: { label: "Internal heuristic; per-sector defaults from regulatory norms" },
        knob: "downtimeSensitivity",
        impact: "medium",
        impactNote: "Friction-weight 0.20. Matters most in utilities, healthcare, transportation; minor for retail, professional services.",
      },
    ],
  },
  {
    id: "capability",
    number: 2,
    name: "AI Capability",
    oneLiner: "What AI can actually do — and how fast that frontier is moving through the task-difficulty distribution.",
    whyItMatters: "Capability is the fastest-moving and most uncertain dimension. Most models substitute a single benchmark number for a multi-dimensional truth. This module separates frontier movement (METR doubling) from verifiability (RL feasibility) from deployment thresholds (reliability floors).",
    factors: [
      {
        id: "task-completion-time",
        name: "Task completion time horizon",
        description: "Thompson's 'Rising Tides' framing treats capability as a frontier rising through a difficulty distribution. METR's measured task-completion-time horizon currently doubles every ~7 months on agentic work. After 5 years at this rate, the frontier reaches tasks ~2,500× harder than today.",
        citation: { label: "METR 2024–2026; Thompson 'Rising Tides' (MIT FutureTech)", url: "https://metr.org/" },
        knob: "capabilityDoublingMonths",
        impact: "high",
        impactNote: "Drives the reach function exponentially. Moving doubling from 14 → 4 months roughly triples task-share capability at T=5.",
      },
      {
        id: "model-benchmarks",
        name: "Model benchmarks & quality index (live)",
        description: `Artificial Analysis tracks frontier-model performance across quality (MMLU, GPQA, HumanEval, MATH), latency, throughput, and price-per-token in near-real-time. Their cross-model Intelligence Index is the closest thing to a vendor-neutral measure of where the capability frontier actually sits today. We wire it in directly: the "Capability doubling" and "Compute cost decline" defaults above are fit live to AA's frontier path. Last refresh: ${CAPABILITY_ANCHOR.fetchedAt.slice(0, 10)} — ${CAPABILITY_ANCHOR.frontierReleases} frontier-defining releases tracked; current top model: ${CAPABILITY_ANCHOR.currentFrontier[0]?.name} (Intelligence Index ${CAPABILITY_ANCHOR.currentFrontier[0]?.intelligenceIndex}). Run \`npx tsx scripts/fetch-capability.ts\` to refresh.`,
        citation: { label: "Artificial Analysis — Independent AI model benchmarks", url: "https://artificialanalysis.ai/" },
        impact: "high",
        impactNote: "Sets the live defaults for capability doubling time and compute cost decline. Re-fitting these moves nearly everything downstream.",
      },
      {
        id: "rl-feasibility",
        name: "RL feasibility / verifiability",
        description: "Tasks with explicit verifiable rewards (code, math, structured research) have advanced dramatically faster than tasks with subjective evaluation. The Tomei & Klein Teeselink RL-feasibility index correlates 0.88 with LLM exposure overall but only 0.15 once physically infeasible tasks are excluded — meaning verifiability, not raw exposure, is what predicts where displacement actually concentrates.",
        citation: { label: "Tomei & Klein Teeselink 2026, 'What Jobs Can AI Learn?'", url: "https://arxiv.org/abs/2605.02598" },
        knob: "verifiabilityRatio",
        impact: "medium",
        impactNote: "Scales deployableShare by up to ±30%. Larger effect on high-verifiability sectors (information, finance, prof. services).",
      },
      {
        id: "reliability-floor",
        name: "Sector reliability floor",
        description: "Capability ≠ deployment. A 90%-reliable generator passes for marketing copy; radiology and anesthesia require 99.99%. The model only counts a task as deployable when capability × verifiability ≥ the sector's floor. Healthcare's 0.9999 floor strips ~70% of theoretical capability at every horizon.",
        citation: { label: "Per-sector floors from FDA, FAA, OCC, state bar benchmarks" },
        knob: "reliabilityFloorScale",
        impact: "medium",
        impactNote: "Only binding for high-floor sectors (healthcare 0.9999, utilities/finance 0.999). For most others, the knob has minimal effect.",
      },
    ],
  },
  {
    id: "demand",
    number: 3,
    name: "Demand Elasticity",
    oneLiner: "When AI makes the output of an occupation cheaper, does the market buy more of it?",
    whyItMatters: "This is the dimension that separates the 1820 textile worker from the 1995 bank teller — same productivity gain, opposite employment outcome. The Bessen identity makes this operational: Δln(L) = (ε − 1) × Δln(A). Where ε > 1, automation grows employment. Where ε < 1, it cuts it.",
    factors: [
      {
        id: "bessen-elasticity",
        name: "Bessen ε per sector",
        description: "Price elasticity of derived demand. Bessen's empirical fit on textiles, steel, and autos shows ε starting at 2–7 in early industry life and falling to 0.02–0.16 at maturity. ATMs grew teller employment for 30 years (high ε on banking); payroll software shrunk it (low ε — companies have exactly as many paychecks as employees).",
        citation: { label: "Bessen 2019, 'Automation and Jobs: When Technology Boosts Employment'", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2935003" },
        knob: "elasticityScale",
        impact: "high",
        impactNote: "The (ε−1) factor literally flips the sign of employment change. Sectors with ε near 1 are most sensitive to this knob.",
      },
      {
        id: "productivity-uplift",
        name: "Productivity uplift per replaced task",
        description: "Per-task cost savings when AI substitutes for human labor. Acemoglu's 'Simple Macroeconomics of AI' bounds this at ~27% across automatable tasks. This is the Δln(A) term in the Bessen identity — it sets the magnitude that elasticity then translates into employment change.",
        citation: { label: "Acemoglu 2024, 'The Simple Macroeconomics of AI'", url: "https://www.nber.org/papers/w32487" },
        knob: "productivityUplift",
        impact: "high",
        impactNote: "Direct linear multiplier on every output. Moving from 10% to 40% changes employment Δ by 4×.",
      },
      {
        id: "openai-archetypes",
        name: "OpenAI four-archetype frame",
        description: "Every sector maps onto one of four outcomes: auto-risk (pressure overwhelms buffers), reorganize (task mix shifts, employment roughly flat), grow (elasticity dominates, productivity expands jobs), less-change (capability or friction holds displacement in check). The color coding in the table reflects this classification.",
        citation: { label: "OpenAI Jobs Transition Framework 2026" },
        impact: "informational",
      },
    ],
  },
  {
    id: "friction",
    number: 4,
    name: "Friction Buffer",
    oneLiner: "Everything that slows or shapes the transition independently of capability and demand.",
    whyItMatters: "Friction is where workforce-leader interventions actually have leverage. Programs largely cannot slow capability — they can shape the realization gap that friction creates. This category aggregates demographic, regulatory, cost, and security drag into one composite buffer.",
    factors: [
      {
        id: "state-regulation",
        name: "State-level regulation",
        description: "Independent of federal/sector schema (Adoption Speed § 2), state legislatures are actively passing AI deployment rules — California SB 1047 derivatives, NYC bias audits, Colorado AI Act, state attorney general enforcement priorities. Captured as a uniform-by-default drag the user can scale up or down.",
        citation: { label: "NCSL AI legislation tracker, 2026 session" },
        knob: "stateRegMultiplier",
        impact: "medium",
        impactNote: "Friction-weight 0.15. Applies uniformly across all sectors, so moves the aggregate average more than any single sector.",
      },
      {
        id: "compute-costs",
        name: "Compute, token & energy costs",
        description: "Token costs follow a Wright's-Law decline (~15%/yr base case fit to Hoffmann scaling, 40% on live AA frontier). Energy and supervision overhead don't fall as fast. Treated as a cost gate that opens economic viability for more tasks over the horizon.",
        citation: { label: "Wright's Law fit to Hoffmann scaling + Anthropic/OpenAI pricing history" },
        knob: "computeCostDeclineRate",
        impact: "medium",
        impactNote: "Cost-gate ranges 0.55 → 0.95 across the slider range. Saturates by T=5 at the higher rates — effect strongest at T=2 horizon.",
      },
      {
        id: "security-overhead",
        name: "Security & compliance overhead",
        description: "SOC 2, HIPAA, FedRAMP, PCI, state data sovereignty. Compliance overhead bites hardest in healthcare (HIPAA), finance (SOC + PCI), and information sectors (data sovereignty). The model treats it as drag on adoption proportional to per-sector compliance burden × a global multiplier.",
        citation: { label: "Per-sector compliance burden estimates; HIPAA/SOC/FedRAMP frameworks" },
        knob: "securityOverheadMultiplier",
        impact: "medium",
        impactNote: "Friction-weight 0.15. Concentrated effect on healthcare, finance, government-adjacent; minimal elsewhere.",
      },
      {
        id: "gen-z-share",
        name: "Generational composition",
        description: "Each sector carries an age mix. Gen Z workers show measurably higher AI tool adoption and lower normative resistance (Bick/Deming RPS age cuts). A Rust Belt MSA with an older incumbent workforce and a Sun Belt MSA with a younger one have different adoption velocities for the same sector.",
        citation: { label: "Bick/Deming Real-time Population Survey + NY Fed SCE workplace tracker" },
        knob: "genZAdoptionBoost",
        impact: "low",
        impactNote: "Effect proportional to (genZShare − 0.15). Strongest for accommodation/food (0.34) and retail (0.28); near-zero elsewhere.",
      },
      {
        id: "latency-risk",
        name: "Latency & reliability premiums",
        description: "High-stakes deployment (anesthesia, grid routing, financial trade execution) carries premiums that decline more slowly than commodity inference — latency SLA, redundancy, human-in-the-loop verification. Folded into the downtime-sensitivity knob in Adoption Speed.",
        citation: { label: "Sector-specific deployment cost studies; folded into downtime sensitivity" },
        impact: "informational",
      },
    ],
  },
];

/** Sort factors within a category so high-impact appears first. */
export function sortFactorsByImpact(factors: Factor[]): Factor[] {
  const order: Record<ImpactTier, number> = { high: 0, medium: 1, low: 2, informational: 3 };
  return [...factors].sort((a, b) => order[a.impact] - order[b.impact]);
}

// ────────────────────────────────────────────────────────────────────
// POLICY DIAGNOSTIC — types + engine
// ────────────────────────────────────────────────────────────────────

export interface Region {
  id: string;
  name: string;
  state: string;
  totalEmploymentK: number;
  concentrationNote: string;
  sectorShares: Record<string, number>; // naics → share of regional employment (0-1)
}

export interface ModelPolicy {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  typicalCostMillions: number;
  durationYears: number;
  targetSectors: string[] | null; // null = applies to all
  evidence: string;
  evidenceUrl: string;
  /**
   * Which framework categories this policy moves in the model.
   * Note: only Adoption Speed and Friction Buffer are realistically
   * policy-movable. Capability is set by the AI frontier; Demand
   * Elasticity is set by market structure. Policies cannot shift those.
   */
  addresses: Array<"adoption" | "friction">;
  /** Workforce-side outcomes — who benefits and what they get. */
  workforceImpacts: string[];
  /** Target population groups. */
  targetPopulations: string[];
  sectorOverrides: Record<string, Partial<SectorParams>>;
  knobShifts: Partial<Knobs>;
}

/** Apply a policy to a sectors array + knobs, returning modified versions. */
export function applyPolicy(
  sectors: Sector[],
  baseKnobs: Knobs,
  policy: ModelPolicy
): { sectors: Sector[]; knobs: Knobs } {
  const modifiedSectors = sectors.map((s) => {
    const override = policy.sectorOverrides[s.naics];
    if (!override) return s;
    // sector overrides are additive deltas to params
    const adjustedParams = { ...s.params };
    for (const [k, delta] of Object.entries(override)) {
      const key = k as keyof SectorParams;
      const cur = adjustedParams[key];
      if (typeof cur === "number" && typeof delta === "number") {
        adjustedParams[key] = Math.max(0, Math.min(1, cur + delta));
      }
    }
    return { ...s, params: adjustedParams };
  });

  // Knob shifts: for multiplicative knobs (×-suffix), policy values replace the base.
  // For rate knobs (computeCostDeclineRate), they're additive deltas.
  const modifiedKnobs: Knobs = { ...baseKnobs };
  for (const [k, v] of Object.entries(policy.knobShifts)) {
    const key = k as keyof Knobs;
    if (key === "computeCostDeclineRate") {
      modifiedKnobs[key] = (baseKnobs[key] as number) + (v as number);
    } else if (typeof v === "number") {
      modifiedKnobs[key] = v as never;
    }
  }
  return { sectors: modifiedSectors, knobs: modifiedKnobs };
}

export interface RegionalAggregate {
  regionId: string;
  regionName: string;
  totalEmploymentK: number;
  totalJobsImpacted: number;
  jobsAdded: number;
  jobsLost: number;
  bySector: Array<{
    naics: string;
    name: string;
    regionalEmploymentK: number;
    regionalJobsImpacted: number;
    employmentDeltaPct: number;
    archetype: Archetype;
  }>;
}

/** Aggregate sector-level impacts into a regional view weighted by regional employment shares. */
export function regionalAggregate(
  impacts: SectorImpact[],
  region: Region
): RegionalAggregate {
  let totalJobs = 0;
  let jobsAdded = 0;
  let jobsLost = 0;
  const bySector = impacts.map((imp) => {
    const share = region.sectorShares[imp.naics] ?? 0;
    const regionalEmpK = region.totalEmploymentK * share;
    const regionalJobs = (imp.employmentDelta / 100) * regionalEmpK * 1000;
    totalJobs += regionalJobs;
    if (regionalJobs > 0) jobsAdded += regionalJobs;
    else jobsLost += regionalJobs;
    return {
      naics: imp.naics,
      name: imp.name,
      regionalEmploymentK: regionalEmpK,
      regionalJobsImpacted: regionalJobs,
      employmentDeltaPct: imp.employmentDelta,
      archetype: imp.archetype,
    };
  });
  return {
    regionId: region.id,
    regionName: region.name,
    totalEmploymentK: region.totalEmploymentK,
    totalJobsImpacted: totalJobs,
    jobsAdded,
    jobsLost,
    bySector,
  };
}

// ────────────────────────────────────────────────────────────────────
// TRUST MECHANISMS
// ────────────────────────────────────────────────────────────────────

/** The sector contributing the largest regional jobs loss, with attribution to which params drove it. */
export interface DominantRisk {
  sector: {
    naics: string;
    name: string;
    regionalJobsImpacted: number;
    regionalEmploymentK: number;
  };
  driverNarrative: string;
  drivers: Array<{ paramOrKnob: string; value: number; role: string }>;
  category: "adoption" | "capability" | "demand" | "friction"; // the framework category most responsible
}

export function findDominantRisk(
  agg: RegionalAggregate,
  sectorsBySource: Sector[]
): DominantRisk | null {
  const losses = agg.bySector.filter((s) => s.regionalJobsImpacted < 0);
  if (losses.length === 0) return null;
  losses.sort((a, b) => a.regionalJobsImpacted - b.regionalJobsImpacted); // most negative first
  const worst = losses[0];
  const src = sectorsBySource.find((s) => s.naics === worst.naics);
  if (!src) return null;
  const p = src.params;
  // For displacement-driven sectors, ε < 1 + high exposure + low complementarity dominate
  const drivers: DominantRisk["drivers"] = [];
  if (p.elasticity < 0.7) drivers.push({ paramOrKnob: `ε (sector)`, value: p.elasticity, role: `Low Bessen ε means productivity gains cut jobs rather than grow them` });
  if (p.complementarity < 0.5) drivers.push({ paramOrKnob: `Complementarity`, value: p.complementarity, role: `Low complementarity means AI substitutes for, rather than augments, workers` });
  if (p.exposureShare > 0.5) drivers.push({ paramOrKnob: `Exposure share`, value: p.exposureShare, role: `High task exposure (${(p.exposureShare * 100).toFixed(0)}% of work)` });
  if (p.frictionDrag < 0.4) drivers.push({ paramOrKnob: `Friction drag`, value: p.frictionDrag, role: `Low institutional friction allows fast displacement` });

  const category: DominantRisk["category"] = p.elasticity < 0.7 ? "demand" : p.complementarity < 0.5 ? "demand" : p.exposureShare > 0.6 ? "capability" : "adoption";
  const narrative = `${worst.name} accounts for ${Math.abs(worst.regionalJobsImpacted / 1000).toFixed(1)}K of the projected jobs decline. Driver: ${drivers.map((d) => d.paramOrKnob).join(" + ")}.`;

  return {
    sector: {
      naics: worst.naics,
      name: worst.name,
      regionalJobsImpacted: worst.regionalJobsImpacted,
      regionalEmploymentK: worst.regionalEmploymentK,
    },
    driverNarrative: narrative,
    drivers,
    category,
  };
}

/** "What would change this": find the smallest knob movement that flips overall regional jobs from net-loss to net-gain (or vice versa). */
export interface SensitivityFlip {
  knob: keyof Knobs;
  knobLabel: string;
  currentValue: number;
  flipValue: number;
  baselineNetJobs: number;
  flippedNetJobs: number;
  feasible: boolean;
}

export function findSensitivityFlip(
  sectors: Sector[],
  knobs: Knobs,
  region: Region,
  policy?: ModelPolicy
): SensitivityFlip[] {
  const apply = (extraShifts: Partial<Knobs>): number => {
    let activeSectors = sectors;
    let activeKnobs = { ...knobs, ...extraShifts };
    if (policy) {
      const out = applyPolicy(sectors, activeKnobs, policy);
      activeSectors = out.sectors;
      activeKnobs = out.knobs;
    }
    const impacts = activeSectors.map((s) => computeSector(s, activeKnobs));
    return regionalAggregate(impacts, region).totalJobsImpacted;
  };

  const baseline = apply({});
  const flips: SensitivityFlip[] = [];

  for (const meta of KNOB_META) {
    if (meta.impact !== "high") continue; // only check high-impact knobs
    const curVal = knobs[meta.knob];
    const trySweep = (direction: 1 | -1): number | null => {
      const steps = 12;
      const range = direction === 1 ? meta.max - curVal : curVal - meta.min;
      for (let i = 1; i <= steps; i++) {
        const v = curVal + direction * (range * i) / steps;
        if (v < meta.min || v > meta.max) continue;
        const r = apply({ [meta.knob]: v } as Partial<Knobs>);
        if ((baseline < 0 && r > 0) || (baseline > 0 && r < 0)) return v;
      }
      return null;
    };
    const upFlip = trySweep(1);
    const downFlip = trySweep(-1);
    const flipVal = upFlip !== null && (downFlip === null || Math.abs(upFlip - curVal) < Math.abs(downFlip - curVal))
      ? upFlip
      : downFlip;
    if (flipVal !== null) {
      flips.push({
        knob: meta.knob,
        knobLabel: meta.label,
        currentValue: curVal,
        flipValue: flipVal,
        baselineNetJobs: baseline,
        flippedNetJobs: apply({ [meta.knob]: flipVal } as Partial<Knobs>),
        feasible: Math.abs(flipVal - curVal) / Math.max(0.01, Math.abs(curVal)) < 0.5,
      });
    }
  }
  // Sort by smallest required move
  flips.sort((a, b) => Math.abs(a.flipValue - a.currentValue) - Math.abs(b.flipValue - b.currentValue));
  return flips.slice(0, 3);
}

// ────────────────────────────────────────────────────────────────────
// BUDGET PORTFOLIO OPTIMIZER
// Inverse of the policy diagnostic: given $X for a region, recommend
// a portfolio of policies that maximizes net regional jobs while also
// covering as many of the 4 framework categories as possible.
// ────────────────────────────────────────────────────────────────────

/** Scale a policy down to a fraction of full funding (linear). */
export function scalePolicy(policy: ModelPolicy, scale: number): ModelPolicy {
  const s = Math.max(0, Math.min(1, scale));
  return {
    ...policy,
    typicalCostMillions: policy.typicalCostMillions * s,
    sectorOverrides: Object.fromEntries(
      Object.entries(policy.sectorOverrides).map(([naics, overrides]) => [
        naics,
        Object.fromEntries(
          Object.entries(overrides).map(([k, v]) => [k, (v as number) * s])
        ) as Partial<SectorParams>,
      ])
    ),
    knobShifts: Object.fromEntries(
      Object.entries(policy.knobShifts).map(([k, v]) => {
        // For additive rate knobs, scale linearly.
        if (k === "computeCostDeclineRate") return [k, (v as number) * s];
        // For multiplier knobs (default 1.0), blend toward 1.0.
        return [k, 1.0 + ((v as number) - 1.0) * s];
      })
    ) as Partial<Knobs>,
  };
}

export interface PortfolioSelection {
  policy: ModelPolicy;
  allocationMillions: number;
  scale: number; // 0-1, fraction of full funding
  standaloneJobsDelta: number; // marginal jobs if THIS policy alone were applied at this scale
}

export interface PortfolioRecommendation {
  region: Region;
  budgetMillions: number;
  spentMillions: number;
  unspentMillions: number;
  selected: PortfolioSelection[];
  skipped: Array<{ policy: ModelPolicy; reason: string }>;
  categoriesCovered: Array<"adoption" | "capability" | "demand" | "friction">;
  baseline: RegionalAggregate;
  portfolio: RegionalAggregate;
  portfolioJobsDelta: number;
  bestSingleJobsDelta: number;
  bestSinglePolicy: ModelPolicy | null;
}

/** Greedy gap-aware portfolio optimizer. */
export function optimizeBudgetPortfolio(
  sectors: Sector[],
  knobs: Knobs,
  region: Region,
  allPolicies: ModelPolicy[],
  budgetMillions: number
): PortfolioRecommendation {
  // Regional baseline (no policy)
  const baselineImpacts = sectors.map((s) => computeSector(s, knobs));
  const baseline = regionalAggregate(baselineImpacts, region);

  // Score each policy at full standalone funding for this region
  const scored = allPolicies.map((p) => {
    const { sectors: ps, knobs: pk } = applyPolicy(sectors, knobs, p);
    const impacts = ps.map((s) => computeSector(s, pk));
    const agg = regionalAggregate(impacts, region);
    const jobsDelta = agg.totalJobsImpacted - baseline.totalJobsImpacted;
    return { policy: p, jobsDelta, agg };
  });

  // Best single policy at this budget cap (for comparison)
  const affordableSingle = scored
    .filter((s) => s.policy.typicalCostMillions <= budgetMillions)
    .sort((a, b) => b.jobsDelta - a.jobsDelta);
  const bestSinglePolicy = affordableSingle[0]?.policy ?? null;
  const bestSingleJobsDelta = affordableSingle[0]?.jobsDelta ?? 0;

  // Greedy gap-aware build
  const selected: PortfolioSelection[] = [];
  const skipped: Array<{ policy: ModelPolicy; reason: string }> = [];
  const coveredCategories = new Set<"adoption" | "capability" | "demand" | "friction">();
  let remainingBudget = budgetMillions;
  const candidatePool = [...scored];

  while (remainingBudget >= 0.5 && candidatePool.length > 0) {
    // Re-score every iteration: cost-efficiency × gap bonus
    candidatePool.sort((a, b) => {
      const gapA = a.policy.addresses.some((c) => !coveredCategories.has(c)) ? 1.4 : 1.0;
      const gapB = b.policy.addresses.some((c) => !coveredCategories.has(c)) ? 1.4 : 1.0;
      const scoreA =
        (a.jobsDelta / Math.max(0.1, a.policy.typicalCostMillions)) * gapA;
      const scoreB =
        (b.jobsDelta / Math.max(0.1, b.policy.typicalCostMillions)) * gapB;
      return scoreB - scoreA;
    });
    const top = candidatePool.shift()!;
    // If the policy makes things worse on net, skip
    if (top.jobsDelta <= 0) {
      skipped.push({
        policy: top.policy,
        reason: "Standalone effect is neutral or net-negative for this region under this scenario",
      });
      continue;
    }
    const fullCost = top.policy.typicalCostMillions;
    const scale = Math.min(1.0, remainingBudget / fullCost);
    // Skip if we can fund less than 25% — fragmentary funding rarely works
    if (scale < 0.25) {
      skipped.push({
        policy: top.policy,
        reason: `Remaining budget ($${remainingBudget.toFixed(1)}M) is < 25% of full cost ($${fullCost}M) — too thin to be effective`,
      });
      continue;
    }
    const alloc = fullCost * scale;
    selected.push({
      policy: top.policy,
      allocationMillions: alloc,
      scale,
      standaloneJobsDelta: top.jobsDelta * scale,
    });
    remainingBudget -= alloc;
    top.policy.addresses.forEach((c) => coveredCategories.add(c));
  }

  // Compute combined portfolio impact (stacking policies)
  let combinedSectors = sectors;
  let combinedKnobs = { ...knobs };
  for (const sel of selected) {
    const scaled = scalePolicy(sel.policy, sel.scale);
    const out = applyPolicy(combinedSectors, combinedKnobs, scaled);
    combinedSectors = out.sectors;
    combinedKnobs = out.knobs;
  }
  const portfolioImpacts = combinedSectors.map((s) => computeSector(s, combinedKnobs));
  const portfolio = regionalAggregate(portfolioImpacts, region);

  // Any candidates left in the pool that we never selected
  for (const c of candidatePool) {
    if (!selected.find((s) => s.policy.id === c.policy.id)) {
      const reason =
        c.jobsDelta <= 0
          ? "Standalone effect not positive for this region"
          : c.policy.addresses.every((cat) => coveredCategories.has(cat))
            ? "Framework categories already covered by selected portfolio"
            : "Lower cost-effectiveness than selected policies";
      skipped.push({ policy: c.policy, reason });
    }
  }

  return {
    region,
    budgetMillions,
    spentMillions: budgetMillions - remainingBudget,
    unspentMillions: remainingBudget,
    selected,
    skipped,
    categoriesCovered: Array.from(coveredCategories),
    baseline,
    portfolio,
    portfolioJobsDelta: portfolio.totalJobsImpacted - baseline.totalJobsImpacted,
    bestSinglePolicy,
    bestSingleJobsDelta,
  };
}

/** Robustness band: perturb high-impact knobs by ±50% and report resulting jobs range. */
export interface RobustnessBand {
  baseline: number;
  pessimistic: number;
  optimistic: number;
  perturbedKnobs: string[];
}

export function computeRobustnessBand(
  sectors: Sector[],
  knobs: Knobs,
  region: Region,
  policy?: ModelPolicy
): RobustnessBand {
  const highKnobs = KNOB_META.filter((m) => m.impact === "high" && m.knob !== "horizonYears");
  const perturbedKnobs = highKnobs.map((m) => m.label);

  const apply = (knobMods: Partial<Knobs>): number => {
    let activeSectors = sectors;
    let activeKnobs = { ...knobs, ...knobMods };
    if (policy) {
      const out = applyPolicy(sectors, activeKnobs, policy);
      activeSectors = out.sectors;
      activeKnobs = out.knobs;
    }
    return regionalAggregate(
      activeSectors.map((s) => computeSector(s, activeKnobs)),
      region
    ).totalJobsImpacted;
  };

  const baseline = apply({});

  // Pessimistic: knobs that drive growth go to 50% of current; knobs that drive displacement go to 150%
  // For simplicity: pessimistic = lower elasticity (more displacement), faster capability, lower trust, more friction
  const pessimisticShifts: Partial<Knobs> = {
    elasticityScale: clamp(0.5, 2.0, knobs.elasticityScale * 0.5),
    capabilityDoublingMonths: clamp(4, 18, knobs.capabilityDoublingMonths * 0.5),
    productivityUplift: clamp(0.1, 0.4, knobs.productivityUplift * 1.5),
    trustMultiplier: clamp(0.5, 1.5, knobs.trustMultiplier * 0.5),
    regSchemaMultiplier: clamp(0.5, 1.5, knobs.regSchemaMultiplier * 1.5),
  };
  const optimisticShifts: Partial<Knobs> = {
    elasticityScale: clamp(0.5, 2.0, knobs.elasticityScale * 1.5),
    capabilityDoublingMonths: clamp(4, 18, knobs.capabilityDoublingMonths * 1.5),
    productivityUplift: clamp(0.1, 0.4, knobs.productivityUplift * 0.5),
    trustMultiplier: clamp(0.5, 1.5, knobs.trustMultiplier * 1.5),
    regSchemaMultiplier: clamp(0.5, 1.5, knobs.regSchemaMultiplier * 0.5),
  };

  return {
    baseline,
    pessimistic: apply(pessimisticShifts),
    optimistic: apply(optimisticShifts),
    perturbedKnobs,
  };
}

// ────────────────────────────────────────────────────────────────────
// KNOB_META — single source of truth for slider configuration + tier
// ────────────────────────────────────────────────────────────────────

export interface KnobMeta {
  knob: keyof Knobs;
  label: string;
  impact: Exclude<ImpactTier, "informational">;
  categoryId: "adoption" | "capability" | "demand" | "friction";
  categoryNumber: number;
  categoryColor: string;
  min: number;
  max: number;
  step: number;
  hint: string;
  /** For segmented controls; if undefined, render as slider */
  segmentedOptions?: number[];
  formatValue: (v: number) => string;
}

const formatMult = (v: number) => `${v.toFixed(2)}×`;

export const KNOB_META: KnobMeta[] = [
  // ── TIER 1: HIGH IMPACT ────────────────────────────────────────
  {
    knob: "horizonYears",
    label: "Time horizon",
    impact: "high",
    categoryId: "adoption",
    categoryNumber: 1,
    categoryColor: "#3a8a4f",
    min: 2,
    max: 10,
    step: 1,
    segmentedOptions: [2, 5, 10],
    hint: "Different mechanisms dominate at different horizons. Drives capability growth and adoption ramp.",
    formatValue: (v) => `${v}yr`,
  },
  {
    knob: "capabilityDoublingMonths",
    label: "Capability doubling time",
    impact: "high",
    categoryId: "capability",
    categoryNumber: 2,
    categoryColor: "#c89531",
    min: 4,
    max: 18,
    step: 0.1,
    hint: "METR / Artificial Analysis frontier doubling rate. Drives the reach function exponentially.",
    formatValue: (v) => `${v.toFixed(1)} mo`,
  },
  {
    knob: "elasticityScale",
    label: "Elasticity scale (Bessen ε)",
    impact: "high",
    categoryId: "demand",
    categoryNumber: 3,
    categoryColor: "#5b7faf",
    min: 0.5,
    max: 2.0,
    step: 0.05,
    hint: "Scales Bessen ε per sector. The (ε−1) factor literally flips the sign of employment change.",
    formatValue: formatMult,
  },
  {
    knob: "productivityUplift",
    label: "Productivity uplift / task",
    impact: "high",
    categoryId: "demand",
    categoryNumber: 3,
    categoryColor: "#5b7faf",
    min: 0.1,
    max: 0.4,
    step: 0.01,
    hint: "Per-task cost savings (Acemoglu 2024 ≈ 27%). Direct linear multiplier on every output.",
    formatValue: (v) => `${(v * 100).toFixed(0)}%`,
  },
  {
    knob: "trustMultiplier",
    label: "Trust multiplier (cultural)",
    impact: "high",
    categoryId: "adoption",
    categoryNumber: 1,
    categoryColor: "#3a8a4f",
    min: 0.5,
    max: 1.5,
    step: 0.05,
    hint: "Cultural aversions (Gallup, NY Fed SCE). Enters via horizonGrowth × trustPull.",
    formatValue: formatMult,
  },
  {
    knob: "regSchemaMultiplier",
    label: "Regulatory schema (sector)",
    impact: "high",
    categoryId: "adoption",
    categoryNumber: 1,
    categoryColor: "#3a8a4f",
    min: 0.5,
    max: 1.5,
    step: 0.05,
    hint: "Sector approval pathway burden (FDA, OCC, state boards). Largest single weight in friction sum (0.25).",
    formatValue: formatMult,
  },

  // ── TIER 2: MEDIUM IMPACT ──────────────────────────────────────
  {
    knob: "verifiabilityRatio",
    label: "Verifiability divergence",
    impact: "medium",
    categoryId: "capability",
    categoryNumber: 2,
    categoryColor: "#c89531",
    min: 1.2,
    max: 4.0,
    step: 0.1,
    hint: "How much faster verifiable tasks (code, math) advance vs subjective ones (Tomei & Klein Teeselink).",
    formatValue: (v) => `${v.toFixed(1)}×`,
  },
  {
    knob: "reliabilityFloorScale",
    label: "Reliability floor scale",
    impact: "medium",
    categoryId: "capability",
    categoryNumber: 2,
    categoryColor: "#c89531",
    min: 0.7,
    max: 1.3,
    step: 0.05,
    hint: "Tightens or loosens regulatory reliability thresholds per sector. Only binding for high-floor sectors.",
    formatValue: formatMult,
  },
  {
    knob: "downtimeSensitivity",
    label: "Downtime sensitivity",
    impact: "medium",
    categoryId: "adoption",
    categoryNumber: 1,
    categoryColor: "#3a8a4f",
    min: 0.5,
    max: 1.5,
    step: 0.05,
    hint: "Asymmetric cost of AI failure (anesthesia, grid, trading). Friction weight 0.20.",
    formatValue: formatMult,
  },
  {
    knob: "computeCostDeclineRate",
    label: "Compute cost trajectory",
    impact: "medium",
    categoryId: "friction",
    categoryNumber: 4,
    categoryColor: "#7a7e8b",
    min: -0.20,
    max: 0.50,
    step: 0.025,
    hint: "Bidirectional. Positive = inference costs declining (Wright's Law); negative = costs rising (energy / GPU shortage / capital costs).",
    formatValue: (v) => (v > 0.005 ? `↓ ${(v * 100).toFixed(1)}%/yr` : v < -0.005 ? `↑ ${(Math.abs(v) * 100).toFixed(1)}%/yr` : "flat"),
  },
  {
    knob: "stateRegMultiplier",
    label: "State regulation drag",
    impact: "medium",
    categoryId: "friction",
    categoryNumber: 4,
    categoryColor: "#7a7e8b",
    min: 0.5,
    max: 1.5,
    step: 0.05,
    hint: "Independent of sector schema (CA SB1047 derivatives, NYC bias audits, CO AI Act). Uniform across sectors.",
    formatValue: formatMult,
  },
  {
    knob: "securityOverheadMultiplier",
    label: "Security & compliance overhead",
    impact: "medium",
    categoryId: "friction",
    categoryNumber: 4,
    categoryColor: "#7a7e8b",
    min: 0.5,
    max: 1.5,
    step: 0.05,
    hint: "SOC 2, HIPAA, FedRAMP, state data sovereignty. Concentrated effect on healthcare, finance, government.",
    formatValue: formatMult,
  },

  // ── TIER 3: LOW SENSITIVITY ────────────────────────────────────
  {
    knob: "genZAdoptionBoost",
    label: "Gen Z adoption boost",
    impact: "low",
    categoryId: "friction",
    categoryNumber: 4,
    categoryColor: "#7a7e8b",
    min: 0.5,
    max: 1.5,
    step: 0.05,
    hint: "Amplifies the Gen Z share's adoption-lifting effect. Effect proportional to (genZShare − 0.15).",
    formatValue: formatMult,
  },
];

export const TIER_THRESHOLDS: Record<Exclude<ImpactTier, "informational">, { label: string; tagline: string; color: string; bg: string; border: string }> = {
  high: {
    label: "Tier 1 · High impact",
    tagline: "Moves sector outputs > 2pp across slider range; can flip employment sign.",
    color: "#a53024",
    bg: "#a5302410",
    border: "#a5302440",
  },
  medium: {
    label: "Tier 2 · Moderating forces",
    tagline: "Shifts outputs 0.5–2pp; reshapes ranking but rarely flips direction.",
    color: "#a36e1e",
    bg: "#a36e1e10",
    border: "#a36e1e40",
  },
  low: {
    label: "Tier 3 · Low sensitivity",
    tagline: "Sub-0.5pp; matters mainly at extremes or for narrow sector classes.",
    color: "#5a6770",
    bg: "#5a677010",
    border: "#5a677040",
  },
};
