"use client";

import { useState } from "react";

const stripData = [
  { study: "PwC '25", value: 66, metric: "Exposure", url: "https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html", quote: "Skills demanded by employers are changing 66% faster in AI-exposed occupations than in least-exposed roles, up from 25% the prior year." },
  { study: "Anthropic '26", value: 36, metric: "Exposure", url: "https://www.anthropic.com/research/anthropic-economic-index-january-2026-report", quote: "36% of occupations use AI for at least 25% of their tasks, based on analysis of 2 million real AI conversations from November 2025." },
  { study: "Stanford '26", value: 36, metric: "Exposure", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5136877", quote: "35.9% of US workers used generative AI by December 2025. Small positive wage effects detected. No significant decline in job openings at the aggregate level." },

  { study: "Stanford/ADP '25", value: 20, metric: "Posting decline", url: "https://www.adpresearch.com/yes-ai-is-affecting-employment-heres-the-data/", quote: "Employment for youngest software developers was 20% below its late 2022 peak. For early-career customer service workers, employment fell nearly 11%." },
  { study: "HBS '25", value: 13, metric: "Posting decline", url: "https://www.hbs.edu/faculty/Pages/item.aspx?num=67045", quote: "Job postings for occupations that involve lots of structured and repetitive tasks decreased by 13%. Meanwhile, demand for analytical and creative work grew 20%." },
  { study: "World Bank '25", value: 12, metric: "Posting decline", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5504741", quote: "Using 285 million job postings, postings for occupations with above-median AI substitution scores fell by 12% relative to those with below-median scores." },

  { study: "WEF '25", value: 8, metric: "Projected displacement", url: "https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/", quote: "92 million jobs displaced but 170 million created by 2030, for a net gain of 78 million. 40% of employers expect to reduce headcount as AI automates tasks." },
  { study: "Goldman Sachs '25", value: 7, metric: "Projected displacement", url: "https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce", quote: "Baseline estimate: 6\u20137% of US workforce displaced if AI is widely adopted (range 3\u201314%). Displacement expected to be temporary, historically normalizing within 2 years." },
  { study: "Acemoglu (NBER)", value: 5, metric: "Projected displacement", url: "https://www.nber.org/papers/w32487", quote: "AI may increase total factor productivity by only 0.53\u20130.66% over 10 years, implying limited displacement because the productivity effects are modest." },

  { study: "Dallas Fed '26", value: 0.1, metric: "Measured job loss", url: "https://www.dallasfed.org/research/economics/2026/0106", quote: "Some correlation between employment declines and AI exposure, but only for younger workers. This suggests only a slight impact on the aggregate unemployment rate so far." },
  { study: "Yale Budget Lab '25", value: 0, metric: "Measured job loss", url: "https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-current-state-affairs", quote: "Measures of exposure, automation, and augmentation show no sign of being related to changes in employment or unemployment." },
  { study: "Goldman Sachs '25", value: 0, metric: "Measured job loss", url: "https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce", quote: "There is no economically or statistically significant correlation between AI exposure and job growth, unemployment, job finding rates, layoff rates, weekly hours, or average hourly earnings." },
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
                  <div
                    key={i}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
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

                    {/* Hover quote */}
                    {isHovered && d.quote && (
                      <div className="px-4 sm:px-6 py-2 bg-black/[0.02]">
                        <p className="text-[11px] sm:text-[12px] text-[var(--muted)] leading-relaxed italic">
                          &ldquo;{d.quote}&rdquo;
                        </p>
                      </div>
                    )}
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
