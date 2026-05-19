"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Region } from "@/lib/composite-model";

interface Props {
  regions: Region[];
  regionId: string;
  setRegionId: (id: string) => void;
  /** Show up to N filtered results (default 10) */
  maxResults?: number;
}

/**
 * Type-to-filter region picker. Filters by name and state code (case-insensitive
 * substring). Curated regions appear first when no query; otherwise results are
 * sorted by total employment within the matches.
 */
export default function RegionCombobox({
  regions,
  regionId,
  setRegionId,
  maxResults = 10,
}: Props) {
  const selected = regions.find((r) => r.id === regionId);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default: curated first, then largest other MSAs by employment
      const curated = regions.filter((r) => r.curated);
      const others = regions
        .filter((r) => !r.curated)
        .sort((a, b) => b.totalEmploymentK - a.totalEmploymentK)
        .slice(0, maxResults - curated.length);
      return [...curated, ...others].slice(0, maxResults);
    }
    return regions
      .filter((r) => r.name.toLowerCase().includes(q) || r.state.toLowerCase().includes(q))
      .sort((a, b) => {
        // Curated first within matches
        if (a.curated && !b.curated) return -1;
        if (!a.curated && b.curated) return 1;
        return b.totalEmploymentK - a.totalEmploymentK;
      })
      .slice(0, maxResults);
  }, [query, regions, maxResults]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const pick = useCallback(
    (r: Region) => {
      setRegionId(r.id);
      setQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [setRegionId]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      pick(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={wrapperRef} className="relative" style={{ isolation: "isolate" }}>
      {/* Selected region display + search input */}
      <div className="bg-card border border-card rounded-lg overflow-hidden relative z-10">
        {selected && !isOpen && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-[var(--background)] transition-colors"
          >
            <div className="min-w-0">
              <p className="text-base text-[var(--foreground)] truncate">
                {selected.name}
              </p>
              <p className="text-xs text-[var(--muted)] tabular-nums">
                {selected.totalEmploymentK.toLocaleString()}K jobs · {selected.state}
                {selected.curated && (
                  <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--accent-text)]">
                    Featured
                  </span>
                )}
              </p>
            </div>
            <span className="text-xs text-[var(--muted)] flex-shrink-0">
              Change region ▾
            </span>
          </button>
        )}

        {(isOpen || !selected) && (
          <div className="border-b border-divider">
            <div className="flex items-center gap-2 px-4 py-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-[var(--muted)] flex-shrink-0"
                aria-hidden
              >
                <circle cx="6" cy="6" r="4.5" />
                <path d="M9.5 9.5L13 13" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by city or state (e.g. Boston, NC, Allentown)…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKey}
                className="flex-1 bg-transparent text-base text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex-shrink-0"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-2xl overflow-hidden"
          style={{
            zIndex: 9999,
            background: "var(--background)",
            border: "1px solid rgba(0,0,0,0.12)",
          }}
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[var(--muted)] italic">
              No regions match &ldquo;{query}&rdquo;. Try a state code (e.g. PA) or a city name.
            </p>
          ) : (
            <ul ref={listRef} role="listbox" className="max-h-[360px] overflow-y-auto">
              {filtered.map((r, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = r.id === regionId;
                return (
                  <li
                    key={r.id}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => pick(r)}
                    className={`px-4 py-2.5 cursor-pointer flex items-center justify-between gap-3 ${
                      isActive ? "bg-card" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--foreground)] truncate">
                        {highlightMatch(r.name, query)}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] tabular-nums">
                        {r.totalEmploymentK.toLocaleString()}K jobs · {r.state}
                        {r.curated && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--accent-text)]">
                            Featured
                          </span>
                        )}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="text-xs text-[var(--accent-text)] flex-shrink-0">
                        ✓ Selected
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <div className="px-4 py-2 border-t border-divider bg-card text-[10px] text-[var(--muted)] tabular-nums flex justify-between">
            <span>
              {query
                ? `${filtered.length} match${filtered.length === 1 ? "" : "es"} (showing up to ${maxResults})`
                : `${regions.length} regions total — type to filter`}
            </span>
            <span className="hidden sm:inline">↑ ↓ to navigate · ↵ to pick · esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
}

function highlightMatch(text: string, q: string): React.ReactNode {
  if (!q.trim()) return text;
  const lower = text.toLowerCase();
  const lq = q.toLowerCase();
  const idx = lower.indexOf(lq);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="text-[var(--accent-text)]">
        {text.slice(idx, idx + q.length)}
      </strong>
      {text.slice(idx + q.length)}
    </>
  );
}
