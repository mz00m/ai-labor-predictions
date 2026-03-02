"use client";

import { useState } from "react";

interface Revolution {
  id: string;
  title: string;
  period: string;
  color: string;
  colorLight: string;
  innovation: string;
  automated: string;
  destroyed: string;
  created: string;
  painfulPart: string;
  lesson: string;
  aiParallel: string;
  closestAnalog?: boolean;
}

const REVOLUTIONS: Revolution[] = [
  {
    id: "steam",
    title: "Steam Power",
    period: "1760–1850",
    color: "#d97706",
    colorLight: "#fef3c7",
    innovation:
      "First mechanical substitute for human muscle at industrial scale",
    automated: "Routine physical labor — weaving, grinding, pumping",
    destroyed:
      "Handloom weavers (250,000+ eliminated by 1860), guild craftspeople",
    created:
      "Railway workers (300,000+ by 1850), mechanics, engineers, mine workers — industries that didn\u2019t exist 20 years prior",
    painfulPart:
      'The "Engel\u2019s Pause" — real wages stagnated for 60 years despite massive productivity gains',
    lesson:
      "Aggregate growth masks generational disruption. New jobs are real but they\u2019re not the same jobs, and they don\u2019t arrive on the same schedule as the losses.",
    aiParallel: "The timeline of disruption, not the domain",
  },
  {
    id: "combustion",
    title: "Internal Combustion",
    period: "1880–1940",
    color: "#059669",
    colorLight: "#d1fae5",
    innovation:
      "Portable, distributed mechanical power enabling mobile machinery and mass production",
    automated: "Horse-powered transport and labor; physically repetitive assembly",
    destroyed:
      "~1 million horse-economy workers (blacksmiths, stable hands, harness makers) — a category essentially eliminated",
    created:
      "Auto manufacturing, trucking, road construction, petroleum, suburban retail — the entire 20th-century consumer economy",
    painfulPart:
      "Ford\u2019s Five Dollar Day (1914) doubled wages deliberately — because mass production requires mass consumers. The interwar period still saw catastrophic structural unemployment.",
    lesson:
      "Technologies that enable new forms of distribution tend to have larger and more diffuse effects than technologies that merely improve production. Mass productivity gains require mass purchasing power to be economically stable.",
    aiParallel:
      "The demand-side logic — if AI creates enormous value, how it\u2019s distributed determines whether the economy remains stable",
  },
  {
    id: "electricity",
    title: "Electrification",
    period: "1880–1930",
    color: "#2563eb",
    colorLight: "#dbeafe",
    closestAnalog: true,
    innovation:
      "Transformed power from a scarce, locationally-fixed resource into a ubiquitous, on-demand utility",
    automated:
      "Centralized shaft-and-belt power distribution; many domestic labor tasks",
    destroyed:
      "Millwrights, shaft-and-belt mechanics, specific factory roles tied to the old organizational form",
    created:
      "Electricians, electrical engineers, the entire consumer appliance industry (radio, refrigeration, washing machines), domestic electrification created conditions for women\u2019s mass labor force entry",
    painfulPart:
      "Paul David\u2019s \u201cProductivity Paradox\u201d — electric dynamos were introduced in the 1880s but didn\u2019t show up in productivity statistics until the 1920s. 40 years.",
    lesson:
      "The technology isn\u2019t the bottleneck — the organizational, educational, and institutional ecosystem surrounding it is. On-tap power democratized access to energy in ways that shifted competitive advantage from those who owned power infrastructure to those who used it most intelligently.",
    aiParallel:
      "This is the on-tap intelligence moment. AI transforms cognitive capabilities from scarce expert resources into utilities. The productivity gains will arrive later than expected, and through organizational redesign more than simple substitution.",
  },
  {
    id: "computers",
    title: "Digital Computers",
    period: "1960–2000",
    color: "#7c3aed",
    colorLight: "#ede9fe",
    innovation:
      "Automated rule-based data processing; then networked information exchange at global scale",
    automated:
      "Clerical labor (typing, filing, bookkeeping); routine cognitive tasks; then logistics and coordination",
    destroyed:
      "Telephone operators, bank tellers, travel agents, filing clerks, typists — many roles reduced 80\u201390%",
    created:
      "Software developers, network engineers, UX designers, social media managers, e-commerce — industries generating trillions that didn\u2019t exist in 1990",
    painfulPart:
      '\u201cLabor market polarization\u201d — growth at the top (knowledge workers) and bottom (personal services) of wages, hollowing out of the middle. College wage premium rose from ~40% to ~70% between 1980\u20132000. Workers without degrees saw real wages stagnate or fall for 40 years. Robert Solow\u2019s observation (1987): "You can see the computer age everywhere but in the productivity statistics."',
    lesson:
      "Technological gains accruing primarily to capital and high-skill workers is not inevitable — it\u2019s a policy choice. The computer era\u2019s inequality reflected specific institutional decisions (declining unions, wage policy, trade) as much as the technology itself.",
    aiParallel:
      "The distributional warning. Without deliberate policy, AI-era gains will follow the computer-era pattern: high returns to capital and top earners, stagnation elsewhere.",
  },
];

export default function RevolutionCards() {
  const [activeTab, setActiveTab] = useState("electricity");

  const active = REVOLUTIONS.find((r) => r.id === activeTab)!;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {REVOLUTIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveTab(r.id)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium border transition-colors duration-150 ${
              activeTab === r.id
                ? "text-white border-transparent"
                : "text-[var(--muted)] border-black/[0.08] hover:border-black/[0.15] bg-white"
            }`}
            style={
              activeTab === r.id
                ? { backgroundColor: r.color }
                : undefined
            }
          >
            {r.closestAnalog && activeTab === r.id && (
              <span className="mr-1">&#11088;</span>
            )}
            {r.title}
            <span className="ml-1 opacity-70">{r.period}</span>
          </button>
        ))}
      </div>

      {/* Active card */}
      <div
        className="border rounded-lg overflow-hidden"
        style={{ borderColor: `${active.color}20` }}
      >
        {/* Header bar */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ backgroundColor: active.colorLight }}
        >
          <div>
            <h3
              className="text-[15px] font-bold"
              style={{ color: active.color }}
            >
              {active.title}
              {active.closestAnalog && (
                <span className="ml-2 text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded-full">
                  Closest AI Analog
                </span>
              )}
            </h3>
            <span className="text-[12px] text-[var(--muted)]">
              {active.period}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <Row label="The Innovation" value={active.innovation} />
          <Row label="What It Automated" value={active.automated} />
          <Row label="Jobs Destroyed" value={active.destroyed} />
          <Row label="Jobs Created" value={active.created} />
          <Row
            label="The Painful Part"
            value={active.painfulPart}
          />
          <Row label="The Lesson" value={active.lesson} />

          {/* AI Parallel badge */}
          <div
            className="rounded-lg p-4 mt-2"
            style={{ backgroundColor: `${active.color}08` }}
          >
            <div className="flex items-start gap-2">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white shrink-0 mt-0.5"
                style={{ backgroundColor: active.color }}
              >
                AI Parallel
              </span>
              <p className="text-[13px] text-[var(--foreground)] leading-relaxed font-medium">
                {active.aiParallel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
        {label}
      </dt>
      <dd className="text-[13px] text-[var(--foreground)] leading-relaxed">
        {value}
      </dd>
    </div>
  );
}
