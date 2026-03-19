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
    author: "Sahaj Garg (Wispr)",
    title: "The Displacement of Cognitive Labor and What Comes After",
    summary:
      "Stanford grad turned AI startup CTO argues cognitive labor automation is months away, not decades. Physical labor follows on a 5-10 year timeline. The identity crisis for knowledge workers may be worse than the economic one.",
    date: "Mar 18",
    url: "https://sahajgarg.github.io/blog/cognitive-labor/",
    accent: "border-l-orange-500",
  },
  {
    author: "Anthropic",
    title: "81,000 People Told Us How They Use AI",
    summary:
      "Anthropic invited Claude users to share how they use AI, what they dream it could make possible, and what they fear it might do. Nearly 81,000 people responded in one week\u2014the largest qualitative study of its kind.",
    date: "Mar 18",
    url: "https://www.anthropic.com/features/81k-interviews",
    accent: "border-l-amber-500",
  },
  {
    author: "Alex Imas",
    title: "Can Advanced AI Lead to Negative Economic Growth?",
    summary:
      "Formal models show AGI-driven demand collapse is theoretically possible if labor share collapses. Negative growth unlikely but demand-side forces will moderate AGI growth expectations.",
    date: "Jan 7",
    url: "https://aleximas.substack.com/p/will-advanced-ai-lead-to-negative",
    accent: "border-l-violet-500",
  },
  {
    author: "Schaul, Ovide (WaPo)",
    title: "Which Jobs Are Most Threatened by AI, and Who May Adapt",
    summary:
      "Interactive tool mapping 350+ occupations by AI exposure and adaptability. 6.1M clerical workers most vulnerable; 86% women.",
    date: "Mar 16",
    url: "https://www.washingtonpost.com/technology/interactive/2026/jobs-most-affected-ai-automation/",
    accent: "border-l-rose-500",
  },
  {
    author: "Noah Smith (Noahpinion)",
    title: "The Future Isn\u2019t What It Used to Be",
    summary:
      "American optimism about the future has declined sharply as AI uncertainty, political chaos, and geopolitical risks make the future a blank wall of fog.",
    date: "Mar 15",
    url: "https://www.noahpinion.blog/p/the-future-isnt-what-it-used-to-be",
    accent: "border-l-emerald-500",
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
          <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wide truncate">
            {a.author}{a.date && <span className="opacity-50"> &middot; {a.date}</span>}
          </p>
          <h3 className="text-[12px] font-bold text-[var(--foreground)] leading-snug mt-0.5 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {a.title}
          </h3>
          <p className="text-[10px] text-[var(--muted)] leading-relaxed mt-0.5 line-clamp-2">
            {a.summary}
          </p>
        </a>
      ))}
    </div>
  );
}
