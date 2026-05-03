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
    author: "Ezra Klein (NYT)",
    title: "Why the A.I. Job Apocalypse (Probably) Won't Happen",
    summary:
      "Klein's macro-vs-anecdata case: unemployment 4.3% in Mar 2026 vs 4.4% in Mar 2020, hourly earnings stable, software engineer demand booming despite Claude Code. Drawing on Imas's 'what becomes scarce' framework, predicts labor shifts to the relational sector — Nespresso didn't kill baristas; coffee shops kept multiplying. Cites VisiCalc (1979) which quadrupled accountant employment over 40 years rather than displacing them. The harder scenario isn't 80M displaced but 8M: the U.S. responds poorly to localized shocks (cf. China shock's ~2M jobs), so partial AI displacement may go untreated.",
    date: "May 3",
    url: "https://www.nytimes.com/2026/05/03/opinion/ai-jobs-unemployment-silicon-valley.html",
  },
  {
    author: "Jasmine Sun (NYT Opinion)",
    title: "The A.I. Fear Keeping Silicon Valley Up at Night",
    summary:
      "Reported from inside the SF AI bubble: the 'San Francisco consensus' is that the median worker is screwed and labs differ mostly on what to do about it. OpenAI's GDPVal benchmark went from sub-human to 80%+ win rate vs human pros in months; Block CEO Jack Dorsey cut ~half his staff in March citing coding agents; Anthropic enterprise-agent revenue jumped from $9B to $30B annualized. OpenAI's new white paper floats a 32-hour week and a public wealth fund; Shor polling finds 72% of voters fear AI drives down wages.",
    date: "Apr 30",
    url: "https://www.nytimes.com/2026/04/30/opinion/ai-labor-work-force-silicon-valley.html",
  },
  {
    author: "Daniel Björkegren (Brown)",
    title: "The intelligence is plenty but the workers are few",
    summary:
      "LMICs employ <10% of workers in skilled knowledge work vs. 41% in high-income countries — so there's little to graft AI onto. Rich-country adoption runs through existing knowledge workers; LMICs lack that base. But cheap intelligence could also leapfrog: small manufacturers could access capabilities previously requiring large teams, and LMICs face less political resistance to AI adoption. A crucial question for development economics: does AI augment scarce knowledge workers, or does it automate knowledge work entirely?",
    date: "Apr 28",
    url: "https://dan.bjorkegren.com/blog/2026/04/the-intelligence-is-plenty-but-the-workers-are-few/",
  },
  {
    author: "Pethokoukis × Rock (Faster, Please!)",
    title: "The future of work in an age of AI",
    summary:
      "AEI's James Pethokoukis interviews Wharton's Daniel Rock (author of the Productivity J-Curve paper) on AI and work. Key framing: exposure vs. automation are not the same thing. Rock covers why firms see slow early productivity gains as they reorganize workflows, the bottlenecks limiting adoption, and why a more measured growth outlook is warranted — pushing back on Silicon Valley claims that white-collar work is imminently doomed.",
    date: "Apr 28",
    url: "https://fasterplease.substack.com/p/the-future-of-work-in-an-age-of-ai",
  },
  {
    author: "Elizabeth Gibney (Nature)",
    title: "AI doom warnings are getting louder. Are they realistic?",
    summary:
      "Nature surveys the existential-risk debate: only 3% of ~4,000 AI researchers name extinction as their top worry, yet 53% give it ≥10% probability — up from 47% in 2023. Dario Amodei puts P(doom) at 25%. Critics including Gary Marcus and Casey Mock argue doom narratives distract from documented current harms and hand firms a regulatory shield. Maps a genuine split between near-term misuse concerns and longer-horizon misalignment fears.",
    date: "2026",
    url: "https://www.nature.com/articles/d41586-026-01257-6",
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
