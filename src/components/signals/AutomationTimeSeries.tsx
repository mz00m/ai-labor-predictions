"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import type { MonthlyDownloadsData, PyPITaxonomy } from "@/lib/pypi-types";

type ViewMode = "absolute" | "growth" | "normalized";

interface AutomationTimeSeriesProps {
  downloads: MonthlyDownloadsData;
  taxonomy: PyPITaxonomy;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const VIEW_LABELS: Record<ViewMode, string> = {
  absolute: "Downloads",
  growth: "Growth Rate",
  normalized: "Normalized",
};

// Distinct colors for the lines
const LINE_COLORS = [
  "#5C61F6", "#F66B5C", "#16a34a", "#d97706", "#dc2626",
  "#0891b2", "#7c3aed", "#ea580c", "#2563eb", "#65a30d",
  "#db2777", "#14b8a6", "#8b5cf6", "#f59e0b", "#06b6d4",
  "#e11d48",
];

function formatDownloads(val: number): string {
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toString();
}

function CustomTooltip({
  active,
  payload,
  label,
  viewMode,
}: TooltipProps<number, string> & { viewMode: ViewMode }) {
  if (!active || !payload || payload.length === 0) return null;

  const visiblePayload = payload.filter(
    (p) => p.value !== undefined && p.value !== null
  );
  if (visiblePayload.length === 0) return null;

  return (
    <div className="bg-white border border-black/[0.08] rounded-lg p-3 max-w-xs shadow-sm">
      <p className="text-[12px] font-medium text-[var(--foreground)] mb-2">
        {label}
      </p>
      <div className="space-y-1">
        {visiblePayload
          .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
          .slice(0, 8)
          .map((entry) => (
            <div
              key={entry.dataKey}
              className="flex items-center justify-between gap-4 text-[11px]"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[var(--muted)] truncate max-w-[120px]">
                  {entry.dataKey}
                </span>
              </div>
              <span className="font-mono font-medium text-[var(--foreground)]">
                {viewMode === "absolute"
                  ? formatDownloads(entry.value as number)
                  : viewMode === "growth"
                    ? `${((entry.value as number) * 100).toFixed(1)}%`
                    : (entry.value as number).toFixed(0)}
              </span>
            </div>
          ))}
        {visiblePayload.length > 8 && (
          <p className="text-[10px] text-[var(--muted)]">
            +{visiblePayload.length - 8} more
          </p>
        )}
      </div>
    </div>
  );
}

export default function AutomationTimeSeries({
  downloads,
  taxonomy,
  viewMode,
  onViewModeChange,
}: AutomationTimeSeriesProps) {
  // Only show tier2 and tier3 packages in the chart
  const automationPackages = useMemo(() => {
    const tier2or3 = new Set(
      taxonomy.packages
        .filter((p) => p.tier === "tier2" || p.tier === "tier3")
        .map((p) => p.name)
    );
    return downloads.packages.filter((p) => tier2or3.has(p.package));
  }, [downloads, taxonomy]);

  const [hiddenPackages, setHiddenPackages] = useState<Set<string>>(new Set());

  const togglePackage = (name: string) => {
    setHiddenPackages((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  // Transform data for Recharts
  const chartData = useMemo(() => {
    // Gather all months
    const monthSet = new Set<string>();
    for (const pkg of automationPackages) {
      for (const d of pkg.data) monthSet.add(d.month);
    }
    const months = Array.from(monthSet).sort();

    // Build per-package monthly map
    const pkgMap: Record<string, Record<string, number>> = {};
    for (const pkg of automationPackages) {
      pkgMap[pkg.package] = {};
      for (const d of pkg.data) {
        pkgMap[pkg.package][d.month] = d.downloads;
      }
    }

    return months.map((month, idx) => {
      const point: Record<string, string | number | undefined> = { month };
      for (const pkg of automationPackages) {
        if (hiddenPackages.has(pkg.package)) continue;
        const val = pkgMap[pkg.package]?.[month];

        if (viewMode === "absolute") {
          point[pkg.package] = val;
        } else if (viewMode === "growth") {
          if (idx === 0) {
            point[pkg.package] = undefined;
          } else {
            const prevMonth = months[idx - 1];
            const prevVal = pkgMap[pkg.package]?.[prevMonth];
            if (prevVal && prevVal > 0 && val !== undefined) {
              point[pkg.package] = (val - prevVal) / prevVal;
            }
          }
        } else {
          // normalized: index = 100 at first month
          const firstVal = pkgMap[pkg.package]?.[months[0]];
          if (firstVal && firstVal > 0 && val !== undefined) {
            point[pkg.package] = (val / firstVal) * 100;
          }
        }
      }
      return point;
    });
  }, [automationPackages, viewMode, hiddenPackages]);

  // Color mapping
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    automationPackages.forEach((pkg, i) => {
      map[pkg.package] = LINE_COLORS[i % LINE_COLORS.length];
    });
    return map;
  }, [automationPackages]);

  const yTickFormatter = (val: number) => {
    if (viewMode === "absolute") return formatDownloads(val);
    if (viewMode === "growth") return `${(val * 100).toFixed(0)}%`;
    return val.toFixed(0);
  };

  return (
    <div>
      {/* View mode toggle */}
      <div className="flex gap-1 mb-4">
        {(Object.keys(VIEW_LABELS) as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
              viewMode === mode
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)] hover:bg-black/[0.04]"
            }`}
          >
            {VIEW_LABELS[mode]}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-black/[0.06] bg-white p-4">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={yTickFormatter}
              width={60}
            />
            <Tooltip
              content={<CustomTooltip viewMode={viewMode} />}
              cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
            />
            {automationPackages
              .filter((p) => !hiddenPackages.has(p.package))
              .map((pkg) => (
                <Line
                  key={pkg.package}
                  type="monotone"
                  dataKey={pkg.package}
                  stroke={colorMap[pkg.package]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
        {automationPackages.map((pkg) => {
          const isHidden = hiddenPackages.has(pkg.package);
          return (
            <button
              key={pkg.package}
              onClick={() => togglePackage(pkg.package)}
              className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded transition-opacity ${
                isHidden ? "opacity-30" : "opacity-100"
              } hover:bg-black/[0.03]`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: colorMap[pkg.package] }}
              />
              <span className="text-[var(--muted)]">{pkg.package}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
