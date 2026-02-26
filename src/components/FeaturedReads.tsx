const articles = [
  {
    author: "Paul Krugman",
    title: "When Extraterrestrials Attacked the Stock Market",
    summary:
      "A viral AI scenario may have moved markets despite containing no new facts — Krugman argues technological disruption doesn't necessarily cause macro crises.",
    date: "Feb 26, 2026",
    url: "https://paulkrugman.substack.com/p/when-extraterrestrials-attacked-the",
    color: "from-amber-500/10 to-orange-500/10",
    accent: "bg-amber-500",
  },
  {
    author: "Derek Thompson",
    title: "Nobody Knows Anything",
    summary:
      "Uncertainty about AI's economic impact has created a marketplace of competing sci-fi narratives — empirical data still shows little measurable effect on employment.",
    date: "Feb 25, 2026",
    url: "https://www.derekthompson.org/p/nobody-knows-anything",
    color: "from-blue-500/10 to-cyan-500/10",
    accent: "bg-blue-500",
  },
  {
    author: "Citrini & Alap Shah",
    title: "The 2028 Global Intelligence Crisis",
    summary:
      "A scenario where AI displacement triggers a self-reinforcing loop: job losses collapse spending, forcing deeper automation and threatening mortgages and tax revenue.",
    date: "Feb 22, 2026",
    url: "https://www.citriniresearch.com/p/2028gic",
    color: "from-rose-500/10 to-pink-500/10",
    accent: "bg-rose-500",
  },
  {
    author: "Citadel Securities",
    title: "The 2026 Global Intelligence Crisis",
    summary:
      "AI adoption follows traditional S-curve constraints — productivity gains will function as a positive supply shock, boosting real incomes rather than causing contraction.",
    date: "Feb 24, 2026",
    url: "https://www.citadelsecurities.com/news-and-insights/2026-global-intelligence-crisis/",
    color: "from-emerald-500/10 to-teal-500/10",
    accent: "bg-emerald-500",
  },
];

export default function FeaturedReads() {
  return (
    <section className="relative -mx-6 sm:-mx-10 px-6 sm:px-10 py-10 sm:py-12">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/[0.04] via-[#3b82f6]/[0.03] to-[#06b6d4]/[0.04] pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/20 to-transparent" />

      <div className="relative">
        <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-1">
          Essential Reading
        </p>
        <p className="text-[15px] text-[var(--muted)] mb-6">
          The articles driving this week&rsquo;s AI-and-labor conversation
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map((a) => (
            <a
              key={a.url}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-gradient-to-br ${a.color} p-4 transition-all hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className={`w-8 h-1 ${a.accent} rounded-full mb-3 opacity-70`} />
              <p className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wide mb-1">
                {a.author}
              </p>
              <h3 className="text-[15px] font-bold text-[var(--foreground)] leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors">
                {a.title}
              </h3>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
                {a.summary}
              </p>
              <p className="text-[11px] text-[var(--muted)]/60 font-medium">
                {a.date}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
