import { Metadata } from "next";
import { getSourceCount } from "@/lib/search-sources";

import ForecastGrid from "@/components/prediction/ForecastGrid";
import PlaceYourPrediction from "@/components/prediction/PlaceYourPrediction";
import EconomistAssessments from "@/components/prediction/EconomistAssessments";

export const metadata: Metadata = {
  title: "2030 Forecast: A Research-Backed Prediction",
  description:
    "12 evidence-weighted predictions about AI's impact on jobs, wages, and adoption by 2030. Built on 500+ sources, a 5-dimensional risk framework, and six labor economist perspectives.",
  alternates: {
    canonical: "/prediction",
  },
  openGraph: {
    title: "2030 Forecast: A Research-Backed Prediction | jobsdata.ai",
    description:
      "12 predictions about AI and the labor market, backed by 500+ sources. Place your own prediction.",
    type: "article",
  },
};

export default function PredictionPage() {
  const sourceCount = getSourceCount();

  return (
    <div className="space-y-0">
      {/* Hero */}
      <div className="relative overflow-hidden -mx-6 sm:-mx-10 px-6 sm:px-10 pt-6 sm:pt-10 pb-8">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#5C61F6]/[0.04] blur-3xl" />
          <div className="absolute -top-16 right-0 w-[350px] h-[350px] rounded-full bg-[#F66B5C]/[0.03] blur-3xl" />
        </div>

        <div className="relative max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-3">
            {sourceCount}+ sources | 5-dimension framework | 6 economist
            perspectives
          </p>
          <h1 className="text-[36px] sm:text-[50px] font-black tracking-tight text-[#2E3650] leading-[1.05]">
            My 2030 Forecast
          </h1>
          <p className="mt-4 text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
            AI will transform the labor market through{" "}
            <span className="font-semibold text-[#2E3650]">
              task recomposition
            </span>
            , not mass displacement. Aggregate employment effects will be small
            (1-3% net), but distributional effects will be dramatic: entry-level
            and routine cognitive work compressing, high-skill premiums
            expanding, freelance markets restructuring fundamentally.
          </p>
          <p className="mt-3 text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
            The primary channel is{" "}
            <span className="font-semibold text-[#2E3650]">non-hiring</span>{" "}
            -- positions that go unfilled as AI handles incremental demand --
            not firing. The median worker will see near-zero wage effects. The
            entry-level worker will feel it.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <div className="bg-black/[0.03] rounded-lg px-4 py-2.5">
              <p className="text-[24px] font-black text-[#2E3650]">12</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Predictions
              </p>
            </div>
            <div className="bg-black/[0.03] rounded-lg px-4 py-2.5">
              <p className="text-[24px] font-black text-[#2E3650]">
                {sourceCount}+
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Sources
              </p>
            </div>
          </div>
        </div>
      </div>

      <ForecastGrid />
      <PlaceYourPrediction />
      <EconomistAssessments />

      {/* Methodology footer */}
      <section className="border-t border-black/[0.06] pt-8 pb-4">
        <h2 className="text-[16px] font-bold text-[#2E3650] mb-2">
          Methodology
        </h2>
        <p className="text-[12px] text-[var(--muted)] leading-relaxed max-w-2xl">
          Each prediction synthesizes all available evidence from the jobsdata.ai
          database using the site&apos;s weighted aggregation: Tier 1 sources
          (peer-reviewed, government) weighted 4x, Tier 2 (institutional) 2x,
          Tier 3 (journalism) 1x, Tier 4 (informal) 0.5x. Recency and sample
          size provide additional weighting. Confidence intervals reflect the
          actual spread of credible estimates, not statistical confidence bands.
          The five-variable framework scores draw from employment-weighted
          averages across 22 SOC major groups covering 154.2M workers.
        </p>
        <p className="text-[12px] text-[var(--muted)] leading-relaxed max-w-2xl mt-2">
          The six-economist assessment applies the analytical frameworks of
          Acemoglu, Brynjolfsson, Gimbel, Bessen, Kolko, and Imas to this
          specific forecast. Their perspectives are synthesized from published
          work through April 2026.
        </p>
      </section>
    </div>
  );
}
