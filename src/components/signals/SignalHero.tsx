"use client";

import type { SignalMetrics } from "@/lib/signal-types";

interface SignalHeroProps {
  metrics: SignalMetrics;
  lastUpdated: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export default function SignalHero({ metrics, lastUpdated }: SignalHeroProps) {

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
            Updated {formatDate(lastUpdated)}
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
      </div>
    </div>
  );
}
