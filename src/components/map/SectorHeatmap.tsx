import Link from "next/link";
import {
  SectorAggregate,
  formatJobs,
  riskColor,
} from "./types";

interface Props {
  sectors: SectorAggregate[];
  totalJobs: number;
  /** Optional override — defaults to "Where the exposed employment sits". */
  scopeTitle?: string;
  /** Optional override for the descriptive subtitle. */
  scopeSubtitle?: string;
}

export default function SectorHeatmap({
  sectors,
  totalJobs,
  scopeTitle,
  scopeSubtitle,
}: Props) {
  // Sectors are expected sorted by weightedNetRisk desc by the page.
  const maxJobs = sectors.reduce((m, s) => Math.max(m, s.totalJobs), 0);

  return (
    <section className="mb-20">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] opacity-60 mb-2">
          Sector makeup
        </p>
        <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-2">
          {scopeTitle ?? "Where the exposed employment sits"}
        </h2>
        <p className="text-md text-[var(--muted)] leading-relaxed max-w-2xl">
          {scopeSubtitle ??
            "Each row is one BLS major occupational group, sorted by employment-weighted net risk. The stacked bar shows the share of working time inside that sector spent on tasks scored high, medium, or low risk."}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-xs text-[var(--muted)]">
        <Legend swatch="#DC2626" label="High-risk time" />
        <Legend swatch="#F59E0B" label="Medium-risk time" />
        <Legend swatch="#16A34A" label="Low-risk time" />
        <span className="opacity-50">|</span>
        <span>Total covered: {formatJobs(totalJobs)} workers</span>
      </div>

      {/* What "time-share" means, since the column header is terse */}
      <p className="text-2xs text-[var(--muted)] leading-relaxed max-w-2xl mb-3 -mt-2">
        <strong className="text-[var(--foreground)] font-semibold">Time-share by risk bucket</strong> means:
        for an average worker in this sector, what share of their working hours
        is spent on tasks our model rates high (red), medium (amber), or low
        (green) risk. A sector where most hours are red is a sector where AI
        already overlaps with most of the day&rsquo;s work.
      </p>

      {/* Header row */}
      <div className="hidden sm:grid grid-cols-[1.8fr_0.7fr_0.6fr_1.6fr] gap-4 px-3 pb-2 text-2xs font-bold uppercase tracking-widest text-[var(--muted)] opacity-70 border-b border-strong">
        <div>Sector</div>
        <div className="text-right">Employment</div>
        <div className="text-right">Risk (0&ndash;100)</div>
        <div>Time-share by risk bucket</div>
      </div>

      <ul className="divide-y divide-black/[0.04] border-b border-strong">
        {sectors.map((s) => (
          <SectorRow key={s.category} sector={s} maxJobs={maxJobs} />
        ))}
      </ul>
    </section>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block w-2.5 h-2.5 rounded-sm"
        style={{ background: swatch }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function SectorRow({ sector, maxJobs }: { sector: SectorAggregate; maxJobs: number }) {
  const risk = sector.weightedNetRisk;
  const color = riskColor(risk);
  const employmentPct = maxJobs > 0 ? (sector.totalJobs / maxJobs) * 100 : 0;

  // Stacked bar segments — guard against rounding gaps
  const hi = Math.max(0, sector.pctHighRiskTime);
  const md = Math.max(0, sector.pctMediumRiskTime);
  const lo = Math.max(0, 100 - hi - md);

  return (
    <li className="group">
      <div className="grid grid-cols-1 sm:grid-cols-[1.8fr_0.7fr_0.6fr_1.6fr] gap-2 sm:gap-4 items-center px-3 py-3 hover:bg-black/[0.012] transition-colors">
        {/* Sector label */}
        <div className="min-w-0">
          <div className="text-base font-semibold text-[var(--foreground)] truncate">
            {sector.label}
          </div>
          <div className="text-xs text-[var(--muted)]">
            {sector.occupationCount} occupations
          </div>
        </div>

        {/* Employment bar */}
        <div className="sm:text-right">
          <div
            className="text-sm font-medium text-[var(--foreground)] tabular-nums"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {formatJobs(sector.totalJobs)}
          </div>
          <div className="mt-1 h-1 bg-black/[0.05] rounded-sm overflow-hidden sm:max-w-[120px] sm:ml-auto">
            <div
              className="h-full"
              style={{ width: `${employmentPct}%`, background: "#1a1a1a", opacity: 0.35 }}
            />
          </div>
        </div>

        {/* Risk chip */}
        <div className="sm:text-right">
          <span
            className="inline-flex items-center justify-center min-w-[44px] px-2 py-1 rounded text-xs font-bold tabular-nums"
            style={{
              background: color,
              color: "#fff",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.02em",
            }}
            title={`Employment-weighted net risk ${sector.weightedNetRisk100}/100`}
          >
            {sector.weightedNetRisk100}
          </span>
        </div>

        {/* Stacked stripe */}
        <div>
          <div
            className="relative h-3.5 w-full rounded-sm overflow-hidden bg-black/[0.04]"
            aria-label={`Time share: ${Math.round(hi)}% high, ${Math.round(md)}% medium, ${Math.round(lo)}% low`}
          >
            {hi > 0 && (
              <div
                className="absolute top-0 left-0 h-full"
                style={{ width: `${hi}%`, background: "#DC2626" }}
              />
            )}
            {md > 0 && (
              <div
                className="absolute top-0 h-full"
                style={{ left: `${hi}%`, width: `${md}%`, background: "#F59E0B" }}
              />
            )}
            {lo > 0 && (
              <div
                className="absolute top-0 h-full"
                style={{ left: `${hi + md}%`, width: `${lo}%`, background: "#16A34A" }}
              />
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-2xs text-[var(--muted)] tabular-nums">
            <span>{Math.round(hi)}% high</span>
            <span>{Math.round(md)}% med</span>
            <span>{Math.round(lo)}% low</span>
          </div>
        </div>
      </div>

      {/* Top-3 occupations strip */}
      {sector.topRisk.length > 0 && (
        <div className="px-3 pb-3 -mt-1 pl-3 sm:pl-[calc(0%+0px)]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)] sm:ml-0">
            <span className="opacity-60 uppercase tracking-wider text-2xs font-semibold">
              Top risk:
            </span>
            {sector.topRisk.map((occ, i) => (
              <span key={occ.slug} className="inline-flex items-center gap-1.5">
                <Link
                  href={`/occupation-exposure/${occ.slug}`}
                  className="text-[var(--foreground)] hover:text-[var(--accent-text)] transition-colors"
                >
                  {occ.title}
                </Link>
                <span
                  className="tabular-nums opacity-70"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {Math.round(occ.netRisk * 10)}
                </span>
                {i < sector.topRisk.length - 1 && (
                  <span className="opacity-30">&middot;</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
