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
    author: "Stanford HAI",
    title: "Inside the AI Index: 12 Takeaways from the 2026 Report",
    summary:
      "AI workforce disruption moves from prediction to reality. Software devs aged 22-25 employment -20% since 2024. GenAI hit 53% population adoption in 3yrs (US 28.3%). Physicians report 83% less time on clinical notes. Transparency scores dropped to 40 from 58.",
    date: "Apr 13",
    url: "https://hai.stanford.edu/news/inside-the-ai-index-12-takeaways-from-the-2026-report",
    accent: "border-l-emerald-500",
  },
  {
    author: "OpenAI",
    title: "Industrial Policy for the Intelligence Age: Ideas to Keep People First",
    summary:
      "OpenAI's policy blueprint for superintelligence transition. Proposes public wealth fund, 32-hour workweek pilots, portable benefits, adaptive safety nets. Warns productivity gains may not reach workers without deliberate policy.",
    date: "Apr 1",
    url: "https://cdn.openai.com/pdf/561e7512-253e-424b-9734-ef4098440601/Industrial%20Policy%20for%20the%20Intelligence%20Age.pdf",
    accent: "border-l-cyan-500",
  },
  {
    author: "MIT Center for Collective Intelligence",
    title: "Where Can AI Be Used? Insights from a Deep Ontology of Work Activities",
    summary:
      "92% of AI apps map to only 6.8% of work activities. AI grew 6x but coverage only 1.2x. 75% of AI value in software/info tasks. Think/Do/Interact ontology of 39,603 activities from O*NET.",
    date: "Mar 27",
    url: "https://arxiv.org/abs/2603.20619",
    accent: "border-l-amber-500",
  },
  {
    author: "NYT (Ben Casselman)",
    title: "Economists Once Dismissed the A.I. Job Threat, but Not Anymore",
    summary:
      "Economists shifting from skeptical to 'it's coming.' BCG: >50% of jobs reshaped in 2-3y. Kinder: entry-level research hires replaced by Claude. Gimbel: speed and breadth determine pain.",
    date: "Apr 3",
    url: "https://www.nytimes.com/2026/04/03/business/economists-once-dismissed-the-ai-job-threat-but-not-anymore.html",
    accent: "border-l-rose-500",
  },
  {
    author: "Forecasting Research Institute",
    title: "Forecasting the Economic Effects of AI",
    summary:
      "69 economists, 52 AI experts, 38 superforecasters surveyed. Rapid scenario (14% prob): GDP ~4%, LFPR drops to 55% by 2050, ~10M AI job losses, top 10% holds 80% of wealth. Unconditional forecasts cluster near trends.",
    date: "Mar 31",
    url: "https://open.substack.com/pub/forecastingresearch/p/forecasting-the-economic-effects-of-ai",
    accent: "border-l-violet-500",
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
