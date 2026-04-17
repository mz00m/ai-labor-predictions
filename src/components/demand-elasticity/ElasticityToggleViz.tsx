"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { computeScenario } from "./DemandSliderViz";

/* ------------------------------------------------------------------ */
/*  Industry elasticity data                                            */
/* ------------------------------------------------------------------ */

interface IndustryData {
  id: string;
  label: string;
  elasticity: number;
  productivityMultiplier: number;
  rawDisplacement: number; // % (negative = job loss)
  description: string;
}

const INDUSTRIES: IndustryData[] = [
  {
    id: "software",
    label: "Software & Engineering",
    elasticity: 1.8,
    productivityMultiplier: 5.0,
    rawDisplacement: -15,
    description:
      "Vast unmet demand for automation, custom tooling, and integration. When coding costs fall, firms fund projects that were previously unviable. The long tail of software needs is enormous.",
  },
  {
    id: "creative",
    label: "Creative Services",
    elasticity: 1.3,
    productivityMultiplier: 3.0,
    rawDisplacement: -20,
    description:
      "Bespoke creative work (video, illustration, copywriting) was unaffordable for most SMBs. Lower production costs expand the addressable market significantly.",
  },
  {
    id: "data-analysis",
    label: "Data Analysis & Research",
    elasticity: 1.5,
    productivityMultiplier: 4.0,
    rawDisplacement: -18,
    description:
      "Most companies lack the budget for dedicated analysts. When AI drops the cost of insight generation, every mid-market firm becomes a buyer. Demand scales with affordability.",
  },
  {
    id: "marketing",
    label: "Marketing & Advertising",
    elasticity: 1.2,
    productivityMultiplier: 3.0,
    rawDisplacement: -16,
    description:
      "Personalized campaigns were only viable for large brands. AI-driven content and targeting make sophisticated marketing accessible to smaller businesses, expanding the market.",
  },
  {
    id: "education",
    label: "Education & Tutoring",
    elasticity: 1.1,
    productivityMultiplier: 2.0,
    rawDisplacement: -10,
    description:
      "Massive unmet demand for affordable, personalized instruction. AI tutoring could serve billions who lack access. Regulatory constraints are lighter than healthcare or law.",
  },
  {
    id: "legal",
    label: "Legal & Professional",
    elasticity: 0.8,
    productivityMultiplier: 2.5,
    rawDisplacement: -12,
    description:
      "Moderate latent demand for affordable legal services, but regulatory friction and licensing requirements slow expansion. Contract review may expand; litigation less so.",
  },
  {
    id: "financial",
    label: "Financial Services",
    elasticity: 0.7,
    productivityMultiplier: 2.5,
    rawDisplacement: -14,
    description:
      "Moderate latent demand in personal finance and risk analysis, but heavily regulated. Some expansion in robo-advisory; back-office roles face pure displacement.",
  },
  {
    id: "healthcare",
    label: "Healthcare Admin",
    elasticity: 0.6,
    productivityMultiplier: 2.0,
    rawDisplacement: -15,
    description:
      "Enormous unmet demand constrained by regulation, licensing, and institutional inertia. Displacement mainly via attrition rather than layoffs.",
  },
  {
    id: "accounting",
    label: "Accounting & Bookkeeping",
    elasticity: 0.5,
    productivityMultiplier: 3.5,
    rawDisplacement: -22,
    description:
      "Firms don't need more bookkeeping when it's cheaper. They need the same amount done faster. High productivity gains with low demand response means net workforce shrinkage.",
  },
  {
    id: "customer-service",
    label: "Customer Service",
    elasticity: 0.4,
    productivityMultiplier: 4.0,
    rawDisplacement: -25,
    description:
      "Consumers don't want more support interactions at lower prices. Nobody calls a helpline for fun. Automation of existing volume dominates over any demand expansion.",
  },
  {
    id: "translation",
    label: "Translation & Localization",
    elasticity: 0.9,
    productivityMultiplier: 6.0,
    rawDisplacement: -28,
    description:
      "Moderate new demand (more content localized into more languages) but extreme productivity gains overwhelm it. A translator handling 6x more volume still nets fewer total translators.",
  },
  {
    id: "data-entry",
    label: "Data Entry & Back-Office",
    elasticity: 0.2,
    productivityMultiplier: 5.0,
    rawDisplacement: -30,
    description:
      "Nobody wants more data entry. When AI automates it, the work simply goes away. There is no latent market waiting for cheaper data entry. Textbook displacement.",
  },
  {
    id: "compliance",
    label: "Compliance & Audit",
    elasticity: 0.3,
    productivityMultiplier: 3.0,
    rawDisplacement: -20,
    description:
      "Regulatory requirements are fixed. Companies must comply regardless of cost. Cheaper compliance doesn't create more compliance work, it just requires fewer compliance officers.",
  },
];

/* ------------------------------------------------------------------ */
/*  Compute elasticity-adjusted values                                  */
/* ------------------------------------------------------------------ */

