export default function Methodology() {
  return (
    <div id="methodology">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
          Methodology &amp; Sources
        </h2>
        <p className="text-[15px] text-[var(--muted)] mt-2 max-w-3xl">
          This dashboard tracks how AI-labor predictions evolve as new evidence
          emerges. Every prediction is backed by individually cited sources
          across four evidence tiers. This isn&apos;t a forecast &mdash;
          it&apos;s a live map of what the research says.
        </p>
      </div>

      <div className="space-y-10">
        {/* How We Calculate the Headline Number */}
        <div id="how-we-calculate" className="max-w-3xl">
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-3">
            How We Calculate the Headline Number
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4">
            The large number on every tile is a{" "}
            <strong className="text-[var(--foreground)]">weighted average</strong>{" "}
            of all data points from your selected evidence tiers. Two factors
            determine each point&apos;s weight:
          </p>

          {/* Tier weights — compact row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
            <div className="bg-black/[0.02] border border-black/[0.06] rounded px-3 py-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mb-1" />
              <p className="text-[13px] font-semibold text-[var(--foreground)]">Tier 1</p>
              <p className="text-[12px] text-[var(--muted)]">4&times; weight</p>
            </div>
            <div className="bg-black/[0.02] border border-black/[0.06] rounded px-3 py-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mb-1" />
              <p className="text-[13px] font-semibold text-[var(--foreground)]">Tier 2</p>
              <p className="text-[12px] text-[var(--muted)]">2&times; weight</p>
            </div>
            <div className="bg-black/[0.02] border border-black/[0.06] rounded px-3 py-2">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mb-1" />
              <p className="text-[13px] font-semibold text-[var(--foreground)]">Tier 3</p>
              <p className="text-[12px] text-[var(--muted)]">1&times; weight</p>
            </div>
            <div className="bg-black/[0.02] border border-black/[0.06] rounded px-3 py-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mb-1" />
              <p className="text-[13px] font-semibold text-[var(--foreground)]">Tier 4</p>
              <p className="text-[12px] text-[var(--muted)]">0.5&times; weight</p>
            </div>
          </div>

          <div className="text-[13px] text-[var(--muted)] leading-relaxed space-y-2">
            <p>
              <strong className="text-[var(--foreground)]">Recency:</strong>{" "}
              Newer sources get up to 2&times; the weight of the oldest, so
              the average naturally favors the latest research.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Formula:</strong>{" "}
              <code className="text-[12px] bg-black/[0.04] px-1.5 py-0.5 rounded font-mono">
                weight = tierWeight &times; recencyWeight
              </code>
              {" "}&rarr;{" "}
              <code className="text-[12px] bg-black/[0.04] px-1.5 py-0.5 rounded font-mono">
                mean = &sum;(value &times; weight) / &sum;(weight)
              </code>
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Filtering:</strong>{" "}
              Toggling tiers on or off recalculates the number instantly. The
              trend arrow compares the first and last data points chronologically.
            </p>
          </div>
        </div>

        {/* Evidence Tiers */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-3">
            Evidence Tiers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 1 &mdash; Verified Research
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                Peer-reviewed studies (RCTs, journal articles, NBER working
                papers), government statistical data (BLS, Census, OECD), and
                SEC filings with legal liability for accuracy.
              </p>
            </div>
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 2 &mdash; Institutional Analysis
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                Think tanks (Brookings, McKinsey), international organizations
                (IMF, ILO, World Bank), working papers (arXiv, SSRN, IZA),
                industry research, and job posting data.
              </p>
            </div>
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 3 &mdash; Journalism
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                Major outlets (WSJ, FT, Fortune, CNBC). Cited when they report
                original data or on-the-record disclosures. Also powers the
                news ticker via Google News RSS.
              </p>
            </div>
            <div className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <p className="text-[14px] font-bold text-[var(--foreground)]">
                  Tier 4 &mdash; Social &amp; Informal
                </p>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                Twitter/X threads, Substack, blogs. Used sparingly for
                ground-level signals. Lowest weight &mdash; the dashboard works
                without them.
              </p>
            </div>
          </div>
        </div>

        {/* Research Pipeline */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-3">
            Research Pipeline
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4 max-w-3xl">
            An automated pipeline queries 11 sources weekly, deduplicates
            results, links papers to predictions via keyword matching, and
            ranks them by a composite score (evidence tier, relevance, citation
            velocity, tracked author).
          </p>
          <div className="flex flex-wrap gap-2 max-w-3xl">
            {SOURCES.map((s, i) => (
              <span
                key={i}
                className="text-[12px] bg-black/[0.04] px-2.5 py-1.5 rounded text-[var(--foreground)] font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tracked Researchers */}
        <div>
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-3">
            Tracked Researchers
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4 max-w-3xl">
            18 leading AI-labor researchers are monitored &mdash; their new
            papers are automatically surfaced regardless of keyword match.
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

        {/* Limitations */}
        <div className="max-w-3xl">
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-3">
            Limitations
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            This is not a forecast model &mdash; it reflects published research
            estimates, not proprietary predictions. Coverage is English-language
            only and relies on keyword matching, which can miss or misclassify
            papers. Citation data lags publication, so new work may be
            underranked. Estimates can shift significantly as new studies emerge.
          </p>
        </div>

        {/* Update Schedule */}
        <div className="border-t border-black/[0.06] pt-6">
          <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-3xl">
            <span className="font-semibold text-[var(--foreground)]">
              Update schedule:
            </span>{" "}
            Research digest runs weekly (Mondays) across all 11 sources. News
            ticker refreshes hourly. Prediction data updates when new evidence
            materially changes an estimate.
          </p>
        </div>
      </div>
    </div>
  );
}

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
  { name: "Andrea Filippetti", affiliation: "CNR Italy" },
  { name: "Anna Salomons", affiliation: "Utrecht" },
  { name: "Pascual Restrepo", affiliation: "Boston University" },
  { name: "Carl Benedikt Frey", affiliation: "Oxford" },
  { name: "Michael Osborne", affiliation: "Oxford" },
  { name: "Ed Felten", affiliation: "Princeton" },
  { name: "Manav Raj", affiliation: "Wharton" },
  { name: "Lindsey Raymond", affiliation: "MIT" },
  { name: "Bharat Chandar", affiliation: "Stanford" },
  { name: "Molly Kinder", affiliation: "Brookings" },
];
