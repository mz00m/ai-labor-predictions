"use client";

const FORECASTS = [
  {
    term: "Near Term",
    range: "5–15 years",
    color: "#dc2626",
    colorLight: "#fef2f2",
    points: [
      "Labor market polarization accelerates",
      "Routine cognitive work faces displacement pressure first: document review, standard writing, basic code, data analysis, customer service",
      "This shows as wage compression and employment decline in these categories, even before significant job losses, as AI-assisted workers handle more volume",
      "New roles in AI oversight, training, and application emerge \u2014 but won\u2019t immediately compensate for losses",
      "The Solow Observation applies: macro productivity effects won\u2019t yet be visible in statistics",
    ],
  },
  {
    term: "Medium Term",
    range: "15–30 years",
    color: "#d97706",
    colorLight: "#fffbeb",
    points: [
      "The productivity paradox resolves \u2014 organizational complements to AI develop (new business models, new processes, new educational pathways, new regulatory frameworks)",
      "Aggregate productivity growth becomes visible and accelerates",
      "Whether this growth translates to broadly shared wages depends entirely on institutional choices made now",
      "Geographic concentration of both benefits and disruption will be extreme",
    ],
  },
  {
    term: "Long Term",
    range: "30–50 years",
    color: "#059669",
    colorLight: "#ecfdf5",
    points: [
      "A new occupational equilibrium emerges, dominated by human-AI collaborative roles",
      "Growth in human-specific services: caregiving, high-stakes physical tasks, relational work that requires accountability and presence",
      "Entirely new industries emerge, enabled by democratized access to cognitive capabilities \u2014 analogous to how electrification created the consumer appliance economy",
      "Average wages in the new equilibrium may be substantially higher \u2014 but the transition path involves significant disruption for workers in currently vulnerable occupations",
    ],
  },
];

export default function ForecastColumns() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FORECASTS.map((f) => (
          <div
            key={f.term}
            className="border border-black/[0.06] rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div
              className="px-4 py-3"
              style={{ backgroundColor: f.colorLight }}
            >
              <h4
                className="text-[14px] font-bold"
                style={{ color: f.color }}
              >
                {f.term}
              </h4>
              <span className="text-[11px] text-[var(--muted)]">
                {f.range}
              </span>
            </div>

            {/* Points */}
            <ul className="p-4 space-y-3">
              {f.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: f.color }}
                  />
                  <span className="text-[12px] text-[var(--muted)] leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Historical calibration note */}
      <div className="mt-6 border-l-2 border-black/[0.08] pl-4 py-1">
        <p className="text-[11px] text-[var(--muted)] leading-relaxed italic">
          <span className="font-semibold not-italic">
            Historical calibration:
          </span>{" "}
          In prior GPT transitions, the total timeline from meaningful
          diffusion to new equilibrium ranged from 40 to 70 years. The
          &ldquo;eventually&rdquo; in &ldquo;jobs eventually come
          back&rdquo; has historically meant multiple generations, not
          years.
        </p>
      </div>
    </div>
  );
}
