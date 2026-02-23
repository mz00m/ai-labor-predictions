"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { EvidenceTier } from "@/lib/types";
import { getTierConfig } from "@/lib/evidence-tiers";

interface LinkedPrediction {
  slug: string;
  title: string;
  relevanceScore: number;
}

interface ClassifiedPaper {
  id: string;
  title: string;
  abstract: string | null;
  authors: string[];
  publishedDate: string | null;
  year: number | null;
  venue: string | null;
  url: string;
  pdfUrl: string | null;
  citationCount: number;
  classifiedTier: EvidenceTier;
  source: string;
  relevanceScore: number;
  linkedPredictions: LinkedPrediction[];
}

interface ResearchFeedProps {
  selectedTiers: EvidenceTier[];
}

export default function ResearchFeed({ selectedTiers }: ResearchFeedProps) {
  const [papers, setPapers] = useState<ClassifiedPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const fetchPapers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tiersParam = selectedTiers.join(",");
      const res = await fetch(
        `/api/research?tiers=${tiersParam}&limit=30`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const sorted = (data.papers || []).sort(
        (a: ClassifiedPaper, b: ClassifiedPaper) => {
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
          return dateB - dateA;
        }
      );
      setPapers(sorted);
      setFetched(true);
    } catch {
      setError("Failed to load research feed. The APIs may be rate-limited.");
    } finally {
      setLoading(false);
    }
  }, [selectedTiers]);

  useEffect(() => {
    if (fetched) {
      fetchPapers();
    }
  }, [selectedTiers, fetched, fetchPapers]);

  if (!fetched) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight text-[var(--foreground)]">
            Recent Research
          </h2>
          <button
            onClick={fetchPapers}
            disabled={loading}
            className="px-5 py-2.5 text-[13px] font-semibold text-[var(--accent)] border border-[var(--accent)] rounded-full hover:bg-[var(--accent)] hover:text-white disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Searching..." : "Discover Papers"}
          </button>
        </div>
        <p className="text-[14px] text-[var(--muted)] leading-relaxed max-w-xl">
          Search Semantic Scholar, OpenAlex, and arXiv for recent AI + labor
          market research. Papers are automatically classified and linked to
          predictions.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight text-[var(--foreground)]">
          Recent Research
          <span className="text-[var(--muted)] font-normal text-[18px] ml-2">
            {papers.length}
          </span>
        </h2>
        <button
          onClick={fetchPapers}
          disabled={loading}
          className="text-[13px] font-semibold text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <p className="text-[13px] text-red-600 mb-4">{error}</p>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse h-20 rounded-lg bg-gray-100"
            />
          ))}
        </div>
      )}

      {!loading && papers.length === 0 && (
        <p className="text-[14px] text-[var(--muted)]">
          No papers found matching the selected tiers.
        </p>
      )}

      {!loading && papers.length > 0 && (
        <div className="max-h-[700px] overflow-y-auto">
          {papers.map((paper) => {
            const tierConfig = getTierConfig(paper.classifiedTier);
            return (
              <div
                key={paper.id}
                className="py-4 border-b border-black/[0.04]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1.5 inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tierConfig.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] font-semibold text-[var(--foreground)] hover:text-[var(--accent)] leading-tight"
                    >
                      {paper.title}
                    </a>

                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-[12px] text-[var(--muted)]">
                        {paper.authors.slice(0, 3).join(", ")}
                        {paper.authors.length > 3 ? ` +${paper.authors.length - 3}` : ""}
                      </span>
                      {paper.year && (
                        <span className="text-[12px] text-[var(--muted)] opacity-50">
                          {paper.year}
                        </span>
                      )}
                      {paper.citationCount > 0 && (
                        <span className="text-[12px] text-[var(--muted)] opacity-50">
                          {paper.citationCount} cites
                        </span>
                      )}
                      <span className="text-[11px] font-medium" style={{ color: tierConfig.color }}>
                        Tier {paper.classifiedTier}
                      </span>
                      <span className="text-[11px] text-[var(--muted)]">
                        {paper.source === "semantic_scholar"
                          ? "S2"
                          : paper.source === "openalex"
                            ? "OpenAlex"
                            : paper.source === "sec_edgar"
                              ? "SEC"
                              : paper.source === "job_postings"
                                ? "Jobs"
                                : "arXiv"}
                      </span>
                    </div>

                    {paper.abstract && (
                      <p className="text-[13px] text-[var(--muted)] mt-2 leading-relaxed line-clamp-2">
                        {paper.abstract}
                      </p>
                    )}

                    {paper.linkedPredictions.length > 0 && (
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                          Linked:
                        </span>
                        {paper.linkedPredictions.map((lp) => (
                          <Link
                            key={lp.slug}
                            href={`/predictions/${lp.slug}`}
                            className="text-[11px] font-medium text-[var(--accent)] hover:underline"
                          >
                            {lp.title.length > 35
                              ? lp.title.slice(0, 35) + "..."
                              : lp.title}
                          </Link>
                        ))}
                      </div>
                    )}

                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-[12px] font-medium text-[var(--accent)] hover:underline"
                      >
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
