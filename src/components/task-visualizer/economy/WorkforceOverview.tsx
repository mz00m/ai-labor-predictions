"use client";

import { useMemo, useState } from "react";
import type { IncomeTier } from "@/data/economy-occupations";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";
import {
  OCCUPATION_GROUPS,
  INCOME_TIER_META,
  TOTAL_EMPLOYMENT,
  SOC_TO_JOB_IDS,
  EXPOSURE_UNCERTAINTY,
  SOC_EXPOSURE_SCORES,
  CFO_SURVEY_NEI,
  type OccupationGroup,
} from "@/data/economy-occupations";

function getUncertaintyLabel(variance: number): { label: string; color: string } {
  if (variance >= 0.5) return { label: "High", color: "#EF4444" };
  if (variance >= 0.3) return { label: "Moderate", color: "#F59E0B" };
  return { label: "Low", color: "#10B981" };
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as OccupationGroup & { employmentFormatted: string };
  const tierMeta = INCOME_TIER_META[d.incomeTier];
  const jobIds = SOC_TO_JOB_IDS[d.id] || [];
  const uncertainty = EXPOSURE_UNCERTAINTY[d.id];
  const neiData = CFO_SURVEY_NEI[d.id];
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3 max-w-[280px]">
      <p className="text-[13px] font-semibold text-[var(--foreground)]">{d.title}</p>
      <div className="mt-1.5 space-y-0.5 text-[12px]">
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Workers</span>
          <span className="font-medium">{(d.employment * 1000).toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Share of US workforce</span>
          <span className="font-medium">
            {((d.employment / TOTAL_EMPLOYMENT) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Median wage</span>
          <span className="font-medium">${d.medianWageHr.toFixed(2)}/hr (${(d.medianWageAnnual / 1000).toFixed(0)}K/yr)</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[var(--muted)]">Income tier</span>
          <span className="font-medium" style={{ color: tierMeta.color }}>
            {tierMeta.label}
          </span>
        </div>
        {(uncertainty || SOC_EXPOSURE_SCORES[d.id]) && (
          <div className="mt-1 pt-1 border-t border-black/[0.06] space-y-0.5">
            {SOC_EXPOSURE_SCORES[d.id] && (
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">AI exposure score</span>
                <span className="font-medium">
                  {SOC_EXPOSURE_SCORES[d.id].mean.toFixed(1)}/10
                  <span className="text-[var(--muted)] font-normal ml-1">
                    ({SOC_EXPOSURE_SCORES[d.id].min}-{SOC_EXPOSURE_SCORES[d.id].max})
                  </span>
                </span>
              </div>
            )}
            {uncertainty && (
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Metric agreement</span>
                <span className="font-medium" style={{ color: getUncertaintyLabel(uncertainty.variance).color }}>
                  {getUncertaintyLabel(uncertainty.variance).label}
                </span>
              </div>
            )}
            {neiData && (
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">CFO replace/enhance</span>
                <span className="font-medium" style={{ color: neiData.nei > 1 ? "#EF4444" : neiData.nei > 0.7 ? "#F59E0B" : "#10B981" }}>
                  {neiData.nei.toFixed(2)}x
                  <span className="text-[var(--muted)] font-normal ml-1">
                    ({neiData.label})
                  </span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {jobIds.length > 0 && (
        <p className="text-[10px] text-[var(--accent)] mt-2 pt-1.5 border-t border-black/[0.06]">
          Click to explore individual jobs in this group
        </p>
      )}
    </div>
  );
}

export default function WorkforceOverview() {
  const router = useRouter();
  const [selectedTiers, setSelectedTiers] = useState<Set<IncomeTier>>(
    () => new Set(["low", "middle", "high"] as IncomeTier[])
  );

  const toggleTier = (tier: IncomeTier) => {
    setSelectedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) {
        // Don't allow deselecting all — keep at least one
        if (next.size > 1) next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  };

  const allChartData = useMemo(() => {
    return [...OCCUPATION_GROUPS]
      .sort((a, b) => b.employment - a.employment)
      .map((g) => ({
        ...g,
        employmentM: Math.round(g.employment / 10) / 100, // millions
        hasJobs: (SOC_TO_JOB_IDS[g.id] || []).length > 0,
      }));
  }, []);

  const chartData = useMemo(() => {
    return allChartData.filter((g) => selectedTiers.has(g.incomeTier));
  }, [allChartData, selectedTiers]);

  const tierSummary = useMemo(() => {
    const tiers = { low: 0, middle: 0, high: 0 };
    for (const g of OCCUPATION_GROUPS) {
      tiers[g.incomeTier] += g.employment;
    }
    return tiers;
  }, []);

  return (
    <div>
      {/* Big stat */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
        <div className="stat-card-enter rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-[28px] font-bold text-[var(--foreground)] tracking-tight">
            {(TOTAL_EMPLOYMENT / 1000).toFixed(1)}M
          </p>
          <p className="text-[11px] text-[var(--muted)]">Total US civilian workforce</p>
        </div>
        {(["low", "middle", "high"] as const).map((tier) => {
          const meta = INCOME_TIER_META[tier];
          const isActive = selectedTiers.has(tier);
          return (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className="stat-card-toggle rounded-xl border p-4 text-left cursor-pointer"
              style={{
                backgroundColor: isActive ? `${meta.color}08` : "transparent",
                borderColor: isActive ? `${meta.color}40` : "rgba(0,0,0,0.06)",
                opacity: isActive ? 1 : 0.4,
              }}
            >
              <p className="text-[28px] font-bold tracking-tight" style={{ color: meta.color }}>
                {(tierSummary[tier] / 1000).toFixed(1)}M
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                {meta.label} ({meta.range})
              </p>
            </button>
          );
        })}
      </div>

      {/* Bar chart */}
      <div style={{ height: Math.max(200, chartData.length * 26 + 40) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            onClick={(state) => {
              if (!state?.activePayload?.[0]) return;
              const group = state.activePayload[0].payload as OccupationGroup & { hasJobs: boolean };
              const jobIds = SOC_TO_JOB_IDS[group.id] || [];
              if (jobIds.length > 0) {
                router.push(`/task-visualizer?job=${jobIds[0]}`);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => `${v}M`}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="shortTitle"
              width={150}
              tick={{ fontSize: 11, fill: "#1a1a1a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
            <Bar dataKey="employmentM" radius={[0, 4, 4, 0]} barSize={18} style={{ cursor: "pointer" }}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={INCOME_TIER_META[entry.incomeTier].color}
                  fillOpacity={entry.hasJobs ? 0.75 : 0.45}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-black/[0.06]">
        {(["low", "middle", "high"] as const).map((tier) => {
          const isActive = selectedTiers.has(tier);
          return (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className="flex items-center gap-1.5 cursor-pointer"
              style={{ opacity: isActive ? 1 : 0.35 }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: INCOME_TIER_META[tier].color }}
              />
              <span className="text-[11px] text-[var(--muted)]">
                {INCOME_TIER_META[tier].label} ({INCOME_TIER_META[tier].range})
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-3">
        Source: Bureau of Labor Statistics, Occupational Employment and Wage Statistics (OEWS), May 2024.
        Income tiers based on median annual wage for the occupation group.
        Exposure metric agreement from Yale Budget Lab (Gimbel et al., 2026), comparing 6 AI exposure measures across 778 occupations.
        CFO replace/enhance ratio from Baslandze et al. (2026), Federal Reserve Bank of Atlanta/Duke University survey of ~750 executives.
      </p>
    </div>
  );
}
