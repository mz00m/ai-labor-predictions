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
    author: "Forecasting Research Institute",
    title: "Forecasting the Economic Effects of AI",
    summary:
      "69 economists, 52 AI experts, 38 superforecasters surveyed. Rapid scenario (14% prob): GDP ~4%, LFPR drops to 55% by 2050, ~10M AI job losses, top 10% holds 80% of wealth. Unconditional forecasts cluster near trends.",
    date: "Mar 31",
    url: "https://open.substack.com/pub/forecastingresearch/p/forecasting-the-economic-effects-of-ai",
    accent: "border-l-emerald-500",
  },
  {
    author: "Stefan Schubert (The Update Brief)",
    title: "How Much Will AI Increase Economic Growth?",
    summary:
      "Expert debate on FRI survey findings. Rapid AI scenario yields only +45% GDP over 25 years. Economists vs AI experts diverge on diffusion speed. Social backlash may constrain adoption more than technology.",
    date: "Apr 2",
    url: "https://open.substack.com/pub/theupdatebrief/p/how-much-will-ai-increase-economic",
    accent: "border-l-cyan-500",
  },
  {
    author: "Brookings Metro",
    title: "How AI May Reshape Career Pathways to Better Jobs",
    summary:
      "15.6M non-degree workers in top AI exposure quartile. ~49% of Gateway-to-Destination career pathways highly AI-exposed. 3.5M workers face both high exposure and low adaptive capacity.",
    date: "Apr 2",
    url: "https://www.brookings.edu/articles/how-ai-may-reshape-career-pathways-to-better-jobs/",
    accent: "border-l-amber-500",
  },
  {
    author: "Noah Smith (Noahpinion)",
    title: "Plentiful, High-Paying Jobs in the Age of AI",
    summary:
      "Compute constraints give AI a producer-specific bottleneck. Comparative advantage, not absolute advantage. Determines who works. Even if AI surpasses humans at everything, opportunity cost keeps human labor valuable.",
    date: "Mar 28",
    url: "https://www.noahpinion.blog/p/plentiful-high-paying-jobs-in-the-ff9",
    accent: "border-l-rose-500",
  },
  {
    author: "Annie Lowrey (The Atlantic)",
    title: "How to Guess If Your Job Will Exist in Five Years",
    summary:
      "Are you coal or a horse? Jevons paradox meets AI: software engineer hiring up 6% YoY even as Block cuts half its staff. Efficiency may expand demand for cognition, not shrink it.",
    date: "Mar 25",
    url: "https://www.theatlantic.com/ideas/2026/03/ai-job-loss-jevons-paradox/686520/",
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
