"use client";

import { useState } from "react";
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
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 mr-1">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-[var(--muted)]">
            Evidence
          </h3>
          <Tooltip
            content={
              "Tier 1: RCTs, peer-reviewed journals, government data\n" +
              "Tier 2: Think tanks, intl orgs, prediction markets\n" +
              "Tier 3: Major news outlets, trade publications\n" +
              "Tier 4: Twitter/X, Reddit, blogs, podcasts"
            }
          />
        </div>
        {TIER_CONFIGS.map((config) => {
          const checked = selectedTiers.includes(config.tier);
          return (
            <button
              key={config.tier}
              onClick={() => handleToggle(config.tier)}
              title={`${config.label}: ${config.description}\n${config.includes.join(", ")}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium cursor-pointer transition-all border ${
                checked
                  ? "opacity-100 border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
                  : "opacity-40 border-transparent hover:opacity-60 text-[var(--muted)]"
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
              {config.label}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3">
        <button
          onClick={selectResearchOnly}
          className={`text-[12px] font-semibold cursor-pointer ${
            researchOnly
              ? "text-[var(--accent)] underline underline-offset-4"
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
  );
}

function Tooltip({ content }: { content: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-[var(--muted)] border border-[var(--border)] cursor-help hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors">
        ?
      </span>
      {visible && (
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-72 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-lg px-3 py-2.5 text-[11px] leading-relaxed text-[var(--muted)] whitespace-pre-line pointer-events-none">
          {content}
        </span>
      )}
    </span>
  );
}
