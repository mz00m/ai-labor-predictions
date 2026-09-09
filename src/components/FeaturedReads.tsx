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
    author: "The Economist",
    title: "The jobs apocalypse is postponed. An AI jobs boom is here",
    summary:
      "The Economist puts a number on the creation side of the ledger, which almost no one else does: roughly 1m AI-created US jobs against about 200,000 lay-offs attributed to AI since mid-2023. Understand the construction before quoting the headline. Three channels are stacked — the data-centre build-out, AI-native hiring, and new AI roles at incumbents — and each is measured as employment above trend rather than by direct attribution to AI. Five data-centre-adjacent industries have added roughly 320,000 jobs beyond what construction and manufacturing trends would predict; engineers, developers, mathematicians and data scientists about 730,000. The piece concedes that not all of these owe their existence to AI, which makes the 1m an upper bound on a real effect rather than a measurement of it. Two independent counts land lower: Levanon at Burning Glass puts AI jobs at roughly 1% of professional employment, LinkedIn at about 640,000 AI-specific roles created between 2023 and 2025. It is also more useful than its headline on the destruction side — professional and business services hiring runs about 10% below its 2015-19 average, customer-service employment is down about 10% and secretaries and administrative assistants about 15% since January 2023, and the BLS expects office and administrative support to shed 752,000 jobs by 2035. The tension worth carrying is on young workers: this reads the 20-24 unemployment gap as near a multi-decade low, where Canaries and the Revelio tracker both find early-career workers in exposed occupations well behind their peers. Different comparisons rather than contradictory findings, and holding both is the point.",
    date: "Sep 4",
    url: "https://www.economist.com/finance-and-economics/2026/09/04/the-jobs-apocalypse-is-postponed-an-ai-jobs-boom-is-here",
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
    author: "Abel, Deitz, Emanuel & Montalbano (NY Fed)",
    title: "Businesses Are Using AI to Transform Work, Not Cut Jobs",
    summary:
      "The third year of the NY Fed's AI module, and the first where a majority of firms on both sides of the survey say yes. Service-firm adoption went 25% to 40% to 61%; manufacturers went 16% to 26% to 51%. That is a steeper curve than any national series shows, and the reason to trust it is that the bar is higher, not lower — firms using AI only as a search tool are counted as non-users. The finding worth carrying is the gap the same survey opens between adoption and use. Three-quarters of service firms and more than 90% of manufacturers call their AI investment minimal to modest, and among firms that do use AI, the median one has just 17% of its workers on it in services and 7% in manufacturing. Very few sources measure firm adoption and within-firm worker uptake in the same instrument, and here they differ by roughly a factor of four. On labor, the channels roughly cancel: 4% of service adopters laid anyone off because of AI (from 1% last year), 15% hired fewer than they otherwise would have, 13% hired more, and just over a third retrained — retraining exceeds every displacement channel measured, which is where the title comes from. Two limits worth holding. This is New York State and northern New Jersey, a footprint tilted toward finance, information and professional services, so the 61% cannot be set against the national Census figure of roughly 22%. And every workforce number is a firm attributing its own hiring decision to AI, with no payroll check behind it.",
    date: "Sep 1",
    url: "https://libertystreeteconomics.newyorkfed.org/2026/09/businesses-are-using-ai-to-transform-work-not-cut-jobs/",
  },
  {
    author: "Chad Syverson (EIG)",
    title: "Understanding AI and Productivity",
    summary:
      "A co-author of the productivity J-curve paper returns to the question seven years on and refuses to close it. The value here is the discipline. Syverson reports that labor productivity ran about 1.5% a year through the 2010s and has run about 2.2% since mid-2022, then argues against himself: the acceleration started when AI investment was still small relative to the economy, and its timing matches the pandemic-era jump in labor market churn and business formation. His test is duration rather than magnitude, which is the right test — the longer the acceleration holds, the harder it gets to explain without AI. The original contribution is a cross-sector scatter of each sector's change in contribution to economy-wide productivity growth against its employment-weighted BTOS adoption rate. The correlation is positive and he tells you plainly it cannot be separated from chance; drop retail, a large accelerator with low adoption, and it more than doubles — a move he calls treading on thin statistical ice and declines to lean on. Anyone quoting the ex-retail number as evidence AI is raising productivity is quoting past the author. Two things worth carrying: why productivity growth does not mechanically destroy jobs (output is not fixed, lower costs cut prices, demand rises, slower-growth sectors absorb workers), and the calibration that past general-purpose technologies added 1 to 1.5 points to annual growth for a decade or two, so the 5-10% some boosters claim has no economy-wide precedent. On his own J-curve, he says only that it is too early to know where we are.",
    date: "Aug 28",
    url: "https://agglomerations.eig.org/p/understanding-ai-and-productivity",
  },
  {
    author: "Brynjolfsson, Chandar & Chen",
    title: "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of AI",
    summary:
      "The third vintage of the most-cited paper in the field, now with ADP payroll data through June 2026 — and it changes its own headline measure. Earlier versions led with a regression estimate adjusting for firm shocks (13%, then 16%). This one leads with the simpler descriptive number that needs no modeling choices: employment of 22-25 year olds in AI-exposed occupations stands 19% below where it would be had it kept pace with less-exposed peers, up from 15% on the same measure a year ago. Experienced workers show no comparable gap, and Fact 1 remains that there is no economy-wide displacement — the ADP sample grew about 6%. The most useful thing here is the authors arguing against themselves. Education is the one control that bites (the gap attenuates from -18pp to -9pp), and they present the two estimates as bracketing a range rather than picking the flattering one, because generative AI substitutes best for exactly the codified knowledge schooling produces. They also concede the magnitude is ADP-specific: the ACS gap is -2.2pp with a confidence interval spanning zero against -13.2pp in ADP, though the two agree closely within white-collar work. Adjustment runs through hiring, not separations or pay.",
    date: "Aug 12",
    url: "https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/",
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
