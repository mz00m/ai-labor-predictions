"use client";

import type { PackageMetrics, PyPITaxonomy } from "@/lib/pypi-types";

interface PackageTableProps {
  packages: PackageMetrics[];
  taxonomy: PyPITaxonomy;
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
  { key: "package", label: "Package", sortable: true },
  { key: "domain", label: "Domain", sortable: true },
  { key: "latestMonthlyDownloads", label: "Downloads/mo", sortable: true },
  { key: "momGrowth", label: "MoM", sortable: true },
  { key: "rollingAvg3mGrowth", label: "3M Avg", sortable: true },
  { key: "sparkline", label: "Trend", sortable: false },
];

export default function PackageTable({
  packages,
  taxonomy,
  sortField,
  sortDirection,
  onSort,
}: PackageTableProps) {
  const domainLookup = taxonomy.domains;
  const tierLookup = taxonomy.tiers;
  const pkgLookup = Object.fromEntries(
    taxonomy.packages.map((p) => [p.name, p])
  );

  const sorted = [...packages].sort((a, b) => {
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
    <div className="rounded-xl border border-black/[0.06] bg-white overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-black/[0.06]">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] px-4 py-3 whitespace-nowrap ${
                  col.sortable ? "cursor-pointer hover:text-[var(--foreground)]" : ""
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
          {sorted.map((pkg) => {
            const config = pkgLookup[pkg.package];
            const domain = domainLookup[pkg.domain];
            const tier = tierLookup[pkg.tier];

            return (
              <tr
                key={pkg.package}
                className="border-b border-black/[0.03] hover:bg-black/[0.015] transition-colors"
              >
                {/* Package */}
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: tier?.color ?? "#6b7280" }}
                      title={tier?.label}
                    />
                    <div>
                      <span className="text-[13px] font-semibold text-[var(--foreground)]">
                        {pkg.package}
                      </span>
                      {pkg.isBreakout && (
                        <span
                          className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "rgba(245, 158, 11, 0.12)",
                            color: "#d97706",
                          }}
                        >
                          Breakout
                        </span>
                      )}
                      {config?.occupationalSignal && (
                        <p className="text-[10px] text-[var(--muted)] leading-tight mt-0.5">
                          {config.occupationalSignal}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Domain */}
                <td className="px-4 py-2.5">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${domain?.color ?? "#6b7280"}15`,
                      color: domain?.color ?? "#6b7280",
                    }}
                  >
                    {domain?.label ?? pkg.domain}
                  </span>
                </td>

                {/* Downloads */}
                <td className="px-4 py-2.5 text-[13px] font-mono font-medium text-[var(--foreground)] stat-number">
                  {formatDownloads(pkg.latestMonthlyDownloads)}
                </td>

                {/* MoM Growth */}
                <td
                  className="px-4 py-2.5 text-[13px] font-mono font-medium stat-number"
                  style={{ color: growthColor(pkg.momGrowth) }}
                >
                  {pkg.momGrowth >= 0 ? "+" : ""}
                  {(pkg.momGrowth * 100).toFixed(1)}%
                </td>

                {/* 3M Avg Growth */}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
