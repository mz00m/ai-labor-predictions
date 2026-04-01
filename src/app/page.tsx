import Link from "next/link";
import { getAllPredictions, getLastUpdated, getHeroStats } from "@/lib/data-loader";
import { getSourceCount } from "@/lib/search-sources";
import NewsTicker from "@/components/NewsTicker";
import FeaturedReads from "@/components/FeaturedReads";
import FunnelStrip from "@/components/FunnelStrip";
import SectionBar from "@/components/SectionBar";
import HeroTriad from "@/components/HeroTriad";
import SplitFlapWord from "@/components/SplitFlapWord";
import ScrollReveal from "@/components/ScrollReveal";
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
            <Link href="/predictions" className="hover:opacity-70 transition-opacity">{predictions.length} predictions</Link> &middot; <Link href="/research" className="hover:opacity-70 transition-opacity">{totalSources} sources</Link>
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
            No measurable job displacement, <SplitFlapWord />
          </p>

          {/* Hero data triad - numbers emerge from behind the ticker, dissolve upward */}
          <HeroTriad
            projectedJobLoss={heroStats.projectedJobLoss}
            projectedEstimateCount={heroStats.projectedEstimateCount}
            projectedLow={heroStats.projectedLow}
            projectedHigh={heroStats.projectedHigh}
            measuredJobLoss={heroStats.measuredJobLoss}
          />
        </div>

        {/* News Ticker - overlaps the bottom of the numbers, clipping them */}
        <div className="relative z-[3] -mt-6">
          <NewsTicker />
        </div>

        {/* Essential Reading - compact strip under ticker */}
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

      {/* Evidence Funnel */}
      <section className="mt-20">
        <FunnelStrip />
      </section>

      {/* Featured Section Bars */}
      <div className="mt-10">
        <SectionBar
          title="How Will AI Affect Your Job?"
          description="AI doesn't replace whole jobs. It automates specific tasks. Explore which parts of 110+ occupations covering ~67% of US employment are exposed and which remain human-dependent."
          href="/task-visualizer"
          tag="Task visualizer"
          accentColor="#3ECFAE"
          watermark={<TaskVisualizerWatermark color="#3ECFAE" />}
          stat={{ value: "110+", label: "occupations" }}
          featured
        />

        <SectionBar
          title={`${predictions.length} Predictions for How AI Will Impact Jobs`}
          description={`Displacement, wages, and adoption: each with trend data, source quality ratings, and a weighted estimate from ${totalSources}+ sources.`}
          href="/predictions"
          tag="Predictions"
          accentColor="#6B7BF7"
          watermark={<PredictionsWatermark color="#6B7BF7" />}
          stat={{ value: `${totalSources}+`, label: "sources" }}
          featured
        />

        <SectionBar
          title="What if AI Creates More Jobs Than It Displaces"
          description="Very possible based on historic data. Every general-purpose technology eventually created more jobs than it displaced, and AI may be no different."
          href="/demand-elasticity"
          tag="Demand elasticity"
          accentColor="#34D399"
          watermark={<DemandElasticityWatermark color="#34D399" />}
          featured
        />
      </div>

      {/* Important Concepts divider */}
      <div className="mt-12 mb-2 -mx-6 sm:-mx-10 px-6 sm:px-10">
        <div className="border-t border-black/[0.08]" />
        <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] opacity-60">
          Important Concepts
        </p>
      </div>

      {/* Concept Section Bars */}
      <div>
        <ScrollReveal>
          <SectionBar
            title="Why Is Nothing Changing?"
            description="40% of jobs are AI-exposed, but near-zero have measurably vanished. Follow the evidence funnel from exposure through productivity to actual displacement across 15 studies."
            href="/j-curve"
            tag="J-Curve"
            accentColor="#F7C96B"
            watermark={<EconomyFunnelWatermark color="#F7C96B" />}
            stat={{ value: "15", label: "studies" }}
          />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <SectionBar
            title="What Happens When 1 Worker Equals 2"
            description="Workers using AI are 20-40% faster at individual tasks. But the economy isn't growing faster. Understanding that gap is the key to predicting what comes next."
            href="/productivity"
            tag="Productivity"
            accentColor="#3B4494"
            watermark={<ProductivityWatermark color="#3B4494" />}
            stat={{ value: "~0%", label: "GDP effect" }}
          />
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <SectionBar
            title="We've Seen This Before"
            description="Every major technology (steam, electricity, computers) followed the same pattern: displacement first, then more jobs than before. AI is compressing that timeline."
            href="/history"
            tag="History"
            accentColor="#9A9AAF"
            watermark={<HistoryTimelineWatermark color="#9A9AAF" />}
          />
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <SectionBar
            title="Early Indicators"
            description="AI tool downloads are surging. PyPI and npm package data, SDK adoption curves, and developer activity signal where automation is landing before the labor data catches up."
            href="/signals"
            tag="Signals"
            accentColor="#F26D6D"
            watermark={<SignalsWatermark color="#F26D6D" />}
            stat={{ value: "Live", label: "data" }}
          />
        </ScrollReveal>
      </div>
    </div>
  );
}
