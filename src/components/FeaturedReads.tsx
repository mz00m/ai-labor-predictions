interface Article {
  author: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  accent: string;
  internal?: boolean;
}

const articles: Article[] = [
  {
    author: "Economic Security Project",
    title: "Ideas for Shared Economic Prosperity in the AI Transition",
    summary:
      "Becky Chao's policy brief synthesizes the evidence base for AI-driven labor disruption — citing Brynjolfsson's 16% entry-level employment drop, Brookings' 6.1M displaced clerical workers, and Azar et al.'s 4.5% wage decline at AI-substitutable firms — and lays out a four-pillar agenda: modernize the social contract (UI uptake, public healthcare, income floor, four-day week), protect workers from algorithmic wage-setting and surveillance, deploy antimonopoly tools across the AI stack, and shift data-center energy costs back to the firms driving them rather than households.",
    date: "Apr 1",
    url: "https://economicsecurityproject.org/wp-content/uploads/Ideas-for-Shared-Economic-Prosperity-in-the-AI-Transition.pdf",
    accent: "border-l-rose-500",
  },
  {
    author: "OpenAI Economic Research",
    title: "The AI Jobs Transition Framework",
    summary:
      "Richmond (OpenAI) sorts all 921 occupations (147.9M jobs) into four archetypes: 18% at high automation risk, 24% will reorganize, 12% grow with AI, 46% less immediate change. ChatGPT used ~3x more in the most at-risk jobs, yet capability overhang is huge (90% theoretical vs 23.8% realized exposure in high-risk jobs). Since 2024Q1, unemployment rose MORE in less-exposed jobs (+0.6pp) than in high-risk ones (+0.3pp) — exposure alone is a weak predictor of near-term pressure.",
    date: "Apr 17",
    url: "https://cdn.openai.com/pdf/the-ai-jobs-transition-framework_report.pdf",
    accent: "border-l-amber-500",
  },
  {
    author: "Yale Budget Lab",
    title: "Tracking the Impact of AI on the Labor Market",
    summary:
      "April 2026 monthly update: March CPS + Anthropic Feb usage data show no substantial change. Occupational/industry dissimilarity and exposure/usage metrics remain flat or within historical ranges. Exposure, automation, and augmentation measures show no relationship with employment or unemployment changes. Anthropic usage data continues to skew automation over augmentation.",
    date: "Apr 16",
    url: "https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market",
    accent: "border-l-indigo-500",
  },
  {
    author: "NY Fed (Liberty Street)",
    title: "Use of Gen AI in the Workplace and the Value of Access to Training",
    summary:
      "November 2025 SCE: 39% of US workers used AI at work in the past year, but adoption is highly unequal — 58.7% of college grads vs 22.9% non-college; 15.9% (<$50K) vs 66.3% (>$200K). Only 15.9% of employers offer AI training though 38% of workers want it. 62% expect AI to raise unemployment over the next year.",
    date: "Apr 14",
    url: "https://libertystreeteconomics.newyorkfed.org/2026/04/use-of-gen-ai-in-the-workplace-and-the-value-of-access-to-training/",
    accent: "border-l-sky-500",
  },
  {
    author: "Alex Imas",
    title: "What will be scarce? The post-commodity future of work",
    summary:
      "Chicago Booth economist argues AI triggers a 'post-commodity' economy: as automation cheapens goods, spending shifts to the relational sector (care, craft, hospitality) where human provenance is the value. Starbucks rolls back automation; human art commands 44% exclusivity premium vs 21% for AI art.",
    date: "Apr 14",
    url: "https://aleximas.substack.com/p/what-will-be-scarce",
    accent: "border-l-fuchsia-500",
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
          className={`group border-l-2 ${a.accent} rounded-r-md bg-black/[0.02] dark:bg-white/[0.03] px-2.5 py-2 transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}
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
