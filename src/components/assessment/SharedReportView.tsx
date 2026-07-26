import type { PublicSharedReport } from "@/lib/assessment/public-report";
import { computeHeadline } from "@/lib/assessment/headline";
import { INDUSTRY_LABELS } from "@/lib/assessment/types";

const OPPORTUNITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

export default function SharedReportView({ data }: { data: PublicSharedReport }) {
  const { report } = data;
  const headline = computeHeadline(report);
  const profile = report.organizationProfile;

  const tasks = [...(report.taskAnalysis ?? [])].sort(
    (a, b) => OPPORTUNITY_ORDER[a.aiOpportunity] - OPPORTUNITY_ORDER[b.aiOpportunity]
  );

  const industryLabel =
    data.industry && INDUSTRY_LABELS[data.industry as keyof typeof INDUSTRY_LABELS];

  return (
    <article>
      <header>
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          AI action plan
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
          {data.organizationName}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {[industryLabel, data.jobTitle].filter(Boolean).join(" · ")}
        </p>
      </header>

      {headline && (
        <section className="mt-10 rounded-lg border border-neutral-200 bg-neutral-50 px-7 py-8">
          <p className="text-sm text-neutral-600">
            Routine work AI could take on, across this team
          </p>
          <p className="mt-3 text-5xl sm:text-6xl font-semibold tracking-tight text-neutral-900 tabular-nums">
            {headline.low}–{headline.high}
            <span className="ml-3 text-xl font-normal text-neutral-500">
              hours a week
            </span>
          </p>
          <p className="mt-4 text-sm text-neutral-500 leading-relaxed max-w-xl">
            {headline.qualifier}
          </p>
          {profile?.aiReadinessScore ? (
            <p className="mt-5 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
              AI readiness today:{" "}
              <span className="font-medium text-neutral-900 tabular-nums">
                {profile.aiReadinessScore}/10
              </span>
            </p>
          ) : null}
        </section>
      )}

      {report.executiveSummary && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-neutral-900">The short version</h2>
          <p className="mt-3 text-neutral-700 leading-relaxed">{report.executiveSummary}</p>
        </section>
      )}

      {report.quickWins && report.quickWins.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-neutral-900">Start here</h2>
          <ul className="mt-4 space-y-4">
            {report.quickWins.slice(0, 4).map((w, i) => (
              <li key={i} className="border-l-2 border-neutral-900 pl-4">
                <p className="font-medium text-neutral-900">{w.title}</p>
                <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                  {w.description}
                </p>
                {w.timeToImplement && (
                  <p className="mt-1.5 text-xs text-neutral-500">
                    About {w.timeToImplement} to set up
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {tasks.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-neutral-900">Task by task</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="pb-2 font-normal">Task</th>
                <th className="pb-2 font-normal">Opportunity</th>
                <th className="pb-2 font-normal text-right">Est. time saved</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 12).map((t, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="py-3 pr-4 text-neutral-900">{t.taskName}</td>
                  <td className="py-3 pr-4 text-neutral-600 capitalize">
                    {t.aiOpportunity}
                  </td>
                  <td className="py-3 text-right text-neutral-600 tabular-nums whitespace-nowrap">
                    {t.estimatedTimeSaved || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {report.humanCapabilities && report.humanCapabilities.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-neutral-900">
            What gets more valuable
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Skills that appreciate as AI absorbs the routine work above.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {report.humanCapabilities.slice(0, 8).map((c, i) => (
              <li
                key={i}
                className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700"
              >
                {c.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 text-xs text-neutral-500 leading-relaxed">
        Estimates are generated from a self-reported intake and are indicative, not
        measured. jobsdata.ai publishes the underlying labor-market evidence separately —
        see the prediction graphs for sourced, tiered data.
      </p>
    </article>
  );
}
