const EVIDENCE_STATS = [
  {
    stat: "20\u201360%",
    label: "Productivity gains in controlled experiments; 15\u201330% in field settings",
    source: "del Rio-Chanona et al., 2025",
    url: "https://arxiv.org/abs/2509.15265",
  },
  {
    stat: "~20% decline",
    label: "In headcount for early-career software developers since late 2022",
    source: "Brynjolfsson et al., Stanford 2025",
    url: "https://www.nber.org/papers/w33856",
  },
  {
    stat: "52% augmentation",
    label: "How AI is actually being used in 2M real conversations (vs 45% automation)",
    source: "Anthropic Economic Index, 2026",
    url: "https://www.anthropic.com/research/the-anthropic-economic-index",
  },
  {
    stat: "17% fewer postings",
    label: "In highly automatable occupations, but 22% more in augmentation-prone roles",
    source: "Chen et al., HBS 2025",
    url: "https://www.hbs.edu/faculty/Pages/item.aspx?num=66491",
  },
  {
    stat: "33:1 cost ratio",
    label: "Firms substituting freelancers with AI \u2014 freelance spend fell from 0.66% to 0.14% of total",
    source: "Ramp Economics Lab, 2026",
    url: "https://ramp.com/blog/ai-spending-trends-2026",
  },
  {
    stat: "No macro effect",
    label: "Aggregate unemployment data show no economy-wide displacement yet",
    source: "Yale Budget Lab, 2025; ICLE, 2026",
    url: "https://budgetlab.yale.edu/research/ai-labor-market-2025",
  },
];

export default function EvidenceSummaryCard() {
  return (
    <div>
      <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-[var(--foreground)] mb-1">
        What the Evidence Actually Shows
      </h2>
      <p className="text-[14px] text-[var(--muted)] mb-5 max-w-2xl">
        Key empirical findings from RCTs, payroll data, job postings, and firm spending records
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EVIDENCE_STATS.map((item, i) => (
          <div
            key={i}
            className="border border-black/[0.06] rounded-lg px-5 py-4 bg-white"
          >
            <p className="stat-number text-[22px] font-black text-[var(--foreground)] leading-tight mb-1.5">
              {item.stat}
            </p>
            <p className="text-[13px] text-[var(--muted)] leading-snug mb-3">
              {item.label}
            </p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-medium text-[var(--accent)] hover:underline"
            >
              {item.source} &rarr;
            </a>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-[var(--muted)] leading-relaxed mt-4 max-w-3xl italic">
        The story isn&apos;t mass job loss &mdash; it&apos;s a generational shift. Entry-level and
        young workers in AI-exposed occupations face real displacement, while experienced workers
        and augmentation-oriented roles are growing.
      </p>
    </div>
  );
}
