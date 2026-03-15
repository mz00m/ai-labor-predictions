"use client";

import { useState, useEffect, useRef } from "react";
import { EvidenceTier } from "@/lib/types";
import { TIER_CONFIGS } from "@/lib/evidence-tiers";

interface EvidenceFilterProps {
  selectedTiers: EvidenceTier[];
  onChange: (tiers: EvidenceTier[]) => void;
  tierCounts?: Record<number, number>;
  /** Makes the bar stick below the navbar when scrolled past */
  sticky?: boolean;
}

export default function EvidenceFilter({
  selectedTiers,
  onChange,
  tierCounts,
  sticky = false,
}: EvidenceFilterProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!sticky || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-48px 0px 0px 0px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sticky]);

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
    <>
      {sticky && <div ref={sentinelRef} className="h-0 w-0" aria-hidden />}
      <div
        className={`transition-all duration-200 ${
          sticky
            ? `sticky top-12 z-40 -mx-6 sm:-mx-10 px-6 sm:px-10 ${
                isStuck
                  ? "bg-white/95 backdrop-blur-sm border-b border-black/[0.06] py-1.5"
                  : "rounded-lg bg-[#f0f1ff]/60 dark:bg-[#1e1e3a]/40 px-4 py-3"
              }`
            : "rounded-lg bg-[#f0f1ff]/60 dark:bg-[#1e1e3a]/40 px-4 py-3"
        }`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-0">
            <h3
              className={`font-bold uppercase tracking-widest text-[var(--muted)] mr-3 transition-all duration-200 ${
                isStuck ? "text-[0px] w-0 mr-0 opacity-0 overflow-hidden" : "text-[12px]"
              }`}
            >
              Filter by evidence tiers
            </h3>
            {TIER_CONFIGS.map((config, i) => {
              const checked = selectedTiers.includes(config.tier);
              const count = tierCounts?.[config.tier];
              return (
                <TierButton
                  key={config.tier}
                  config={config}
                  checked={checked}
                  count={count}
                  isLast={i === TIER_CONFIGS.length - 1}
                  compact={isStuck}
                  onClick={() => handleToggle(config.tier)}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={selectResearchOnly}
              className={`font-semibold cursor-pointer transition-colors duration-150 ${
                isStuck ? "text-[11px]" : "text-[12px]"
              } ${
                researchOnly
                  ? "text-[var(--accent)] underline underline-offset-4"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Research only
            </button>
            {isStuck && <span className="text-black/[0.1]">|</span>}
            <button
              onClick={selectAll}
              className={`font-semibold cursor-pointer transition-colors duration-150 ${
                isStuck ? "text-[11px]" : "text-[12px]"
              } ${
                allSelected
                  ? "text-[var(--accent)] underline underline-offset-4"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {isStuck ? "All" : "All tiers"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TierButton({
  config,
  checked,
  count,
  isLast,
  compact,
  onClick,
}: {
  config: (typeof TIER_CONFIGS)[number];
  checked: boolean;
  count?: number;
  isLast: boolean;
  compact: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const label = compact ? config.shortLabel : config.label;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        className={`relative inline-flex items-center gap-1.5 text-[12px] font-medium cursor-pointer transition-all duration-200 ${
          compact ? "px-3 sm:px-4 py-2.5" : "px-3 py-1.5"
        } ${
          !isLast && !compact ? "border-r border-[var(--border)]" : ""
        } ${
          checked
            ? "text-[var(--foreground)]"
            : "opacity-40 hover:opacity-70 text-[var(--muted)]"
        } hover:bg-[var(--border)]/30`}
      >
        <span
          className={`inline-block rounded-full flex-shrink-0 transition-all duration-200 ${
            compact ? "w-1.5 h-1.5" : "w-2 h-2"
          }`}
          style={{ backgroundColor: config.color }}
        />
        <span className={compact ? "hidden sm:inline" : ""}>{label}</span>
        {compact && checked && (
          <span
            className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-[2px] rounded-full"
            style={{ backgroundColor: config.color }}
          />
        )}
      </button>

      {hovered && !compact && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-72 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] shadow-xl px-4 py-3 pointer-events-none">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-[13px] font-semibold text-white">
              {config.label}
            </span>
          </div>
          <p className="text-[11px] text-[#a0a0b8] mb-2 leading-relaxed">
            {config.description}
          </p>
          <ul className="space-y-0.5 mb-2">
            {config.includes.map((item) => (
              <li
                key={item}
                className="text-[11px] text-[#8a8aa0] leading-relaxed pl-2.5 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-[#4a4a5e]"
              >
                {item}
              </li>
            ))}
          </ul>
          {count != null && (
            <div className="text-[11px] text-[#6a6a80] pt-1.5 border-t border-[#2a2a3e]">
              {count} source{count !== 1 ? "s" : ""} on site
            </div>
          )}
        </div>
      )}
    </span>
  );
}
