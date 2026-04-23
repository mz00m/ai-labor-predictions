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
    author: "U.S. Census Bureau (Bonney et al.)",
    title: "The Microstructure of AI Diffusion",
    summary:
      "Second BTOS AI supplement (Nov 2025-Jan 2026): 18% of firms used AI in a business function, 32% employment-weighted, rising to 60-70% for very large firms in Information, Professional Services, and Finance. Adoption is broad but shallow — 57% of users deploy AI in ≤3 functions; 65% limit worker use to ≤3 tasks. 66% of task effects are augmentation-only; AI-driven headcount decreases occur in just 2% of firms. Functional breadth and operational investment correlate with employment declines; worker-task use does not — evidence of separate top-down (substitution) and bottom-up (augmentation) diffusion channels.",
    date: "Apr 1",
    url: "https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html",
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
  {
    author: "OpenAI Economic Research",
    title: "The AI Jobs Transition Framework",
    summary:
      "Richmond (OpenAI) sorts all 921 occupations (147.9M jobs) into four archetypes: 18% at high automation risk, 24% will reorganize, 12% grow with AI, 46% less immediate change. ChatGPT used ~3x more in the most at-risk jobs, yet capability overhang is huge (90% theoretical vs 23.8% realized exposure in high-risk jobs). Since 2024Q1, unemployment rose MORE in less-exposed jobs (+0.6pp) than in high-risk ones (+0.3pp) — exposure alone is a weak predictor of near-term pressure.",
    date: "Apr 17",
    url: "https://cdn.openai.com/pdf/the-ai-jobs-transition-framework_report.pdf",
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
