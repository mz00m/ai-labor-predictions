"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Sector presets                                                      */
/* ------------------------------------------------------------------ */

interface Preset {
  label: string;
  elasticity: number;
  productivity: number;
  description: string;
}

const PRESETS: Preset[] = [
  {
    label: "Data entry",
    elasticity: 0.3,
    productivity: 3.0,
    description: "Nobody wants more data entry at lower prices. Displacement dominant.",
  },
  {
    label: "Legal",
    elasticity: 0.8,
    productivity: 2.5,
    description: "Moderate latent demand for affordable legal services, slowed by regulation.",
  },
  {
    label: "Creative",
    elasticity: 1.3,
    productivity: 3.0,
    description: "Large unmet demand for bespoke creative work at SMB price points.",
  },
  {
    label: "Software",
    elasticity: 1.8,
    productivity: 5.0,
    description: "Vast unmet demand for automation, integration, and custom tooling.",
  },
];

const AGENTIC_CODING_PRESET: Preset = {
  label: "Agentic coding",
  elasticity: 1.8,
  productivity: 5.0,
  description:
    "A 50-engineer project has no ROI, so the company hires 0. AI makes it a 10-engineer problem. The company hires 10.",
};

/* ------------------------------------------------------------------ */
/*  Math: demand response to cost reduction                             */
/* ------------------------------------------------------------------ */

export function computeScenario(
  productivity: number,
  elasticity: number,
  baseWorkers: number
) {
  // Cost per unit drops by 1/productivity
  const costRatio = 1 / productivity;
  // Demand increase: Q_new / Q_old = (P_old / P_new)^elasticity
  const demandMultiplier = Math.pow(1 / costRatio, elasticity);
  // Workers needed = (demand * workers_per_unit) = demandMultiplier * (baseWorkers / productivity)
  const workersPerUnit = baseWorkers / productivity;
  const newWorkers = Math.round(demandMultiplier * workersPerUnit);
  const netChange = newWorkers - baseWorkers;
  const demandUnits = Math.round(demandMultiplier * 100);

  return {
    before: baseWorkers,
    after: newWorkers,
    netChange,
    demandUnits, // demand as % of original (100 = same)
    costReduction: Math.round((1 - costRatio) * 100),
  };
}

/* ------------------------------------------------------------------ */
/*  Compact mode for embedding                                          */
/* ------------------------------------------------------------------ */

interface DemandSliderVizProps {
  /** Show all presets and full description. False = compact embed. */
  compact?: boolean;
}

