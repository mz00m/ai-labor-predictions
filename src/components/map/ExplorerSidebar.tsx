"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import {
  formatJobs,
  prettyCategory,
  riskColor100,
} from "./types";

/** Render a markdown-lite string (only **bold** is honored). */
function renderBoldMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-[var(--foreground)]">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    ),
  );
}

const ARCHETYPE_COLOR: Record<string, string> = {
  "automation-risk": "#DC2626",
  "reorganize": "#F59E0B",
  "grow": "#16A34A",
  "less-change": "#94A3B8",
};

const ARCHETYPE_LABEL: Record<string, string> = {
  "automation-risk": "Automation risk",
  "reorganize": "Reorganize",
  "grow": "Grow",
  "less-change": "Less change",
};

function NarrativeBanner({
  narrative,
  archetypeMix,
}: {
  narrative?: string;
  archetypeMix?: Record<string, number>;
}) {
  if (!narrative && !archetypeMix) return null;
  return (
    <div className="mt-3 mb-2 rounded-md bg-[var(--accent-light)]/40 border border-[var(--accent)]/15 px-3 py-2.5">
      {narrative && (
        <p className="text-2xs leading-relaxed text-[var(--foreground)]">
          {renderBoldMarkdown(narrative)}
        </p>
      )}
      {archetypeMix && (
        <div className="mt-2.5">
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
            Archetype mix (employment share)
          </div>
          <div className="flex h-2 w-full rounded-sm overflow-hidden bg-black/[0.04]">
            {(["automation-risk", "reorganize", "grow", "less-change"] as const).map((k) => (
              <div
                key={k}
                style={{ width: `${(archetypeMix[k] ?? 0) * 100}%`, background: ARCHETYPE_COLOR[k] }}
                title={`${ARCHETYPE_LABEL[k]}: ${((archetypeMix[k] ?? 0) * 100).toFixed(0)}%`}
              />
            ))}
          </div>
          <div className="flex gap-2 mt-1 text-[10px] text-[var(--muted)] flex-wrap">
            {(["automation-risk", "reorganize", "grow", "less-change"] as const).map((k) => (
              <span key={k} className="inline-flex items-center gap-1">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-sm"
                  style={{ background: ARCHETYPE_COLOR[k] }}
                  aria-hidden="true"
                />
                {ARCHETYPE_LABEL[k]}{" "}
                <span className="font-mono">{((archetypeMix[k] ?? 0) * 100).toFixed(0)}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Top occupations per BLS major-group slug. Server-rendered once from
 * occupation-risk.json so the county pane can offer drill-through links
 * even though ACS itself doesn't publish detailed-SOC by county.
 */
export interface TopOccupationByCategory {
  slug: string;
  title: string;
  netRisk100: number;
  jobs: number;
}
export type TopOccupationsByCategory = Record<string, TopOccupationByCategory[]>;

// Lightweight row types — shaped to whatever the explorer hands down.

export interface StateSidebarData {
  fips: string;
  abbr: string;
  title: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  weightedPctHighRiskTime: number;
  coverage: number;
  /** Pre-rendered region narrative (markdown-lite — supports **bold**). */
  narrative?: string;
  /** Share of employment in each OpenAI archetype (0..1). */
  archetypeMix?: Record<"automation-risk" | "reorganize" | "grow" | "less-change", number>;
  topRiskOccupations: {
    slug: string;
    title: string;
    employment: number;
    netRisk100: number;
  }[];
  topMetrosInState: {
    cbsa: string;
    title: string;
    totalEmployment: number;
    weightedNetRisk100: number;
  }[];
  /** Realized ChatGPT use intensity from OpenAI Signals 2025. */
  chatgptUse?: {
    rank: number;
    intensity: number; // 0..1, 1 = top-rank
    topTopics?: { topic: string; share: number }[];
  };
}

export interface MsaSidebarData {
  cbsa: string;
  title: string;
  primState: string;
  type?: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  occupationCount: number;
  narrative?: string;
  archetypeMix?: Record<"automation-risk" | "reorganize" | "grow" | "less-change", number>;
  /** Optional detailed list loaded from msa-occupation-employment.json. */
  topOccupations?: {
    slug: string;
    soc?: string;
    title: string;
    employment: number;
    medianWage?: number | null;
    netRisk100: number;
    category: string;
    share: number;
  }[];
  members: { fips: string; name: string; role: string }[];
}

export interface CountySidebarData {
  fips: string;
  name: string;
  stateFips: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  narrative?: string;
  archetypeMix?: Record<"automation-risk" | "reorganize" | "grow" | "less-change", number>;
  /** Loaded from county-occupation-employment.json on demand. */
  occupationGroups?: {
    slug: string;
    employment: number;
    share: number;
    netRisk100: number;
  }[];
  topGroupsFallback: {
    slug: string;
    share: number;
    netRisk100: number;
  }[];
  /** Parent MSA name when the county is inside one. */
  parentMetroName?: string | null;
  /** Where the imputation came from. */
  imputedDetailedSource?: "metro" | "nonmetro-state" | null;
  /** Imputed detailed-SOC occupations (top 15). */
  imputedDetailedOccupations?: {
    slug: string;
    title: string;
    estimatedEmployment: number;
    estimatedShare: number;
    netRisk100: number;
  }[] | null;
}

export type NationalSummary = {
  stateCount: number;
  totalEmployment: number;
  averageWeightedRisk: number;
  occupationCount: number;
};

interface CommonProps {
  loading?: boolean;
}

interface DefaultProps extends CommonProps {
  kind: "default";
  national: NationalSummary;
}

interface StateProps extends CommonProps {
  kind: "state";
  data: StateSidebarData;
  onFocusMsa: (cbsa: string) => void;
}

interface MsaProps extends CommonProps {
  kind: "msa";
  data: MsaSidebarData;
  onFocusCounty: (fips: string) => void;
}

interface CountyProps extends CommonProps {
  kind: "county";
  data: CountySidebarData;
  /** Per-category top occupations for the drill-down expand. */
  topOccupationsByCategory: TopOccupationsByCategory;
}

export type ExplorerSidebarProps =
  | DefaultProps
  | StateProps
  | MsaProps
  | CountyProps;

export default function ExplorerSidebar(props: ExplorerSidebarProps) {
  if (props.kind === "default") return <DefaultPane national={props.national} />;
  if (props.kind === "state")
    return <StatePane data={props.data} onFocusMsa={props.onFocusMsa} loading={props.loading} />;
  if (props.kind === "msa")
    return <MsaPane data={props.data} onFocusCounty={props.onFocusCounty} loading={props.loading} />;
  return (
    <CountyPane
      data={props.data}
      loading={props.loading}
      topOccupationsByCategory={props.topOccupationsByCategory}
    />
  );
}

/* ---------- Default ---------- */

function DefaultPane({ national }: { national: NationalSummary }) {
  return (
    <div className="text-sm leading-relaxed">
      <p className="font-semibold text-[var(--foreground)] mb-2">
        Hover or click any region.
      </p>
      <p className="text-[var(--muted)]">
        Each polygon is colored by its employment-weighted AI displacement risk.
        Click to focus the map and see the occupation makeup driving that score.
      </p>

      <div className="mt-5 border-t border-card pt-4">
        <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2">
          National roll-up
        </div>
        <dl className="space-y-2">
          <Stat label="Average state risk" value={`${national.averageWeightedRisk.toFixed(1)} / 100`} />
          <Stat label="Total employment scored" value={formatJobs(national.totalEmployment)} />
          <Stat label="Occupations" value={national.occupationCount.toLocaleString("en-US")} />
        </dl>
      </div>
    </div>
  );
}

/* ---------- State ---------- */

function StatePane({
  data,
  onFocusMsa,
}: {
  data: StateSidebarData;
  onFocusMsa: (cbsa: string) => void;
  loading?: boolean;
}) {
  return (
    <div className="text-sm">
      <Header
        title={data.title}
        subtitle={`${formatJobs(data.totalEmployment)} jobs · ${(data.coverage * 100).toFixed(0)}% scored`}
        aside={data.abbr}
      />

      <NarrativeBanner narrative={data.narrative} archetypeMix={data.archetypeMix} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric
          label="Net risk"
          value={data.weightedNetRisk100.toFixed(0)}
          unit="/100"
          color={riskColor100(data.weightedNetRisk100)}
        />
        <Metric
          label="High-risk time"
          value={`${data.weightedPctHighRiskTime.toFixed(1)}`}
          unit="%"
          color={riskColor100(Math.min(100, data.weightedPctHighRiskTime * 2))}
        />
      </div>

      <div className="mt-2.5 text-2xs text-[var(--muted)] leading-snug">
        Score covers <span className="font-mono text-[var(--foreground)]">{(data.coverage * 100).toFixed(0)}%</span> of
        state employment. Occupations directly in our framework are scored at
        the detailed-SOC level; the rest are assigned their SOC major-group
        average (lifts state coverage from ~50% to near-full).
      </div>

      {data.topMetrosInState.length > 0 && (
        <Section title="Top metros in this state">
          <ul className="space-y-1.5">
            {data.topMetrosInState.map((m) => (
              <li key={m.cbsa}>
                <button
                  type="button"
                  onClick={() => onFocusMsa(m.cbsa)}
                  className="w-full flex items-center justify-between gap-2 text-2xs hover:text-[var(--accent-text)] text-left transition-colors"
                >
                  <span className="truncate">{m.title}</span>
                  <span className="font-mono text-[var(--muted)] shrink-0">
                    {formatJobs(m.totalEmployment)} · {m.weightedNetRisk100}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.chatgptUse && (
        <Section title="Realized ChatGPT use (2025)">
          <div className="text-2xs leading-relaxed">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-[var(--foreground)]">
                #{data.chatgptUse.rank}
              </span>
              <span className="text-[var(--muted)]">of 51 states</span>
            </div>
            <p className="text-[var(--muted)] mt-1 leading-snug">
              From OpenAI Signals (aggregated, differential-privacy-protected). A
              high rank means more ChatGPT use per capita — a direct measure of
              realized adoption.
            </p>
            {data.chatgptUse.topTopics && data.chatgptUse.topTopics.length > 0 && (
              <div className="mt-2">
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                  Top topics in state
                </div>
                <ul className="space-y-0.5">
                  {data.chatgptUse.topTopics.map((t) => (
                    <li key={t.topic} className="flex justify-between gap-2">
                      <span>{t.topic}</span>
                      <span className="font-mono text-[var(--muted)]">
                        {(t.share * 100).toFixed(1)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {data.topRiskOccupations.length > 0 && (
        <Section title="Top-risk occupations">
          <ul className="space-y-1.5">
            {data.topRiskOccupations.slice(0, 5).map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/occupation-exposure/${o.slug}`}
                  className="flex items-center justify-between gap-2 text-2xs hover:text-[var(--accent-text)] transition-colors"
                >
                  <span className="truncate">{o.title}</span>
                  <span className="font-mono text-[var(--muted)] shrink-0">
                    {formatJobs(o.employment)} · {o.netRisk100}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

/* ---------- MSA ---------- */

function MsaPane({
  data,
  onFocusCounty,
  loading,
}: {
  data: MsaSidebarData;
  onFocusCounty: (fips: string) => void;
  loading?: boolean;
}) {
  const top = data.topOccupations ?? [];
  const maxEmp = top.reduce((m, o) => Math.max(m, o.employment), 0);

  return (
    <div className="text-sm">
      <Header
        title={data.title}
        subtitle={`${formatJobs(data.totalEmployment)} jobs · ${data.members.length} ${data.members.length === 1 ? "county" : "counties"}`}
        aside={data.primState}
      />

      <NarrativeBanner narrative={data.narrative} archetypeMix={data.archetypeMix} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric
          label="Net risk"
          value={data.weightedNetRisk100.toFixed(0)}
          unit="/100"
          color={riskColor100(data.weightedNetRisk100)}
        />
        <Metric
          label="Occupations"
          value={data.occupationCount.toLocaleString("en-US")}
          unit="scored"
          color="#111"
        />
      </div>

      <div className="mt-2.5 text-2xs text-[var(--muted)] leading-snug">
        Detailed-SOC data from BLS OEWS. The {data.occupationCount} scored
        occupations are shown below at full detail; remaining ~half of metro
        employment is assigned its SOC major-group average for the headline
        risk score (lifts coverage from ~50% to ~90%).
      </div>

      <Section title="Occupations by employment share">
        {loading ? (
          <SkeletonRows count={6} />
        ) : top.length === 0 ? (
          <p className="text-2xs text-[var(--muted)]">No occupation detail available for this metro.</p>
        ) : (
          <ul className="space-y-1.5">
            {top.slice(0, 15).map((o) => {
              const widthPct = maxEmp > 0 ? (o.employment / maxEmp) * 100 : 0;
              return (
                <li key={`${o.slug}-${o.soc ?? ""}`} className="group">
                  <Link
                    href={`/occupation-exposure/${o.slug}`}
                    className="block hover:text-[var(--accent-text)] transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-2 text-2xs">
                      <span className="truncate">{o.title}</span>
                      <span className="font-mono text-[var(--muted)] shrink-0">
                        {o.share.toFixed(1)}% · {o.netRisk100}
                      </span>
                    </div>
                    <div className="mt-0.5 h-[3px] bg-black/[0.04] rounded-sm overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${widthPct}%`,
                          background: riskColor100(o.netRisk100),
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {data.members.length > 0 && (
        <Section title="Member counties">
          <ul className="space-y-1">
            {data.members.slice(0, 12).map((c) => (
              <li key={c.fips}>
                <button
                  type="button"
                  onClick={() => onFocusCounty(c.fips)}
                  className="w-full flex items-center justify-between gap-2 text-2xs text-left hover:text-[var(--accent-text)] transition-colors"
                >
                  <span className="truncate">{c.name}</span>
                  <span className="font-mono text-[var(--muted)] shrink-0">{c.role}</span>
                </button>
              </li>
            ))}
            {data.members.length > 12 && (
              <li className="text-2xs text-[var(--muted)] pt-1">
                +{data.members.length - 12} more
              </li>
            )}
          </ul>
        </Section>
      )}
    </div>
  );
}

/* ---------- County ---------- */

function CountyPane({
  data,
  loading,
  topOccupationsByCategory,
}: {
  data: CountySidebarData;
  loading?: boolean;
  topOccupationsByCategory: TopOccupationsByCategory;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const groups = data.occupationGroups ?? data.topGroupsFallback.map((g) => ({
    slug: g.slug,
    employment: 0,
    share: g.share,
    netRisk100: g.netRisk100,
  }));

  // Show top 8 by share + aggregate "Other"
  const sorted = [...groups].sort((a, b) => b.share - a.share);
  const top = sorted.slice(0, 8);
  const otherShare = sorted.slice(8).reduce((s, g) => s + g.share, 0);

  return (
    <div className="text-sm">
      <Header
        title={data.name}
        subtitle={
          data.totalEmployment > 0
            ? `${formatJobs(data.totalEmployment)} jobs scored`
            : "ACS occupation breakdown"
        }
      />

      <NarrativeBanner narrative={data.narrative} archetypeMix={data.archetypeMix} />

      {/* Honest framing: shares are real, risk-per-group is national average. */}
      <div className="mt-3 rounded-md bg-amber-50 border border-amber-100 px-3 py-2 text-2xs text-amber-900 leading-snug">
        <span className="font-semibold">How to read this:</span>{" "}
        The <em>shares</em> below are real Census ACS data for this county. The
        <em> risk</em> number on each group is the <em>national</em> average risk
        of that group — not specific to this county. Census doesn&rsquo;t publish
        occupations finer than ~22 major groups at the county level, so we can&rsquo;t
        see, say, which kind of &ldquo;Management&rdquo; jobs are here.
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <Metric
          label="Composition-weighted risk"
          value={data.weightedNetRisk100.toFixed(1)}
          unit="/100"
          color={riskColor100(data.weightedNetRisk100)}
        />
      </div>

      <Section title="Occupation distribution">
        {loading ? (
          <SkeletonRows count={6} />
        ) : (
          <>
            {/* Stacked bar */}
            <div className="flex h-3 w-full rounded-sm overflow-hidden bg-black/[0.04] mb-3">
              {top.map((g) => (
                <div
                  key={g.slug}
                  style={{
                    width: `${g.share}%`,
                    background: riskColor100(g.netRisk100),
                    opacity: 0.88,
                  }}
                  title={`${prettyCategory(g.slug)} · ${g.share.toFixed(1)}% · risk ${g.netRisk100}`}
                />
              ))}
              {otherShare > 0.5 && (
                <div
                  style={{
                    width: `${otherShare}%`,
                    background: "#D1D5DB",
                  }}
                  title={`Other · ${otherShare.toFixed(1)}%`}
                />
              )}
            </div>

            <ul className="space-y-1">
              {top.map((g) => {
                const isOpen = expanded === g.slug;
                const topOccs = topOccupationsByCategory[g.slug] ?? [];
                const hasChildren = topOccs.length > 0;
                return (
                  <li key={g.slug}>
                    <button
                      type="button"
                      onClick={() => hasChildren && setExpanded(isOpen ? null : g.slug)}
                      disabled={!hasChildren}
                      className={`w-full flex items-baseline justify-between gap-2 text-2xs py-1 px-1.5 -mx-1.5 rounded transition-colors ${
                        hasChildren
                          ? "cursor-pointer hover:bg-black/[0.03]"
                          : "cursor-default"
                      } ${isOpen ? "bg-black/[0.04]" : ""}`}
                      aria-expanded={isOpen}
                    >
                      <span className="inline-flex items-baseline gap-2 truncate min-w-0">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-sm shrink-0"
                          style={{ background: riskColor100(g.netRisk100) }}
                          aria-hidden="true"
                        />
                        <span className="truncate text-left">{prettyCategory(g.slug)}</span>
                        {hasChildren && (
                          <span
                            className="text-[var(--muted)] opacity-50 shrink-0 transition-transform"
                            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                            aria-hidden="true"
                          >
                            ›
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[var(--muted)] shrink-0">
                        {g.share.toFixed(1)}% · {g.netRisk100}
                      </span>
                    </button>
                    {isOpen && hasChildren && (
                      <ul className="ml-4 mt-1 mb-1.5 space-y-0.5 border-l border-card pl-2.5">
                        <li className="text-[10px] uppercase tracking-wider text-[var(--muted)] pb-0.5">
                          Top occupations in group (national)
                        </li>
                        {topOccs.map((o) => (
                          <li key={o.slug}>
                            <Link
                              href={`/occupation-exposure/${o.slug}`}
                              className="flex items-baseline justify-between gap-2 text-2xs py-0.5 hover:text-[var(--accent-text)] transition-colors group"
                            >
                              <span className="truncate flex-1 group-hover:underline">{o.title}</span>
                              <span className="font-mono text-[var(--muted)] shrink-0">
                                {formatJobs(o.jobs)} · {o.netRisk100}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              {otherShare > 0.5 && (
                <li className="text-2xs">
                  <div className="flex items-baseline justify-between gap-2 text-[var(--muted)]">
                    <span className="inline-flex items-baseline gap-2 truncate">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-sm shrink-0"
                        style={{ background: "#D1D5DB" }}
                        aria-hidden="true"
                      />
                      <span>Other groups</span>
                    </span>
                    <span className="font-mono shrink-0">{otherShare.toFixed(1)}%</span>
                  </div>
                </li>
              )}
            </ul>
          </>
        )}
      </Section>

      {data.imputedDetailedOccupations && data.imputedDetailedOccupations.length > 0 && (
        <Section title="Detailed occupations (estimated)">
          <p className="text-2xs text-[var(--muted)] leading-snug mb-2">
            {data.imputedDetailedSource === "metro" ? (
              <>
                Estimates assume {data.name}&rsquo;s workforce mirrors the
                {data.parentMetroName ? <> <span className="font-semibold text-[var(--foreground)]">{data.parentMetroName}</span> metro&rsquo;s</> : " parent metro&rsquo;s"} detailed-SOC mix
                (BLS OEWS) scaled by county share of metro employment.
              </>
            ) : (
              <>
                Estimates scale the state&rsquo;s <span className="font-semibold text-[var(--foreground)]">non-metro</span>{" "}
                detailed-SOC mix (BLS OEWS Balance of State) by this county&rsquo;s
                share of state non-metro employment.
              </>
            )}{" "}
            Helpful for ranking; less reliable for specialized outlying counties
            (think university towns, national-lab towns, resource-extraction enclaves).
          </p>
          <div className="overflow-hidden">
            <ul className="space-y-1">
              {data.imputedDetailedOccupations.slice(0, 12).map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/occupation-exposure/${o.slug}`}
                    className="flex items-baseline justify-between gap-2 text-2xs py-0.5 hover:text-[var(--accent-text)] transition-colors group"
                  >
                    <span className="inline-flex items-baseline gap-2 truncate min-w-0">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-sm shrink-0"
                        style={{ background: riskColor100(o.netRisk100) }}
                        aria-hidden="true"
                      />
                      <span className="truncate group-hover:underline">{o.title}</span>
                    </span>
                    <span className="font-mono text-[var(--muted)] shrink-0 text-right">
                      ~{formatJobs(o.estimatedEmployment)} · {o.estimatedShare.toFixed(1)}% · {o.netRisk100}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <p className="text-2xs text-[var(--muted)] leading-relaxed border-t border-card pt-3 mt-4">
        Major-group shares are real Census ACS data. Detailed-SOC estimates are{" "}
        <span className="font-semibold text-[var(--foreground)]">
          imputed from {data.imputedDetailedSource === "metro" ? "parent-metro" : "state non-metro"} BLS OEWS
        </span>
        {" "}data — true per-county detailed-SOC employment isn&rsquo;t publicly
        published.{" "}
        <Link href="#methodology" className="text-[var(--accent-text)] hover:underline">
          Methodology
        </Link>
        .
      </p>
    </div>
  );
}

/* ---------- Shared primitives ---------- */

function Header({
  title,
  subtitle,
  aside,
}: {
  title: string;
  subtitle?: string;
  aside?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-lg font-bold text-heading leading-tight">{title}</h4>
        {aside && (
          <span className="text-2xs text-[var(--muted)] font-mono shrink-0">{aside}</span>
        )}
      </div>
      {subtitle && (
        <p className="text-2xs text-[var(--muted)] mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit?: string;
  color: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="font-mono text-xl font-bold" style={{ color }}>
          {value}
        </span>
        {unit && <span className="text-2xs text-[var(--muted)]">{unit}</span>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-2xs">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="font-mono text-[var(--foreground)]">{value}</dd>
    </div>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <ul className="space-y-1.5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="h-3 bg-black/[0.04] rounded-sm animate-pulse" />
      ))}
    </ul>
  );
}
