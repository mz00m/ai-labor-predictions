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
  {
    author: "WSJ",
    title: "The Economy Is Growing, Jobs Aren't. Why That Might Be OK.",
    summary:
      "Wall Street Journal examines the decoupling of GDP growth from job creation as AI-driven productivity gains absorb output expansion without hiring. Frames the 'jobless growth' pattern as potentially benign if productivity flows through to wages and new work.",
    date: "Apr 14",
    url: "https://www.wsj.com/economy/jobs/the-economy-is-growing-jobs-arent-why-that-might-be-ok-5c50a535",
    accent: "border-l-emerald-500",
  },
  {
    author: "Stanford HAI",
    title: "The 2026 AI Index Report",
    summary:
      "AI workforce disruption moves from prediction to reality. Software devs aged 22-25 employment -20% since 2024. GenAI hit 53% population adoption in 3yrs (US 28.3%). Physicians report 83% less time on clinical notes. Transparency scores dropped to 40 from 58.",
    date: "Apr 13",
    url: "https://hai.stanford.edu/news/inside-the-ai-index-12-takeaways-from-the-2026-report",
    accent: "border-l-cyan-500",
  },
  {
    author: "OpenAI",
    title: "Industrial Policy for the Intelligence Age: Ideas to Keep People First",
    summary:
      "OpenAI's policy blueprint for superintelligence transition. Proposes public wealth fund, 32-hour workweek pilots, portable benefits, adaptive safety nets. Warns productivity gains may not reach workers without deliberate policy.",
    date: "Apr 1",
    url: "https://cdn.openai.com/pdf/561e7512-253e-424b-9734-ef4098440601/Industrial%20Policy%20for%20the%20Intelligence%20Age.pdf",
    accent: "border-l-amber-500",
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
