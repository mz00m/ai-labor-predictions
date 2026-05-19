"use client";

import { useMemo, useState } from "react";
import btosData from "@/data/btos-sectors.json";
import {
  MODEL_PRICING,
  CATEGORY_TOKEN_PROFILES,
  tokenCostPerHour,
  DEPLOYMENT_OVERHEAD,
} from "@/data/job-tasks";
import { TASK_CATEGORY_META } from "@/data/task-categories";
import Link from "next/link";
import {
  Sector,
  Knobs,
  DEFAULT_KNOBS,
  computeSector,
  ARCHETYPE_META,
  FRAMEWORK,
  Factor,
  Category,
  CAPABILITY_ANCHOR,
  IMPACT_META,
  sortFactorsByImpact,
  KNOB_META,
  KnobMeta,
  TIER_THRESHOLDS,
} from "@/lib/composite-model";

type SortKey =
  | "name"
  | "employmentMillions"
  | "btosCurrent"
  | "btosPlanned"
  | "realizedAdoption"
  | "taskReplacement"
  | "productivityGain"
  | "employmentDelta"
  | "jobsImpacted"
  | "wageImpact";

const sectors = btosData.sectors as Sector[];

// ────────────────────────────────────────────────────────────────────
// 2×2 SCENARIO PRESETS
// Axis A: Capability + Adoption (fast ↔ slow)
// Axis B: Friction (low ↔ high)
// ────────────────────────────────────────────────────────────────────

interface Preset {
  id: string;
  title: string;
  tagline: string;
  description: string;
  knobs: Knobs;
}

const PRESETS: Record<string, Preset> = {
  rapid: {
    id: "rapid",
    title: "Rapid Transformation",
    tagline: "Fast capability · Low friction",
    description: "Capability doubles every 4 months, costs decline fast, regulators stay light-touch, and Gen Z–heavy workforces lean in. The deployment-shaped future the loudest commentators describe.",
    knobs: {
      ...DEFAULT_KNOBS,
      horizonYears: 5,
      capabilityDoublingMonths: 4,
      verifiabilityRatio: 3.0,
      reliabilityFloorScale: 0.85,
      trustMultiplier: 1.3,
      regSchemaMultiplier: 0.6,
      downtimeSensitivity: 0.8,
      genZAdoptionBoost: 1.3,
      stateRegMultiplier: 0.6,
      computeCostDeclineRate: 0.30,
      securityOverheadMultiplier: 0.7,
    },
  },
  overhang: {
    id: "overhang",
    title: "Capability Overhang",
    tagline: "Fast capability · High friction",
    description: "Frontier models race ahead, but regulators, downtime risk, security overhead, and cultural aversion gate deployment. The model surfaces a widening gap between what AI can do and what firms actually use.",
    knobs: {
      ...DEFAULT_KNOBS,
      horizonYears: 5,
      capabilityDoublingMonths: 4,
      verifiabilityRatio: 3.0,
      reliabilityFloorScale: 1.15,
      trustMultiplier: 0.7,
      regSchemaMultiplier: 1.5,
      downtimeSensitivity: 1.4,
      genZAdoptionBoost: 0.8,
      stateRegMultiplier: 1.5,
      computeCostDeclineRate: 0.20,
      securityOverheadMultiplier: 1.4,
    },
  },
  steady: {
    id: "steady",
    title: "Steady Diffusion",
    tagline: "Slow capability · Low friction",
    description: "Frontier progress slows toward a 14-month doubling time, but adoption channels stay open. Diffusion follows historical analogs (PC, ERP, cloud) at a measured but unimpeded pace.",
    knobs: {
      ...DEFAULT_KNOBS,
      horizonYears: 5,
      capabilityDoublingMonths: 14,
      verifiabilityRatio: 1.8,
      reliabilityFloorScale: 1.0,
      trustMultiplier: 1.1,
      regSchemaMultiplier: 0.7,
      downtimeSensitivity: 1.0,
      genZAdoptionBoost: 1.1,
      stateRegMultiplier: 0.7,
      computeCostDeclineRate: 0.18,
      securityOverheadMultiplier: 0.9,
    },
  },
  status_quo: {
    id: "status_quo",
    title: "Status Quo Persists",
    tagline: "Slow capability · High friction",
    description: "Capability progress plateaus by 2028 and institutional drag bites. Adoption barely moves past BTOS-current. Workforce leaders plan for very little change in the next five years — and the model shows what that looks like.",
    knobs: {
      ...DEFAULT_KNOBS,
      horizonYears: 5,
      capabilityDoublingMonths: 14,
      verifiabilityRatio: 1.8,
      reliabilityFloorScale: 1.2,
      trustMultiplier: 0.7,
      regSchemaMultiplier: 1.4,
      downtimeSensitivity: 1.3,
      genZAdoptionBoost: 0.8,
      stateRegMultiplier: 1.4,
      computeCostDeclineRate: 0.08,
      securityOverheadMultiplier: 1.3,
    },
  },
};

// ────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────

