"use client";

import { useState } from "react";

const AGE_BANDS = [
  { band: "22\u201325", change: -20, label: "\u221220%", color: "#ef4444", weight: "12%", src: "direct", detail: "Near-zero hiring + AI tool substitution" },
  { band: "26\u201330", change: 0, label: "\u2248 0%", color: "#f59e0b", weight: "22%", src: "direct", detail: "Flat: caught between junior freeze and senior growth" },
  { band: "31\u201334", change: 6, label: "+6%", color: "#10b981", weight: "20%", src: "interp.", detail: "Benefiting from AI augmentation, still hiring" },
  { band: "35\u201349", change: 9, label: "+9%", color: "#059669", weight: "32%", src: "direct", detail: "Peak beneficiaries: experience + AI tools compound" },
  { band: "50+", change: 5, label: "+5%", color: "#0d9488", weight: "14%", src: "direct", detail: "Stable, moderate AI adoption" },
] as const;

const CORROBORATING = [
  { signal: "Tech internship postings", change: "\u221230%", source: "Handshake 2025" },
  { signal: "Entry-level tech hiring", change: "\u221225%", source: "SignalFire 2025" },
  { signal: "CS grad unemployment", change: "7.2% vs 4.5%", source: "ACS 2024" },
  { signal: "CompTIA IT unemployment", change: "3.9% \u2192 5.7%", source: "CompTIA 2025" },
  { signal: "Dutch youth GenAI-job employment", change: "\u221213%", source: "ESB/Rabobank 2026" },
] as const;

const DETAILS = [
  {
    label: "WHY THE AVERAGE IS MISLEADING",
    text: "The +1.3% sector-wide figure is a weighted average across all age bands. It is technically correct but practically misleading: a 22-year-old entering tech faces a fundamentally different labor market than a 38-year-old already in it. Policy and career decisions based on the average will be wrong for most individuals.",
  },
  {
    label: "CAUSAL IDENTIFICATION",
    text: "Brynjolfsson, Chandar & Chen use firm fixed-effects and health aides as a control group. After controls, the 22\u201325 cohort in AI-exposed jobs shows a 16% relative decline. The raw 20% figure includes ~4pp from macro conditions (Fed rate hikes, post-pandemic correction). The AI-specific effect is still large: roughly 4x the macro contribution.",
  },
  {
    label: "THE MECHANISM: EVAPORATED ENTRY POINTS",
    text: "This is not a story about mass layoffs. Firms stopped creating junior roles because senior developers, armed with Copilot, Cursor, Claude, can now absorb routine tasks that previously went to juniors. The traditional career ladder (learn by doing grunt work, get promoted) is being compressed. Junior hiring is a lagging indicator of how firms value human learning vs. AI output.",
  },
  {
    label: "POPULATION WEIGHTS",
    text: "From BLS SOC 15-1252 (CPS Table 11b, 2024), Stack Overflow 2024 demographics, ACS PUMS via DataUSA. Median US software dev age \u2248 33\u201334. The 22\u201325 band is 12% of the workforce but absorbs the majority of displacement.",
  },
  {
    label: "WHO BENEFITS",
    text: "Experienced developers (35-49) are seeing the strongest growth. AI tools amplify domain knowledge and judgment, exactly what senior engineers have. The productivity literature (Copilot RCT: +55.8% speed, Microsoft/Accenture: +26% PRs) mostly measures experienced developer gains. Early evidence suggests juniors benefit less from AI tools because effective use requires knowing what good code looks like.",
  },
] as const;

// Max absolute value for bar scaling
const MAX_ABS = 20;

