import Link from "next/link";
import { getTierConfig } from "@/lib/evidence-tiers";
import { getRecentSources } from "@/lib/sources";
import { format, parseISO } from "date-fns";

export default function RecentSources() {
  const sources = getRecentSources(20);

  return (
    <div>
      <h3 className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
        Recent Sources
      </h3>
      <p className="text-[12px] text-[var(--muted)] mb-6">
        The 20 most recently added across all predictions
      </p>

      <div className="space-y-0">
        {sources.map((source) => {
          const config = getTierConfig(source.evidenceTier);
          return (
            <div
              key={source.id}
              className="flex items-start gap-3 py-4 border-b border-black/[0.04]"
            >
              <span
                className="mt-1.5 inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <div className="min-w-0 flex-1">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-semibold text-[var(--foreground)] hover:text-[var(--accent)] leading-tight"
                >
                  {source.title}
                </a>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                  <span className="text-[12px] text-[var(--muted)]">
                    {source.publisher}
                  </span>
                  <span className="text-[12px] text-[var(--muted)] opacity-50">
                    {format(parseISO(source.datePublished), "MMM d, yyyy")}
                  </span>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: config.color }}
                  >
                    {config.shortLabel}
                  </span>
                </div>
                {source.excerpt && (
                  <p className="text-[13px] text-[var(--muted)] mt-1.5 leading-relaxed line-clamp-2">
                    {source.excerpt}
                  </p>
                )}
                <Link
                  href={`/predictions/${source.predictionSlug}`}
                  className="inline-block mt-2 text-[11px] font-medium text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
                >
                  {source.predictionTitle}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
