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
    author: "Bharat Chandar",
    title: "AI and the Supply and Demand for Labor",
    summary:
      "Chandar (coauthor of the 'Canaries' paper) was 1 of 5 of 16 economists on a WSJ panel to predict AI would cause net job loss — with Acemoglu, Henderson, Restrepo, Wolfers. All 16 agreed AI boosts productivity; 8 predicted no change; 2 net growth. The 5 net-loss economists unanimously said AI replaces rather than complements and reduces white-collar demand. Chandar's key clarification: this isn't a 'jobs bloodbath' story — he expects AI to make people rich enough (via capital income or transfers) that the income effect dominates the substitution effect, lowering long-run labor force participation. A disambiguation of what economists actually mean by 'net job loss.'",
    date: "Jun 29",
    url: "https://bharatchandar.substack.com/p/ai-and-the-supply-and-demand-for",
  },
  {
    author: "The Economist",
    title: "Meet the world's top AI-pilled economists",
    summary:
      "Economic analysis of AI is migrating out of universities and into labs and government. Even under a 'rapid' AI scenario by 2030, the median academic economist expects US GDP growth of just 3.5% in 2050 — versus 5.3% for AI researchers — and only 11% of leading economists (Chicago survey) think AI will substantially raise unemployment. Junior lab economist roles pay $300K+; by 2019 two-thirds of AI researchers worked in industry, up from under half in 2001. Anthropic hired Anton Korinek, OpenAI hired Ronnie Chatterji, DeepMind hired Alex Imas. A sharp map of who is actually studying AI's economic impact.",
    date: "Jun 15",
    url: "https://www.economist.com/finance-and-economics/2026/06/15/meet-the-worlds-top-ai-pilled-economists",
  },
  {
    author: "Erik Brynjolfsson et al. (Stanford DEL)",
    title: "The AI Economic Indicators",
    summary:
      "Stanford's Digital Economy Lab launches a monthly-updated dashboard suite tracking AI's real economic footprint — the live successor to the Canaries research. An Employment & AI Exposure dashboard built on ADP payroll records covering millions of workers; a Canaries dashboard showing a 16% relative employment decline for workers 22–25 in the most AI-exposed occupations, concentrated where AI automates rather than augments; and a Takeoff Tracker scanning 12 macro indicators — productivity, capital share, energy use — that currently read mostly neutral. A standing answer to 'what does the data show right now?'",
    date: "Jun 2026",
    url: "https://digitaleconomy.stanford.edu/project/indicators/",
  },
  {
    author: "Bill Wasik, mod. (NYT Magazine)",
    title: "Who Will Actually Thrive in the Hybrid A.I.-Human Work Force",
    summary:
      "Four experts — Daron Acemoglu, Dean Ball, Ethan Mollick and Clara Shih — debate how workers should prepare. Mollick cites a P&G experiment with 776 employees where individuals using AI matched two-person teams without it — and warns the apprenticeship model for training juniors has 'all collapsed.' Acemoglu challenges the agent-supervisor future ('How many Marcus Chens can the American economy employ?') and argues investment should flow to augmenting shortage trades — a novice electrician with the right AI tool could be 10x as productive. Shih sees a 'tale of two cities': entry-level candidates fluent in AI agents get hired; the rest watch those roles disappear.",
    date: "Jun 9",
    url: "https://www.nytimes.com/2026/06/09/magazine/ai-jobs-workforce-labor.html",
  },
  {
    author: "Patricia Cohen (NYT)",
    title: "A.I. Doesn't Have to Mean Layoffs",
    summary:
      "Schneider Electric (160K employees) chose augmentation over replacement. In Q4 2025, AI answered 75% of 150K customer service queries — but agents still review every response, preserving headcount while cutting response times. On the factory floor, AI cut manufacturing waste 73%. Erik Brynjolfsson argues bigger gains come from making workers productive than from cutting them. The counterpoint comes from within: Schneider's own AI-assisted workforce built a product that eliminates the need for an electrician.",
    date: "May 29",
    url: "https://www.nytimes.com/2026/05/29/business/economy/ai-jobs-productivity.html",
  },
  {
    author: "David M. Solomon (NYT)",
    title: "I'm the C.E.O. of Goldman Sachs. The A.I. Job Apocalypse Is Overblown.",
    summary:
      "Goldman's CEO argues AI will automate 25% of work hours but won't eliminate 25% of jobs — complexity expands to fill freed capacity. Cites a Stanford study showing entry-level employment in the most AI-exposed occupations has already declined 16%, but notes US companies churn 25–35M jobs annually and Goldman's own data center demand has created 200K+ construction jobs since 2022. A major CEO staking out the optimist position with internal data.",
    date: "May 22",
    url: "https://www.nytimes.com/2026/05/22/opinion/ai-job-crisis-goldman-sachs.html",
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
