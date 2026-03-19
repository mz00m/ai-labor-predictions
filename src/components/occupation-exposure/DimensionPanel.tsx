"use client";

import { DIMENSION_META, type DimensionKey } from "@/lib/composite-risk";

interface Props {
  activeDimension: DimensionKey;
  onSelect: (key: DimensionKey) => void;
}

const DIMENSION_ORDER: DimensionKey[] = [
  "netRisk",
  "technicalExposure",
  "adoptionSpeed",
  "adaptability",
  "demandElasticity",
  "complementarity",
];

export default function DimensionPanel({ activeDimension, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
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
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                  : "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-black/[0.08] text-[var(--muted)] hover:border-black/[0.15] hover:text-[var(--foreground)]"
            }`}
          >
            {dim.shortLabel}
            {dim.isPressure && !isComposite && (
              <span className="ml-1 opacity-50">+</span>
            )}
            {!dim.isPressure && (
              <span className="ml-1 opacity-50">-</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
