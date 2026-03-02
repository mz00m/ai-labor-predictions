"use client";

const FORECASTS = [
  {
    term: "Near Term",
    range: "2–7 years",
    color: "#dc2626",
    colorLight: "#fef2f2",
    points: [
      "Labor market polarization accelerates \u2014 already visible in 2024\u20132025 hiring data for content, coding, and customer service roles",
      "Routine cognitive work faces displacement pressure first: document review, standard writing, basic code, data analysis, customer service",
      "This shows as wage compression and employment decline in these categories, even before significant job losses, as AI-assisted workers handle more volume",
      "New roles in AI oversight, training, and application emerge \u2014 but won\u2019t immediately compensate for losses",
      "The Solow Observation may resolve faster than expected: with 78% of organizations already adopting AI (McKinsey, 2025), macro productivity effects could appear within years, not decades",
    ],
  },
  {
    term: "Medium Term",
    range: "7–20 years",
    color: "#d97706",
    colorLight: "#fffbeb",
    points: [
      "The productivity paradox resolves \u2014 organizational complements to AI develop (new business models, new processes, new educational pathways, new regulatory frameworks)",
      "Aggregate productivity growth becomes visible and accelerates",
      "Whether this growth translates to broadly shared wages depends entirely on institutional choices made now",
      "Geographic concentration of both benefits and disruption will be extreme \u2014 but AI\u2019s low infrastructure requirements could spread gains more broadly than prior GPTs",
    ],
  },
  {
    term: "Long Term",
    range: "20–40 years",
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
          diffusion to new equilibrium ranged from 40 to 70 years. AI
          adoption is 2&ndash;5x faster than the internet or PC at equivalent
          population thresholds (NBER, Bick et al. 2024; Microsoft AI
          Diffusion Report, 2025), and enterprise adoption surged from 33%
          to 88% of organizations in roughly two years (McKinsey). The
          timelines above are compressed by roughly 2&ndash;3x from
          historical baselines to reflect this acceleration &mdash; but
          organizational and institutional adaptation still operates at
          human speed. The &ldquo;eventually&rdquo; in &ldquo;jobs
          eventually come back&rdquo; may mean one generation rather than
          three, but it still won&rsquo;t mean years.
        </p>
      </div>
    </div>
  );
}
