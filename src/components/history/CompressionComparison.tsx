"use client";

const MAX_YEARS = 90;

interface Transition {
  id: string;
  name: string;
  period: string;
  totalYears: number;
  totalYearsHigh?: number; // for AI range
  painfulYears: number;
  painfulYearsHigh?: number; // for AI range
  painfulLabel: string;
  color: string;
  colorLight: string;
  source: string;
  isProjection?: boolean;
}

const TRANSITIONS: Transition[] = [
  {
    id: "steam",
    name: "Steam Power",
    period: "1760–1850",
    totalYears: 90,
    painfulYears: 60,
    painfulLabel: "Engel's Pause — 60 yrs of wage stagnation",
    color: "#d97706",
    colorLight: "#fef3c7",
    source: "Allen (2009)",
  },
  {
    id: "combustion",
    name: "Internal Combustion",
    period: "1880–1940",
    totalYears: 60,
    painfulYears: 20,
    painfulLabel: "20 yrs of interwar structural unemployment",
    color: "#059669",
    colorLight: "#d1fae5",
    source: "Gordon (2016)",
  },
  {
    id: "electricity",
    name: "Electrification",
    period: "1880–1930",
    totalYears: 50,
    painfulYears: 40,
    painfulLabel: "David's Productivity Paradox — 40 yrs to show gains",
    color: "#2563eb",
    colorLight: "#dbeafe",
    source: "David (1990)",
  },
  {
    id: "computers",
    name: "Digital Computers",
    period: "1960–2000",
    totalYears: 40,
    painfulYears: 40,
    painfulLabel: "40 yrs of wage polarization for non-degree workers",
    color: "#7c3aed",
    colorLight: "#ede9fe",
    source: "Autor et al. (2003)",
  },
  {
    id: "ai",
    name: "AI / LLMs",
    period: "2012–projected",
    totalYears: 7,
    totalYearsHigh: 15,
    painfulYears: 4,
    painfulYearsHigh: 10,
    painfulLabel: "Projected: 4–10 yrs of displacement + reorganization",
    color: "#5C61F6",
    colorLight: "#eef0ff",
    source: "McKinsey, St. Louis Fed, Microsoft",
    isProjection: true,
  },
];

function barPct(years: number) {
  return (years / MAX_YEARS) * 100;
}

