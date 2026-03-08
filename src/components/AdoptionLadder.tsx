"use client";

/**
 * Adoption Ladder — a horizontal stacked bar showing the AI adoption spectrum.
 *
 * The key insight: Census says 10% of firms use AI "in production," while
 * McKinsey/Bloom surveys say 78–88%. Both are correct — they measure
 * different thresholds. This visualization reconciles them.
 */

const RUNGS = [
  {
    label: "In production",
    value: 10,
    source: "Census BTOS",
    color: "#5C61F6",
    description: "Firms with AI deployed in production workflows",
  },
  {
    label: "Piloting / testing",
    value: 15,
    source: "Census BTOS",
    color: "#818CF8",
    description: "Firms actively testing or piloting AI tools",
  },
  {
    label: "Workers using weekly",
    value: 37,
    source: "NBER (Bick et al.)",
    color: "#A5B4FC",
    description: "Workers who used AI on the job in the past week",
  },
  {
    label: "Any corporate use",
    value: 78,
    source: "NBER (Bloom et al.)",
    color: "#C7D2FE",
    description: "Firms reporting any AI use across functions",
  },
];

export default function AdoptionLadder() {
  const maxVal = RUNGS[RUNGS.length - 1].value;

  return (
    <div className="mt-6 mb-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-3">
        Adoption spectrum — why adoption numbers vary
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
                  <span className="absolute right-2 text-[12px] font-bold text-white stat-number">
                    {rung.value}%
                  </span>
                </div>
                {/* Label */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-semibold text-[var(--foreground)] leading-tight">
                    {rung.label}
                  </span>
                  <span className="text-[11px] text-[var(--muted)] leading-tight">
                    {rung.source}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-3 leading-relaxed opacity-70">
        The gap between 10% and 78% is definitional, not contradictory.
        Strict &ldquo;in production&rdquo; measures capture at-scale deployment;
        survey-based measures capture any experimentation.
        Both are valid — the adoption ladder shows where firms actually are.
      </p>
    </div>
  );
}
