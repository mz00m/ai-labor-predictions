"use client";

import HeroStatWobble from "./HeroStatWobble";

/* ------------------------------------------------------------------ */
/*  Client-side hero stat triad with confidence-interval Easter egg    */
/* ------------------------------------------------------------------ */

interface HeroTriadProps {
  projectedJobLoss: number;
  projectedEstimateCount: number;
  projectedLow: number;
  projectedHigh: number;
  measuredJobLoss: number;
}

const maskStyle = {
  maskImage:
    "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)",
  WebkitMaskImage:
    "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)",
};

export default function HeroTriad({
  projectedJobLoss,
  projectedEstimateCount,
  projectedLow,
  projectedHigh,
  measuredJobLoss,
}: HeroTriadProps) {
  return (
    <div className="mt-6 relative grid grid-cols-3 place-items-center pb-6">
      {/* Productivity boost - range: 14% to 35% across studies */}
      <HeroStatWobble center={21} low={14} high={35}>
        {(displayValue, wobbling) => (
          <a
            href="#evidence-funnel"
            className="group/stat relative overflow-hidden pt-6 pb-8 sm:pb-12 px-1 sm:px-4 no-underline text-center w-full"
          >
            <span
              className={`absolute inset-x-0 -bottom-4 flex items-end justify-center stat-number text-[72px] sm:text-[150px] font-black leading-none pointer-events-none select-none transition-opacity duration-200 ${wobbling ? "opacity-[0.28]" : "opacity-[0.20] group-hover/stat:opacity-[0.28]"}`}
              style={{ color: "var(--accent)", letterSpacing: "-0.09em", ...maskStyle }}
            >
              <span className="relative">
                {displayValue ?? "21"}
                <span className="absolute left-full top-0 text-heading-xl sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">
                  %
                </span>
              </span>
            </span>
            <p className="relative z-[2] text-3xs sm:text-2xs font-bold uppercase tracking-wide sm:tracking-widest text-[var(--muted)] mb-1.5">
              <span className="text-3xs font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">
                ~
              </span>
              Productivity boost
            </p>
            <p className="relative z-[2] text-2xs sm:text-xs text-[var(--muted)] opacity-50 leading-snug">
              Median task-level gain, 18 studies
            </p>
          </a>
        )}
      </HeroStatWobble>

      {/* Projected job loss - range from actual data bounds */}
      <HeroStatWobble center={projectedJobLoss} low={projectedLow} high={projectedHigh}>
        {(displayValue, wobbling) => (
          <a
            href="/predictions/overall-us-displacement"
            className="group/stat relative overflow-hidden pt-6 pb-8 sm:pb-12 px-1 sm:px-4 no-underline text-center w-full"
          >
            <span
              className={`absolute inset-x-0 -bottom-4 flex items-end justify-center stat-number text-[72px] sm:text-[150px] font-black leading-none pointer-events-none select-none transition-colors duration-200 ${wobbling ? "text-black/[0.24]" : "text-black/[0.18] group-hover/stat:text-black/[0.24]"}`}
              style={maskStyle}
            >
              <span className="relative">
                {displayValue ?? projectedJobLoss}
                <span className="absolute left-full top-0 text-heading-xl sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">
                  %
                </span>
              </span>
            </span>
            <p className="relative z-[2] text-3xs sm:text-2xs font-bold uppercase tracking-wide sm:tracking-widest text-[var(--muted)] mb-1.5">
              <span className="text-3xs font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">
                ~
              </span>
              Projected job loss
            </p>
            <p className="relative z-[2] text-2xs sm:text-xs text-[var(--muted)] opacity-50 leading-snug">
              Weighted avg of {projectedEstimateCount} data points
            </p>
          </a>
        )}
      </HeroStatWobble>

      {/* Measured job loss - range: -0.5% to 0.5% */}
      <HeroStatWobble center={measuredJobLoss} low={-0.5} high={0.5}>
        {(displayValue, wobbling) => (
          <a
            href="#evidence-funnel"
            className="group/stat relative overflow-hidden pt-6 pb-8 sm:pb-12 px-1 sm:px-4 no-underline text-center w-full"
          >
            <span
              className={`absolute inset-x-0 -bottom-4 flex items-end justify-center stat-number text-[72px] sm:text-[150px] font-black leading-none pointer-events-none select-none transition-colors duration-200 ${wobbling ? "text-emerald-600/[0.28]" : "text-emerald-600/[0.20] group-hover/stat:text-emerald-600/[0.28]"}`}
              style={maskStyle}
            >
              <span className="relative">
                {displayValue ?? measuredJobLoss}
                <span className="absolute left-full top-0 text-heading-xl sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">
                  %
                </span>
              </span>
            </span>
            <p className="relative z-[2] text-3xs sm:text-2xs font-bold uppercase tracking-wide sm:tracking-widest text-[var(--muted)] mb-1.5">
              <span className="text-3xs font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">
                ~
              </span>
              Measured job loss
            </p>
            <p className="relative z-[2] text-2xs sm:text-xs text-[var(--muted)] opacity-50 leading-snug">
              Yale, NBER, Dallas Fed, ECB
            </p>
          </a>
        )}
      </HeroStatWobble>
    </div>
  );
}
