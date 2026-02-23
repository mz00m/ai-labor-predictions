import { Source, EvidenceTier } from "@/lib/types";
import { getTierConfig } from "@/lib/evidence-tiers";
import { format, parseISO } from "date-fns";

interface SourceListProps {
  sources: Source[];
  selectedTiers: EvidenceTier[];
  highlightedSourceIds?: string[];
}

export default function SourceList({
  sources,
  selectedTiers,
  highlightedSourceIds = [],
}: SourceListProps) {
  const filtered = sources
    .filter((s) => selectedTiers.includes(s.evidenceTier))
    .sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());

  if (filtered.length === 0) {
    return (
      <p className="text-[14px] text-[var(--muted)]">
        No sources match the selected evidence tiers.
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)] mb-6">
        Sources ({filtered.length})
      </h3>
      <div className="space-y-0">
        {filtered.map((source) => {
          const config = getTierConfig(source.evidenceTier);
          const isHighlighted = highlightedSourceIds.includes(source.id);
          return (
            <div
              key={source.id}
              id={`source-${source.id}`}
              className="flex items-start gap-3 py-4 border-b border-black/[0.04] transition-all duration-700 rounded-lg"
              style={
                isHighlighted
                  ? {
                      backgroundColor: "rgba(124, 58, 237, 0.07)",
                      marginLeft: -16,
                      marginRight: -16,
                      paddingLeft: 16,
                      paddingRight: 16,
                      boxShadow: "0 0 0 1px rgba(124, 58, 237, 0.2)",
                    }
                  : undefined
              }
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
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[12px] text-[var(--muted)]">
                    {source.publisher}
                  </span>
                  <span className="text-[12px] text-[var(--muted)] opacity-50">
                    {format(parseISO(source.datePublished), "MMM d, yyyy")}
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: config.color }}>
                    {config.shortLabel}
                  </span>
                </div>
                {source.excerpt && (
                  <p className="text-[13px] text-[var(--muted)] mt-1.5 leading-relaxed">
                    {source.excerpt}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
