"use client";

import { useState } from "react";
import { DIMENSION_META, type DimensionKey } from "@/lib/composite-risk";

interface Props {
  activeDimension: DimensionKey;
  onSelect: (key: DimensionKey) => void;
  dimensionalityEnabled: boolean;
  onToggleDimensionality: () => void;
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
}: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

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
            className={`text-[11px] sm:text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all ${
              isActive
                ? isComposite
                  ? "border-white bg-white text-black"
                  : "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-white/[0.15] text-white/60 hover:border-white/[0.3] hover:text-white/90"
            }`}
          >
            {dim.shortLabel}
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
          className={`text-[10px] sm:text-[11px] font-medium px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
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
            <p className="text-[11px] text-white/70 leading-[1.6] mb-1.5">
              Jobs with fewer distinct task clusters face stronger firm incentive
              for full automation. High-dimensional jobs see augmentation via the
              &ldquo;focus effect.&rdquo; Toggle off to see scores without this
              adjustment.
            </p>
            <a
              href="#methodology-complementarity"
              className="text-[10px] text-emerald-400 hover:underline"
              onClick={() => setShowTooltip(false)}
            >
              See methodology: Dimension 5 &darr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
