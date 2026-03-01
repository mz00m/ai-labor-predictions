import { getTierConfig } from "@/lib/evidence-tiers";
import { getRecentSources } from "@/lib/sources";
import { format, parseISO } from "date-fns";

export default function RecentSources() {
  const sources = getRecentSources(20);

  return (
    <div>
      <h3 className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)] mb-4">
        Recently Added
      </h3>

      <div className="space-y-0">
        {sources.map((source) => {
          const config = getTierConfig(source.evidenceTier);
          return (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 py-2 border-b border-black/[0.03] hover:bg-black/[0.02] transition-colors -mx-2 px-2 rounded"
            >
              <span
                className="mt-[5px] inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-[var(--foreground)] leading-snug truncate">
                  {source.title}
                </p>
                <p className="text-[11px] text-[var(--muted)] opacity-60 mt-0.5">
                  {format(parseISO(source.datePublished), "MMM d, yyyy")}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
