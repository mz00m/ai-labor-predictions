"use client";

import { Fragment, useState } from "react";

const AGE_BANDS = [
  { band: "22\u201325", change: "\u221220%", changeColor: "text-[#ef4444]", weight: "12%", src: "direct" },
  { band: "26\u201330", change: "\u2248 0%", changeColor: "text-[#f59e0b]", weight: "22%", src: "direct" },
  { band: "31\u201334", change: "+6%", changeColor: "text-[#10b981]", weight: "20%", src: "interp." },
  { band: "35\u201349", change: "+9%", changeColor: "text-[#059669]", weight: "32%", src: "direct" },
  { band: "50+", change: "+5%", changeColor: "text-[#0d9488]", weight: "14%", src: "direct" },
] as const;

const DETAILS = [
  {
    label: "WHY NET \u2260 DISPLACEMENT",
    text: "The +1.3% nets senior growth against junior decline. Pure displacement (roles eliminated, not restructured) is ~3\u20134% of sector, concentrated in 22\u201325 band.",
  },
  {
    label: "CAUSAL ID",
    text: "Paper uses firm fixed-effects and health aides as control group. After controls, 22\u201325 cohort in AI-exposed jobs shows 16% relative decline. The 20% raw figure includes ~4pp from macro conditions (Fed hikes, post-pandemic correction).",
  },
  {
    label: "POPULATION WEIGHTS",
    text: "From BLS SOC 15-1252 (CPS Table 11b, 2024), Stack Overflow 2024 demographics, ACS PUMS via DataUSA. Median US software dev age \u2248 33\u201334.",
  },
  {
    label: "MECHANISM",
    text: "Primary channel is evaporated entry points (hiring freeze), not mass layoffs. Firms stopped creating junior roles; senior devs absorb that work with AI tools. Corroborated by Handshake (\u221230% tech internships), SignalFire (\u221225% entry-level tech hiring).",
  },
  {
    label: "PLOT RECOMMENDATION",
    text: "On tech-sector-displacement: OVERLAY, direction UP. Unit mismatch prevents data_point classification \u2014 age-stratified employment change \u2260 % of sector jobs displaced.",
  },
] as const;

export default function AgeWeightedMethodology() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="max-w-lg">
      <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)] shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--accent-light)] border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-[11px] font-semibold tracking-wide text-[var(--accent)]">
              AGE-WEIGHTED DISPLACEMENT METHOD
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] font-mono font-medium text-[var(--accent)] bg-[var(--accent)]/[0.08] border border-[var(--accent)]/20 rounded px-2 py-0.5 hover:bg-[var(--accent)]/[0.14]"
          >
            {expanded ? "collapse" : "expand"}
          </button>
        </div>

        {/* Summary */}
        <div className="px-3.5 py-3">
          <p className="text-[12px] text-[var(--muted)] leading-relaxed">
            Sector-wide estimate derived by weighting age-band employment
            changes by each band&apos;s share of the software developer workforce.
            Source data from{" "}
            <span className="text-[var(--accent)] font-medium">
              Brynjolfsson, Chandar &amp; Chen (2025)
            </span>{" "}
            using ADP payroll microdata, Oct 2022 &ndash; Jul 2025.
          </p>

          {/* Age band table */}
          <div className="mt-3 grid grid-cols-[auto_1fr_auto_auto] gap-x-3 gap-y-0.5 font-mono text-[10.5px] leading-7">
            <span className="text-[var(--muted)] font-medium">Band</span>
            <span className="text-[var(--muted)] font-medium">&Delta; Emp</span>
            <span className="text-[var(--muted)] font-medium">Wt</span>
            <span className="text-[var(--muted)] font-medium">Src</span>
            {AGE_BANDS.map((row) => (
              <Fragment key={row.band}>
                <span className={row.changeColor}>{row.band}</span>
                <span className={row.changeColor}>{row.change}</span>
                <span className="text-[var(--muted)]">{row.weight}</span>
                <span className="text-[var(--muted)] opacity-60">{row.src}</span>
              </Fragment>
            ))}
          </div>

          {/* Result */}
          <div className="mt-3 flex items-center justify-between bg-[var(--accent-light)] rounded-md px-3 py-1.5">
            <span className="font-mono text-[10.5px] text-[var(--muted)]">
              Weighted sector net &rarr;
            </span>
            <span className="font-mono text-[13px] font-semibold text-[var(--accent)]">
              +1.3%{" "}
              <span className="text-[10px] text-[var(--muted)] font-normal">
                (&minus;1.5% to +4.5%)
              </span>
            </span>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="px-3.5 pb-3.5 border-t border-[var(--border)]">
            {DETAILS.map((item) => (
              <div key={item.label} className="mt-3">
                <p className="font-mono text-[9.5px] font-semibold tracking-widest text-[var(--accent)] mb-0.5">
                  {item.label}
                </p>
                <p className="text-[11.5px] text-[var(--muted)] leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
            {/* Source footer */}
            <p className="mt-4 pt-2 border-t border-[var(--border)] text-[9.5px] text-[var(--muted)] opacity-60 leading-snug">
              Brynjolfsson, Chandar &amp; Chen (2025) &ldquo;Canaries in the Coal Mine?&rdquo;
              Stanford DEL / ADP Research. Corroborating: Westby &amp; Modestino
              (2025), BLS OOH 2024, IEEE Spectrum, Stack Overflow 2025.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
