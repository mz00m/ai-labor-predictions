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
    author: "Lodefalk et al. (RATIO/Örebro)",
    title: "Same Storm, Different Boats: GenAI and the Age Gradient in Hiring",
    summary:
      "Swedish population register data: 22-25yr employment in high-AI occupations fell 5.5% by 2025H1 (employer DiD). Posting decline driven by monetary policy, not AI.",
    date: "Mar 16",
    url: "https://cms.ratio.se/app/uploads/2026/03/lodefalk_march16_paper_v2-kombinerades.pdf",
    accent: "border-l-amber-500",
  },
  {
    author: "Baslandze et al. (Fed Atlanta/Duke)",
    title: "AI, Productivity, and the Workforce: Evidence from Corporate Executives",
    summary:
      "Survey of 750 CFOs: <0.4% aggregate job loss, productivity paradox (reported 3x implied gains), finance leads. Routine clerical declining; skilled-technical rising.",
    date: "Mar 13",
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6410338",
    accent: "border-l-violet-500",
  },
  {
    author: "Schaul, Ovide (WaPo)",
    title: "Which Jobs Are Most Threatened by AI, and Who May Adapt",
    summary:
      "Interactive tool mapping 350+ occupations by AI exposure and adaptability. 6.1M clerical workers most vulnerable; 86% women.",
    date: "Mar 16",
    url: "https://www.washingtonpost.com/technology/interactive/2026/jobs-most-affected-ai-automation/",
    accent: "border-l-rose-500",
  },
  {
    author: "Noah Smith (Noahpinion)",
    title: "The Future Isn\u2019t What It Used to Be",
    summary:
      "American optimism about the future has declined sharply as AI uncertainty, political chaos, and geopolitical risks make the future a blank wall of fog.",
    date: "Mar 15",
    url: "https://www.noahpinion.blog/p/the-future-isnt-what-it-used-to-be",
    accent: "border-l-emerald-500",
  },
  {
    author: "Sivulka (Hebbia)",
    title: "Productive Individuals Don\u2019t Make Productive Firms",
    summary:
      "Individual AI productivity gains aren\u2019t translating to firm-level value. Seven pillars of institutional intelligence for organizational AI adoption.",
    date: "Mar 11",
    url: "https://x.com/gsivulka/status/2031797989908627849",
    accent: "border-l-cyan-500",
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
          className={`featured-card group border-l-2 ${a.accent} rounded-r-md bg-black/[0.02] dark:bg-white/[0.03] px-2.5 py-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}
        >
          <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wide truncate">
            {a.author}{a.date && <span className="opacity-50"> &middot; {a.date}</span>}
          </p>
          <h3 className="text-[12px] font-bold text-[var(--foreground)] leading-snug mt-0.5 group-hover:text-[var(--accent)] line-clamp-2" style={{ transition: "color 0.15s ease" }}>
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
