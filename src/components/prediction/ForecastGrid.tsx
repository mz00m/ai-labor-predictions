"use client";

import { FORECAST_PREDICTIONS } from "@/data/forecast";
import ForecastCard from "./ForecastCard";

export default function ForecastGrid() {
  const displacement = FORECAST_PREDICTIONS.filter(
    (p) => p.category === "displacement"
  );
  const wages = FORECAST_PREDICTIONS.filter((p) => p.category === "wages");
  const adoption = FORECAST_PREDICTIONS.filter(
    (p) => p.category === "adoption"
  );
  const productivity = FORECAST_PREDICTIONS.filter(
    (p) => p.category === "productivity"
  );

  const sections = [
    { label: "Displacement", color: "#F66B5C", items: displacement },
    { label: "Wages", color: "#F59E0B", items: wages },
    { label: "Adoption", color: "#22C55E", items: adoption },
    { label: "Productivity", color: "#5C61F6", items: productivity },
  ];

  return (
    <section className="mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
        Evidence-Weighted Predictions
      </p>
      <h2 className="text-heading sm:text-heading-xl font-extrabold tracking-tight text-[#2E3650] mb-1">
        12 Predictions for 2030
      </h2>
      <p className="text-md text-[var(--muted)] mb-8 max-w-xl leading-relaxed">
        Each prediction synthesizes all available evidence weighted by tier,
        recency, and sample size. Confidence intervals reflect genuine
        uncertainty, not false precision.
      </p>

      {sections.map((section) => (
        <div key={section.label} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: section.color }}
            />
            <h3 className="text-xl font-bold text-[#2E3650]">
              {section.label}
            </h3>
            <span className="text-sm text-[var(--muted)]">
              ({section.items.length})
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((p) => (
              <ForecastCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
