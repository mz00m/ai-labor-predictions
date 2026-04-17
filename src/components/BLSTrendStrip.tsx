"use client";

import { useState } from "react";
import type { BlsTrend } from "@/lib/bls-trends";

function formatChange(value: number | null): string {
  if (value === null) return "N/A";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function changeColor(value: number | null): string {
  if (value === null) return "text-[var(--muted)]";
  if (value > 0.5) return "text-emerald-600";
  if (value < -0.5) return "text-red-500";
  return "text-[var(--muted)]";
}

function formatAsOf(month: string): string {
  if (!month) return "";
  const [y, m] = month.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function BLSTrendStrip({ trend }: { trend: BlsTrend }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 mb-1">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="w-full text-left"
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <svg
            className="w-3 h-3 text-[var(--muted)] opacity-50 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v18h18" />
            <path d="M7 16l4-8 4 4 4-6" />
          </svg>
          <span className="text-2xs font-semibold uppercase tracking-wider text-[var(--muted)] opacity-60">
            BLS Employment
          </span>
          <span className="text-2xs text-[var(--muted)] opacity-40">
            {trend.label}
          </span>
          <svg
            className={`w-2.5 h-2.5 text-[var(--muted)] opacity-40 transition-transform duration-150 ml-auto ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="inline-flex items-baseline gap-1">
            <span className="text-2xs text-[var(--muted)] opacity-50">36mo</span>
            <span className={`text-base font-bold tabular-nums ${changeColor(trend.m36)}`}>
              {formatChange(trend.m36)}
            </span>
          </span>
          <span className="text-[var(--muted)] opacity-20">|</span>
          <span className="inline-flex items-baseline gap-1">
            <span className="text-2xs text-[var(--muted)] opacity-50">12mo</span>
            <span className={`text-base font-bold tabular-nums ${changeColor(trend.m12)}`}>
              {formatChange(trend.m12)}
            </span>
          </span>
          <span className="text-[var(--muted)] opacity-20">|</span>
          <span className="inline-flex items-baseline gap-1">
            <span className="text-2xs text-[var(--muted)] opacity-50">3mo</span>
            <span className={`text-base font-bold tabular-nums ${changeColor(trend.m3)}`}>
              {formatChange(trend.m3)}
            </span>
          </span>
        </div>
      </button>

      <div
        className="bls-expand"
        style={{
          maxHeight: expanded ? 120 : 0,
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="mt-2 text-xs text-[var(--muted)] opacity-60 leading-relaxed border-l-2 border-card pl-3 space-y-1">
          <p>
            % change in nonfarm payroll employment (BLS Current Employment Statistics, seasonally adjusted).
            {trend.seriesNames.length > 1 && (
              <> Average of {trend.seriesNames.length} series: {trend.seriesNames.join(", ")}.</>
            )}
            {trend.seriesNames.length === 1 && (
              <> Series: {trend.seriesNames[0]}.</>
            )}
          </p>
          <p>As of {formatAsOf(trend.asOf)}.</p>
        </div>
      </div>
    </div>
  );
}
