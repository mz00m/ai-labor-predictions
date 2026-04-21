"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  const [copiedSector, setCopiedSector] = useState<string | null>(null);

  // Initialize from ?sector= URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sector = params.get("sector");
    if (sector) {
      setExpandedIndustry(sector);
      // Scroll to the signals section after a tick
      setTimeout(() => {
        const el = document.getElementById("industry-grid");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  const toggle = useCallback((industry: string) => {
    setExpandedIndustry((prev) => {
      const next = prev === industry ? null : industry;
      const url = new URL(window.location.href);
      if (next) {
        url.searchParams.set("sector", next);
      } else {
        url.searchParams.delete("sector");
      }
      window.history.replaceState(null, "", url.toString());
      return next;
    });
  }, []);

  const handleShare = useCallback((industryKey: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sector", industryKey);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedSector(industryKey);
      setTimeout(() => setCopiedSector(null), 2000);
    });
  }, []);

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
    <div id="industry-grid" className="space-y-8">
      {grouped.map(
        (group) =>
          group.industries.length > 0 && (
            <div key={group.id}>
              {/* Group label */}
              <div className="flex items-baseline gap-2.5 mb-3">
                <span
                  className="text-base font-extrabold uppercase tracking-[0.06em]"
                  style={{ color: group.color }}
                >
                  {group.label}
                </span>
                <span className="text-xs text-[var(--muted)]">
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
                      <>
                        <div className="flex items-center justify-end mt-2 mb-1 px-1">
                          <button
                            onClick={() => handleShare(ind.industry)}
                            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                            aria-label={`Copy share link for ${ind.label}`}
                          >
                            {copiedSector === ind.industry ? (
                              <>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 7l3 3 6-6"/></svg>
                                Copied
                              </>
                            ) : (
                              <>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 1H5a1 1 0 00-1 1v7a1 1 0 001 1h5a1 1 0 001-1V4L8 1z"/><path d="M8 1v3h3"/><path d="M4 4H3a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1v-1"/></svg>
                                Share {ind.label}
                              </>
                            )}
                          </button>
                        </div>
                        <IndustryDetail
                          industry={ind}
                          taxonomy={taxonomy}
                          metrics={metrics}
                          downloads={downloads}
                          bls={bls}
                          huggingface={huggingface}
                        />
                      </>
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
