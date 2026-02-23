import { Source, EvidenceTier } from "@/lib/types";
import { getTierConfig } from "@/lib/evidence-tiers";
import { format, parseISO } from "date-fns";

interface SourceListProps {
  sources: Source[];
  selectedTiers: EvidenceTier[];
}

export default function SourceList({
  sources,
  selectedTiers,
}: SourceListProps) {
  const filtered = sources
    .filter((s) => selectedTiers.includes(s.evidenceTier))
    .sort((a, b) => a.evidenceTier - b.evidenceTier || a.title.localeCompare(b.title));

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
