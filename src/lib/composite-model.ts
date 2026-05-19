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
