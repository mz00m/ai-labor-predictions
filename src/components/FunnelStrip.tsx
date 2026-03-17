"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const stripData = [
  // SECTION 1: AI EXPOSURE
  { study: "IMF '24", value: 40, range: [26, 60] as [number, number], metric: "Exposure", sourceUrl: "https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity", quote: "Almost 40% of global employment is exposed to AI; about 60% of jobs in advanced economies could be impacted, with roughly half at risk of lower demand and wages." },
  { study: "Stanford / World Bank '26", value: 38, range: [30, 38] as [number, number], metric: "Exposure", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5136877", quote: "LLM adoption among U.S. workers increased from 30.1% to 38.3% between December 2024 and December 2025. Small effects on wages in exposed occupations; no significant effects on job openings or total jobs." },
  { study: "Anthropic '25/'26", value: 36, range: null, metric: "Exposure", sourceUrl: "https://www.anthropic.com/research/anthropic-economic-index-january-2026-report", quote: "Over one-third of occupations (roughly 36%) see AI use in at least a quarter of their associated tasks. As of November 2025, augmentation (52%) has overtaken automation (49%) as the primary use pattern." },

  // SECTION 2a: EMPLOYEE PRODUCTIVITY
  { study: "Median (18 studies)", value: 20, range: [0, 73] as [number, number], metric: "Employee productivity", sourceUrl: "/research", quote: "Median effect across 18 task & firm productivity studies. Individual results range from \u22122% (AI workslop) to +73% (human-AI ad teams), with most studies clustered between +14% and +37%." },
  { study: "Demirer et al. '25", value: 26, range: null, metric: "Employee productivity", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4945566", quote: "Across three field experiments and 4,867 developers, our analysis reveals a 26.08% increase in completed tasks among developers using the AI coding assistant. Less experienced developers had higher adoption rates and greater productivity gains." },
  { study: "Brynjolfsson et al. '25", value: 15, range: null, metric: "Employee productivity", sourceUrl: "https://academic.oup.com/qje/article/140/2/889/7990658", quote: "Access to AI assistance increases worker productivity, as measured by issues resolved per hour, by 15% on average, with substantial heterogeneity across workers." },

  // SECTION 3: HIRING SLOWDOWN
  { study: "HBS '25", value: 13, range: null, metric: "Posting decline", sourceUrl: "https://www.hbs.edu/faculty/Pages/item.aspx?num=67045", quote: "Job postings for occupations that involve lots of structured and repetitive tasks decreased by 13%. Meanwhile, employer demand for augmentation-prone roles grew 20%." },
  { study: "World Bank '25", value: 12, range: [6, 18] as [number, number], metric: "Posting decline", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5504741", quote: "Using 285 million job postings, we find postings for occupations with above-median AI substitution scores fell by an average of 12%. The effect intensified from 6% in year one to 18% by year three." },
  { study: "Stanford / ADP '25", value: 6, range: null, metric: "Posting decline", sourceUrl: "https://www.adpresearch.com/yes-ai-is-affecting-employment-heres-the-data/", quote: "In jobs with high AI exposure, employment for 22- to 25-year-olds fell 6% between late 2022 and July 2025. Software developers saw a 20% early-career decline. Employment among workers 30 and older grew 6\u201313%." },

  // SECTION 4: PROJECTED DISPLACEMENT
  { study: "WEF '25", value: 8, range: null, metric: "Projected displacement", sourceUrl: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/", quote: "92 million roles will be displaced by 2030, equivalent to 8% of current jobs, offset by the creation of 170 million new roles for a net gain of 78 million. 40% of employers expect to reduce headcount where AI can automate tasks." },
  { study: "Goldman Sachs '25", value: 7, range: [3, 14] as [number, number], metric: "Projected displacement", sourceUrl: "https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce", quote: "AI could displace 6\u20137% of the US workforce if widely adopted. We remain skeptical that AI will lead to large employment reductions over the next decade." },
  { study: "Bloom et al. '26", value: 1, range: null, metric: "Projected displacement", sourceUrl: "https://www.nber.org/papers/w34836", quote: "Surveying nearly 6,000 executives across the US, UK, Germany, and Australia, firms predict AI will cut employment by 0.7% over the next 3 years. Over 80% of firms report no impact on employment over the past 3 years." },

  // SECTION 5: MEASURED JOB LOSS
  { study: "Dallas Fed '26", value: 0.1, range: null, metric: "Measured job loss", sourceUrl: "https://www.dallasfed.org/research/economics/2026/0106", quote: "We find some correlation across occupations between employment declines and AI exposure, but only for younger workers. This suggests only a slight impact on the aggregate unemployment rate so far." },
  { study: "Yale Budget Lab '25", value: 0, range: null, metric: "Measured job loss", sourceUrl: "https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-current-state-affairs", quote: "Currently, measures of exposure, automation, and augmentation show no sign of being related to changes in employment or unemployment." },
  { study: "Humlum & Vestergaard '25", value: 0, range: null, metric: "Measured job loss", sourceUrl: "https://www.nber.org/papers/w33777", quote: "Linking large-scale adoption surveys to Danish administrative records, we estimate precise null effects on earnings and hours, ruling out effects larger than 2% two years after ChatGPT's release." },
  { study: "ECB '26", value: 0, range: null, metric: "Measured job loss", sourceUrl: "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260304~d9e34fc95f.en.html", quote: "Firms making significant use of AI were about 4% more likely to hire additional employees. There is no marked difference in overall hiring intentions between AI-using and non-AI-using firms." },
];

const sectionMeta = [
  { metric: "Exposure", barColor: "#D6DAFE", barHover: "#C0C6FC" },       // light indigo — ties to accent
  { metric: "Employee productivity", barColor: "#B8D4F0", barHover: "#9AC2E8" }, // soft blue
  { metric: "Posting decline", barColor: "#E8C8A0", barHover: "#DDB580" },       // warm amber
  { metric: "Projected displacement", barColor: "#E8A090", barHover: "#DE8878" }, // salmon approach
  { metric: "Measured job loss", barColor: "#F66B5C", barHover: "#E05A4C" },      // hero red
];

// Flatten all bars in display order
const allBars = sectionMeta.flatMap((sec, si) =>
  stripData
    .filter((d) => d.metric === sec.metric)
    .sort((a, b) => b.value - a.value)
    .map((d) => ({ ...d, si, barColor: sec.barColor, barHover: sec.barHover }))
);

// Left column label groups — positioned by bar offsets
const ROW_H = 24;
const leftGroups: {
  label: string;
  context: string;
  detail?: string;
  startBar: number;
  barCount: number;
  link?: boolean;
}[] = [
  {
    label: "Exposure",
    context: "% of jobs impacted by AI",
    startBar: 0, barCount: 3,
  },
  {
    label: "Productivity",
    context: "% faster AI makes us",
    startBar: 3, barCount: 3, link: true,
  },
  {
    label: "Hiring",
    context: "% fewer job postings",
    startBar: 6, barCount: 3,
  },
  {
    label: "Projected",
    context: "% of jobs lost by 2030",
    startBar: 9, barCount: 3,
  },
  {
    label: "Measured",
    context: "Actual job loss so far",
    startBar: 12, barCount: 4,
  },
];

const MAX_VAL = 50;

export default function FunnelStrip() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hoveredData = hovered !== null ? allBars[hovered] : null;
  const hoveredSection = hovered !== null ? allBars[hovered].si : null;

  // Scroll-triggered entrance animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="evidence-funnel">
      {/* Title */}
      <div className="mb-5">
        <h2 className="font-serif text-[22px] sm:text-[26px] font-bold tracking-tight text-[var(--foreground)] leading-tight">
          From exposure to job loss
        </h2>
        <p className="text-[15px] sm:text-[17px] text-[var(--muted)] mt-1.5 leading-relaxed">
          AI adoption is accelerating and significantly changing work, but the impact on jobs is less clear.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          <Link href="/task-visualizer" className="text-[13px] font-medium text-[var(--accent)] link-draw-underline">
            How will AI affect your job? &rarr;
          </Link>
          <Link href="/j-curve" className="text-[13px] font-medium text-[var(--accent)] link-draw-underline">
            Why the gap between productivity and job loss? &rarr;
          </Link>
          <Link href="/history" className="text-[13px] font-medium text-[var(--accent)] link-draw-underline">
            How technology has impacted jobs before &rarr;
          </Link>
        </div>
      </div>

      {/* Two-column chart */}
      <div ref={containerRef} className="border border-black/[0.06] rounded-lg overflow-hidden">
        <div className="flex">
          {/* Left column — desktop only */}
          <div
            className="hidden sm:block w-[200px] shrink-0 border-r border-black/[0.06] relative"
            style={{ height: allBars.length * ROW_H }}
          >
            {leftGroups.map((group, gi) => (
              <div
                key={gi}
                className="absolute left-0 right-0 flex flex-col justify-center px-4"
                style={{
                  top: group.startBar * ROW_H,
                  height: group.barCount * ROW_H,
                  // Fade-slide in from left, staggered per section
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-12px)",
                  transition: `opacity 0.4s ease-out ${gi * 0.12}s, transform 0.4s ease-out ${gi * 0.12}s`,
                }}
              >
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.06em] leading-tight"
                  style={{
                    // Highlight active section label
                    color: hoveredSection === gi ? "var(--accent)" : "var(--foreground)",
                    transition: "color 0.15s ease",
                  }}
                >
                  {group.label}
                </span>
                <span className="text-[9px] text-[var(--muted)] mt-0.5 leading-snug">
                  {group.context}
                </span>
                {group.detail && (
                  <span className="text-[9px] text-[var(--muted)] opacity-50 mt-0.5 leading-snug">
                    {group.detail}
                  </span>
                )}
                {group.link && (
                  <Link
                    href="/signals#productivity-paths"
                    className="text-[9px] text-[var(--accent)] link-draw-underline mt-0.5 leading-snug"
                  >
                    How this translates to jobs &rarr;
                  </Link>
                )}
              </div>
            ))}

            {/* Section divider lines — draw in from left */}
            {leftGroups.slice(1).map((group, di) => (
              <div
                key={`divider-${di}`}
                className="absolute left-4 right-4 h-px"
                style={{
                  top: group.startBar * ROW_H,
                  backgroundColor: "rgba(0,0,0,0.06)",
                  transform: visible ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: `transform 0.5s ease-out ${0.3 + di * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Right column — flush bars */}
          <div className="flex-1">
            {allBars.map((bar, i) => {
              const isHovered = hovered === i;
              const barWidth = Math.max((bar.value / MAX_VAL) * 100, 0.4);
              // Is this the first bar of a new section? (for mobile labels)
              const isFirstOfSection =
                i === 0 || allBars[i - 1].si !== bar.si;
              const mobileLabel = isFirstOfSection
                ? leftGroups.find((g) => i >= g.startBar && i < g.startBar + g.barCount)
                : null;
              // Only show mobile label for the first section in each left group
              const showMobileLabel = mobileLabel && mobileLabel.startBar === i;

              // Mobile productivity link after last productivity bar (index 5)
              const showMobileProductivityLink = i === 5;

              // Cross-section dimming: dim bars in other sections when hovering
              const isDimmed = hoveredSection !== null && bar.si !== hoveredSection;

              // Bar entrance animation delay
              const barDelay = 0.06 + i * 0.04;

              return (
                <div key={i}>
                  {/* Mobile inline label */}
                  {showMobileLabel && (
                    <div className="sm:hidden flex items-center gap-2 px-3 py-1 bg-black/[0.015]">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        {mobileLabel.label}
                      </span>
                      <span className="text-[8px] text-[var(--muted)] opacity-50">
                        {mobileLabel.context}
                      </span>
                    </div>
                  )}

                  {/* Section divider on right side (desktop) — between sections */}
                  {isFirstOfSection && i > 0 && (
                    <div
                      className="hidden sm:block h-px"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.04)",
                        transform: visible ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: `transform 0.4s ease-out ${barDelay}s`,
                      }}
                    />
                  )}

                  <div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      // Cross-section dimming
                      opacity: isDimmed ? 0.4 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <a
                      href={bar.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full no-underline relative"
                      style={{ height: ROW_H }}
                    >
                      {/* Bar fill — animates width on scroll */}
                      <div
                        className="absolute left-0 top-0 bottom-0"
                        style={{
                          width: visible ? `${barWidth}%` : "0%",
                          minWidth: visible && bar.value === 0 ? 3 : undefined,
                          backgroundColor: isHovered ? bar.barHover : bar.barColor,
                          transition: `width 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${barDelay}s, background-color 0.1s ease`,
                        }}
                      />

                      {/* Confidence range whiskers — shown on hover when range exists */}
                      {bar.range && (
                        <>
                          {/* Low whisker */}
                          <div
                            className="absolute top-[10px] h-[4px]"
                            style={{
                              left: `${(bar.range[0] / MAX_VAL) * 100}%`,
                              width: 1,
                              backgroundColor: bar.barHover,
                              opacity: isHovered ? 0.6 : 0,
                              transition: "opacity 0.2s ease",
                            }}
                          />
                          {/* High whisker */}
                          <div
                            className="absolute top-[10px] h-[4px]"
                            style={{
                              left: `${(bar.range[1] / MAX_VAL) * 100}%`,
                              width: 1,
                              backgroundColor: bar.barHover,
                              opacity: isHovered ? 0.6 : 0,
                              transition: "opacity 0.2s ease",
                            }}
                          />
                          {/* Connecting line between whiskers */}
                          <div
                            className="absolute top-[11.5px] h-px"
                            style={{
                              left: `${(bar.range[0] / MAX_VAL) * 100}%`,
                              width: `${((bar.range[1] - bar.range[0]) / MAX_VAL) * 100}%`,
                              backgroundColor: bar.barHover,
                              opacity: isHovered ? 0.35 : 0,
                              transition: "opacity 0.2s ease",
                            }}
                          />
                        </>
                      )}

                      {/* Value after bar — z-10 so it floats over source name */}
                      <div
                        className="absolute top-0 bottom-0 flex items-center pl-2 z-10"
                        style={{
                          left: visible ? `${barWidth}%` : "0%",
                          transition: `left 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${barDelay}s`,
                        }}
                      >
                        <span
                          className={`font-mono text-[10px] sm:text-[11px] font-medium whitespace-nowrap leading-none tabular-nums bg-white/80 px-0.5 rounded-sm ${
                            isHovered
                              ? "text-[var(--foreground)]"
                              : "text-[var(--muted)]"
                          }`}
                          style={{
                            opacity: visible ? 1 : 0,
                            transition: `opacity 0.3s ease ${barDelay + 0.3}s, color 0.1s ease`,
                          }}
                        >
                          {bar.value}%
                          {isHovered && bar.range && (
                            <span className="text-[var(--muted)] opacity-60">
                              {" "}&middot; {bar.range[0]}&ndash;{bar.range[1]}%
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Source name — right-justified, desktop only */}
                      <span
                        className={`hidden sm:flex absolute right-3 top-0 bottom-0 items-center text-[10px] whitespace-nowrap leading-none ${
                          isHovered
                            ? "text-[var(--foreground)] opacity-60 font-medium"
                            : "text-[var(--muted)] opacity-25 font-normal"
                        }`}
                        style={{ transition: "opacity 0.15s ease, color 0.1s ease" }}
                      >
                        {bar.study}
                      </span>
                    </a>
                  </div>

                  {/* Mobile productivity link */}
                  {showMobileProductivityLink && (
                    <div className="sm:hidden px-3 py-1.5 bg-black/[0.015]">
                      <Link
                        href="/signals#productivity-paths"
                        className="text-[10px] text-[var(--accent)] hover:underline"
                      >
                        How this translates to jobs &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel — smooth max-height transition */}
        <div
          className="funnel-detail-panel border-t border-black/[0.06] overflow-hidden"
          style={{
            maxHeight: hoveredData?.quote ? 120 : 0,
            opacity: hoveredData?.quote ? 1 : 0,
          }}
        >
          {hoveredData?.quote && (
            <div className="px-4 sm:px-6 py-2 flex items-baseline gap-3">
              <p className="text-[11px] sm:text-[12px] text-[var(--muted)] leading-relaxed italic flex-1">
                &ldquo;{hoveredData.quote}&rdquo;
              </p>
              <a
                href={hoveredData.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-[var(--accent)] whitespace-nowrap link-draw-underline shrink-0"
              >
                View source &rarr;
              </a>
            </div>
          )}
        </div>

        {/* Bottom note */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-black/[0.06] bg-black/[0.01] flex items-center justify-between gap-4">
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            16 studies &middot; Hover for quotes and links
          </p>
          <a
            href="/research"
            className="text-[12px] font-semibold text-[var(--foreground)] link-draw-underline"
          >
            Read more sources &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
