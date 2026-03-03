"use client";

import type { DomainMetrics } from "@/lib/pypi-types";

interface DomainHeatMapProps {
  domains: DomainMetrics[];
}

function getHeatBg(growth: number): string {
  if (growth <= -0.05) return "rgba(59, 130, 246, 0.10)";
  if (growth <= 0) return "rgba(59, 130, 246, 0.06)";
  if (growth <= 0.05) return "rgba(245, 158, 11, 0.06)";
  if (growth <= 0.10) return "rgba(245, 158, 11, 0.10)";
  if (growth <= 0.20) return "rgba(239, 68, 68, 0.08)";
  if (growth <= 0.40) return "rgba(239, 68, 68, 0.12)";
  return "rgba(239, 68, 68, 0.18)";
}

function getGrowthColor(growth: number): string {
  if (growth <= -0.05) return "#2563eb";
  if (growth <= 0) return "#6b7280";
  if (growth <= 0.10) return "#d97706";
  if (growth <= 0.20) return "#ea580c";
  return "#dc2626";
}

function formatDownloads(val: number): string {
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toString();
}

export default function DomainHeatMap({ domains }: DomainHeatMapProps) {
  const sorted = [...domains].sort((a, b) => b.avgGrowth3m - a.avgGrowth3m);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {sorted.map((domain) => (
        <div
          key={domain.domain}
          className="rounded-lg border border-black/[0.06] p-4 transition-colors hover:border-black/[0.12]"
          style={{ backgroundColor: getHeatBg(domain.avgGrowth3m) }}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="text-[13px] font-bold text-[var(--foreground)] leading-tight">
                {domain.label}
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {domain.packageCount} package{domain.packageCount !== 1 ? "s" : ""}
              </p>
            </div>
            <span
              className="inline-block w-2.5 h-2.5 rounded-full mt-1 shrink-0"
              style={{ backgroundColor: domain.color }}
            />
          </div>

          <p
            className="text-[28px] font-black stat-number leading-none"
            style={{ color: getGrowthColor(domain.avgGrowth3m) }}
          >
            {domain.avgGrowth3m >= 0 ? "+" : ""}
            {(domain.avgGrowth3m * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-[var(--muted)] mt-1">
            3-month avg growth
          </p>

          <div className="mt-3 pt-2 border-t border-black/[0.04]">
            <p className="text-[11px] text-[var(--muted)]">
              {formatDownloads(domain.totalDownloads)}/mo total
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
