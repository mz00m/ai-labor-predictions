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
