"use client";

import { useState } from "react";
import type { PackageMetrics, SignalTaxonomy } from "@/lib/signal-types";

interface PackageTableProps {
  packages: PackageMetrics[];
  taxonomy: SignalTaxonomy;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
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

const COLUMNS = [
  { key: "package", label: "Tool", sortable: true },
  { key: "industry", label: "Industry", sortable: false },
  { key: "source", label: "Type", sortable: true },
  { key: "latestMonthlyDownloads", label: "Monthly Usage", sortable: true },
  { key: "momGrowth", label: "Monthly Change", sortable: true },
  { key: "rollingAvg3mGrowth", label: "3-Month Trend", sortable: true },
  { key: "sparkline", label: "Trend", sortable: false },
];

export default function PackageTable({
  packages,
  taxonomy,
  sortField,
  sortDirection,
  onSort,
}: PackageTableProps) {
  const [showTier1, setShowTier1] = useState(false);

  const filtered = showTier1
    ? packages
    : packages.filter((p) => p.tier === "tier2");

  const sorted = [...filtered].sort((a, b) => {
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

  return (
    <div>
      {/* Tier 1 toggle */}
      <div className="flex items-center gap-2 mb-3">
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
          ({packages.filter((p) => p.tier === "tier1").length} packages)
        </span>
      </div>

      <div className="rounded-xl border border-black/[0.06] bg-white overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/[0.06]">
              {COLUMNS.map((col) => (
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
            {sorted.map((pkg) => (
              <tr
                key={pkg.package}
                className={`border-b border-black/[0.03] hover:bg-black/[0.015] transition-colors ${
                  pkg.tier === "tier1" ? "opacity-60" : ""
                }`}
              >
                {/* Tool */}
                <td className="px-4 py-2.5">
                  <div>
                    <span className="text-[13px] font-semibold text-[var(--foreground)]">
                      {pkg.package}
                    </span>
                    {pkg.isSurging && (
                      <span
                        className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
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
                  </div>
                </td>

                {/* Industry tags */}
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {pkg.industries.length > 0 ? (
                      pkg.industries.map((ind) => {
                        const config = taxonomy.industries[ind];
                        return (
                          <span
                            key={ind}
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md whitespace-nowrap"
                            style={{
                              backgroundColor: `${config?.color ?? "#6b7280"}15`,
                              color: config?.color ?? "#6b7280",
                            }}
                          >
                            {config?.label ?? ind}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[10px] text-[var(--muted)] italic">
                        Baseline
                      </span>
                    )}
                  </div>
                </td>

                {/* Type (Python/JS) */}
                <td className="px-4 py-2.5">
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
                <td className="px-4 py-2.5 text-[13px] font-mono font-medium text-[var(--foreground)] stat-number">
                  {formatDownloads(pkg.latestMonthlyDownloads)}
                </td>

                {/* Monthly Change */}
                <td
                  className="px-4 py-2.5 text-[13px] font-mono font-medium stat-number"
                  style={{ color: growthColor(pkg.momGrowth) }}
                >
                  {pkg.momGrowth >= 0 ? "+" : ""}
                  {(pkg.momGrowth * 100).toFixed(1)}%
                </td>

                {/* 3-Month Trend */}
                <td
                  className="px-4 py-2.5 text-[13px] font-mono font-medium stat-number"
                  style={{ color: growthColor(pkg.rollingAvg3mGrowth) }}
                >
                  {pkg.rollingAvg3mGrowth >= 0 ? "+" : ""}
                  {(pkg.rollingAvg3mGrowth * 100).toFixed(1)}%
                </td>

                {/* Sparkline */}
                <td className="px-4 py-2.5">
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
