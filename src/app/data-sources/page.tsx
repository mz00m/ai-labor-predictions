import Link from "next/link";
import type { Metadata } from "next";
import recurringData from "@/data/recurring-sources.json";

export const metadata: Metadata = {
  title: "Data Feeds — jobsdata.ai",
  description:
    "The recurring research releases jobsdata.ai tracks — Census BTOS, BLS Jobs Report, FactSet earnings calls, Stanford DEL, PwC Barometer, Anthropic Economic Index, and more. Grouped by release cadence with links to each source.",
};

interface RecurringSeries {
  id: string;
  name: string;
  publisher: string;
  tier: 1 | 2 | 3 | 4;
  cadence: string;
  cadenceLabel: string;
  releasePattern: string;
  url: string;
  targetGraphs: string[];
  topicLine: string;
  whatItMeasures: string;
  whyItMatters: string;
  lastIngested: { sourceId: string; date: string; value: string };
  nextExpected: string;
}

type RegistryData = { asOf: string; lastSweep: string; series: RecurringSeries[] };
const data = recurringData as unknown as RegistryData;

const CADENCE_ORDER = [
  "biweekly",
  "monthly",
  "quarterly",
  "annual",
  "biennial",
  "continuous",
] as const;

const CADENCE_LABELS: Record<string, string> = {
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual",
  biennial: "Every 2 years",
  continuous: "Continuous / rolling",
};

const TIER_LABELS: Record<number, string> = {
  1: "Verified Data & Research",
  2: "Institutional Analysis",
  3: "Journalism & Commentary",
  4: "Informal & Social",
};

const TIER_COLORS: Record<number, string> = {
  1: "bg-indigo-100 text-indigo-800",
  2: "bg-emerald-100 text-emerald-800",
  3: "bg-amber-100 text-amber-800",
  4: "bg-slate-100 text-slate-700",
};

function daysAgo(iso: string): number {
  const then = new Date(iso).getTime();
  return Math.round((Date.now() - then) / 86_400_000);
}

function freshnessLabel(iso: string, cadence: string): { text: string; color: string } {
  const age = daysAgo(iso);
  const threshold: Record<string, number> = {
    biweekly: 30,
    monthly: 60,
    quarterly: 120,
    annual: 400,
    biennial: 800,
    continuous: 120,
  };
  const okBy = threshold[cadence] ?? 120;
  if (age < okBy * 0.6) return { text: `${age}d ago`, color: "text-emerald-700 bg-emerald-50" };
  if (age < okBy) return { text: `${age}d ago`, color: "text-amber-700 bg-amber-50" };
  return { text: `${age}d ago — due`, color: "text-red-700 bg-red-50" };
}

function SeriesCard({ s }: { s: RecurringSeries }) {
  const fresh = freshnessLabel(s.lastIngested.date, s.cadence);
  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-white hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`inline-block text-2xs font-medium px-1.5 py-0.5 rounded ${TIER_COLORS[s.tier]}`}
            >
              Tier {s.tier}
            </span>
            <span className="text-2xs text-slate-500 uppercase tracking-wide">
              {s.publisher}
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 leading-snug">{s.name}</h3>
        </div>
        <span
          className={`shrink-0 text-2xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${fresh.color}`}
        >
          {fresh.text}
        </span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed mt-2">{s.topicLine}</p>

      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
        <div>
          <span className="font-medium text-slate-500">What it measures: </span>
          {s.whatItMeasures}
        </div>
        <div>
          <span className="font-medium text-slate-500">Why it matters: </span>
          {s.whyItMatters}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between gap-2 text-xs">
        <div>
          <span className="text-slate-500">Latest: </span>
          <span className="font-medium text-slate-800">{s.lastIngested.date}</span>
          <span className="text-slate-500"> — {s.lastIngested.value}</span>
        </div>
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-2 text-xs">
        <div>
          <span className="text-slate-500">Next expected: </span>
          <span className="text-slate-700">{s.nextExpected}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-2xs">
        <span className="text-slate-500">Feeds:</span>
        {s.targetGraphs.map((g) => (
          <Link
            key={g}
            href={`/predictions/${g}`}
            className="text-indigo-700 hover:underline"
          >
            {g}
          </Link>
        ))}
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-slate-600 hover:text-slate-900 hover:underline"
        >
          Visit source →
        </a>
      </div>
    </div>
  );
}

export default function DataSourcesPage() {
  const grouped = new Map<string, RecurringSeries[]>();
  for (const c of CADENCE_ORDER) grouped.set(c, []);
  for (const s of data.series) {
    (grouped.get(s.cadence) ?? []).push(s);
  }

  const total = data.series.length;
  const tier1 = data.series.filter((s) => s.tier === 1).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="border-b border-slate-200 pb-6">
        <p className="text-2xs font-bold uppercase tracking-widest text-indigo-700 mb-2">
          Live data feeds
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          The recurring research releases we track
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          jobsdata.ai&apos;s prediction graphs are updated as {total} recurring data sources release new
          waves — {tier1} of them Tier 1 government or peer-reviewed. This page lists every series,
          when it&apos;s due next, and what it feeds.
        </p>
        <p className="text-xs text-slate-500 mt-3">
          Last audit: <span className="font-medium">{data.lastSweep}</span> ·{" "}
          <Link href="/research" className="underline hover:text-slate-900">
            One-time sources
          </Link>{" "}
          ·{" "}
          <Link href="/methodology" className="underline hover:text-slate-900">
            Methodology
          </Link>
        </p>
      </div>

      {/* Freshness legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-500">Freshness:</span>
        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">Fresh</span>
        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">OK</span>
        <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-medium">Due</span>
        <span className="text-slate-500">
          — thresholds scale with each series&apos;s cadence.
        </span>
      </div>

      {/* Cadence sections */}
      {CADENCE_ORDER.map((c) => {
        const seriesInGroup = grouped.get(c) ?? [];
        if (seriesInGroup.length === 0) return null;
        return (
          <section key={c}>
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {CADENCE_LABELS[c]}
              </h2>
              <span className="text-xs text-slate-500">{seriesInGroup.length} series</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {seriesInGroup.map((s) => (
                <SeriesCard key={s.id} s={s} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Tier legend */}
      <div className="border-t border-slate-200 pt-6 text-xs text-slate-600">
        <p className="font-medium text-slate-700 mb-2">Evidence tiers</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span
                className={`inline-block text-2xs font-medium px-1.5 py-0.5 rounded ${TIER_COLORS[t]}`}
              >
                Tier {t}
              </span>
              <span className="text-slate-600">{TIER_LABELS[t]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
