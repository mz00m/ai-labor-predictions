"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
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
  if (val > 0) return "#16a34a";
  if (val < 0) return "#dc2626";
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

function ToolAdoptionTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const val = payload[0]?.value as number;
  return (
    <div className="bg-white border border-black/[0.08] rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="text-[var(--muted)] mb-0.5">{label}</p>
      <p className="font-mono font-medium text-[var(--foreground)]">
        {formatDownloads(val)} downloads
      </p>
    </div>
  );
}

function EmploymentTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const val = payload[0]?.value as number;
  return (
    <div className="bg-white border border-black/[0.08] rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="text-[var(--muted)] mb-0.5">{label}</p>
      <p className="font-mono font-medium text-[var(--foreground)]">
        {val.toLocaleString(undefined, { maximumFractionDigits: 1 })}K jobs
      </p>
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

  // Aggregate tool downloads for this industry by month
  const toolAdoptionData = useMemo(() => {
    const toolMonthly: Record<string, number> = {};
    let packageCount = 0;

    for (const dl of downloads.packages) {
      const pkgConfig = taxonomy.packages.find((p) => p.name === dl.package);
      if (!pkgConfig || pkgConfig.tier !== "tier2") continue;
      if (!pkgConfig.industries.includes(industry.industry)) continue;
      packageCount++;
      for (const d of dl.data) {
        toolMonthly[d.month] = (toolMonthly[d.month] || 0) + d.downloads;
      }
    }

    const sortedMonths = Object.keys(toolMonthly).sort();
    if (sortedMonths.length === 0)
      return { data: [] as { month: string; downloads: number }[], packageCount: 0, current: 0, baselineMonth: "", delta: 0 };

    const data = sortedMonths.map((month) => ({
      month,
      downloads: toolMonthly[month],
    }));

    const current = data[data.length - 1].downloads;
    const baseline = data[0].downloads;
    const baselineMonth = data[0].month;
    const delta = baseline > 0 ? ((current - baseline) / baseline) * 100 : 0;

    return { data, packageCount, current, baselineMonth, delta };
  }, [downloads, taxonomy, industry.industry]);

  // Per-series BLS employment data with 3-month trailing average
  const employmentSeriesData = useMemo(() => {
    const blsSeriesConfigs = industryConfig?.blsSeries || [];

    return blsSeriesConfigs.map((seriesConfig) => {
      const seriesData = bls.series.find((s) => s.id === seriesConfig.id);
      if (!seriesData || seriesData.data.length === 0) {
        return { id: seriesConfig.id, name: seriesConfig.name, data: [] as { month: string; value: number }[], current: 0, baseline: 0, delta: 0 };
      }

      const sorted = [...seriesData.data].sort((a, b) =>
        a.month.localeCompare(b.month)
      );

      // Compute 3-month trailing average
      const withAvg = sorted.map((d, i) => {
        const window = sorted.slice(Math.max(0, i - 2), i + 1);
        const avg = window.reduce((s, w) => s + w.value, 0) / window.length;
        return { month: d.month, value: d.value, avg3m: avg };
      });

      // Baseline: average of Oct, Nov, Dec 2022
      const baselineMonths = withAvg.filter((d) =>
        ["2022-10", "2022-11", "2022-12"].includes(d.month)
      );
      const baseline =
        baselineMonths.length > 0
          ? baselineMonths.reduce((s, d) => s + d.value, 0) /
            baselineMonths.length
          : 0;

      // Filter to Nov 2022 onwards
      const filtered = withAvg.filter((d) => d.month >= "2022-11");

      // Current value and delta
      const current =
        filtered.length > 0 ? filtered[filtered.length - 1].avg3m : 0;
      const delta =
        baseline > 0 ? ((current - baseline) / baseline) * 100 : 0;

      return {
        id: seriesConfig.id,
        name: seriesConfig.name,
        data: filtered.map((d) => ({ month: d.month, value: d.avg3m })),
        current,
        baseline,
        delta,
      };
    });
  }, [bls, industryConfig]);

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

      {/* Sparkline cards: Tool Adoption + Employment */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Tool Adoption */}
        <div className="rounded-lg border border-black/[0.04] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-2">
            AI Tool Adoption
          </p>

          {toolAdoptionData.data.length > 0 ? (
            <>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[22px] font-black font-mono text-[var(--foreground)] stat-number">
                  {formatDownloads(toolAdoptionData.current)}
                </span>
                <span className="text-[11px] text-[var(--muted)]">/ month</span>
              </div>

              <div className="flex items-center gap-1 mb-3">
                <span
                  className="text-[12px] font-mono font-medium"
                  style={{ color: growthColor(toolAdoptionData.delta) }}
                >
                  {toolAdoptionData.delta >= 0 ? "\u25B2" : "\u25BC"}
                  {toolAdoptionData.delta >= 0 ? "+" : ""}
                  {toolAdoptionData.delta.toFixed(1)}%
                </span>
                <span className="text-[10px] text-[var(--muted)]">
                  since {toolAdoptionData.baselineMonth}
                </span>
              </div>

              <ResponsiveContainer width="100%" height={120}>
                <AreaChart
                  data={toolAdoptionData.data}
                  margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={`toolGrad-${industry.industry}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={industry.color}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={industry.color}
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" hide />
                  <YAxis hide domain={["dataMin", "dataMax"]} />
                  <Tooltip content={<ToolAdoptionTooltip />} />
                  {EVENT_LINES.filter((evt) =>
                    toolAdoptionData.data.some((d) => d.month === evt.month)
                  ).map((evt) => (
                    <ReferenceLine
                      key={evt.month}
                      x={evt.month}
                      stroke="#d1d5db"
                      strokeDasharray="3 3"
                      label={{
                        value: evt.label,
                        position: "top",
                        fontSize: 8,
                        fill: "#9ca3af",
                      }}
                    />
                  ))}
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke={industry.color}
                    strokeWidth={1.5}
                    fill={`url(#toolGrad-${industry.industry})`}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <p className="text-[10px] text-[var(--muted)] mt-2 leading-snug opacity-70">
                Aggregate monthly downloads of {toolAdoptionData.packageCount}{" "}
                industry-specific tools
              </p>
            </>
          ) : (
            <p className="text-[12px] text-[var(--muted)] py-8 text-center">
              No download data available
            </p>
          )}
        </div>

        {/* Card 2: Employment per BLS series */}
        {employmentSeriesData.length > 0 && (
          <div className="rounded-lg border border-black/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-3">
              Employment in AI-Exposed Sectors
            </p>

            <div className="space-y-4">
              {employmentSeriesData.map((series) =>
                series.data.length > 0 ? (
                  <div key={series.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="min-w-0">
                        <span className="text-[12px] font-semibold text-[var(--foreground)]">
                          {series.name}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--muted)] ml-1.5 opacity-60">
                          {series.id}
                        </span>
                      </div>
                      <span className="text-[14px] font-bold font-mono text-[var(--foreground)] stat-number shrink-0 ml-2">
                        {series.current.toFixed(1)}K
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <span
                        className="text-[11px] font-mono font-medium"
                        style={{ color: growthColor(series.delta) }}
                      >
                        {series.delta >= 0 ? "\u25B2" : "\u25BC"}
                        {series.delta >= 0 ? "+" : ""}
                        {series.delta.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-[var(--muted)]">
                        vs Oct&ndash;Dec 2022
                      </span>
                    </div>

                    <ResponsiveContainer width="100%" height={60}>
                      <AreaChart
                        data={series.data}
                        margin={{ top: 2, right: 2, left: 2, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id={`empGrad-${series.id}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#94a3b8"
                              stopOpacity={0.15}
                            />
                            <stop
                              offset="95%"
                              stopColor="#94a3b8"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" hide />
                        <YAxis hide domain={["dataMin", "dataMax"]} />
                        <Tooltip content={<EmploymentTooltip />} />
                        {EVENT_LINES.filter((evt) =>
                          series.data.some((d) => d.month === evt.month)
                        ).map((evt) => (
                          <ReferenceLine
                            key={evt.month}
                            x={evt.month}
                            stroke="#d1d5db"
                            strokeDasharray="2 2"
                          />
                        ))}
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#94a3b8"
                          strokeWidth={1.5}
                          fill={`url(#empGrad-${series.id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : null
              )}
            </div>

            <p className="text-[10px] text-[var(--muted)] mt-3 leading-snug opacity-70">
              <a
                href="https://www.bls.gov/ces/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--foreground)]"
              >
                BLS CES
              </a>
              , not seasonally adjusted. 3-month trailing average indexed to
              Oct&ndash;Dec 2022.
            </p>
          </div>
        )}
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
                            pkg.rollingAvg3mGrowth > 0
                              ? "#16a34a"
                              : pkg.rollingAvg3mGrowth < 0
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
