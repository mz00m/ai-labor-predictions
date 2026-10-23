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
    author: "Shukla & Imas (Ghosts of Electricity)",
    title: "Technological Progress and the Meaning of Work",
    summary:
      "A history, not a forecast: 250 years of reactions to technology, from the spinning jenny and the Luddites to switchboard operators, AlphaGo and the 2023 writers' strike. The recurring fear was never only lost wages but the loss of an identity built on hard-won expertise. It ends with mathematicians: 28 Fields medallists warning of a 'severe misalignment' after AI solved famous open problems. Displacement of meaning can arrive before displacement of jobs.",
    date: "Oct 22",
    url: "https://aleximas.substack.com/p/technological-progress-and-the-meaning",
  },
  {
    author: "Ben Casselman (New York Times)",
    title: "For Clues About How A.I. Will Change Work, Look to the Past",
    summary:
      "Why some technological upheavals went tolerably for workers and others badly. The historians' answer is conditions: a strong economy absorbed displaced phone operators before 1929 but not in the Depression, overnight switchovers scarred careers while the slow fade of horse teamsters let young workers move on, and English boot-making kept its headcount while the work itself changed completely. The warning: AI is reaching white-collar and back-office work that once looked safe.",
    date: "Oct 22",
    url: "https://www.nytimes.com/2026/10/22/business/economy/ai-economy-jobs-history.html",
  },
  {
    author: "Guy Berger (MacroMostly)",
    title: "Thoughts on AI's Impact on the Labor Market, as of October 2026",
    summary:
      "A labor economist's two-minute ledger that keeps two claims apart: AI probably won't cause persistent mass unemployment, but it will cause significant gross disruption, with falling wages and costly transitions for the workers hit. So far the average impact is very small; software has changed most, yet developers' share of US jobs rose this year. Don't read broad industry counts as an AI barometer, and distrust confident forecasts of rapid change.",
    date: "Oct 19",
    url: "https://macromostly.substack.com/p/thoughts-on-ais-impact-on-the-labor",
  },
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
