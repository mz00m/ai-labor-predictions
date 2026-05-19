"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import btosData from "@/data/btos-sectors.json";
import RegionCombobox from "@/components/model/RegionCombobox";
import regionsData from "@/data/regions.json";
import policiesData from "@/data/policies.json";
import {
  Sector,
  Knobs,
  DEFAULT_KNOBS,
  computeSector,
  applyPolicy,
  regionalAggregate,
  findDominantRisk,
  findSensitivityFlip,
  computeRobustnessBand,
  Region,
  ModelPolicy,
  KNOB_META,
  ARCHETYPE_META,
  generateStateWioaPolicy,
} from "@/lib/composite-model";

const sectors = btosData.sectors as Sector[];
const regions = regionsData.regions as Region[];
const staticCatalog = policiesData.policies as ModelPolicy[];

// Scenario presets — borrowed from /model with consistent definitions
const SCENARIOS: Record<string, { name: string; tagline: string; knobs: Knobs }> = {
  status_quo: {
    name: "Status Quo Persists",
    tagline: "Slow capability · High friction",
    knobs: {
      ...DEFAULT_KNOBS,
      capabilityDoublingMonths: 14,
      trustMultiplier: 0.7,
      regSchemaMultiplier: 1.4,
      downtimeSensitivity: 1.3,
      stateRegMultiplier: 1.4,
      computeCostDeclineRate: 0.08,
      securityOverheadMultiplier: 1.3,
    },
  },
  steady: {
    name: "Steady Diffusion",
    tagline: "Slow capability · Low friction",
    knobs: { ...DEFAULT_KNOBS, capabilityDoublingMonths: 14, trustMultiplier: 1.1, regSchemaMultiplier: 0.7 },
  },
  overhang: {
    name: "Capability Overhang",
    tagline: "Fast capability · High friction",
    knobs: {
      ...DEFAULT_KNOBS,
      capabilityDoublingMonths: 4,
      trustMultiplier: 0.7,
      regSchemaMultiplier: 1.5,
      downtimeSensitivity: 1.4,
      stateRegMultiplier: 1.5,
      securityOverheadMultiplier: 1.4,
    },
  },
  rapid: {
    name: "Rapid Transformation",
    tagline: "Fast capability · Low friction",
    knobs: {
      ...DEFAULT_KNOBS,
      capabilityDoublingMonths: 4,
      trustMultiplier: 1.3,
      regSchemaMultiplier: 0.6,
      stateRegMultiplier: 0.6,
      computeCostDeclineRate: 0.30,
      securityOverheadMultiplier: 0.7,
    },
  },
};

// Only Adoption Speed and Friction Buffer are realistically policy-movable.
// Capability is set by the AI frontier; Demand Elasticity by market structure.
const FRAMEWORK_LABELS = {
  adoption: { label: "Adoption Speed", color: "#0f766e", num: 1, movable: true },
  capability: { label: "AI Capability", color: "#c89531", num: 2, movable: false },
  demand: { label: "Demand Elasticity", color: "#5b7faf", num: 3, movable: false },
  friction: { label: "Friction Buffer", color: "#7a7e8b", num: 4, movable: true },
};

