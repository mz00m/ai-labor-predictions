"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  OccupationRisk,
  formatJobs,
  formatPay,
  prettyCategory,
  riskColor,
  riskColor100,
} from "./types";

interface Props {
  occupations: OccupationRisk[];
}

type SortKey =
  | "title"
  | "category"
  | "jobs"
  | "pay"
  | "exposure"
  | "netRisk"
  | "pctHigh";
type SortDir = "asc" | "desc";

const COLS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "title", label: "Occupation", align: "left" },
  { key: "category", label: "Sector", align: "left" },
  { key: "jobs", label: "Jobs", align: "right" },
  { key: "pay", label: "Pay", align: "right" },
  { key: "exposure", label: "Exposure", align: "right" },
  { key: "netRisk", label: "Net risk", align: "right" },
  { key: "pctHigh", label: "% high-risk time", align: "right" },
];

export default function OccupationRiskTable({ occupations }: Props) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [sortKey, setSortKey] = useState<SortKey>("netRisk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Distinct categories with counts
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const occ of occupations) {
      counts.set(occ.category, (counts.get(occ.category) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([slug, count]) => ({ slug, count, label: prettyCategory(slug) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [occupations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return occupations.filter((o) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(o.category)) {
        return false;
      }
      if (q && !o.title.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [occupations, query, selectedCategories]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      switch (sortKey) {
        case "title":
          return a.title.localeCompare(b.title) * dir;
        case "category":
          return prettyCategory(a.category).localeCompare(prettyCategory(b.category)) * dir;
        case "jobs":
          return (a.jobs - b.jobs) * dir;
        case "pay":
          return (a.pay - b.pay) * dir;
        case "exposure":
          return (a.exposure - b.exposure) * dir;
        case "netRisk":
          return (a.netRisk100 - b.netRisk100) * dir;
        case "pctHigh":
          return (a.pctHighRiskTime - b.pctHighRiskTime) * dir;
      }
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setOpenSlug(null);
  }

  function clearFilters() {
    setSelectedCategories(new Set());
    setQuery("");
    setOpenSlug(null);
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "title" || key === "category" ? "asc" : "desc");
    }
    setOpenSlug(null);
  }

  return (
    <section className="mb-20">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] opacity-60 mb-2">
          02 &middot; Occupation drill-down
        </p>
        <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-2">
          Every occupation, scored
        </h2>
        <p className="text-md text-[var(--muted)] leading-relaxed max-w-2xl">
          {occupations.length.toLocaleString("en-US")} BLS occupations, ranked by net
          displacement risk on a 0&ndash;100 scale. Click any row to see the
          top-rated tasks driving the score.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-5">
        {/* Search */}
        <div className="relative max-w-sm mb-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by occupation name..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-strong rounded-md bg-white text-[var(--foreground)] placeholder:text-[var(--muted-light)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
          />
          <svg
            className="absolute left-2.5 top-2.5 w-4 h-4 text-[var(--muted-light)]"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L13 13" strokeLinecap="round" />
          </svg>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => {
            const active = selectedCategories.has(c.slug);
            return (
              <button
                key={c.slug}
                onClick={() => toggleCategory(c.slug)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  active
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-white text-[var(--foreground)] border-strong hover:border-[var(--accent)]"
                }`}
                aria-pressed={active}
              >
                {c.label}{" "}
                <span className={active ? "opacity-70" : "opacity-50"}>
                  {c.count}
                </span>
              </button>
            );
          })}
          {(selectedCategories.size > 0 || query) && (
            <button
              onClick={clearFilters}
              className="text-xs px-2.5 py-1 text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>

        <p className="mt-3 text-xs text-[var(--muted)]">
          Showing {sorted.length.toLocaleString("en-US")} of{" "}
          {occupations.length.toLocaleString("en-US")} occupations.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-strong">
              {COLS.map((c) => (
                <th
                  key={c.key}
                  className={`py-2.5 px-2 text-2xs font-bold uppercase tracking-widest text-[var(--muted)] ${
                    c.align === "right" ? "text-right" : "text-left"
                  } whitespace-nowrap`}
                >
                  <button
                    onClick={() => handleSort(c.key)}
                    className="inline-flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
                  >
                    {c.label}
                    <SortIndicator
                      active={sortKey === c.key}
                      dir={sortDir}
                    />
                  </button>
                </th>
              ))}
              <th aria-hidden="true" className="w-6" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((occ) => {
              const isOpen = openSlug === occ.slug;
              return (
                <TableRow
                  key={occ.slug}
                  occ={occ}
                  isOpen={isOpen}
                  onToggle={() => setOpenSlug((s) => (s === occ.slug ? null : occ.slug))}
                />
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={COLS.length + 1} className="py-8 text-center text-[var(--muted)]">
                  No occupations match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return <span className="opacity-25">{"\u2195"}</span>;
  }
  return (
    <span className="text-[var(--accent-text)]">
      {dir === "asc" ? "\u25B2" : "\u25BC"}
    </span>
  );
}

function TableRow({
  occ,
  isOpen,
  onToggle,
}: {
  occ: OccupationRisk;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const netColor = riskColor100(occ.netRisk100);
  // exposure 0-10 -> normalized 0-100 for the bar
  const exposurePct = Math.min(100, Math.max(0, (occ.exposure / 10) * 100));

  return (
    <>
      <tr
        className={`border-b border-black/[0.04] cursor-pointer transition-colors ${
          isOpen ? "bg-[var(--accent-light)]" : "hover:bg-black/[0.012]"
        }`}
        onClick={onToggle}
      >
        <td className="py-2.5 px-2 text-[var(--foreground)] font-medium align-middle">
          <Link
            href={`/occupation-exposure/${occ.slug}`}
            className="hover:text-[var(--accent-text)] hover:underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {occ.title}
          </Link>
        </td>
        <td className="py-2.5 px-2 align-middle">
          <span className="inline-block text-2xs font-medium uppercase tracking-wider text-[var(--muted)] bg-black/[0.03] rounded px-1.5 py-0.5 whitespace-nowrap">
            {prettyCategory(occ.category)}
          </span>
        </td>
        <td
          className="py-2.5 px-2 text-right text-[var(--foreground)] align-middle whitespace-nowrap"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {occ.jobs.toLocaleString("en-US")}
        </td>
        <td
          className="py-2.5 px-2 text-right text-[var(--foreground)] align-middle whitespace-nowrap"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {formatPay(occ.pay)}
        </td>
        <td className="py-2.5 px-2 text-right align-middle">
          <div className="inline-flex items-center gap-2 justify-end">
            <div className="h-1.5 w-12 bg-black/[0.05] rounded-sm overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${exposurePct}%`,
                  background: riskColor(occ.exposure),
                }}
              />
            </div>
            <span
              className="text-2xs tabular-nums text-[var(--muted)]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {occ.exposure.toFixed(0)}
            </span>
          </div>
        </td>
        <td className="py-2.5 px-2 text-right align-middle">
          <span
            className="inline-flex items-center justify-center min-w-[36px] px-1.5 py-0.5 rounded text-xs font-bold tabular-nums"
            style={{
              background: netColor,
              color: "#fff",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {occ.netRisk100}
          </span>
        </td>
        <td className="py-2.5 px-2 text-right align-middle">
          <SparkBar
            high={occ.pctHighRiskTime}
            medium={occ.pctMediumRiskTime}
            low={occ.pctLowRiskTime}
          />
        </td>
        <td className="py-2.5 px-1 align-middle text-[var(--muted)]">
          <span
            className="inline-block transition-transform"
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            aria-hidden="true"
          >
            &rsaquo;
          </span>
        </td>
      </tr>
      {isOpen && (
        <tr className="border-b border-black/[0.04] bg-[var(--accent-light)]/40">
          <td colSpan={8} className="px-2 py-4">
            <TaskBreakdown occ={occ} />
          </td>
        </tr>
      )}
    </>
  );
}

function SparkBar({
  high,
  medium,
  low,
}: {
  high: number;
  medium: number;
  low: number;
}) {
  const h = Math.max(0, high);
  const m = Math.max(0, medium);
  const l = Math.max(0, 100 - h - m);
  return (
    <div className="inline-flex items-center gap-2 justify-end">
      <div
        className="relative h-2 w-20 rounded-sm overflow-hidden bg-black/[0.04]"
        aria-label={`${Math.round(h)}% high, ${Math.round(m)}% medium, ${Math.round(l)}% low`}
      >
        {h > 0 && (
          <div
            className="absolute top-0 left-0 h-full"
            style={{ width: `${h}%`, background: "#DC2626" }}
          />
        )}
        {m > 0 && (
          <div
            className="absolute top-0 h-full"
            style={{ left: `${h}%`, width: `${m}%`, background: "#F59E0B" }}
          />
        )}
        {l > 0 && (
          <div
            className="absolute top-0 h-full"
            style={{ left: `${h + m}%`, width: `${l}%`, background: "#16A34A" }}
          />
        )}
      </div>
      <span
        className="text-2xs tabular-nums text-[var(--muted)]"
        style={{ fontFamily: "'DM Mono', monospace", minWidth: "26px" }}
      >
        {Math.round(h)}%
      </span>
    </div>
  );
}

function TaskBreakdown({ occ }: { occ: OccupationRisk }) {
  const topTasks = [...occ.tasks]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 8);

  return (
    <div className="px-2">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
          Top tasks by O*NET importance
        </p>
        <Link
          href={`/occupation-exposure/${occ.slug}`}
          className="text-xs font-medium text-[var(--accent-text)] hover:underline"
        >
          Full occupation analysis &rarr;
        </Link>
      </div>
      <ul className="space-y-1.5">
        {topTasks.map((t, i) => {
          const bucketColor =
            t.riskBucket === "high"
              ? "#DC2626"
              : t.riskBucket === "medium"
                ? "#F59E0B"
                : "#16A34A";
          // riskScore in source data is 0-100
          const pct = Math.min(100, Math.max(0, t.riskScore));
          return (
            <li
              key={`${occ.slug}-${i}-${t.taskName}`}
              className="grid grid-cols-[1.6fr_1fr_auto] gap-3 items-center text-xs"
            >
              <span className="text-[var(--foreground)] truncate" title={t.taskName}>
                {t.taskName}
              </span>
              <div className="h-1.5 bg-black/[0.05] rounded-sm overflow-hidden">
                <div
                  className="h-full"
                  style={{ width: `${pct}%`, background: bucketColor }}
                />
              </div>
              <span
                className="text-2xs font-bold uppercase tracking-wider tabular-nums"
                style={{ color: bucketColor, fontFamily: "'DM Mono', monospace", minWidth: "62px", textAlign: "right" }}
              >
                {Math.round(t.riskScore)} &middot; {t.riskBucket}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
