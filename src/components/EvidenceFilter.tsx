"use client";

import { EvidenceTier } from "@/lib/types";
import { TIER_CONFIGS } from "@/lib/evidence-tiers";

interface EvidenceFilterProps {
  selectedTiers: EvidenceTier[];
  onChange: (tiers: EvidenceTier[]) => void;
}

export default function EvidenceFilter({
  selectedTiers,
  onChange,
}: EvidenceFilterProps) {
  const handleToggle = (tier: EvidenceTier) => {
    if (selectedTiers.includes(tier)) {
      if (selectedTiers.length === 1) return;
      onChange(selectedTiers.filter((t) => t !== tier));
    } else {
      onChange([...selectedTiers, tier].sort((a, b) => a - b));
    }
  };

  const selectAll = () => onChange([1, 2, 3, 4] as EvidenceTier[]);
  const selectResearchOnly = () => onChange([1] as EvidenceTier[]);

  const allSelected = selectedTiers.length === 4;
  const researchOnly = selectedTiers.length === 1 && selectedTiers[0] === 1;

  return (
    <div className="space-y-5">
      <p className="text-[14px] text-[var(--muted)] leading-relaxed max-w-2xl italic">
        Most AI-and-jobs claims come from journalism or social media. Toggle to{" "}
        <button
          onClick={selectResearchOnly}
          className="text-emerald-600 font-semibold not-italic hover:underline cursor-pointer"
        >
          Research only
        </button>{" "}
        to see what the rigorous evidence actually says.
      </p>
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)]">
          Filter by evidence quality
        </h3>
        <div className="flex gap-3">
          <button
            onClick={selectResearchOnly}
            className={`text-[12px] font-semibold cursor-pointer ${
              researchOnly
                ? "text-emerald-600 underline underline-offset-4"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Research only
          </button>
          <button
            onClick={selectAll}
            className={`text-[12px] font-semibold cursor-pointer ${
              allSelected
                ? "text-[var(--accent)] underline underline-offset-4"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All tiers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TIER_CONFIGS.map((config) => {
          const checked = selectedTiers.includes(config.tier);
          return (
            <label
              key={config.tier}
              className={`relative cursor-pointer select-none group ${
                checked ? "opacity-100" : "opacity-35 hover:opacity-55"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleToggle(config.tier)}
                className="sr-only"
              />
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-[13px] font-bold text-[var(--foreground)]">
                  {config.label}
                </span>
              </div>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed pl-[22px]">
                {config.includes.slice(0, 3).join(" / ")}
              </p>
            </label>
          );
        })}
      </div>
    </div>
  );
}