export default function PolicyAnalysisPage() {
  const [regionId, setRegionId] = useState<string>("pittsburgh");
  const [scenarioId, setScenarioId] = useState<keyof typeof SCENARIOS>("steady");
  const [policyId, setPolicyId] = useState<string | null>(null);

  const region = regions.find((r) => r.id === regionId)!;
  const knobs = SCENARIOS[scenarioId].knobs;
  // Catalog = static policies + dynamically-generated state WIOA plan for selected region
  const fullCatalog = useMemo<ModelPolicy[]>(
    () => [...staticCatalog, generateStateWioaPolicy(region)],
    [region]
  );
  const policy = policyId ? fullCatalog.find((p) => p.id === policyId) ?? null : null;

  // Baseline (no policy)
  const baseImpacts = useMemo(
    () => sectors.map((s) => computeSector(s, knobs)),
    [knobs]
  );
  const baseAggregate = useMemo(
    () => regionalAggregate(baseImpacts, region),
    [baseImpacts, region]
  );

  // With policy
  const { sectors: postSectors, knobs: postKnobs } = useMemo(() => {
    if (!policy) return { sectors, knobs };
    return applyPolicy(sectors, knobs, policy);
  }, [policy, knobs]);

  const policyImpacts = useMemo(
    () => postSectors.map((s) => computeSector(s, postKnobs)),
    [postSectors, postKnobs]
  );
  const policyAggregate = useMemo(
    () => regionalAggregate(policyImpacts, region),
    [policyImpacts, region]
  );

  // Trust mechanisms
  const dominantRisk = useMemo(
    () => findDominantRisk(baseAggregate, sectors),
    [baseAggregate]
  );
  const sensitivityFlips = useMemo(
    () => findSensitivityFlip(sectors, knobs, region, policy ?? undefined),
    [knobs, region, policy]
  );
  const robustness = useMemo(
    () => computeRobustnessBand(sectors, knobs, region, policy ?? undefined),
    [knobs, region, policy]
  );

  const policyDelta = policyAggregate.totalJobsImpacted - baseAggregate.totalJobsImpacted;

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
          jobsdata.ai / model / policy
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] leading-tight mb-4">
          Workforce Policy Diagnostic
        </h1>
        <p className="text-lg text-[var(--muted)] leading-[1.7] mb-3">
          Pick a region. Pick a scenario. Pick a policy. Get a guidance
          document that flags where the policy meets the region&apos;s post-AI
          workforce needs — and where the gaps are.
        </p>
        <p className="text-sm text-[var(--muted)] leading-[1.6] italic">
          v0.1 prototype. 9 reference MSAs (BLS QCEW), 14 policy archetypes
          (incl. Windfall Trust Policy Atlas), regional rollup of the{" "}
          <Link href="/model" className="text-[var(--accent-text)] hover:underline">
            composite model
          </Link>
          . To stack multiple policies use{" "}
          <Link href="/model/portfolio" className="text-[var(--accent-text)] hover:underline">
            /model/portfolio
          </Link>
          ; for an optimizer-driven recommendation given a budget use{" "}
          <Link href="/model/budget" className="text-[var(--accent-text)] hover:underline">
            /model/budget
          </Link>
          .
        </p>
      </header>

      {/* Step 1 — Region */}
      <Step number={1} title="Pick a region">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          <div>
            <RegionCombobox regions={regions} regionId={regionId} setRegionId={setRegionId} />
            <p className="text-sm text-[var(--muted)] mt-2 leading-[1.6]">
              <strong className="text-[var(--foreground)]">{region.name}.</strong> {region.concentrationNote}
            </p>
          </div>
          <RegionSectorMix region={region} />
        </div>
      </Step>

      {/* Step 2 — Scenario */}
      <Step number={2} title="Pick a scenario">
        <p className="text-sm text-[var(--muted)] mb-3">
          Baseline (no policy) jobs Δ in {region.name} under each scenario, at {knobs.horizonYears}-year horizon.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {Object.entries(SCENARIOS).map(([id, s]) => {
            const preview = sectors.map((sec) => computeSector(sec, s.knobs));
            const previewAgg = regionalAggregate(preview, region);
            const previewJobs = previewAgg.totalJobsImpacted;
            return (
              <button
                key={id}
                onClick={() => setScenarioId(id as keyof typeof SCENARIOS)}
                className={`text-left p-3.5 rounded-lg border-2 transition-colors hover:border-[var(--foreground)] ${
                  scenarioId === id ? "border-[var(--foreground)] bg-card" : "border-card bg-card"
                }`}
              >
                <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                  {s.tagline}
                </p>
                <p className="text-sm font-semibold text-[var(--foreground)] mb-1.5">{s.name}</p>
                <p
                  className="text-base font-bold tabular-nums"
                  style={{ color: previewJobs >= 0 ? "#3a8a4f" : "#d4493a" }}
                >
                  {formatJobs(previewJobs, true)} jobs
                </p>
              </button>
            );
          })}
        </div>
      </Step>

      {/* Step 3 — Policy */}
      <Step number={3} title="Pick a policy to review">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fullCatalog.map((p) => {
            const selected = policyId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPolicyId(selected ? null : p.id)}
                className={`text-left p-4 rounded-lg border-2 transition-colors hover:border-[var(--foreground)] ${
                  selected ? "border-[var(--foreground)] bg-card" : "border-card bg-card"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{p.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    {p.category}
                  </p>
                </div>
                <p className="text-xs text-[var(--muted)] leading-[1.55] mb-2">{p.tagline}</p>
                <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] flex-wrap mb-1.5">
                  <span>${p.typicalCostMillions}M · {p.durationYears}yr</span>
                  <span>•</span>
                  <span>{p.targetSectors ? `Sectors: ${p.targetSectors.join(", ")}` : "Cross-sector"}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(p.targetPopulations ?? []).slice(0, 3).map((pop) => (
                    <span
                      key={pop}
                      className="text-[10px] text-[var(--muted)] bg-[var(--background)] px-1.5 py-0.5 rounded"
                    >
                      {pop}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </Step>

      {/* Step 4 — Diagnostic Report */}
      {policy && (
        <div className="mt-10 bg-card border border-card rounded-lg p-6 sm:p-8">
          <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Diagnostic report — {region.name}
            </p>
            <p className="text-xs text-[var(--muted)]">
              Scenario: <strong className="text-[var(--foreground)]">{SCENARIOS[scenarioId].name}</strong>
              {" · "}Horizon: {knobs.horizonYears}yr
            </p>
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3 leading-tight">
            {policy.name}
          </h2>

          {/* VERDICT — one-sentence lead */}
          <VerdictBanner
            policy={policy}
            region={region}
            policyDelta={policyDelta}
            dominantRisk={dominantRisk}
          />

          {/* Regional baseline */}
          <ReportSection
            heading="Regional baseline — no policy"
            subhead={`Projected employment change in ${region.name} at ${knobs.horizonYears}-year horizon under the ${SCENARIOS[scenarioId].name} scenario.`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <BigStat label="Jobs lost" value={formatJobs(baseAggregate.jobsLost, true)} color="#d4493a" />
              <BigStat label="Jobs added" value={formatJobs(baseAggregate.jobsAdded, true)} color="#3a8a4f" />
              <BigStat label="Net Δ" value={formatJobs(baseAggregate.totalJobsImpacted, true)} color={baseAggregate.totalJobsImpacted < 0 ? "#d4493a" : "#3a8a4f"} />
            </div>
            <RegionalTopSectors agg={baseAggregate} max={5} />
          </ReportSection>

          {/* With policy */}
          <ReportSection
            heading="With this policy in place"
            subhead={`Counterfactual: ${region.name} under the same scenario, but with ${policy.name} active. The "Net jobs Δ" row is the absolute outcome; the policy contribution row is how much of that the policy itself moved.`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <BigStat label="Jobs lost (with policy)" value={formatJobs(policyAggregate.jobsLost, true)} color="#d4493a" />
              <BigStat label="Jobs added (with policy)" value={formatJobs(policyAggregate.jobsAdded, true)} color="#3a8a4f" />
              <BigStat
                label="Net jobs Δ (with policy)"
                value={formatJobs(policyAggregate.totalJobsImpacted, true)}
                color={policyAggregate.totalJobsImpacted < 0 ? "#d4493a" : "#3a8a4f"}
              />
              <BigStat
                label="Policy contribution"
                value={`${policyDelta >= 0 ? "+" : ""}${formatJobs(policyDelta)}`}
                color={policyDelta > 1000 ? "#3a8a4f" : policyDelta < -1000 ? "#d4493a" : "#7a7e8b"}
              />
            </div>

            {/* Sector breakdown — post-policy AND delta */}
            <PostPolicySectorBreakdown
              baseline={baseAggregate}
              postPolicy={policyAggregate}
              max={6}
            />

            <p className="text-sm text-[var(--muted)] leading-[1.65] mt-4">
              <strong className="text-[var(--foreground)]">Cost per outcome:</strong>{" "}
              {Math.abs(policyDelta) > 0
                ? `~$${((policy.typicalCostMillions * 1_000_000) / Math.abs(policyDelta)).toFixed(0)} per net job moved`
                : `Policy investment ($${policy.typicalCostMillions}M) showed no net regional jobs delta at the modeled horizon`}
              .{" "}
              <span className="italic">
                Coverage estimate, not an impact-evaluation number. Real cost-per-job requires longitudinal program data.
              </span>
            </p>
          </ReportSection>

          {/* SECTION C — Workforce impact */}
          <ReportSection
            heading="Workforce impact"
            subhead="What this policy actually does for workers, employers, and the regional economy. Framework-coverage chips at the bottom are a secondary signal — what matters most is the lived workforce reality."
          >
            {/* Target populations */}
            {policy.targetPopulations && policy.targetPopulations.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                  Who benefits
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {policy.targetPopulations.map((pop) => (
                    <span
                      key={pop}
                      className="text-xs px-2 py-1 rounded bg-[var(--background)] border border-divider text-[var(--foreground)]"
                    >
                      {pop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Workforce impacts */}
            {policy.workforceImpacts && policy.workforceImpacts.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                  What changes
                </p>
                <ul className="space-y-1.5 text-sm text-[var(--muted)] leading-[1.6] list-disc ml-5">
                  {policy.workforceImpacts.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sectors lifted */}
            {policy.targetSectors && policy.targetSectors.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                  Sectoral focus in {region.name}
                </p>
                <p className="text-sm text-[var(--muted)] leading-[1.6]">
                  Concentrates effort on{" "}
                  {policy.targetSectors
                    .map((naics) => {
                      const s = sectors.find((x) => x.naics === naics);
                      const share = region.sectorShares[naics] ?? 0;
                      return s ? `${s.name} (${(share * 100).toFixed(1)}% of regional jobs)` : naics;
                    })
                    .join("; ")}
                  .
                </p>
              </div>
            )}

            {/* Secondary: model dimensions moved */}
            <div className="mt-5 pt-4 border-t border-divider">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                Model dimensions this policy moves
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {(["adoption", "friction"] as const).map((cat) => {
                  const meta = FRAMEWORK_LABELS[cat];
                  const covered = policy.addresses.includes(cat);
                  return (
                    <span
                      key={cat}
                      className="text-[11px] px-2 py-1 rounded font-medium"
                      style={{
                        background: covered ? `${meta.color}20` : "transparent",
                        color: covered ? meta.color : "var(--muted)",
                        border: covered ? `1px solid ${meta.color}40` : "1px solid var(--divider)",
                      }}
                    >
                      {covered ? "✓" : "○"} {meta.label}
                    </span>
                  );
                })}
                <span className="text-[11px] text-[var(--muted)] italic ml-2">
                  AI Capability and Demand Elasticity are structural (set by the AI frontier and market) — policies can&apos;t shift those, so the model shows them only as context.
                </span>
              </div>
            </div>
          </ReportSection>

          {/* SECTION D — Gap callout (TRUST: attribution) */}
          {dominantRisk && (
            <ReportSection
              heading="Gap analysis — dominant regional risk"
              subhead="The dominant local risk and whether this policy addresses it."
            >
              <div
                className="rounded-lg p-4 mb-3 border-l-4"
                style={{
                  borderColor: FRAMEWORK_LABELS[dominantRisk.category].color,
                  background: `${FRAMEWORK_LABELS[dominantRisk.category].color}10`,
                }}
              >
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
                  Dominant regional risk
                </p>
                <p className="text-base font-semibold text-[var(--foreground)] mb-2">
                  {dominantRisk.sector.name}{" "}
                  <span className="font-normal text-[var(--muted)] text-sm">
                    · {formatJobs(dominantRisk.sector.regionalJobsImpacted, true)} jobs in {region.name}
                  </span>
                </p>
                <p className="text-sm text-[var(--muted)] leading-[1.6] mb-2">
                  {dominantRisk.driverNarrative}
                </p>
                {/* Driver attribution (trust) */}
                <details className="text-xs">
                  <summary className="cursor-pointer text-[var(--accent-text)] hover:underline">
                    Why this risk &mdash; underlying parameters
                  </summary>
                  <ul className="mt-2 space-y-1 text-[var(--muted)]">
                    {dominantRisk.drivers.map((d) => (
                      <li key={d.paramOrKnob}>
                        <strong className="text-[var(--foreground)]">{d.paramOrKnob} = {d.value.toFixed(2)}</strong>{" "}
                        — {d.role}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              {dominantRisk.category === "capability" || dominantRisk.category === "demand" ? (
                <div className="rounded-lg p-4 bg-[#a36e1e10] border border-[#a36e1e40]">
                  <p className="text-sm font-semibold text-[#a36e1e] mb-1">
                    ⚠ Structural exposure — policy can mitigate, not eliminate
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-[1.6]">
                    {region.name}&apos;s dominant exposure runs through{" "}
                    <strong className="text-[var(--foreground)]">{FRAMEWORK_LABELS[dominantRisk.category].label}</strong>{" "}
                    in {dominantRisk.sector.name} — a structural feature of how the AI frontier and the market for these services interact.
                    Workforce policy can&apos;t change the underlying capability trajectory or demand elasticity directly.
                    What policy <em>can</em> do is buffer affected workers and adjust adoption speed.
                    {policy.name} delivers{" "}
                    {policy.addresses.map((a) => FRAMEWORK_LABELS[a].label).join(" + ")} support, which is the right type of intervention for this kind of structural exposure.
                  </p>
                </div>
              ) : !policy.addresses.includes(dominantRisk.category) ? (
                <div className="rounded-lg p-4 bg-[#d4493a10] border border-[#d4493a40]">
                  <p className="text-sm font-semibold text-[#a53024] mb-1">
                    ⚠ Gap: policy doesn&apos;t address the dominant policy-movable risk
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-[1.6]">
                    {region.name}&apos;s biggest <em>policy-movable</em> exposure is{" "}
                    <strong className="text-[var(--foreground)]">{FRAMEWORK_LABELS[dominantRisk.category].label}</strong>{" "}
                    in {dominantRisk.sector.name}. {policy.name} addresses{" "}
                    {policy.addresses.map((a) => FRAMEWORK_LABELS[a].label).join(" + ")}, but
                    does not move the {FRAMEWORK_LABELS[dominantRisk.category].label} dimension.
                    Consider a parallel intervention.
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-2 italic">
                    Suggested adjacent: {suggestedAdjacent(dominantRisk.category, fullCatalog, policy.id).map((p) => p.name).join(", ") || "—"}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg p-4 bg-[#3a8a4f10] border border-[#3a8a4f40]">
                  <p className="text-sm font-semibold text-[#2e6e3f] mb-1">
                    ✓ Policy targets the dominant policy-movable risk
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-[1.6]">
                    The {FRAMEWORK_LABELS[dominantRisk.category].label} dimension is what&apos;s
                    driving the region&apos;s exposure, and this policy moves it. Doesn&apos;t mean
                    it&apos;s sufficient — check the sensitivity flip below.
                  </p>
                </div>
              )}
            </ReportSection>
          )}

          {/* SECTION E — Trust: what would change this */}
          <ReportSection
            heading="What would change this assessment"
            subhead="Smallest knob movements that would flip the net regional jobs sign. If the closest flip requires a > 50% change in a knob, treat the assessment as robust."
          >
            {sensitivityFlips.length === 0 ? (
              <p className="text-sm text-[var(--muted)] italic">
                No single high-impact knob can flip the sign within its full slider range — the
                regional projection is structurally robust to individual parameter changes.
              </p>
            ) : (
              <div className="space-y-2">
                {sensitivityFlips.map((flip) => {
                  const pctChange = ((flip.flipValue - flip.currentValue) / Math.max(0.01, Math.abs(flip.currentValue))) * 100;
                  return (
                    <div key={flip.knob} className="rounded-lg p-3 bg-[var(--background)] border border-divider">
                      <p className="text-sm text-[var(--foreground)] mb-1">
                        <strong>{flip.knobLabel}</strong>{" "}
                        would need to move from{" "}
                        <code className="bg-card px-1.5 py-0.5 rounded text-xs">{flip.currentValue.toFixed(2)}</code>{" "}
                        to{" "}
                        <code className="bg-card px-1.5 py-0.5 rounded text-xs">{flip.flipValue.toFixed(2)}</code>{" "}
                        ({pctChange >= 0 ? "+" : ""}{pctChange.toFixed(0)}%)
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        That would shift the regional net from{" "}
                        <span style={{ color: flip.baselineNetJobs < 0 ? "#d4493a" : "#3a8a4f" }}>
                          {formatJobs(flip.baselineNetJobs, true)} jobs
                        </span>{" "}
                        to{" "}
                        <span style={{ color: flip.flippedNetJobs < 0 ? "#d4493a" : "#3a8a4f" }}>
                          {formatJobs(flip.flippedNetJobs, true)} jobs
                        </span>
                        {flip.feasible ? (
                          <span className="ml-2 px-1.5 py-0.5 bg-[#a36e1e15] text-[#a36e1e] text-[10px] uppercase tracking-wider rounded">
                            Feasible move
                          </span>
                        ) : (
                          <span className="ml-2 px-1.5 py-0.5 bg-[#5a677015] text-[#5a6770] text-[10px] uppercase tracking-wider rounded">
                            Large move — robust
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </ReportSection>

          {/* SECTION F — Trust: robustness band with confidence interpretation */}
          <ReportSection
            heading="Confidence score"
            subhead="What if our defaults are off by 50% on the high-impact knobs? Range of regional net jobs Δ under pessimistic and optimistic perturbations."
          >
            <ConfidenceBanner robustness={robustness} regionName={region.name} />
            <RobustnessBar
              pessimistic={robustness.pessimistic}
              baseline={robustness.baseline}
              optimistic={robustness.optimistic}
            />
            <p className="text-xs text-[var(--muted)] mt-3 italic">
              Perturbed: {robustness.perturbedKnobs.join(", ")}. The confidence rating above
              treats <strong className="text-[var(--foreground)]">High</strong> = pessimistic
              and optimistic both point the same direction;{" "}
              <strong className="text-[var(--foreground)]">Low</strong> = they straddle zero.
            </p>
          </ReportSection>

          {/* SECTION G — Historical analog */}
          <ReportSection
            heading="Historical analog & evidence"
            subhead="What the workforce-program literature says about policies in this archetype."
          >
            <div className="rounded-lg p-4 bg-[var(--background)] border border-divider">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
                Evidence base for {policy.name}
              </p>
              <p className="text-sm text-[var(--muted)] leading-[1.65] mb-2">
                {policy.evidence}
              </p>
              <a
                href={policy.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--accent-text)] hover:underline"
              >
                → Source
              </a>
            </div>
          </ReportSection>

          {/* SECTION H — Recommended actions */}
          <ReportSection
            heading="Recommended actions for policymakers"
            subhead=""
          >
            <ol className="space-y-2.5 text-sm text-[var(--muted)] leading-[1.65] list-decimal ml-5">
              <li>
                <strong className="text-[var(--foreground)]">Anchor decision on what&apos;s robust.</strong>{" "}
                The robustness band above shows the range of outcomes when our defaults move by ±50%.
                Treat directional findings inside that band as defensible; treat point estimates as guidance only.
              </li>
              {dominantRisk && !(policy.addresses as readonly string[]).includes(dominantRisk.category) && (
                <li>
                  <strong className="text-[var(--foreground)]">Add a complementary intervention.</strong>{" "}
                  {region.name}&apos;s dominant exposure is {FRAMEWORK_LABELS[dominantRisk.category].label} —
                  this policy doesn&apos;t move that dimension. Pair {policy.name} with a {FRAMEWORK_LABELS[dominantRisk.category].label}-targeting intervention to close the gap.
                </li>
              )}
              {sensitivityFlips.length > 0 && sensitivityFlips[0].feasible && (
                <li>
                  <strong className="text-[var(--foreground)]">Watch the sensitivity flip knob.</strong>{" "}
                  A {Math.abs(((sensitivityFlips[0].flipValue - sensitivityFlips[0].currentValue) / sensitivityFlips[0].currentValue) * 100).toFixed(0)}% movement in <em>{sensitivityFlips[0].knobLabel}</em> would change the sign of the projection.
                  Build trigger indicators that flag if that knob moves materially in the next 12 months,
                  and pre-commit to a course correction.
                </li>
              )}
              <li>
                <strong className="text-[var(--foreground)]">Pre-commit to re-evaluation.</strong>{" "}
                Re-run this diagnostic quarterly. The capability anchor refreshes from{" "}
                <a
                  href="https://artificialanalysis.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-text)] hover:underline"
                >
                  Artificial Analysis
                </a>{" "}
                and the BTOS adoption data ships every two weeks from Census. Material movement on either
                triggers a refresh.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Don&apos;t mistake this for an impact evaluation.</strong>{" "}
                This is structured thinking, not RCT-grade causal evidence. Use it to flag gaps and
                stress-test assumptions, then commission the actual program evaluation separately.
              </li>
            </ol>
          </ReportSection>

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-divider">
            <p className="text-xs text-[var(--muted)] italic leading-[1.6]">
              Generated by jobsdata.ai composite displacement model. Region data from BLS QCEW;
              capability anchor live from Artificial Analysis; adoption anchored to Census BTOS
              AI Supplement (2026); demand elasticity ε from Bessen (2019). Every parameter is
              user-adjustable on{" "}
              <Link href="/model" className="text-[var(--accent-text)] hover:underline">
                /model
              </Link>
              . Methodology and limitations documented inline. Last refresh: capability anchor
              today.
            </p>
          </div>
        </div>
      )}

      {!policy && (
        <div className="mt-10 bg-card border border-card rounded-lg p-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            Pick a policy above to generate the diagnostic report.
          </p>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

function suggestedAdjacent(
  cat: "adoption" | "capability" | "demand" | "friction",
  all: ModelPolicy[],
  excludeId: string
): ModelPolicy[] {
  return all.filter((p) => p.id !== excludeId && (p.addresses as readonly string[]).includes(cat)).slice(0, 2);
}

function formatJobs(n: number, signed = false): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  const abs = Math.abs(n);
  let core: string;
  if (abs >= 1_000_000) core = `${(abs / 1_000_000).toFixed(2)}M`;
  else if (abs >= 1_000) core = `${(abs / 1_000).toFixed(1)}K`;
  else core = `${Math.round(abs)}`;
  return signed ? `${sign}${core}` : core;
}

// ────────────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────────────

function ConfidenceBanner({
  robustness,
  regionName,
}: {
  robustness: ReturnType<typeof computeRobustnessBand>;
  regionName: string;
}) {
  const allPositive = robustness.pessimistic > 500 && robustness.baseline > 500 && robustness.optimistic > 500;
  const allNegative = robustness.pessimistic < -500 && robustness.baseline < -500 && robustness.optimistic < -500;
  const straddles = Math.sign(robustness.pessimistic) !== Math.sign(robustness.optimistic);

  let label: string;
  let color: string;
  let interpretation: string;

  if (allPositive) {
    label = "High confidence — growth holds";
    color = "#3a8a4f";
    interpretation = `Even under pessimistic assumptions, ${regionName} still gains ${formatJobs(robustness.pessimistic, true)} jobs. The directional finding is robust.`;
  } else if (allNegative) {
    label = "High confidence — decline holds";
    color = "#d4493a";
    interpretation = `Even under optimistic assumptions, ${regionName} still loses ${formatJobs(Math.abs(robustness.optimistic))} jobs. The directional finding is robust.`;
  } else if (straddles) {
    label = "Low confidence — outcome could flip";
    color = "#a36e1e";
    interpretation = `Pessimistic ${formatJobs(robustness.pessimistic, true)} jobs vs. optimistic ${formatJobs(robustness.optimistic, true)} jobs — the assumptions you make about capability, elasticity, and productivity drive whether the policy helps or hurts.`;
  } else {
    label = "Medium confidence — magnitude uncertain";
    color = "#7a7e8b";
    interpretation = `Direction is consistent but magnitude swings between ${formatJobs(robustness.pessimistic, true)} (pessimistic) and ${formatJobs(robustness.optimistic, true)} (optimistic). Plan for the floor; budget for the spread.`;
  }

  return (
    <div className="rounded-lg p-4 mb-4 border-l-4" style={{ borderColor: color, background: `${color}10` }}>
      <p className="text-xs uppercase tracking-[0.15em] font-bold mb-1" style={{ color }}>
        {label}
      </p>
      <p className="text-sm text-[var(--foreground)] leading-[1.55]">
        {interpretation}
      </p>
    </div>
  );
}

function VerdictBanner({
  policy,
  region,
  policyDelta,
  dominantRisk,
}: {
  policy: ModelPolicy;
  region: Region;
  policyDelta: number;
  dominantRisk: ReturnType<typeof findDominantRisk>;
}) {
  // Categorize the verdict
  const meaningful = Math.abs(policyDelta) > 500;
  const positive = policyDelta > 500;
  const structural = dominantRisk && (dominantRisk.category === "capability" || dominantRisk.category === "demand");
  const gapPresent =
    dominantRisk && !structural && !(policy.addresses as readonly string[]).includes(dominantRisk.category);

  // Build the verdict
  let verdict: string;
  let tone: "positive" | "caution" | "neutral";
  if (!meaningful) {
    verdict = `${policy.name} produces little net regional jobs movement in ${region.name} under this scenario — the policy is either small relative to regional employment or the scenario is too constraining for it to move outcomes.`;
    tone = "neutral";
  } else if (positive && !gapPresent && !structural) {
    verdict = `${policy.name} moves a meaningful ${formatJobs(policyDelta, true)} jobs in ${region.name} and targets the dominant policy-movable risk. Ship it; pair with quarterly re-evaluation.`;
    tone = "positive";
  } else if (positive && gapPresent && dominantRisk) {
    verdict = `${policy.name} moves ${formatJobs(policyDelta, true)} jobs in ${region.name}, but ${region.name}'s dominant policy-movable risk is ${FRAMEWORK_LABELS[dominantRisk.category as "adoption" | "friction"].label} — which this policy doesn't touch. Pair it with a ${FRAMEWORK_LABELS[dominantRisk.category as "adoption" | "friction"].label.toLowerCase()} intervention.`;
    tone = "caution";
  } else if (positive && structural && dominantRisk) {
    verdict = `${policy.name} moves ${formatJobs(policyDelta, true)} jobs in ${region.name}. The region's dominant exposure runs through ${FRAMEWORK_LABELS[dominantRisk.category as keyof typeof FRAMEWORK_LABELS].label} (structural — policy can mitigate, not eliminate). This policy is the right type of intervention for this kind of exposure.`;
    tone = "positive";
  } else {
    verdict = `${policy.name} produces ${formatJobs(policyDelta, true)} net jobs in ${region.name} — a degradation vs. the no-policy baseline. Check whether the policy is mis-targeted for this region or whether the scenario is suppressing its mechanism.`;
    tone = "caution";
  }

  const color = tone === "positive" ? "#3a8a4f" : tone === "caution" ? "#a36e1e" : "#7a7e8b";
  const bg = tone === "positive" ? "#3a8a4f10" : tone === "caution" ? "#a36e1e10" : "#7a7e8b10";

  return (
    <div
      className="rounded-lg p-5 mb-6 border-l-4"
      style={{ borderColor: color, background: bg }}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-1.5" style={{ color }}>
        Verdict
      </p>
      <p className="text-base sm:text-lg text-[var(--foreground)] leading-[1.55] font-medium">
        {verdict}
      </p>
    </div>
  );
}

