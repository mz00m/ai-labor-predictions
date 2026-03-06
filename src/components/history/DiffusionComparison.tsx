"use client";

const ROWS = [
  {
    comparison: "vs. Electrification",
    historical: "25 yrs to industrial adoption",
    ai: "~2–3 yrs (St. Louis Fed: 54.6% adults)",
    ratio: "8–12×",
    source: "David (1990); Bick, Blandin & Deming (2025)",
  },
  {
    comparison: "vs. PC / Internet",
    historical: "5–15 yrs to 50% of households",
    ai: "~3 yrs to 55.9% adult adoption",
    ratio: "2–5×",
    source: "Census; St. Louis Fed (2025)",
  },
  {
    comparison: "vs. Enterprise adoption",
    historical: "10–25 yrs historically",
    ai: "33% → 88% in 2 yrs (McKinsey)",
    ratio: "5–12×",
    source: "McKinsey AI Survey (2023–2025)",
  },
];

export default function DiffusionComparison() {
  return (
    <div id="diffusion-comparison">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-3">
        Source Data
      </p>
      <h3 className="text-[18px] sm:text-[20px] font-bold text-[var(--foreground)] leading-tight mb-2">
        Where Does &ldquo;5&ndash;12&times;&rdquo; Come From?
      </h3>
      <p className="text-[12px] text-[var(--muted)] leading-[1.7] mb-4 max-w-[600px]">
        The compression ratio depends on what you compare and which source you
        trust. Here are the three main comparisons, with ranges reflecting
        measurement uncertainty.
      </p>

      {/* Table — desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-black/[0.08]">
              <th className="py-2.5 pr-4 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Comparison
              </th>
              <th className="py-2.5 pr-4 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Historical
              </th>
              <th className="py-2.5 pr-4 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                AI
              </th>
              <th className="py-2.5 pr-4 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                Ratio
              </th>
              <th className="py-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr
                key={r.comparison}
                className={
                  i < ROWS.length - 1 ? "border-b border-black/[0.04]" : ""
                }
              >
                <td className="py-3 pr-4 font-semibold text-[var(--foreground)] whitespace-nowrap">
                  {r.comparison}
                </td>
                <td className="py-3 pr-4 text-[var(--muted)]">
                  {r.historical}
                </td>
                <td className="py-3 pr-4 text-[var(--foreground)]">{r.ai}</td>
                <td className="py-3 pr-4">
                  <span className="text-[13px] font-bold text-[var(--accent)]">
                    {r.ratio}
                  </span>
                </td>
                <td className="py-3 text-[11px] text-[var(--muted)] italic">
                  {r.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="sm:hidden space-y-3">
        {ROWS.map((r) => (
          <div
            key={r.comparison}
            className="border border-black/[0.06] rounded-lg p-3.5"
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[12px] font-semibold text-[var(--foreground)]">
                {r.comparison}
              </span>
              <span className="text-[14px] font-bold text-[var(--accent)]">
                {r.ratio}
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-[var(--muted)]">Historical: </span>
                <span className="text-[var(--foreground)]">{r.historical}</span>
              </div>
              <div>
                <span className="text-[var(--muted)]">AI: </span>
                <span className="text-[var(--foreground)]">{r.ai}</span>
              </div>
              <div className="text-[10px] text-[var(--muted)] italic pt-1">
                {r.source}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Caveat */}
      <p className="text-[11px] text-[var(--muted)] leading-[1.6] mt-4 italic">
        Note: Census Bureau&rsquo;s rigorous sampling shows only 17.5% of US
        firms actively using AI (Feb 2026) &mdash; a 5&times; gap with
        McKinsey&rsquo;s 88%. The range reflects this measurement uncertainty.
        Adoption speed also does not guarantee proportional impact speed.
      </p>
    </div>
  );
}
