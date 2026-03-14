"use client";

import { useMemo } from "react";
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
  type OccupationGroup,
} from "@/data/economy-occupations";

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as OccupationGroup & { employmentFormatted: string };
  const tierMeta = INCOME_TIER_META[d.incomeTier];
  const jobIds = SOC_TO_JOB_IDS[d.id] || [];
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

  const chartData = useMemo(() => {
    return [...OCCUPATION_GROUPS]
      .sort((a, b) => b.employment - a.employment)
      .map((g) => ({
        ...g,
        employmentM: Math.round(g.employment / 10) / 100, // millions
        hasJobs: (SOC_TO_JOB_IDS[g.id] || []).length > 0,
      }));
  }, []);

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
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-[28px] font-bold text-[var(--foreground)] tracking-tight">
            {(TOTAL_EMPLOYMENT / 1000).toFixed(1)}M
          </p>
          <p className="text-[11px] text-[var(--muted)]">Total US civilian workforce</p>
        </div>
        {(["low", "middle", "high"] as const).map((tier) => {
          const meta = INCOME_TIER_META[tier];
          return (
            <div key={tier} className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
              <p className="text-[28px] font-bold tracking-tight" style={{ color: meta.color }}>
                {(tierSummary[tier] / 1000).toFixed(1)}M
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                {meta.label} ({meta.range})
              </p>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div className="h-[520px]">
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
        {(["low", "middle", "high"] as const).map((tier) => (
          <div key={tier} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: INCOME_TIER_META[tier].color }}
            />
            <span className="text-[11px] text-[var(--muted)]">
              {INCOME_TIER_META[tier].label} ({INCOME_TIER_META[tier].range})
            </span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-3">
        Source: Bureau of Labor Statistics, Occupational Employment and Wage Statistics (OEWS), May 2024.
        Income tiers based on median annual wage for the occupation group.
      </p>
    </div>
  );
}
