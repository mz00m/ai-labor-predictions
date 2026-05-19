"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import btosData from "@/data/btos-sectors.json";
import regionsData from "@/data/regions.json";
import policiesData from "@/data/policies.json";
import {
  Sector,
  Knobs,
  DEFAULT_KNOBS,
  Region,
  ModelPolicy,
  applyPolicy,
  regionalAggregate,
  computeSector,
  scalePolicy,
  generateStateWioaPolicy,
} from "@/lib/composite-model";

const sectors = btosData.sectors as Sector[];
const regions = regionsData.regions as Region[];
const staticCatalog = policiesData.policies as ModelPolicy[];

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

const FRAMEWORK_LABELS = {
  adoption: { label: "Adoption Speed", color: "#0f766e" },
  friction: { label: "Friction Buffer", color: "#7a7e8b" },
};

function formatJobs(n: number, signed = false): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  const abs = Math.abs(n);
  let core: string;
  if (abs >= 1_000_000) core = `${(abs / 1_000_000).toFixed(2)}M`;
  else if (abs >= 1_000) core = `${(abs / 1_000).toFixed(1)}K`;
  else core = `${Math.round(abs)}`;
  return signed ? `${sign}${core}` : core;
}

export default function PortfolioBuilderPage() {
  const [regionId, setRegionId] = useState<string>("pittsburgh");
  const [scenarioId, setScenarioId] = useState<keyof typeof SCENARIOS>("steady");
  // allocations: policyId -> $M allocated (0 to typical cost)
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  const region = regions.find((r) => r.id === regionId)!;
  const knobs = SCENARIOS[scenarioId].knobs;

  // Catalog = static policies + dynamic state WIOA plan for selected region
  const fullCatalog = useMemo<ModelPolicy[]>(
    () => [...staticCatalog, generateStateWioaPolicy(region)],
    [region]
  );

  const selectedPolicies = useMemo(
    () => fullCatalog.filter((p) => (allocations[p.id] ?? 0) > 0.05),
    [allocations, fullCatalog]
  );

  const totalAllocated = useMemo(
    () => Object.values(allocations).reduce((s, v) => s + (v || 0), 0),
    [allocations]
  );

  // Baseline (no policy)
  const baseImpacts = useMemo(
    () => sectors.map((s) => computeSector(s, knobs)),
    [knobs]
  );
  const baseAggregate = useMemo(
    () => regionalAggregate(baseImpacts, region),
    [baseImpacts, region]
  );

  // Stacked portfolio impact: apply each selected policy at its allocated scale
  const { portfolioAggregate, perPolicyImpacts } = useMemo(() => {
    let combinedSectors = sectors;
    let combinedKnobs = { ...knobs };
    const perPolicy: Array<{
      policy: ModelPolicy;
      allocation: number;
      scale: number;
      standaloneJobsDelta: number;
    }> = [];

    for (const policy of selectedPolicies) {
      const alloc = allocations[policy.id]!;
      const scale = Math.min(1.0, alloc / policy.typicalCostMillions);
      const scaled = scalePolicy(policy, scale);

      // Standalone effect (just this policy on baseline)
      const standalone = applyPolicy(sectors, knobs, scaled);
      const standaloneImpacts = standalone.sectors.map((s) => computeSector(s, standalone.knobs));
      const standaloneAgg = regionalAggregate(standaloneImpacts, region);
      const standaloneDelta = standaloneAgg.totalJobsImpacted - baseAggregate.totalJobsImpacted;

      perPolicy.push({
        policy,
        allocation: alloc,
        scale,
        standaloneJobsDelta: standaloneDelta,
      });

      // Stack into combined
      const out = applyPolicy(combinedSectors, combinedKnobs, scaled);
      combinedSectors = out.sectors;
      combinedKnobs = out.knobs;
    }

    const portfolioImpacts = combinedSectors.map((s) => computeSector(s, combinedKnobs));
    const aggregate = regionalAggregate(portfolioImpacts, region);
    return { portfolioAggregate: aggregate, perPolicyImpacts: perPolicy };
  }, [selectedPolicies, allocations, knobs, region, baseAggregate]);

  const portfolioDelta = portfolioAggregate.totalJobsImpacted - baseAggregate.totalJobsImpacted;

  // Coverage
  const coverage = useMemo(() => {
    const covered = new Set<"adoption" | "friction">();
    selectedPolicies.forEach((p) => p.addresses.forEach((c) => covered.add(c)));
    return covered;
  }, [selectedPolicies]);

  // Combined target populations
  const populations = useMemo(() => {
    const set = new Set<string>();
    selectedPolicies.forEach((p) => (p.targetPopulations ?? []).forEach((pop) => set.add(pop)));
    return Array.from(set);
  }, [selectedPolicies]);

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
          jobsdata.ai / model / portfolio
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] leading-tight mb-4">
          Build a Policy Portfolio
        </h1>
        <p className="text-lg text-[var(--muted)] leading-[1.7] mb-3">
          Pick policies from the catalog, set your own funding levels, and
          watch the combined regional workforce impact update in real time.
          Stack as many or as few as you want.
        </p>
        <p className="text-sm text-[var(--muted)] leading-[1.6] italic">
          13 standard policies + the WIOA state plan for your selected
          region. Catalog drawn from the{" "}
          <a
            href="https://windfalltrust.org/policy-atlas/labor-market-adaptation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            Windfall Trust Policy Atlas
          </a>{" "}
          and workforce-program literature. For an optimizer-driven
          recommendation, use{" "}
          <Link href="/model/budget" className="text-[var(--accent-text)] hover:underline">
            /model/budget
          </Link>
          ; for single-policy review, use{" "}
          <Link href="/model/policy" className="text-[var(--accent-text)] hover:underline">
            /model/policy
          </Link>
          .
        </p>
      </header>

      {/* Step 1 — Region */}
      <Step number={1} title="Pick a region">
        <select
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          className="w-full bg-card border border-card rounded-lg px-4 py-3 text-base text-[var(--foreground)]"
        >
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — {r.totalEmploymentK.toLocaleString()}K jobs
            </option>
          ))}
        </select>
      </Step>

      {/* Step 2 — Scenario */}
      <Step number={2} title="Pick a scenario">
        <p className="text-sm text-[var(--muted)] mb-3">
          Baseline (no policy) jobs Δ in {region.name} under each scenario.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {Object.entries(SCENARIOS).map(([id, s]) => {
            const preview = sectors.map((sec) => computeSector(sec, s.knobs));
            const previewAgg = regionalAggregate(preview, region);
            const previewJobs = previewAgg.totalJobsImpacted;
            return (
              <button
                key={id}
                onClick={() => setScenarioId(id as keyof typeof SCENARIOS)}
                className={`text-left p-3 rounded-lg border-2 transition-colors hover:border-[var(--foreground)] ${
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

      {/* Step 3 — Allocate to policies */}
      <Step number={3} title={`Allocate funding across the catalog (${fullCatalog.length} policies)`}>
        <div className="mb-3 flex items-baseline justify-between flex-wrap gap-2">
          <p className="text-sm text-[var(--muted)]">
            Move the slider for each policy you want to fund. Set to $0 to exclude. Each policy has a &ldquo;typical full funding&rdquo; cost; the model scales effects linearly down to 25% of that cost.
          </p>
          <div className="flex items-baseline gap-3 text-sm">
            <span className="text-[var(--muted)]">Total:</span>
            <span className="text-xl font-bold text-[var(--foreground)] tabular-nums">
              ${totalAllocated.toFixed(1)}M
            </span>
            <button
              onClick={() => setAllocations({})}
              className="text-xs text-[var(--accent-text)] hover:underline"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {fullCatalog.map((policy) => {
            const alloc = allocations[policy.id] ?? 0;
            const policyResult = perPolicyImpacts.find((p) => p.policy.id === policy.id);
            return (
              <PolicyAllocationRow
                key={policy.id}
                policy={policy}
                allocation={alloc}
                onChange={(v) =>
                  setAllocations((prev) => ({ ...prev, [policy.id]: v }))
                }
                standaloneJobsDelta={policyResult?.standaloneJobsDelta ?? 0}
              />
            );
          })}
        </div>
      </Step>

      {/* Live impact panel — sticky right summary, but for v0.1 just inline */}
      {selectedPolicies.length > 0 && (
        <div className="mt-10 bg-card border border-card rounded-lg p-6 sm:p-8">
          <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Combined portfolio impact — {region.name}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {selectedPolicies.length} {selectedPolicies.length === 1 ? "policy" : "policies"} · ${totalAllocated.toFixed(1)}M
              {" · "}Scenario: <strong className="text-[var(--foreground)]">{SCENARIOS[scenarioId].name}</strong>
              {" · "}Horizon: {knobs.horizonYears}yr
            </p>
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3 leading-tight">
            Stacked portfolio moves{" "}
            <span style={{ color: portfolioDelta >= 0 ? "#3a8a4f" : "#d4493a" }}>
              {formatJobs(portfolioDelta, true)} jobs
            </span>
            {" "}in {region.name}
          </h2>

          {/* Verdict */}
          <PortfolioVerdict
            selectedCount={selectedPolicies.length}
            totalAllocated={totalAllocated}
            portfolioDelta={portfolioDelta}
            perPolicy={perPolicyImpacts}
            coverage={coverage}
            regionName={region.name}
          />

          {/* Headline stats */}
          <ReportSection
            heading="Net regional impact"
            subhead={`Combined effect of all funded policies in ${region.name} at ${knobs.horizonYears}-year horizon, vs no-policy baseline.`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <BigStat
                label="Without portfolio"
                value={formatJobs(baseAggregate.totalJobsImpacted, true)}
                color={baseAggregate.totalJobsImpacted < 0 ? "#d4493a" : "#3a8a4f"}
                sub="baseline jobs Δ"
              />
              <BigStat
                label="With portfolio"
                value={formatJobs(portfolioAggregate.totalJobsImpacted, true)}
                color={portfolioAggregate.totalJobsImpacted < 0 ? "#d4493a" : "#3a8a4f"}
                sub="stacked jobs Δ"
              />
              <BigStat
                label="Portfolio Δ"
                value={formatJobs(portfolioDelta, true)}
                color={portfolioDelta >= 0 ? "#3a8a4f" : "#d4493a"}
                sub="jobs moved by policy"
              />
              <BigStat
                label="Cost per job"
                value={
                  Math.abs(portfolioDelta) > 0
                    ? `~$${((totalAllocated * 1_000_000) / Math.abs(portfolioDelta)).toFixed(0)}`
                    : "—"
                }
                color="#7a7e8b"
                sub={`per net job moved`}
              />
            </div>
          </ReportSection>

          {/* Per-policy contribution */}
          <ReportSection
            heading="Per-policy contribution"
            subhead="Each policy's standalone impact on baseline at its current allocation. Stacking effects can be sub-additive (overlapping mechanisms) or super-additive (gap-covering combinations)."
          >
            <div className="space-y-2">
              {perPolicyImpacts
                .sort((a, b) => b.standaloneJobsDelta - a.standaloneJobsDelta)
                .map((p) => {
                  const costPerJob =
                    Math.abs(p.standaloneJobsDelta) > 0
                      ? (p.allocation * 1_000_000) / Math.abs(p.standaloneJobsDelta)
                      : null;
                  return (
                    <div
                      key={p.policy.id}
                      className="rounded-lg px-4 py-2.5 bg-[var(--background)] border border-divider"
                    >
                      <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {p.policy.name}
                        </span>
                        <div className="flex items-baseline gap-3 text-xs tabular-nums">
                          <span className="text-[var(--muted)]">${p.allocation.toFixed(1)}M @ {(p.scale * 100).toFixed(0)}%</span>
                          <span
                            className="font-medium"
                            style={{ color: p.standaloneJobsDelta >= 0 ? "#3a8a4f" : "#d4493a" }}
                          >
                            {formatJobs(p.standaloneJobsDelta, true)} jobs
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[var(--muted)] tabular-nums">
                        Cost per job: {costPerJob !== null && Math.abs(p.standaloneJobsDelta) > 50
                          ? <strong className="text-[var(--foreground)]">~${costPerJob.toFixed(0)}</strong>
                          : <span className="italic">policy too small to meaningfully impact regional jobs</span>}
                      </p>
                    </div>
                  );
                })}
            </div>
            <p className="text-xs text-[var(--muted)] mt-3 italic">
              Sum of standalone effects: {formatJobs(perPolicyImpacts.reduce((s, p) => s + p.standaloneJobsDelta, 0), true)} jobs.
              Combined stacked effect: {formatJobs(portfolioDelta, true)} jobs.
              {(() => {
                const sum = perPolicyImpacts.reduce((s, p) => s + p.standaloneJobsDelta, 0);
                const synergy = portfolioDelta - sum;
                if (Math.abs(synergy) < 100) return " Effects stack roughly linearly.";
                if (synergy > 0) return ` Stacking adds ${formatJobs(synergy)} extra jobs through gap coverage and complementarity.`;
                return ` Stacking loses ${formatJobs(Math.abs(synergy))} jobs to overlap — multiple policies pulling the same lever.`;
              })()}
            </p>
          </ReportSection>

          {/* Sector breakdown */}
          <ReportSection
            heading="Sector breakdown with portfolio"
            subhead={`Where the portfolio moves jobs in ${region.name}, vs the no-policy baseline.`}
          >
            <PortfolioSectorBreakdown
              baseline={baseAggregate}
              postPolicy={portfolioAggregate}
              max={6}
            />
          </ReportSection>

          {/* Coverage */}
          <ReportSection
            heading="Workforce impact"
            subhead="Combined target populations served and model dimensions moved by the stacked portfolio."
          >
            {populations.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                  Populations served
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {populations.map((pop) => (
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

            <div className="pt-4 border-t border-divider">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                Model dimensions moved
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {(["adoption", "friction"] as const).map((cat) => {
                  const meta = FRAMEWORK_LABELS[cat];
                  const covered = coverage.has(cat);
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
                <span className="text-[11px] text-[var(--muted)] italic ml-1">
                  AI Capability + Demand Elasticity are structural — set by the AI frontier and market, not movable by policy.
                </span>
              </div>
            </div>
          </ReportSection>

          <div className="mt-8 pt-5 border-t border-divider flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-[var(--muted)] italic">
              Generated by jobsdata.ai composite displacement model · Catalog from{" "}
              <a
                href="https://windfalltrust.org/policy-atlas/labor-market-adaptation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-text)] hover:underline"
              >
                Windfall Trust Policy Atlas
              </a>
              {" + workforce-program literature"}
            </p>
            <div className="flex gap-3 text-xs">
              <Link href="/model/policy" className="text-[var(--accent-text)] hover:underline">
                ↗ Diagnose single policy
              </Link>
              <Link href="/model/budget" className="text-[var(--accent-text)] hover:underline">
                ↗ Optimize for budget
              </Link>
            </div>
          </div>
        </div>
      )}

      {selectedPolicies.length === 0 && (
        <div className="mt-10 bg-card border border-card rounded-lg p-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            Allocate funding to at least one policy above to see the combined portfolio impact.
          </p>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────────────

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
      {subhead && <p className="text-sm text-[var(--muted)] leading-[1.5] mb-4">{subhead}</p>}
      {children}
    </div>
  );
}

function BigStat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-[var(--background)] rounded-lg p-3 border border-divider">
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">{label}</p>
      <p className="text-xl font-bold tabular-nums" style={{ color }}>{value}</p>
      {sub && <p className="text-[11px] text-[var(--muted)] mt-0.5">{sub}</p>}
    </div>
  );
}

function PolicyAllocationRow({
  policy,
  allocation,
  onChange,
  standaloneJobsDelta,
}: {
  policy: ModelPolicy;
  allocation: number;
  onChange: (v: number) => void;
  standaloneJobsDelta: number;
}) {
  const active = allocation > 0.05;
  const scale = Math.min(1.0, allocation / policy.typicalCostMillions);

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        active ? "border-[var(--foreground)] bg-card" : "border-card bg-card"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px_90px] gap-3 items-center">
        {/* Policy name + chips */}
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {policy.name}
            </span>
            <span className="text-[10px] text-[var(--muted)]">
              · ${policy.typicalCostMillions}M typical · {policy.durationYears}yr
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {policy.addresses.map((a) => {
              const meta = FRAMEWORK_LABELS[a];
              return (
                <span
                  key={a}
                  className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold"
                  style={{ background: `${meta.color}20`, color: meta.color }}
                >
                  {meta.label}
                </span>
              );
            })}
            <span className="text-[10px] text-[var(--muted)] truncate">{policy.tagline}</span>
          </div>
        </div>

        {/* Allocation slider */}
        <div>
          <input
            type="range"
            min={0}
            max={policy.typicalCostMillions}
            step={Math.max(0.1, policy.typicalCostMillions / 50)}
            value={allocation}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full accent-[var(--accent-text)] cursor-pointer"
            aria-label={`Allocation for ${policy.name}`}
          />
          <div className="flex justify-between text-[10px] text-[var(--muted)] tabular-nums mt-0.5">
            <span>$0</span>
            <span className={active ? "text-[var(--foreground)] font-medium" : ""}>
              ${allocation.toFixed(1)}M
              {active && (
                <span className="text-[var(--muted)] ml-1">
                  ({(scale * 100).toFixed(0)}% scale)
                </span>
              )}
            </span>
            <span>${policy.typicalCostMillions}M</span>
          </div>
        </div>

        {/* Live impact */}
        <div className="text-right">
          {active ? (
            <>
              <p
                className="text-sm font-medium tabular-nums"
                style={{ color: standaloneJobsDelta >= 0 ? "#3a8a4f" : "#d4493a" }}
              >
                {formatJobs(standaloneJobsDelta, true)}
              </p>
              <p className="text-[10px] text-[var(--muted)]">jobs (standalone)</p>
            </>
          ) : (
            <p className="text-[10px] text-[var(--muted)] italic">not funded</p>
          )}
        </div>
      </div>

      {active && scale < 0.25 && (
        <p className="text-[11px] text-[#a36e1e] mt-2 italic">
          ⚠ Below 25% scale — most workforce policies have a minimum effective dose; outcomes here are likely overstated.
        </p>
      )}
    </div>
  );
}

function PortfolioVerdict({
  selectedCount,
  totalAllocated,
  portfolioDelta,
  perPolicy,
  coverage,
  regionName,
}: {
  selectedCount: number;
  totalAllocated: number;
  portfolioDelta: number;
  perPolicy: Array<{ policy: ModelPolicy; standaloneJobsDelta: number }>;
  coverage: Set<"adoption" | "friction">;
  regionName: string;
}) {
  const meaningful = Math.abs(portfolioDelta) > 500;
  const sumStandalone = perPolicy.reduce((s, p) => s + p.standaloneJobsDelta, 0);
  const synergy = portfolioDelta - sumStandalone;
  const synergyPct = sumStandalone !== 0 ? (synergy / Math.abs(sumStandalone)) * 100 : 0;
  const coversBoth = coverage.has("adoption") && coverage.has("friction");

  let verdict: string;
  let tone: "positive" | "caution" | "neutral";

  if (!meaningful) {
    verdict = `${selectedCount} ${selectedCount === 1 ? "policy" : "policies"} at $${totalAllocated.toFixed(0)}M produce little net movement in ${regionName}. Either scale up the allocations or pick policies that better match this region's exposures.`;
    tone = "neutral";
  } else if (portfolioDelta > 0 && coversBoth && synergyPct > 5) {
    verdict = `Strong portfolio: ${formatJobs(portfolioDelta, true)} jobs in ${regionName}, covering both adoption and friction dimensions. Stacking adds ${synergyPct.toFixed(0)}% over the sum of standalone effects — these policies are gap-complementary.`;
    tone = "positive";
  } else if (portfolioDelta > 0 && coversBoth) {
    verdict = `Reasonable portfolio: ${formatJobs(portfolioDelta, true)} jobs in ${regionName}, covering both adoption and friction. Stacking is roughly linear — policies aren't fighting each other but aren't compounding either.`;
    tone = "positive";
  } else if (portfolioDelta > 0) {
    verdict = `${selectedCount} ${selectedCount === 1 ? "policy moves" : "policies move"} ${formatJobs(portfolioDelta, true)} jobs in ${regionName}, but only one of two policy-movable dimensions is covered. Add a policy targeting ${coverage.has("adoption") ? "Friction Buffer (e.g., wage insurance, training)" : "Adoption Speed (e.g., licensing reform, AI literacy)"} to close the gap.`;
    tone = "caution";
  } else {
    verdict = `Portfolio is net-negative for ${regionName}: ${formatJobs(portfolioDelta, true)} jobs. Either the policies are mis-targeted for this region's exposures, or the scenario is suppressing their mechanisms. Try a different mix or scenario.`;
    tone = "caution";
  }

  const color = tone === "positive" ? "#3a8a4f" : tone === "caution" ? "#a36e1e" : "#7a7e8b";
  const bg = tone === "positive" ? "#3a8a4f10" : tone === "caution" ? "#a36e1e10" : "#7a7e8b10";

  return (
    <div className="rounded-lg p-5 mb-6 border-l-4" style={{ borderColor: color, background: bg }}>
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-1.5" style={{ color }}>
        Verdict
      </p>
      <p className="text-base sm:text-lg text-[var(--foreground)] leading-[1.55] font-medium">
        {verdict}
      </p>
    </div>
  );
}

function PortfolioSectorBreakdown({
  baseline,
  postPolicy,
  max,
}: {
  baseline: ReturnType<typeof regionalAggregate>;
  postPolicy: ReturnType<typeof regionalAggregate>;
  max: number;
}) {
  const baseBySector = new Map(baseline.bySector.map((s) => [s.naics, s]));
  const merged = postPolicy.bySector.map((post) => {
    const base = baseBySector.get(post.naics);
    const baseJobs = base?.regionalJobsImpacted ?? 0;
    return {
      naics: post.naics,
      name: post.name,
      baseJobs,
      postJobs: post.regionalJobsImpacted,
      policyDelta: post.regionalJobsImpacted - baseJobs,
    };
  });

  const gainers = [...merged]
    .filter((r) => r.policyDelta > 50)
    .sort((a, b) => b.policyDelta - a.policyDelta)
    .slice(0, max);
  const stillDeclining = [...merged]
    .filter((r) => r.postJobs < -50)
    .sort((a, b) => a.postJobs - b.postJobs)
    .slice(0, max);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-xs uppercase tracking-wider text-[#3a8a4f] font-semibold mb-2">
          Sectors helped by the portfolio
        </p>
        {gainers.length === 0 ? (
          <p className="text-[var(--muted)] italic text-sm">
            No sectors show a meaningful jobs lift from the portfolio.
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
                <p className="text-[10px] text-[var(--muted)] mt-0.5">
                  Baseline: {formatJobs(s.baseJobs, true)} → With portfolio: {formatJobs(s.postJobs, true)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-[#d4493a] font-semibold mb-2">
          Sectors still declining (portfolio didn&apos;t save these)
        </p>
        {stillDeclining.length === 0 ? (
          <p className="text-[var(--muted)] italic text-sm">
            No sectors show meaningful decline. Strong portfolio coverage.
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
                <p className="text-[10px] text-[var(--muted)] mt-0.5">
                  Baseline: {formatJobs(s.baseJobs, true)} → With portfolio: {formatJobs(s.postJobs, true)}
                  {s.policyDelta > 50 && <span className="text-[#3a8a4f]"> (portfolio saved {formatJobs(s.policyDelta)})</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
