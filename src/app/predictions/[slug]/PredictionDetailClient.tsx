"use client";

import { useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { EvidenceTier } from "@/lib/types";
import { getPredictionBySlug } from "@/lib/data-loader";
import { getSourceCountsByTier } from "@/lib/search-sources";
import { getTierConfig } from "@/lib/evidence-tiers";
import { computeAggregate } from "@/lib/prediction-stats";
import EvidenceFilter from "@/components/EvidenceFilter";
import PredictionChart from "@/components/PredictionChart";
import AIAdoptionChart from "@/components/AIAdoptionChart";
import AdoptionLadder from "@/components/AdoptionLadder";
import SourceList from "@/components/SourceList";
import AgeWeightedMethodology from "@/components/AgeWeightedMethodology";
import ShareCiteBar from "@/components/ShareCiteBar";

const tierCounts = getSourceCountsByTier();

const CONTEXT_MAP: Record<string, (v: number) => string> = {
  "overall-us-displacement": (v) =>
    `This ${v}% is a weighted average blending two different types of evidence. Observed employment data (Yale Budget Lab, Brookings, Dallas Fed) show near-zero measurable job loss from AI so far. Forward-looking projections from economists cluster around 5\u201312% by 2030. The chart distinguishes these visually: solid dots are observed data, dashed dots are projections. For context, 1% of the US labor force is about 1.69 million workers.`,
  "customer-service-automation": (v) =>
    `${v}% of all customer service interactions (phone calls, chat messages, emails) will likely be handled by AI without a human agent ever getting involved. This doesn't mean ${v}% of CS jobs disappear, since the remaining interactions may need more skilled human agents, but headcount reductions are widely expected. Unlike software or creative work, customer service demand is relatively inelastic — consumers don't want more support interactions at lower prices. This makes displacement more likely than demand expansion in this sector.`,
  "tech-sector-displacement": (v) =>
    `The sector-wide average of ${v > 0 ? "+" : ""}${Number.isInteger(v) ? v : v.toFixed(1)}% obscures a K-shaped labor market split. Software developers aged 22-25 experienced a ~20% employment decline from late 2022 to Sept 2025 (Brynjolfsson, Chandar, Chen 2025), while workers aged 35-49 grew +9% over the same period. The primary mechanism is not mass layoffs but evaporated entry points: firms froze junior hiring as senior developers absorbed routine tasks with AI coding tools. Corroborating signals include a 30% drop in tech internships (Handshake), 25% fewer entry-level tech postings (SignalFire), and CS graduate unemployment at 7.2% vs. 4.5% for all graduates (ACS 2024). Meanwhile, BLS projects overall software developer employment to grow 17.9% through 2033, but the gains are concentrating among experienced workers who can effectively leverage AI. Note: Software has among the highest demand elasticity of any sector. When coding costs fall, firms fund projects that were previously unviable — potentially creating net new engineering roles even as per-project headcount shrinks.`,
  "white-collar-professional-displacement": (v) =>
    `An estimated ${v}% of white-collar professional roles in law, accounting, and finance could be displaced by 2030. LLMs can now perform contract review, financial analysis, and audit procedures at near-professional quality. The Big Four accounting firms have all announced significant restructuring plans citing AI-driven productivity. Junior and mid-level roles are most exposed, while senior advisory work remains largely protected.`,
  "creative-industry-displacement": (v) =>
    `${v}% of creative roles in design, writing, and marketing are projected to be eliminated or fundamentally restructured by generative AI. Freelance platforms like Upwork and Fiverr have already reported 20-30% declines in traditional creative gig volume. The impact is bifurcated: AI-augmented creative professionals see higher demand, while those performing routine creative tasks face steep displacement. A countervailing force: bespoke creative work (custom video, illustration, copywriting) was previously unaffordable for most SMBs. Lower production costs may expand the total addressable market for creative services, partially offsetting displacement in commoditized creative work.`,
  "healthcare-admin-displacement": (v) =>
    `${v}% of healthcare administrative roles (medical coding, billing, claims processing, scheduling, and prior authorization) are on track to be automated by AI. Healthcare administration accounts for roughly 30% of US healthcare employment and over $265B in annual costs. AI coding achieves 95% accuracy, and CMS rules now permit AI-assisted prior authorization, accelerating adoption. Corporate signals are emerging: Trinity Health cut 10.5% of revenue cycle staff across 92 hospitals in 15 states (Jan 2026), and Revere Health eliminated 177 billing/coding positions after adopting AI-driven claims processing. Medical coding automation is projected to reach 40%+ by 2025, with hospital AI billing adoption surging from 36% to 61% in a single year (NCBI). However, healthcare's chronic labor shortages may absorb much of the displacement through attrition rather than layoffs.`,
  "education-sector-displacement": (v) =>
    `${v}% of education support roles could be displaced by AI. This includes tutoring, grading, content creation, and administration, but notably not core teaching, which remains among the least automatable occupations. The collapse of companies like Chegg (subscribers down 50% due to ChatGPT) shows how quickly AI can disrupt adjacent education services even while classroom teaching persists. AI adoption in education is high: 92% of students use AI tools (up from 66% in 2024), 60% of teachers report using AI, and 93% of higher education staff expect to expand AI use (Ellucian). However, research consistently frames AI as augmenting educators rather than replacing them. The 33,000 higher education jobs eliminated in 2025 (BLS) were primarily driven by federal funding policy, not AI. Direct AI-specific displacement estimates remain unusually sparse for this sector, as SHRM found education has the lowest automation rate of any sector at just 7.3%.`,
  "high-skill-wage-premium": (v) =>
    `Workers with strong AI and machine learning skills currently earn about ${v}% more than the median worker in comparable roles. This "AI premium" reflects both scarcity of talent and the outsized productivity gains AI-skilled workers deliver. A rising premium signals that AI skills are becoming more, not less, valuable.`,
  "median-wage-impact": (v) =>
    `Real (inflation-adjusted) median wages are projected to ${v < 0 ? "fall" : "rise"} by ${Math.abs(v)}% by 2030 due to AI. This combines two offsetting forces: productivity gains (which push wages up) and displacement of mid-skill tasks (which pushes wages down). The net effect is currently estimated to be ${v < 0 ? "negative" : "positive"} for the typical worker.`,
  "freelancer-rate-impact": (v) =>
    `Average freelancer hourly rates in AI-exposed categories have ${v < 0 ? "dropped" : "increased"} ${Math.abs(v)}% since ChatGPT launched. Writing, translation, graphic design, and data work are hardest hit. This is an important leading indicator because freelancers feel labor market shifts 12-18 months before salaried workers. They lack the institutional buffer of employment contracts and are directly exposed to market pricing.`,
  "entry-level-wage-impact": (v) =>
    `Real wages for entry-level positions (0-2 years experience) across knowledge-work industries are projected to ${v < 0 ? "decline" : "increase"} ${Math.abs(v)}% by 2030. Entry-level workers are hit hardest because 35% of junior-role tasks are within current AI capability vs. 18% for senior roles. The traditional career ladder, where you learn by doing routine work, is being compressed as AI handles those learning-stage tasks.`,
  "workforce-ai-exposure": (v) =>
    `An estimated ${v}% of US jobs have significant task overlap with current AI capabilities. This is an exposure measure, not a displacement count. It describes what AI could theoretically do, not what has actually happened. The gap between exposure and actual displacement has been wide: while exposure estimates have risen from 25% to nearly 50%, observed macro job losses attributable to AI remain near zero. Exposure is a precondition for displacement, not a guarantee of it.`,
  "ai-adoption-rate": (v) =>
    `${v}% of US firms use AI in production according to the Census Bureau's Business Trends and Outlook Survey (BTOS), up from 3.8% in mid-2023. This is the most rigorous adoption measure available. Consultancy surveys report 5-10x higher rates (55-78%) because they sample self-selected, tech-forward companies. The Census data covers all US firms and provides the ground truth. Adoption varies dramatically by sector: information and finance lead at 20-30%, while construction and agriculture remain under 5%.`,
  "genai-work-adoption": (v) =>
    `${v}% of U.S. working-age adults (18-64) now use generative AI at work, according to the St. Louis Fed / Harvard Real-Time Population Survey, a nationally representative quarterly survey of 25,000+ adults. Overall adoption (55.9%) has outpaced both the PC and internet at comparable points post-launch. The gap between overall and work adoption is consistent with workers adopting ahead of their employers. The Nov 2024 dip in work adoption (31.0%) is real survey data, not a data error. It recovered by Feb 2025. This data updates quarterly (roughly Feb, May, Aug, Nov).`,
  "ai-business-formation": (v) =>
    `New firm creation in AI-compatible industries has increased an estimated ${v}% since ChatGPT's release in late 2022. The strongest causal evidence comes from Marchesi & Tang (2025, U of Chicago Booth), who use a difference-in-differences design exploiting variation in industry-level AI compatibility. The mechanism is reduced cost of experimentation: AI tools lower the barrier to testing business ideas, disproportionately benefiting high-ability entrepreneurs. Solo-founder share of new startups has risen from 23.7% to 36.3% over the same period (Carta). Notably, these new AI-era firms survive at higher rates and grow faster than peers, suggesting this is quality entrepreneurship, not noise.`,
  "earnings-call-ai-mentions": (v) =>
    `${v}% of S&P 500 companies now mention AI in the context of workforce, efficiency, or restructuring on their quarterly earnings calls. This is up from just 8% before ChatGPT launched in late 2022. Companies that discuss AI + workforce on calls subsequently show headcount growth 3.2 percentage points lower than non-mentioners. This is an early signal of what companies are planning: it tells you what executives intend before the layoffs and restructuring actually happen.`,
  "robots-physical-automation-displacement": (v) =>
    `An estimated ${v}% of jobs involving primarily physical and manual tasks are projected to be displaced by industrial robots, warehouse automation, and other physical AI systems by 2030. Unlike software AI which disrupts cognitive work, physical automation targets manufacturing, logistics, food service, and extraction industries. The pace is constrained by hardware costs: current industrial robots cost $150-500K per unit, and McKinsey estimates mass adoption requires costs to fall to $20-50K. Global robot installations hit 542K units in 2024 (IFR), with 4.66M robots now operational worldwide. Acemoglu & Restrepo's foundational research found each robot per thousand workers displaces about 6 jobs, but also generates productivity gains that partially offset losses.`,
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

  const agg = computeAggregate(prediction, selectedTiers);

  const filteredHistory = prediction.history
    .filter((d) => selectedTiers.includes(d.evidenceTier))
    .sort((a, b) => a.date.localeCompare(b.date));

  const bestEstimate = filteredHistory.length > 0
    ? (filteredHistory.findLast((d) => d.evidenceTier === 1) ?? filteredHistory[filteredHistory.length - 1])
    : undefined;

  const trendColorClass = agg.trendIsBad
    ? "text-[#F66B5C]"
    : agg.trend !== "flat" && !agg.trendIsBad
      ? "text-[#16a34a]"
      : "text-[var(--muted)]";

  const bestSource = bestEstimate
    ? prediction.sources.find((s) => bestEstimate.sourceIds.includes(s.id))
    : null;
  const bestTierConfig = bestEstimate ? getTierConfig(bestEstimate.evidenceTier) : null;

  const contextFn = CONTEXT_MAP[prediction.slug];
  const contextText = contextFn
    ? contextFn(agg.mean)
    : prediction.description;

  return (
    <div className="space-y-12">
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
          {prediction.category === "displacement" ? "Job Displacement" : prediction.category === "wages" ? "Wage Impact" : prediction.category === "adoption" ? "AI Adoption" : "Other"} | {prediction.timeHorizon}
        </p>
        <h1 className="text-[36px] sm:text-[48px] font-black tracking-tight text-[var(--foreground)] leading-[1.05] mb-8">
          {prediction.title}
        </h1>

        {/* Big number + source range + trend arrow */}
        <div className="flex items-baseline gap-4 mb-4">
          <span className="stat-number text-[56px] sm:text-[72px] font-black text-[var(--foreground)] leading-none">
            {agg.mean > 0 && prediction.category === "wages" ? "+" : ""}
            {Number.isInteger(agg.mean) ? agg.mean : agg.mean.toFixed(1)}
            <span className="text-[24px] font-normal text-[var(--muted)] ml-1">
              {prediction.unit.includes("%") ? "%" : ` ${prediction.unit}`}
            </span>
          </span>
          {agg.min !== agg.max && (
            <span className="text-[18px] font-medium text-[var(--muted)]" style={{ opacity: 0.7 }}>
              {agg.min}–{agg.max}{prediction.unit.includes("%") ? "%" : ""}
            </span>
          )}
          {agg.trend !== "flat" && (
            <span className={`text-[16px] font-medium ${trendColorClass}`} style={{ opacity: 0.6 }}>
              Trending {agg.trend === "up" ? "▲" : "▼"}
            </span>
          )}
        </div>

        <p className="text-[16px] text-[var(--muted)] leading-relaxed mb-3 max-w-2xl">
          {contextText}
        </p>
        {prediction.slug === "tech-sector-displacement" && (
          <div className="mb-4">
            <AgeWeightedMethodology />
          </div>
        )}
        {agg.tierFallback && (
          <p className="text-[12px] text-[#d97706] bg-[#d97706]/[0.06] border border-[#d97706]/20 rounded px-3 py-2 mb-4 max-w-2xl">
            No sources match your selected tiers for this prediction. Showing all-tier average instead.
          </p>
        )}
        <p className="text-[13px] text-[var(--muted)] opacity-60 mb-6 max-w-2xl">
          {prediction.timeHorizon.toLowerCase().includes("current")
            ? "This is observed data from real-world surveys and measurements, not a prediction."
            : `Blended estimate across ${filteredHistory.length} sources${agg.min !== agg.max ? ` ranging ${agg.min}–${agg.max}${prediction.unit.includes("%") ? "%" : ""}` : ""}. Higher-tier evidence and more recent data are weighted more heavily.`}{" "}
          See the{" "}
          <Link href="/about#how-we-calculate" className="underline hover:text-[var(--foreground)]">
            full methodology
          </Link>{" "}
          for details on weighting, source validity, and recency bias.
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

      {/* Share / Cite / Embed — tighter to stat section */}
      <div className="-mt-4">
        <ShareCiteBar
          slug={prediction.slug}
          title={prediction.title}
          value={agg.mean}
          unit={prediction.unit}
          sourceCount={prediction.sources.length}
          timeHorizon={prediction.timeHorizon}
        />
      </div>

      {/* Section break — Indicators & Predictions */}
      <div className="relative -mx-6 sm:-mx-10 -mt-4">
        <div className="h-1 bg-gradient-to-r from-[#5C61F6] via-[#E8A090] to-[#F66B5C]" />
        <div className="px-6 sm:px-10 pt-8 pb-2">
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight text-[var(--foreground)] leading-tight mb-3">
            {prediction.timeHorizon.toLowerCase().includes("current")
              ? "Indicators Over Time"
              : "Predictions Over Time"}
          </h2>
          <p className="text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
            The chart below tracks how this estimate has shifted over time as new research and data emerge. Every source is color-coded by evidence quality; use the tiers below to filter what appears on the chart and in the weighted average above.
          </p>
        </div>
      </div>

      {/* Evidence Filter */}
      <section>
        <EvidenceFilter
          selectedTiers={selectedTiers}
          onChange={setSelectedTiers}
          tierCounts={tierCounts}
        />
      </section>

      {/* Disclaimer callout — shown when sources use incompatible definitions */}
      {prediction.disclaimer && (
        <div className="border border-[#d97706]/20 bg-[#d97706]/[0.04] rounded-lg px-5 py-4 max-w-2xl -mt-4">
          <p className="text-[13px] text-[var(--muted)] leading-relaxed">
            <span className="font-semibold text-[#d97706]">Note:</span>{" "}
            {prediction.disclaimer}
          </p>
        </div>
      )}

      {/* Chart */}
      <section>
        {prediction.slug === "genai-work-adoption" ? (
          <>
            <p className="text-[14px] text-[var(--muted)] mb-8">
              Two trend lines from the same quarterly survey: overall generative AI use and use at work. Hollow dots indicate values estimated from the tracker chart.
            </p>
            <AIAdoptionChart />
          </>
        ) : (
          <>
            <PredictionChart
              history={prediction.history}
              sources={prediction.sources}
              selectedTiers={selectedTiers}
              unit={prediction.unit.includes("%") ? "%" : ""}
              overlays={prediction.overlays}
              onDotClick={handleDotClick}
              yAxisMax={prediction.slug === "workforce-ai-exposure" ? 100 : prediction.slug === "earnings-call-ai-mentions" ? 100 : prediction.slug === "customer-service-automation" ? 75 : prediction.slug === "ai-adoption-rate" ? 75 : prediction.slug === "entry-level-wage-impact" || prediction.slug === "freelancer-rate-impact" ? 5 : prediction.slug === "tech-sector-displacement" ? 35 : prediction.slug === "median-wage-impact" ? 10 : prediction.slug === "white-collar-professional-displacement" || prediction.slug === "overall-us-displacement" ? 25 : undefined}
              yAxisMin={prediction.slug === "entry-level-wage-impact" || prediction.slug === "freelancer-rate-impact" ? -50 : prediction.slug === "tech-sector-displacement" ? -20 : prediction.slug === "median-wage-impact" ? -10 : prediction.slug === "white-collar-professional-displacement" || prediction.slug === "overall-us-displacement" ? -25 : undefined}
              category={prediction.category}
              showTrendLine={prediction.slug !== "tech-sector-displacement"}

            />
            <p className="text-[12px] text-[var(--muted)] mt-4 opacity-70">
              Each data point is from a different source. Dots are color-coded by evidence tier. Click any dot to jump to its source.{prediction.overlays && prediction.overlays.length > 0 ? " Colored overlay bars represent relevant studies or data points that provide directional (but not exact) guidance. Click a bar to see its source." : ""}
            </p>
          </>
        )}
        {/* Adoption Ladder — directly below chart */}
        {prediction.slug === "ai-adoption-rate" && <AdoptionLadder />}
      </section>

      {/* Explore More */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
        <Link
          href="/task-visualizer"
          className="flex-1 group border border-black/[0.06] rounded-lg px-5 py-4 bg-[var(--background)] hover:border-[var(--accent)]/40 transition-colors"
        >
          <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
            Task Visualizer
          </p>
          <p className="text-[14px] text-[var(--foreground)] font-semibold group-hover:text-[var(--accent)] transition-colors">
            What parts of your job will be cheaper to do with AI?
          </p>
          <p className="text-[13px] text-[var(--muted)] mt-1">
            See which of your tasks face cost pressure from AI first.
          </p>
        </Link>
        <Link
          href="/task-visualizer/economy"
          className="flex-1 group border border-black/[0.06] rounded-lg px-5 py-4 bg-[var(--background)] hover:border-[var(--accent)]/40 transition-colors"
        >
          <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
            Full Economy Picture
          </p>
          <p className="text-[14px] text-[var(--foreground)] font-semibold group-hover:text-[var(--accent)] transition-colors">
            AI and the US Economy
          </p>
          <p className="text-[13px] text-[var(--muted)] mt-1">
            Automation impact by occupation and income tier.
          </p>
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-black/[0.06]" />

      {/* Sources */}
      <section>
        <SourceList
          sources={prediction.sources}
          selectedTiers={selectedTiers}
          highlightedSourceIds={highlightedSourceIds}
          overlays={prediction.overlays}
        />
      </section>

      {/* Suggest a Source */}
      <div className="border border-black/[0.06] rounded-lg px-5 py-5 bg-[var(--background)] max-w-xl">
        <p className="text-[14px] text-[var(--muted)] leading-relaxed">
          <span className="font-semibold text-[var(--foreground)]">
            Know a study we&rsquo;re missing?
          </span>{" "}
          <Link
            href={`/suggest`}
            className="underline text-[var(--accent)] hover:opacity-80"
          >
            Suggest a source
          </Link>{" "}
          for this prediction.
        </p>
      </div>

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
