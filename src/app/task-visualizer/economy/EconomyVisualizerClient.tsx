"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import WorkforceOverview from "@/components/task-visualizer/economy/WorkforceOverview";
import AutomationWaveChart from "@/components/task-visualizer/economy/AutomationWaveChart";
import YearSliderExplorer from "@/components/task-visualizer/economy/YearSliderExplorer";
import IncomeStrataImpact from "@/components/task-visualizer/economy/IncomeStrataImpact";
import GenderImpact from "@/components/task-visualizer/economy/GenderImpact";
import AdaptiveCapacity from "@/components/task-visualizer/economy/AdaptiveCapacity";
import ShareSectionBar from "@/components/ShareSectionBar";

type Section = "overview" | "gender" | "explorer" | "strata" | "adaptability";

const SECTIONS: { id: Section; label: string; question: string; description: string }[] = [
  {
    id: "overview",
    label: "The Workforce",
    question: "The US workforce: 154M workers by occupation and income",
    description: "Each bar is an occupation group sized by number of workers. Color shows income tier. Click any bar to see a task-by-task automation breakdown for that job.",
  },
  {
    id: "explorer",
    label: "Year Explorer",
    question: "Explore cost crossover by year: drag the slider to see who's exposed",
    description: "Each bar shows what percentage of an occupation group's tasks could be performed more cheaply by AI in that year. Use the scenario toggle to see how sensitive projections are to AI cost decline rates. Demand elasticity and CFO signals show whether cost crossover is likely to mean displacement or market expansion.",
  },
  {
    id: "strata",
    label: "By Income",
    question: "Cost crossover hits different income levels on different timelines",
    description: "The automation wave chart shows where pressure concentrates first, with scenario uncertainty bands. Each income tier below is broken out with its top occupation groups, projected cost crossover at 2028/2032/2036, demand elasticity, and CFO replace/enhance signals. Click any occupation row to explore its individual tasks.",
  },
  {
    id: "adaptability",
    label: "Adaptability",
    question: "AI exposure and worker adaptability are positively correlated — but not for everyone",
    description: "Most workers in highly AI-exposed occupations have strong adaptive capacity (savings, transferable skills, urban location, younger age). But 6.1 million clerical/admin workers face both high exposure and low adaptability. Based on Manning & Aguirre (NBER, 2026).",
  },
  {
    id: "gender",
    label: "By Gender",
    question: "Women's occupational concentration puts them in higher-exposure roles",
    description: "Women are concentrated in clerical, admin, and healthcare support roles with high information-processing task loads. This gap reflects where women work today, not inherent vulnerability — occupational mobility moderates the actual impact. Click any bar to explore that job's tasks.",
  },
];

const VALID_SECTIONS = new Set<string>(SECTIONS.map((s) => s.id));

export default function EconomyVisualizerClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam && VALID_SECTIONS.has(tabParam) ? (tabParam as Section) : "overview";
  const [activeSection, setActiveSection] = useState<Section>(initialTab);

  // Sync URL when tab changes
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (activeSection === "overview" && !currentTab) return;
    if (currentTab === activeSection) return;

    const params = new URLSearchParams(searchParams.toString());
    if (activeSection === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", activeSection);
    }
    const qs = params.toString();
    router.replace(`/task-visualizer/economy${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [activeSection, searchParams, router]);

  const currentSection = SECTIONS.find((s) => s.id === activeSection);
  const shareUrl = `https://jobsdata.ai/task-visualizer/economy${activeSection !== "overview" ? `?tab=${activeSection}` : ""}`;

  return (
    <div>
      {/* Section tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            data-active={activeSection === section.id || undefined}
            className={`viz-tab shrink-0 text-[12px] font-medium px-4 py-2.5 transition-colors ${
              activeSection === section.id
                ? "text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section question + description */}
      {currentSection && (
        <div className="mb-6 max-w-2xl">
          <p className="text-[16px] font-semibold text-[var(--foreground)] mb-1">
            {currentSection.question}
          </p>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed">
            {currentSection.description}
          </p>
        </div>
      )}

      {/* Section content */}
      {activeSection === "overview" && <WorkforceOverview />}
      {activeSection === "gender" && <GenderImpact />}
      {activeSection === "adaptability" && <AdaptiveCapacity />}
      {activeSection === "explorer" && <YearSliderExplorer />}
      {activeSection === "strata" && (
        <>
          <AutomationWaveChart />
          <div className="mt-8">
            <IncomeStrataImpact />
          </div>
        </>
      )}

      {/* Social sharing */}
      {currentSection && (
        <ShareSectionBar
          url={shareUrl}
          title={currentSection.question}
          description={currentSection.description}
        />
      )}

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
            AI exposure scores (0-10) and measurement certainty indicators are from the{" "}
            <a
              href="https://budgetlab.yale.edu/research/labor-market-ai-exposure-what-do-we-know"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              Yale Budget Lab
            </a>{" "}
            (Gimbel, Kendall, Kulsakdinun, 2026), which compared six independent AI exposure
            metrics across 778 occupations. Occupation-level scores are GPT-scored across 342 BLS
            occupations from the study&apos;s{" "}
            <a
              href="https://github.com/rmmomin/jobs-ai-exposure"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              data repository
            </a>
            , validated against Eloundou et al. (Pearson 0.885) and the Yale PCA composite
            (Pearson 0.878). Certainty reflects how much the six metrics agree: low variance
            means strong consensus (e.g., construction), high variance means significant
            disagreement (e.g., computer/math, legal).
          </p>
          <p>
            Gender composition from BLS Current Population Survey 2024 annual averages (Table 11).
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
