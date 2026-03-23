"use client";

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
      <div className="ml-2 pl-2 border-l border-white/[0.12] flex items-center">
        <button
          onClick={onToggleDimensionality}
          className={`text-[10px] sm:text-[11px] font-medium px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
            dimensionalityEnabled
              ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
              : "border-white/[0.12] text-white/40 hover:border-white/[0.25] hover:text-white/60"
          }`}
          title="Toggle O-Ring dimensionality adjustment on complementarity scores"
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
          O-Ring
        </button>
      </div>
    </div>
  );
}
