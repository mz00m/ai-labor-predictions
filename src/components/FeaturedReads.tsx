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
  {
    author: "Autor, Chin, Salomons, Seegmiller (NBER)",
    title: "What Makes New Work Different from More Work?",
    summary:
      "NBER WP 34986 (forthcoming Annual Review of Economics): 18% of US workers hold jobs introduced since 1970. New work commands a wage premium — 4× larger for tech-linked new work — reflecting scarcity of novel expertise. Advanced-degree workers are 2.9pp more likely to land new work. Labor share has fallen 10% since early 2000s, but new work is the core mechanism counteracting displacement.",
    date: "Apr 24",
    url: "https://mitstonecenter.substack.com/p/what-makes-new-work-different-from",
  },
  {
    author: "Luis Garicano (Silicon Continent)",
    title: "The task is not the job",
    summary:
      "A supply-side rebuttal to Amodei's claim that AI will eliminate half of entry-level white-collar jobs in 1-5 years. Labour markets price jobs, not tasks: when components of a bundle are expensive to separate from the rest, AI helps with parts while humans keep the work. Exhibit A: Frey/Osborne 2013 put 94% automation probability on accountants; a decade later BLS counts 1.6M of them at $81,680 median pay and projects +5% growth through 2034, while the 'weak bundle' of bookkeeping clerks falls 6%. Travel agent employment is 60% below its dot-com peak, yet surviving agents' weekly earnings rose from 87% to 99% of the private-sector average (2000-2025) because the machine took the weak part and left them the strong one. Also: organizations need residual decision rights — a human who can be sued, fired, and held accountable — that AI agents don't yet have.",
    date: "Apr 24",
    url: "https://www.siliconcontinent.com/p/why-desk-jobs-survive-and-amodei",
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
