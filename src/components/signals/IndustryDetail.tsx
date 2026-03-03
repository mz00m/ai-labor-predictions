"use client";

import { useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import type {
  IndustryMetrics,
  SignalTaxonomy,
  SignalMetrics,
  MonthlyDownloadsData,
  BLSEmploymentData,
  HuggingFaceData,
} from "@/lib/signal-types";

interface IndustryDetailProps {
  industry: IndustryMetrics;
  taxonomy: SignalTaxonomy;
  metrics: SignalMetrics;
  downloads: MonthlyDownloadsData;
  bls: BLSEmploymentData;
  huggingface: HuggingFaceData;
}

function formatDownloads(val: number): string {
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toString();
}

function growthColor(val: number): string {
  if (val > 0.05) return "#16a34a";
  if (val < -0.05) return "#dc2626";
  return "var(--foreground)";
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const padding = 2;

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (w - padding * 2);
      const y = h - padding - ((v - min) / range) * (h - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const EVENT_LINES = [
  { month: "2022-11", label: "ChatGPT" },
  { month: "2023-03", label: "GPT-4" },
  { month: "2024-03", label: "Claude 3" },
];

function DetailTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-black/[0.08] rounded-lg p-3 shadow-sm text-[12px]">
      <p className="font-medium text-[var(--foreground)] mb-1.5">{label}</p>
      {payload.map((entry) => {
        const val = entry.value as number;
        const change = val - 100;
        const sign = change >= 0 ? "+" : "";
        return (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[var(--muted)]">{entry.name}</span>
            </div>
            <span className="font-mono font-medium text-[var(--foreground)]">
              {sign}{change.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function IndustryDetail({
  industry,
  taxonomy,
  metrics,
  downloads,
  bls,
  huggingface,
}: IndustryDetailProps) {
  const industryConfig = taxonomy.industries[industry.industry];

  // Get packages for this industry
  const industryPackages = useMemo(() => {
    return metrics.packages.filter(
      (p) => p.tier === "tier2" && p.industries.includes(industry.industry)
    );
  }, [metrics.packages, industry.industry]);

  // Build dual-axis chart data: tool downloads + BLS employment, both normalized to 100 at Nov 2022
  const chartData = useMemo(() => {
    // Aggregate tool downloads for this industry by month
    const toolMonthly: Record<string, number> = {};
    for (const dl of downloads.packages) {
      const pkgConfig = taxonomy.packages.find((p) => p.name === dl.package);
      if (!pkgConfig || pkgConfig.tier !== "tier2") continue;
      if (!pkgConfig.industries.includes(industry.industry)) continue;
      for (const d of dl.data) {
        toolMonthly[d.month] = (toolMonthly[d.month] || 0) + d.downloads;
      }
    }

    // Aggregate BLS employment for this industry by month
    const blsMonthly: Record<string, number> = {};
    const blsSeriesIds = new Set(
      industryConfig?.blsSeries?.map((s) => s.id) || []
    );
    for (const series of bls.series) {
      if (!blsSeriesIds.has(series.id)) continue;
      if (series.data.length === 0) continue;
      for (const d of series.data) {
        // Average across series for this industry
        if (!blsMonthly[d.month]) blsMonthly[d.month] = 0;
        blsMonthly[d.month] += d.value;
      }
    }
    // Divide by number of series with data
    const activeSeries = bls.series.filter(
      (s) => blsSeriesIds.has(s.id) && s.data.length > 0
    ).length;
    if (activeSeries > 0) {
      for (const month of Object.keys(blsMonthly)) {
        blsMonthly[month] /= activeSeries;
      }
    }

    // Normalize to 100 at Nov 2022
    const toolBase = toolMonthly["2022-11"] || toolMonthly[Object.keys(toolMonthly).sort()[0]];
    const blsBase = blsMonthly["2022-11"] || blsMonthly[Object.keys(blsMonthly).sort()[0]];

    // Get all months
    const allMonths = new Set([
      ...Object.keys(toolMonthly),
      ...Object.keys(blsMonthly),
    ]);
    const sortedMonths = Array.from(allMonths).sort();

    return sortedMonths.map((month) => ({
      month,
      toolAdoption:
        toolBase && toolMonthly[month]
          ? (toolMonthly[month] / toolBase) * 100
          : undefined,
      employment:
        blsBase && blsMonthly[month]
          ? (blsMonthly[month] / blsBase) * 100
          : undefined,
    }));
  }, [downloads, bls, taxonomy, industry.industry, industryConfig]);

  return (
    <div className="mt-3 rounded-xl border border-black/[0.06] bg-white p-4 sm:p-6">
      {/* Explainer */}
      <div className="mb-6 p-4 rounded-lg bg-black/[0.02] border border-black/[0.04]">
        <p className="text-[13px] font-semibold text-[var(--foreground)] mb-1">
          What this means
        </p>
        <p className="text-[13px] text-[var(--muted)] leading-relaxed">
          {industryConfig?.explainer}
        </p>
      </div>

      {/* Dual-axis chart */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-0.5 rounded-full"
              style={{ backgroundColor: industry.color }}
            />
            <span className="text-[11px] text-[var(--muted)]">
              Tool adoption (left axis)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#94a3b8]" />
            <span className="text-[11px] text-[var(--muted)]">
              Employment / BLS (right axis)
            </span>
          </div>
          <span className="text-[10px] text-[var(--muted)] ml-auto">
            Indexed to 0% at Nov 2022
          </span>
        </div>

        <div className="rounded-lg border border-black/[0.04] p-3">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 50, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="tool"
                orientation="left"
                tick={{ fontSize: 10, fill: industry.color }}
                tickLine={false}
                axisLine={false}
                width={50}
                tickFormatter={(v: number) => {
                  const change = v - 100;
                  return `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
                }}
              />
              <YAxis
                yAxisId="employment"
                orientation="right"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                width={50}
                tickFormatter={(v: number) => {
                  const change = v - 100;
                  return `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
                }}
              />
              <ReferenceLine
                yAxisId="tool"
                y={100}
                stroke="#d1d5db"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              <Tooltip content={<DetailTooltip />} />
              {EVENT_LINES.map((evt) => (
                <ReferenceLine
                  key={evt.month}
                  yAxisId="tool"
                  x={evt.month}
                  stroke="#d1d5db"
                  strokeDasharray="3 3"
                  label={{
                    value: evt.label,
                    position: "top",
                    fontSize: 9,
                    fill: "#9ca3af",
                  }}
                />
              ))}
              <Line
                yAxisId="tool"
                type="monotone"
                dataKey="toolAdoption"
                name="Tool adoption"
                stroke={industry.color}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="employment"
                type="monotone"
                dataKey="employment"
                name="Employment (BLS)"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HuggingFace corroborating signals */}
      {huggingface.categories.filter((c) =>
        c.industries.includes(industry.industry)
      ).length > 0 && (
        <div className="mb-6">
          <h4 className="text-[14px] font-bold text-[var(--foreground)] mb-3">
            HuggingFace Model Activity
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {huggingface.categories
              .filter((c) => c.industries.includes(industry.industry))
              .map((cat) => (
                <div
                  key={cat.pipelineTag}
                  className="rounded-lg border border-black/[0.04] p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-[var(--foreground)]">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-[var(--muted)]">
                      {cat.modelCount} models tracked
                    </span>
                  </div>
                  <div className="text-[20px] font-bold font-mono text-[var(--foreground)] stat-number">
                    {formatDownloads(cat.totalDownloads)}
                    <span className="text-[11px] font-normal text-[var(--muted)] ml-1">
                      downloads
                    </span>
                  </div>
                  {cat.models.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {cat.models.slice(0, 3).map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between text-[10px]"
                        >
                          <span className="text-[var(--muted)] truncate mr-2">
                            {m.id}
                          </span>
                          <span className="font-mono text-[var(--foreground)] stat-number shrink-0">
                            {formatDownloads(m.downloads)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tool breakdown table */}
      <div>
        <h4 className="text-[14px] font-bold text-[var(--foreground)] mb-3">
          Tools in {industry.label}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] px-3 py-2">
                  Tool
                </th>
                <th className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] px-3 py-2">
                  Type
                </th>
                <th className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] px-3 py-2">
                  Monthly Usage
                </th>
                <th className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] px-3 py-2">
                  Monthly Change
                </th>
                <th className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] px-3 py-2">
                  3M Trend
                </th>
                <th className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] px-3 py-2">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {[...industryPackages]
                .sort(
                  (a, b) =>
                    b.latestMonthlyDownloads - a.latestMonthlyDownloads
                )
                .map((pkg) => {
                  const otherIndustries = pkg.industries
                    .filter((i) => i !== industry.industry)
                    .map(
                      (i) =>
                        taxonomy.industries[i]?.label || i
                    );

                  return (
                    <tr
                      key={pkg.package}
                      className="border-b border-black/[0.03] hover:bg-black/[0.015]"
                    >
                      <td className="px-3 py-2">
                        <div>
                          <span className="text-[12px] font-semibold text-[var(--foreground)]">
                            {pkg.package}
                          </span>
                          {pkg.isSurging && (
                            <span
                              className="ml-1.5 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor: "rgba(245, 158, 11, 0.12)",
                                color: "#d97706",
                              }}
                            >
                              Surging
                            </span>
                          )}
                          <p className="text-[10px] text-[var(--muted)] leading-tight mt-0.5">
                            {pkg.label}
                          </p>
                          {otherIndustries.length > 0 && (
                            <p className="text-[9px] text-[var(--accent)] mt-0.5">
                              Also in: {otherIndustries.join(", ")}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            pkg.source === "npm"
                              ? "bg-[#cb3837]/10 text-[#cb3837]"
                              : "bg-[#3776AB]/10 text-[#3776AB]"
                          }`}
                        >
                          {pkg.source === "npm" ? "JS" : "Python"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[12px] font-mono font-medium text-[var(--foreground)] stat-number">
                        {formatDownloads(pkg.latestMonthlyDownloads)}
                      </td>
                      <td
                        className="px-3 py-2 text-[12px] font-mono font-medium stat-number"
                        style={{ color: growthColor(pkg.momGrowth) }}
                      >
                        {pkg.momGrowth >= 0 ? "+" : ""}
                        {(pkg.momGrowth * 100).toFixed(1)}%
                      </td>
                      <td
                        className="px-3 py-2 text-[12px] font-mono font-medium stat-number"
                        style={{ color: growthColor(pkg.rollingAvg3mGrowth) }}
                      >
                        {pkg.rollingAvg3mGrowth >= 0 ? "+" : ""}
                        {(pkg.rollingAvg3mGrowth * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-2">
                        <Sparkline
                          data={pkg.sparkline}
                          color={
                            pkg.rollingAvg3mGrowth > 0.05
                              ? "#16a34a"
                              : pkg.rollingAvg3mGrowth < -0.05
                                ? "#dc2626"
                                : "#6b7280"
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
