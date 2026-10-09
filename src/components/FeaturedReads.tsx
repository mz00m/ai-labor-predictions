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
    author: "Derek Thompson",
    title: "The 26 Most Important Facts About AI and the Economy",
    summary:
      "Why AI looks enormous in the capital accounts and modest in the labor data. Adoption hit 50% in about three years, the fastest on record, but daily work use runs 10–25% depending on the survey and under 3% of households pay for AI. Spending meanwhile approaches $1 trillion a year, the biggest buildout relative to GDP since the railroads, against roughly $280 billion in annualized external revenue that is concentrated and, in Ramp's August data, starting to wobble. A synthesis of others' charts, so trace figures to their sources before citing.",
    date: "Oct 8",
    url: "https://www.derekthompson.org/p/the-state-of-ai-in-2026in-26-charts",
  },
  {
    author: "Imas & Schaal (Ghosts of Electricity)",
    title: "Has AI impacted the labor market yet?",
    summary:
      "The best current map of the junior-hiring debate, and its verdict is narrower than the headlines: AI may already be cutting hiring into the most exposed junior white-collar roles, but the attribution is contested and aggregate disruption has not appeared. The Canaries gap for 22-25-year-olds in exposed jobs reached 19% by June 2026 — but roughly halves once occupational education is controlled for, and the within-firm estimates attenuated with a cleaner data pipeline. The replication is uneven: the UK, Switzerland and Sweden show junior declines, while population-wide Nordic data does not — in Norway, employment in the most exposed occupations grew 0.1% against 0.3% in the least exposed, an insignificant gap. The sharpest dispute is remote work: in postings from four countries the AI coefficient drops to zero once work-from-home exposure is added, yet on ADP payroll data the same specification leaves AI standing and shrinks remote work. Adoption evidence cuts the other way too — Danish workers show precise nulls on earnings, and the heaviest AI spenders in Ramp data grew entry-level employment 12%. Only 1% of laid-off workers attribute their layoff to AI.",
    date: "Sep 29",
    url: "https://aleximas.substack.com/p/has-ai-impacted-the-labor-market",
  },
  {
    author: "Chandar & Klein Teeselink (Stanford DEL)",
    title: "How Does AI Change Labor Demand? Evidence from 41 Countries",
    summary:
      "The firm-side counterpart to Canaries, by one of its authors, and it complicates the entry-level story. Chandar and Klein Teeselink instrument AI adoption off job ads involving generative AI, then trace what happens inside the foreign affiliates of adopting companies against matched controls — 1.25 billion job postings and 154 million employment records across 41 countries. The junior share of employment at adopters falls 1.9 percentage points by March 2026, about 3.3% of a 57.1% baseline. The mechanism is the finding: that decline comes mostly from senior employment rising 6.7%, not from junior employment falling — the junior change is −2.5% and not statistically significant, and total employment is up 3.3%. Juniors are being diluted rather than displaced, at least at this horizon. Occupation mix barely moves — under half a point in 21 of 22 groups — and the exception is the one that matters: computer and mathematical occupations, the most exposed group, where the employment share grows 0.8 points while the junior share inside it falls 3.3. The authors read that as AI being labor expanding rather than labor saving for software, with the cost landing on who gets hired rather than on how many are employed. Among technology affiliates it is sharper: junior share −3.9 points, senior employment +14.6%, total +7.8%. Two things to hold. This is a firm-level cross-border design, so it answers what happens inside adopting companies, not to a national labor market. And junior here means seniority, not age 22-25, so it is not the same quantity as the Canaries series even though it points the same way.",
    date: "Sep 20",
    url: "https://digitaleconomy.stanford.edu/publication/how-does-ai-change-labor-demand/",
  },
  {
    author: "Jacobs & Imas (DeepMind Institute)",
    title: "Economic Policy for AGI",
    summary:
      "The first serious attempt to compare the policy options for an AI transition on a common rubric rather than argue for one. Jacobs and Imas rate eleven interventions — retraining, wage insurance, EITC, a jobs guarantee, UI, negative income tax, UBI, a sovereign AI dividend, universal basic capital, universal basic services and industrial policy — across welfare, agency, feasibility and durability under three scenarios. The central argument is against picking one: since nobody can say which scenario arrives, policies should be designed now and sequenced against observable triggers. Expanded UI, EITC and employer-led retraining for mild disruption; EITC converting to a negative income tax if unemployment spells lengthen and median wages fall faster than jobs are reinstated; universal basic capital held in reserve for a sustained decline in labor's share of GDP. The useful output is the tension between dimensions. EITC tops feasibility at 79.8 and sits near the bottom on durability under full transformation at 31.9. UBC inverts it: first on agency at 76.3 and 93.5 on durability under transformation, but second-last on feasibility at 33.1. The case against UBI is made on efficiency rather than ideology — blunt, expensive, and it leaves recipients no stake in the automated economy. One caveat to hold firmly: the scores come from 51 AI agent personas built on survey data from 51 real economists, not from 51 economists, and that distinction gets lost fast in summary. The real survey numbers are separate and worth more — 85% of Americans back publicly funded retraining, 72% UI, 54% UBC.",
    date: "Jul 9",
    url: "https://institute.deepmind.com/essays/economic-policy-for-agi/",
  },
  {
    author: "Orr, Tucker & Warren (Census CES)",
    title: "Graduating into Disruption: Labor Market Outcomes for AI-Exposed College Majors",
    summary:
      "The first study here to identify AI exposure by field of study rather than occupation, and that choice is the reason to take it seriously: a major is picked years before anyone meets a hiring manager, which sidesteps the anticipation problem in occupation-based measures, where employers may be pulling back from roles they expect AI to take rather than work it already does. Census PSEO and LEHD administrative records, 6,665,500 bachelor's graduates, about 29% of all US bachelor's degrees conferred 2016-2024. Graduates in the most AI-exposed decile of majors — largely computer science, information systems and software-adjacent fields — became 5 percentage points less likely to be employed in the quarter after graduation and earned about 13% less, both against the least exposed fields and both starting immediately after ChatGPT. The recession literature puts initial earnings losses from graduating into a downturn at 9-10%, so this is worse, though concentrated in a few fields rather than economy-wide. The decomposition is the most useful part: roughly half the decline is lower pay inside the same industries and half is graduates moving into worse-paying ones. The share entering Professional, Scientific and Technical services fell almost 6 points and Information over 3, while Accommodation and Food Services and Retail each gained more than 2. Counting that shift, top-decile earnings fell 15%, to levels last seen before 2016. Two honest limits: the effect attenuates to about 5% after two years, and the sampled institutions skew large, public and research-heavy.",
    date: "Sep 10",
    url: "https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-56.html",
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
