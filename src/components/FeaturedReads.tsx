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
    author: "Chad Syverson (EIG)",
    title: "Understanding AI and Productivity",
    summary:
      "A co-author of the productivity J-curve paper returns to the question seven years on and refuses to close it. The value here is the discipline. Syverson reports that labor productivity ran about 1.5% a year through the 2010s and has run about 2.2% since mid-2022, then argues against himself: the acceleration started when AI investment was still small relative to the economy, and its timing matches the pandemic-era jump in labor market churn and business formation. His test is duration rather than magnitude, which is the right test — the longer the acceleration holds, the harder it gets to explain without AI. The original contribution is a cross-sector scatter of each sector's change in contribution to economy-wide productivity growth against its employment-weighted BTOS adoption rate. The correlation is positive and he tells you plainly it cannot be separated from chance; drop retail, a large accelerator with low adoption, and it more than doubles — a move he calls treading on thin statistical ice and declines to lean on. Anyone quoting the ex-retail number as evidence AI is raising productivity is quoting past the author. Two things worth carrying: why productivity growth does not mechanically destroy jobs (output is not fixed, lower costs cut prices, demand rises, slower-growth sectors absorb workers), and the calibration that past general-purpose technologies added 1 to 1.5 points to annual growth for a decade or two, so the 5-10% some boosters claim has no economy-wide precedent. On his own J-curve, he says only that it is too early to know where we are.",
    date: "Aug 28",
    url: "https://agglomerations.eig.org/p/understanding-ai-and-productivity",
  },
  {
    author: "Bill Gates",
    title: "A Turbulent AI Era and Critical Choices to Make",
    summary:
      "Gates's first long AI essay in three years, and the first where labor displacement is the lead risk rather than a footnote. The substantive move is his refusal of the two analogies that normally do the reassuring work. Agriculture-to-office took several generations and created jobs that still needed human cognition; this technology substitutes for cognition. The PC took twenty years because software had to be written, prices had to fall, and people had to learn it; AI runs on the hardware we already own and speaks natural language, so it adapts to us rather than the reverse. From there he is specific about incidence: the jobs most at risk are entry- and mid-level, the new ones will require skills that take years to acquire, and smart robots start competing for construction and hospitality work by the end of the decade. Two proposals are worth tracking. Human Reserved is a domain of work set aside for people by decision rather than by capability limit, and he is honest that he cannot answer who decides, on what criteria, or how you stop firms from cheating. The token-and-robot tax rests on an asymmetry that is easy to verify and hard to defend: hire a person and you pay payroll tax, buy a robot and you expense it immediately. No original data here, and every number is borrowed. Read it as the clearest signal yet of where the philanthropic and policy conversation is heading.",
    date: "Aug 25",
    url: "https://www.gatesnotes.com/a-turbulent-ai-era-and-critical-choices-to-make",
  },
  {
    author: "Brynjolfsson, Chandar & Chen",
    title: "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of AI",
    summary:
      "The third vintage of the most-cited paper in the field, now with ADP payroll data through June 2026 — and it changes its own headline measure. Earlier versions led with a regression estimate adjusting for firm shocks (13%, then 16%). This one leads with the simpler descriptive number that needs no modeling choices: employment of 22-25 year olds in AI-exposed occupations stands 19% below where it would be had it kept pace with less-exposed peers, up from 15% on the same measure a year ago. Experienced workers show no comparable gap, and Fact 1 remains that there is no economy-wide displacement — the ADP sample grew about 6%. The most useful thing here is the authors arguing against themselves. Education is the one control that bites (the gap attenuates from -18pp to -9pp), and they present the two estimates as bracketing a range rather than picking the flattering one, because generative AI substitutes best for exactly the codified knowledge schooling produces. They also concede the magnitude is ADP-specific: the ACS gap is -2.2pp with a confidence interval spanning zero against -13.2pp in ADP, though the two agree closely within white-collar work. Adjustment runs through hiring, not separations or pay.",
    date: "Aug 12",
    url: "https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/",
  },
  {
    author: "Kartik B. Athreya (NY Fed)",
    title: "AI's Impact on Labor and Hiring",
    summary:
      "The NY Fed's research director opens a new commentary series by reading his own bank's AI work as one argument: the labor-market story so far is changing skill requirements, not disappearing jobs. Second District adoption is climbing fast — service firms from 25% using AI in 2024 to 40% in 2025, manufacturers 16% to 26%, with 44% and 33% expected within six months — while firms report very few AI-driven layoffs and overwhelmingly intend to retrain rather than fire. The caveat he does flag: firms anticipate deeper cuts to hiring plans ahead, especially for college-educated workers. Regional and self-reported, so not comparable to the national BTOS series, but it is the clearest statement yet of how a Fed research shop reads its own evidence.",
    date: "Aug 5",
    url: "https://libertystreeteconomics.newyorkfed.org/2026/08/ais-impact-on-labor-and-hiring/",
  },
  {
    author: "Revelio Labs",
    title: "Introducing the Revelio AI Labor Market Tracker",
    summary:
      "Simon, Zweig and Wilkie-Rogers launch a live monthly dashboard across five lenses — talent supply, labor demand, equilibrium, work content, matching — built on online professional profiles rather than payroll. The headline finding independently replicates Canaries on non-ADP data: early-career workers (22-25) in the most AI-exposed occupations are down 13% relative to the least exposed since pre-ChatGPT, versus about 4% for all ages. Demand for the most-exposed roles is down 42%. The firm-side picture cuts the other way: AI-adopting firms grow headcount 27% more than non-adopters (though they were already growing faster pre-adoption), gains concentrate in senior roles (+31% vs +6% junior), and more AI-exposed firms see fewer layoffs, not more. Deliberately descriptive rather than predictive: the authors state the evidence does not establish that AI caused the decline in hires per posting. Two series no one else publishes monthly — a within-occupation activity-mix dissimilarity index (+8.4pp yoy, most change inside occupations rather than between them) and matching efficiency at 5.05 postings per hire, +264% yoy.",
    date: "Jul 28",
    url: "https://www.reveliolabs.com/news/ai-and-work/introduction-the-revelio-ai-labor-market-tracker",
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
