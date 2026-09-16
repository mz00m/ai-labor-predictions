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
  {
    author: "Korinek, Jones, Sacher, Cotter & McCrory (Anthropic Institute)",
    title: "Economic Scenarios for Transformative AI",
    summary:
      "Converts the AI-and-jobs argument into disagreement about five measurable parameters — what share of tasks AI can do, how widely it is used, the productivity gain per task, how much of that use automates rather than augments, and how fast displaced workers find new work — then returns GDP, the labor share, wages, reallocation and unemployment to 2030. Three illustrations bracket the range. Modest: GDP 1.6% above the no-AI path, unemployment up a tenth of a point. Extreme: GDP 32% above it, growth at 15% a year, the labor share down from 60% to 45%, and nearly one in five cognitive workers unemployed. Read the wage result carefully. The average wage rises in every scenario, but in the extreme case that average is 9.7% up while the cognitive wage is 11.5% down, with the gain landing on construction, care and the trades. The discipline is the reason to trust it. The authors attach no probabilities and say so repeatedly; the scenarios exist to make assumptions comparable, not to forecast. They argue against themselves at length — the innovation channel turns out small, and the model has no robotics, no aggregate demand, no policy response, and workers who differ only by which of two occupation groups they sit in. Acemoglu, Autor, Moll, Nakamura, Restrepo, Romer and Steinsson reviewed it, were not asked to endorse it, and their criticisms are printed rather than buried. The distributional arithmetic is what will get quoted: in the extreme case the economy gains roughly three times what cognitive workers lose, so a transfer of about 9% of GDP would hold them whole — Social Security and Medicare combined.",
    date: "Sep 1",
    url: "https://www.anthropic.com/institute/econ-scenarios",
  },
  {
    author: "The Economist",
    title: "The jobs apocalypse is postponed. An AI jobs boom is here",
    summary:
      "The Economist puts a number on the creation side of the ledger, which almost no one else does: roughly 1m AI-created US jobs against about 200,000 lay-offs attributed to AI since mid-2023. Understand the construction before quoting the headline. Three channels are stacked — the data-centre build-out, AI-native hiring, and new AI roles at incumbents — and each is measured as employment above trend rather than by direct attribution to AI. Five data-centre-adjacent industries have added roughly 320,000 jobs beyond what construction and manufacturing trends would predict; engineers, developers, mathematicians and data scientists about 730,000. The piece concedes that not all of these owe their existence to AI, which makes the 1m an upper bound on a real effect rather than a measurement of it. Two independent counts land lower: Levanon at Burning Glass puts AI jobs at roughly 1% of professional employment, LinkedIn at about 640,000 AI-specific roles created between 2023 and 2025. It is also more useful than its headline on the destruction side — professional and business services hiring runs about 10% below its 2015-19 average, customer-service employment is down about 10% and secretaries and administrative assistants about 15% since January 2023, and the BLS expects office and administrative support to shed 752,000 jobs by 2035. The tension worth carrying is on young workers: this reads the 20-24 unemployment gap as near a multi-decade low, where Canaries and the Revelio tracker both find early-career workers in exposed occupations well behind their peers. Different comparisons rather than contradictory findings, and holding both is the point.",
    date: "Sep 4",
    url: "https://www.economist.com/finance-and-economics/2026/09/04/the-jobs-apocalypse-is-postponed-an-ai-jobs-boom-is-here",
  },
  {
    author: "Abel, Deitz, Emanuel & Montalbano (NY Fed)",
    title: "Businesses Are Using AI to Transform Work, Not Cut Jobs",
    summary:
      "The third year of the NY Fed's AI module, and the first where a majority of firms on both sides of the survey say yes. Service-firm adoption went 25% to 40% to 61%; manufacturers went 16% to 26% to 51%. That is a steeper curve than any national series shows, and the reason to trust it is that the bar is higher, not lower — firms using AI only as a search tool are counted as non-users. The finding worth carrying is the gap the same survey opens between adoption and use. Three-quarters of service firms and more than 90% of manufacturers call their AI investment minimal to modest, and among firms that do use AI, the median one has just 17% of its workers on it in services and 7% in manufacturing. Very few sources measure firm adoption and within-firm worker uptake in the same instrument, and here they differ by roughly a factor of four. On labor, the channels roughly cancel: 4% of service adopters laid anyone off because of AI (from 1% last year), 15% hired fewer than they otherwise would have, 13% hired more, and just over a third retrained — retraining exceeds every displacement channel measured, which is where the title comes from. Two limits worth holding. This is New York State and northern New Jersey, a footprint tilted toward finance, information and professional services, so the 61% cannot be set against the national Census figure of roughly 22%. And every workforce number is a firm attributing its own hiring decision to AI, with no payroll check behind it.",
    date: "Sep 1",
    url: "https://libertystreeteconomics.newyorkfed.org/2026/09/businesses-are-using-ai-to-transform-work-not-cut-jobs/",
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
