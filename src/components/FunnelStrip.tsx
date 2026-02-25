"use client";

import { useState } from "react";

const stripData = [
  { study: "Anthropic '26", value: 49, metric: "Exposure", url: "https://www.anthropic.com/research/anthropic-economic-index-january-2026-report" },
  { study: "IMF '24", value: 40, metric: "Exposure", url: "https://www.imf.org/en/blogs/articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity" },
  { study: "OECD '23", value: 27, metric: "Exposure", url: "https://www.oecd.org/en/publications/oecd-employment-outlook-2023_08785bba-en.html" },
  { study: "Goldman Sachs '23", value: 25, metric: "Exposure", url: "https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce" },

  { study: "HBS '25", value: 17, metric: "Posting decline", url: "https://www.library.hbs.edu/working-knowledge/enhance-or-eliminate-how-ai-will-likely-change-these-jobs" },
  { study: "World Bank '25", value: 12, metric: "Posting decline", url: "https://openknowledge.worldbank.org/entities/publication/b5d5c33c-9419-4dc7-93fb-ec9d6b997c4b" },

  { study: "WEF '25", value: 8, metric: "Projected displacement", url: "https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/" },
  { study: "Goldman Sachs '25", value: 7, metric: "Projected displacement", url: "https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce" },
  { study: "Forrester '25", value: 6, metric: "Projected displacement", url: "https://www.forrester.com/blogs/ai-and-automation-will-take-6-of-us-jobs-by-2030/" },
  { study: "Acemoglu (NBER)", value: 5, metric: "Projected displacement", url: "https://www.nber.org/papers/w32487" },

  { study: "Dallas Fed '26", value: 0.1, metric: "Measured job loss", url: "https://www.dallasfed.org/research/economics/2026/0106" },
  { study: "Yale Budget Lab '25", value: 0, metric: "Measured job loss", url: "https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-current-state-affairs" },
  { study: "ICLE '26", value: 0, metric: "Measured job loss", url: "https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/" },
];

type StripItem = (typeof stripData)[number];

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

const MAX_VAL = 55;

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
          const items = stripData
            .filter((d) => d.metric === section.metric)
            .sort((a, b) => b.value - a.value);

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
                  <a
                    key={i}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex items-stretch w-full h-[26px] sm:h-[30px] cursor-pointer no-underline"
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
                            ? "font-semibold text-[var(--accent)]"
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
                        </span>
                      </div>

                      {/* Hairline separator */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/[0.04]" />
                    </div>
                  </a>
                );
              })}
            </div>
          );
        })}

        {/* Bottom note */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-black/[0.06] bg-black/[0.01]">
          <p className="text-[12px] text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--foreground)]">The pattern:</strong>{" "}
            Up to half of jobs have <em>some</em> AI exposure &mdash; but measured
            job loss remains near zero. The question is how fast exposure converts
            to displacement, and whether augmentation absorbs the shock.
          </p>
          <p className="text-[11px] text-[var(--muted)]/50 mt-1.5">
            Click any bar to view the source &middot; Peer-reviewed research,
            government data, institutional analysis
          </p>
        </div>
      </div>
    </div>
  );
}
