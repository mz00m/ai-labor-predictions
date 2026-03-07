"use client";

import { useState } from "react";

interface Example {
  id: string;
  era: string;
  technology: string;
  color: string;
  investmentPhase: string;
  investmentYears: string;
  paradox: string;
  payoff: string;
  payoffYears: string;
  intangibles: string[];
  keyFact: string;
}

const EXAMPLES: Example[] = [
  {
    id: "electricity",
    era: "1880s-1920s",
    technology: "Electricity",
    color: "#f59e0b",
    investmentPhase:
      "Factories initially just swapped steam engines for electric motors, keeping the same layout. The real gains required complete factory redesign: individual motors on each machine, single-story layouts, assembly lines.",
    investmentYears: "~30 years",
    paradox:
      "Total factor productivity was essentially flat from 1890 to 1920 despite widespread electrification.",
    payoff:
      "U.S. manufacturing TFP grew roughly 50% between 1899 and 1929, with electricity-intensive industries leading.",
    payoffYears: "~40 years after introduction",
    intangibles: [
      "Factory redesign & new floor plans",
      "New management practices",
      "Worker retraining on unit-drive systems",
      "Redesigned production processes",
    ],
    keyFact:
      "Electric motors represented less than 5% of mechanical power in factories by 1900, despite being commercially available since the 1880s.",
  },
  {
    id: "it",
    era: "1970s-2000s",
    technology: "Information Technology",
    color: "#5C61F6",
    investmentPhase:
      "Massive computer investment in the 1970s-90s required enormous complementary spending on software, business process reengineering, worker training, and organizational restructuring.",
    investmentYears: "~20 years",
    paradox:
      "Robert Solow's 1987 observation: \"You can see the computer age everywhere but in the productivity statistics.\"",
    payoff:
      "The productivity boom arrived in the late 1990s-2000s. Adjusted TFP was 11.3% higher than official measures by 2004, and 15.9% higher by 2017.",
    payoffYears: "~20-30 years after widespread adoption",
    intangibles: [
      "Enterprise software development",
      "Business process reengineering",
      "IT training & digital literacy",
      "Organizational restructuring",
    ],
    keyFact:
      "$1 of computer hardware/software is associated with $10-12 of total market value when intangible complements are included.",
  },
  {
    id: "ai",
    era: "2020s-???",
    technology: "Artificial Intelligence",
    color: "#ef4444",
    investmentPhase:
      "Companies are investing heavily in AI infrastructure, model development, employee retraining, workflow redesign, and new product development. Most of these investments are expensed, not capitalized.",
    investmentYears: "We are here now",
    paradox:
      "Massive AI investment has not yet appeared in aggregate productivity statistics. Many firms report little measurable ROI from AI spending.",
    payoff:
      "The framework predicts a productivity surge once intangible investments mature — new workflows are established, workers are trained, and complementary systems are built.",
    payoffYears: "Potentially faster than prior GPTs",
    intangibles: [
      "Data infrastructure & pipelines",
      "Workflow redesign & AI integration",
      "Employee retraining & upskilling",
      "New products & business models",
    ],
    keyFact:
      "AI's digital nature may compress the J-curve timeline. Software-based reorganization can propagate faster than physical factory redesign.",
  },
];

export default function HistoricalExamples() {
  const [active, setActive] = useState("electricity");
  const example = EXAMPLES.find((e) => e.id === active)!;

  return (
    <div className="space-y-4">
      {/* Tab selector */}
      <div className="flex gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setActive(ex.id)}
            className="flex-1 text-center py-2 px-3 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all"
            style={{
              backgroundColor:
                active === ex.id ? ex.color + "15" : "transparent",
              color: active === ex.id ? ex.color : "var(--muted)",
              border: `1.5px solid ${active === ex.id ? ex.color + "40" : "rgba(0,0,0,0.06)"}`,
            }}
          >
            {ex.technology}
            <span className="block text-[10px] font-medium opacity-60 mt-0.5 normal-case tracking-normal">
              {ex.era}
            </span>
          </button>
        ))}
      </div>

      {/* Content card */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: example.color + "30" }}
      >
        {/* Key fact banner */}
        <div
          className="px-4 py-2.5 text-[12px] font-medium"
          style={{
            backgroundColor: example.color + "10",
            color: example.color,
          }}
        >
          {example.keyFact}
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Timeline bar */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded"
              style={{ backgroundColor: example.color + "10", color: example.color }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {example.id === "ai" ? "Ongoing" : example.investmentYears}
            </div>
            <span className="text-[11px] text-[var(--muted)]">
              {example.id === "ai"
                ? "investment phase"
                : "from introduction to productivity payoff"}
            </span>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Investment phase */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                Investment Phase
              </h4>
              <p className="text-[13px] text-[var(--foreground)] leading-relaxed">
                {example.investmentPhase}
              </p>
            </div>

            {/* The paradox */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                The Paradox
              </h4>
              <p className="text-[13px] text-[var(--foreground)] leading-relaxed italic">
                {example.paradox}
              </p>
            </div>
          </div>

          {/* Payoff */}
          <div
            className="rounded-md px-3 py-2.5"
            style={{ backgroundColor: example.color + "08" }}
          >
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
              The Payoff ({example.payoffYears})
            </h4>
            <p className="text-[13px] text-[var(--foreground)] leading-relaxed">
              {example.payoff}
            </p>
          </div>

          {/* Intangible investments */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
              Hidden Intangible Investments
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {example.intangibles.map((item) => (
                <span
                  key={item}
                  className="text-[11px] font-medium px-2 py-1 rounded-full border"
                  style={{
                    borderColor: example.color + "30",
                    color: example.color,
                    backgroundColor: example.color + "08",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