export default function AgeWeightedMethodology() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="max-w-2xl">
      <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)] shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-signal-negative/[0.06] border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-signal-negative" />
            <span className="font-mono text-xs font-semibold tracking-wide text-signal-negative">
              K-SHAPED DISPLACEMENT: THE AVERAGE HIDES THE STORY
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-2xs font-mono font-medium text-[var(--accent)] bg-[var(--accent)]/[0.08] border border-[var(--accent)]/20 rounded px-2 py-0.5 hover:bg-[var(--accent)]/[0.14]"
          >
            {expanded ? "collapse" : "expand"}
          </button>
        </div>

        {/* TL;DR box */}
        <div className="mx-4 mt-4 rounded-xl border border-[#6366F1]/20 bg-accent/[0.04] p-4">
          <h4 className="text-base font-bold text-accent uppercase tracking-wide mb-2">
            TL;DR
          </h4>
          <p className="text-base text-[var(--foreground)] leading-relaxed">
            The sector-wide +1.3% average hides a K-shaped split: workers 22-25 face <strong>-20%
            employment decline</strong> while workers 35-49 see <strong>+9% growth</strong>. AI tools
            amplify experience, so senior workers benefit while entry-level hiring evaporates. The
            average is technically correct but practically misleading for any individual.
          </p>
        </div>

        {/* Summary */}
        <div className="px-4 py-4">
          <p className="text-base text-[var(--muted)] leading-relaxed">
            The sector-wide +1.3% average is real but misleading.
            When broken down by age, the tech labor market reveals a sharp
            K-shape: early-career workers face steep decline while
            experienced workers are growing.
          </p>

          {/* Visual bar chart */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center text-2xs font-mono text-[var(--muted)] mb-1">
              <span className="w-14">Age</span>
              <span className="flex-1 text-center opacity-50">Employment change since late 2022</span>
              <span className="w-10 text-right">Weight</span>
            </div>
            {AGE_BANDS.map((row) => {
              const barWidth = Math.abs(row.change) / MAX_ABS * 100;
              const isNegative = row.change < 0;
              const isZero = row.change === 0;

              return (
                <div key={row.band} className="flex items-center gap-0">
                  <span
                    className="w-14 font-mono text-sm font-semibold shrink-0"
                    style={{ color: row.color }}
                  >
                    {row.band}
                  </span>
                  <div className="flex-1 flex items-center h-7">
                    {/* Left half (negative) */}
                    <div className="w-1/2 flex justify-end pr-0.5">
                      {isNegative && (
                        <div
                          className="h-5 rounded-l-sm flex items-center justify-end pr-1.5"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: row.color,
                            opacity: 0.85,
                          }}
                        >
                          <span className="text-2xs font-mono font-bold text-white whitespace-nowrap">
                            {row.label}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Center line */}
                    <div className="w-px h-7 bg-[var(--muted)] opacity-30 shrink-0" />
                    {/* Right half (positive) */}
                    <div className="w-1/2 flex justify-start pl-0.5">
                      {!isNegative && !isZero && (
                        <div
                          className="h-5 rounded-r-sm flex items-center pl-1.5"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: row.color,
                            opacity: 0.85,
                          }}
                        >
                          <span className="text-2xs font-mono font-bold text-white whitespace-nowrap">
                            {row.label}
                          </span>
                        </div>
                      )}
                      {isZero && (
                        <span className="text-2xs font-mono font-bold pl-1.5" style={{ color: row.color }}>
                          {row.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="w-10 text-right font-mono text-2xs text-[var(--muted)] shrink-0">
                    {row.weight}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Result */}
          <div className="mt-4 flex items-center justify-between bg-[var(--accent-light)] rounded-md px-3 py-2">
            <span className="font-mono text-xs text-[var(--muted)]">
              Weighted sector net &rarr;
            </span>
            <span className="font-mono text-base font-semibold text-[var(--accent)]">
              +1.3%{" "}
              <span className="text-2xs text-[var(--muted)] font-normal">
                (&minus;1.5% to +4.5%)
              </span>
            </span>
          </div>

          {/* Corroborating signals */}
          <div className="mt-4">
            <p className="font-mono text-2xs font-semibold tracking-widest text-[var(--muted)] mb-2">
              CORROBORATING SIGNALS FOR EARLY-CAREER IMPACT
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {CORROBORATING.map((s) => (
                <div key={s.signal} className="flex items-baseline gap-1.5">
                  <span className="text-xs font-mono font-semibold text-signal-negative">{s.change}</span>
                  <span className="text-[10.5px] text-[var(--muted)]">{s.signal}</span>
                  <span className="text-[9px] text-[var(--muted)] opacity-50">({s.source})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="px-4 pb-4 border-t border-[var(--border)]">
            {DETAILS.map((item) => (
              <div key={item.label} className="mt-4">
                <p className="font-mono text-[9.5px] font-semibold tracking-widest text-[var(--accent)] mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}

            {/* Age-band detail table */}
            <div className="mt-5">
              <p className="font-mono text-[9.5px] font-semibold tracking-widest text-[var(--accent)] mb-2">
                BAND-LEVEL DETAIL
              </p>
              <div className="space-y-1.5">
                {AGE_BANDS.map((row) => (
                  <div key={row.band} className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-semibold w-12" style={{ color: row.color }}>
                      {row.band}
                    </span>
                    <span className="text-xs text-[var(--muted)]">{row.detail}</span>
                    <span className="text-[9px] text-[var(--muted)] opacity-40 ml-auto shrink-0">
                      {row.src}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source footer */}
            <p className="mt-5 pt-3 border-t border-[var(--border)] text-2xs text-[var(--muted)] opacity-60 leading-relaxed">
              Primary: Brynjolfsson, Chandar &amp; Chen (2025) &ldquo;Canaries in the Coal Mine?&rdquo;
              Stanford DEL / ADP Research. Corroborating: Dallas Fed (2026), Goldman Sachs (2025),
              CompTIA (2025), Handshake, SignalFire, BLS OOH 2024, ACS via Preston Cooper,
              ESB/Rabobank (2026, Netherlands).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
