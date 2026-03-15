"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { EvidenceTier } from "@/lib/types";
import { TIER_CONFIGS } from "@/lib/evidence-tiers";
import { getSourceCountsByTier } from "@/lib/search-sources";
import EvidenceFilter from "@/components/EvidenceFilter";
import confirmedSources from "@/data/confirmed-sources.json";
import { getAllPredictions } from "@/lib/data-loader";

/* ------------------------------------------------------------------ */
/*  Types & data loading                                               */
/* ------------------------------------------------------------------ */

interface SourceEntry {
  id: string;
  title: string;
  url?: string;
  publisher: string;
  evidenceTier: EvidenceTier;
  datePublished: string;
  excerpt?: string;
  usedIn: string[];
}

const rawSources = confirmedSources as {
  sources: Record<string, SourceEntry & { _action?: string; verified?: boolean; synthetic?: boolean }>;
};

const allSources: SourceEntry[] = Object.values(rawSources.sources)
  .filter((s) => s._action !== "REMOVE")
  .map((s) => ({
    id: s.id,
    title: s.title,
    url: s.url,
    publisher: s.publisher,
    evidenceTier: s.evidenceTier as EvidenceTier,
    datePublished: s.datePublished,
    excerpt: s.excerpt ?? "",
    usedIn: s.usedIn ?? [],
  }))
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished));

const slugToTitle: Record<string, string> = {};
for (const p of getAllPredictions()) {
  slugToTitle[p.slug] = p.title;
}

const tierCounts = getSourceCountsByTier();

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  const [y, m] = iso.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function getMonthKey(iso: string): string {
  return iso.slice(0, 7); // "2026-03"
}

function formatMonthHeader(key: string): string {
  const [y, m] = key.split("-");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ResearchPage() {
  const [selectedTiers, setSelectedTiers] = useState<EvidenceTier[]>([1, 2, 3, 4]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let results = allSources.filter((s) =>
      selectedTiers.includes(s.evidenceTier)
    );

    if (query.trim()) {
      const tokens = query.trim().toLowerCase().split(/\s+/);
      results = results.filter((s) => {
        const haystack = [s.title, s.publisher, s.excerpt ?? ""]
          .join(" ")
          .toLowerCase();
        return tokens.every((t) => haystack.includes(t));
      });
    }

    return results;
  }, [selectedTiers, query]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, SourceEntry[]>();
    for (const s of filtered) {
      const key = getMonthKey(s.datePublished);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-0">
      {/* Header */}
      <header className="mb-8">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          Research Library
        </p>
        <h1 className="text-[36px] sm:text-[44px] font-black tracking-tight text-[var(--foreground)] leading-[1.08] mb-3">
          All Sources
        </h1>
        <p className="text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
          {allSources.length} verified sources powering every prediction on this
          site. Search by keyword, filter by evidence tier, or browse by date.
        </p>
      </header>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--muted)]"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sources by title, publisher, or keyword..."
          className="w-full pl-11 pr-4 py-3 text-[14px] rounded-lg border border-black/[0.08] bg-white text-[var(--foreground)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/40 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        )}
      </div>

      {/* Evidence filter */}
      <EvidenceFilter
        selectedTiers={selectedTiers}
        onChange={setSelectedTiers}
        tierCounts={tierCounts}
      />

      {/* Results count */}
      <div className="mt-6 mb-4 flex items-center justify-between">
        <p className="text-[13px] text-[var(--muted)]">
          {filtered.length === allSources.length
            ? `${filtered.length} sources`
            : `${filtered.length} of ${allSources.length} sources`}
          {query && (
            <span>
              {" "}matching &ldquo;{query}&rdquo;
            </span>
          )}
        </p>
        <div className="flex gap-3">
          {TIER_CONFIGS.map((config) => {
            const count = filtered.filter(
              (s) => s.evidenceTier === config.tier
            ).length;
            if (!count) return null;
            return (
              <span
                key={config.tier}
                className="flex items-center gap-1 text-[11px] text-[var(--muted)]"
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Source list grouped by month */}
      {grouped.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[15px] text-[var(--muted)]">
            No sources match your filters.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setSelectedTiers([1, 2, 3, 4]);
            }}
            className="mt-3 text-[13px] font-semibold text-[var(--accent)] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          {grouped.map(([monthKey, sources]) => (
            <div key={monthKey}>
              {/* Month header */}
              <div className="sticky top-[49px] z-30 bg-white/95 backdrop-blur-sm border-b border-black/[0.04] -mx-6 sm:-mx-10 px-6 sm:px-10 py-2 mt-6 first:mt-0">
                <h2 className="text-[13px] font-bold text-[var(--foreground)]">
                  {formatMonthHeader(monthKey)}
                  <span className="ml-2 text-[11px] font-normal text-[var(--muted)]">
                    {sources.length} source{sources.length !== 1 ? "s" : ""}
                  </span>
                </h2>
              </div>

              {/* Sources in this month */}
              <div className="divide-y divide-black/[0.04]">
                {sources.map((source) => (
                  <SourceRow key={source.id} source={source} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Source row                                                          */
/* ------------------------------------------------------------------ */

function SourceRow({ source }: { source: SourceEntry }) {
  const tierConfig = TIER_CONFIGS[source.evidenceTier - 1];

  return (
    <div className="py-3.5 group">
      <div className="flex items-start gap-3">
        {/* Tier dot */}
        <span
          className="inline-block w-2 h-2 rounded-full mt-1.5 shrink-0"
          style={{ backgroundColor: tierConfig.color }}
          title={tierConfig.label}
        />

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-2">
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors leading-snug"
              >
                {source.title}
              </a>
            ) : (
              <span className="text-[14px] font-semibold text-[var(--foreground)] leading-snug">
                {source.title}
              </span>
            )}
          </div>

          {/* Meta line */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[12px] text-[var(--muted)]">
              {source.publisher}
            </span>
            <span className="text-black/[0.15]">&middot;</span>
            <span className="text-[12px] text-[var(--muted)]">
              {formatDate(source.datePublished)}
            </span>
            <span className="text-black/[0.15]">&middot;</span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                color: tierConfig.color,
                backgroundColor: `${tierConfig.color}15`,
              }}
            >
              Tier {source.evidenceTier}
            </span>
          </div>

          {/* Excerpt */}
          {source.excerpt && (
            <p className="text-[12px] text-[var(--muted)] leading-relaxed mt-1.5 line-clamp-2">
              {source.excerpt}
            </p>
          )}

          {/* Used in predictions */}
          {source.usedIn.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {source.usedIn.slice(0, 4).map((slug) => (
                <Link
                  key={slug}
                  href={`/predictions/${slug}`}
                  className="text-[10px] font-medium text-[var(--muted)] bg-black/[0.03] hover:bg-black/[0.06] px-2 py-0.5 rounded transition-colors no-underline"
                >
                  {slugToTitle[slug] ?? slug}
                </Link>
              ))}
              {source.usedIn.length > 4 && (
                <span className="text-[10px] text-[var(--muted)] px-1 py-0.5">
                  +{source.usedIn.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* External link icon */}
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 mt-1 text-[var(--muted)] opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
            aria-label={`Open ${source.title}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 1.5h2.5V4" />
              <path d="M6.5 7.5L12.5 1.5" />
              <path d="M11 8v4.5a1 1 0 01-1 1H2a1 1 0 01-1-1V4.5a1 1 0 011-1H6" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
