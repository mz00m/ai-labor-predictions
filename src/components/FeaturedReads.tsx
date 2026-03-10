interface Article {
  author: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  accent: string;
  internal?: boolean;
}

const articles: Article[] = [
  {
    author: "Kolko (PIIE)",
    title: "AI and the Labor Market Is Still in the First Inning",
    summary:
      "Evidence inconclusive; disruption pace matches computer & internet eras. Under 1/5 of firms using AI.",
    date: "Mar 10",
    url: "https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning",
    accent: "border-l-amber-500",
  },
  {
    author: "Anthropic (Massenkoff, McCrory)",
    title: "Labor Market Impacts of AI: New Measure & Early Evidence",
    summary:
      "New 'observed exposure' metric. No unemployment rise yet — but young worker hiring slowing in exposed jobs.",
    date: "Mar 5",
    url: "https://www.anthropic.com/research/labor-market-impacts",
    accent: "border-l-purple-500",
  },
  {
    author: "Ranganathan & Ye (HBR)",
    title: "AI Doesn\u2019t Reduce Work — It Intensifies It",
    summary:
      "200-employee study: 83% said AI increased workload via pace, scope, and hours — leading to burnout.",
    date: "Feb 9",
    url: "https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it",
    accent: "border-l-emerald-500",
  },
  {
    author: "Chung",
    title: "AIR: The AI Resilience Report",
    summary:
      "First canonical aggregator of AI job-impact research at the occupational level.",
    date: "Mar 4",
    url: "https://www.linkedin.com/pulse/introducing-air-ai-resilience-report-jared-chung-gxfec",
    accent: "border-l-rose-500",
  },
  {
    author: "Kinder (Brookings)",
    title: "What Deindustrialization Did to Men, AI May Do to Women",
    summary:
      "Millions of women in clerical/CS roles face AI exposure — echoing manufacturing\u2019s toll on men.",
    date: "Mar 2",
    url: "https://humanistxyz.substack.com/p/what-deindustrialization-did-to-men",
    accent: "border-l-blue-500",
  },
];

export default function FeaturedReads() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {articles.map((a) => (
        <a
          key={a.url}
          href={a.url}
          {...(a.internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className={`group border-l-2 ${a.accent} rounded-r-md bg-black/[0.02] dark:bg-white/[0.03] px-2.5 py-2 transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}
        >
          <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wide truncate">
            {a.author}{a.date && <span className="opacity-50"> &middot; {a.date}</span>}
          </p>
          <h3 className="text-[12px] font-bold text-[var(--foreground)] leading-snug mt-0.5 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {a.title}
          </h3>
          <p className="text-[10px] text-[var(--muted)] leading-relaxed mt-0.5 line-clamp-2">
            {a.summary}
          </p>
        </a>
      ))}
    </div>
  );
}
