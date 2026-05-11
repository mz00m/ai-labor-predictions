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
    author: "Tanner, Kyosovska, Belle, Kerry, Renda, Tabassi & Wyckoff (Brookings FCAI)",
    title: "AI Growth Acceleration Versus Distributional Fairness",
    summary:
      "Brookings briefing on the productivity–diffusion–distribution trilemma. NBER Feb 2026 survey of ~6,000 US/UK/DE/AU executives: 70% of firms 'actively use AI,' yet executives spend only ~1.5 hrs/wk on it and ~90% report no impact on employment or productivity over the past three years. METR's randomized trial found experienced open-source developers using early-2025 AI tools were 19% SLOWER on their own repos — counter to the well-cited customer-support finding of +15% productivity (mostly for novices). US BTOS (Feb 2026): 17.5% of US businesses used AI in at least one function in the last two weeks; Eurostat (2025): 19.95% of EU firms with 10+ employees. The macro upshot: frontier capability is racing ahead (training compute doubling every 5 months), but diffusion is uneven, complement-bound, and lagging.",
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
  {
    author: "Ezra Klein (NYT)",
    title: "Why the A.I. Job Apocalypse (Probably) Won't Happen",
    summary:
      "Klein's macro-vs-anecdata case: unemployment 4.3% in Mar 2026 vs 4.4% in Mar 2020, hourly earnings stable, software engineer demand booming despite Claude Code. Drawing on Imas's 'what becomes scarce' framework, predicts labor shifts to the relational sector — Nespresso didn't kill baristas; coffee shops kept multiplying. Cites VisiCalc (1979) which quadrupled accountant employment over 40 years rather than displacing them. The harder scenario isn't 80M displaced but 8M: the U.S. responds poorly to localized shocks (cf. China shock's ~2M jobs), so partial AI displacement may go untreated.",
    date: "May 3",
    url: "https://www.nytimes.com/2026/05/03/opinion/ai-jobs-unemployment-silicon-valley.html",
  },
  {
    author: "Jasmine Sun (NYT Opinion)",
    title: "The A.I. Fear Keeping Silicon Valley Up at Night",
    summary:
      "Reported from inside the SF AI bubble: the 'San Francisco consensus' is that the median worker is screwed and labs differ mostly on what to do about it. OpenAI's GDPVal benchmark went from sub-human to 80%+ win rate vs human pros in months; Block CEO Jack Dorsey cut ~half his staff in March citing coding agents; Anthropic enterprise-agent revenue jumped from $9B to $30B annualized. OpenAI's new white paper floats a 32-hour week and a public wealth fund; Shor polling finds 72% of voters fear AI drives down wages.",
    date: "Apr 30",
    url: "https://www.nytimes.com/2026/04/30/opinion/ai-labor-work-force-silicon-valley.html",
  },
  {
    author: "Daniel Björkegren (Brown)",
    title: "The intelligence is plenty but the workers are few",
    summary:
      "LMICs employ <10% of workers in skilled knowledge work vs. 41% in high-income countries — so there's little to graft AI onto. Rich-country adoption runs through existing knowledge workers; LMICs lack that base. But cheap intelligence could also leapfrog: small manufacturers could access capabilities previously requiring large teams, and LMICs face less political resistance to AI adoption. A crucial question for development economics: does AI augment scarce knowledge workers, or does it automate knowledge work entirely?",
    date: "Apr 28",
    url: "https://dan.bjorkegren.com/blog/2026/04/the-intelligence-is-plenty-but-the-workers-are-few/",
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
