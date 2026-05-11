"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export type SearchResult =
  | { kind: "state"; id: string; name: string; abbr: string }
  | { kind: "msa"; id: string; name: string; primState: string }
  | { kind: "county"; id: string; name: string }
  | { kind: "occupation"; slug: string; name: string };

interface Props {
  results: {
    states: { id: string; name: string; abbr: string }[];
    msas: { id: string; name: string; primState: string }[];
    counties: { id: string; name: string }[];
    occupations: { slug: string; name: string }[];
  };
  onSelect: (r: SearchResult) => void;
}

export default function MapSearch({ results, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const hits = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: SearchResult[] = [];
    // Prefer prefix matches; then substring.
    function pushSort<T extends { _name: string }>(arr: T[]): T[] {
      return arr.sort((a, b) => {
        const ap = a._name.toLowerCase().startsWith(q) ? 0 : 1;
        const bp = b._name.toLowerCase().startsWith(q) ? 0 : 1;
        if (ap !== bp) return ap - bp;
        return a._name.length - b._name.length;
      });
    }

    const stateHits = pushSort(
      results.states
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.abbr.toLowerCase() === q ||
            s.abbr.toLowerCase().startsWith(q),
        )
        .map((s) => ({ ...s, _name: s.name })),
    ).slice(0, 5);
    for (const s of stateHits) {
      out.push({ kind: "state", id: s.id, name: s.name, abbr: s.abbr });
    }

    const msaHits = pushSort(
      results.msas
        .filter((m) => m.name.toLowerCase().includes(q))
        .map((m) => ({ ...m, _name: m.name })),
    ).slice(0, 5);
    for (const m of msaHits) {
      out.push({ kind: "msa", id: m.id, name: m.name, primState: m.primState });
    }

    const countyHits = pushSort(
      results.counties
        .filter((c) => c.name.toLowerCase().includes(q))
        .map((c) => ({ ...c, _name: c.name })),
    ).slice(0, 5);
    for (const c of countyHits) {
      out.push({ kind: "county", id: c.id, name: c.name });
    }

    const occHits = pushSort(
      results.occupations
        .filter((o) => o.name.toLowerCase().includes(q))
        .map((o) => ({ ...o, _name: o.name })),
    ).slice(0, 6);
    for (const o of occHits) {
      out.push({ kind: "occupation", slug: o.slug, name: o.name });
    }
    return out.slice(0, 20);
  }, [query, results]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  function handleSelect(r: SearchResult) {
    onSelect(r);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.length >= 2 && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((i) => Math.min(i + 1, Math.max(0, hits.length - 1)));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((i) => Math.max(0, i - 1));
          } else if (e.key === "Enter") {
            if (hits[activeIdx]) {
              e.preventDefault();
              handleSelect(hits[activeIdx]);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Search states, metros, counties, occupations…"
        aria-label="Search regions and occupations"
        className="w-full px-3.5 py-2 text-sm bg-white border border-strong rounded-md placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
      />
      {open && hits.length > 0 && (
        <div className="absolute z-30 mt-1 left-0 right-0 bg-white border border-strong rounded-md shadow-lg max-h-[320px] overflow-y-auto">
          <ul className="py-1">
            {hits.map((h, i) => {
              const active = i === activeIdx;
              const key =
                h.kind === "occupation"
                  ? `occ-${h.slug}`
                  : `${h.kind}-${(h as { id: string }).id}`;
              if (h.kind === "occupation") {
                return (
                  <li key={key}>
                    <Link
                      href={`/occupation-exposure/${h.slug}`}
                      onClick={() => handleSelect(h)}
                      className={`block px-3 py-1.5 text-sm hover:bg-black/[0.04] ${
                        active ? "bg-black/[0.04]" : ""
                      }`}
                      onMouseEnter={() => setActiveIdx(i)}
                    >
                      <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] mr-2">
                        Occ
                      </span>
                      {h.name}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => handleSelect(h)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-black/[0.04] ${
                      active ? "bg-black/[0.04]" : ""
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] mr-2">
                      {h.kind === "state" ? "State" : h.kind === "msa" ? "Metro" : "County"}
                    </span>
                    {h.name}
                    {h.kind === "state" && (
                      <span className="ml-1.5 text-[var(--muted)] font-mono text-2xs">
                        {h.abbr}
                      </span>
                    )}
                    {h.kind === "msa" && (
                      <span className="ml-1.5 text-[var(--muted)] font-mono text-2xs">
                        {h.primState}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
