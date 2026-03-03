"use client";

import type { SignalMetrics } from "@/lib/pypi-types";

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

export default function SignalHero({ metrics }: SignalHeroProps) {
  const trend = TREND_CONFIG[metrics.aaiTrend];
  const breakoutCount = metrics.breakoutPackages.length;

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
          PyPI Labor Signal Index
          <span className="opacity-50 mx-1">&middot;</span>
          <span className="normal-case font-semibold opacity-70">
            Updated {formatDate(metrics.calculatedAt)}
          </span>
        </p>

        <h1 className="text-[42px] sm:text-[56px] font-black tracking-tight text-[var(--foreground)] leading-[1.05] max-w-4xl">
          Automation Acceleration{" "}
          <span className="text-[#F66B5C] italic">Index</span>
        </h1>

        <p className="mt-4 text-[17px] text-[var(--muted)] leading-relaxed max-w-2xl">
          Tracking where AI automation investment is flowing by monitoring
          open-source package adoption. When automation-focused libraries grow
          faster than general AI infrastructure, it signals the shift from
          augmentation to automation.
        </p>

        {/* AAI Big Number + Stats */}
        <div className="mt-8 flex flex-wrap items-end gap-8 sm:gap-12">
          {/* AAI */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-1">
              Current AAI
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
              Ratio of automation package growth to AI infrastructure growth
            </p>
          </div>

          {/* Summary Stats */}
          <div className="flex gap-6 sm:gap-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-1">
                Packages Tracked
              </p>
              <p className="text-[28px] font-black text-[var(--foreground)] stat-number">
                {metrics.packages.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-1">
                Domains
              </p>
              <p className="text-[28px] font-black text-[var(--foreground)] stat-number">
                {metrics.domains.length}
              </p>
            </div>
            {breakoutCount > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-1">
                  Breakouts
                </p>
                <p className="text-[28px] font-black text-[#dc2626] stat-number">
                  {breakoutCount}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
