"use client";

import HeroStatWobble from "./HeroStatWobble";

/* ------------------------------------------------------------------ */
/*  Client-side hero stat triad with confidence-interval Easter egg    */
/* ------------------------------------------------------------------ */

const maskStyle = {
  maskImage:
    "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)",
  WebkitMaskImage:
    "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)",
};

/* All three stats are hand-set from a source audit (Sep 2026), not derived
   from the displacement series: that series mixes net, gross, exposure, and
   scenario estimates, so a mechanical average moved with every ingest. */
export default function HeroTriad() {
  return (
    <div className="mt-6 relative grid grid-cols-3 place-items-center pb-6">
      {/* Productivity boost - median of 8 controlled studies (% time saved), range 13-56% */}
      <HeroStatWobble center={21} low={13} high={56}>
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
              Median of 8 controlled studies; range 13–56%
            </p>
          </a>
        )}
      </HeroStatWobble>

      {/* Projected job loss - median of 5 independent net US forecasts to ~2030, range 0.6-3% */}
      <HeroStatWobble center={1} low={0.6} high={3}>
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
                {displayValue ?? "1"}
                <span className="absolute left-full top-0 text-heading-xl sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">
                  %
                </span>
              </span>
            </span>
            <p className="relative z-[2] text-3xs sm:text-2xs font-bold uppercase tracking-wide sm:tracking-widest text-[var(--muted)] mb-1.5">
              <span className="text-3xs font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">
                ~
              </span>
              Projected net job loss by 2030
            </p>
            <p className="relative z-[2] text-2xs sm:text-xs text-[var(--muted)] opacity-50 leading-snug">
              Median of 5 forecasts (0.6–3%). Gross displacement: 6–9%
            </p>
          </a>
        )}
      </HeroStatWobble>

      {/* Measured job loss - every quantified source lands at 0.1-0.2% of US employment */}
      <HeroStatWobble center={0.2} low={0} high={0.2}>
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
                {displayValue ?? "<0.2"}
                <span className="absolute left-full top-0 text-heading-xl sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">
                  %
                </span>
              </span>
            </span>
            <p className="relative z-[2] text-3xs sm:text-2xs font-bold uppercase tracking-wide sm:tracking-widest text-[var(--muted)] mb-1.5">
              <span className="text-3xs font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">
                ~
              </span>
              Measured US job loss
            </p>
            <p className="relative z-[2] text-2xs sm:text-xs text-[var(--muted)] opacity-50 leading-snug">
              Stanford, Yale, NBER, Dallas Fed · concentrated among workers 22–25
            </p>
          </a>
        )}
      </HeroStatWobble>
    </div>
  );
}
