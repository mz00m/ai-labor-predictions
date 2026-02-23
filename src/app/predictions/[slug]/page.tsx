"use client";

import { useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { EvidenceTier } from "@/lib/types";
import { getPredictionBySlug } from "@/lib/data-loader";
import { getTierConfig } from "@/lib/evidence-tiers";
import EvidenceFilter from "@/components/EvidenceFilter";
import PredictionChart from "@/components/PredictionChart";
import SourceList from "@/components/SourceList";

const CONTEXT_MAP: Record<string, (v: number) => string> = {
  "overall-us-displacement": (v) =>
    `This means roughly ${v}% of all US jobs are projected to be eliminated or fundamentally restructured by AI and automation by 2030. "Net displacement" accounts for both jobs lost and the fact that some affected roles are restructured rather than fully eliminated. For context, 1% of the US labor force is about 1.67 million workers.`,
  "total-us-jobs-lost": (v) =>
    `Of the approximately 167 million people in the US civilian labor force, about ${Math.round(167 * v / 100)} million are projected to lose their jobs outright due to AI. This differs from "displacement" in that it counts only roles fully eliminated, not those that are transformed. This figure is net of new jobs created by AI adoption.`,
  "customer-service-automation": (v) =>
    `${v}% of all customer service interactions — phone calls, chat messages, emails — are projected to be resolved entirely by AI without a human agent ever getting involved. This doesn't mean ${v}% of CS jobs disappear, since the remaining interactions may need more skilled human agents, but headcount reductions are widely expected.`,
  "tech-sector-displacement": (v) =>
    `An estimated ${v}% of tech sector roles — including software engineers, QA testers, IT support, and data analysts — face displacement from AI coding assistants, automated testing, and AI-driven operations. "Displacement" means the role ceases to exist in its current form, not that the worker is necessarily unemployed.`,
  "white-collar-professional-displacement": (v) =>
    `An estimated ${v}% of white-collar professional roles in law, accounting, and finance face displacement by 2030. LLMs can now perform contract review, financial analysis, and audit procedures at near-professional quality. The Big Four accounting firms have all announced significant restructuring plans citing AI-driven productivity. Junior and mid-level roles are most exposed, while senior advisory work remains largely protected.`,
  "creative-industry-displacement": (v) =>
    `${v}% of creative roles in design, writing, and marketing are projected to be eliminated or fundamentally restructured by generative AI. Freelance platforms like Upwork and Fiverr have already reported 20-30% declines in traditional creative gig volume. The impact is bifurcated: AI-augmented creative professionals see higher demand, while those performing routine creative tasks face steep displacement.`,
  "healthcare-admin-displacement": (v) =>
    `${v}% of healthcare administrative roles — including medical coding, billing, claims processing, scheduling, and prior authorization — are projected to be automated by AI. Healthcare administration accounts for roughly 30% of US healthcare employment and over $265B in annual costs. AI coding achieves 95% accuracy, and CMS rules now permit AI-assisted prior authorization, accelerating adoption.`,
  "education-sector-displacement": (v) =>
    `${v}% of education support roles face displacement from AI. This includes tutoring, grading, content creation, and administration — but notably not core teaching, which remains among the least automatable occupations. The collapse of companies like Chegg (subscribers down 50% due to ChatGPT) signals how quickly AI can disrupt adjacent education services even while classroom teaching persists.`,
  "high-skill-wage-premium": (v) =>
    `Workers with strong AI and machine learning skills currently earn about ${v}% more than the median worker in comparable roles. This "AI premium" reflects both scarcity of talent and the outsized productivity gains AI-skilled workers deliver. A rising premium signals that AI skills are becoming more, not less, valuable.`,
  "median-wage-impact": (v) =>
    `Real (inflation-adjusted) median wages are projected to ${v < 0 ? "fall" : "rise"} by ${Math.abs(v)}% by 2030 due to AI. This combines two offsetting forces: productivity gains (which push wages up) and displacement of mid-skill tasks (which pushes wages down). The net effect is currently estimated to be ${v < 0 ? "negative" : "positive"} for the typical worker.`,
  "freelancer-rate-impact": (v) =>
    `Average freelancer hourly rates in AI-exposed categories have ${v < 0 ? "declined" : "increased"} ${Math.abs(v)}% since the launch of ChatGPT. Writing, translation, graphic design, and data work are hardest hit. This is a critical leading indicator because freelancers feel labor market shifts 12-18 months before salaried workers — they lack the institutional buffer of employment contracts and are directly exposed to market pricing.`,
  "entry-level-wage-impact": (v) =>
    `Real wages for entry-level positions (0-2 years experience) across knowledge-work industries are projected to ${v < 0 ? "decline" : "increase"} ${Math.abs(v)}% by 2030. Entry-level workers are disproportionately affected because 35% of junior-role tasks are within current AI capability vs. 18% for senior roles. The traditional career ladder — where you learn by doing routine work — is being compressed as AI handles those learning-stage tasks.`,
  "geographic-wage-divergence": (v) =>
    `Tech and knowledge workers in AI hub cities (San Francisco, Seattle, New York, Austin) now earn ${v}% more than peers in non-hub metros for comparable roles. This gap has widened dramatically since 2022 as AI investment concentrates geographically. Each AI job in a hub city creates 3-5 additional local service jobs, amplifying the divergence through spatial multiplier effects. Remote work was expected to narrow this gap, but AI talent clustering is widening it.`,
  "ai-adoption-rate": (v) =>
    `${v}% of US companies with 50+ employees have deployed AI in production workflows, up from under 4% in early 2023. The Census Bureau's Business Trends survey provides the most rigorous measure, though adoption rates vary dramatically by sector: information and finance lead at 20-30%, while construction and agriculture remain under 5%. The pace of adoption is a key determinant of how fast displacement effects materialize.`,
  "earnings-call-ai-mentions": (v) =>
    `${v}% of S&P 500 companies now mention AI in the context of workforce, efficiency, or restructuring on their quarterly earnings calls. This is up from just 8% before ChatGPT launched in late 2022. Companies that discuss AI + workforce on calls subsequently show headcount growth 3.2 percentage points lower than non-mentioners. This metric serves as a leading indicator of corporate intent — it signals what executives are planning before the layoffs and restructuring happen.`,
};

export default function PredictionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const prediction = getPredictionBySlug(slug);

  const [selectedTiers, setSelectedTiers] = useState<EvidenceTier[]>([1, 2, 3, 4]);
  const [highlightedSourceIds, setHighlightedSourceIds] = useState<string[]>([]);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDotClick = useCallback((sourceIds: string[]) => {
    // Clear any existing highlight timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    // Set highlighted sources
    setHighlightedSourceIds(sourceIds);

    // Scroll to the first matching source
    const firstSourceId = sourceIds[0];
    if (firstSourceId) {
      const el = document.getElementById(`source-${firstSourceId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    // Clear highlight after 4 seconds
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedSourceIds([]);
    }, 4000);
  }, []);

  if (!prediction) {
    return (
      <div className="text-center py-20">
        <h1 className="text-[28px] font-bold text-[var(--foreground)]">
          Prediction not found
        </h1>
        <Link
          href="/"
          className="mt-4 inline-block text-[var(--accent)] font-medium hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const filteredHistory = prediction.history
    .filter((d) => selectedTiers.includes(d.evidenceTier))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const sortedDesc = [...filteredHistory].reverse();
  const bestEstimate = sortedDesc.find((d) => d.evidenceTier === 1) || sortedDesc[0];

  let trendInfo: { change: number; monthsApart: number } | null = null;
  if (filteredHistory.length >= 2) {
    const latest = filteredHistory[filteredHistory.length - 1];
    const latestTime = new Date(latest.date).getTime();
    const oneYearAgo = latestTime - 365 * 24 * 60 * 60 * 1000;
    let closest = filteredHistory[0];
    let closestDiff = Math.abs(new Date(filteredHistory[0].date).getTime() - oneYearAgo);
    for (const pt of filteredHistory) {
      const diff = Math.abs(new Date(pt.date).getTime() - oneYearAgo);
      if (diff < closestDiff) {
        closest = pt;
        closestDiff = diff;
      }
    }
    if (closest !== latest) {
      trendInfo = {
        change: latest.value - closest.value,
        monthsApart: Math.round(
          (latestTime - new Date(closest.date).getTime()) / (30 * 24 * 60 * 60 * 1000)
        ),
      };
    }
  }

  const trendIsBad =
    trendInfo &&
    ((prediction.category === "displacement" && trendInfo.change > 0) ||
      (prediction.category === "wages" && trendInfo.change < 0));
  const trendIsGood =
    trendInfo &&
    ((prediction.category === "displacement" && trendInfo.change < 0) ||
      (prediction.category === "wages" && trendInfo.change > 0));

  const trendColorClass = trendIsBad
    ? "text-red-600"
    : trendIsGood
      ? "text-emerald-600"
      : "text-[var(--muted)]";

  const bestSource = bestEstimate
    ? prediction.sources.find((s) => bestEstimate.sourceIds.includes(s.id))
    : null;
  const bestTierConfig = bestEstimate ? getTierConfig(bestEstimate.evidenceTier) : null;

  const contextFn = CONTEXT_MAP[prediction.slug];
  const contextText = contextFn
    ? contextFn(prediction.currentValue)
    : prediction.description;

  return (
    <div className="space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--foreground)] font-medium">
          Dashboard
        </Link>
        <span className="opacity-30">/</span>
        <span className="text-[var(--foreground)] font-medium">
          {prediction.title}
        </span>
      </div>

      {/* Header + Summary */}
      <div className="max-w-3xl">
        <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)] mb-4">
          {prediction.category === "displacement" ? "Job Displacement" : prediction.category === "wages" ? "Wage Impact" : prediction.category === "adoption" ? "AI Adoption" : "Leading Signal"} &mdash; {prediction.timeHorizon}
        </p>
        <h1 className="text-[36px] sm:text-[48px] font-black tracking-tight text-[var(--foreground)] leading-[1.05] mb-8">
          {prediction.title}
        </h1>

        {/* Big number */}
        <div className="flex items-baseline gap-4 mb-4">
          <span className="stat-number text-[56px] sm:text-[72px] font-black text-[var(--foreground)] leading-none">
            {prediction.currentValue > 0 && prediction.category === "wages" ? "+" : ""}
            {prediction.currentValue}
            <span className="text-[24px] font-normal text-[var(--muted)] ml-1">
              {prediction.unit.includes("%") ? "%" : ` ${prediction.unit}`}
            </span>
          </span>
          {trendInfo && (
            <span className={`text-[15px] font-semibold ${trendColorClass}`}>
              {trendInfo.change > 0 ? "+" : ""}
              {trendInfo.change}
              {prediction.unit.includes("%") ? "pp" : ""}{" "}
              / {trendInfo.monthsApart}mo
            </span>
          )}
        </div>

        {bestEstimate && bestEstimate.confidenceLow != null && bestEstimate.confidenceHigh != null && (
          <p className="text-[14px] text-[var(--muted)] mb-6">
            Confidence range: {bestEstimate.confidenceLow}
            {prediction.unit.includes("%") ? "%" : ""} to {bestEstimate.confidenceHigh}
            {prediction.unit.includes("%") ? "%" : ""}
          </p>
        )}

        <p className="text-[16px] text-[var(--muted)] leading-relaxed mb-6 max-w-2xl">
          {contextText}
        </p>

        {bestSource && bestTierConfig && (
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: bestTierConfig.color }}
            />
            <span className="text-[13px] text-[var(--muted)]">
              Best estimate from{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {bestSource.publisher}
              </span>
              {" "}({bestTierConfig.label})
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-black/[0.06]" />

      {/* Evidence Filter */}
      <section>
        <EvidenceFilter
          selectedTiers={selectedTiers}
          onChange={setSelectedTiers}
        />
      </section>

      {/* Chart */}
      <section>
        <h2 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight text-[var(--foreground)] mb-2">
          How This Prediction Has Evolved
        </h2>
        <p className="text-[14px] text-[var(--muted)] mb-8">
          Each data point is from a different source. Dots are color-coded by evidence tier. Click any dot to jump to its source.
        </p>
        <PredictionChart
          history={prediction.history}
          sources={prediction.sources}
          selectedTiers={selectedTiers}
          unit={prediction.unit.includes("%") ? "%" : ""}
          onDotClick={handleDotClick}
        />
      </section>

      {/* Divider */}
      <div className="border-t border-black/[0.06]" />

      {/* Sources */}
      <section>
        <SourceList
          sources={prediction.sources}
          selectedTiers={selectedTiers}
          highlightedSourceIds={highlightedSourceIds}
        />
      </section>

      {/* Market Links */}
      {prediction.marketIds && (
        <>
          <div className="border-t border-black/[0.06]" />
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)] mb-4">
              Live Prediction Markets
            </h3>
            <div className="flex gap-4 flex-wrap">
              {prediction.marketIds.metaculus && (
                <a
                  href={`https://www.metaculus.com/questions/${prediction.marketIds.metaculus}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-semibold text-[var(--accent)] hover:underline"
                >
                  Metaculus
                </a>
              )}
              {prediction.marketIds.polymarket && (
                <a
                  href={`https://polymarket.com/event/${prediction.marketIds.polymarket}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-semibold text-[var(--accent)] hover:underline"
                >
                  Polymarket
                </a>
              )}
              {prediction.marketIds.kalshi && (
                <a
                  href={`https://kalshi.com/markets/${prediction.marketIds.kalshi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-semibold text-[var(--accent)] hover:underline"
                >
                  Kalshi
                </a>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
