/**
 * Extract a structured ModelPolicy from free-text policy documents
 * (RFPs, program designs, WIOA plans, foundation strategies, etc.).
 *
 * The user pastes/uploads policy text; Claude reads it and produces a
 * draft ModelPolicy object that the engine can simulate. Returned
 * fields include confidence + caveats so users know what was inferred
 * vs. extracted.
 */

import { z } from "zod";

// NAICS sectors the engine knows about
const KNOWN_NAICS = [
  "11", "21", "22", "23", "31-33", "42", "44-45", "48-49", "51",
  "52", "53", "54", "55", "56", "61", "62", "71", "72", "81",
];

// Per-sector parameter keys (subset of SectorParams that policies typically move)
export const POLICY_SECTOR_PARAM_KEYS = [
  "exposureShare",
  "verifiabilityShare",
  "trustCoef",
  "reliabilityFloor",
  "elasticity",
  "complementarity",
  "frictionDrag",
  "genZShare",
  "regSchemaDrag",
  "downtimeRisk",
  "securityOverhead",
] as const;

// Knobs a policy can shift
const POLICY_KNOB_KEYS = [
  "trustMultiplier",
  "regSchemaMultiplier",
  "downtimeSensitivity",
  "verifiabilityRatio",
  "reliabilityFloorScale",
  "elasticityScale",
  "productivityUplift",
  "genZAdoptionBoost",
  "stateRegMultiplier",
  "computeCostDeclineRate",
  "securityOverheadMultiplier",
] as const;

// Lenient — accepts any record of string→number, filtered post-parse to known keys
const SectorParamPartial = z.record(z.string(), z.number());
const KnobShifts = z.record(z.string(), z.number());

// Coerce string-or-number to string for NAICS codes (Claude sometimes emits 62 instead of "62")
const NaicsCode = z.union([z.string(), z.number().transform((n) => String(n))]);

export const ExtractedPolicySchema = z.object({
  name: z.string().min(3).max(120),
  category: z.string().min(2).max(60),
  tagline: z.string().min(10).max(280),
  description: z.string().min(40).max(2400),
  typicalCostMillions: z.number().min(0.1).max(2000),
  durationYears: z.number().int().min(1).max(20),
  targetSectors: z.array(NaicsCode).nullable(),
  evidence: z.string().min(20).max(1200),
  addresses: z.array(z.enum(["adoption", "friction"])).min(1).max(2),
  workforceImpacts: z.array(z.string()).min(2).max(10),
  targetPopulations: z.array(z.string()).min(1).max(10),
  sectorOverrides: z.record(z.string(), SectorParamPartial),
  knobShifts: KnobShifts,
  // Meta — not part of ModelPolicy but useful for the UI
  confidence: z.number().min(0).max(1),
  extractionNotes: z.string().max(2000),
});

export type ExtractedPolicy = z.infer<typeof ExtractedPolicySchema>;

/**
 * The system prompt that turns a policy document into a structured
 * ModelPolicy. Lives here so it's editable + testable independently of
 * the route handler.
 */
