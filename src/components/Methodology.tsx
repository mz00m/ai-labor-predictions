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
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            Society is trying to figure out what AI means for work &mdash; and
            the answers keep changing. This dashboard makes that process visible
            by tracking how predictions about displacement, wages, adoption, and
            corporate behavior evolve as new research, data, and real-world
            evidence emerge. Every prediction is backed by individually cited
            sources across four evidence tiers, from peer-reviewed RCTs to
            earnings call mentions. You&apos;ll see the estimates shift, the
            ranges widen or narrow, and the consensus form (or fracture) over
            time. This isn&apos;t a forecast &mdash; it&apos;s a live map of
            what we know, what we don&apos;t, and where the evidence is
            pointing.
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
          <div className="space-y-4">
            {/* Tier 1 */}
            <div className="border border-black/[0.06] rounded-lg px-5 py-5 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 1 &mdash; Verified Data &amp; Research
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
                The highest-confidence evidence. These sources carry either
                peer-review scrutiny, legal liability for accuracy, or are
                produced by government statistical agencies with established
                methodologies. The majority of the prediction data on this
                dashboard comes from Tier 1 sources.
              </p>
              <div className="text-[13px] text-[var(--muted)] leading-relaxed space-y-2">
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Randomized controlled trials (RCTs)</span>{" "}
                  &mdash; Experimental studies where workers or firms are randomly
                  assigned to use AI tools vs. a control group. These provide
                  the cleanest causal estimates of productivity and displacement
                  effects. Key examples in this dashboard include the Noy &amp;
                  Zhang MIT writing experiment and the Brynjolfsson et al.
                  customer service study.
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Peer-reviewed journal articles and NBER working papers</span>{" "}
                  &mdash; Published in top economics and computer science
                  journals (American Economic Review, Quarterly Journal of
                  Economics, PNAS, Science). NBER working papers undergo
                  internal review and are widely treated as near-publication
                  quality in economics. The research pipeline automatically
                  discovers new NBER papers via their Labor Studies and
                  Productivity RSS feeds.
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Government statistical data</span>{" "}
                  &mdash; Bureau of Labor Statistics employment and wage series,
                  Census Bureau surveys (including the Business Trends and
                  Impact Survey), OECD labor force statistics, Federal Reserve
                  economic data (including Dallas Fed CPS analysis), and Yale
                  Budget Lab research. These provide the baseline macro
                  indicators against which AI-specific effects are measured.
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">SEC filings and earnings transcripts</span>{" "}
                  &mdash; 10-K annual reports, 10-Q quarterly reports, and 8-K
                  current reports filed with the Securities and Exchange
                  Commission. The pipeline automatically searches SEC EDGAR for
                  AI and workforce language across all public filings. Companies
                  face legal liability for material misstatements, making these
                  disclosures about AI investment, workforce restructuring, and
                  productivity gains unusually reliable.
                </p>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="border border-black/[0.06] rounded-lg px-5 py-5 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 2 &mdash; Institutional Analysis
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
                Expert analysis from credible institutions. These sources apply
                rigorous methodology but may not have undergone full peer review,
                or they synthesize existing research rather than producing new
                empirical data.
              </p>
              <div className="text-[13px] text-[var(--muted)] leading-relaxed space-y-2">
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Think tank and policy research</span>{" "}
                  &mdash; Brookings Institution (automatically tracked via RSS),
                  McKinsey Global Institute, Goldman Sachs Research, and similar
                  organizations that employ PhD-level researchers and publish
                  with editorial oversight. Their work often bridges academic
                  research and policy audiences.
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">International organization research</span>{" "}
                  &mdash; IMF staff discussion notes and working papers
                  (automatically tracked via OpenAlex), ILO Global Employment
                  Trends, World Bank development reports, and OECD Employment
                  Outlook. The pipeline filters IMF and IZA publications
                  specifically for AI-labor relevance.
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Working papers and preprints</span>{" "}
                  &mdash; Papers on arXiv, SSRN, and the IZA Discussion Paper
                  Series (all automatically tracked). The AI-labor field moves
                  fast enough that waiting for journal publication would mean
                  ignoring 6&ndash;18 months of current work. These are included
                  but flagged as pre-review.
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Industry and consulting research</span>{" "}
                  &mdash; McKinsey, Deloitte, PwC, J.P. Morgan, and similar
                  firms that survey enterprise AI adoption at scale. These
                  appear as curated sources in specific predictions rather than
                  being programmatically discovered. They offer practitioner
                  perspectives but may carry selection bias toward firms already
                  investing in AI.
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Job posting data</span>{" "}
                  &mdash; Aggregate posting volumes from the Adzuna API,
                  supplemented with published research from Indeed Hiring Lab,
                  Lightcast, and LinkedIn Economic Graph. Year-over-year changes
                  in posting volume across AI-exposed occupations serve as an
                  early signal of labor demand shifts.
                </p>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="border border-black/[0.06] rounded-lg px-5 py-5 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 3 &mdash; Journalism &amp; Commentary
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
                Professional reporting and informed analysis. The scrolling
                news ticker at the top of the dashboard automatically pulls
                AI-labor headlines from Google News RSS feeds, classified by
                sentiment. A smaller number of news articles also appear as
                curated sources within specific predictions.
              </p>
              <div className="text-[13px] text-[var(--muted)] leading-relaxed space-y-2">
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Major news outlets</span>{" "}
                  &mdash; Wall Street Journal, Financial Times, Fortune, CNBC,
                  Forbes, and The Atlantic. These provide real-time coverage of
                  layoffs, hiring freezes, AI deployment announcements, and
                  policy developments that often precede formal data by months.
                  Cited in predictions when they report original data or
                  on-the-record corporate disclosures.
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">News ticker</span>{" "}
                  &mdash; The dashboard&apos;s live ticker aggregates from four
                  Google News RSS keyword feeds (AI jobs, AI layoffs, AI hiring,
                  AI employment), deduplicates headlines, and classifies each as
                  displacement, advancement, or neutral using ~80 curated
                  sentiment terms. This refreshes hourly and provides context
                  for how the topic is being covered, but ticker headlines are
                  not used as evidence for predictions.
                </p>
              </div>
            </div>

            {/* Tier 4 */}
            <div className="border border-black/[0.06] rounded-lg px-5 py-5 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 4 &mdash; Informal &amp; Social
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
                Unvetted, anecdotal, and crowd-sourced signals. These are used
                sparingly &mdash; only a handful of Tier 4 sources currently
                appear in the prediction data. They are included when they
                capture ground-level workforce sentiment that hasn&apos;t yet
                surfaced in formal data, but they carry significant noise and
                selection bias.
              </p>
              <div className="text-[13px] text-[var(--muted)] leading-relaxed space-y-2">
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Social media and blogs</span>{" "}
                  &mdash; Occasional Twitter/X threads, Substack essays, and
                  Medium posts from researchers or practitioners. Currently a
                  very small portion of total sources. Included only when the
                  author has relevant domain expertise or when the analysis
                  cites primary data that can be independently verified.
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Weighted lowest in scoring</span>{" "}
                  &mdash; Tier 4 sources receive the lowest composite score
                  weight, meaning they appear at the bottom of ranked lists and
                  can be filtered out entirely using the evidence tier controls.
                  The dashboard is designed to work without them &mdash;
                  filtering to Tiers 1&ndash;2 still covers the vast majority
                  of the evidence base.
                </p>
              </div>
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

        {/* News Ticker */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-4">
            News &amp; Headlines
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-5 max-w-3xl">
            The scrolling news ticker at the top of the dashboard pulls from
            four Google News RSS feeds covering AI jobs, layoffs, hiring, and
            employment. Headlines from the past 7 days are deduplicated and
            classified by sentiment &mdash; displacement, advancement, or
            neutral &mdash; using keyword-based scoring against ~80 curated
            terms. This provides real-time context for how AI-labor topics are
            being covered in mainstream and trade media. Headlines refresh
            hourly.
          </p>
        </div>

        {/* Corporate & Labor Market Signals */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-4">
            Corporate &amp; Labor Market Signals
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-5 max-w-3xl">
            Beyond academic research, the dashboard tracks two real-world data
            streams that provide leading indicators of how AI is actually
            affecting employers and workers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  SEC EDGAR Filings
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-snug">
                Full-text search of 10-K, 10-Q, and 8-K filings for AI and
                workforce language. When public companies disclose workforce
                restructuring, automation plans, or AI-driven productivity gains
                in their regulatory filings, those disclosures appear here.
                Classified as Tier 1 evidence because SEC filings carry legal
                liability for accuracy.
              </p>
            </div>
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Job Posting Data
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-snug">
                Aggregate job posting volumes tracked across AI-exposed
                occupation categories &mdash; including AI/ML roles, customer
                service, data entry, AI-augmented engineering, and prompt
                engineering. Sourced from the Adzuna API and supplemented with
                published data from Indeed Hiring Lab, Lightcast, and LinkedIn
                Economic Graph. Year-over-year changes in posting volume serve
                as an early signal of labor demand shifts.
              </p>
            </div>
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
            The research digest runs weekly (Mondays) and scans all 11 academic
            and institutional sources for new publications from the previous 14
            days. The news ticker refreshes hourly with a 7-day lookback. SEC
            filing searches and job posting data update on each page load.
            Prediction data points are updated when new evidence materially
            changes an estimate. Source counts and confidence intervals are
            recalculated on each build.
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
