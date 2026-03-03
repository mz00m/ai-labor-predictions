"use client";

import { useState, useMemo } from "react";
import type { PackageMetrics, SignalTaxonomy } from "@/lib/signal-types";

interface PackageTableProps {
  packages: PackageMetrics[];
  taxonomy: SignalTaxonomy;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

function formatNumber(val: number): string {
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

const SORTABLE_COLUMNS = [
  { key: "package", label: "Tool", sortable: true },
  { key: "source", label: "Type", sortable: true },
  { key: "latestMonthlyDownloads", label: "Monthly Usage", sortable: true },
  { key: "momGrowth", label: "Monthly Change", sortable: true },
  { key: "rollingAvg3mGrowth", label: "3-Month Trend", sortable: true },
  { key: "sparkline", label: "Trend", sortable: false },
];

// Industry display order
const INDUSTRY_ORDER = [
  "software_it",
  "legal",
  "finance",
  "healthcare",
  "creative",
  "office",
];

interface IndustryGroup {
  industryKey: string;
  label: string;
  color: string;
  packages: PackageMetrics[];
}

function PackageRow({
  pkg,
  taxonomy,
  currentIndustry,
}: {
  pkg: PackageMetrics;
  taxonomy: SignalTaxonomy;
  currentIndustry: string;
}) {
  const otherIndustries = pkg.industries
    .filter((i) => i !== currentIndustry)
    .map((i) => taxonomy.industries[i]?.label || i);

  return (
    <tr className="border-b border-black/[0.03] hover:bg-black/[0.015] transition-colors">
      {/* Tool */}
      <td className="px-4 py-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-[var(--foreground)]">
              {pkg.package}
            </span>
            {pkg.isSurging && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.12)",
                  color: "#d97706",
                }}
              >
                Surging
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-snug mt-1 max-w-md">
            {pkg.label}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {pkg.githubStars != null && pkg.githubStars > 0 && (
              <span className="text-[10px] text-[var(--muted)] font-mono inline-flex items-center gap-0.5" title="GitHub stars">
                <span className="text-amber-500">&#9733;</span> {formatNumber(pkg.githubStars)}
              </span>
            )}
            {pkg.githubForks != null && pkg.githubForks > 0 && (
              <span className="text-[10px] text-[var(--muted)] font-mono inline-flex items-center gap-0.5" title="GitHub forks">
                <span className="text-[var(--muted)]">&#9906;</span> {formatNumber(pkg.githubForks)}
              </span>
            )}
            {pkg.githubWeeklyCommits != null && pkg.githubWeeklyCommits > 0 && (
              <span className="text-[10px] text-[var(--muted)] font-mono inline-flex items-center gap-0.5" title="Avg weekly commits (last 4 weeks)">
                <span className="text-blue-500">&#9998;</span> {Math.round(pkg.githubWeeklyCommits)}/wk
              </span>
            )}
            {pkg.githubMonthlyIssues != null && pkg.githubMonthlyIssues > 0 && (
              <span className="text-[10px] text-[var(--muted)] font-mono inline-flex items-center gap-0.5" title="Monthly GitHub issues">
                <span className="text-green-600">&#9679;</span> {pkg.githubMonthlyIssues} issues/mo
              </span>
            )}
            {pkg.soMonthlyQuestions != null && pkg.soMonthlyQuestions > 0 && (
              <span className="text-[10px] text-[var(--muted)] font-mono inline-flex items-center gap-0.5" title="Monthly StackOverflow questions">
                <span className="text-orange-500">Q</span> {pkg.soMonthlyQuestions} questions/mo
              </span>
            )}
            {pkg.signalQuality && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  pkg.signalQuality === "strong"
                    ? "bg-green-500/10 text-green-700"
                    : pkg.signalQuality === "moderate"
                      ? "bg-amber-500/10 text-amber-700"
                      : "bg-red-500/10 text-red-600"
                }`}
                title={
                  pkg.signalQuality === "strong"
                    ? "Low download-to-stars ratio — strong community signal"
                    : pkg.signalQuality === "moderate"
                      ? "Moderate download-to-stars ratio"
                      : "High download-to-stars ratio — likely CI/CD noise"
                }
              >
                {pkg.signalQuality === "strong"
                  ? "Strong signal"
                  : pkg.signalQuality === "moderate"
                    ? "Moderate signal"
                    : "Noisy signal"}
              </span>
            )}
            {otherIndustries.length > 0 && (
              <span className="text-[10px] text-[var(--accent)]">
                Also in: {otherIndustries.join(", ")}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Type (Python/JS) */}
      <td className="px-4 py-3">
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

      {/* Monthly Usage */}
      <td className="px-4 py-3 text-[13px] font-mono font-medium text-[var(--foreground)] stat-number">
        {formatNumber(pkg.latestMonthlyDownloads)}
      </td>

      {/* Monthly Change */}
      <td
        className="px-4 py-3 text-[13px] font-mono font-medium stat-number"
        style={{ color: growthColor(pkg.momGrowth) }}
      >
        {pkg.momGrowth >= 0 ? "+" : ""}
        {(pkg.momGrowth * 100).toFixed(1)}%
      </td>

      {/* 3-Month Trend */}
      <td
        className="px-4 py-3 text-[13px] font-mono font-medium stat-number"
        style={{ color: growthColor(pkg.rollingAvg3mGrowth) }}
      >
        {pkg.rollingAvg3mGrowth >= 0 ? "+" : ""}
        {(pkg.rollingAvg3mGrowth * 100).toFixed(1)}%
      </td>

      {/* Sparkline */}
      <td className="px-4 py-3">
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
}

export default function PackageTable({
  packages,
  taxonomy,
  sortField,
  sortDirection,
  onSort,
}: PackageTableProps) {
  const [showTier1, setShowTier1] = useState(false);

  // Group tier2 packages by their primary industry (first in their list)
  const industryGroups: IndustryGroup[] = useMemo(() => {
    const tier2 = packages.filter((p) => p.tier === "tier2");

    const groupMap: Record<string, PackageMetrics[]> = {};
    for (const pkg of tier2) {
      const primaryIndustry = pkg.industries[0] || "other";
      if (!groupMap[primaryIndustry]) groupMap[primaryIndustry] = [];
      groupMap[primaryIndustry].push(pkg);
    }

    // Sort packages within each group
    for (const key of Object.keys(groupMap)) {
      groupMap[key].sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[sortField];
        const bVal = (b as unknown as Record<string, unknown>)[sortField];
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        const aNum = (aVal as number) ?? 0;
        const bNum = (bVal as number) ?? 0;
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      });
    }

    return INDUSTRY_ORDER
      .filter((key) => groupMap[key] && groupMap[key].length > 0)
      .map((key) => ({
        industryKey: key,
        label: taxonomy.industries[key]?.label || key,
        color: taxonomy.industries[key]?.color || "#6b7280",
        packages: groupMap[key],
      }));
  }, [packages, taxonomy, sortField, sortDirection]);

  // Tier 1 baseline packages (sorted)
  const tier1Sorted = useMemo(() => {
    const tier1 = packages.filter((p) => p.tier === "tier1");
    return [...tier1].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField];
      const bVal = (b as unknown as Record<string, unknown>)[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      const aNum = (aVal as number) ?? 0;
      const bNum = (bVal as number) ?? 0;
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    });
  }, [packages, sortField, sortDirection]);

  return (
    <div>
      <div className="rounded-xl border border-black/[0.06] bg-white overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/[0.06]">
              {SORTABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] px-4 py-3 whitespace-nowrap ${
                    col.sortable
                      ? "cursor-pointer hover:text-[var(--foreground)]"
                      : ""
                  }`}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortField === col.key && (
                      <span className="text-[var(--accent)]">
                        {sortDirection === "asc" ? "\u2191" : "\u2193"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {industryGroups.map((group) => (
              <>
                {/* Industry section header */}
                <tr key={`header-${group.industryKey}`}>
                  <td
                    colSpan={6}
                    className="px-4 pt-6 pb-2 border-b border-black/[0.06]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="text-[15px] font-bold text-[var(--foreground)]">
                        {group.label}
                      </span>
                      <span className="text-[11px] text-[var(--muted)]">
                        {group.packages.length} tool
                        {group.packages.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>
                </tr>
                {group.packages.map((pkg) => (
                  <PackageRow
                    key={pkg.package}
                    pkg={pkg}
                    taxonomy={taxonomy}
                    currentIndustry={group.industryKey}
                  />
                ))}
              </>
            ))}

            {/* Tier 1 baseline section */}
            {showTier1 && (
              <>
                <tr key="header-baseline">
                  <td
                    colSpan={6}
                    className="px-4 pt-6 pb-2 border-b border-black/[0.06]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#9ca3af]" />
                      <span className="text-[15px] font-bold text-[var(--foreground)]">
                        AI Infrastructure Baseline
                      </span>
                      <span className="text-[11px] text-[var(--muted)]">
                        {tier1Sorted.length} package
                        {tier1Sorted.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--muted)] mt-1 ml-5 max-w-lg">
                      General-purpose AI SDKs and frameworks. We compare
                      industry-specific tool growth against this baseline to
                      calculate the Automation Acceleration Index.
                    </p>
                  </td>
                </tr>
                {tier1Sorted.map((pkg) => (
                  <tr
                    key={pkg.package}
                    className="border-b border-black/[0.03] hover:bg-black/[0.015] transition-colors opacity-60"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-semibold text-[var(--foreground)]">
                            {pkg.package}
                          </span>
                          {pkg.isSurging && (
                            <span
                              className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor: "rgba(245, 158, 11, 0.12)",
                                color: "#d97706",
                              }}
                            >
                              Surging
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--muted)] leading-snug mt-1 max-w-md">
                          {pkg.label}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-[13px] font-mono font-medium text-[var(--foreground)] stat-number">
                      {formatNumber(pkg.latestMonthlyDownloads)}
                    </td>
                    <td
                      className="px-4 py-3 text-[13px] font-mono font-medium stat-number"
                      style={{ color: growthColor(pkg.momGrowth) }}
                    >
                      {pkg.momGrowth >= 0 ? "+" : ""}
                      {(pkg.momGrowth * 100).toFixed(1)}%
                    </td>
                    <td
                      className="px-4 py-3 text-[13px] font-mono font-medium stat-number"
                      style={{ color: growthColor(pkg.rollingAvg3mGrowth) }}
                    >
                      {pkg.rollingAvg3mGrowth >= 0 ? "+" : ""}
                      {(pkg.rollingAvg3mGrowth * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
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
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Tier 1 toggle below table */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => setShowTier1(!showTier1)}
          className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors ${
            showTier1
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:bg-black/[0.04] border border-black/[0.08]"
          }`}
        >
          {showTier1 ? "Hide" : "Show"} AI infrastructure baseline
        </button>
        <span className="text-[11px] text-[var(--muted)]">
          ({tier1Sorted.length} packages)
        </span>
      </div>
    </div>
  );
}