export default function CompressionComparison() {
  return (
    <div className="mt-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[var(--accent)] px-2.5 py-1 rounded-full">
            10x faster
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)]">
            Historical Compression
          </span>
        </div>
        <p className="text-[13px] text-[var(--foreground)] leading-relaxed font-semibold mb-1">
          Full transition duration by technology &mdash; from emergence to new equilibrium.
        </p>
        <p className="text-[12px] text-[var(--muted)]">
          Darker shading shows the displacement &amp; reorganization phase &mdash; the painful part.
        </p>
      </div>

      {/* === Desktop bars === */}
      <div className="hidden md:block space-y-2.5">
        {TRANSITIONS.map((t) => {
          const totalPct = barPct(t.totalYearsHigh ?? t.totalYears);
          const lowPct = t.totalYearsHigh ? barPct(t.totalYears) : totalPct;
          const painfulRatio =
            (t.painfulYears / (t.totalYearsHigh ?? t.totalYears)) * 100;

          return (
            <div key={t.id} className="flex items-center gap-3">
              {/* Label column */}
              <div className="w-[150px] shrink-0 text-right pr-2">
                <div className="text-[13px] font-semibold text-[var(--foreground)] leading-tight">
                  {t.name}
                </div>
                <div className="text-[10px] text-[var(--muted)] leading-tight">
                  {t.period}
                </div>
              </div>

              {/* Bar column */}
              <div className="flex-1 relative h-9">
                {/* High-range extension (AI only) */}
                {t.isProjection && t.totalYearsHigh && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-md"
                    style={{
                      width: `${totalPct}%`,
                      backgroundColor: t.colorLight,
                      border: `1.5px dashed ${t.color}`,
                      opacity: 0.6,
                    }}
                  />
                )}

                {/* Main bar */}
                <div
                  className="absolute inset-y-0 left-0 rounded-md overflow-hidden"
                  style={{
                    width: `${t.isProjection ? lowPct : totalPct}%`,
                    backgroundColor: t.colorLight,
                    border: t.isProjection
                      ? `1.5px dashed ${t.color}`
                      : undefined,
                  }}
                >
                  {/* Painful phase sub-bar */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-l-md"
                    style={{
                      width: `${painfulRatio}%`,
                      backgroundColor: t.color,
                      opacity: t.isProjection ? 0.7 : 0.8,
                      backgroundImage: t.isProjection
                        ? "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 6px)"
                        : undefined,
                    }}
                  />
                </div>

                {/* Painful label tooltip on hover — shown as subtle text */}
                <div
                  className="absolute inset-y-0 flex items-center text-[10px] text-[var(--muted)] italic whitespace-nowrap"
                  style={{
                    left: `${totalPct + 1}%`,
                  }}
                >
                  {t.painfulLabel}
                </div>
              </div>

              {/* Year label */}
              <div className="w-[70px] shrink-0 text-right">
                <span
                  className="text-[15px] font-bold"
                  style={{
                    color: t.color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {t.totalYearsHigh
                    ? `${t.totalYears}–${t.totalYearsHigh}`
                    : t.totalYears}
                </span>
                <span className="text-[11px] text-[var(--muted)] ml-0.5">
                  yrs
                </span>
              </div>
            </div>
          );
        })}

        {/* Scale axis */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-[150px] shrink-0" />
          <div className="flex-1 relative h-4">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((yr) => (
              <div
                key={yr}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${barPct(yr)}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="w-px h-2 bg-black/[0.1]" />
                <span className="text-[9px] text-[var(--muted)]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {yr}
                </span>
              </div>
            ))}
          </div>
          <div className="w-[70px] shrink-0" />
        </div>

        {/* Source line */}
        <div className="flex items-center gap-3">
          <div className="w-[150px] shrink-0" />
          <p className="text-[10px] text-[var(--muted)] italic">
            Sources: {TRANSITIONS.map((t) => t.source).join("; ")}
          </p>
        </div>
      </div>

      {/* === Mobile bars === */}
      <div className="md:hidden space-y-3">
        {TRANSITIONS.map((t) => {
          const totalPct = barPct(t.totalYearsHigh ?? t.totalYears);
          const lowPct = t.totalYearsHigh ? barPct(t.totalYears) : totalPct;
          const painfulRatio =
            (t.painfulYears / (t.totalYearsHigh ?? t.totalYears)) * 100;

          return (
            <div key={t.id}>
              {/* Label row */}
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-[12px] font-semibold text-[var(--foreground)]">
                    {t.name}
                  </span>
                  <span className="text-[10px] text-[var(--muted)] ml-1.5">
                    {t.period}
                  </span>
                </div>
                <span
                  className="text-[14px] font-bold"
                  style={{
                    color: t.color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {t.totalYearsHigh
                    ? `${t.totalYears}–${t.totalYearsHigh}`
                    : t.totalYears}{" "}
                  <span className="text-[10px] text-[var(--muted)] font-normal">
                    yrs
                  </span>
                </span>
              </div>

              {/* Bar */}
              <div className="relative h-7">
                {/* High-range extension (AI only) */}
                {t.isProjection && t.totalYearsHigh && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-md"
                    style={{
                      width: `${totalPct}%`,
                      backgroundColor: t.colorLight,
                      border: `1.5px dashed ${t.color}`,
                      opacity: 0.6,
                    }}
                  />
                )}

                <div
                  className="absolute inset-y-0 left-0 rounded-md overflow-hidden"
                  style={{
                    width: `${t.isProjection ? lowPct : totalPct}%`,
                    backgroundColor: t.colorLight,
                    border: t.isProjection
                      ? `1.5px dashed ${t.color}`
                      : undefined,
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-l-md"
                    style={{
                      width: `${painfulRatio}%`,
                      backgroundColor: t.color,
                      opacity: t.isProjection ? 0.7 : 0.8,
                      backgroundImage: t.isProjection
                        ? "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 6px)"
                        : undefined,
                    }}
                  />
                </div>
              </div>

              {/* Painful phase label */}
              <p className="text-[10px] text-[var(--muted)] italic mt-0.5">
                {t.painfulLabel}
              </p>
            </div>
          );
        })}
      </div>

      {/* === Key metrics row === */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-black/[0.06] rounded-lg p-4 text-center">
          <div
            className="text-[28px] font-extrabold text-[var(--accent)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            10x
          </div>
          <div className="text-[12px] font-semibold text-[var(--foreground)] mt-1">
            Faster Diffusion
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
            ChatGPT: 100M users in 2 months
            <br />
            Internet: 7 yrs &middot; PC: 10+ yrs
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-1 italic">
            McKinsey; Microsoft AI Diffusion Report
          </div>
        </div>

        <div className="border border-black/[0.06] rounded-lg p-4 text-center">
          <div
            className="text-[28px] font-extrabold"
            style={{ color: "#F66B5C", fontVariantNumeric: "tabular-nums" }}
          >
            4–10
          </div>
          <div className="text-[12px] font-semibold text-[var(--foreground)] mt-1">
            Years &mdash; Projected Painful Phase
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
            Displacement + reorganization
            <br />
            vs. 20–60 yrs historically
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-1 italic">
            Extrapolated from adoption speed
          </div>
        </div>

        <div className="border border-black/[0.06] rounded-lg p-4 text-center">
          <div
            className="text-[28px] font-extrabold text-[var(--foreground)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            54.6%
          </div>
          <div className="text-[12px] font-semibold text-[var(--foreground)] mt-1">
            Adult Adoption by Year 3
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
            US working-age adults using gen AI
            <br />
            Internet took 5+ yrs for same reach
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-1 italic">
            St. Louis Fed (2025)
          </div>
        </div>
      </div>

      {/* === Caveat footnote === */}
      <div className="border-l-2 border-black/[0.08] pl-4 py-1">
        <p className="text-[12px] text-[var(--foreground)]/70 leading-relaxed italic">
          These projections extrapolate from adoption speed. If the
          diffusion phase that historically took 10&ndash;25 years is
          happening in 1&ndash;3, the displacement and reorganization
          phases may compress as well &mdash; though prior GPTs show
          that adoption speed does not reliably predict impact speed.
          The internet reached 50% of households by 2000 but
          didn&rsquo;t show clear labor market effects for another
          decade. Organizational restructuring, education systems, and
          policy still operate at human speed.{" "}
          <a
            href="/predictions/genai-work-adoption"
            className="text-[var(--accent)] underline underline-offset-2 font-medium not-italic"
          >
            See live adoption data &rarr;
          </a>{" "}
          <a
            href="/predictions/ai-adoption-rate"
            className="text-[var(--accent)] underline underline-offset-2 font-medium not-italic"
          >
            See enterprise adoption data &rarr;
          </a>
        </p>
      </div>
    </div>
  );
}
