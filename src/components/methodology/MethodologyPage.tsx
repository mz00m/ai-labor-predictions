"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Table of Contents ────────────────────────────────────────────── */

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "predictions", label: "Prediction Graphs" },
  { id: "evidence-tiers", label: "Evidence Tiers" },
  { id: "weighted-average", label: "Weighted Average" },
  { id: "proxy-metrics", label: "Proxy Metrics" },
  { id: "displacement-risk", label: "5-D Displacement Risk" },
  { id: "signals", label: "Automation Signals" },
  { id: "j-curve", label: "J-Curve Framework" },
  { id: "demand-elasticity", label: "Demand Elasticity" },
  { id: "historical-context", label: "Historical Context" },
  { id: "research-pipeline", label: "Research Pipeline" },
  { id: "limitations", label: "Known Limitations" },
];

/* ─── Shared Components ────────────────────────────────────────────── */

function TLDR({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#6366F1]/20 bg-accent/[0.04] p-4 sm:p-5 mb-6">
      <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">
        TL;DR
      </p>
      <div className="text-base text-[var(--foreground)] leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-3xl sm:text-heading-lg font-bold tracking-tight text-[var(--foreground)] mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DeepDive({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-card rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-black/[0.02] transition-colors"
      >
        <span className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`text-[var(--muted)] transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 text-base text-[var(--muted)] leading-relaxed space-y-3 border-t border-divider">
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-md text-[var(--muted)] leading-relaxed mb-3">
      {children}
    </p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <strong className="text-[var(--foreground)] font-semibold">{children}</strong>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-sm bg-black/[0.04] px-1.5 py-0.5 rounded font-mono">
      {children}
    </code>
  );
}

function SeeAlso({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-base font-medium text-[var(--accent-text)] hover:underline"
    >
      {label} &rarr;
    </Link>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────── */

const SOURCES = [
  "Semantic Scholar",
  "OpenAlex",
  "arXiv",
  "Scopus",
  "NBER",
  "Brookings",
  "IMF",
  "IZA",
  "CORE",
  "SEC EDGAR",
  "Adzuna Jobs",
];

const AUTHORS = [
  { name: "Erik Brynjolfsson", affiliation: "Stanford" },
  { name: "Daron Acemoglu", affiliation: "MIT" },
  { name: "David Autor", affiliation: "MIT" },
  { name: "Tyna Eloundou", affiliation: "OpenAI" },
  { name: "Daniel Rock", affiliation: "Wharton" },
  { name: "Shakked Noy", affiliation: "MIT" },
  { name: "Whitney Zhang", affiliation: "MIT" },
  { name: "R. Maria del Rio-Chanona", affiliation: "UCL / ILO" },
  { name: "Anna Salomons", affiliation: "Utrecht" },
  { name: "Pascual Restrepo", affiliation: "Boston University" },
  { name: "Carl Benedikt Frey", affiliation: "Oxford" },
  { name: "Michael Osborne", affiliation: "Oxford" },
  { name: "Ed Felten", affiliation: "Princeton" },
  { name: "Manav Raj", affiliation: "Wharton" },
  { name: "Lindsey Raymond", affiliation: "MIT" },
  { name: "Molly Kinder", affiliation: "Brookings" },
  { name: "Simon Johnson", affiliation: "MIT Sloan" },
  { name: "John Horton", affiliation: "MIT Sloan" },
  { name: "Menaka Hampole", affiliation: "Yale" },
  { name: "Dimitris Papanikolaou", affiliation: "Northwestern" },
  { name: "Sida Peng", affiliation: "Microsoft Research" },
  { name: "Fabrizio Dell'Acqua", affiliation: "Harvard" },
  { name: "James Bessen", affiliation: "Boston University" },
  { name: "Michael Webb", affiliation: "Stanford" },
  { name: "Anton Korinek", affiliation: "UVA / Brookings" },
  { name: "Avi Goldfarb", affiliation: "Toronto Rotman" },
  { name: "Ajay Agrawal", affiliation: "Toronto Rotman" },
  { name: "Chad Syverson", affiliation: "Chicago Booth" },
  { name: "Robert Gordon", affiliation: "Northwestern" },
  { name: "Philippe Aghion", affiliation: "College de France" },
  { name: "Alex Imas", affiliation: "Chicago Booth" },
  { name: "Joshua Gans", affiliation: "Toronto Rotman" },
  { name: "Andrea Filippetti", affiliation: "CNR Italy" },
  { name: "Bharat Chandar", affiliation: "Stanford" },
  { name: "Katja Mann", affiliation: "Copenhagen" },
];

/* ─── Page ─────────────────────────────────────────────────────────── */

export default function MethodologyPage({ sourceCount }: { sourceCount: number }) {
  return (
    <div className="space-y-14">
      {/* ── Header ── */}
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          Methodology
        </p>
        <h1
          className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.1] mb-4"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          How This Site Works
        </h1>
        <p className="text-prose text-[var(--muted)] leading-relaxed max-w-3xl">
          Every number on jobsdata.ai traces back to a cited source. This page
          explains how we collect, weight, combine, and present evidence across
          every section of the site.
        </p>
      </div>

      {/* ── Global TL;DR ── */}
      <TLDR>
        <p>
          jobsdata.ai is a <Strong>live meta-analysis</Strong> of AI&rsquo;s
          impact on jobs, not a forecast. We track {sourceCount}+ individually cited
          sources across 18 prediction graphs, a 5-dimensional occupation risk
          framework, and real-time automation signals. Peer-reviewed research
          (Tier 1) counts 8&times; more than blog posts (Tier 4). Newer studies
          get up to 1.5&times; more weight. The headline number on every graph
          is a weighted average that updates automatically when new research
          drops. The site covers displacement, wages, adoption, and corporate
          behavior across the US economy.
        </p>
      </TLDR>

      {/* ── Table of Contents ── */}
      <nav className="border border-card rounded-lg p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
          On This Page
        </p>
        <ol className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5">
          {TOC.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-base text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <span className="text-[var(--accent)] font-mono text-xs mr-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ════════════════════════════════════════════════════════════════
          01. OVERVIEW
      ════════════════════════════════════════════════════════════════ */}
      <Section id="overview" title="Overview">
        <TLDR>
          <p>
            This site synthesizes published research into a structured dashboard.
            It is not a model, not a forecast, and not a single team&rsquo;s
            opinion. When sources disagree, the disagreement is shown, not
            hidden.
          </p>
        </TLDR>
        <P>
          jobsdata.ai tracks how predictions about AI&rsquo;s impact on
          employment, wages, and work itself evolve as new evidence emerges. The
          site organizes research across three layers:
        </P>
        <ul className="text-md text-[var(--muted)] leading-relaxed space-y-2 mb-4 pl-5 list-disc">
          <li>
            <Strong>Prediction graphs</Strong> (16 graphs across displacement,
            wages, and adoption) &mdash; each plotting every published estimate
            we can find, weighted by evidence quality and recency.
          </li>
          <li>
            <Strong>Occupation risk framework</Strong> (342 occupations scored
            across 5 dimensions) &mdash; going beyond simple AI exposure to
            account for adoption speed, worker adaptability, demand elasticity,
            and whether AI replaces or enhances.
          </li>
          <li>
            <Strong>Automation signals</Strong> (150+ developer tools tracked by
            industry) &mdash; package downloads as a leading indicator of where
            AI automation is heading, like construction permits for software.
          </li>
        </ul>
        <P>
          Each layer has its own methodology detailed below. They share a common
          evidence tier system and a commitment to showing uncertainty honestly.
        </P>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          02. PREDICTION GRAPHS
      ════════════════════════════════════════════════════════════════ */}
      <Section id="predictions" title="Prediction Graphs">
        <TLDR>
          <p>
            16 graphs covering displacement (8), wages (4), and adoption (4).
            Each graph plots every published estimate as a data point, color-coded
            by evidence tier. The headline number is a weighted average across all
            sources. You can toggle tiers on and off to see how the number shifts.
          </p>
        </TLDR>
        <P>
          The prediction graphs are the core of the site. Each tracks a specific
          metric (e.g., &ldquo;Projected US Job Displacement from AI by
          2030&rdquo;) across all published estimates we can find.
        </P>

        <DeepDive title="What the 16 graphs cover">
          <p className="mb-3">
            <Strong>Displacement (8 graphs):</Strong> Overall US jobs, white-collar
            professionals, tech sector, creative industries, education, healthcare
            admin, financial services, and customer service automation.
          </p>
          <p className="mb-3">
            <Strong>Wages (4 graphs):</Strong> Median wage impact, entry-level
            wages, high-skill wage premium, and freelancer/gig worker rates.
          </p>
          <p>
            <Strong>Adoption &amp; Signals (4 graphs):</Strong> AI adoption rate
            (Census BTOS), generative AI adoption at work, workforce AI exposure,
            and S&amp;P 500 AI mentions in earnings calls.
          </p>
        </DeepDive>

        <DeepDive title="How each data point is classified">
          <p className="mb-3">
            Every statistic extracted from a source is classified as one of three
            types:
          </p>
          <ol className="list-decimal ml-4 space-y-2 mb-3">
            <li>
              <Strong>Direct data point</Strong> &mdash; the study&rsquo;s unit
              matches the graph&rsquo;s unit exactly. Plotted as-is.
            </li>
            <li>
              <Strong>Proxy data point</Strong> &mdash; the study measures
              something related (e.g., job posting declines as evidence for
              displacement). Converted via an empirically grounded factor and
              plotted with a 0.5&times; weight discount. See{" "}
              <a href="#proxy-metrics" className="text-[var(--accent-text)] hover:underline">
                Proxy Metrics
              </a>.
            </li>
            <li>
              <Strong>Overlay</Strong> &mdash; directional evidence only (no
              reasonable numeric conversion). Shown as an up/down/neutral band
              with a source label.
            </li>
          </ol>
          <p>
            When a study reports a range (e.g., &ldquo;20&ndash;30%&rdquo;), we
            plot the midpoint as the value with{" "}
            <Code>confidenceLow</Code> and <Code>confidenceHigh</Code> preserving
            the original range.
          </p>
        </DeepDive>

        <DeepDive title="Trend arrows">
          <p className="mb-3">
            The trend arrow on each tile compares the first and last data points
            chronologically. For graphs using the default &ldquo;weighted&rdquo;
            aggregation, only <em>observed</em> data points inform the trend
            (projections don&rsquo;t imply a trajectory). For time-series graphs
            like adoption rate, the arrow compares the earliest and latest
            measurements directly.
          </p>
          <p>
            A downward arrow means &ldquo;newer sources estimate lower,&rdquo;
            not necessarily &ldquo;the real-world metric is declining.&rdquo;
            Adding or removing a source can shift the trend.
          </p>
        </DeepDive>

        <DeepDive title="Aggregation methods">
          <p className="mb-3">
            Two aggregation modes exist:
          </p>
          <ul className="list-disc ml-4 space-y-2">
            <li>
              <Strong>Weighted average</Strong> (default) &mdash; combines all
              data points using the{" "}
              <a href="#weighted-average" className="text-[var(--accent-text)] hover:underline">
                weighting formula
              </a>{" "}
              described below. Used for projections where multiple sources
              estimate the same future quantity.
            </li>
            <li>
              <Strong>Latest value</Strong> &mdash; uses the most recent data
              point directly, ignoring earlier measurements. Used for time-series
              observed data (e.g., adoption rates) where the most recent
              measurement supersedes prior ones.
            </li>
          </ul>
        </DeepDive>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          03. EVIDENCE TIERS
      ════════════════════════════════════════════════════════════════ */}
      <Section id="evidence-tiers" title="Evidence Tiers">
        <TLDR>
          <p>
            Four tiers of source quality. Tier 1 (peer-reviewed, government data)
            gets 8&times; the weight of Tier 4 (blogs, social media). The
            dashboard works without Tier 4. You can filter by tier on every graph.
          </p>
        </TLDR>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            {
              tier: 1,
              color: "bg-green-500",
              label: "Verified Research",
              weight: "4\u00d7",
              desc: "Peer-reviewed studies (RCTs, journal articles, NBER working papers), government statistics (BLS, Census, OECD), SEC filings with legal liability for accuracy.",
            },
            {
              tier: 2,
              color: "bg-blue-500",
              label: "Institutional Analysis",
              weight: "2\u00d7",
              desc: "Think tanks (Brookings, McKinsey, RAND), international organizations (IMF, ILO, World Bank), working papers (arXiv, SSRN, IZA), industry research (Gartner, Forrester).",
            },
            {
              tier: 3,
              color: "bg-orange-500",
              label: "Journalism & Commentary",
              weight: "1\u00d7",
              desc: "Major outlets (WSJ, FT, Fortune, CNBC). Cited when they report original data or on-the-record disclosures. Powers the news feed.",
            },
            {
              tier: 4,
              color: "bg-red-500",
              label: "Social & Informal",
              weight: "0.5\u00d7",
              desc: "Twitter/X threads, Substack, blogs, podcasts. Used sparingly for ground-level signals. The dashboard works without them.",
            },
          ].map((t) => (
            <div
              key={t.tier}
              className="border border-card rounded-lg px-4 py-3.5 bg-white"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                <span className="text-base font-bold text-[var(--foreground)]">
                  Tier {t.tier} &mdash; {t.label}
                </span>
                <span className="ml-auto text-xs font-mono text-[var(--muted)]">
                  {t.weight}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>

        <DeepDive title="Edge cases in tier classification">
          <p className="mb-3">
            A Brookings <em>blog post</em> is Tier 3, not Tier 2 &mdash; the
            institution matters, but so does whether the content went through a
            review process. An SSRN working paper that hasn&rsquo;t been
            peer-reviewed is Tier 2, not Tier 1. When uncertain between tiers,
            we classify conservatively (higher tier number = lower quality).
          </p>
          <p>
            Company announcements (e.g., &ldquo;we&rsquo;re reducing headcount
            by 20%&rdquo;) are Tier 1 when reported in SEC filings and Tier 3
            when reported only in press releases or earnings calls.
          </p>
        </DeepDive>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          04. WEIGHTED AVERAGE
      ════════════════════════════════════════════════════════════════ */}
      <Section id="weighted-average" title="How We Calculate the Headline Number">
        <TLDR>
          <p>
            The large number on every prediction tile is a weighted average.
            Four factors determine each data point&rsquo;s influence: evidence
            tier, recency, sample size, and whether it&rsquo;s a direct or proxy
            measurement.
          </p>
        </TLDR>

        <P>
          The headline number is not a median, not a simple average, and not
          cherry-picked. It&rsquo;s a weighted mean where better evidence counts
          more:
        </P>

        <div className="bg-black/[0.02] border border-card rounded-lg px-4 py-3 mb-4 font-mono text-base text-[var(--foreground)]">
          weight = tierWeight &times; recencyWeight &times; sampleSizeWeight
          &times; proxyWeight
          <br />
          mean = &sum;(value &times; weight) / &sum;(weight)
        </div>

        <DeepDive title="Factor 1: Evidence tier weight" defaultOpen>
          <p>
            Tier 1 = 4&times;, Tier 2 = 2&times;, Tier 3 = 1&times;, Tier 4
            = 0.5&times;. This means a single peer-reviewed study has the same
            influence as eight blog posts. When you toggle tiers on the graph,
            the weighted average recalculates instantly with only the selected
            tiers.
          </p>
        </DeepDive>

        <DeepDive title="Factor 2: Recency weight">
          <p>
            Newer sources get more weight, scaling linearly from 1.0&times; (the
            oldest data point) to 1.5&times; (the newest). This was reduced from
            an original 2.0&times; cap to prevent a new Tier 2 source from fully
            offsetting an older Tier 1 paper. The average naturally favors the
            latest research without ignoring foundational work.
          </p>
        </DeepDive>

        <DeepDive title="Factor 3: Sample size weight">
          <p>
            Data points with sample size metadata get a log-scaled boost so that
            large-N studies (e.g., Census records covering 10M workers)
            meaningfully outweigh small-N studies (e.g., 240 freelance tasks)
            within the same tier. Range: 1.0&times; (n &le; 100) to 2.0&times;
            (n &ge; 100K). Points without sample size metadata get 1.0&times;
            (neutral).
          </p>
        </DeepDive>

        <DeepDive title="Factor 4: Proxy discount">
          <p>
            Proxy data points (indirect measurements converted via a conversion
            factor) receive 0.5&times; weight. This means a Tier 1 proxy point
            has the effective influence of a direct Tier 2 measurement. See{" "}
            <a href="#proxy-metrics" className="text-[var(--accent-text)] hover:underline">
              Proxy Metrics
            </a>{" "}
            for how conversions work.
          </p>
        </DeepDive>

        <DeepDive title="Tier fallback behavior">
          <p>
            When your selected evidence tiers have no matching data for a
            prediction, the system falls back to the all-tier weighted average
            instead of showing zero. A warning badge appears when this happens.
          </p>
        </DeepDive>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          05. PROXY METRICS
      ════════════════════════════════════════════════════════════════ */}
      <Section id="proxy-metrics" title="Proxy Metrics">
        <TLDR>
          <p>
            Many studies measure something related to but not identical to a
            graph&rsquo;s unit. Job posting declines are not the same as job
            losses. We convert proxies using empirically grounded factors, widen
            confidence bands, and apply a 0.5&times; weight discount so direct
            measurements always dominate.
          </p>
        </TLDR>

        <P>
          Plotting a 12% job posting decline on a displacement graph where
          direct measurements cluster around 3&ndash;6% creates a false outlier.
          The proxy methodology prevents this by converting indirect measurements
          to the target unit before plotting.
        </P>

        <DeepDive title="Conversion table" defaultOpen>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-strong">
                  <th className="pb-2 font-semibold text-[var(--foreground)] pr-3">Proxy Metric</th>
                  <th className="pb-2 font-semibold text-[var(--foreground)] pr-3">Target</th>
                  <th className="pb-2 font-semibold text-[var(--foreground)] pr-3">Factor</th>
                  <th className="pb-2 font-semibold text-[var(--foreground)] pr-3">Range</th>
                  <th className="pb-2 font-semibold text-[var(--foreground)]">Basis</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-divider">
                  <td className="py-2 pr-3">Job posting decline (%)</td>
                  <td className="py-2 pr-3">% jobs displaced</td>
                  <td className="py-2 pr-3 font-mono">0.35</td>
                  <td className="py-2 pr-3 font-mono">0.20&ndash;0.50</td>
                  <td className="py-2">Postings drop 2&ndash;3&times; faster than actual layoffs (Cajner et al. 2020)</td>
                </tr>
                <tr className="border-b border-divider">
                  <td className="py-2 pr-3">Task automation potential (%)</td>
                  <td className="py-2 pr-3">% jobs displaced</td>
                  <td className="py-2 pr-3 font-mono">0.30</td>
                  <td className="py-2 pr-3 font-mono">0.15&ndash;0.50</td>
                  <td className="py-2">Only ~30% of automatable tasks lead to job restructuring within 5 years (OECD 2023)</td>
                </tr>
                <tr className="border-b border-divider">
                  <td className="py-2 pr-3">Relative posting change (%)</td>
                  <td className="py-2 pr-3">% jobs displaced</td>
                  <td className="py-2 pr-3 font-mono">0.30</td>
                  <td className="py-2 pr-3 font-mono">0.15&ndash;0.45</td>
                  <td className="py-2">Relative comparisons overstate net displacement via composition effects</td>
                </tr>
                <tr className="border-b border-divider">
                  <td className="py-2 pr-3">Productivity gain (%)</td>
                  <td className="py-2 pr-3">% wage change</td>
                  <td className="py-2 pr-3 font-mono">0.40</td>
                  <td className="py-2 pr-3 font-mono">0.20&ndash;0.60</td>
                  <td className="py-2">Historical pass-through ~40% medium-term (Stansbury/Summers 2020)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Revenue automation (%)</td>
                  <td className="py-2 pr-3">% jobs displaced</td>
                  <td className="py-2 pr-3 font-mono">0.25</td>
                  <td className="py-2 pr-3 font-mono">0.10&ndash;0.40</td>
                  <td className="py-2">Revenue automation often precedes reallocation, not reduction</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DeepDive>

        <DeepDive title="How conversion works">
          <p className="mb-2">
            <Code>convertedValue = rawValue &times; conversionFactor</Code>
          </p>
          <p className="mb-3">
            Confidence bands use the range endpoints (low factor, high factor)
            to bracket the converted value. For example, a 12% posting decline
            with a 0.30 factor (range 0.15&ndash;0.45) converts to -3.6%
            [-5.4%, -1.8%] displacement.
          </p>
          <p>
            Converted proxy points are then plotted with a 0.5&times; weight
            discount, ensuring direct measurements dominate the weighted average
            when both exist.
          </p>
        </DeepDive>

        <DeepDive title="Decision tree for new sources">
          <p className="mb-2">When classifying a new statistic:</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Does the unit exactly match the graph? &rarr; Direct data point</li>
            <li>Is there a known proxy conversion? &rarr; Apply it, plot as proxy</li>
            <li>Can a new conversion be justified with empirical literature? &rarr; Add to table</li>
            <li>None of the above? &rarr; Overlay (directional only)</li>
          </ol>
        </DeepDive>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          06. 5-DIMENSIONAL DISPLACEMENT RISK
      ════════════════════════════════════════════════════════════════ */}
      <Section id="displacement-risk" title="5-Dimensional Displacement Risk">
        <TLDR>
          <p>
            AI exposure alone doesn&rsquo;t predict displacement. We score 342
            occupations across five research-backed dimensions: technical
            exposure (30%), adoption speed (20%), worker adaptability (15%),
            demand elasticity (15%), and AI complementarity (20%). The first two
            drive displacement up. The last three absorb it.
          </p>
        </TLDR>

        <P>
          Most AI-labor analyses stop at &ldquo;exposure&rdquo; &mdash; what
          share of tasks can AI do? That&rsquo;s necessary but insufficient.
          An occupation can be highly exposed to AI and still see employment{" "}
          <em>growth</em> if demand is elastic, workers can adapt, and AI is
          deployed as a complement rather than a substitute. The 5-dimensional
          framework captures all five factors.
        </P>

        <DeepDive title="Dimension 1: Technical AI Exposure (30%)" defaultOpen>
          <p className="mb-2">
            <Strong>Question:</Strong> How many of this occupation&rsquo;s tasks
            can current or near-term AI actually perform?
          </p>
          <p className="mb-2">
            <Strong>Method:</Strong> GPT-scored analysis of 342 BLS occupations,
            validated against six independent academic exposure indices (Yale
            Budget Lab meta-analysis, Pearson r = 0.878).
          </p>
          <p className="mb-2">
            <Strong>Sources:</Strong> Eloundou et al. (2023); Felten, Raj &amp;
            Seamans (2023); Yale Budget Lab (2026); Acemoglu (2024).
          </p>
          <p>
            <Strong>Key insight:</Strong> Acemoglu&rsquo;s bounding argument
            shows that ~20% of tasks are AI-exposed, ~23% can be profitably
            automated, with ~27% cost savings per task &mdash; yielding only
            0.53&ndash;0.66% TFP gain over a decade. Exposure alone dramatically
            overstates likely displacement.
          </p>
        </DeepDive>

        <DeepDive title="Dimension 2: Institutional Adoption Speed (20%)">
          <p className="mb-2">
            <Strong>Question:</Strong> How quickly will firms in this sector
            actually deploy AI?
          </p>
          <p className="mb-2">
            <Strong>Method:</Strong> Industry speed multipliers based on
            regulatory burden, digital maturity, competitive pressure, union
            density, and organizational complexity. Range: 0.6&times; (tech,
            fastest) to 1.4&times; (healthcare, slowest).
          </p>
          <p className="mb-2">
            <Strong>Sources:</Strong> Griliches (1957) on technology diffusion
            S-curves; Comin &amp; Hobijn (2010) on institutional adoption lags;
            Acemoglu &amp; Restrepo (2020) showing automotive adopted robots
            8&ndash;10&times; faster than food processing; Hunt, Cockburn &amp;
            Bessen (2024) on geographic variation in AI adoption.
          </p>
          <p>
            <Strong>Key insight:</Strong> A technology can be economically viable
            for years before organizations deploy it. The gap between
            &ldquo;can&rdquo; and &ldquo;will&rdquo; is where most
            single-dimension analyses go wrong.
          </p>
        </DeepDive>

        <DeepDive title="Dimension 3: Worker Adaptability (15%)">
          <p className="mb-2">
            <Strong>Question:</Strong> When displacement occurs, how well can
            workers transition to new roles?
          </p>
          <p className="mb-2">
            <Strong>Method:</Strong> Composite of four sub-components from
            Manning &amp; Aguirre (NBER w34705, 2026): net liquid wealth
            (financial buffer from SIPP), skill transferability (O*NET task
            overlap), geographic job density (Lightcast), and age demographics
            (fraction 55+).
          </p>
          <p className="mb-2">
            <Strong>Range:</Strong> Professional workers score 0.734; admin
            support scores 0.360.
          </p>
          <p>
            <Strong>Key insight:</Strong> Autor, Dorn, Hanson &amp; Song (2014)
            showed that during the China trade shock, geographic concentration of
            affected industries predicted worse outcomes. Workers competing for
            the same alternative jobs all at once compounds the pain. The
            adaptability dimension captures this structural vulnerability.
          </p>
        </DeepDive>

        <DeepDive title="Dimension 4: Demand Elasticity (15%)">
          <p className="mb-2">
            <Strong>Question:</Strong> When AI makes this work cheaper, does
            demand expand enough to offset job losses?
          </p>
          <p className="mb-2">
            <Strong>Method:</Strong> Qualitative classification
            (high/moderate/low) informed by Bessen (2019) and historical
            precedent. High elasticity = score 8, moderate = 5, low = 2.
          </p>
          <p className="mb-2">
            <Strong>Sources:</Strong> Bessen (2019) analyzed 150 years of Census
            data; Autor &amp; Salomons (2018) on within-industry expansion;
            Alcott (2005) on formal conditions for Jevons Paradox.
          </p>
          <p>
            <Strong>Key insight:</Strong> ATMs reduced the cost of operating a
            bank branch, so banks opened more branches, and teller employment
            grew for 30 years. Occupations with elastic demand (many unserved
            customers at current price) may see employment <em>growth</em> from
            AI, not decline. See{" "}
            <a href="#demand-elasticity" className="text-[var(--accent-text)] hover:underline">
              Demand Elasticity
            </a>{" "}below.
          </p>
        </DeepDive>

        <DeepDive title="Dimension 5: AI Complementarity (20%)">
          <p className="mb-2">
            <Strong>Question:</Strong> Does AI primarily replace workers or make
            them more productive?
          </p>
          <p className="mb-2">
            <Strong>Method (with CFO data):</Strong> Baslandze et al. (2026)
            surveyed ~750 CFOs on replacement vs. enhancement intent by
            occupation group. Office/admin is the only group where replacement
            dominates (NEI = 2.03). Management (0.14) and engineering (0.10) are
            strongly enhancement-dominant.
          </p>
          <p className="mb-2">
            <Strong>Method (without CFO data):</Strong> Estimated from task
            composition. High physical/interpersonal tasks = more complementary.
            High information-processing = more substitutable.
          </p>
          <p className="mb-3">
            <Strong>Dimensionality adjustment:</Strong> Based on Gans &amp;
            Goldfarb (2024) O-Ring Automation. Jobs with many distinct task
            clusters (&ge;5) get a complementarity bonus (+1.0) because
            automating some tasks lets workers focus on the rest (the
            &ldquo;focus effect&rdquo;). Jobs with few clusters (&le;3) get a
            penalty (&minus;1.5) because firms have stronger incentive to fully
            automate. With CFO data, the adjustment is milder (&plusmn;0.5).
          </p>
          <p>
            <Strong>Key insight:</Strong> Brynjolfsson, Li &amp; Raymond (2025)
            studied 5,172 customer support agents and found 15% average
            productivity increase from AI assistance, with gains from
            augmentation (not replacement). The deployment choice &mdash;
            substitute or complement &mdash; is a management decision, not a
            technical inevitability.
          </p>
        </DeepDive>

        <DeepDive title="Composite score calculation">
          <p className="mb-3">
            Pressure = weighted average of Exposure (30%) and Speed (20%),
            normalized to 0&ndash;10.
          </p>
          <p className="mb-3">
            Absorption = weighted average of Adaptability (15%), Elasticity
            (15%), and Complementarity (20%), normalized to 0&ndash;10.
          </p>
          <p className="mb-3">
            <Code>
              Net Risk = (Pressure &minus; Absorption + 10) / 2
            </Code>
            , clamped to 0&ndash;10.
          </p>
          <p>
            This formula ensures defensive factors can fully counterbalance
            pressure. An occupation with maximum exposure but equally strong
            adaptability, demand elasticity, and complementarity scores 5.0
            (neutral), not 10.
          </p>
        </DeepDive>

        <div className="mt-2">
          <SeeAlso
            href="/occupation-exposure"
            label="Explore occupation risk scores in the interactive tool"
          />
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          07. AUTOMATION SIGNALS
      ════════════════════════════════════════════════════════════════ */}
      <Section id="signals" title="Automation Signals">
        <TLDR>
          <p>
            We track 150+ Python/JavaScript packages as leading indicators of AI
            automation. Think of it like construction permits: before AI replaces
            tasks in an industry, developers download the tools to build those
            systems. The signal is in relative growth rates, not absolute numbers.
          </p>
        </TLDR>

        <DeepDive title="The construction permits analogy" defaultOpen>
          <p>
            Before a building goes up, construction permits spike in that
            neighborhood. Before AI automates tasks in an industry, developers
            start downloading the tools to build those automation systems. We
            track both Python (PyPI) and JavaScript (npm) package downloads as a
            leading indicator of where AI automation is heading.
          </p>
        </DeepDive>

        <DeepDive title="Automation Acceleration Index (AAI)">
          <p className="mb-3">
            The AAI compares how fast industry-specific automation tools are
            growing versus general AI infrastructure (like the OpenAI or
            Anthropic SDKs). When the AAI is above 1.0, industry-specific tools
            are growing faster than the underlying AI platform &mdash; a signal
            that we&rsquo;re moving from &ldquo;people using AI&rdquo; to
            &ldquo;AI doing the work.&rdquo;
          </p>
        </DeepDive>

        <DeepDive title="Surge detection">
          <p>
            A tool is flagged as &ldquo;surging&rdquo; if it shows 3+
            consecutive months of &gt;20% month-over-month growth, or if its
            growth rate has at least doubled compared to the prior quarter. These
            are the tools gaining adoption fastest, and the industries they serve
            are worth watching.
          </p>
        </DeepDive>

        <DeepDive title="Community signals">
          <p>
            GitHub stars and issues, plus StackOverflow question volume, provide
            supplementary context. Stars indicate developer interest, issues
            reflect active development, and SO questions show how many people
            are trying to use a tool. These are displayed on each tool but are
            not factored into the AAI calculation.
          </p>
        </DeepDive>

        <DeepDive title="Important caveats">
          <p>
            Package downloads do not equal production use. CI/CD pipelines,
            Docker builds, and dependency resolution inflate counts. New tools
            with small user bases can show extreme growth percentages. Correlation
            is not causation &mdash; rising tool adoption indicates where
            investment and capability are concentrating, not that displacement
            is occurring.
          </p>
        </DeepDive>

        <div className="mt-3 text-xs text-[var(--muted)]">
          <Strong>Data sources:</Strong>{" "}
          <a href="https://pypistats.org" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">pypistats.org</a>,{" "}
          <a href="https://www.npmjs.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">npm</a>,{" "}
          <a href="https://www.bls.gov/ces/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">BLS CES</a>,{" "}
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">GitHub API</a>,{" "}
          <a href="https://api.stackexchange.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Stack Exchange API</a>. Updated monthly.
        </div>

        <div className="mt-3">
          <SeeAlso href="/signals" label="View the live automation signals dashboard" />
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          08. J-CURVE FRAMEWORK
      ════════════════════════════════════════════════════════════════ */}
      <Section id="j-curve" title="J-Curve Framework">
        <TLDR>
          <p>
            Measured productivity lags real AI impact because the enormous
            complementary investments required (reorganization, retraining,
            workflow redesign) are expensed, not capitalized. This creates a
            J-shaped curve: productivity looks <em>worse</em> before it looks
            better. Electricity took ~40 years. Computers took ~25.
          </p>
        </TLDR>

        <P>
          The J-Curve framework from Brynjolfsson, Rock &amp; Syverson (2021,{" "}
          <em>AEJ: Macroeconomics</em>) explains why AI&rsquo;s productivity
          impact hasn&rsquo;t shown up in the macro data yet. General-purpose
          technologies require massive complementary investments that national
          accounts treat as expenses, not capital.
        </P>

        <DeepDive title="The two-sided measurement error">
          <p className="mb-3">
            <Strong>Early phase:</Strong> Resources diverted to intangible
            investment (reorganization, retraining) reduce measured output while
            building unmeasured capital. Productivity appears to stall or decline.
          </p>
          <p>
            <Strong>Later phase:</Strong> Accumulated intangibles produce output
            but aren&rsquo;t counted as capital input. Measured productivity
            surges, overstating the true instantaneous gain.
          </p>
        </DeepDive>

        <DeepDive title="Historical precedent">
          <ul className="list-disc ml-4 space-y-2">
            <li>
              <Strong>Electricity:</Strong> ~40 years from introduction (1880s)
              to the productivity surge in manufacturing (1920s). Required
              complete factory redesign from shaft-driven to unit-drive layouts.
            </li>
            <li>
              <Strong>Computers:</Strong> ~25 years from mainframe adoption
              (1970s) to the productivity boom (mid-1990s). Required business
              process reengineering and a generation of computer-literate workers.
            </li>
            <li>
              <Strong>AI:</Strong> The question in 2026. Software may compress
              the timeline (it replicates faster than physical infrastructure),
              but organizational change still requires human-speed adaptation.
            </li>
          </ul>
        </DeepDive>

        <div className="mt-2">
          <SeeAlso href="/j-curve" label="Read the full J-Curve explainer" />
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          09. DEMAND ELASTICITY
      ════════════════════════════════════════════════════════════════ */}
      <Section id="demand-elasticity" title="Demand Elasticity & the Jevons Paradox">
        <TLDR>
          <p>
            When AI makes work cheaper, total demand for that work often
            expands. ATMs made branches cheaper to run, so banks opened more
            branches. Teller employment <em>grew</em> for 30 years. Occupations
            with elastic demand may see more hiring from AI, not less.
          </p>
        </TLDR>

        <P>
          The Jevons Paradox, first observed in 1865 with coal, applies
          directly to AI-labor economics: when efficiency makes a product or
          service cheaper, consumption often increases enough to offset the
          efficiency gain.
        </P>

        <DeepDive title="When does the paradox hold?">
          <p className="mb-3">
            Alcott (2005) formalized the conditions: the paradox holds when
            demand is elastic &mdash; there are many potential customers priced
            out at the current cost. It fails when demand is inelastic &mdash;
            everyone who wants the service already has it.
          </p>
          <p>
            This is why office administration (internal cost center, no
            external demand to expand) differs from creative services (vast
            unserved market of people and businesses who can&rsquo;t currently
            afford design, video, or copywriting).
          </p>
        </DeepDive>

        <DeepDive title="Key evidence">
          <ul className="list-disc ml-4 space-y-2">
            <li>
              <Strong>Bessen (2019):</Strong> 150 years of Census data showing
              automation led to employment <em>growth</em> in occupations with
              elastic demand.
            </li>
            <li>
              <Strong>Autor &amp; Salomons (2018):</Strong> Within-industry
              productivity growth from automation almost always increased
              employment in that industry (the demand elasticity mechanism).
            </li>
            <li>
              <Strong>Acemoglu &amp; Restrepo (2019):</Strong> The
              displacement/reinstatement framework: technology displaces labor
              from existing tasks but creates new tasks where labor has
              comparative advantage. Reinstatement has historically dominated.
            </li>
            <li>
              <Strong>Autor et al. (2022):</Strong> 60% of 2018 employment was
              in job titles that didn&rsquo;t exist in 1940, most created by
              prior waves of automation expanding demand.
            </li>
          </ul>
        </DeepDive>

        <div className="mt-2">
          <SeeAlso href="/demand-elasticity" label="Read the full demand elasticity explainer" />
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          10. HISTORICAL CONTEXT
      ════════════════════════════════════════════════════════════════ */}
      <Section id="historical-context" title="Historical Context: GPT Cycles">
        <TLDR>
          <p>
            AI follows the same arc as every prior general-purpose technology:
            emergence, diffusion, displacement, reorganization, new equilibrium.
            Each GPT has taken 25&ndash;40 years from emergence to productivity
            surge. The diffusion timeline may be compressing because software
            replicates faster than physical infrastructure.
          </p>
        </TLDR>

        <DeepDive title="The five-phase arc" defaultOpen>
          <ol className="list-decimal ml-4 space-y-2">
            <li>
              <Strong>Emergence</Strong> &mdash; New technology introduced, narrow
              applications. (AI: 2012&ndash;2022)
            </li>
            <li>
              <Strong>Diffusion</Strong> &mdash; Rapid adoption, experimentation
              across sectors. (AI: 2023&ndash;present)
            </li>
            <li>
              <Strong>Displacement</Strong> &mdash; Old occupations and skills
              lose value. (AI: emerging, uneven)
            </li>
            <li>
              <Strong>Reorganization</Strong> &mdash; Firms restructure
              workflows, new job categories emerge.
            </li>
            <li>
              <Strong>New equilibrium</Strong> &mdash; Productivity surges, labor
              reallocation stabilizes.
            </li>
          </ol>
        </DeepDive>

        <DeepDive title="Compression hypothesis">
          <p>
            Each successive GPT has diffused faster than the last (electricity
            ~40 years, computers ~25 years). AI may compress further because
            software replicates at near-zero marginal cost, unlike factories or
            power grids. But organizational change &mdash; rewriting workflows,
            retraining workers, updating regulations &mdash; still happens at
            human speed. The physical deployment constraint is gone; the
            institutional one remains.
          </p>
        </DeepDive>

        <div className="mt-2">
          <SeeAlso href="/history" label="Explore the full historical comparison" />
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          11. RESEARCH PIPELINE
      ════════════════════════════════════════════════════════════════ */}
      <Section id="research-pipeline" title="Research Pipeline">
        <TLDR>
          <p>
            An automated pipeline queries 11 academic databases weekly,
            deduplicates results, and ranks papers by tier, relevance, and
            citation velocity. 35 leading AI-labor researchers are monitored
            continuously. Human review gates every ingestion.
          </p>
        </TLDR>

        <P>
          New research is surfaced automatically but never ingested
          automatically. The pipeline finds candidates; a human decides what
          enters the dataset.
        </P>

        <DeepDive title="Data sources" defaultOpen>
          <div className="flex flex-wrap gap-2 mb-3">
            {SOURCES.map((s) => (
              <span
                key={s}
                className="text-sm bg-black/[0.04] px-2.5 py-1 rounded text-[var(--foreground)] font-medium"
              >
                {s}
              </span>
            ))}
          </div>
          <p>
            Research digest runs weekly (Mondays). News ticker refreshes hourly.
            Prediction data updates when new evidence materially changes an
            estimate.
          </p>
        </DeepDive>

        <DeepDive title="Tracked researchers (35)">
          <div className="flex flex-wrap gap-2">
            {AUTHORS.map((a) => (
              <span
                key={a.name}
                className="text-xs text-[var(--muted)] bg-black/[0.04] px-2 py-1 rounded"
              >
                <span className="font-semibold text-[var(--foreground)]">
                  {a.name}
                </span>{" "}
                &middot; {a.affiliation}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm">
            Papers by these researchers are automatically surfaced regardless of
            keyword match.
          </p>
        </DeepDive>

        <DeepDive title="Ingestion workflow">
          <ol className="list-decimal ml-4 space-y-1">
            <li>Pipeline identifies candidate source</li>
            <li>Extract quantitative claims with exact quotes</li>
            <li>Classify: direct data point, proxy, or overlay</li>
            <li>Map to relevant prediction graph(s)</li>
            <li>Apply proxy conversion if needed</li>
            <li>Human review and approval</li>
            <li>Data written, weighted average recalculated</li>
            <li>Source added to confirmed sources registry</li>
          </ol>
        </DeepDive>
      </Section>

      {/* ════════════════════════════════════════════════════════════════
          12. KNOWN LIMITATIONS
      ════════════════════════════════════════════════════════════════ */}
      <Section id="limitations" title="Known Limitations">
        <TLDR>
          <p>
            This is a map of published research, not an oracle. The weighted
            average masks disagreement. The 5-dimensional weights are
            author-chosen, not econometrically estimated. Coverage is
            English-language only. These limitations are features of
            transparency, not bugs to be hidden.
          </p>
        </TLDR>

        <div className="space-y-4">
          <div>
            <P>
              <Strong>Definitional heterogeneity.</Strong>{" "}
              Sources within a single prediction may define the metric
              differently. &ldquo;Displacement&rdquo; can mean roles eliminated,
              tasks automated, or jobs restructured depending on the study. The
              weighted average treats these as equivalent, which may overstate or
              understate the true range.
            </P>
          </div>

          <div>
            <P>
              <Strong>Mixing evidence types in a single average.</Strong>{" "}
              Several displacement graphs blend observed employment changes,
              job-posting proxies, and modeled forward projections into one
              weighted number. Proxy points are downweighted by 0.5&times; and
              projections are flagged in the underlying data, but the headline
              average still combines fundamentally different kinds of evidence.
              Read the source mix on each prediction page; a graph dominated by
              postings proxies tells a different story than one dominated by
              direct employment counts, even when the headline is the same.
            </P>
          </div>

          <div>
            <P>
              <Strong>Single-company press-release outliers.</Strong>{" "}
              A small number of data points come from individual companies
              self-reporting AI deployment outcomes (e.g., Klarna&rsquo;s
              two-thirds-of-customer-service-chats figure). These are
              not independently verified, may be marketing-shaped, and reflect
              one company&rsquo;s deployment &mdash; not a sector-wide rate.
              Some companies later reverse the AI-driven workforce decisions
              they earlier announced; that reversal is rarely reflected in the
              same data point. Treat company press-release values as one
              point in a wider distribution, not as the central estimate.
            </P>
          </div>

          <div>
            <P>
              <Strong>Static task bundles undercount AI&rsquo;s wage effects.</Strong>{" "}
              Most sources estimate AI&rsquo;s wage impact by holding fixed the
              pre-AI bundle of tasks assigned to a worker. When automation
              unbundles a job, firms recombine surviving activities into new
              roles &mdash; a dynamic that headline displacement and wage
              statistics systematically miss. Gans (NBER w35211,{" "}
              <a
                href="https://www.nber.org/papers/w35211"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                2026
              </a>
              ) argues this measurement bias likely causes occupation-level
              exposure scores to undercount the true scale of labor market
              transformation. Treat every wage and displacement estimate on this
              site as a lower bound on the structural change underway.
            </P>
          </div>

          <div>
            <P>
              <Strong>Point estimates from wide ranges.</Strong>{" "}
              The headline number can mask significant disagreement. When the
              source range is wide (e.g., 0&ndash;12%), the range itself is often
              more informative than the midpoint. We show the full range on every
              prediction page.
            </P>
          </div>

          <div>
            <P>
              <Strong>Trend arrows reflect source mix, not reality.</Strong>{" "}
              A downward arrow may mean &ldquo;newer sources estimate
              lower,&rdquo; not that the real-world metric is declining. Adding
              or removing a source can shift the trend.
            </P>
          </div>

          <div>
            <P>
              <Strong>5-dimensional weights are author-chosen.</Strong>{" "}
              The 30/20/15/15/20 weighting is not econometrically estimated.
              Demand elasticity classifications are qualitative. CFO
              complementarity data covers only 8 of 22 occupation groups. The
              framework&rsquo;s value is showing that single-dimension exposure
              scores omit most of what determines actual displacement, not in the
              precise composite number.
            </P>
          </div>

          <div>
            <P>
              <Strong>Within-group variation.</Strong>{" "}
              The occupation framework operates at the SOC major group level (22
              groups), which masks significant variation. &ldquo;Computer and
              mathematical&rdquo; includes both data entry clerks and machine
              learning researchers.
            </P>
          </div>

          <div>
            <P>
              <Strong>Binary replacement risks not captured.</Strong>{" "}
              The task-composition model assumes gradual, task-by-task
              automation. It does not capture cases where a single breakthrough
              automates the dominant task wholesale (e.g., autonomous vehicles
              for trucking). If that capability crosses the threshold, the
              complementarity buffer disappears.
            </P>
          </div>

          <div>
            <P>
              <Strong>Coverage gaps.</Strong>{" "}
              English-language sources only. Keyword matching can miss or
              misclassify papers. Citation data lags publication, so new work may
              be underranked. Signal data (package downloads) is inflated by
              CI/CD pipelines and does not equal production use.
            </P>
          </div>

          <div>
            <P>
              <Strong>Structural tendencies, not individual predictions.</Strong>{" "}
              These scores describe group-level patterns. A person&rsquo;s actual
              risk depends on their specific role, employer, geography, skills,
              and adaptability &mdash; not just their occupation group&rsquo;s
              average.
            </P>
          </div>
        </div>
      </Section>

      {/* ── Suggest a Source + Update Schedule ── */}
      <div className="border-t border-card pt-6 space-y-4">
        <p className="text-base text-[var(--muted)] leading-relaxed">
          <Strong>Know a study we should include?</Strong>{" "}
          <a
            href="/suggest"
            className="underline hover:text-[var(--foreground)] transition-colors"
          >
            Suggest a source
          </a>{" "}
          and we&rsquo;ll review it for inclusion.
        </p>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          <Strong>Update schedule:</Strong> Research digest runs weekly
          (Mondays) across all 11 sources. News ticker refreshes hourly.
          Prediction data updates when new evidence materially changes an
          estimate. Signal data (package downloads) updates monthly.
        </p>
      </div>
    </div>
  );
}
