import { getAllPredictions, getLastUpdated, getHeroStats } from "@/lib/data-loader";
import { getSourceCount } from "@/lib/search-sources";
import NewsTicker from "@/components/NewsTicker";
import FeaturedReads from "@/components/FeaturedReads";
import SectionBar from "@/components/SectionBar";
import {
  PredictionsWatermark,
  TaskVisualizerWatermark,
  EconomyFunnelWatermark,
  HistoryTimelineWatermark,
  SignalsWatermark,
  ProductivityWatermark,
  DemandElasticityWatermark,
} from "@/components/section-watermarks";

const predictions = getAllPredictions();
const lastUpdated = getLastUpdated();
const heroStats = getHeroStats();

function formatUpdatedDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `Updated ${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

export default function Home() {
  const totalSources = getSourceCount();

  return (
    <div className="space-y-0">
      {/* Hero */}
      <div className="relative overflow-hidden -mx-6 sm:-mx-10 px-6 sm:px-10 pt-1 pb-0 sm:pt-2 sm:pb-0">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#5C61F6]/[0.04] blur-3xl" />
          <div className="absolute -top-16 right-0 w-[350px] h-[350px] rounded-full bg-[#5C61F6]/[0.03] blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-[280px] h-[280px] rounded-full bg-[#3b82f6]/[0.02] blur-3xl" />
          {/* Subtle grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" aria-hidden="true">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative">
          <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
            {predictions.length} predictions &middot; {totalSources} sources
            <span className="opacity-50 mx-1">&middot;</span>
            <span className="normal-case font-semibold opacity-70">{formatUpdatedDate(lastUpdated)}</span>
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-black tracking-tight text-[#2E3650] leading-[1.05] max-w-4xl">
            How is AI <span className="text-[#F66B5C] italic">reshaping</span>
            <br className="hidden sm:block" /> the labor market?
          </h1>
          <p className="mt-4 text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
            ~{totalSources} sources, one pattern. AI adoption is accelerating, productivity is climbing,
            entry-level and freelance work is compressing, and jobs are changing faster than
            they&apos;re disappearing.
          </p>
          <p className="mt-3 text-[20px] sm:text-[22px] font-bold text-[#2E3650] leading-snug max-w-2xl">
            No measurable macro displacement, <span className="text-[#F66B5C] italic">yet.</span>
          </p>

          {/* Hero data triad — numbers emerge from behind the ticker, dissolve upward */}
          <div className="mt-6 relative grid grid-cols-3 pb-6">
            <a href="/research" className="group/stat relative overflow-hidden pt-6 pb-12 px-4 no-underline text-center">
              <span className="absolute inset-x-0 -bottom-4 flex items-end justify-center stat-number text-[120px] sm:text-[150px] font-black leading-none pointer-events-none select-none transition-opacity duration-200 opacity-[0.15] group-hover/stat:opacity-[0.25]" style={{ color: 'var(--accent)', letterSpacing: '-0.09em', maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)' }}>21<span className="text-[50px] sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">%</span></span>
              <p className="relative z-[2] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5"><span className="text-[9px] font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">~</span>Productivity boost</p>
              <p className="relative z-[2] text-[11px] text-[var(--muted)] opacity-50 leading-snug">Median of 18 studies</p>
            </a>
            <a href="/predictions" className="group/stat relative overflow-hidden pt-6 pb-12 px-4 no-underline text-center">
              <span className="absolute inset-x-0 -bottom-4 flex items-end justify-center stat-number text-[120px] sm:text-[150px] font-black leading-none pointer-events-none select-none transition-colors duration-200 text-black/[0.10] group-hover/stat:text-black/[0.20]" style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)' }}>{heroStats.projectedJobLoss}<span className="text-[50px] sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">%</span></span>
              <p className="relative z-[2] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5"><span className="text-[9px] font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">~</span>Projected job loss</p>
              <p className="relative z-[2] text-[11px] text-[var(--muted)] opacity-50 leading-snug">Weighted avg of {heroStats.projectedEstimateCount} estimates</p>
            </a>
            <a href="/predictions" className="group/stat relative overflow-hidden pt-6 pb-12 px-4 no-underline text-center">
              <span className="absolute inset-x-0 -bottom-4 flex items-end justify-center stat-number text-[120px] sm:text-[150px] font-black leading-none pointer-events-none select-none transition-colors duration-200 text-emerald-600/[0.12] group-hover/stat:text-emerald-600/[0.25]" style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)' }}>{heroStats.measuredJobLoss}<span className="text-[50px] sm:text-[60px] font-normal opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 ml-0.5">%</span></span>
              <p className="relative z-[2] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5"><span className="text-[9px] font-light opacity-0 group-hover/stat:opacity-40 transition-opacity duration-200 mr-0.5">~</span>Measured job loss</p>
              <p className="relative z-[2] text-[11px] text-[var(--muted)] opacity-50 leading-snug">Yale, Goldman, Dallas Fed</p>
            </a>
          </div>
        </div>

        {/* News Ticker — overlaps the bottom of the numbers, clipping them */}
        <div className="relative z-[3] -mt-6">
          <NewsTicker />
        </div>

        {/* Essential Reading — compact strip under ticker */}
        <div className="relative mt-4 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
            Important Reads This Week{" "}
            <span className="opacity-50">|</span>{" "}
            <span className="normal-case font-semibold">
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            {" "}<span className="opacity-50">|</span>{" "}
            <a href="/learn/reading-list" className="normal-case font-semibold opacity-60 hover:opacity-100 transition-opacity">
              See all &rarr;
            </a>
          </p>
          <FeaturedReads />
        </div>
      </div>

      {/* Section Bars */}
      <div className="mt-10">
        <SectionBar
          title={`${predictions.length} Predictions for How AI Will Impact Jobs`}
          description={`Displacement, wages, and adoption — each with trend data, source quality ratings, and a weighted estimate from ${totalSources}+ sources.`}
          href="/predictions"
          tag="Predictions"
          accentColor="#6B7BF7"
          watermark={<PredictionsWatermark color="#6B7BF7" />}
          stat={{ value: `${totalSources}+`, label: "sources" }}
        />

        <SectionBar
          title="See How It Will Impact Your Job"
          description="AI doesn't replace whole jobs — it automates specific tasks. Explore which parts of 800+ occupations are exposed and which remain human-dependent."
          href="/task-visualizer"
          tag="Task visualizer"
          accentColor="#3ECFAE"
          watermark={<TaskVisualizerWatermark color="#3ECFAE" />}
          stat={{ value: "800+", label: "occupations" }}
        />

        <SectionBar
          title="Why Is Nothing Changing?"
          description="40% of jobs are AI-exposed, but near-zero have measurably vanished. Follow the evidence funnel from exposure through productivity to actual displacement across 15 studies."
          href="/task-visualizer/economy"
          tag="J-Curve"
          accentColor="#F7C96B"
          watermark={<EconomyFunnelWatermark color="#F7C96B" />}
          stat={{ value: "15", label: "studies" }}
        />

        <SectionBar
          title="What Happens When 1 Worker Equals 2"
          description="Workers using AI are 20-40% faster at individual tasks. But the economy isn't growing faster. Understanding that gap is the key to predicting what comes next."
          href="/productivity"
          tag="Productivity"
          accentColor="#3B4494"
          watermark={<ProductivityWatermark color="#3B4494" />}
          stat={{ value: "~0%", label: "GDP effect" }}
        />

        <SectionBar
          title="We've Seen This Before"
          description="Every major technology — steam, electricity, computers — followed the same pattern: displacement first, then more jobs than before. AI is compressing that timeline."
          href="/history"
          tag="History"
          accentColor="#9A9AAF"
          watermark={<HistoryTimelineWatermark color="#9A9AAF" />}
        />

        <SectionBar
          title="Early Indicators"
          description="AI tool downloads are surging — PyPI and npm package data, SDK adoption curves, and developer activity signal where automation is landing before the labor data catches up."
          href="/signals"
          tag="Signals"
          accentColor="#F26D6D"
          watermark={<SignalsWatermark color="#F26D6D" />}
          stat={{ value: "Live", label: "data" }}
        />

        <SectionBar
          title="What if AI Creates More Jobs Than It Changes?"
          description="Very possible based on historic data. Every general-purpose technology eventually created more jobs than it displaced — and AI may be no different."
          href="/demand-elasticity"
          tag="Demand elasticity"
          accentColor="#34D399"
          watermark={<DemandElasticityWatermark color="#34D399" />}
        />
      </div>
    </div>
  );
}