function PostPolicySectorBreakdown({
  baseline,
  postPolicy,
  max,
}: {
  baseline: ReturnType<typeof regionalAggregate>;
  postPolicy: ReturnType<typeof regionalAggregate>;
  max: number;
}) {
  // Build per-sector rows showing baseline jobs, post-policy jobs, and delta
  const baseBySector = new Map(baseline.bySector.map((s) => [s.naics, s]));
  const merged = postPolicy.bySector.map((post) => {
    const base = baseBySector.get(post.naics);
    const baseJobs = base?.regionalJobsImpacted ?? 0;
    const policyDelta = post.regionalJobsImpacted - baseJobs;
    return {
      naics: post.naics,
      name: post.name,
      baseJobs,
      postJobs: post.regionalJobsImpacted,
      policyDelta,
      postPct: post.employmentDeltaPct,
    };
  });

  // Top sectors GAINING from policy vs. baseline
  const gainers = [...merged].filter((r) => r.policyDelta > 50).sort((a, b) => b.policyDelta - a.policyDelta).slice(0, max);
  // Top sectors STILL declining most under policy (where the policy didn't save them)
  const stillDeclining = [...merged].filter((r) => r.postJobs < -50).sort((a, b) => a.postJobs - b.postJobs).slice(0, max);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-xs uppercase tracking-wider text-[#3a8a4f] font-semibold mb-2">
          Sectors helped by the policy
        </p>
        {gainers.length === 0 ? (
          <p className="text-[var(--muted)] italic text-sm">
            No sectors show a meaningful jobs lift from this policy under this scenario.
          </p>
        ) : (
          <div className="space-y-1.5">
            {gainers.map((s) => (
              <div key={s.naics} className="text-xs">
                <div className="flex items-center justify-between border-b border-divider py-1.5 gap-2">
                  <span className="text-[var(--foreground)] truncate flex-1" title={s.name}>{s.name}</span>
                  <span className="tabular-nums font-medium text-[#3a8a4f]">
                    +{formatJobs(s.policyDelta)}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)] pl-0 mt-0.5">
                  Baseline: {s.baseJobs >= 0 ? "+" : "−"}{formatJobs(Math.abs(s.baseJobs))} →
                  With policy: {s.postJobs >= 0 ? "+" : "−"}{formatJobs(Math.abs(s.postJobs))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-[#d4493a] font-semibold mb-2">
          Sectors still declining (policy didn&apos;t save these)
        </p>
        {stillDeclining.length === 0 ? (
          <p className="text-[var(--muted)] italic text-sm">
            No sectors show meaningful job decline under this policy. Strong coverage.
          </p>
        ) : (
          <div className="space-y-1.5">
            {stillDeclining.map((s) => (
              <div key={s.naics} className="text-xs">
                <div className="flex items-center justify-between border-b border-divider py-1.5 gap-2">
                  <span className="text-[var(--foreground)] truncate flex-1" title={s.name}>{s.name}</span>
                  <span className="tabular-nums font-medium text-[#d4493a]">
                    {formatJobs(s.postJobs, true)}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)] pl-0 mt-0.5">
                  Baseline: {formatJobs(s.baseJobs, true)} →
                  With policy: {formatJobs(s.postJobs, true)}
                  {s.policyDelta > 50 && <span className="text-[#3a8a4f]"> (policy saved {formatJobs(s.policyDelta)})</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="flex items-baseline gap-2.5 mb-3">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] tabular-nums font-medium">
          0{number}
        </span>
        <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ReportSection({
  heading,
  subhead,
  children,
}: {
  heading: string;
  subhead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-7 pb-6 border-b border-divider last:border-0 last:pb-0 last:mb-0">
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">{heading}</h3>
      {subhead && (
        <p className="text-sm text-[var(--muted)] leading-[1.5] mb-4">{subhead}</p>
      )}
      {children}
    </div>
  );
}

function BigStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">{label}</p>
      <p className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function RegionSectorMix({ region }: { region: Region }) {
  const top = Object.entries(region.sectorShares)
    .map(([naics, share]) => {
      const s = sectors.find((x) => x.naics === naics);
      return { naics, name: s?.name ?? naics, share };
    })
    .sort((a, b) => b.share - a.share)
    .slice(0, 5);

  return (
    <div className="bg-card border border-card rounded-lg p-3">
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">
        Top 5 sectors
      </p>
      <div className="space-y-1.5">
        {top.map((t) => (
          <div key={t.naics} className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[var(--foreground)] truncate" title={t.name}>
              {t.name}
            </span>
            <span className="text-[var(--muted)] tabular-nums flex-shrink-0">
              {(t.share * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionalTopSectors({ agg, max }: { agg: ReturnType<typeof regionalAggregate>; max: number }) {
  const sorted = [...agg.bySector].sort((a, b) => a.regionalJobsImpacted - b.regionalJobsImpacted);
  const losers = sorted.slice(0, Math.min(max, sorted.length)).filter((s) => s.regionalJobsImpacted < 0);
  const winners = sorted.slice(-max).reverse().filter((s) => s.regionalJobsImpacted > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-xs uppercase tracking-wider text-[#3a8a4f] font-semibold mb-2">
          Top growth sectors
        </p>
        {winners.length === 0 ? (
          <p className="text-[var(--muted)] italic text-sm">No sectors with meaningful growth.</p>
        ) : (
          winners.map((s) => (
            <div key={s.naics} className="flex items-center justify-between border-b border-divider py-1.5">
              <span className="text-[var(--foreground)] text-xs truncate" title={s.name}>{s.name}</span>
              <span className="tabular-nums text-xs font-medium text-[#3a8a4f]">
                +{formatJobs(s.regionalJobsImpacted)} ({s.employmentDeltaPct >= 0 ? "+" : ""}{s.employmentDeltaPct.toFixed(2)}%)
              </span>
            </div>
          ))
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-[#d4493a] font-semibold mb-2">
          Top decline sectors
        </p>
        {losers.length === 0 ? (
          <p className="text-[var(--muted)] italic text-sm">No sectors with meaningful decline.</p>
        ) : (
          losers.map((s) => (
            <div key={s.naics} className="flex items-center justify-between border-b border-divider py-1.5">
              <span className="text-[var(--foreground)] text-xs truncate" title={s.name}>{s.name}</span>
              <span className="tabular-nums text-xs font-medium text-[#d4493a]">
                −{formatJobs(Math.abs(s.regionalJobsImpacted))} ({s.employmentDeltaPct.toFixed(2)}%)
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RobustnessBar({
  pessimistic,
  baseline,
  optimistic,
}: {
  pessimistic: number;
  baseline: number;
  optimistic: number;
}) {
  const min = Math.min(pessimistic, baseline, optimistic, 0);
  const max = Math.max(pessimistic, baseline, optimistic, 0);
  const range = max - min || 1;
  const zeroPct = ((0 - min) / range) * 100;
  const pessPct = ((pessimistic - min) / range) * 100;
  const basePct = ((baseline - min) / range) * 100;
  const optiPct = ((optimistic - min) / range) * 100;

  return (
    <div className="bg-[var(--background)] rounded-lg p-4">
      <div className="relative h-14">
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-card rounded-full -translate-y-1/2" />
        {/* Zero line */}
        <div
          className="absolute top-1 bottom-1 w-px bg-[var(--muted)]"
          style={{ left: `${zeroPct}%` }}
          aria-label="Zero"
        >
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-[var(--muted)]">0</span>
        </div>
        {/* Pessimistic marker */}
        <Marker pct={pessPct} value={pessimistic} label="Pessimistic" color="#d4493a" top />
        {/* Baseline marker */}
        <Marker pct={basePct} value={baseline} label="Baseline" color="#7a7e8b" />
        {/* Optimistic marker */}
        <Marker pct={optiPct} value={optimistic} label="Optimistic" color="#3a8a4f" top />
      </div>
      <div className="mt-6 flex justify-between text-[10px] text-[var(--muted)] tabular-nums">
        <span>worst case</span>
        <span>best case</span>
      </div>
    </div>
  );
}

function Marker({
  pct,
  value,
  label,
  color,
  top,
}: {
  pct: number;
  value: number;
  label: string;
  color: string;
  top?: boolean;
}) {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${pct}%` }}>
      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${top ? "-top-7" : "top-5"} whitespace-nowrap text-[10px]`}
        style={{ color }}
      >
        <div className="font-semibold">{label}</div>
        <div className="tabular-nums text-[var(--muted)]">{formatJobs(value, true)}</div>
      </div>
    </div>
  );
}
