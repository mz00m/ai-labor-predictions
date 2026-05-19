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
  optimizeBudgetPortfolio,
  computeSector,
  regionalAggregate,
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

// Only Adoption Speed and Friction Buffer are realistically policy-movable.
// Capability is set by the AI frontier; Demand Elasticity by market structure.
const FRAMEWORK_LABELS = {
  adoption: { label: "Adoption Speed", color: "#0f766e", num: 1, movable: true },
  capability: { label: "AI Capability", color: "#c89531", num: 2, movable: false },
  demand: { label: "Demand Elasticity", color: "#5b7faf", num: 3, movable: false },
  friction: { label: "Friction Buffer", color: "#7a7e8b", num: 4, movable: true },
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

export default function BudgetPlannerPage() {
  const [regionId, setRegionId] = useState<string>("pittsburgh");
  const [scenarioId, setScenarioId] = useState<keyof typeof SCENARIOS>("steady");
  const [budgetMillions, setBudgetMillions] = useState<number>(10);

  const region = regions.find((r) => r.id === regionId)!;
  const knobs = SCENARIOS[scenarioId].knobs;

  // Catalog = static policies + dynamic state WIOA plan for selected region
  const fullCatalog = useMemo<ModelPolicy[]>(
    () => [...staticCatalog, generateStateWioaPolicy(region)],
    [region]
  );

  const recommendation = useMemo(
    () => optimizeBudgetPortfolio(sectors, knobs, region, fullCatalog, budgetMillions),
    [knobs, region, budgetMillions, fullCatalog]
  );

  // Sensitivity: half-budget and double-budget comparisons
  const halfBudgetRec = useMemo(
    () => optimizeBudgetPortfolio(sectors, knobs, region, fullCatalog, budgetMillions * 0.5),
    [knobs, region, budgetMillions, fullCatalog]
  );
  const doubleBudgetRec = useMemo(
    () => optimizeBudgetPortfolio(sectors, knobs, region, fullCatalog, budgetMillions * 2),
    [knobs, region, budgetMillions, fullCatalog]
  );

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
          jobsdata.ai / model / budget
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] leading-tight mb-4">
          Workforce Budget Planner
        </h1>
        <p className="text-lg text-[var(--muted)] leading-[1.7] mb-3">
          &ldquo;If we have $X to invest in this region, what should we
          prioritize?&rdquo; The planner builds an evidence-anchored policy
          portfolio from the model catalog, optimizing for net regional jobs
          while covering all four framework categories.
        </p>
        <p className="text-sm text-[var(--muted)] leading-[1.6] italic">
          v0.1 prototype. Greedy gap-aware optimizer over 14 policy
          archetypes (incl. Windfall Trust Policy Atlas) and 9 MSAs. To stack
          your own portfolio, use{" "}
          <Link href="/model/portfolio" className="text-[var(--accent-text)] hover:underline">
            /model/portfolio
          </Link>
          . To diagnose a single policy, use{" "}
          <Link href="/model/policy" className="text-[var(--accent-text)] hover:underline">
            /model/policy
          </Link>
          .
        </p>
      </header>

      {/* Step 1 — Region */}
      <Step number={1} title="Pick a region">
        <RegionSelect regionId={regionId} setRegionId={setRegionId} />
        <p className="text-sm text-[var(--muted)] mt-2 leading-[1.6]">
          <strong className="text-[var(--foreground)]">{region.name}.</strong>{" "}
          {region.concentrationNote}
        </p>
      </Step>

      {/* Step 2 — Scenario (2×2 layout matching /model) */}
      <Step number={2} title="Pick a scenario">
        <p className="text-sm text-[var(--muted)] mb-3">
          Baseline (no policy) jobs Δ in {region.name} under each scenario.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-2 items-stretch">
          <div className="hidden md:block" />
          <div className="hidden md:flex items-end justify-center text-[10px] uppercase tracking-[0.15em] text-[var(--muted)] pb-1">
            ← High friction
          </div>
          <div className="hidden md:flex items-end justify-center text-[10px] uppercase tracking-[0.15em] text-[var(--muted)] pb-1">
            Low friction →
          </div>

          <div className="hidden md:flex items-center text-[10px] uppercase tracking-[0.15em] text-[var(--muted)] text-right justify-end pr-2 leading-tight">
            Fast capability<br />+ adoption
          </div>
          <ScenarioCard id="overhang" scenarioId={scenarioId} setScenarioId={setScenarioId} accent="#c89531" region={region} />
          <ScenarioCard id="rapid" scenarioId={scenarioId} setScenarioId={setScenarioId} accent="#3a8a4f" region={region} />

          <div className="hidden md:flex items-center text-[10px] uppercase tracking-[0.15em] text-[var(--muted)] text-right justify-end pr-2 leading-tight">
            Slow capability<br />+ adoption
          </div>
          <ScenarioCard id="status_quo" scenarioId={scenarioId} setScenarioId={setScenarioId} accent="#7a7e8b" region={region} />
          <ScenarioCard id="steady" scenarioId={scenarioId} setScenarioId={setScenarioId} accent="#5b7faf" region={region} />
        </div>
      </Step>

      {/* Step 3 — Budget */}
      <Step number={3} title="Set the budget">
        <div className="bg-card border border-card rounded-lg p-5">
          <div className="flex items-baseline justify-between mb-3">
            <label className="text-sm text-[var(--foreground)]">
              Total investment over the policy horizons
            </label>
            <span className="text-3xl font-bold text-[var(--foreground)] tabular-nums">
              ${budgetMillions}M
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={500}
            step={1}
            value={budgetMillions}
            onChange={(e) => setBudgetMillions(parseInt(e.target.value, 10))}
            className="w-full accent-[var(--accent-text)] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[var(--muted)] mt-1 tabular-nums">
            <span>$1M</span>
            <span>$50M</span>
            <span>$250M</span>
            <span>$500M</span>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            {[2, 10, 25, 50, 100, 250].map((v) => (
              <button
                key={v}
                onClick={() => setBudgetMillions(v)}
                className={`text-xs px-2 py-1 rounded border ${
                  budgetMillions === v
                    ? "bg-[var(--accent-text)] text-white border-[var(--accent-text)]"
                    : "bg-[var(--background)] border-card text-[var(--muted)] hover:border-[var(--foreground)]"
                }`}
              >
                ${v}M
              </button>
            ))}
          </div>
        </div>
      </Step>

      {/* Recommendation report */}
      <div className="mt-10 bg-card border border-card rounded-lg p-6 sm:p-8">
        <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Recommended portfolio — {region.name}
          </p>
          <p className="text-xs text-[var(--muted)]">
            Budget <strong className="text-[var(--foreground)]">${budgetMillions}M</strong>
            {" · "}Scenario: <strong className="text-[var(--foreground)]">{SCENARIOS[scenarioId].name}</strong>
            {" · "}Horizon: {knobs.horizonYears}yr
          </p>
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3 leading-tight">
          Allocate {Math.round((recommendation.spentMillions / budgetMillions) * 100)}% across {recommendation.selected.length} {recommendation.selected.length === 1 ? "policy" : "policies"} for{" "}
          <span style={{ color: recommendation.portfolioJobsDelta >= 0 ? "#3a8a4f" : "#d4493a" }}>
            {formatJobs(recommendation.portfolioJobsDelta, true)} jobs
          </span>
        </h2>

        {/* Verdict */}
        <BudgetVerdict
          recommendation={recommendation}
          budgetMillions={budgetMillions}
          regionName={region.name}
        />

        {/* A — Allocation */}
        <ReportSection
          heading="Portfolio allocation"
          subhead={`${recommendation.selected.length} ${recommendation.selected.length === 1 ? "policy selected" : "policies selected"}. Greedy optimizer favors gap-covering policies (those that address a framework category not yet in the portfolio).`}
        >
          {recommendation.selected.length === 0 ? (
            <p className="text-sm text-[var(--muted)] italic">
              Budget too small to fund any policy at ≥25% scale. Try $5M+ to
              see meaningful portfolio recommendations.
            </p>
          ) : (
            <div className="space-y-3">
              {recommendation.selected.map((sel) => (
                <AllocationRow
                  key={sel.policy.id}
                  selection={sel}
                  totalBudget={budgetMillions}
                />
              ))}
              {recommendation.unspentMillions > 0.5 && (
                <div className="text-xs text-[var(--muted)] italic px-3 py-2 bg-[var(--background)] rounded">
                  <strong className="text-[var(--foreground)]">
                    ${recommendation.unspentMillions.toFixed(1)}M unspent
                  </strong>{" "}
                  — remaining policies are either too expensive at their
                  minimum-effective scale, redundant on framework coverage, or
                  ineffective in this region under this scenario. See &ldquo;Skipped
                  policies&rdquo; below.
                </div>
              )}
            </div>
          )}
        </ReportSection>

        {/* B — Impact */}
        <ReportSection
          heading="Net jobs impact vs no investment"
          subhead="What the chosen portfolio buys in jobs, plus comparison to spending the same money on the single best policy."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BigStat
              label="Portfolio Δ"
              value={formatJobs(recommendation.portfolioJobsDelta, true)}
              sub="vs no-policy baseline"
              color={recommendation.portfolioJobsDelta >= 0 ? "#3a8a4f" : "#d4493a"}
            />
            <BigStat
              label="Best single policy Δ"
              value={formatJobs(recommendation.bestSingleJobsDelta, true)}
              sub={recommendation.bestSinglePolicy?.name ?? "—"}
              color={recommendation.bestSingleJobsDelta >= 0 ? "#3a8a4f" : "#d4493a"}
            />
            <BigStat
              label="Portfolio advantage"
              value={
                recommendation.bestSingleJobsDelta > 0
                  ? `+${(((recommendation.portfolioJobsDelta - recommendation.bestSingleJobsDelta) / recommendation.bestSingleJobsDelta) * 100).toFixed(0)}%`
                  : "n/a"
              }
              sub="extra jobs from diversifying"
              color={
                recommendation.portfolioJobsDelta > recommendation.bestSingleJobsDelta
                  ? "#3a8a4f"
                  : "#7a7e8b"
              }
            />
          </div>
          <p className="text-xs text-[var(--muted)] mt-3 italic leading-[1.6]">
            Cost per net job moved: ~$
            {Math.abs(recommendation.portfolioJobsDelta) > 0
              ? (
                  (recommendation.spentMillions * 1_000_000) /
                  Math.abs(recommendation.portfolioJobsDelta)
                ).toFixed(0)
              : "—"}
            . This is a structural cost estimate, not an impact-evaluation
            number. Real cost-per-job requires longitudinal program data.
          </p>
        </ReportSection>

        {/* C — Workforce impact aggregated */}
        <ReportSection
          heading="Workforce impact across the portfolio"
          subhead="Aggregated workforce-side outcomes from the selected policies — who benefits and what changes for them, the employers, and the regional economy."
        >
          {recommendation.selected.length === 0 ? (
            <p className="text-sm text-[var(--muted)] italic">
              No policies selected at this budget level.
            </p>
          ) : (
            <>
              {/* Populations served */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                  Populations served
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(
                    new Set(
                      recommendation.selected.flatMap((s) => s.policy.targetPopulations ?? [])
                    )
                  ).map((pop) => (
                    <span
                      key={pop}
                      className="text-xs px-2 py-1 rounded bg-[var(--background)] border border-divider text-[var(--foreground)]"
                    >
                      {pop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Concrete workforce mechanisms — surface up to 6 across portfolio */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                  What this portfolio does for workers
                </p>
                <ul className="space-y-1.5 text-sm text-[var(--muted)] leading-[1.6] list-disc ml-5">
                  {recommendation.selected
                    .flatMap((s) =>
                      (s.policy.workforceImpacts ?? []).map((imp) => ({
                        policy: s.policy.name,
                        impact: imp,
                      }))
                    )
                    .slice(0, 6)
                    .map((row, i) => (
                      <li key={i}>
                        {row.impact}{" "}
                        <span className="text-[10px] text-[var(--muted)] italic">
                          ({row.policy})
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Sectoral focus across portfolio */}
              <div className="mb-5">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                  Sectoral concentration in {region.name}
                </p>
                <p className="text-sm text-[var(--muted)] leading-[1.6]">
                  {(() => {
                    const targetSet = new Set<string>();
                    let crossSectorCount = 0;
                    recommendation.selected.forEach((s) => {
                      if (s.policy.targetSectors) {
                        s.policy.targetSectors.forEach((n) => targetSet.add(n));
                      } else {
                        crossSectorCount++;
                      }
                    });
                    const targets = Array.from(targetSet)
                      .map((n) => sectors.find((s) => s.naics === n)?.name ?? n)
                      .join(", ");
                    return `${crossSectorCount > 0 ? `${crossSectorCount} cross-sector ${crossSectorCount === 1 ? "policy" : "policies"}` : ""}${crossSectorCount > 0 && targets ? "; " : ""}${targets ? `sector-specific lift in ${targets}` : ""}.`;
                  })()}
                </p>
              </div>

              {/* Secondary: model dimensions moved */}
              <div className="pt-4 border-t border-divider">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                  Model dimensions moved
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {(["adoption", "friction"] as const).map((cat) => {
                    const meta = FRAMEWORK_LABELS[cat];
                    const covered = recommendation.categoriesCovered.includes(cat);
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
            </>
          )}
        </ReportSection>

        {/* D — Budget sensitivity */}
        <ReportSection
          heading="Budget sensitivity"
          subhead="What changes at half and double the budget. Use this to argue for or against incremental dollars."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <BudgetSensitivityCard
              label="Half budget"
              budget={budgetMillions * 0.5}
              rec={halfBudgetRec}
              vsBaseline={recommendation.portfolioJobsDelta}
            />
            <BudgetSensitivityCard
              label="Current budget"
              budget={budgetMillions}
              rec={recommendation}
              vsBaseline={recommendation.portfolioJobsDelta}
              current
            />
            <BudgetSensitivityCard
              label="Double budget"
              budget={budgetMillions * 2}
              rec={doubleBudgetRec}
              vsBaseline={recommendation.portfolioJobsDelta}
            />
          </div>
          <p className="text-xs text-[var(--muted)] mt-3 leading-[1.6]">
            <strong className="text-[var(--foreground)]">Marginal jobs per extra $1M:</strong>{" "}
            ~{(
              ((doubleBudgetRec.portfolioJobsDelta - recommendation.portfolioJobsDelta) /
                (budgetMillions))
            ).toFixed(0)}{" "}
            from the current budget upward. If this number is large, more
            money is well-spent. If it&apos;s small or negative, the catalog
            is saturated and the next dollar would be better spent elsewhere.
          </p>
        </ReportSection>

        {/* E — Skipped */}
        {recommendation.skipped.length > 0 && (
          <ReportSection
            heading="Skipped policies"
            subhead="Policies in the catalog that didn't make the portfolio, with reasons. Transparency on what the optimizer rejected."
          >
            <div className="space-y-2">
              {recommendation.skipped.map((s) => (
                <div
                  key={s.policy.id}
                  className="rounded-lg px-3 py-2 bg-[var(--background)] border border-divider flex items-baseline justify-between gap-3 flex-wrap"
                >
                  <span className="text-sm text-[var(--foreground)]">
                    {s.policy.name}
                  </span>
                  <span className="text-xs text-[var(--muted)] italic">
                    {s.reason}
                  </span>
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {/* F — Honesty */}
        <ReportSection
          heading="Honesty notes"
          subhead=""
        >
          <ul className="text-sm text-[var(--muted)] leading-[1.65] list-disc ml-5 space-y-1.5">
            <li>
              <strong className="text-[var(--foreground)]">Linear scaling assumption.</strong>{" "}
              Funding a policy at 50% scale produces ~50% of its effect. Real-world
              programs often have minimum effective scale and non-linear returns —
              this is a known approximation.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Greedy, not optimal.</strong>{" "}
              The optimizer is a gap-aware greedy heuristic, not a full integer
              programming solve. For most realistic catalogs this is within a few
              percent of optimal.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Catalog is illustrative.</strong>{" "}
              The 7 policies are research-anchored archetypes, not the universe of
              real interventions. A region&apos;s actual best portfolio may include
              policies not yet in the catalog.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Use as a planning frame.</strong>{" "}
              Treat the recommendation as a structured thinking tool. The portfolio
              gives you a defensible starting allocation and a checklist of trade-offs;
              the actual political and operational choices still require local judgment.
            </li>
          </ul>
        </ReportSection>

        <div className="mt-8 pt-5 border-t border-divider flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-[var(--muted)] italic">
            Generated by jobsdata.ai composite displacement model · Catalog
            policies sourced from workforce-program literature
          </p>
          <div className="flex gap-3 text-xs">
            <Link href="/model/policy" className="text-[var(--accent-text)] hover:underline">
              ↗ Diagnose a single policy
            </Link>
            <Link href="/model" className="text-[var(--accent-text)] hover:underline">
              ↗ Adjust model assumptions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────────────

function BudgetVerdict({
  recommendation,
  budgetMillions,
  regionName,
}: {
  recommendation: ReturnType<typeof optimizeBudgetPortfolio>;
  budgetMillions: number;
  regionName: string;
}) {
  const jobs = recommendation.portfolioJobsDelta;
  const meaningful = Math.abs(jobs) > 500;
  const positive = jobs > 500;
  const uncoveredCats = 2 - recommendation.categoriesCovered.length; // only 2 policy-movable categories
  const portfolioAdvantage =
    recommendation.bestSingleJobsDelta > 0
      ? (jobs - recommendation.bestSingleJobsDelta) / recommendation.bestSingleJobsDelta
      : 0;
  const costPerJob =
    Math.abs(jobs) > 0 ? (recommendation.spentMillions * 1_000_000) / Math.abs(jobs) : 0;

  let verdict: string;
  let tone: "positive" | "caution" | "neutral";
  if (!meaningful) {
    verdict = `$${budgetMillions}M is too small to meaningfully move ${regionName}'s post-AI workforce outcomes — at best a marginal jobs lift. Either scale the budget significantly higher (try 2-5×) or use it as targeted bridge funding for specific cohorts.`;
    tone = "neutral";
  } else if (positive && uncoveredCats === 0 && portfolioAdvantage > 0.1) {
    verdict = `Recommended: ${recommendation.selected.length} stacked policies covering both adoption and friction. Portfolio outperforms the single best policy by ${(portfolioAdvantage * 100).toFixed(0)}% (${formatJobs(jobs, true)} vs ${formatJobs(recommendation.bestSingleJobsDelta, true)} jobs) at roughly $${costPerJob.toFixed(0)} per job moved. Diversification pays here.`;
    tone = "positive";
  } else if (positive && uncoveredCats === 0) {
    verdict = `Recommended: ${recommendation.selected.length} stacked policies covering both adoption and friction in ${regionName}, moving ${formatJobs(jobs, true)} jobs at ~$${costPerJob.toFixed(0)} per net job. The single best policy alone would deliver similar results — diversification helps coverage, not raw jobs.`;
    tone = "positive";
  } else if (positive && uncoveredCats > 0) {
    verdict = `Portfolio moves ${formatJobs(jobs, true)} jobs but leaves ${uncoveredCats} of 2 policy-movable framework categories uncovered. The catalog at this budget either doesn't include a strong intervention for the missing dimension or isn't cost-effective for ${regionName}.`;
    tone = "caution";
  } else {
    verdict = `At ${budgetMillions}M the optimizer can't find a positive-net portfolio for ${regionName} under this scenario. Try a different scenario, a larger budget, or a more growth-friendly scenario preset to see what the catalog can do.`;
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

/** State-grouped region picker with curated MSAs at the top. */
function RegionSelect({
  regionId,
  setRegionId,
}: {
  regionId: string;
  setRegionId: (id: string) => void;
}) {
  const curated = regions.filter((r) => r.curated);
  const others = regions.filter((r) => !r.curated);
  const byState = new Map<string, Region[]>();
  for (const r of others) {
    if (!byState.has(r.state)) byState.set(r.state, []);
    byState.get(r.state)!.push(r);
  }
  const sortedStates = Array.from(byState.keys()).sort();

  return (
    <select
      value={regionId}
      onChange={(e) => setRegionId(e.target.value)}
      className="w-full bg-card border border-card rounded-lg px-4 py-3 text-base text-[var(--foreground)]"
    >
      <optgroup label="Featured MSAs (detailed sector data)">
        {curated.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name} — {r.totalEmploymentK.toLocaleString()}K jobs
          </option>
        ))}
      </optgroup>
      {sortedStates.map((state) => (
        <optgroup key={state} label={`${state} (national-average shares)`}>
          {byState
            .get(state)!
            .sort((a, b) => b.totalEmploymentK - a.totalEmploymentK)
            .map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.totalEmploymentK.toLocaleString()}K jobs
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  );
}

function ScenarioCard({
  id,
  scenarioId,
  setScenarioId,
  accent,
  region,
}: {
  id: keyof typeof SCENARIOS;
  scenarioId: keyof typeof SCENARIOS;
  setScenarioId: (id: keyof typeof SCENARIOS) => void;
  accent: string;
  region: Region;
}) {
  const s = SCENARIOS[id];
  const active = scenarioId === id;
  const preview = sectors.map((sec) => computeSector(sec, s.knobs));
  const previewAgg = regionalAggregate(preview, region);
  const previewJobs = previewAgg.totalJobsImpacted;
  return (
    <button
      onClick={() => setScenarioId(id)}
      className={`text-left bg-card border-2 rounded-lg p-3.5 transition-all hover:border-[var(--foreground)] ${active ? "border-[var(--foreground)] shadow-sm" : "border-card"}`}
      style={active ? { boxShadow: `0 0 0 2px ${accent}33` } : {}}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm font-semibold text-[var(--foreground)] leading-tight">
          {s.name}
        </p>
        <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: accent }} />
      </div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5">
        {s.tagline}
      </p>
      <p
        className="text-base font-bold tabular-nums"
        style={{ color: previewJobs >= 0 ? "#3a8a4f" : "#d4493a" }}
      >
        {formatJobs(previewJobs, true)} jobs
      </p>
    </button>
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
      <p className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-[var(--muted)] mt-0.5">{sub}</p>}
    </div>
  );
}

function AllocationRow({
  selection,
  totalBudget,
}: {
  selection: {
    policy: ModelPolicy;
    allocationMillions: number;
    scale: number;
    standaloneJobsDelta: number;
  };
  totalBudget: number;
}) {
  const widthPct = (selection.allocationMillions / totalBudget) * 100;
  return (
    <div className="bg-[var(--background)] rounded-lg p-3 border border-divider">
      <div className="flex items-baseline justify-between gap-3 mb-1.5 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-[var(--foreground)] truncate">
            {selection.policy.name}
          </span>
          {selection.scale < 0.99 && (
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-[#a36e1e15] text-[#a36e1e] rounded">
              {(selection.scale * 100).toFixed(0)}% scale
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-3 text-xs">
          <span className="font-medium text-[var(--foreground)] tabular-nums">
            ${selection.allocationMillions.toFixed(1)}M
          </span>
          <span className="tabular-nums text-[#3a8a4f]">
            {formatJobs(selection.standaloneJobsDelta, true)} jobs (standalone)
          </span>
        </div>
      </div>
      <div className="h-2 bg-card rounded overflow-hidden">
        <div
          className="h-full bg-[var(--accent-text)] rounded"
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {(selection.policy.targetPopulations ?? []).slice(0, 3).map((pop) => (
          <span
            key={pop}
            className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--background)] text-[var(--muted)]"
          >
            {pop}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-[var(--muted)] mt-1.5 leading-[1.5]">
        {selection.policy.tagline}
      </p>
    </div>
  );
}

function BudgetSensitivityCard({
  label,
  budget,
  rec,
  vsBaseline,
  current,
}: {
  label: string;
  budget: number;
  rec: ReturnType<typeof optimizeBudgetPortfolio>;
  vsBaseline: number;
  current?: boolean;
}) {
  const delta = rec.portfolioJobsDelta - vsBaseline;
  const pctChange = vsBaseline !== 0 ? (delta / Math.abs(vsBaseline)) * 100 : 0;
  return (
    <div
      className={`rounded-lg p-3 border-2 ${current ? "border-[var(--foreground)]" : "border-divider"}`}
    >
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
        {label}
      </p>
      <p className="text-base font-bold text-[var(--foreground)] tabular-nums mb-1">
        ${budget.toFixed(0)}M
      </p>
      <p className="text-sm tabular-nums" style={{ color: rec.portfolioJobsDelta >= 0 ? "#3a8a4f" : "#d4493a" }}>
        {formatJobs(rec.portfolioJobsDelta, true)} jobs
      </p>
      {!current && (
        <p className="text-[11px] text-[var(--muted)] mt-1">
          {delta >= 0 ? "+" : ""}
          {formatJobs(delta)} vs current ({pctChange >= 0 ? "+" : ""}
          {pctChange.toFixed(0)}%)
        </p>
      )}
      <p className="text-[11px] text-[var(--muted)] mt-1">
        {rec.selected.length} {rec.selected.length === 1 ? "policy" : "policies"} ·{" "}
        {rec.categoriesCovered.length}/4 categories
      </p>
    </div>
  );
}