export default function DemandSliderViz({ compact = false }: DemandSliderVizProps) {
  const [productivity, setProductivity] = useState(3.0);
  const [elasticity, setElasticity] = useState(1.0);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const BASE_WORKERS = 100;
  const scenario = useMemo(
    () => computeScenario(productivity, elasticity, BASE_WORKERS),
    [productivity, elasticity]
  );

  const applyPreset = useCallback((preset: Preset) => {
    setProductivity(preset.productivity);
    setElasticity(preset.elasticity);
    setActivePreset(preset.label);
  }, []);

  const handleProductivityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProductivity(parseFloat(e.target.value));
      setActivePreset(null);
    },
    []
  );

  const handleElasticityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setElasticity(parseFloat(e.target.value));
      setActivePreset(null);
    },
    []
  );

  const chartData = [
    {
      name: "Before AI",
      workers: scenario.before,
      fill: "#94a3b8",
    },
    {
      name: "After AI",
      workers: scenario.after,
      fill: scenario.netChange >= 0 ? "#22c55e" : "#ef4444",
    },
  ];

  const isExpansion = scenario.netChange >= 0;
  const activePresetData = activePreset
    ? [...PRESETS, AGENTIC_CODING_PRESET].find((p) => p.label === activePreset)
    : null;

  const presetsToShow = compact
    ? PRESETS
    : [...PRESETS, AGENTIC_CODING_PRESET];

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-4 sm:p-6">
      {!compact && (
        <div className="mb-5">
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">
            Demand Response Calculator
          </h3>
          <p className="text-base text-[var(--muted)] leading-relaxed">
            Adjust AI productivity gains and demand elasticity to see how
            workforce size changes. When demand is elastic, cost reductions
            create more total work.
          </p>
        </div>
      )}

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {presetsToShow.map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
              activePreset === preset.label
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : "bg-white text-[var(--muted)] border-black/[0.08] hover:border-black/[0.15] hover:text-[var(--foreground)]"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Active preset description */}
      {activePresetData && (
        <div
          className="mb-5 px-4 py-3 rounded-lg border-l-3 text-base text-[var(--muted)] leading-relaxed"
          style={{
            borderLeftColor: "var(--accent)",
            borderLeftWidth: 3,
            backgroundColor: "var(--accent-light)",
          }}
        >
          {activePresetData.description}
        </div>
      )}

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {/* Productivity slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-[var(--foreground)]">
              AI productivity multiplier
            </label>
            <span
              className="text-base font-bold tabular-nums"
              style={{ color: "#5C61F6" }}
            >
              {productivity.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={productivity}
            onChange={handleProductivityChange}
            className="w-full accent-[#5C61F6]"
          />
          <div className="flex justify-between text-2xs text-[var(--muted)] mt-0.5">
            <span>1x (no gain)</span>
            <span>10x</span>
          </div>
        </div>

        {/* Elasticity slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-[var(--foreground)]">
              Demand elasticity
            </label>
            <span
              className="text-base font-bold tabular-nums"
              style={{
                color:
                  elasticity < 0.5
                    ? "#ef4444"
                    : elasticity < 1.0
                      ? "#f59e0b"
                      : "#22c55e",
              }}
            >
              {elasticity.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.1"
            value={elasticity}
            onChange={handleElasticityChange}
            className="w-full accent-[#5C61F6]"
          />
          <div className="flex justify-between text-2xs text-[var(--muted)] mt-0.5">
            <span>0.1 (inelastic)</span>
            <span>2.5 (highly elastic)</span>
          </div>
        </div>
      </div>

      {/* Results: Chart + Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4 items-center">
        {/* Bar chart */}
        <div className={compact ? "h-[160px]" : "h-[220px]"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barSize={compact ? 48 : 64}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#00000008"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#e2e8f0",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number) => [
                  `${value} workers`,
                  "Workforce",
                ]}
              />
              <ReferenceLine
                y={BASE_WORKERS}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Bar
                dataKey="workers"
                radius={[4, 4, 0, 0]}
                animationDuration={reducedMotion ? 0 : 400}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats panel */}
        <div className="space-y-3">
          <div
            className="rounded-lg px-4 py-3 text-center border"
            style={{
              borderColor: isExpansion ? "#22c55e30" : "#ef444430",
              backgroundColor: isExpansion ? "#22c55e08" : "#ef444408",
            }}
          >
            <p
              className="text-4xl font-black tabular-nums"
              style={{ color: isExpansion ? "#22c55e" : "#ef4444" }}
            >
              {scenario.netChange > 0 ? "+" : ""}
              {scenario.netChange}
            </p>
            <p className="text-xs font-bold text-[var(--foreground)]">
              Net worker change
            </p>
            <p className="text-2xs text-[var(--muted)]">
              per 100 original workers
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md px-2 py-2 bg-black/[0.02] text-center">
              <p className="text-xl font-bold text-[var(--foreground)] tabular-nums">
                {scenario.demandUnits}%
              </p>
              <p className="text-[9px] text-[var(--muted)]">Demand vs. before</p>
            </div>
            <div className="rounded-md px-2 py-2 bg-black/[0.02] text-center">
              <p className="text-xl font-bold text-[var(--foreground)] tabular-nums">
                -{scenario.costReduction}%
              </p>
              <p className="text-[9px] text-[var(--muted)]">Cost per unit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Equation explanation */}
      {!compact && (
        <div className="mt-5 pt-4 border-t border-black/[0.06]">
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--foreground)]">How this works:</strong>{" "}
            AI reduces cost per unit of output by the productivity multiplier.
            Demand responds to lower prices based on elasticity (elasticity of 1.0
            means 10% lower price = 10% more demand). Net workforce = new demand
            divided by new output-per-worker. When elasticity &gt; 1 and productivity
            gains are large, the demand increase outweighs the per-worker efficiency
            gain, resulting in net job growth.
          </p>
        </div>
      )}
    </div>
  );
}
