interface Article {
  author: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  internal?: boolean;
}

const articles: Article[] = [
  {
    author: "Andrew R. Hanson (Strada Institute)",
    title: "Entry-Level Hiring in the AI Era: What Employers Are Thinking (and Doing)",
    summary:
      "Strada's survey of 1,498 US executives and senior talent leaders (Mar 2026) finds AI is, so far, a net positive for entry-level hiring. In 2025, 46% of employers that have at least explored AI say it raised entry-level hiring vs 13% who say it cut — nearly 4-to-1 — and 2.7x more expect AI to raise than cut hiring in 2026. Greater AI use is the single most-cited positive driver (27%). But the bar is rising: 42% say AI shifted entry-level work toward analytical, judgment-based tasks while 41% report routine admin tasks shrinking, and among the minority cutting roles, reductions concentrate in admin (46%) and customer support (44%). Notably, employers rank AI literacy the least important skill — behind critical thinking and communication.",
    date: "May 2026",
    url: "https://www.strada.org/news-insights/entry-level-hiring-in-the-ai-era-what-employers-are-thinking-and-doing",
  },
  {
    author: "Garg, Crosta & Baier",
    title: "Global Automation Atlas",
    summary:
      "The first global task-level automation index: 18,797 O*NET tasks scored across 124 countries producing 2.33M task-country labels. Core insight: the same task carries different automation risk depending on local wages, technology adoption, workforce skills, and production environment — automation pressure isn't uniform, it's geographic. Covers nations representing 99%+ of global GDP and population, providing a cross-country comparative baseline that US-centric indices can't offer.",
    date: "2026",
    url: "https://automationatlas.org/",
  },
  {
    author: "Heck, Muro, Methkupally & Siegmund (Brookings Metro / Opportunity@Work)",
    title: "How AI May Reshape Career Pathways to Better Jobs",
    summary:
      "The most rigorous look yet at how AI threatens climbing-the-ladder mobility for workers without four-year degrees. Of America's ~70M STARs (skilled through alternative routes), 15.6M work in roles in the top quartile of AI exposure; 11M of those are in 'Gateway' occupations — the stepping-stone roles that historically lead to higher-wage 'Destination' jobs. 3.5M STARs face high AI exposure AND low adaptive capacity. Only 51% of Gateway-to-Destination career pathways avoid high AI exposure, meaning nearly half of the mobility ladders this cohort relies on are at risk. With 73% of US workers living/working in the same county, the disruption will be place-specific — and remediation has to be too.",
    date: "Apr 2",
    url: "https://www.brookings.edu/articles/how-ai-may-reshape-career-pathways-to-better-jobs/",
  },
  {
    author: "Tanner, Kyosovska, Belle, Kerry, Renda, Tabassi & Wyckoff (Brookings FCAI)",
    title: "AI Growth Acceleration Versus Distributional Fairness",
    summary:
      "Brookings briefing on the productivity–diffusion–distribution trilemma. NBER Feb 2026 survey of ~6,000 US/UK/DE/AU executives: 70% of firms 'actively use AI,' yet executives spend only ~1.5 hrs/wk on it and ~90% report no impact on employment or productivity over the past three years. (The briefing also cites METR's original 19% developer-slowdown finding, which METR later retracted in Feb 2026 due to selection bias; the redesigned study suggests a likely speedup with wide CIs.) US BTOS (Feb 2026): 17.5% of US businesses used AI in at least one function in the last two weeks; Eurostat (2025): 19.95% of EU firms with 10+ employees. The macro upshot: frontier capability is racing ahead (training compute doubling every 5 months), but diffusion is uneven, complement-bound, and lagging.",
    date: "May 5",
    url: "https://www.brookings.edu/articles/ai-growth-acceleration-versus-distributional-fairness/",
  },
  {
    author: "Gimbel, Kendall & Nunn (Yale Budget Lab)",
    title: "What We Do and Don't Know About How AI is Affecting the Labor Market",
    summary:
      "The strongest null-result paper to date. Using synthetic differences-in-differences to compare AI-exposed (top tercile) vs. a synthetic-control group built from unexposed occupations, the authors find no statistically significant AI effect on employment shares or real hourly wages through 2026Q1. Unemployment rose ~0.5pp in the latest quarter for the AI-exposed group (more for 16–34 year olds) but remains statistically insignificant. Honest about the limits: LLMs are still improving, exposure metrics may misclassify, CPS is underpowered for the 22–27 cohort. Required reading for anyone calibrating their confidence about what the data already shows.",
    date: "May 7",
    url: "https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market",
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
          className="group border-l-2 border-l-slate-200 rounded-r-md bg-black/[0.02] dark:bg-white/[0.03] px-2.5 py-2 transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:border-l-[var(--accent)]"
        >
          <p className="text-2xs font-semibold text-[var(--muted)] uppercase tracking-wide truncate">
            {a.author}{a.date && <span className="opacity-50"> &middot; {a.date}</span>}
          </p>
          <h3 className="text-sm font-bold text-[var(--foreground)] leading-snug mt-0.5 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {a.title}
          </h3>
          <p className="text-2xs text-[var(--muted)] leading-relaxed mt-0.5 line-clamp-2">
            {a.summary}
          </p>
        </a>
      ))}
    </div>
  );
}
