"use client";

import type { IndustryMetrics } from "@/lib/signal-types";

interface IndustryCardProps {
  industry: IndustryMetrics;
  isExpanded: boolean;
  onToggle: () => void;
}

function getHeatBg(growth: number): string {
  if (growth <= 0) return "rgba(220, 38, 38, 0.06)";
  if (growth <= 0.05) return "rgba(22, 163, 74, 0.06)";
  if (growth <= 0.10) return "rgba(22, 163, 74, 0.08)";
  if (growth <= 0.20) return "rgba(22, 163, 74, 0.10)";
  if (growth <= 0.40) return "rgba(22, 163, 74, 0.14)";
  return "rgba(22, 163, 74, 0.18)";
}

function formatEmployment(val: number | null): string {
  if (val === null) return "No data";
  const pct = (val * 100).toFixed(1);
  return `${val >= 0 ? "+" : ""}${pct}%`;
}

function employmentColor(val: number | null): string {
  if (val === null) return "var(--muted)";
  if (val > 0.02) return "#16a34a";
  if (val < -0.02) return "#dc2626";
  return "var(--muted)";
}

export default function IndustryCard({
  industry,
  isExpanded,
  onToggle,
}: IndustryCardProps) {
  const growth = industry.toolGrowth3m;
  const heatWidth = Math.min(Math.max(growth * 100, 0), 100);

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-xl border p-4 sm:p-5 transition-all hover:border-black/[0.12] ${
        isExpanded
          ? "border-black/[0.12] bg-white shadow-sm"
          : "border-black/[0.06] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: industry.color }}
          />
          <h3 className="text-[15px] sm:text-[17px] font-bold text-[var(--foreground)]">
            {industry.label}
          </h3>
        </div>
        <span className="text-[12px] text-[var(--muted)] shrink-0 mt-0.5">
          {isExpanded ? "\u25B2" : "\u25BC"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {/* AI tool growth */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-0.5">
            AI tool growth
          </p>
          <p
            className="text-[22px] sm:text-[26px] font-black stat-number leading-none"
            style={{
              color: growth > 0 ? "#16a34a" : growth < 0 ? "#dc2626" : "var(--muted)",
            }}
          >
            {growth >= 0 ? "+" : ""}
            {(growth * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-[var(--muted)] mt-0.5">3-month avg</p>
        </div>

        {/* Employment trend */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-0.5">
            Employment (BLS)
          </p>
          <p
            className="text-[22px] sm:text-[26px] font-black stat-number leading-none"
            style={{
              color: employmentColor(industry.employmentChangeSinceNov2022),
            }}
          >
            {formatEmployment(industry.employmentChangeSinceNov2022)}
          </p>
          <p className="text-[10px] text-[var(--muted)] mt-0.5">
            vs late 2022
          </p>
        </div>
      </div>

      {/* Heat bar */}
      <div className="mt-3 h-1.5 rounded-full bg-black/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${heatWidth}%`,
            background: `linear-gradient(to right, #bbf7d0, #16a34a)`,
            opacity: 0.7,
          }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--muted)]">
        <span>
          {industry.toolCount} tool{industry.toolCount !== 1 ? "s" : ""} tracked
        </span>
        {industry.surgingCount > 0 && (
          <span
            className="font-semibold px-1.5 py-0.5 rounded-full text-[10px]"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#d97706",
            }}
          >
            {industry.surgingCount} surging
          </span>
        )}
      </div>
    </button>
  );
}