export default function CompositeModelPage() {
  const [knobs, setKnobs] = useState<Knobs>(DEFAULT_KNOBS);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("jobsImpacted");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string | null>(null);
  const [knobsOpen, setKnobsOpen] = useState(false);

  const results = useMemo(
    () => sectors.map((s) => computeSector(s, knobs)),
    [knobs]
  );

  const sorted = useMemo(() => {
    const arr = [...results];
    arr.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc"
        ? (va as number) - (vb as number)
        : (vb as number) - (va as number);
    });
    return arr;
  }, [results, sortKey, sortDir]);

  const totalNetJobs = useMemo(
    () => results.reduce((s, r) => s + r.jobsImpacted, 0),
    [results]
  );
  const totalGrowthJobs = useMemo(
    () => results.filter((r) => r.jobsImpacted > 0).reduce((s, r) => s + r.jobsImpacted, 0),
    [results]
  );
  const totalDeclineJobs = useMemo(
    () => results.filter((r) => r.jobsImpacted < 0).reduce((s, r) => s + r.jobsImpacted, 0),
    [results]
  );

  function update<K extends keyof Knobs>(key: K, value: Knobs[K]) {
    setKnobs((prev) => ({ ...prev, [key]: value }));
    setActivePreset(null);
  }

  function applyPreset(preset: Preset) {
    // Preserve the user's current horizon — presets shouldn't reset it
    setKnobs((prev) => ({ ...preset.knobs, horizonYears: prev.horizonYears }));
    setActivePreset(preset.id);
  }

  function resetToBaseline() {
    setKnobs(DEFAULT_KNOBS);
    setActivePreset(null);
  }

  function flipSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
          jobsdata.ai / model
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] leading-tight mb-4">
          The Composite Displacement Model
        </h1>
        <p className="text-lg text-[var(--muted)] leading-[1.7] mb-3">
          A sector-level engine built on four research-backed categories —
          Adoption Speed, AI Capability, Demand Elasticity, and Friction Buffer.
          Pick a scenario preset or adjust any of the twelve underlying knobs;
          the sector table updates live.
        </p>
        <p className="text-sm text-[var(--muted)] leading-[1.6] italic">
          v0.2 prototype. Sector defaults anchored to BTOS Census AI Supplement
          (2026), METR capability trajectories, and Bessen demand elasticity
          priors.
        </p>
      </header>

      {/* Model flow diagram — visual explanation */}
      <ModelDiagram />

      {/* 2×2 Scenario presets */}
      <section className="mb-8">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Scenario presets
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Four simple visions of the future. Click any to load its knob
              configuration.
            </p>
          </div>
          <button
            onClick={resetToBaseline}
            className="text-xs text-[var(--accent-text)] hover:underline"
          >
            ↻ Reset to baseline (METR + BTOS defaults)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-2 items-stretch">
          {/* Top row */}
          <div className="hidden md:block" />
          <AxisLabel>← High friction</AxisLabel>
          <AxisLabel>Low friction →</AxisLabel>

          <RowLabel>Fast capability<br/>+ adoption</RowLabel>
          <PresetCard preset={PRESETS.overhang} active={activePreset === "overhang"} onClick={() => applyPreset(PRESETS.overhang)} accent="#c89531" />
          <PresetCard preset={PRESETS.rapid} active={activePreset === "rapid"} onClick={() => applyPreset(PRESETS.rapid)} accent="#3a8a4f" />

          <RowLabel>Slow capability<br/>+ adoption</RowLabel>
          <PresetCard preset={PRESETS.status_quo} active={activePreset === "status_quo"} onClick={() => applyPreset(PRESETS.status_quo)} accent="#7a7e8b" />
          <PresetCard preset={PRESETS.steady} active={activePreset === "steady"} onClick={() => applyPreset(PRESETS.steady)} accent="#5b7faf" />
        </div>
      </section>

      {/* Summary band — jobs impact totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryStat
          label="Jobs added"
          value={formatJobs(totalGrowthJobs, true)}
          sub={`growth sectors at ${knobs.horizonYears}-yr horizon`}
        />
        <SummaryStat
          label="Jobs lost"
          value={formatJobs(totalDeclineJobs, true)}
          sub={`decline sectors at ${knobs.horizonYears}-yr horizon`}
        />
        <SummaryStat
          label="Net US employment Δ"
          value={formatJobs(totalNetJobs, true)}
          sub={`of 144.5M private-sector baseline (BLS QCEW)`}
        />
      </div>

      {/* Collapsible knob panel — horizontal, 4 columns matching framework */}
      <section className="mb-8">
        <button
          onClick={() => setKnobsOpen(!knobsOpen)}
          className="w-full bg-card border border-card rounded-lg px-5 py-3.5 flex items-center justify-between hover:bg-[var(--background)] transition-colors text-left"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-base font-semibold text-[var(--foreground)]">
              {knobsOpen ? "Hide" : "Open"} the 12 underlying knobs
            </span>
            <span className="text-xs text-[var(--muted)]">
              {knobsOpen
                ? "Adjust assumptions across the 4 framework categories"
                : "Scenarios above are presets; expand to tune individually"}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <LiveAnchorBadgeInline />
            <span className={`text-[var(--muted)] transition-transform ${knobsOpen ? "rotate-180" : ""}`}>▾</span>
          </div>
        </button>

        {knobsOpen && (
          <div className="mt-3 bg-card border border-card rounded-lg p-5">
            <p className="text-xs text-[var(--muted)] leading-[1.6] mb-4 max-w-2xl">
              Knobs are organized top-to-bottom by how much they actually move
              sector outputs. Tier 1 (red) drives the headline numbers; Tier 3
              (gray) is fine-tuning. The colored dot beside each knob shows
              which of the four framework categories it belongs to.
            </p>

            {(["high", "medium", "low"] as const).map((tier) => {
              const tierKnobs = KNOB_META.filter((k) => k.impact === tier);
              if (tierKnobs.length === 0) return null;
              const tierMeta = TIER_THRESHOLDS[tier];
              return (
                <TierSection key={tier} tier={tier} tierMeta={tierMeta}>
                  {tierKnobs.map((meta) => (
                    <TierKnobRow
                      key={meta.knob}
                      meta={meta}
                      value={knobs[meta.knob]}
                      onChange={(v) => update(meta.knob, v)}
                    />
                  ))}
                </TierSection>
              );
            })}

            {/* Framework category legend */}
            <div className="mt-5 pt-4 border-t border-divider flex items-center gap-4 flex-wrap text-[11px]">
              <span className="uppercase tracking-wider text-[var(--muted)]">
                Category dots:
              </span>
              {[
                { num: 1, name: "Adoption Speed", color: "#3a8a4f" },
                { num: 2, name: "AI Capability", color: "#c89531" },
                { num: 3, name: "Demand Elasticity", color: "#5b7faf" },
                { num: 4, name: "Friction Buffer", color: "#7a7e8b" },
              ].map((c) => (
                <span key={c.num} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: c.color }}
                  />
                  <span className="text-[var(--muted)]">
                    {c.num}. {c.name}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <div>
        {/* Results */}
        <section>
          {/* Counterfactual chart — top winners and losers */}
          <CounterfactualChart results={results} horizon={knobs.horizonYears} />

          <div className="bg-card border border-card rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-divider flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Full sector table ({knobs.horizonYears}-year horizon)
              </h2>
              <div className="flex items-center gap-3 text-xs">
                {Object.entries(ARCHETYPE_META).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: v.color }} />
                    <span className="text-[var(--muted)]">{v.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-[var(--muted)] border-b border-divider">
                    <Th onClick={() => flipSort("name")} active={sortKey === "name"} dir={sortDir}>Sector</Th>
                    <Th onClick={() => flipSort("employmentMillions")} active={sortKey === "employmentMillions"} dir={sortDir} right>Baseline (M)</Th>
                    <Th onClick={() => flipSort("btosCurrent")} active={sortKey === "btosCurrent"} dir={sortDir} right>BTOS now</Th>
                    <Th onClick={() => flipSort("realizedAdoption")} active={sortKey === "realizedAdoption"} dir={sortDir} right>Model adoption</Th>
                    <Th onClick={() => flipSort("taskReplacement")} active={sortKey === "taskReplacement"} dir={sortDir} right>Tasks replaced</Th>
                    <Th onClick={() => flipSort("productivityGain")} active={sortKey === "productivityGain"} dir={sortDir} right>Productivity Δ</Th>
                    <Th onClick={() => flipSort("employmentDelta")} active={sortKey === "employmentDelta"} dir={sortDir} right>Empl. Δ %</Th>
                    <Th onClick={() => flipSort("jobsImpacted")} active={sortKey === "jobsImpacted"} dir={sortDir} right>Jobs Δ</Th>
                    <Th onClick={() => flipSort("wageImpact")} active={sortKey === "wageImpact"} dir={sortDir} right>Wage Δ</Th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => {
                    const meta = ARCHETYPE_META[r.archetype];
                    const isSel = selected === r.naics;
                    return (
                      <tr
                        key={r.naics}
                        className={`border-b border-divider last:border-0 cursor-pointer hover:bg-[var(--background)] transition-colors ${isSel ? "bg-[var(--background)]" : ""}`}
                        onClick={() => setSelected(isSel ? null : r.naics)}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} title={meta.label} />
                            <span className="text-[var(--foreground)]">{r.name}</span>
                            <span className="text-xs text-[var(--muted)]">{r.naics}</span>
                          </div>
                        </td>
                        <Td>{r.employmentMillions.toFixed(1)}</Td>
                        <Td>{r.btosCurrent.toFixed(1)}%</Td>
                        <Td emphasis>{r.realizedAdoption.toFixed(1)}%</Td>
                        <Td>{r.taskReplacement.toFixed(1)}%</Td>
                        <Td>+{r.productivityGain.toFixed(1)}%</Td>
                        <Td color={r.employmentDelta < -0.5 ? "neg" : r.employmentDelta > 0.5 ? "pos" : undefined}>
                          {r.employmentDelta >= 0 ? "+" : ""}{r.employmentDelta.toFixed(2)}%
                        </Td>
                        <Td emphasis color={r.jobsImpacted < -1000 ? "neg" : r.jobsImpacted > 1000 ? "pos" : undefined}>
                          {formatJobs(r.jobsImpacted, true)}
                        </Td>
                        <Td color={r.wageImpact > 0.5 ? "pos" : undefined}>+{r.wageImpact.toFixed(2)}%</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {selected && (
            <SectorDetail
              sector={sectors.find((s) => s.naics === selected)!}
              impact={results.find((r) => r.naics === selected)!}
              knobs={knobs}
              onClose={() => setSelected(null)}
            />
          )}

          {/* TASK COMPUTE COST REFERENCE — anchor for the compute cost knob */}
          <TaskComputeCostReference />

          {/* FRAMEWORK EXPLAINER — 4 categories with per-factor cards */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              The four-category framework
            </h2>
            <p className="text-sm text-[var(--muted)] leading-[1.7] mb-4 max-w-2xl">
              Every knob above corresponds to one of these factors. The
              framework is the model — knobs are just the levers that expose it.
              Factors are sorted within each category by how much they actually
              move sector outputs; colored impact badges show the tier.
            </p>

            {/* Impact tier legend */}
            <div className="flex flex-wrap items-center gap-3 mb-6 bg-card border border-card rounded-lg px-4 py-3">
              <span className="text-xs uppercase tracking-wider text-[var(--muted)]">
                Impact tiers:
              </span>
              {(["high", "medium", "low", "informational"] as const).map((tier) => {
                const meta = IMPACT_META[tier];
                return (
                  <span
                    key={tier}
                    className="text-[11px] px-2 py-1 rounded flex items-center gap-1.5"
                    style={{ background: meta.bg, color: meta.color }}
                    title={meta.description}
                  >
                    <span className="font-semibold">{meta.label}</span>
                    <span className="opacity-80">— {meta.description.split(";")[0]}</span>
                  </span>
                );
              })}
            </div>

            <div className="space-y-4">
              {FRAMEWORK.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>

          {/* Limits */}
          <div className="mt-10 bg-card border border-card rounded-lg p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">
              What this prototype does NOT do (yet)
            </h3>
            <ul className="text-sm text-[var(--muted)] leading-[1.7] list-disc ml-5 space-y-1">
              <li>No Monte Carlo. Outputs are point estimates; production version will draw 5,000 paths per sector with fan bands.</li>
              <li>No occupation-level disaggregation. v0.3 lifts the 19 sectors into ~340 SOC occupations.</li>
              <li>No geographic selector. v0.3 adds MSA-level rollups using QCEW employment shares.</li>
              <li>No workforce program overlay (dimension-shift catalog). That&apos;s the next phase.</li>
              <li>Reinstatement (new tasks created by AI) is absorbed into ε. A future module separates it out.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Subcomponents
// ────────────────────────────────────────────────────────────────────

function AxisLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden md:flex items-end justify-center text-[10px] uppercase tracking-[0.15em] text-[var(--muted)] pb-1">
      {children}
    </div>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden md:flex items-center text-[10px] uppercase tracking-[0.15em] text-[var(--muted)] text-right justify-end pr-2 leading-tight">
      {children}
    </div>
  );
}

function PresetCard({
  preset,
  active,
  onClick,
  accent,
}: {
  preset: Preset;
  active: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left bg-card border-2 rounded-lg p-4 transition-all hover:border-[var(--foreground)] ${active ? "border-[var(--foreground)] shadow-sm" : "border-card"}`}
      style={active ? { boxShadow: `0 0 0 2px ${accent}33` } : {}}
    >
      <div className="flex items-start justify-between mb-1.5">
        <h3 className="text-base font-semibold text-[var(--foreground)] leading-tight">
          {preset.title}
        </h3>
        <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: accent }} />
      </div>
      <p className="text-[11px] uppercase tracking-wider text-[var(--muted)] mb-2">
        {preset.tagline}
      </p>
      <p className="text-xs text-[var(--muted)] leading-[1.55]">
        {preset.description}
      </p>
    </button>
  );
}

function TaskComputeCostReference() {
  const taskCategories = Object.keys(CATEGORY_TOKEN_PROFILES) as Array<
    keyof typeof CATEGORY_TOKEN_PROFILES
  >;
  const rows = taskCategories.map((cat) => {
    const profile = CATEGORY_TOKEN_PROFILES[cat];
    const meta = TASK_CATEGORY_META[cat];
    const rawCost = tokenCostPerHour(profile);
    const deployCost = rawCost * DEPLOYMENT_OVERHEAD;
    return { cat, meta, profile, rawCost, deployCost };
  }).sort((a, b) => a.deployCost - b.deployCost);

  const cheapest = rows[0];
  const priciest = rows[rows.length - 1];

  return (
    <div className="mt-10">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          Compute cost reference — by task category
        </h2>
        <Link
          href="/task-visualizer"
          className="text-sm text-[var(--accent-text)] hover:underline"
        >
          → Full per-task model on /task-visualizer
        </Link>
      </div>
      <p className="text-sm text-[var(--muted)] leading-[1.7] mb-5 max-w-3xl">
        The compute-cost knob in the framework is fit live to{" "}
        <a
          href="https://artificialanalysis.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-text)] hover:underline"
        >
          Artificial Analysis
        </a>
        &apos;s frontier price decline (~40%/yr on blended $/M-token). What that
        looks like at the task level is below — drawn directly from the
        per-category token profiles powering /task-visualizer. Cheapest task
        category today is{" "}
        <strong className="text-[var(--foreground)]">{cheapest.meta.label}</strong> at{" "}
        <strong className="text-[var(--foreground)]">${cheapest.deployCost.toFixed(2)}/hr</strong>{" "}
        with deployment overhead; priciest is{" "}
        <strong className="text-[var(--foreground)]">{priciest.meta.label}</strong> at{" "}
        <strong className="text-[var(--foreground)]">${priciest.deployCost.toFixed(2)}/hr</strong>.
      </p>

      <div className="bg-card border border-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-[var(--muted)] border-b border-divider">
                <th className="text-left px-4 py-3">Task category</th>
                <th className="text-left px-4 py-3">Model tier</th>
                <th className="text-right px-4 py-3">Input tok / call</th>
                <th className="text-right px-4 py-3">Output tok / call</th>
                <th className="text-right px-4 py-3">Calls / hr</th>
                <th className="text-right px-4 py-3">Raw $/hr</th>
                <th className="text-right px-4 py-3">With overhead ({DEPLOYMENT_OVERHEAD}×)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ cat, meta, profile, rawCost, deployCost }) => {
                const pricing = MODEL_PRICING[profile.modelTier];
                return (
                  <tr key={cat} className="border-b border-divider last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: meta.color }}
                        />
                        <span className="text-[var(--foreground)]">{meta.label}</span>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-0.5 ml-4">
                        {meta.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      <span className="text-[var(--foreground)] font-medium">
                        {pricing.label.split(" ")[0]}
                      </span>
                      <br />
                      <span className="text-[10px]">${pricing.inputPer1M}/${pricing.outputPer1M}/Mtok</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--muted)]">
                      {profile.inputTokensPerCall >= 1000
                        ? `${(profile.inputTokensPerCall / 1000).toFixed(0)}K`
                        : profile.inputTokensPerCall}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--muted)]">
                      {profile.outputTokensPerCall >= 1000
                        ? `${(profile.outputTokensPerCall / 1000).toFixed(0)}K`
                        : profile.outputTokensPerCall}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--muted)]">
                      {profile.callsPerHumanHour}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--muted)]">
                      ${rawCost < 1 ? rawCost.toFixed(3) : rawCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-[var(--foreground)]">
                      ${deployCost < 1 ? deployCost.toFixed(3) : deployCost.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[var(--muted)] mt-3 leading-[1.6]">
        Raw $/hr = calls × (input × input-price + output × output-price) ×
        per-call overhead. The {DEPLOYMENT_OVERHEAD}× deployment multiplier on
        top accounts for integration engineering, error handling, validation,
        human review, monitoring. Costs decline 30–48%/yr at the task level in
        the base case (live AA fit currently ~40%/yr). The bidirectional
        compute-cost knob lets you test what happens if energy and capital
        costs flip the sign of that trend.
      </p>
    </div>
  );
}

function ModelDiagram() {
  const cats = [
    { num: 1, name: "Adoption Speed", color: "#3a8a4f", knobs: 4, hint: "Trust, regulation, downtime, BTOS anchor" },
    { num: 2, name: "AI Capability", color: "#c89531", knobs: 3, hint: "METR doubling, RL feasibility, reliability floor" },
    { num: 3, name: "Demand Elasticity", color: "#5b7faf", knobs: 2, hint: "Bessen ε, productivity uplift" },
    { num: 4, name: "Friction Buffer", color: "#7a7e8b", knobs: 4, hint: "Gen Z, state reg, compute costs, security" },
  ];
  return (
    <section className="mb-10">
      <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
        How the model works
      </p>
      <div className="bg-card border border-card rounded-lg p-6">
        {/* Four input categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {cats.map((c) => (
            <div
              key={c.num}
              className="bg-[var(--background)] border-2 rounded-lg p-3.5"
              style={{ borderColor: `${c.color}55` }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[10px] font-semibold text-white w-5 h-5 rounded flex items-center justify-center tabular-nums flex-shrink-0"
                  style={{ background: c.color }}
                >
                  {c.num}
                </span>
                <p className="text-sm font-semibold text-[var(--foreground)] leading-tight">
                  {c.name}
                </p>
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-snug mb-1.5">
                {c.hint}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                {c.knobs} knob{c.knobs > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>

        {/* Arrow down */}
        <div className="flex justify-center">
          <span className="text-2xl text-[var(--muted)] leading-none">↓</span>
        </div>

        {/* Engine box */}
        <div className="bg-[var(--background)] border-2 border-divider rounded-lg p-4 my-2 max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Per-sector composite engine
          </p>
          <p className="text-sm text-[var(--foreground)] leading-snug font-mono">
            capability × adoption × (1 − complementarity) → productivity
          </p>
          <p className="text-sm text-[var(--foreground)] leading-snug font-mono mt-1">
            then Δemployment = (ε − 1) × Δproductivity
          </p>
          <p className="text-[11px] text-[var(--muted)] mt-2 italic">
            BTOS Census 2026 anchors t=0 adoption · Bessen identity translates
            productivity into employment
          </p>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center">
          <span className="text-2xl text-[var(--muted)] leading-none">↓</span>
        </div>

        {/* Output box */}
        <div className="bg-[var(--background)] border-2 rounded-lg p-3 mt-2 max-w-2xl mx-auto text-center" style={{ borderColor: "#3a8a4f55" }}>
          <p className="text-sm text-[var(--foreground)]">
            <strong>Employment Δ + Wage Δ</strong>
            <span className="text-[var(--muted)]"> · 19 NAICS sectors · 2/5/10-yr horizon</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function TierSection({
  tier,
  tierMeta,
  children,
}: {
  tier: "high" | "medium" | "low";
  tierMeta: typeof TIER_THRESHOLDS["high"];
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 rounded-lg overflow-hidden" style={{ background: tierMeta.bg, border: `1px solid ${tierMeta.border}` }}>
      <div
        className="px-4 py-2.5 flex items-baseline gap-2 flex-wrap"
        style={{ borderBottom: `1px solid ${tierMeta.border}`, background: tier === "high" ? `${tierMeta.color}10` : "transparent" }}
      >
        <span
          className="text-[11px] uppercase tracking-wider font-bold"
          style={{ color: tierMeta.color }}
        >
          {tierMeta.label}
        </span>
        <span className="text-[11px] text-[var(--muted)]">
          {tierMeta.tagline}
        </span>
      </div>
      <div className="divide-y" style={{ borderColor: tierMeta.border }}>
        {children}
      </div>
    </div>
  );
}

function TierKnobRow({
  meta,
  value,
  onChange,
}: {
  meta: KnobMeta;
  value: number;
  onChange: (v: number) => void;
}) {
  const isSegmented = !!meta.segmentedOptions;
  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_90px] gap-3 px-4 py-3 items-center hover:bg-white/30 transition-colors">
      {/* Label with category dot */}
      <div className="flex items-center gap-2 min-w-0" title={meta.hint}>
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: meta.categoryColor }}
          aria-label={`Category ${meta.categoryNumber}`}
        />
        <span className="text-[10px] text-[var(--muted)] tabular-nums flex-shrink-0">
          {meta.categoryNumber}.
        </span>
        <span className="text-sm text-[var(--foreground)] truncate">
          {meta.label}
        </span>
      </div>

      {/* Control */}
      <div>
        {isSegmented ? (
          <div className="flex gap-1.5">
            {meta.segmentedOptions!.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`flex-1 max-w-[80px] py-1.5 text-xs rounded border transition-colors ${
                  value === opt
                    ? "bg-[var(--accent-text)] text-white border-[var(--accent-text)]"
                    : "bg-[var(--background)] text-[var(--foreground)] border-card hover:border-[var(--muted)]"
                }`}
              >
                {meta.formatValue(opt)}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="range"
            min={meta.min}
            max={meta.max}
            step={meta.step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full accent-[var(--accent-text)] cursor-pointer"
            aria-label={meta.label}
            title={meta.hint}
          />
        )}
      </div>

      {/* Value badge */}
      <div className="text-right">
        <span className="text-sm font-medium text-[var(--foreground)] tabular-nums">
          {meta.formatValue(value)}
        </span>
      </div>
    </div>
  );
}

function LiveAnchorBadgeInline() {
  const top = CAPABILITY_ANCHOR.currentFrontier[0];
  return (
    <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3a8a4f] opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3a8a4f]" />
      </span>
      <span>Live · {top?.name} (II {top?.intelligenceIndex}) from Artificial Analysis</span>
    </div>
  );
}

function CounterfactualChart({
  results,
  horizon,
}: {
  results: ReturnType<typeof computeSector>[];
  horizon: number;
}) {
  // Sort by ABSOLUTE jobs impacted, not by percentage —
  // Healthcare at +0.5% (≈110K jobs) outranks Mining at +5% (≈30K jobs).
  const sorted = [...results].sort((a, b) => b.jobsImpacted - a.jobsImpacted);
  const winners = sorted.filter((r) => r.jobsImpacted > 1000).slice(0, 6);
  const losers = sorted
    .filter((r) => r.jobsImpacted < -1000)
    .slice(-6)
    .reverse();
  const maxAbs = Math.max(...results.map((r) => Math.abs(r.jobsImpacted)), 1000);

  const aggGrowth = winners.reduce((s, r) => s + r.jobsImpacted, 0);
  const aggDecline = losers.reduce((s, r) => s + r.jobsImpacted, 0);

  return (
    <div className="bg-card border border-card rounded-lg p-6 mb-5">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
          AI counterfactual — {horizon}-year horizon
        </p>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-1.5 leading-tight">
          Sector winners and losers, with AI vs. without
        </h2>
        <p className="text-sm text-[var(--muted)] leading-[1.6]">
          Ranked by <strong>absolute jobs impacted</strong>, not percentage —
          Healthcare&apos;s 22.7M baseline means a small % change moves more
          people than a big % change in Mining. Bars sized to jobs; % shown
          alongside.
        </p>
      </div>

      {/* Winners section */}
      {winners.length > 0 && (
        <div className="mb-5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs uppercase tracking-wider text-[#3a8a4f] font-semibold">
              Top growth sectors (jobs added)
            </p>
            <p className="text-xs text-[var(--muted)] tabular-nums">
              {winners.length} sectors · combined {formatJobs(aggGrowth, true)}
            </p>
          </div>
          <div className="space-y-1.5">
            {winners.map((r) => (
              <DivergingRow key={r.naics} result={r} maxAbs={maxAbs} />
            ))}
          </div>
        </div>
      )}

      {/* Centerline */}
      <div className="my-4 flex items-center gap-3">
        <div className="flex-1 border-t border-divider"></div>
        <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
          No-AI baseline (0 jobs)
        </span>
        <div className="flex-1 border-t border-divider"></div>
      </div>

      {/* Losers section */}
      {losers.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs uppercase tracking-wider text-[#d4493a] font-semibold">
              Top decline sectors (jobs lost)
            </p>
            <p className="text-xs text-[var(--muted)] tabular-nums">
              {losers.length} sectors · combined {formatJobs(aggDecline, true)}
            </p>
          </div>
          <div className="space-y-1.5">
            {losers.map((r) => (
              <DivergingRow key={r.naics} result={r} maxAbs={maxAbs} />
            ))}
          </div>
        </div>
      )}

      {winners.length === 0 && losers.length === 0 && (
        <p className="text-sm text-[var(--muted)] italic text-center py-8">
          No sectors show meaningful change at current knob settings. Pick a
          scenario preset above to see divergence.
        </p>
      )}
    </div>
  );
}

function formatJobs(n: number, signed = false): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  const abs = Math.abs(n);
  let core: string;
  if (abs >= 1_000_000) core = `${(abs / 1_000_000).toFixed(2)}M`;
  else if (abs >= 1_000) core = `${(abs / 1_000).toFixed(0)}K`;
  else core = `${Math.round(abs)}`;
  return signed ? `${sign}${core}` : core;
}

function DivergingRow({
  result,
  maxAbs,
}: {
  result: ReturnType<typeof computeSector>;
  maxAbs: number;
}) {
  const isPositive = result.jobsImpacted >= 0;
  const halfWidthPct = (Math.abs(result.jobsImpacted) / maxAbs) * 50;
  const color = isPositive ? "#3a8a4f" : "#d4493a";

  return (
    <div className="grid grid-cols-[170px_1fr_110px] gap-3 items-center text-sm">
      <span
        className="text-right text-[var(--foreground)] truncate text-xs"
        title={`${result.name} · ${result.employmentMillions.toFixed(1)}M baseline`}
      >
        {result.name}
      </span>
      <div className="relative h-6">
        <div className="absolute inset-y-1 left-1/2 w-px bg-[var(--muted)] opacity-40" />
        <div
          className="absolute top-1 bottom-1 rounded"
          style={{
            [isPositive ? "left" : "right"]: "50%",
            width: `${halfWidthPct}%`,
            background: color,
            opacity: 0.85,
          }}
        />
      </div>
      <span
        className="tabular-nums text-left font-medium text-xs"
        style={{ color }}
      >
        {formatJobs(result.jobsImpacted, true)}
        <span className="text-[10px] text-[var(--muted)] ml-1">
          ({result.employmentDelta >= 0 ? "+" : ""}
          {result.employmentDelta.toFixed(2)}%)
        </span>
      </span>
    </div>
  );
}

function SummaryStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border border-card rounded-lg px-5 py-4">
      <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">{label}</p>
      <p className="text-2xl font-semibold text-[var(--foreground)] tabular-nums">{value}</p>
      <p className="text-xs text-[var(--muted)] mt-1">{sub}</p>
    </div>
  );
}

function Th({
  children, onClick, active, dir, right,
}: {
  children: React.ReactNode; onClick: () => void; active: boolean; dir: "asc" | "desc"; right?: boolean;
}) {
  return (
    <th
      onClick={onClick}
      className={`px-5 py-3 cursor-pointer select-none hover:text-[var(--foreground)] transition-colors ${right ? "text-right" : "text-left"} ${active ? "text-[var(--foreground)]" : ""}`}
    >
      {children}
      {active && <span className="ml-1">{dir === "asc" ? "↑" : "↓"}</span>}
    </th>
  );
}

function Td({
  children, emphasis, color,
}: {
  children: React.ReactNode; emphasis?: boolean; color?: "pos" | "neg";
}) {
  const colorClass =
    color === "neg" ? "text-[#d4493a]"
    : color === "pos" ? "text-[#3a8a4f]"
    : emphasis ? "text-[var(--foreground)]"
    : "text-[var(--muted)]";
  return (
    <td className={`px-5 py-3 text-right tabular-nums ${colorClass} ${emphasis ? "font-medium" : ""}`}>
      {children}
    </td>
  );
}

function SectorDetail({
  sector, impact, knobs, onClose,
}: {
  sector: Sector; impact: ReturnType<typeof computeSector>; knobs: Knobs; onClose: () => void;
}) {
  const p = sector.params;
  const meta = ARCHETYPE_META[impact.archetype];
  return (
    <div className="mt-4 bg-card border border-card rounded-lg p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: meta.color }} />
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{sector.name}</h3>
            <span className="text-xs text-[var(--muted)]">NAICS {sector.naics}</span>
          </div>
          <p className="text-sm text-[var(--muted)]">
            <strong>{meta.label}.</strong> {meta.description}
          </p>
        </div>
        <button onClick={onClose} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]">
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <DetailStat label="Capability share" value={`${impact.capabilityShare.toFixed(1)}%`} />
        <DetailStat label="After reliability + cost" value={`${impact.economicViableShare.toFixed(1)}%`} />
        <DetailStat label="Realized adoption" value={`${impact.realizedAdoption.toFixed(1)}%`} />
        <DetailStat label="Task replacement" value={`${impact.taskReplacement.toFixed(1)}%`} />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Sector defaults</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-xs">
          <Param label="Exposure" value={`${(p.exposureShare * 100).toFixed(0)}%`} />
          <Param label="Verifiability" value={`${(p.verifiabilityShare * 100).toFixed(0)}%`} />
          <Param label="Trust coef" value={p.trustCoef.toFixed(2)} />
          <Param label="Reliability floor" value={p.reliabilityFloor.toFixed(4)} />
          <Param label="Elasticity ε" value={p.elasticity.toFixed(2)} />
          <Param label="Complementarity" value={p.complementarity.toFixed(2)} />
          <Param label="Friction" value={p.frictionDrag.toFixed(2)} />
          <Param label="Gen Z share" value={`${(p.genZShare * 100).toFixed(0)}%`} />
          <Param label="Reg schema" value={p.regSchemaDrag.toFixed(2)} />
          <Param label="Downtime risk" value={p.downtimeRisk.toFixed(2)} />
          <Param label="Security" value={p.securityOverhead.toFixed(2)} />
          <Param label="Horizon" value={`${knobs.horizonYears} yr`} />
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-divider">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Walk-through</p>
        <p className="text-sm text-[var(--muted)] leading-[1.7]">
          Frontier reaches <strong className="text-[var(--foreground)]">{impact.capabilityShare.toFixed(1)}%</strong> of {sector.name.toLowerCase()} tasks at this horizon. Reliability, verifiability, and compute-cost gates leave <strong className="text-[var(--foreground)]">{impact.economicViableShare.toFixed(1)}%</strong> economically viable. Sectoral trust ({p.trustCoef.toFixed(2)}), Gen Z share ({(p.genZShare * 100).toFixed(0)}%), regulatory schema ({p.regSchemaDrag.toFixed(2)}), downtime risk ({p.downtimeRisk.toFixed(2)}), and security overhead ({p.securityOverhead.toFixed(2)}) compose into <strong className="text-[var(--foreground)]">{impact.realizedAdoption.toFixed(1)}%</strong> actual adoption (BTOS anchor: {sector.btos.currentUse}% today, {sector.btos.plannedUse}% planned in 6 months). With {((1 - p.complementarity) * 100).toFixed(0)}% of exposed tasks being substitutive, <strong className="text-[var(--foreground)]">{impact.taskReplacement.toFixed(1)}%</strong> of work hours are displaced — a <strong className="text-[var(--foreground)]">{impact.productivityGain.toFixed(1)}%</strong> productivity uplift. With ε = {p.elasticity.toFixed(2)}, that translates to <strong className="text-[var(--foreground)]">{impact.employmentDelta >= 0 ? "+" : ""}{impact.employmentDelta.toFixed(2)}%</strong> employment change and <strong className="text-[var(--foreground)]">+{impact.wageImpact.toFixed(2)}%</strong> wage impact.
        </p>
      </div>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)] mb-1">{label}</p>
      <p className="text-lg font-semibold text-[var(--foreground)] tabular-nums">{value}</p>
    </div>
  );
}

function Param({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-divider pb-1">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="text-[var(--foreground)] font-medium tabular-nums">{value}</span>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const colorByCat: Record<string, string> = {
    adoption: "#3a8a4f",
    capability: "#c89531",
    demand: "#5b7faf",
    friction: "#7a7e8b",
  };
  const accent = colorByCat[category.id] || "#999";
  const [open, setOpen] = useState(category.number === 1);

  return (
    <div className="bg-card border border-card rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-[var(--background)] transition-colors"
      >
        <span
          className="flex-shrink-0 text-sm font-semibold text-white w-7 h-7 rounded flex items-center justify-center tabular-nums"
          style={{ background: accent }}
        >
          {category.number}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--foreground)] leading-tight mb-1">
            {category.name}
          </h3>
          <p className="text-sm text-[var(--muted)] leading-[1.5]">
            {category.oneLiner}
          </p>
        </div>
        <span className={`text-[var(--muted)] text-sm mt-1.5 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-divider">
          <p className="text-sm text-[var(--muted)] leading-[1.7] italic mb-5">
            <strong className="text-[var(--foreground)] not-italic">Why it matters:</strong>{" "}
            {category.whyItMatters}
          </p>

          <div className="space-y-4">
            {sortFactorsByImpact(category.factors).map((f) => (
              <FactorCard key={f.id} factor={f} accent={accent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FactorCard({ factor, accent }: { factor: Factor; accent: string }) {
  const impact = IMPACT_META[factor.impact];
  return (
    <div className="pl-4 border-l-2" style={{ borderColor: `${accent}66` }}>
      <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ color: impact.color, background: impact.bg }}
            title={impact.description}
          >
            {impact.label} impact
          </span>
          <h4 className="text-sm font-semibold text-[var(--foreground)] leading-tight">
            {factor.name}
          </h4>
        </div>
        {factor.knob && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] bg-[var(--background)] px-1.5 py-0.5 rounded flex-shrink-0">
            knob: {factor.knob}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--muted)] leading-[1.65] mb-1.5">
        {factor.description}
      </p>
      {factor.impactNote && (
        <p className="text-xs leading-[1.5] mb-1.5 px-2 py-1 rounded" style={{ background: impact.bg, color: impact.color }}>
          <strong>Where it bites:</strong> {factor.impactNote}
        </p>
      )}
      <p className="text-xs text-[var(--muted)]">
        Source:{" "}
        {factor.citation.url ? (
          <a
            href={factor.citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            {factor.citation.label}
          </a>
        ) : (
          <span className="italic">{factor.citation.label}</span>
        )}
      </p>
    </div>
  );
}
