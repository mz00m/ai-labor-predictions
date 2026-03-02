"use client";

const FORECASTS = [
  {
    term: "Near Term",
    range: "1–3 years",
    historicalRange: "5\u201315 years",
    color: "#dc2626",
    colorLight: "#fef2f2",
    points: [
      "Labor market polarization accelerates \u2014 already visible in 2024\u20132025 hiring data for content, coding, and customer service roles",
      "Routine cognitive work faces displacement pressure first: document review, standard writing, basic code, data analysis, customer service",
      "Wage compression and employment decline appear in these categories as AI-assisted workers handle dramatically more volume",
      "New roles in AI oversight, training, and application emerge \u2014 but won\u2019t immediately compensate for losses",
      "With 88% of organizations already adopting AI (McKinsey, 2025), the Solow Paradox may resolve in years rather than the decades it took for electricity and computers",
    ],
  },
  {
    term: "Medium Term",
    range: "3–7 years",
    historicalRange: "15\u201330 years",
    color: "#d97706",
    colorLight: "#fffbeb",
    points: [
      "The productivity paradox resolves \u2014 organizational complements to AI develop (new business models, new processes, new educational pathways, new regulatory frameworks)",
      "Aggregate productivity growth becomes visible and accelerates \u2014 potentially arriving by the early 2030s rather than the 2050s a historical baseline would predict",
      "Whether this growth translates to broadly shared wages depends entirely on institutional choices being made now",
      "AI\u2019s low infrastructure requirements could spread gains more geographically than prior GPTs, which concentrated in industrial centers",
    ],
  },
  {
    term: "Long Term",
    range: "7–15 years",
    historicalRange: "30\u201350 years",
    color: "#059669",
    colorLight: "#ecfdf5",
    points: [
      "A new occupational equilibrium emerges, dominated by human-AI collaborative roles",
      "Growth in human-specific services: caregiving, high-stakes physical tasks, relational work that requires accountability and presence",
      "Entirely new industries emerge, enabled by democratized access to cognitive capabilities \u2014 analogous to how electrification created the consumer appliance economy",
      "Average wages in the new equilibrium may be substantially higher \u2014 but the compressed transition means less time for workers and institutions to adapt",
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
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: f.color }}
                >
                  {f.range}
                </span>
                <span className="text-[10px] text-[var(--muted)] line-through">
                  was {f.historicalRange}
                </span>
              </div>
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
          diffusion to new equilibrium ranged from 40 to 70 years.
          AI&rsquo;s diffusion phase is running at roughly 10x the speed
          of prior GPTs: enterprise adoption went from 33% to 88% in two
          years (McKinsey), and 54.6% of US working-age adults used
          generative AI within three years of launch (St. Louis Fed)
          &mdash; penetration rates the internet and PC took 5&ndash;15
          years to achieve. The timelines above extrapolate from this 10x
          adoption speed. If the historical 40&ndash;70 year arc
          compresses proportionally, the full transition from diffusion to
          new equilibrium could play out in 7&ndash;15 years &mdash; a
          single generation rather than three.
        </p>
      </div>
    </div>
  );
}
