"use client";

import { type ScoredOccupation } from "@/lib/composite-risk";

interface Props {
  data: ScoredOccupation[];
}

export default function ComparisonTable({ data }: Props) {
  // Sort by divergence: |exposure rank - net risk rank|
  const withRanks = data
    .map((occ) => ({
      occ,
      exposure: occ.scores.technicalExposure,
      netRisk: occ.scores.netRisk,
    }))
    .sort((a, b) => b.exposure - a.exposure)
    .map((item, i) => ({ ...item, exposureRank: i + 1 }))
    .sort((a, b) => b.netRisk - a.netRisk)
    .map((item, i) => ({ ...item, riskRank: i + 1 }))
    .map((item) => ({
      ...item,
      divergence: item.exposureRank - item.riskRank,
    }))
    .sort((a, b) => Math.abs(b.divergence) - Math.abs(a.divergence));

  return (
    <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-strong">
            <th className="text-left py-2 pr-3 font-semibold text-[var(--muted)]">
              Occupation
            </th>
            <th className="text-right py-2 px-2 font-semibold text-[var(--muted)]">
              Workers
            </th>
            <th className="text-right py-2 px-2 font-semibold text-[var(--muted)]">
              Exposure
            </th>
            <th className="text-right py-2 px-2 font-semibold text-[var(--muted)]">
              Net Risk
            </th>
            <th className="text-right py-2 pl-2 font-semibold text-[var(--muted)]">
              Shift
            </th>
          </tr>
        </thead>
        <tbody>
          {withRanks.map(({ occ, divergence }) => {
            const arrow =
              divergence > 0
                ? { symbol: "\u2193", color: "#16A34A", label: "lower risk than exposure suggests" }
                : divergence < 0
                  ? { symbol: "\u2191", color: "#DC2626", label: "higher risk than exposure suggests" }
                  : { symbol: "=", color: "#6B7280", label: "aligned" };

            return (
              <tr
                key={occ.group.id}
                className="border-b border-black/[0.03] hover:bg-black/[0.01] transition-colors"
              >
                <td className="py-2 pr-3 font-medium text-[var(--foreground)]">
                  {occ.group.shortTitle}
                </td>
                <td
                  className="py-2 px-2 text-right text-[var(--muted)]"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {(occ.group.employment / 1000).toFixed(1)}M
                </td>
                <td className="py-2 px-2 text-right">
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      color:
                        occ.scores.technicalExposure > 6
                          ? "#DC2626"
                          : occ.scores.technicalExposure > 3
                            ? "#F59E0B"
                            : "#16A34A",
                    }}
                  >
                    {occ.scores.technicalExposure.toFixed(1)}
                  </span>
                </td>
                <td className="py-2 px-2 text-right">
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      color:
                        occ.scores.netRisk > 6
                          ? "#DC2626"
                          : occ.scores.netRisk > 4
                            ? "#F59E0B"
                            : "#16A34A",
                    }}
                  >
                    {occ.scores.netRisk.toFixed(1)}
                  </span>
                </td>
                <td className="py-2 pl-2 text-right">
                  <span
                    className="font-semibold"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      color: arrow.color,
                    }}
                    title={arrow.label}
                  >
                    {arrow.symbol}
                    {Math.abs(divergence)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-2xs text-[var(--muted)] mt-2">
        Shift = how many rank positions the occupation moves between
        exposure-only ranking and net-risk ranking. {"\u2193"} = net risk is
        lower than exposure suggests (absorption factors help). {"\u2191"} = net
        risk is higher (institutional factors add pressure).
      </p>
      <p className="text-2xs text-[var(--muted)] mt-1.5 leading-relaxed">
        Job dimensionality explains many of the largest shifts. High-dimensional
        occupations (management, consulting) rank lower in net risk than exposure
        suggests because partial automation triggers the O-Ring &ldquo;focus
        effect&rdquo; &mdash; workers concentrate on fewer tasks, raising quality
        on each. Low-dimensional occupations (transportation, production) rank
        higher because firms have stronger incentive to fully automate when few
        tasks remain.
      </p>
    </div>
  );
}
