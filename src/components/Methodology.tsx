export default function Methodology() {
  return (
    <div id="methodology">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
          Methodology &amp; Sources
        </h2>
        <p className="text-[15px] text-[var(--muted)] mt-2 max-w-3xl">
          How this dashboard collects, classifies, and scores the research
          behind every prediction
        </p>
      </div>

      {/* Overview */}
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <h3 className="text-[18px] font-bold text-[var(--foreground)]">
            Overview
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            This dashboard tracks how AI is affecting jobs, wages, and corporate
            behavior by synthesizing evidence from academic research, government
            statistics, institutional reports, and corporate filings. Every
            prediction is backed by individually cited sources, each classified
            into one of four evidence tiers. The goal is not to make forecasts
            but to surface what the empirical research actually says &mdash; and
            to make the uncertainty visible.
          </p>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            Predictions are organized into four categories: job displacement and
            restructuring, wage impacts, AI adoption rates, and leading
            corporate signals. Each prediction tracks a specific measurable
            indicator over time, with confidence intervals where the underlying
            research provides them.
          </p>
        </div>

        {/* Evidence Tier Framework */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-4">
            Evidence Tier Framework
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-5 max-w-3xl">
            Not all evidence is created equal. Every source is classified into
            one of four tiers so readers can immediately judge the strength of
            the evidence behind any claim. The tier filter on the dashboard lets
            you strip away lower-quality sources to see how the picture changes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 1 &mdash; Verified Data &amp; Research
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-snug">
                Randomized controlled trials, peer-reviewed journal articles
                (AER, QJE, NBER working papers), government statistical data
                (BLS, Census, OECD), SEC filings and 10-K/10-Q reports, and
                corporate investor presentations with disclosed data.
              </p>
            </div>
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 2 &mdash; Institutional Analysis
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-snug">
                Think tank reports (Brookings, RAND, McKinsey Global Institute),
                international organization forecasts (IMF, World Bank, ILO),
                prediction markets (Metaculus, Polymarket), working papers and
                preprints (arXiv, SSRN), and industry research (Gartner,
                Forrester, Deloitte).
              </p>
            </div>
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 3 &mdash; Journalism &amp; Commentary
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-snug">
                Reporting from major outlets (NYT, WSJ, FT, Reuters), trade
                publications (TechCrunch, The Information), long-form
                investigations, and expert opinion columns.
              </p>
            </div>
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 4 &mdash; Informal &amp; Social
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-snug">
                Twitter/X threads, Reddit discussions, blog posts, Substack
                newsletters, podcasts, and YouTube commentary. Included for
                completeness but weighted accordingly.
              </p>
            </div>
          </div>
        </div>

        {/* Research Discovery Pipeline */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-4">
            Research Discovery Pipeline
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-5 max-w-3xl">
            The Research Feed is powered by an automated pipeline that queries
            11 academic and institutional sources, deduplicates results, links
            papers to specific predictions, and ranks them by a composite score.
            New papers are discovered weekly and scored on tier, relevance,
            citation velocity, and author significance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOURCES.map((s, i) => (
              <div
                key={i}
                className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white"
              >
                <p className="text-[14px] font-bold text-[var(--foreground)] mb-1">
                  {s.name}
                </p>
                <p className="text-[12px] text-[var(--muted)] leading-snug">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Author Tracking */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-4">
            Tracked Researchers
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-5 max-w-3xl">
            The pipeline monitors 17 leading researchers in AI economics and
            labor markets. When any of these authors publish new work, their
            papers are automatically surfaced regardless of keyword match. These
            researchers were selected for their sustained contributions to the
            empirical study of AI&apos;s workforce effects.
          </p>
          <div className="flex flex-wrap gap-2">
            {AUTHORS.map((a, i) => (
              <span
                key={i}
                className="text-[12px] text-[var(--muted)] bg-black/[0.04] px-2.5 py-1 rounded"
              >
                <span className="font-semibold text-[var(--foreground)]">
                  {a.name}
                </span>
                {" "}&middot; {a.affiliation}
              </span>
            ))}
          </div>
        </div>

        {/* Scoring & Ranking */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-4">
            Scoring &amp; Ranking
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-5 max-w-3xl">
            Papers in the weekly digest are ranked by a composite score that
            balances evidence quality, topical relevance, scholarly impact, and
            researcher significance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {SCORING.map((s, i) => (
              <div
                key={i}
                className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white"
              >
                <p className="text-[14px] font-bold text-[var(--foreground)] mb-1">
                  {s.factor}
                </p>
                <p className="text-[12px] text-[var(--muted)] leading-snug">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Linking */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-4">
            Prediction Linking
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed max-w-3xl">
            Each paper is automatically analyzed against 15 prediction
            categories using keyword matching on the title and abstract.
            Categories span displacement (overall, white collar, tech, creative,
            education, healthcare admin, customer service, total jobs lost), wage
            impacts (median, geographic, entry-level, high-skill premium,
            freelancer rates), AI adoption rates, and corporate signals
            (earnings call mentions). When a paper matches one or more
            predictions, it appears as supporting evidence on that
            prediction&apos;s detail page.
          </p>
        </div>

        {/* Limitations */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-4">
            Limitations &amp; Caveats
          </h3>
          <div className="max-w-3xl space-y-3">
            {LIMITATIONS.map((l, i) => (
              <p key={i} className="text-[14px] text-[var(--muted)] leading-relaxed">
                <span className="font-semibold text-[var(--foreground)]">
                  {l.label}
                </span>{" "}
                {l.text}
              </p>
            ))}
          </div>
        </div>

        {/* Update Schedule */}
        <div className="border-t border-black/[0.06] pt-8">
          <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-3xl">
            <span className="font-semibold text-[var(--foreground)]">
              Update schedule:
            </span>{" "}
            The research digest runs weekly (Mondays) and scans all 11 sources
            for new publications from the previous 14 days. Prediction data
            points are updated when new evidence materially changes an estimate.
            Source counts and confidence intervals are recalculated on each
            build.
          </p>
        </div>
      </div>
    </div>
  );
}

const SOURCES = [
  {
    name: "Semantic Scholar",
    description:
      "AI-powered academic search engine covering 200M+ papers across all disciplines. Primary source for citation counts and full metadata.",
  },
  {
    name: "OpenAlex",
    description:
      "Open catalog of the world's research, used for concept-based discovery, institution filtering (IMF, IZA), and author tracking.",
  },
  {
    name: "arXiv",
    description:
      "Preprint server for economics, CS, and quantitative research. Captures cutting-edge work before journal publication.",
  },
  {
    name: "Scopus (Elsevier)",
    description:
      "Largest abstract and citation database for peer-reviewed literature. Provides high-quality venue and citation metadata.",
  },
  {
    name: "NBER",
    description:
      "National Bureau of Economic Research working papers. Tier 1 source for labor economics and macroeconomic research.",
  },
  {
    name: "Brookings Institution",
    description:
      "Policy-oriented research on labor markets, technology, and AI. Tracked via their labor-markets, technology, and AI RSS feeds.",
  },
  {
    name: "IMF Working Papers",
    description:
      "International Monetary Fund research on AI and labor policy, accessed via OpenAlex institutional filtering.",
  },
  {
    name: "IZA Discussion Papers",
    description:
      "Institute of Labor Economics (Bonn). One of the largest labor economics working paper series in the world.",
  },
  {
    name: "CORE",
    description:
      "Aggregator of open access research from 10,000+ repositories. Catches papers that keyword-in-title searches miss.",
  },
  {
    name: "SEC EDGAR",
    description:
      "U.S. Securities and Exchange Commission filings. Tracked for AI mentions in 10-K reports and earnings call transcripts.",
  },
  {
    name: "Job Postings (Adzuna)",
    description:
      "Aggregate job posting data used for tracking real-time labor demand shifts in AI-exposed occupations.",
  },
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
  { name: "Andrea Filippetti", affiliation: "CNR Italy" },
  { name: "Anna Salomons", affiliation: "Utrecht" },
  { name: "Pascual Restrepo", affiliation: "Boston University" },
  { name: "Carl Benedikt Frey", affiliation: "Oxford" },
  { name: "Michael Osborne", affiliation: "Oxford" },
  { name: "Ed Felten", affiliation: "Princeton" },
  { name: "Manav Raj", affiliation: "Wharton" },
  { name: "Lindsey Raymond", affiliation: "MIT" },
  { name: "Bharat Chandar", affiliation: "Stanford" },
];

const SCORING = [
  {
    factor: "Evidence Tier",
    detail:
      "Tier 1 papers receive the highest weight, scaling down through Tier 4. This ensures peer-reviewed research and government data dominate the rankings.",
  },
  {
    factor: "Keyword Relevance",
    detail:
      "Papers are scored on how many prediction-relevant keywords appear in the title and abstract. Higher specificity to AI-labor topics means a higher score.",
  },
  {
    factor: "Citation Velocity",
    detail:
      "Citations per year since publication, capped to prevent older seminal papers from dominating. Rewards work gaining traction in the field.",
  },
  {
    factor: "Tracked Author",
    detail:
      "Papers from the 17 monitored researchers receive a significant bonus, surfacing new work from leading experts regardless of keyword match.",
  },
];

const LIMITATIONS = [
  {
    label: "This is not a forecast model.",
    text: "Predictions reflect the range of estimates found in published research, not outputs from a proprietary model. When researchers disagree, that disagreement is shown.",
  },
  {
    label: "Coverage is not exhaustive.",
    text: "The pipeline queries English-language sources only and may miss relevant work published in other languages, behind paywalls not indexed by our sources, or in disciplines outside economics and computer science.",
  },
  {
    label: "Keyword matching has limits.",
    text: "Automated classification relies on keyword matching in titles and abstracts. Some relevant papers may not use expected terminology, and some irrelevant papers may use similar language in a different context.",
  },
  {
    label: "Citation data lags publication.",
    text: "Newly published papers have few or no citations. The scoring system accounts for this but recent work may be underranked relative to its eventual impact.",
  },
  {
    label: "Predictions are point-in-time snapshots.",
    text: "The research landscape is evolving rapidly. Estimates that appear stable today may shift significantly as new large-scale studies are completed.",
  },
];
