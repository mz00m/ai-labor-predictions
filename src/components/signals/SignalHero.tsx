"use client";

import type { SignalMetrics, IndustryMetrics } from "@/lib/signal-types";

interface SignalHeroProps {
  metrics: SignalMetrics;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

const TREND_CONFIG = {
  accelerating: { label: "Accelerating", arrow: "\u2191", color: "#16a34a" },
  stable: { label: "Stable", arrow: "\u2192", color: "#d97706" },
  decelerating: { label: "Decelerating", arrow: "\u2193", color: "#dc2626" },
};

function getTopIndustries(industries: IndustryMetrics[]): IndustryMetrics[] {
  return [...industries]
    .filter((i) => i.toolGrowth3m > 0)
    .sort((a, b) => b.toolGrowth3m - a.toolGrowth3m)
    .slice(0, 3);
}

export default function SignalHero({ metrics }: SignalHeroProps) {
  const trend = TREND_CONFIG[metrics.aaiTrend];
  const surgingCount = metrics.surgingPackages.length;
  const topIndustries = getTopIndustries(metrics.industries);

  const pypiCount = metrics.packages.filter((p) => p.source === "pypi").length;
  const npmCount = metrics.packages.filter((p) => p.source === "npm").length;

  return (
    <div className="relative overflow-hidden -mx-6 sm:-mx-10 px-6 sm:px-10 pt-1 pb-6 sm:pt-2 sm:pb-8">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#5C61F6]/[0.04] blur-3xl" />
        <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] rounded-full bg-[#5C61F6]/[0.03] blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="signal-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#signal-grid)" />
        </svg>
      </div>

      <div className="relative">
        <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          AI Automation Signals
          <span className="opacity-50 mx-1">&middot;</span>
          <span className="normal-case font-semibold opacity-70">
            Updated {formatDate(metrics.calculatedAt)}
          </span>
        </p>

        <h1 className="text-[42px] sm:text-[56px] font-black tracking-tight text-[var(--foreground)] leading-[1.05] max-w-4xl">
          Where is AI automation{" "}
          <span className="text-[#F66B5C] italic">heading?</span>
        </h1>

        <p className="mt-4 text-[17px] text-[var(--muted)] leading-relaxed max-w-2xl">
          Think of this page like construction permits for AI automation.
          Before a building goes up, permits spike. Before AI replaces tasks
          in an industry, developers start downloading the tools to build
          those systems. We track {metrics.totalToolCount} automation tools
          across {metrics.industries.length} industries.
        </p>

        {/* AAI Big Number + Stats */}
        <div className="mt-8 flex flex-wrap items-end gap-8 sm:gap-12">
          {/* AAI */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-1">
              Automation Acceleration Index
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-[48px] sm:text-[64px] font-black tracking-tight text-[var(--foreground)] leading-none stat-number">
                {metrics.currentAAI.toFixed(2)}x
              </span>
              <span
                className="text-[18px] font-bold"
                style={{ color: trend.color }}
              >
                {trend.arrow} {trend.label}
              </span>
            </div>
            <p className="text-[12px] text-[var(--muted)] mt-1">
              Above 1.0 = automation tools growing faster than general AI
            </p>
          </div>

          {/* Summary Stats */}
          <div className="flex gap-6 sm:gap-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-1">
                Tools Tracked
              </p>
              <p className="text-[28px] font-black text-[var(--foreground)] stat-number">
                {metrics.totalToolCount}
              </p>
              <p className="text-[10px] text-[var(--muted)]">
                {pypiCount} Python + {npmCount} JavaScript
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-1">
                Industries
              </p>
              <p className="text-[28px] font-black text-[var(--foreground)] stat-number">
                {metrics.industries.length}
              </p>
            </div>
            {surgingCount > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-1">
                  Surging
                </p>
                <p className="text-[28px] font-black text-[#dc2626] stat-number">
                  {surgingCount}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Industries to Watch */}
        {topIndustries.length > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-black/[0.02] border border-black/[0.05]">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-3">
              Industries to Watch
            </p>
            <div className="flex flex-wrap gap-3">
              {topIndustries.map((ind) => (
                <div
                  key={ind.industry}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-black/[0.06]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: ind.color }}
                  />
                  <div>
                    <span className="text-[13px] font-semibold text-[var(--foreground)]">
                      {ind.label}
                    </span>
                    <span className="text-[12px] text-[var(--muted)] ml-2">
                      +{(ind.toolGrowth3m * 100).toFixed(0)}% tool growth
                    </span>
                    {ind.surgingCount > 0 && (
                      <span className="text-[10px] text-[#d97706] ml-1.5">
                        ({ind.surgingCount} surging)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
