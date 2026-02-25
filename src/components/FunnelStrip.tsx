"use client";

import { useState } from "react";

const stripData = [
  // SECTION 1: AI EXPOSURE
  { study: "IMF '24", value: 40, range: [26, 60] as [number, number], metric: "Exposure", sourceUrl: "https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity", quote: "Almost 40% of global employment is exposed to AI; about 60% of jobs in advanced economies could be impacted, with roughly half at risk of lower demand and wages." },
  { study: "Stanford / World Bank '26", value: 38, range: [30, 45] as [number, number], metric: "Exposure", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5136877", quote: "LLM adoption among U.S. workers increased from 30.1% to 38.3% between December 2024 and December 2025. Small effects on wages in exposed occupations; no significant effects on job openings or total jobs." },
  { study: "Anthropic '25/'26", value: 36, range: [30, 42] as [number, number], metric: "Exposure", sourceUrl: "https://www.anthropic.com/research/anthropic-economic-index-january-2026-report", quote: "Over one-third of occupations (roughly 36%) see AI use in at least a quarter of their associated tasks. As of November 2025, augmentation (52%) has overtaken automation (49%) as the primary use pattern." },

  // SECTION 2: HIRING SLOWDOWN
  { study: "Stanford / ADP '25", value: 20, range: [6, 20] as [number, number], metric: "Posting decline", sourceUrl: "https://www.adpresearch.com/yes-ai-is-affecting-employment-heres-the-data/", quote: "Employment for the youngest software developers was 20% below its late fall 2022 peak. In jobs with high AI exposure, employment for 22- to 25-year-olds fell 6%." },
  { study: "HBS '25", value: 13, range: [10, 20] as [number, number], metric: "Posting decline", sourceUrl: "https://www.hbs.edu/faculty/Pages/item.aspx?num=67045", quote: "Job postings for occupations that involve lots of structured and repetitive tasks decreased by 13%. Meanwhile, employer demand for augmentation-prone roles grew 20%." },
  { study: "World Bank '25", value: 12, range: [6, 18] as [number, number], metric: "Posting decline", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5504741", quote: "Using 285 million job postings, we find postings for occupations with above-median AI substitution scores fell by an average of 12%. The effect intensified from 6% in year one to 18% by year three." },

  // SECTION 3: PROJECTED DISPLACEMENT
  { study: "WEF '25", value: 8, range: [5, 14] as [number, number], metric: "Projected displacement", sourceUrl: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/", quote: "40% of employers globally expect to reduce headcount as AI automates tasks. Net displacement estimates range from 5\u201314% of current roles by 2030." },
  { study: "Goldman Sachs '25", value: 7, range: [3, 14] as [number, number], metric: "Projected displacement", sourceUrl: "https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce", quote: "AI could displace 6\u20137% of the US workforce if widely adopted. We remain skeptical that AI will lead to large employment reductions over the next decade." },
  { study: "Acemoglu (NBER) '24", value: 5, range: [1, 5] as [number, number], metric: "Projected displacement", sourceUrl: "https://www.nber.org/papers/w32487", quote: "Macroeconomic effects appear nontrivial but modest \u2014 no more than a 0.66% increase in TFP over 10 years. Even these estimates could be exaggerated." },

  // SECTION 4: MEASURED JOB LOSS
  { study: "Dallas Fed '26", value: 0.1, range: null, metric: "Measured job loss", sourceUrl: "https://www.dallasfed.org/research/economics/2026/0106", quote: "We find some correlation across occupations between employment declines and AI exposure, but only for younger workers. This suggests only a slight impact on the aggregate unemployment rate so far." },
  { study: "Yale Budget Lab '25", value: 0, range: [0, 0.5] as [number, number], metric: "Measured job loss", sourceUrl: "https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-current-state-affairs", quote: "Currently, measures of exposure, automation, and augmentation show no sign of being related to changes in employment or unemployment." },
  { study: "Goldman Sachs '25", value: 0, range: [0, 0.5] as [number, number], metric: "Measured job loss", sourceUrl: "https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce", quote: "There is no economically or statistically significant correlation between AI exposure and job growth, unemployment, job finding rates, layoff rates, weekly hours, or average hourly earnings." },
];

const sections = [
  {
    metric: "Exposure",
    label: "AI Exposure",
    question: "How many jobs involve tasks AI can perform?",
    barColor: "#E2E8F0",
    barHover: "#CBD5E1",
  },
  {
    metric: "Posting decline",
    label: "Hiring Slowdown",
    question: "Are employers posting fewer jobs?",
    barColor: "#CBD5E1",
    barHover: "#94A3B8",
  },
  {
    metric: "Projected displacement",
    label: "Projected Loss",
    question: "How many jobs might disappear by 2030?",
    barColor: "#94A3B8",
    barHover: "#64748B",
  },
  {
    metric: "Measured job loss",
    label: "Measured Loss",
    question: "What\u2019s actually happened so far?",
    barColor: "#475569",
    barHover: "#334155",
  },
];

const MAX_VAL = 50;

export default function FunnelStrip() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      {/* Title */}
      <div className="mb-5">
        <h2 className="font-serif text-[22px] sm:text-[26px] font-bold tracking-tight text-[var(--foreground)] leading-tight">
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
                      href={d.sourceUrl}
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
                          className="absolute left-0 top-0 bottom-0 transition-colors duration-100"
                          style={{
                            width: `${barWidth}%`,
                            minWidth: d.value === 0 ? 3 : undefined,
                            backgroundColor: isHovered ? section.barHover : section.barColor,
                          }}
                        />

                        {/* Value at end of bar */}
                        <div
                          className="absolute top-0 bottom-0 flex items-center pl-2"
                          style={{ left: `${barWidth}%` }}
                        >
                          <span
                            className={`font-mono text-[11px] font-medium whitespace-nowrap leading-none tabular-nums transition-colors duration-100 ${
                              isHovered
                                ? "text-[var(--foreground)]"
                                : "text-[var(--muted)]/60"
                            }`}
                          >
                            {d.value}%
                            {isHovered && d.range && (
                              <span className="text-[var(--muted)]">
                                {" "}&middot; {d.range[0]}&ndash;{d.range[1]}%
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Hairline separator */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#F1F5F9]" />
                      </div>
                    </a>

                    {/* Hover quote */}
                    {isHovered && d.quote && (
                      <div className="px-4 sm:px-6 py-2 bg-black/[0.02] flex items-baseline gap-3">
                        <p className="text-[11px] sm:text-[12px] text-[var(--muted)] leading-relaxed italic flex-1">
                          &ldquo;{d.quote}&rdquo;
                        </p>
                        <a
                          href={d.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-[var(--accent)] whitespace-nowrap hover:underline shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View source &rarr;
                        </a>
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
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            Based on 12 studies &middot; Working papers, government data,
            institutional analysis &middot; Hover for detail
          </p>
        </div>
      </div>
    </div>
  );
}
