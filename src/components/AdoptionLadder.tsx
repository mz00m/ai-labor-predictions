"use client";

/**
 * Adoption Ladder - a horizontal stacked bar showing the AI adoption spectrum.
 *
 * The key insight: Census BTOS says about 24% of firms used AI in the past two
 * weeks, while McKinsey's State of AI says 88%. Both are correct - they measure
 * different units and thresholds. This visualization reconciles them.
 */

const RUNGS = [
  {
    label: "Firms using AI now",
    value: 23.8,
    source: "Census BTOS, two weeks ending Sep 6 2026",
    color: "#5C61F6",
    description: "Firms that used AI in any business function in the past two weeks (BTOS Q7, cycle 202619)",
  },
  {
    label: "Firms expecting to use AI within 6 months",
    value: 27.6,
    source: "Census BTOS, two weeks ending Sep 6 2026",
    color: "#818CF8",
    description: "Firms that expect to use AI in the next six months (BTOS Q24, cycle 202619)",
  },
  {
    label: "Workers: used for work (any)",
    value: 45.2,
    source: "St. Louis Fed RPS (Bick, Blandin & Deming), May 2026",
    color: "#A5B4FC",
    description: "Adults 18-64 who used generative AI for work at all (RPS, May 2026 wave)",
  },
  {
    label: "Any corporate use",
    value: 88,
    source: "McKinsey State of AI, Nov 2025",
    color: "#C7D2FE",
    description: "Firms reporting AI use in at least one business function",
  },
];

export default function AdoptionLadder() {
  const maxVal = RUNGS[RUNGS.length - 1].value;

  return (
    <div className="mt-6 mb-2">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">
        Adoption spectrum: why adoption numbers vary
      </p>

      <div className="space-y-2.5">
        {RUNGS.map((rung) => {
          const widthPct = Math.max((rung.value / maxVal) * 100, 8); // min 8% for label visibility
          return (
            <div key={rung.label} className="group">
              <div className="flex items-center gap-3">
                {/* Bar */}
                <div
                  className="relative h-7 rounded-md flex items-center transition-all"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: rung.color,
                    minWidth: "80px",
                  }}
                >
                  <span className="absolute right-2 text-sm font-bold text-white stat-number">
                    {rung.value}%
                  </span>
                </div>
                {/* Label */}
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-semibold text-[var(--foreground)] leading-tight">
                    {rung.label}
                  </span>
                  <span className="text-xs text-[var(--muted)] leading-tight">
                    {rung.source}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--muted)] mt-3 leading-relaxed opacity-70">
        The gap between 24% and 88% is definitional, not contradictory.
        Census samples all US employer firms and asks about the past two weeks;
        McKinsey surveys self-selected respondents about any use in any
        business function. The worker rung counts people, not firms.
      </p>
    </div>
  );
}
