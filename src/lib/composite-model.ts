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
  btosCurrent: number;
  btosPlanned: number;
  capabilityShare: number;
  deployableShare: number;
  economicViableShare: number;
  realizedAdoption: number;
  taskReplacement: number;
  productivityGain: number;
  employmentDelta: number;
  wageImpact: number;
  archetype: Archetype;
}

export type Archetype = "auto-risk" | "reorganize" | "grow" | "less-change";

export function computeSector(sector: Sector, k: Knobs): SectorImpact {
  const p = sector.params;
  const T = k.horizonYears;

  // ── Module 2: AI CAPABILITY ─────────────────────────────────────
  // Capability frontier — METR/Thompson doubling. Soft-saturating.
  const doublings = (T * 12) / k.capabilityDoublingMonths;
  const reach = 1 - Math.pow(0.5, doublings * 0.45);
  const capabilityShare = p.exposureShare * reach;

  // Verifiability acceleration (RL feasibility)
  const verifiabilityBoost =
    1 + (p.verifiabilityShare - 0.5) * (k.verifiabilityRatio - 1) * 0.25;

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
  // Wright's-Law-style cost decline opens a larger share of tasks
  // to economic viability over time.
  const costGate = 0.45 + 0.55 * (1 - Math.exp(-T * k.computeCostDeclineRate * 2));
  const economicViableShare = deployableShare * costGate;

  // ── Module 1: ADOPTION SPEED ────────────────────────────────────
  // Trust + Gen Z amplification
  const baselineTrust = Math.min(1.0, p.trustCoef * k.trustMultiplier);
  const genZAdjustedTrust = Math.min(
    1.0,
    baselineTrust * (1 + (p.genZShare - 0.15) * k.genZAdoptionBoost * 0.6)
  );

  // Composite friction (multiplicative survival)
  const regSchema = p.regSchemaDrag * k.regSchemaMultiplier;
  const downtime  = p.downtimeRisk * k.downtimeSensitivity * 0.35;
  const stateReg  = 0.10 * k.stateRegMultiplier;
  const security  = p.securityOverhead * k.securityOverheadMultiplier * 0.45;
  const institutional = p.frictionDrag;

  const totalFriction = Math.min(
    0.95,
    1 -
      (1 - clamp01(regSchema)) *
      (1 - clamp01(downtime)) *
      (1 - clamp01(stateReg)) *
      (1 - clamp01(security)) *
      (1 - clamp01(institutional))
  );

  const peakAdoption = economicViableShare * genZAdjustedTrust * (1 - totalFriction);

  // Anchor to BTOS current use; logistic ramp toward peak
  const anchor = sector.btos.currentUse / 100;
  const ramp = 1 - Math.exp(-0.35 * T * Math.max(0.3, genZAdjustedTrust));
  const realizedAdoption = Math.min(
    0.95,
    anchor + Math.max(0, peakAdoption - anchor) * ramp
  );

  // ── Task replacement ────────────────────────────────────────────
  const substitutionShare = 1 - p.complementarity;
  const taskReplacement = realizedAdoption * p.exposureShare * substitutionShare;

  // ── Productivity ────────────────────────────────────────────────
  const productivityGain = taskReplacement * k.productivityUplift;

  // ── Module 3: DEMAND ELASTICITY (Bessen identity) ───────────────
  const epsilon = Math.max(0.05, p.elasticity * k.elasticityScale);
  const employmentDelta = (epsilon - 1) * productivityGain * 100;

  // Wage impact — productivity gains accrue partly to workers via complementarity
  const wageImpact = productivityGain * p.complementarity * 100;

  const archetype = classify(employmentDelta, taskReplacement);

  return {
    naics: sector.naics,
    name: sector.name,
    btosCurrent: sector.btos.currentUse,
    btosPlanned: sector.btos.plannedUse,
    capabilityShare: capabilityShare * 100,
    deployableShare: deployableShare * 100,
    economicViableShare: economicViableShare * 100,
    realizedAdoption: realizedAdoption * 100,
    taskReplacement: taskReplacement * 100,
    productivityGain: productivityGain * 100,
    employmentDelta,
    wageImpact,
    archetype,
  };
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
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

export interface Factor {
  id: string;
  name: string;
  description: string;
  citation: { label: string; url?: string };
  knob?: keyof Knobs;
}

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
      },
      {
        id: "sectoral-aversions",
        name: "Sectoral aversions",
        description: "Cultural norms and downtime risk slow deployment differently across sectors. Healthcare practitioners score 0.20 on AI trust; software engineers 0.80 (Gallup, NY Fed SCE). Failure-asymmetric sectors (utilities, anesthesia, trading) add a downtime-risk multiplier even when trust is otherwise high.",
        citation: { label: "Gallup Workplace + NY Fed SCE 2025–26" },
        knob: "trustMultiplier",
      },
      {
        id: "downtime-sensitivity",
        name: "Downtime sensitivity",
        description: "When AI failure has asymmetric cost (a wrong medical diagnosis, a stuck grid, a rogue trade), deployment is gated by failure tolerance, not just average accuracy. This compounds the reliability floor and stays binding even after capability passes.",
        citation: { label: "Internal heuristic; per-sector defaults from regulatory norms" },
        knob: "downtimeSensitivity",
      },
      {
        id: "regulatory-schema",
        name: "Regulatory schema",
        description: "Sector-level approval pathway — licensure, liability allocation, disclosure rules, pre-approval requirements (FDA, FAA, OCC, state medical boards). Each is a real lever that workforce leaders and policymakers can attempt to move.",
        citation: { label: "Hand-coded per-sector schema from federal + sector regulators" },
        knob: "regSchemaMultiplier",
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
      },
      {
        id: "rl-feasibility",
        name: "RL feasibility / verifiability",
        description: "Tasks with explicit verifiable rewards (code, math, structured research) have advanced dramatically faster than tasks with subjective evaluation. The Tomei & Klein Teeselink RL-feasibility index correlates 0.88 with LLM exposure overall but only 0.15 once physically infeasible tasks are excluded — meaning verifiability, not raw exposure, is what predicts where displacement actually concentrates.",
        citation: { label: "Tomei & Klein Teeselink 2026, 'What Jobs Can AI Learn?'", url: "https://arxiv.org/abs/2605.02598" },
        knob: "verifiabilityRatio",
      },
      {
        id: "reliability-floor",
        name: "Sector reliability floor",
        description: "Capability ≠ deployment. A 90%-reliable generator passes for marketing copy; radiology and anesthesia require 99.99%. The model only counts a task as deployable when capability × verifiability ≥ the sector's floor. Healthcare's 0.9999 floor strips ~70% of theoretical capability at every horizon.",
        citation: { label: "Per-sector floors from FDA, FAA, OCC, state bar benchmarks" },
        knob: "reliabilityFloorScale",
      },
      {
        id: "model-benchmarks",
        name: "Model benchmarks & quality index (live)",
        description: `Artificial Analysis tracks frontier-model performance across quality (MMLU, GPQA, HumanEval, MATH), latency, throughput, and price-per-token in near-real-time. Their cross-model Intelligence Index is the closest thing to a vendor-neutral measure of where the capability frontier actually sits today. We wire it in directly: the "Capability doubling" and "Compute cost decline" defaults above are fit live to AA's frontier path. Last refresh: ${CAPABILITY_ANCHOR.fetchedAt.slice(0, 10)} — ${CAPABILITY_ANCHOR.frontierReleases} frontier-defining releases tracked; current top model: ${CAPABILITY_ANCHOR.currentFrontier[0]?.name} (Intelligence Index ${CAPABILITY_ANCHOR.currentFrontier[0]?.intelligenceIndex}). Run \`npx tsx scripts/fetch-capability.ts\` to refresh.`,
        citation: { label: "Artificial Analysis — Independent AI model benchmarks", url: "https://artificialanalysis.ai/" },
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
      },
      {
        id: "openai-archetypes",
        name: "OpenAI four-archetype frame",
        description: "Every sector maps onto one of four outcomes: auto-risk (pressure overwhelms buffers), reorganize (task mix shifts, employment roughly flat), grow (elasticity dominates, productivity expands jobs), less-change (capability or friction holds displacement in check). The color coding in the table reflects this classification.",
        citation: { label: "OpenAI Jobs Transition Framework 2026" },
      },
      {
        id: "productivity-uplift",
        name: "Productivity uplift per replaced task",
        description: "Per-task cost savings when AI substitutes for human labor. Acemoglu's 'Simple Macroeconomics of AI' bounds this at ~27% across automatable tasks. This is the Δln(A) term in the Bessen identity — it sets the magnitude that elasticity then translates into employment change.",
        citation: { label: "Acemoglu 2024, 'The Simple Macroeconomics of AI'", url: "https://www.nber.org/papers/w32487" },
        knob: "productivityUplift",
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
        id: "gen-z-share",
        name: "Generational composition",
        description: "Each sector carries an age mix. Gen Z workers show measurably higher AI tool adoption and lower normative resistance (Bick/Deming RPS age cuts). A Rust Belt MSA with an older incumbent workforce and a Sun Belt MSA with a younger one have different adoption velocities for the same sector — captured here via per-sector Gen Z share × a global multiplier.",
        citation: { label: "Bick/Deming Real-time Population Survey + NY Fed SCE workplace tracker" },
        knob: "genZAdoptionBoost",
      },
      {
        id: "state-regulation",
        name: "State-level regulation",
        description: "Independent of federal/sector schema (Adoption Speed § 4), state legislatures are actively passing AI deployment rules — California SB 1047 derivatives, NYC bias audits, Colorado AI Act, state attorney general enforcement priorities. Captured as a uniform-by-default drag the user can scale up or down.",
        citation: { label: "NCSL AI legislation tracker, 2026 session" },
        knob: "stateRegMultiplier",
      },
      {
        id: "compute-costs",
        name: "Compute, token & energy costs",
        description: "Token costs follow a Wright's-Law decline (~15%/yr base case fit to Hoffmann scaling). Energy and supervision overhead don't fall as fast. The model treats this as a cost gate that opens economic viability for more tasks over the horizon, separately from raw capability.",
        citation: { label: "Wright's Law fit to Hoffmann scaling + Anthropic/OpenAI pricing history" },
        knob: "computeCostDeclineRate",
      },
      {
        id: "latency-risk",
        name: "Latency & reliability premiums",
        description: "High-stakes deployment (anesthesia, grid routing, financial trade execution) carries premiums that decline more slowly than commodity inference — latency SLA, redundancy, human-in-the-loop verification. Captured as a downtime-risk multiplier (see Adoption Speed § 3) that compounds with the reliability floor.",
        citation: { label: "Sector-specific deployment cost studies; folded into downtime sensitivity" },
      },
      {
        id: "security-overhead",
        name: "Security & compliance overhead",
        description: "SOC 2, HIPAA, FedRAMP, PCI, state data sovereignty. Compliance overhead bites hardest in healthcare (HIPAA), finance (SOC + PCI), and information sectors (data sovereignty). The model treats it as drag on adoption proportional to per-sector compliance burden × a global multiplier.",
        citation: { label: "Per-sector compliance burden estimates; HIPAA/SOC/FedRAMP frameworks" },
        knob: "securityOverheadMultiplier",
      },
    ],
  },
];
