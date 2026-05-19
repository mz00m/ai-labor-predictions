"use client";

import { useMemo, useState } from "react";
import btosData from "@/data/btos-sectors.json";
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
} from "@/lib/composite-model";

type SortKey =
  | "name"
  | "btosCurrent"
  | "btosPlanned"
  | "realizedAdoption"
  | "taskReplacement"
  | "productivityGain"
  | "employmentDelta"
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
  const [sortKey, setSortKey] = useState<SortKey>("employmentDelta");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string | null>(null);

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

  const aggEmpDelta = useMemo(() => {
    const sum = results.reduce((s, r) => s + r.employmentDelta, 0);
    return sum / results.length;
  }, [results]);

  const aggReplacement = useMemo(() => {
    const sum = results.reduce((s, r) => s + r.taskReplacement, 0);
    return sum / results.length;
  }, [results]);

  function update<K extends keyof Knobs>(key: K, value: Knobs[K]) {
    setKnobs((prev) => ({ ...prev, [key]: value }));
    setActivePreset(null);
  }

  function applyPreset(preset: Preset) {
    setKnobs(preset.knobs);
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
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="mb-8 max-w-3xl">
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

        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-2 items-stretch">
          {/* Top row */}
          <div className="hidden md:block" />
          <AxisLabel>Low friction →</AxisLabel>
          <AxisLabel>← High friction</AxisLabel>

          <RowLabel>Fast capability + adoption</RowLabel>
          <PresetCard preset={PRESETS.rapid} active={activePreset === "rapid"} onClick={() => applyPreset(PRESETS.rapid)} accent="#3a8a4f" />
          <PresetCard preset={PRESETS.overhang} active={activePreset === "overhang"} onClick={() => applyPreset(PRESETS.overhang)} accent="#c89531" />

          <RowLabel>Slow capability + adoption</RowLabel>
          <PresetCard preset={PRESETS.steady} active={activePreset === "steady"} onClick={() => applyPreset(PRESETS.steady)} accent="#5b7faf" />
          <PresetCard preset={PRESETS.status_quo} active={activePreset === "status_quo"} onClick={() => applyPreset(PRESETS.status_quo)} accent="#7a7e8b" />
        </div>
      </section>

      {/* Summary band */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryStat
          label="Avg net employment Δ"
          value={`${aggEmpDelta >= 0 ? "+" : ""}${aggEmpDelta.toFixed(2)}%`}
          sub={`across ${results.length} sectors, ${knobs.horizonYears}yr horizon`}
        />
        <SummaryStat
          label="Avg task replacement"
          value={`${aggReplacement.toFixed(1)}%`}
          sub="of total work hours"
        />
        <SummaryStat
          label="BTOS current AI use"
          value={`${btosData.national.currentUse}%`}
          sub={`→ ${btosData.national.plannedUse6mo}% planned in 6 months (US Census 2026)`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Knob panel — organized by 4 framework categories */}
        <aside className="bg-card border border-card rounded-lg p-5 h-fit lg:sticky lg:top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-1">
              Model knobs
            </h2>
            <p className="text-xs text-[var(--muted)] leading-[1.5]">
              Grouped by the four framework categories. Each knob has a
              research-anchored default; hover the name for the source.
            </p>
          </div>

          <KnobGroup category={1} title="Adoption Speed" color="#3a8a4f">
            <SegmentedKnob
              label="Horizon"
              value={knobs.horizonYears}
              options={[2, 5, 10]}
              format={(v) => `${v}yr`}
              onChange={(v) => update("horizonYears", v)}
              hint="Different mechanisms dominate at different horizons."
            />
            <SliderKnob label="Trust multiplier" value={knobs.trustMultiplier} min={0.5} max={1.5} step={0.05} onChange={(v) => update("trustMultiplier", v)} format={(v) => `${v.toFixed(2)}×`} hint="Cultural aversions (Gallup, NY Fed SCE). Healthcare 0.20, software 0.80." />
            <SliderKnob label="Regulatory schema" value={knobs.regSchemaMultiplier} min={0.5} max={1.5} step={0.05} onChange={(v) => update("regSchemaMultiplier", v)} format={(v) => `${v.toFixed(2)}×`} hint="Sector approval pathway burden (FDA, OCC, state boards)." />
            <SliderKnob label="Downtime sensitivity" value={knobs.downtimeSensitivity} min={0.5} max={1.5} step={0.05} onChange={(v) => update("downtimeSensitivity", v)} format={(v) => `${v.toFixed(2)}×`} hint="Asymmetric cost of AI failure (anesthesia, grid, trading)." />
          </KnobGroup>

          <KnobGroup category={2} title="AI Capability" color="#c89531">
            <LiveAnchorBadge />
            <SliderKnob label="Capability doubling (months)" value={knobs.capabilityDoublingMonths} min={4} max={18} step={0.1} onChange={(v) => update("capabilityDoublingMonths", v)} format={(v) => `${v.toFixed(1)} mo`} hint="Fit live to Artificial Analysis Intelligence Index frontier." />
            <SliderKnob label="Verifiability divergence" value={knobs.verifiabilityRatio} min={1.2} max={4.0} step={0.1} onChange={(v) => update("verifiabilityRatio", v)} format={(v) => `${v.toFixed(1)}×`} hint="How much faster verifiable tasks advance (Tomei & Klein Teeselink)." />
            <SliderKnob label="Reliability floor scale" value={knobs.reliabilityFloorScale} min={0.7} max={1.3} step={0.05} onChange={(v) => update("reliabilityFloorScale", v)} format={(v) => `${v.toFixed(2)}×`} hint="Tightens or loosens regulatory reliability thresholds per sector." />
          </KnobGroup>

          <KnobGroup category={3} title="Demand Elasticity" color="#5b7faf">
            <SliderKnob label="Elasticity scale" value={knobs.elasticityScale} min={0.5} max={2.0} step={0.05} onChange={(v) => update("elasticityScale", v)} format={(v) => `${v.toFixed(2)}×`} hint="Scales Bessen ε per sector. ε>1 grows jobs; ε<1 cuts them." />
            <SliderKnob label="Productivity uplift" value={knobs.productivityUplift} min={0.1} max={0.4} step={0.01} onChange={(v) => update("productivityUplift", v)} format={(v) => `${(v * 100).toFixed(0)}%`} hint="Per-task cost savings (Acemoglu 2024 ≈ 27%)." />
          </KnobGroup>

          <KnobGroup category={4} title="Friction Buffer" color="#7a7e8b">
            <SliderKnob label="Gen Z adoption boost" value={knobs.genZAdoptionBoost} min={0.5} max={1.5} step={0.05} onChange={(v) => update("genZAdoptionBoost", v)} format={(v) => `${v.toFixed(2)}×`} hint="Amplifies the Gen Z share's adoption-lifting effect per sector." />
            <SliderKnob label="State regulation drag" value={knobs.stateRegMultiplier} min={0.5} max={1.5} step={0.05} onChange={(v) => update("stateRegMultiplier", v)} format={(v) => `${v.toFixed(2)}×`} hint="Independent of sector schema (CA SB1047 derivatives, NYC bias audits, CO AI Act)." />
            <SliderKnob label="Compute cost decline" value={knobs.computeCostDeclineRate} min={0.05} max={0.40} step={0.01} onChange={(v) => update("computeCostDeclineRate", v)} format={(v) => `${(v * 100).toFixed(0)}%/yr`} hint="Wright's Law decline on token + energy costs." />
            <SliderKnob label="Security overhead" value={knobs.securityOverheadMultiplier} min={0.5} max={1.5} step={0.05} onChange={(v) => update("securityOverheadMultiplier", v)} format={(v) => `${v.toFixed(2)}×`} hint="SOC 2, HIPAA, FedRAMP, state data sovereignty drag." />
          </KnobGroup>
        </aside>

        {/* Results */}
        <section>
          <div className="bg-card border border-card rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-divider flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Sector impacts ({knobs.horizonYears}-year horizon)
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
                    <Th onClick={() => flipSort("btosCurrent")} active={sortKey === "btosCurrent"} dir={sortDir} right>BTOS now</Th>
                    <Th onClick={() => flipSort("btosPlanned")} active={sortKey === "btosPlanned"} dir={sortDir} right>BTOS +6mo</Th>
                    <Th onClick={() => flipSort("realizedAdoption")} active={sortKey === "realizedAdoption"} dir={sortDir} right>Model adoption</Th>
                    <Th onClick={() => flipSort("taskReplacement")} active={sortKey === "taskReplacement"} dir={sortDir} right>Tasks replaced</Th>
                    <Th onClick={() => flipSort("productivityGain")} active={sortKey === "productivityGain"} dir={sortDir} right>Productivity Δ</Th>
                    <Th onClick={() => flipSort("employmentDelta")} active={sortKey === "employmentDelta"} dir={sortDir} right>Employment Δ</Th>
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
                        <Td>{r.btosCurrent.toFixed(1)}%</Td>
                        <Td>{r.btosPlanned.toFixed(1)}%</Td>
                        <Td emphasis>{r.realizedAdoption.toFixed(1)}%</Td>
                        <Td>{r.taskReplacement.toFixed(1)}%</Td>
                        <Td>+{r.productivityGain.toFixed(1)}%</Td>
                        <Td color={r.employmentDelta < -0.5 ? "neg" : r.employmentDelta > 0.5 ? "pos" : undefined}>
                          {r.employmentDelta >= 0 ? "+" : ""}{r.employmentDelta.toFixed(2)}%
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

          {/* FRAMEWORK EXPLAINER — 4 categories with per-factor cards */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              The four-category framework
            </h2>
            <p className="text-sm text-[var(--muted)] leading-[1.7] mb-6 max-w-2xl">
              Every knob above corresponds to one of these factors. The
              framework is the model — knobs are just the levers that expose it.
              Defaults are research-anchored; cites link to source where
              available.
            </p>

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
              <li>No workforce program overlay (dimension-shift catalog). That's the next phase.</li>
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

function LiveAnchorBadge() {
  const top = CAPABILITY_ANCHOR.currentFrontier[0];
  const date = CAPABILITY_ANCHOR.fetchedAt.slice(0, 10);
  return (
    <div className="bg-[var(--background)] border border-divider rounded px-2.5 py-2 mb-1">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3a8a4f] opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3a8a4f]" />
        </span>
        <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
          Live — Artificial Analysis
        </p>
      </div>
      <p className="text-[11px] text-[var(--foreground)] leading-tight">
        Frontier: <strong>{top?.name}</strong> · II {top?.intelligenceIndex}
      </p>
      <p className="text-[10px] text-[var(--muted)] mt-0.5">
        {CAPABILITY_ANCHOR.frontierReleases} frontier releases · refreshed {date}
      </p>
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

function KnobGroup({
  category,
  title,
  color,
  children,
}: {
  category: number;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 pb-5 border-b border-divider last:border-0 last:pb-0">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded tabular-nums"
          style={{ background: color }}
        >
          {category}
        </span>
        <p className="text-xs uppercase tracking-wider text-[var(--foreground)] font-semibold">
          {title}
        </p>
      </div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

function SliderKnob({
  label, value, min, max, step, onChange, format, hint,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format: (v: number) => string; hint?: string;
}) {
  return (
    <label className="block" title={hint}>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs text-[var(--foreground)]">{label}</span>
        <span className="text-xs font-medium text-[var(--foreground)] tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--accent-text)] cursor-pointer"
      />
    </label>
  );
}

function SegmentedKnob({
  label, value, options, onChange, format, hint,
}: {
  label: string; value: number; options: number[];
  onChange: (v: number) => void; format: (v: number) => string; hint?: string;
}) {
  return (
    <div title={hint}>
      <p className="text-xs text-[var(--foreground)] mb-1.5">{label}</p>
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
              value === opt
                ? "bg-[var(--accent-text)] text-white border-[var(--accent-text)]"
                : "bg-[var(--background)] text-[var(--foreground)] border-card hover:border-[var(--muted)]"
            }`}
          >
            {format(opt)}
          </button>
        ))}
      </div>
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
            {category.factors.map((f) => (
              <FactorCard key={f.id} factor={f} accent={accent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FactorCard({ factor, accent }: { factor: Factor; accent: string }) {
  return (
    <div className="pl-4 border-l-2" style={{ borderColor: `${accent}66` }}>
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h4 className="text-sm font-semibold text-[var(--foreground)] leading-tight">
          {factor.name}
        </h4>
        {factor.knob && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] bg-[var(--background)] px-1.5 py-0.5 rounded flex-shrink-0">
            knob: {factor.knob}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--muted)] leading-[1.65] mb-1.5">
        {factor.description}
      </p>
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
