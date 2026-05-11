"use client";

import Link from "next/link";
import {
  formatJobs,
  prettyCategory,
  riskColor100,
} from "./types";

// Lightweight row types — shaped to whatever the explorer hands down.

export interface StateSidebarData {
  fips: string;
  abbr: string;
  title: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  weightedPctHighRiskTime: number;
  coverage: number;
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
}

export interface MsaSidebarData {
  cbsa: string;
  title: string;
  primState: string;
  type?: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  occupationCount: number;
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
  return <CountyPane data={props.data} loading={props.loading} />;
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
        occupations cover roughly half of metro employment; the rest are
        excluded (the score likely runs 1–3 points higher than full coverage
        would yield).
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

function CountyPane({ data, loading }: { data: CountySidebarData; loading?: boolean }) {
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

      {/* Honest framing: county score is composition-driven, not within-county. */}
      <div className="mt-3 rounded-md bg-amber-50 border border-amber-100 px-3 py-2 text-2xs text-amber-900 leading-snug">
        <span className="font-semibold">Composition-weighted, not county-specific.</span>{" "}
        This score reflects the share of jobs in occupation groups our model flags
        as more AI-exposed nationally. Within-group variation isn&rsquo;t visible at
        this level — ACS doesn&rsquo;t publish detailed SOC by county.
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

            <ul className="space-y-1.5">
              {top.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/occupation-exposure/${g.slug}`}
                    className="flex items-baseline justify-between gap-2 text-2xs hover:text-[var(--accent-text)] transition-colors"
                  >
                    <span className="inline-flex items-baseline gap-2 truncate">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-sm shrink-0"
                        style={{ background: riskColor100(g.netRisk100) }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{prettyCategory(g.slug)}</span>
                    </span>
                    <span className="font-mono text-[var(--muted)] shrink-0">
                      {g.share.toFixed(1)}% · {g.netRisk100}
                    </span>
                  </Link>
                </li>
              ))}
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

      <p className="text-2xs text-[var(--muted)] leading-relaxed border-t border-card pt-3 mt-4">
        Below MSA level, occupations are at SOC major-group granularity (Census ACS
        doesn&rsquo;t publish detailed SOC by county).{" "}
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
