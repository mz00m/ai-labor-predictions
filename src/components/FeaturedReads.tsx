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
  {
    author: "Pope Leo XIV (The Holy See)",
    title: "Magnifica Humanitas: On Safeguarding the Human Person in the Time of AI",
    summary:
      "The first papal encyclical to treat AI as a central topic. Warns of a 'significant and rapid contraction in available jobs,' wage polarization — 'outsized remuneration for a highly specialized minority alongside declining wages for a large portion of the workforce' — and that AI can 'paradoxically de-skill workers, subject them to automated surveillance.' Frames policy through subsidiarity and integral human development.",
    date: "May 15",
    url: "https://www.vatican.va/content/leo-xiv/en/encyclicals/documents/20260515-magnifica-humanitas.html",
  },
  {
    author: "Saanya Ojha (Substack)",
    title: "The Frontier and the Froth",
    summary:
      "A 'two realities' argument: the capability ceiling is rising fast while enterprise implementation stays stubbornly human. At the frontier, an OpenAI model made progress on a unit-distance conjecture Paul Erdős posed in 1946 — cross-domain reasoning, not brute force — which Fields Medalist Timothy Gowers called 'a milestone in AI mathematics.' At the floor, Starbucks scrapped an AI inventory tool deployed across 11,000+ North American stores after nine months of inaccuracies, reverting to manual counts. Ojha's warning: firms route existing workflows through AI and count the collision as adoption — 'metric theater' that inflates usage the way adjusted EBITDA flatters earnings. Capability does not automatically become productivity.",
    date: "May 22",
    url: "https://saanyaojha.substack.com/p/the-frontier-and-the-froth",
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