export function buildExtractionPrompt(policyText: string): string {
  return `You are a workforce-policy analyst. Read the document below and produce a structured JSON description that a labor-displacement simulation model can run.

The model is documented at https://jobsdata.ai/model. It works with 19 NAICS 2-digit sectors and applies policy effects as two things:
1. \`sectorOverrides\` — per-sector additive deltas to sector parameters (most policies adjust 1-6 sectors)
2. \`knobShifts\` — global multipliers (most policies shift 0-3 knobs)

DOCUMENT:
\`\`\`
${policyText.slice(0, 12000)}
\`\`\`

OUTPUT a single JSON object (no markdown, no code fences) with EXACTLY these fields:

{
  "name": "Concise policy name (e.g., 'Pittsburgh Healthcare Workforce Initiative')",
  "category": "One of: Workforce Training | Income Support | Regulatory | Infrastructure | Tax Incentive | Labor Regulation | Data Infrastructure | Education / Income Support | Entrepreneurship | State Workforce System Plan",
  "tagline": "One-sentence hook (under 200 chars) describing what the policy does",
  "description": "2-4 sentence summary of the policy's mechanism — what it funds, who it targets, what it changes",
  "typicalCostMillions": <number, the policy's total budget over its full term in millions USD>,
  "durationYears": <integer, how many years the policy runs>,
  "targetSectors": <array of NAICS 2-digit codes from this list — ${KNOWN_NAICS.join(", ")} — OR null if the policy is cross-sector>,
  "evidence": "1-3 sentences describing the empirical base for the policy's expected effect (cite specific programs/studies if mentioned)",
  "addresses": <subset of ["adoption", "friction"] — adoption = changes how/whether firms deploy AI; friction = buffers workers in the transition>,
  "workforceImpacts": <array of 3-6 short bullet-style strings describing concrete workforce outcomes (who benefits, what changes for workers/employers/the region)>,
  "targetPopulations": <array of 1-5 short phrases identifying who the policy serves — e.g., "Displaced workers", "Youth (in/out of school)", "Mid-career workers", "Workers at small/medium firms", etc.>,
  "sectorOverrides": <object mapping NAICS codes to per-sector parameter adjustments. Use these keys with the documented signs:
    - frictionDrag: NEGATIVE (-0.05 to -0.25) reduces friction (training, wage insurance, apprenticeship)
    - complementarity: POSITIVE (0.03 to 0.15) increases human-AI complementarity (training, augmentation policies)
    - trustCoef: POSITIVE (0.04 to 0.12) raises sectoral willingness to deploy AI; NEGATIVE for resistance policies
    - regSchemaDrag: NEGATIVE (-0.05 to -0.20) reduces sector regulatory burden (licensing reform)
    - securityOverhead: NEGATIVE (-0.05 to -0.15) reduces security/compliance burden (shared infrastructure)
    - downtimeRisk: NEGATIVE (-0.05 to -0.10) reduces failure-tolerance gating
    Magnitudes should match policy scale: a $5M targeted intervention should produce smaller deltas than a $200M comprehensive program. Typical scale: -0.10 to -0.25 frictionDrag for a $30M+ sector-training policy.
  >,
  "knobShifts": <object mapping these knob names to multiplier values:
    - trustMultiplier: 1.0 = no change; 1.10-1.20 = boost trust; 0.80-0.95 = resistance
    - regSchemaMultiplier: 1.0 = no change; 0.75-0.90 = reduce reg burden; 1.10-1.25 = tighten
    - downtimeSensitivity, securityOverheadMultiplier: 1.0 = no change; <1 reduces; >1 increases
    - genZAdoptionBoost: 1.0 = no change; 1.10-1.20 = amplify Gen Z adoption effect
    - computeCostDeclineRate: ADDITIVE delta (not multiplier). 0.05 = adds 5pp/yr to cost decline
    Empty {} is fine if the policy doesn't move global knobs.
  >,
  "confidence": <number 0.0-1.0 reflecting how confident the extraction is — high if the doc is detailed and explicit; low if you had to make many inferences>,
  "extractionNotes": "2-4 sentences calling out which fields you inferred vs. extracted directly, any ambiguities, and warnings the user should know about (e.g., 'Budget inferred from program scale; document didn't state a dollar amount.')"
}

CRITICAL RULES:
- Output ONLY valid JSON; nothing before or after.
- If the document is vague on a field, fill it with a defensible estimate AND lower the confidence accordingly.
- For "addresses": only "adoption" or "friction" — NOT "capability" or "demand" (those are structural, not policy-movable in this model).
- For sectorOverrides and knobShifts: prefer FEWER, LARGER effects over many tiny ones. A real policy moves 1-6 sectors meaningfully, not all 19 weakly.
- If budget is not stated, infer from program scope (small pilot ~$2-10M; state-scale ~$25-75M; federal flagship ~$200M+).
- If duration is not stated, default to 4 years (standard workforce plan cycle).
- If the document is unrelated to workforce / labor / AI / training / regulation, set confidence to 0.1 and explain why in extractionNotes.`;
}

/** Strip code fences if Claude wraps the JSON despite instructions. */
export function stripFences(raw: string): string {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  return s.trim();
}

/**
 * Post-parse cleanup: drop unknown sector-param keys and unknown knob keys,
 * coerce sector codes to strings, drop empty override objects.
 * Run after zod validation; types are loose enough that this just narrows.
 */
export function sanitizeExtractedPolicy(p: ExtractedPolicy): ExtractedPolicy {
  const knownParams = new Set<string>(POLICY_SECTOR_PARAM_KEYS);
  const knownKnobs = new Set<string>(POLICY_KNOB_KEYS);
  const knownSectors = new Set<string>(KNOWN_NAICS);

  const cleanedSectorOverrides: Record<string, Record<string, number>> = {};
  for (const [naics, params] of Object.entries(p.sectorOverrides)) {
    const naicsStr = String(naics);
    if (!knownSectors.has(naicsStr)) continue;
    const filteredParams: Record<string, number> = {};
    for (const [k, v] of Object.entries(params as Record<string, number>)) {
      if (knownParams.has(k) && typeof v === "number" && Number.isFinite(v)) {
        filteredParams[k] = v;
      }
    }
    if (Object.keys(filteredParams).length > 0) {
      cleanedSectorOverrides[naicsStr] = filteredParams;
    }
  }

  const cleanedKnobShifts: Record<string, number> = {};
  for (const [k, v] of Object.entries(p.knobShifts)) {
    if (knownKnobs.has(k) && typeof v === "number" && Number.isFinite(v)) {
      cleanedKnobShifts[k] = v;
    }
  }

  return {
    ...p,
    targetSectors: p.targetSectors
      ? p.targetSectors.map((s) => String(s)).filter((s) => knownSectors.has(s))
      : null,
    sectorOverrides: cleanedSectorOverrides as ExtractedPolicy["sectorOverrides"],
    knobShifts: cleanedKnobShifts as ExtractedPolicy["knobShifts"],
  };
}
