"use client";

import { useState } from "react";
import WorkforceOverview from "@/components/task-visualizer/economy/WorkforceOverview";
import AutomationWaveChart from "@/components/task-visualizer/economy/AutomationWaveChart";
import YearSliderExplorer from "@/components/task-visualizer/economy/YearSliderExplorer";
import IncomeStrataImpact from "@/components/task-visualizer/economy/IncomeStrataImpact";

type Section = "overview" | "wave" | "explorer" | "strata";

const SECTIONS: { id: Section; label: string; description: string; howTo: string }[] = [
  {
    id: "overview",
    label: "The Workforce",
    description: "The 154 million jobs that make up the US economy, broken down by occupation group and income level.",
    howTo: "Click any bar to explore that occupation in the individual task visualizer.",
  },
  {
    id: "wave",
    label: "The Automation Wave",
    description: "As AI compute costs fall each year, more tasks become cheaper to automate than to pay humans. This chart shows that pressure building across income tiers from 2026 to 2040.",
    howTo: "Hover over the chart to see the exact automation percentage for each income tier at any year.",
  },
  {
    id: "explorer",
    label: "Year Explorer",
    description: "Pick any year between now and 2040. See which occupation groups face the most automation pressure and how many workers are affected.",
    howTo: "Drag the slider to a year. Bars show what percentage of each group's tasks are economically automatable.",
  },
  {
    id: "strata",
    label: "By Income Tier",
    description: "Lower, middle, and higher income jobs face very different automation timelines. Here's the detailed breakdown with the most exposed and most durable task categories for each group.",
    howTo: "Each tier card shows the task composition, automation projections at 2028/2032/2036, and which skills are most at risk vs. most durable.",
  },
];

export default function EconomyVisualizerClient() {
  const [activeSection, setActiveSection] = useState<Section>("overview");

  return (
    <div>
      {/* Section tabs */}
      <div className="flex gap-1 mb-8 border-b border-black/[0.06] overflow-x-auto">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`shrink-0 text-[12px] font-medium px-4 py-2.5 border-b-2 transition-colors ${
              activeSection === section.id
                ? "border-[var(--accent)] text-[var(--foreground)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section description */}
      {(() => {
        const section = SECTIONS.find((s) => s.id === activeSection);
        return section ? (
          <div className="mb-6 max-w-2xl">
            <p className="text-[13px] text-[var(--muted)] leading-relaxed">
              {section.description}
            </p>
            <p className="text-[12px] text-[var(--accent)] mt-1.5">
              {section.howTo}
            </p>
          </div>
        ) : null;
      })()}

      {/* Section content */}
      {activeSection === "overview" && <WorkforceOverview />}
      {activeSection === "wave" && <AutomationWaveChart />}
      {activeSection === "explorer" && <YearSliderExplorer />}
      {activeSection === "strata" && <IncomeStrataImpact />}

      {/* Bottom methodology note */}
      <div className="mt-12 pt-8 border-t border-black/[0.06]">
        <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
          About this analysis
        </h3>
        <div className="text-[12px] text-[var(--muted)] space-y-2 max-w-2xl">
          <p>
            Employment data from the Bureau of Labor Statistics Occupational Employment and Wage
            Statistics (OEWS), May 2024. Income tiers based on median annual wage: lower income
            (under $35K), middle income ($35K-$75K), higher income (over $75K).
          </p>
          <p>
            Task composition for each occupation group is estimated from O*NET Generalized Work
            Activities data, aggregated across detailed occupations within each major SOC group.
            Automation projections use the same compute-cost-versus-human-wage crossover model as
            the{" "}
            <a href="/task-visualizer" className="underline hover:text-[var(--foreground)]">
              individual job task visualizer
            </a>
            , with category-level cost decline rates derived from observed AI inference cost trends.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Critical caveat:</strong> Task automation
            does not equal job loss. These projections show economic incentive to automate, not
            actual displacement. Real-world adoption is moderated by: organizational inertia (1-5
            year deployment lags), regulatory barriers (especially healthcare, legal, finance),
            O-ring complementarity (partial automation may increase remaining-task value), induced
            demand (cheaper services expand markets), and new task creation.
          </p>
        </div>
      </div>
    </div>
  );
}
