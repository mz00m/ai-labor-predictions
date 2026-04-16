"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Occupation {
  slug: string;
  title: string;
  category: string;
  exposure: number;
}

interface ScorecardSearchProps {
  occupations: Occupation[];
}

function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ScorecardSearch({
  occupations,
}: ScorecardSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return occupations
      .filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, occupations]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const items = listRef.current.querySelectorAll("[data-result]");
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, isOpen]);

  function navigate(slug: string) {
    router.push(`/scorecard/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      navigate(results[selectedIndex].slug);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors no-underline"
          >
            jobsdata.ai
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            What&apos;s your AI score?
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            See how AI affects your role, which tools to use, and 3 actions to
            level up. Free and instant for 342 occupations.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder="Search occupations... (e.g., Software Developer, Nurse)"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C61F6] focus:border-transparent shadow-sm"
              autoComplete="off"
            />
          </div>

          {/* Results dropdown */}
          {isOpen && results.length > 0 && (
            <div
              ref={listRef}
              className="absolute z-10 w-full mt-2 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden max-h-96 overflow-y-auto"
            >
              {results.map((occ, i) => (
                <button
                  key={occ.slug}
                  data-result
                  onClick={() => navigate(occ.slug)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                    i === selectedIndex ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {occ.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatCategory(occ.category)}
                    </div>
                  </div>
                  <div className="shrink-0 ml-4 flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 tabular-nums">
                      {occ.exposure}
                    </span>
                    <span className="text-xs text-gray-400">/10</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {isOpen && query.trim() && results.length === 0 && (
            <div className="absolute z-10 w-full mt-2 rounded-xl border border-gray-200 bg-white shadow-lg p-6 text-center">
              <p className="text-gray-500 text-sm">
                No occupations match &ldquo;{query}&rdquo;
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Try a broader term like &ldquo;nurse&rdquo; or
                &ldquo;accountant&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Popular occupations */}
        <div className="mt-12">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">
            Popular searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "software-developers",
              "accountants-and-auditors",
              "registered-nurses",
              "lawyers",
              "graphic-designers",
              "financial-analysts",
              "elementary-school-teachers-except-special-education",
              "customer-service-representatives",
            ].map((slug) => {
              const occ = occupations.find((o) => o.slug === slug);
              if (!occ) return null;
              return (
                <a
                  key={slug}
                  href={`/scorecard/${slug}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:border-[#5C61F6] hover:text-[#5C61F6] transition-colors no-underline"
                >
                  <span>{occ.title}</span>
                  <span className="text-xs font-bold text-gray-400 tabular-nums">
                    {occ.exposure}/10
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-xs text-gray-400">
            Scores derived from O*NET task data across 342 BLS occupations.
            Higher scores mean more AI opportunity.{" "}
            <a
              href="/about"
              className="text-[#5C61F6] hover:underline no-underline"
            >
              Methodology
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
