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
    author: "Luis Garicano (Silicon Continent)",
    title: "The task is not the job",
    summary:
      "A supply-side rebuttal to Amodei's claim that AI will eliminate half of entry-level white-collar jobs in 1-5 years. Labour markets price jobs, not tasks: when components of a bundle are expensive to separate from the rest, AI helps with parts while humans keep the work. Exhibit A: Frey/Osborne 2013 put 94% automation probability on accountants; a decade later BLS counts 1.6M of them at $81,680 median pay and projects +5% growth through 2034, while the 'weak bundle' of bookkeeping clerks falls 6%. Travel agent employment is 60% below its dot-com peak, yet surviving agents' weekly earnings rose from 87% to 99% of the private-sector average (2000-2025) because the machine took the weak part and left them the strong one. Also: organizations need residual decision rights — a human who can be sued, fired, and held accountable — that AI agents don't yet have.",
    date: "Apr 24",
    url: "https://www.siliconcontinent.com/p/why-desk-jobs-survive-and-amodei",
  },
  {
    author: "Anthropic (Massenkoff, Huang)",
    title: "What 81,000 people told us about the economics of AI",
    summary:
      "Survey of 80,508 Claude.ai users connects qualitative worker sentiment to Anthropic's Economic Index usage data. One fifth voiced concern about AI-driven displacement, and worry tracks exposure: every 10pp of observed exposure adds 1.3pp of perceived threat, and top-quartile exposure workers mention it 3x as often as the bottom quartile. Early-career respondents are much more concerned than seniors, and only 60% of early-career users said they personally benefited from AI versus 80% of senior professionals. Mean productivity rating: 5.1/7 ('substantially more productive'); 48% cite scope (new tasks), 40% speed. Management (mostly entrepreneurs) and computer/math show the biggest gains; lawyers and scientists the mildest. Speedup and threat form a U-shape: the workers AI slowed and the workers it sped up most are both more anxious.",
    date: "Apr 22",
    url: "https://www.anthropic.com/research/81k-economics",
  },
  {
    author: "Shah & Levy (MIT/USC)",
    title: "Access to Justice in the Age of AI",
    summary:
      "Analysis of 4.5M+ federal civil cases and 46M PACER docket entries shows pro se (self-represented) filings broke a 20-year steady state of ~11% to hit 16.8% in FY2025, with case counts nearly doubling from a pre-AI avg of 23,210 to 41,490. The rise is concentrated in 'simple' NOS categories (civil rights, consumer credit, foreclosure) and absent in patent/securities. Pangram AI-text detection on 1,600 random complaints finds AI-generated text rising monotonically: 1.0% (2023) → 3.5% (2024) → 10.5% (2025) → 18.0% (early 2026), against a 0.1% pre-AI false-positive baseline. Case durations and disposition mix are unchanged, but docket entries per court from pro se cases are up 158% vs pre-AI — judges face more filings they can't refuse, from plaintiffs who a year ago couldn't afford to bring them.",
    date: "Mar",
    url: "https://avshah1.github.io/assets/pdf/papers/pro-se/Pro_Se_Automation.pdf",
  },
  {
    author: "Gad Levanon (Burning Glass)",
    title: "A Technology-Driven Productivity Regime Shift",
    summary:
      "US labor productivity growth jumped from 1.3%/yr (2013-2019) to 2.2%/yr (2019-2025) as hours growth collapsed from 1.9% to 0.7%. The gains are narrow: white-collar services, retail trade, and advanced manufacturing post 3.2-3.9% annualized productivity; the rest of the private economy sits at 0.1%. FIIPB's contribution to aggregate productivity doubled (0.78→1.50pp/yr); Information sector hours are down 6% from their 2022 peak while GDP +8.4%/yr. Early 2026 job growth is flat outside healthcare — the economy is learning to produce more with fewer workers, and the pressure lands first on entry-level white-collar roles.",
    date: "Apr 21",
    url: "https://www.linkedin.com/pulse/technology-driven-productivity-regime-shift-gad-levanon-mqyge/",
  },
  {
    author: "Economic Security Project",
    title: "Ideas for Shared Economic Prosperity in the AI Transition",
    summary:
      "Becky Chao's policy brief synthesizes the evidence base for AI-driven labor disruption — citing Brynjolfsson's 16% entry-level employment drop, Brookings' 6.1M displaced clerical workers, and Azar et al.'s 4.5% wage decline at AI-substitutable firms — and lays out a four-pillar agenda: modernize the social contract (UI uptake, public healthcare, income floor, four-day week), protect workers from algorithmic wage-setting and surveillance, deploy antimonopoly tools across the AI stack, and shift data-center energy costs back to the firms driving them rather than households.",
    date: "Apr 1",
    url: "https://economicsecurityproject.org/wp-content/uploads/Ideas-for-Shared-Economic-Prosperity-in-the-AI-Transition.pdf",
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
