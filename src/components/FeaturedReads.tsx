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
  {
    author: "OpenAI Economic Research",
    title: "Work at the Frontier: How AI is Expanding What People Do at Work",
    summary:
      "Chin and Richmond classify 800,000+ work-related ChatGPT messages from US users to a single O*NET detailed work activity, then compare it with the sender's stated occupation. The result they call task crossover: 16.8% of all work messages — and 43.5% of occupation-specific ones — concern tasks historically associated with another job. Cross-occupation work is the majority of occupation-specific messages in five of eight groups (customer experience 77%, design 75%, HR 69%). Borrowing and lending are independent: designers draw 35.2% of their messages from other fields while design tasks are only 1.7% of everyone else's; engineering is the inverse. Descriptive, not an employment estimate — but it argues the task bundles themselves are moving, which is a problem for any exposure measure built on fixed job descriptions.",
    date: "Jul 27",
    url: "https://openai.com/index/work-at-the-frontier/",
  },
  {
    author: "FRED (St. Louis Fed)",
    title: "FRED Adds Data About the Adoption of Generative Artificial Intelligence",
    summary:
      "The Bick-Blandin-Deming Real-Time Population Survey — the field's cleanest quarterly measure of US worker GenAI adoption — is now official FRED data: 137 series covering usage rates (overall, work, nonwork), time savings, and adoption compared with the PC and internet, with industry and occupation breakdowns. Latest readings: 43.4% of employed adults used GenAI for work and 57.9% of working-age adults used it anywhere in Q1 2026; GenAI-assisted work hours reached 6.3% in Q2 2026, up from 4.1% in late 2024. FRED hosting makes the series every major adoption synthesis relies on citable and API-accessible alongside official government statistics.",
    date: "Jul 24",
    url: "https://news.research.stlouisfed.org/2026/07/fred-adds-data-about-the-adoption-of-generative-artificial-intelligence/",
  },
  {
    author: "Google / Google DeepMind",
    title: "AI & Economy ATLAS v1.0: Mapping Gemini Usage in the Economy",
    summary:
      "Google's entry into the usage-data triad (alongside Anthropic's Economic Index and OpenAI's Jobs Transition Framework) — 15M de-identified Gemini interactions mapped to 800+ occupations, 4,000 O*NET tasks, 300 household activities, 150 countries, and 140 languages. Headline: diffusion is broad but shallow. Usage spans occupations covering 88% of US employment, yet the median occupation applies AI to only 21% of its tasks, and end-to-end automation is under 10% of non-routine cognitive use. Uniquely adds household lenses: 86% of conversational AI happens outside work, government/civic queries over-index ~20x, and household time savings may be worth $15-149B/yr — invisible to GDP. Reviewed by Coyle and Autor; Imas co-authored.",
    date: "Jul 23",
    url: "https://deepmind.google/research/publications/ai-economy-atlas",
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