function getAdjustedDisplacement(industry: IndustryData): number {
  const result = computeScenario(
    industry.productivityMultiplier,
    industry.elasticity,
    100
  );
  // netChange is per 100 workers, so it's already a percentage
  return result.netChange;
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function ElasticityToggleViz() {
  const [elasticityOn, setElasticityOn] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const computedData = useMemo(
    () =>
      INDUSTRIES.map((ind) => ({
        ...ind,
        adjustedDisplacement: getAdjustedDisplacement(ind),
      })),
    []
  );

  // Find the range for scaling bars
  const range = useMemo(() => {
    let min = 0;
    let max = 0;
    for (const d of computedData) {
      min = Math.min(min, d.rawDisplacement, d.adjustedDisplacement);
      max = Math.max(max, d.rawDisplacement, d.adjustedDisplacement);
    }
    // Add padding
    return { min: min - 5, max: max + 5 };
  }, [computedData]);

  const handleToggle = useCallback(() => {
    setElasticityOn((prev) => !prev);
    if (!reducedMotion) {
      setAnimating(true);
      // Animation duration: 700ms base + 80ms * 13 items stagger = ~1740ms
      setTimeout(() => setAnimating(false), 1900);
    }
  }, [reducedMotion]);

  // Convert a value to a percentage position in the bar area
  const valueToPercent = useCallback(
    (value: number) => {
      return ((value - range.min) / (range.max - range.min)) * 100;
    },
    [range]
  );

  const zeroPercent = valueToPercent(0);

  return (
    <div className="rounded-xl border border-card bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">
            The Elasticity Effect by Industry
          </h3>
          <p className="text-base text-[var(--muted)] leading-relaxed">
            See how demand elasticity changes the displacement story. Toggle to
            stretch or compress each industry&rsquo;s outlook.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleToggle}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all cursor-pointer select-none"
            style={{
              borderColor: elasticityOn ? "#5C61F640" : "#00000012",
              backgroundColor: elasticityOn ? "#5C61F60c" : "transparent",
            }}
            aria-pressed={elasticityOn}
          >
            {/* Toggle track */}
            <span
              className="relative inline-block w-[36px] h-[20px] rounded-full transition-colors"
              style={{
                backgroundColor: elasticityOn ? "#5C61F6" : "#d1d5db",
              }}
            >
              <span
                className="absolute top-[2px] left-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-sm transition-transform"
                style={{
                  transform: elasticityOn
                    ? "translateX(16px)"
                    : "translateX(0)",
                }}
              />
            </span>
            <span className="text-base font-semibold text-[var(--foreground)]">
              Apply demand elasticity
            </span>
          </button>

          <Link
            href="/demand-elasticity"
            className="text-sm text-[var(--accent)] font-medium hover:underline shrink-0 no-underline"
            title="What is demand elasticity?"
          >
            Learn more
          </Link>
        </div>
      </div>

      {/* Chart area */}
      <div className="space-y-2.5">
        {computedData.map((industry, index) => {
          const rawValue = industry.rawDisplacement;
          const adjustedValue = industry.adjustedDisplacement;
          const displayValue = elasticityOn ? adjustedValue : rawValue;
          const isExpansion = displayValue > 0;
          const isNearZero = Math.abs(displayValue) < 3;

          // Color based on outcome
          const barColor = isExpansion
            ? "#22c55e"
            : isNearZero
              ? "#f59e0b"
              : "#ef4444";

          // Bar positioning - bars grow from the zero line
          const barLeft = displayValue < 0
            ? valueToPercent(displayValue)
            : zeroPercent;
          const barWidth = Math.abs(
            valueToPercent(displayValue) - zeroPercent
          );

          // Ghost bar (raw displacement, shown when elasticity is on)
          const ghostLeft = rawValue < 0
            ? valueToPercent(rawValue)
            : zeroPercent;
          const ghostWidth = Math.abs(
            valueToPercent(rawValue) - zeroPercent
          );

          // Animation delay for staggered stretch effect
          const staggerDelay = index * 80;

          // Elasticity magnitude affects stretch intensity
          const stretchIntensity = industry.elasticity;
          // Higher elasticity = more dramatic overshoot in the animation
          const overshootMultiplier = 1 + stretchIntensity * 0.15;

          const isHovered = hoveredId === industry.id;

          return (
            <div
              key={industry.id}
              className="group relative"
              onMouseEnter={() => setHoveredId(industry.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Label row */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {industry.label}
                  </span>
                  <span
                    className="text-2xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor:
                        industry.elasticity >= 1.0
                          ? "#22c55e15"
                          : industry.elasticity >= 0.6
                            ? "#f59e0b15"
                            : "#ef444415",
                      color:
                        industry.elasticity >= 1.0
                          ? "#22c55e"
                          : industry.elasticity >= 0.6
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  >
                    e = {industry.elasticity.toFixed(1)}
                  </span>
                </div>
                <span
                  className="text-sm font-bold tabular-nums transition-colors"
                  style={{
                    color: barColor,
                    transitionDuration: reducedMotion ? "0ms" : "300ms",
                    transitionDelay: reducedMotion
                      ? "0ms"
                      : `${staggerDelay}ms`,
                  }}
                >
                  {displayValue > 0 ? "+" : ""}
                  {Math.round(displayValue)}%
                </span>
              </div>

              {/* Bar area */}
              <div className="relative h-[28px] rounded-md bg-black/[0.02] overflow-hidden">
                {/* Zero line */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-black/[0.08] z-10"
                  style={{ left: `${zeroPercent}%` }}
                />

                {/* Ghost bar (raw displacement) - visible when elasticity is toggled on */}
                {elasticityOn && (
                  <div
                    className="absolute top-[4px] bottom-[4px] rounded-sm"
                    style={{
                      left: `${ghostLeft}%`,
                      width: `${ghostWidth}%`,
                      backgroundColor: "#94a3b830",
                      borderRight: "1px dashed #94a3b860",
                    }}
                  />
                )}

                {/* Active bar */}
                <div
                  className="absolute top-[4px] bottom-[4px] rounded-sm"
                  style={{
                    left: `${barLeft}%`,
                    width: `${barWidth}%`,
                    backgroundColor: barColor,
                    opacity: 0.85,
                    // Stretch & release animation
                    ...(reducedMotion
                      ? { transition: "none" }
                      : {
                          transition: "none",
                          animation: animating
                            ? `elasticStretch-${industry.id} 700ms cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerDelay}ms both`
                            : undefined,
                        }),
                  }}
                />

                {/* Inline keyframes via style tag - each bar gets unique overshoot */}
                {animating && !reducedMotion && (
                  <style>{`
                    @keyframes elasticStretch-${industry.id} {
                      0% {
                        transform: scaleX(1);
                        transform-origin: ${displayValue >= 0 ? "left" : "right"} center;
                      }
                      35% {
                        transform: scaleX(${overshootMultiplier.toFixed(2)});
                        transform-origin: ${displayValue >= 0 ? "left" : "right"} center;
                      }
                      55% {
                        transform: scaleX(${(1 - (overshootMultiplier - 1) * 0.3).toFixed(2)});
                        transform-origin: ${displayValue >= 0 ? "left" : "right"} center;
                      }
                      75% {
                        transform: scaleX(${(1 + (overshootMultiplier - 1) * 0.1).toFixed(2)});
                        transform-origin: ${displayValue >= 0 ? "left" : "right"} center;
                      }
                      100% {
                        transform: scaleX(1);
                        transform-origin: ${displayValue >= 0 ? "left" : "right"} center;
                      }
                    }
                  `}</style>
                )}
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute left-0 right-0 top-full mt-1 z-20 px-2">
                  <div className="bg-[#1a1a2e] text-white rounded-lg px-4 py-3 shadow-lg text-sm leading-relaxed">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold">{industry.label}</span>
                      <span className="text-white/50">|</span>
                      <span className="text-white/70">
                        Elasticity: {industry.elasticity.toFixed(1)}
                      </span>
                      <span className="text-white/50">|</span>
                      <span className="text-white/70">
                        Productivity: {industry.productivityMultiplier}x
                      </span>
                    </div>
                    <div className="flex gap-4 mb-2">
                      <div>
                        <span className="text-white/50 text-2xs uppercase tracking-wider">
                          Raw displacement
                        </span>
                        <p className="font-bold text-signal-negative">
                          {rawValue}%
                        </p>
                      </div>
                      <div>
                        <span className="text-white/50 text-2xs uppercase tracking-wider">
                          After elasticity
                        </span>
                        <p
                          className="font-bold"
                          style={{
                            color: adjustedValue > 0 ? "#22c55e" : "#ef4444",
                          }}
                        >
                          {adjustedValue > 0 ? "+" : ""}
                          {Math.round(adjustedValue)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-white/50 text-2xs uppercase tracking-wider">
                          Delta
                        </span>
                        <p className="font-bold text-accent">
                          {adjustedValue - rawValue > 0 ? "+" : ""}
                          {Math.round(adjustedValue - rawValue)}pp
                        </p>
                      </div>
                    </div>
                    <p className="text-white/60 text-xs">
                      {industry.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Axis labels */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-2xs text-[var(--muted)] font-medium">
          Displacement
        </span>
        <span className="text-2xs text-[var(--muted)] font-medium">
          Expansion
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-card">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-signal-negative opacity-85" />
          <span className="text-xs text-[var(--muted)]">
            Net displacement
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-signal-positive opacity-85" />
          <span className="text-xs text-[var(--muted)]">
            Net expansion
          </span>
        </div>
        {elasticityOn && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-2 rounded-sm"
              style={{
                backgroundColor: "#94a3b830",
                border: "1px dashed #94a3b860",
              }}
            />
            <span className="text-xs text-[var(--muted)]">
              Raw displacement (without elasticity)
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-2xs font-medium text-[var(--muted)] bg-black/[0.04] px-1.5 py-0.5 rounded-full">
            e = elasticity
          </span>
          <span className="text-xs text-[var(--muted)]">
            &gt;1.0 = elastic, &lt;1.0 = inelastic
          </span>
        </div>
      </div>
    </div>
  );
}
