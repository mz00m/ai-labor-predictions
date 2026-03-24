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
    author: "Anthropic",
    title: "Anthropic Economic Index: Learning Curves",
    summary:
      "49% of jobs have 25%+ of tasks done via Claude. High-tenure users show 10% higher success rates. Coding migrates to automated API workflows. Skill-biased adoption may already be deepening labor market inequality.",
    date: "Mar 24",
    url: "https://www.anthropic.com/research/economic-index-march-2026-report",
    accent: "border-l-blue-500",
  },
  {
    author: "Imas, Shukla (Chicago Booth)",
    title: "How Will AI-driven Automation Actually Affect Jobs?",
    summary:
      "O-ring model shows exposure != displacement. Low-dimensional jobs (trucking, warehousing) face real risk; high-dimensional knowledge work gets augmented. Firm incentives and demand elasticity matter more than task exposure.",
    date: "Mar 23",
    url: "https://aleximas.substack.com/p/how-will-ai-driven-automation-actually",
    accent: "border-l-emerald-500",
  },
  {
    author: "Yale Budget Lab",
    title: "Evaluating the Impact of AI on the Labor Market: Jan/Feb CPS Update",
    summary:
      "Jan/Feb 2026 CPS data show no AI displacement. Occupational dissimilarity flat, exposure quintiles stable, Anthropic 'Observed Exposure' confirms stability over disruption.",
    date: "Mar 19",
    url: "https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-januaryfebruary-cps-update",
    accent: "border-l-cyan-500",
  },
  {
    author: "Martha Gimbel (Bloomberg)",
    title: "The Best Guide to the AI Revolution May Be Victorian Fiction",
    summary:
      "Industrial Revolution novels illuminate what living through epochal technological change feels like. Weavers were the white-collar workers of their day -- real wages fell by half in 14 years.",
    date: "Mar 20",
    url: "https://www.bloomberg.com/news/articles/2026-03-20/to-understand-ai-s-future-read-dickens-bronte-industrial-revolution-novels",
    accent: "border-l-orange-500",
  },
  {
    author: "Sahaj Garg (Wispr)",
    title: "The Displacement of Cognitive Labor and What Comes After",
    summary:
      "Stanford grad turned AI startup CTO argues cognitive labor automation is months away, not decades. Physical labor follows on a 5-10 year timeline. The identity crisis for knowledge workers may be worse than the economic one.",
    date: "Mar 18",
    url: "https://sahajgarg.github.io/blog/cognitive-labor/",
    accent: "border-l-amber-500",
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
