"use client";

import { useState } from "react";
import WorkforceOverview from "@/components/task-visualizer/economy/WorkforceOverview";
import AutomationWaveChart from "@/components/task-visualizer/economy/AutomationWaveChart";
import YearSliderExplorer from "@/components/task-visualizer/economy/YearSliderExplorer";
import IncomeStrataImpact from "@/components/task-visualizer/economy/IncomeStrataImpact";
import GenderImpact from "@/components/task-visualizer/economy/GenderImpact";

type Section = "overview" | "gender" | "wave" | "explorer" | "strata";

const SECTIONS: { id: Section; label: string; question: string; description: string }[] = [
  {
    id: "overview",
    label: "The Workforce",
    question: "What does the US workforce look like, and who earns what?",
    description: "154 million workers across 22 occupation groups, shaded by income tier. Click any bar to explore that job in detail.",
  },
  {
    id: "wave",
    label: "The Automation Wave",
    question: "How fast is automation pressure building across income levels?",
    description: "As compute costs fall each year, more tasks become cheaper to automate. This shows that pressure building from 2026 to 2040 across lower, middle, and higher income tiers.",
  },
  {
    id: "explorer",
    label: "Year Explorer",
    question: "In any given year, which occupations face the most automation pressure?",
    description: "Drag the slider to any year. Bars show what percentage of each group's tasks are economically automatable.",
  },
  {
    id: "strata",
    label: "By Income",
    question: "How do automation timelines differ for lower, middle, and higher earners?",
    description: "Detailed breakdown by income tier with task composition, automation projections, and which skills are most at risk vs. most durable.",
  },
  {
    id: "gender",
    label: "By Gender",
    question: "Will automation hit women harder than men?",
    description: "Women are concentrated in clerical, admin, and healthcare support roles with high information-processing task loads — making them disproportionately exposed to near-term AI automation.",
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

      {/* Section question + description */}
      {(() => {
        const section = SECTIONS.find((s) => s.id === activeSection);
        return section ? (
          <div className="mb-6 max-w-2xl">
            <p className="text-[16px] font-semibold text-[var(--foreground)] mb-1">
              {section.question}
            </p>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed">
              {section.description}
            </p>
          </div>
        ) : null;
      })()}

      {/* Section content */}
      {activeSection === "overview" && <WorkforceOverview />}
      {activeSection === "gender" && <GenderImpact />}
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
