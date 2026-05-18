"use client";

import { useState } from "react";
import { DIMENSION_META, type DimensionKey } from "@/lib/composite-risk";

interface Props {
  activeDimension: DimensionKey;
  onSelect: (key: DimensionKey) => void;
  dimensionalityEnabled: boolean;
  onToggleDimensionality: () => void;
  rlFeasibilityEnabled?: boolean;
  onToggleRlFeasibility?: () => void;
}

const DIMENSION_ORDER: DimensionKey[] = [
  "netRisk",
  "technicalExposure",
  "adoptionSpeed",
  "adaptability",
  "demandElasticity",
  "complementarity",
];

export default function DimensionPanel({
  activeDimension,
  onSelect,
  dimensionalityEnabled,
  onToggleDimensionality,
  rlFeasibilityEnabled = false,
  onToggleRlFeasibility,
}: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showRlTooltip, setShowRlTooltip] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {DIMENSION_ORDER.map((key) => {
        const dim = DIMENSION_META[key];
        const isActive = activeDimension === key;
        const isComposite = key === "netRisk";

        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border transition-all ${
              isActive
                ? isComposite
                  ? "border-white bg-white text-black"
                  : "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-white/[0.15] text-white/60 hover:border-white/[0.3] hover:text-white/90"
            }`}
          >
            {key === "technicalExposure" && rlFeasibilityEnabled
              ? "RL Feas."
              : dim.shortLabel}
            {dim.isPressure && !isComposite && (
              <span className="ml-1 opacity-50">+</span>
            )}
            {!dim.isPressure && (
              <span className="ml-1 opacity-50">&minus;</span>
            )}
          </button>
        );
      })}

      {/* Dimensionality toggle */}
      <div className="ml-2 pl-2 border-l border-white/[0.12] flex items-center relative">
        <button
          onClick={onToggleDimensionality}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`text-2xs sm:text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
            dimensionalityEnabled
              ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
              : "border-white/[0.12] text-white/40 hover:border-white/[0.25] hover:text-white/60"
          }`}
        >
          <span
            className={`inline-block w-[26px] h-[14px] rounded-full relative transition-colors ${
              dimensionalityEnabled ? "bg-emerald-500/40" : "bg-white/[0.1]"
            }`}
          >
            <span
              className={`absolute top-[2px] w-[10px] h-[10px] rounded-full transition-all ${
                dimensionalityEnabled
                  ? "left-[14px] bg-emerald-400"
                  : "left-[2px] bg-white/40"
              }`}
            />
          </span>
          Dimensionality
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-[#1a1a24] border border-white/[0.12] rounded-lg px-3 py-2.5 shadow-xl z-30 pointer-events-auto">
            <p className="text-xs text-white/70 leading-[1.6] mb-1.5">
              Adjusts complementarity scores based on job dimensionality &mdash;
              the number of distinct task clusters (&ge;10% time share). Jobs
              with fewer clusters face stronger firm incentive for full
              automation; high-dimensional jobs see augmentation via the
              &ldquo;focus effect.&rdquo;
            </p>
            <p className="text-xs text-white/50 leading-[1.6] mb-1.5">
              When enabled, highlights occupations where dimensionality
              increases net risk above 4.0 &mdash; the highest-risk jobs where
              low task complexity makes automation pressure materially worse.
            </p>
            <a
              href="#methodology-complementarity"
              className="text-2xs text-emerald-400 hover:underline"
              onClick={() => setShowTooltip(false)}
            >
              See methodology: Dimension 5 &darr;
            </a>
          </div>
        )}
      </div>

      {/* RL Feasibility toggle */}
      {onToggleRlFeasibility && (
        <div className="ml-1 pl-2 border-l border-white/[0.12] flex items-center relative">
          <button
            onClick={onToggleRlFeasibility}
            onMouseEnter={() => setShowRlTooltip(true)}
            onMouseLeave={() => setShowRlTooltip(false)}
            className={`text-2xs sm:text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
              rlFeasibilityEnabled
                ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
                : "border-white/[0.12] text-white/40 hover:border-white/[0.25] hover:text-white/60"
            }`}
          >
            <span
              className={`inline-block w-[26px] h-[14px] rounded-full relative transition-colors ${
                rlFeasibilityEnabled ? "bg-amber-500/40" : "bg-white/[0.1]"
              }`}
            >
              <span
                className={`absolute top-[2px] w-[10px] h-[10px] rounded-full transition-all ${
                  rlFeasibilityEnabled
                    ? "left-[14px] bg-amber-400"
                    : "left-[2px] bg-white/40"
                }`}
              />
            </span>
            RL Feasibility
          </button>

          {showRlTooltip && (
            <div className="absolute bottom-full left-0 mb-2 w-80 bg-[#1a1a24] border border-white/[0.12] rounded-lg px-3 py-2.5 shadow-xl z-30 pointer-events-auto">
              <p className="text-xs font-semibold text-amber-400 mb-1.5">
                Swap Dimension 1: RL Feasibility Index
              </p>
              <p className="text-xs text-white/70 leading-[1.6] mb-1.5">
                Replaces the default LLM exposure score (Eloundou et al.) with
                Tomei &amp; Klein Teeselink&rsquo;s RL Feasibility Index &mdash;
                a forward-looking measure of how amenable each occupation&rsquo;s
                tasks are to reinforcement learning automation.
              </p>
              <p className="text-xs text-white/50 leading-[1.6] mb-1.5">
                The two indices correlate at 0.88 overall but drop to{" "}
                <span className="text-white/80 font-semibold">0.15</span> within
                digitally feasible tasks. Monitoring/control roles (power plant
                operators, railroad conductors) score high on RL but low on LLM
                exposure. Creative/leadership roles show the reverse.
              </p>
              <p className="text-2xs text-white/40 leading-[1.5]">
                Source: arXiv 2605.02598 (May 2026). 17,951 O*NET tasks scored
                across 8 RL-training dimensions.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
