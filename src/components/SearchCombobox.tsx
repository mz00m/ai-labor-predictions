"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { searchSources, getPredictionTitle } from "@/lib/search-sources";
import { getTierConfig } from "@/lib/evidence-tiers";
import type { SearchResult } from "@/lib/search-sources";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface SearchComboboxProps {
  /** Render full-width for mobile dropdown */
  mobile?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SearchCombobox({ mobile }: SearchComboboxProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  /* ---- Reset on route change ---- */
  useEffect(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
  }, [pathname]);

  /* ---- Click outside ---- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  /* ---- Search with debounce ---- */
  const handleChange = useCallback((value: string) => {
    setQuery(value);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const hits = searchSources(value);
      setResults(hits);
      setIsOpen(value.trim().length > 0);
    }, 150);
  }, []);

  /* ---- Navigate to a result ---- */
  const navigateTo = useCallback(
    (result: SearchResult) => {
      if (result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
      } else {
        const slug = result.usedIn[0];
        if (slug) {
          router.push(`/predictions/${slug}`);
        }
      }
      setIsOpen(false);
      setQuery("");
      setResults([]);
      inputRef.current?.blur();
    },
    [router]
  );

  /* ---- Keyboard navigation ---- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setResults([]);
        inputRef.current?.blur();
        return;
      }

      if (!isOpen || results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        navigateTo(results[activeIndex]);
      }
    },
    [isOpen, results, activeIndex, navigateTo]
  );

  /* ---- Format date for display ---- */
  const fmtDate = (iso: string) => {
    try {
      const [y, m] = iso.split("-");
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      return `${months[parseInt(m, 10) - 1]} ${y}`;
    } catch {
      return iso;
    }
  };

  /* ---- Highlight matched text ---- */
  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const tokens = query.trim().toLowerCase().split(/\s+/);
    // Find the first token that appears in this text
    const lower = text.toLowerCase();
    for (const token of tokens) {
      const idx = lower.indexOf(token);
      if (idx !== -1) {
        return (
          <>
            {text.slice(0, idx)}
            <span className="font-bold text-[var(--foreground)]">
              {text.slice(idx, idx + token.length)}
            </span>
            {text.slice(idx + token.length)}
          </>
        );
      }
    }
    return text;
  };

  const listboxId = "search-results-listbox";

  return (
    <div
      ref={wrapperRef}
      className={`relative ${mobile ? "w-full" : ""}`}
    >
      {/* Search input */}
      <div className="relative">
        {/* Magnifying glass icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          aria-hidden="true"
        >
          <circle cx="6" cy="6" r="4.5" />
          <path d="M9.5 9.5L13 13" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
          }
          aria-label="Search sources"
          placeholder="Search sources..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && results.length > 0) setIsOpen(true);
          }}
          className={`
            pl-7 pr-3 py-1.5
            text-[12px] font-medium text-[var(--foreground)]
            bg-black/[0.03] rounded-md
            border border-transparent
            focus:border-black/[0.08] focus:bg-white focus:shadow-sm
            placeholder:text-[var(--muted)]
            outline-none
            ${
              mobile
                ? "w-full text-[13px] py-2"
                : "w-[180px] focus:w-[260px] transition-[width] duration-200"
            }
          `}
        />
      </div>

      {/* Dropdown results */}
      {isOpen && query.trim() && (
        <ul
          id={listboxId}
          role="listbox"
          className={`
            absolute top-full left-0 mt-1
            bg-white rounded-lg border border-black/[0.08] shadow-lg
            py-1 max-h-[400px] overflow-y-auto
            z-50
            ${mobile ? "w-full" : "w-[340px]"}
          `}
        >
          {results.length === 0 ? (
            <li className="px-3 py-4 text-[13px] text-[var(--muted)]">
              No sources found for &ldquo;{query}&rdquo;
            </li>
          ) : (
            results.map((result, i) => {
              const tierCfg = getTierConfig(result.evidenceTier);
              const isActive = i === activeIndex;

              return (
                <li
                  key={result.id}
                  id={`search-result-${i}`}
                  role="option"
                  aria-selected={isActive}
                  className={`
                    px-3 py-2.5 cursor-pointer
                    flex items-start gap-2
                    ${isActive ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"}
                  `}
                  onClick={() => navigateTo(result)}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  {/* Tier dot */}
                  <span
                    className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tierCfg.color }}
                    title={tierCfg.label}
                  />

                  <div className="min-w-0 flex-1">
                    {/* Title */}
                    <p className="text-[12px] font-medium text-[var(--foreground)] leading-snug truncate flex items-center gap-1">
                      <span className="truncate">{highlight(result.title)}</span>
                      {result.url && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 text-[var(--muted)] opacity-60"
                          aria-label="Opens in new tab"
                        >
                          <path d="M5 1H1v10h10V7" />
                          <path d="M7 1h4v4" />
                          <path d="M11 1L5.5 6.5" />
                        </svg>
                      )}
                    </p>

                    {/* Publisher + date */}
                    <p className="text-[11px] text-[var(--muted)] mt-0.5 truncate">
                      {highlight(result.publisher)}
                      <span className="mx-1 opacity-40">&middot;</span>
                      {fmtDate(result.datePublished)}
                    </p>

                    {/* Prediction pills */}
                    {result.usedIn.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.usedIn.slice(0, 3).map((slug) => (
                          <span
                            key={slug}
                            className="text-[9px] font-medium text-[var(--accent)] bg-[var(--accent)]/[0.08] px-1.5 py-0.5 rounded leading-tight"
                          >
                            {getPredictionTitle(slug).replace(
                              / by \d{4}/,
                              ""
                            )}
                          </span>
                        ))}
                        {result.usedIn.length > 3 && (
                          <span className="text-[9px] text-[var(--muted)] px-1 py-0.5">
                            +{result.usedIn.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
