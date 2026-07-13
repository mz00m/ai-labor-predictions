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
    author: "Brynjolfsson, Agrawal, Korinek, Cunningham et al.",
    title: "We Must Act Now: A Statement on AI's Economic Transformation",
    summary:
      "Statement organized by Brynjolfsson, Agrawal, Korinek, and Cunningham; signed by 16 Nobel Laureates (Spence and Acemoglu named) and 200+ economists and AI researchers. Warns AI could drive an economic transformation 'larger than the Industrial Revolution' but on 'a vastly shorter time frame,' with large-scale job displacement as a primary risk. Calls for deeper research, policy frameworks, and institutions ensuring AI complements human capabilities. Four asks: deepen research, build enabling policy, redirect AI to benefit workers, re-architect political and economic systems before transformation arrives. Korinek: 'Steam, electricity, and computers each gave societies decades to adapt; AI may give us only a few years.'",
    date: "Jul 13",
    url: "https://www.wemustactnow.ai/",
  },
  {
    author: "Ben Casselman (NYT)",
    title: "A.I. Is Reshaping the Economy. Good Luck Measuring How.",
    summary:
      "Casselman's synthesis of the measurement problem: different data sources give contradictory answers on basic questions — is AI causing job losses or gains, which workers are most exposed, is the productivity boom real? Highlights new Yale Budget Lab 'occupational churn' monthly measure; Ramp/Revelio data finding companies using AI most intensely are adding jobs FASTER than laggards (opposite direction from displacement narrative); Nathan Goldschlag/EIG report on the measurement challenge itself; and a bipartisan Senate bill (Kelly D-AZ) to expand federal AI labor data collection. Frames the confusion as J-curve territory — most firms still on the downward experimentation phase before productivity gains materialize. Companion to Casselman's June 10 'Hidden Workers' piece.",
    date: "Jul 2",
    url: "https://www.nytimes.com/2026/07/02/business/economy/ai-economy-data.html",
  },
  {
    author: "Bharat Chandar",
    title: "AI and the Supply and Demand for Labor",
    summary:
      "Chandar (coauthor of the 'Canaries' paper) was 1 of 5 of 16 economists on a WSJ panel to predict AI would cause net job loss — with Acemoglu, Henderson, Restrepo, Wolfers. All 16 agreed AI boosts productivity; 8 predicted no change; 2 net growth. The 5 net-loss economists unanimously said AI replaces rather than complements and reduces white-collar demand. Chandar's key clarification: this isn't a 'jobs bloodbath' story — he expects AI to make people rich enough (via capital income or transfers) that the income effect dominates the substitution effect, lowering long-run labor force participation. A disambiguation of what economists actually mean by 'net job loss.'",
    date: "Jun 29",
    url: "https://bharatchandar.substack.com/p/ai-and-the-supply-and-demand-for",
  },
  {
    author: "Chip Cutter (WSJ)",
    title: "The New Push to Ready Millions for AI Career Upheaval",
    summary:
      "RAISE US launches as a bipartisan consortium with a 'people strategy' for the AI era — led by former Commerce Secretary Gina Raimondo and former Indiana Gov. Eric Holcomb, with founding employers Amazon, Microsoft, Bank of America, Eli Lilly, OpenAI and Anthropic, plus MIT's David Autor on the advisory board. The group has raised $500M+ (about half its multiyear goal) and will initially work with Arkansas, Maryland, Utah and Connecticut. Mandate goes beyond conventional retraining: revisiting unemployment insurance so displaced workers can keep benefits while starting AI-enabled businesses, and designing corporate incentives for employers to retain and reskill rather than lay off. The first large bipartisan, multi-state institutional response treating AI labor disruption as a policy problem.",
    date: "Jun 25",
    url: "https://www.wsj.com/lifestyle/careers/the-new-push-to-ready-millions-for-ai-career-upheaval-dfb04cc5",
  },
  {
    author: "The Economist",
    title: "Meet the world's top AI-pilled economists",
    summary:
      "Economic analysis of AI is migrating out of universities and into labs and government. Even under a 'rapid' AI scenario by 2030, the median academic economist expects US GDP growth of just 3.5% in 2050 — versus 5.3% for AI researchers — and only 11% of leading economists (Chicago survey) think AI will substantially raise unemployment. Junior lab economist roles pay $300K+; by 2019 two-thirds of AI researchers worked in industry, up from under half in 2001. Anthropic hired Anton Korinek, OpenAI hired Ronnie Chatterji, DeepMind hired Alex Imas. A sharp map of who is actually studying AI's economic impact.",
    date: "Jun 15",
    url: "https://www.economist.com/finance-and-economics/2026/06/15/meet-the-worlds-top-ai-pilled-economists",
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
