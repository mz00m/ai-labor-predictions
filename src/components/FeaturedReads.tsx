const articles = [
  {
    author: "Krugman",
    title: "When Extraterrestrials Attacked the Stock Market",
    summary:
      "A viral AI scenario may have moved markets despite containing no new facts.",
    date: "Feb 26",
    url: "https://paulkrugman.substack.com/p/when-extraterrestrials-attacked-the",
    accent: "border-l-amber-500",
  },
  {
    author: "Thompson",
    title: "Nobody Knows Anything",
    summary:
      "The knowledge vacuum around AI's effects allows speculative narratives to drive markets.",
    date: "Feb 25",
    url: "https://www.derekthompson.org/p/nobody-knows-anything",
    accent: "border-l-blue-500",
  },
  {
    author: "Citrini & Shah",
    title: "The 2028 Global Intelligence Crisis",
    summary:
      "AI displacement triggers a self-reinforcing loop: job losses collapse spending, forcing deeper automation.",
    date: "Feb 22",
    url: "https://www.citriniresearch.com/p/2028gic",
    accent: "border-l-rose-500",
  },
  {
    author: "Citadel",
    title: "The 2026 Global Intelligence Crisis",
    summary:
      "AI adoption follows S-curve constraints — productivity gains will boost real incomes, not cause contraction.",
    date: "Feb 24",
    url: "https://www.citadelsecurities.com/news-and-insights/2026-global-intelligence-crisis/",
    accent: "border-l-emerald-500",
  },
];

export default function FeaturedReads() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      {articles.map((a) => (
        <a
          key={a.url}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group border-l-2 ${a.accent} rounded-r-md bg-black/[0.02] dark:bg-white/[0.03] px-3 py-2.5 transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}
        >
          <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wide">
            {a.author} <span className="opacity-50">&middot; {a.date}</span>
          </p>
          <h3 className="text-[13px] font-bold text-[var(--foreground)] leading-snug mt-0.5 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {a.title}
          </h3>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed mt-1 line-clamp-2">
            {a.summary}
          </p>
        </a>
      ))}
    </div>
  );
}
