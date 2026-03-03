"use client";

import { useState } from "react";
import type {
  SignalMetrics,
  SignalTaxonomy,
  MonthlyDownloadsData,
  BLSEmploymentData,
  HuggingFaceData,
} from "@/lib/signal-types";
import IndustryCard from "./IndustryCard";
import IndustryDetail from "./IndustryDetail";

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

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {industries.map((ind) => (
          <div key={ind.industry} className={
            expandedIndustry === ind.industry
              ? "sm:col-span-2 lg:col-span-3"
              : ""
          }>
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
  );
}
