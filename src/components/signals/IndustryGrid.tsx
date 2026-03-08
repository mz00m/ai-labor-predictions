"use client";

import { useState, useMemo } from "react";
import type {
  SignalMetrics,
  SignalTaxonomy,
  MonthlyDownloadsData,
  BLSEmploymentData,
  HuggingFaceData,
  IndustryMetrics,
} from "@/lib/signal-types";
import IndustryCard from "./IndustryCard";
import IndustryDetail from "./IndustryDetail";

/* ------------------------------------------------------------------ */
/*  Timeline group configuration                                       */
/* ------------------------------------------------------------------ */

interface TimelineGroup {
  id: string;
  label: string;
  description: string;
  color: string;
  test: (ind: IndustryMetrics) => boolean;
}

const TIMELINE_GROUPS: TimelineGroup[] = [
  {
    id: "now",
    label: "Now",
    description: "Automation tools surging, employment already shifting",
    color: "#dc2626",
    test: (ind) =>
      (ind.toolGrowth3m > 0.10 &&
        (ind.employmentChangeSinceNov2022 ?? 0) < -0.05) ||
      (ind.employmentChangeSinceNov2022 ?? 0) < -0.15,
  },
  {
    id: "next",
    label: "Next",
    description: "Tools building fast, labor impact not yet visible",
    color: "#d97706",
    test: (ind) =>
      ind.toolGrowth3m > 0.05 &&
      (ind.employmentChangeSinceNov2022 ?? 0) >= -0.05 &&
      (ind.employmentChangeSinceNov2022 ?? 0) <= 0.05,
  },
  {
    id: "later",
    label: "Later",
    description: "Early-stage adoption, slower timeline to impact",
    color: "#6b7280",
    test: () => true, // catch-all
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface IndustryGridProps {
  metrics: SignalMetrics;
  taxonomy: SignalTaxonomy;
  downloads: MonthlyDownloadsData;
  bls: BLSEmploymentData;
  huggingface: HuggingFaceData;
}

export default function IndustryGrid({
  metrics,
  taxonomy,
  downloads,
  bls,
  huggingface,
}: IndustryGridProps) {
  const [expandedIndustry, setExpandedIndustry] = useState<string | null>(null);

  const toggle = (industry: string) => {
    setExpandedIndustry((prev) => (prev === industry ? null : industry));
  };

  // Industries are already sorted by tool growth in metrics
  const industries = metrics.industries;

  // Group industries into Now / Next / Later based on thresholds
  const grouped = useMemo(() => {
    const claimed = new Set<string>();

    return TIMELINE_GROUPS.map((group) => {
      const matching = industries.filter((ind) => {
        if (claimed.has(ind.industry)) return false;
        if (group.id === "later") return true; // catch-all for unclaimed
        return group.test(ind);
      });

      matching.forEach((ind) => claimed.add(ind.industry));

      return { ...group, industries: matching };
    });
  }, [industries]);

  return (
    <div className="space-y-8">
      {grouped.map(
        (group) =>
          group.industries.length > 0 && (
            <div key={group.id}>
              {/* Group label */}
              <div className="flex items-baseline gap-2.5 mb-3">
                <span
                  className="text-[13px] font-extrabold uppercase tracking-[0.06em]"
                  style={{ color: group.color }}
                >
                  {group.label}
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  {group.description}
                </span>
              </div>

              {/* Industry cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.industries.map((ind) => (
                  <div
                    key={ind.industry}
                    className={
                      expandedIndustry === ind.industry
                        ? "sm:col-span-2 lg:col-span-3"
                        : ""
                    }
                  >
                    <IndustryCard
                      industry={ind}
                      isExpanded={expandedIndustry === ind.industry}
                      onToggle={() => toggle(ind.industry)}
                    />
                    {expandedIndustry === ind.industry && (
                      <IndustryDetail
                        industry={ind}
                        taxonomy={taxonomy}
                        metrics={metrics}
                        downloads={downloads}
                        bls={bls}
                        huggingface={huggingface}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
