"use client";

import { useState } from "react";

const stripData = [
  { study: "Goldman Sachs '23", value: 66, range: [55, 75], metric: "Exposure" },
  { study: "Anthropic '26", value: 49, range: [40, 55], metric: "Exposure" },
  { study: "IMF '24", value: 40, range: [35, 50], metric: "Exposure" },
  { study: "Stanford '26", value: 36, range: [30, 42], metric: "Exposure" },
  { study: "OECD '23", value: 27, range: [20, 35], metric: "Exposure" },

  { study: "HBS '25", value: 17, range: [14, 20], metric: "Posting decline" },
  { study: "World Bank '25", value: 12, range: [6, 18], metric: "Posting decline" },

  { study: "WEF '25", value: 9, range: [5, 14], metric: "Projected displacement" },
  { study: "Forrester '25", value: 6, range: [4, 8], metric: "Projected displacement" },
  { study: "Acemoglu (NBER)", value: 3, range: [1, 5], metric: "Projected displacement" },
  { study: "Goldman Sachs '25", value: 2.5, range: [1.5, 4], metric: "Projected displacement" },

  { study: "Yale Budget Lab '25", value: 0.2, range: [0, 0.5], metric: "Measured job loss" },
  { study: "Dallas Fed '26", value: 0.1, range: null, metric: "Measured job loss" },
  { study: "ICLE '26", value: 0, range: [0, 1], metric: "Measured job loss" },
] as const;

type StripItem = {
  study: string;
  value: number;
  range: readonly [number, number] | null;
  metric: string;
};

const sections = [
  {
    metric: "Exposure",
    label: "AI Exposure",
    question: "How many jobs involve tasks AI can perform?",
    barClass: "bg-violet-200/70",
    barHoverClass: "bg-violet-300",
  },
  {
    metric: "Posting decline",
    label: "Hiring Slowdown",
    question: "Are employers posting fewer jobs?",
    barClass: "bg-violet-300/80",
    barHoverClass: "bg-violet-400",
  },
  {
    metric: "Projected displacement",
    label: "Projected Loss",
    question: "How many jobs might disappear by 2030?",
    barClass: "bg-violet-500/70",
    barHoverClass: "bg-violet-600",
  },
  {
    metric: "Measured job loss",
    label: "Measured Loss",
    question: "What\u2019s actually happened so far?",
    barClass: "bg-violet-800",
    barHoverClass: "bg-violet-900",
  },
];

const MAX_VAL = 75;

export default function FunnelStrip() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      {/* Title */}
      <div className="mb-5">
        <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
          From exposure to displacement
        </h2>
        <p className="text-[13px] sm:text-[14px] text-[var(--muted)] mt-1.5 leading-relaxed max-w-xl">
          Follow the evidence from broad to specific. The gap between &ldquo;AI could affect this job&rdquo;
          and &ldquo;this job actually disappeared&rdquo; is the whole story.
        </p>
      </div>

      {/* Chart */}
      <div className="border border-black/[0.06] rounded-lg overflow-hidden">
        {sections.map((section, si) => {
          const items = (stripData as readonly StripItem[]).filter(
            (d) => d.metric === section.metric
          );

          return (
            <div key={si}>
              {/* Section header */}
              <div
                className={`flex items-baseline gap-2 px-4 sm:px-6 pt-3 pb-1.5 ${
                  si > 0 ? "border-t border-black/[0.06]" : ""
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--foreground)] whitespace-nowrap">
                  {section.label}
                </span>
                <span className="text-[11px] text-[var(--muted)] italic">
                  {section.question}
                </span>
              </div>

              {/* Rows */}
              {items.map((d, i) => {
                const key = `${si}-${i}`;
                const isHovered = hovered === key;
                const barWidth = Math.max((d.value / MAX_VAL) * 100, 0.4);

                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex items-stretch w-full h-[26px] sm:h-[30px] cursor-default"
                  >
                    {/* Fixed label column */}
                    <div
                      className={`w-[120px] sm:w-[160px] min-w-[120px] sm:min-w-[160px] flex items-center justify-end pr-3 transition-colors duration-100 ${
                        isHovered ? "bg-black/[0.02]" : ""
                      }`}
                    >
                      <span
                        className={`text-[11px] sm:text-[12px] whitespace-nowrap overflow-hidden text-ellipsis leading-none transition-colors duration-100 ${
                          isHovered
                            ? "font-semibold text-[var(--foreground)]"
                            : "font-normal text-[var(--muted)]"
                        }`}
                      >
                        {d.study}
                      </span>
                    </div>

                    {/* Bar area */}
                    <div className="flex-1 relative">
                      {/* Bar fill */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 transition-colors duration-100 ${
                          isHovered ? section.barHoverClass : section.barClass
                        }`}
                        style={{
                          width: `${barWidth}%`,
                          minWidth: d.value === 0 ? 3 : undefined,
                        }}
                      />

                      {/* Value at end of bar */}
                      <div
                        className="absolute top-0 bottom-0 flex items-center pl-2"
                        style={{ left: `${barWidth}%` }}
                      >
                        <span
                          className={`text-[11px] font-medium whitespace-nowrap leading-none tabular-nums transition-colors duration-100 ${
                            isHovered
                              ? "text-[var(--foreground)]"
                              : "text-[var(--muted)]/60"
                          }`}
                        >
                          {d.value}%
                          {isHovered && d.range
                            ? `  \u00b7  ${d.range[0]}\u2013${d.range[1]}%`
                            : ""}
                        </span>
                      </div>

                      {/* Hairline separator */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/[0.04]" />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Bottom note */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-black/[0.06] bg-black/[0.01]">
          <p className="text-[12px] text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--foreground)]">The pattern:</strong>{" "}
            Two-thirds of jobs have <em>some</em> AI exposure &mdash; but measured
            job loss remains near zero. The question is how fast exposure converts
            to displacement, and whether augmentation absorbs the shock.
          </p>
          <p className="text-[11px] text-[var(--muted)]/50 mt-1.5">
            Based on 25 sources &middot; Peer-reviewed research, government data,
            institutional analysis &middot; Hover for ranges
          </p>
        </div>
      </div>
    </div>
  );
}
