import readingListData from "@/data/reading-list.json";
import RecentSources from "@/components/RecentSources";
import { getRecentSources } from "@/lib/sources";
import { getTierConfig, type TierConfig } from "@/lib/evidence-tiers";
import type { EvidenceTier } from "@/lib/types";

interface Article {
  title: string;
  author: string;
  publisher: string;
  date: string;
  url: string;
  takeaway: string;
  weekFeatured: string;
  tier: number;
}

const TIER_BG_COLORS: Record<number, string> = {
  1: "bg-indigo-100 text-indigo-800",
  2: "bg-teal-100 text-teal-800",
  3: "bg-amber-100 text-amber-800",
  4: "bg-gray-100 text-gray-700",
};

function getMonday(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

function groupByWeek(articles: Article[]): Map<string, Article[]> {
  const map = new Map<string, Article[]>();
  for (const a of articles) {
    const monday = getMonday(a.weekFeatured || a.date);
    if (!map.has(monday)) map.set(monday, []);
    map.get(monday)!.push(a);
  }
  return map;
}

function formatWeekLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `Week of ${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
}

export const metadata = {
  title: "Reading List | jobsdata.ai",
  description:
    "A rolling roster of must-read articles on AI and labor markets, curated weekly with key takeaways.",
};

export default function ReadingListPage() {
  const articles = readingListData.articles as Article[];
  const grouped = groupByWeek(articles);
  const weeks = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a));
  const recentSources = getRecentSources(20);

  return (
    <main className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Reading List
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-2xl leading-relaxed">
          A rolling roster of must-read articles on AI and labor markets.
          Curated weekly with key takeaways from each source. Ordered by
          recency, grouped by the week they were featured.
        </p>
      </header>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-10">
          {weeks.map((week) => {
            const weekArticles = grouped.get(week)!;
            return (
              <section key={week}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
                  {formatWeekLabel(week)}
                </h2>
                <div className="space-y-3">
                  {weekArticles.map((a) => (
                    <a
                      key={a.url}
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reading-card group block rounded-lg border border-black/[0.06] bg-black/[0.01] dark:bg-white/[0.02] px-5 py-4 hover:border-black/[0.12] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-2xs font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${TIER_BG_COLORS[a.tier] ?? TIER_BG_COLORS[4]}`}
                            >
                              {getTierConfig(a.tier as EvidenceTier).shortLabel}
                            </span>
                            <span className="text-xs text-[var(--muted)]">
                              {a.publisher}
                            </span>
                            <span className="text-xs text-[var(--muted)] opacity-50">
                              {new Date(a.date + "T00:00:00").toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </span>
                          </div>
                          <h3 className="text-md font-bold text-[var(--foreground)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                            {a.title}
                          </h3>
                          <p className="text-xs text-[var(--muted)] mt-0.5">
                            {a.author}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--foreground)] opacity-80 leading-relaxed mt-2">
                        {a.takeaway}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Sidebar: Recently Added Sources */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24 self-start">
          <RecentSources sources={recentSources} />
        </aside>
      </div>
    </main>
  );
}
