"use client";

import { useState, useEffect, useRef } from "react";

/** Inline SVG icons for each revolution — precise, geometric */
function RevolutionIcon({ id, color, size = 16 }: { id: string; color: string; size?: number }) {
  const s = size / 24;
  const icons: Record<string, JSX.Element> = {
    steam: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g transform={`scale(${s})`}>
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/>
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        </g>
      </svg>
    ),
    combustion: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2c.5 3.5-1.5 5-1.5 5C12.5 9 14 8.5 14 11c0 2-1.5 3-3 3s-3-1-3-3c0-3 2-5 4-9z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22c4 0 7-2.5 7-6 0-4.5-3.5-7-3.5-7s0 2.5-1.5 4c0 0 1.5-1 1.5-3.5 0-2-2-3.5-3.5-6-1.5 2.5-3.5 4-3.5 6 0 2.5 1.5 3.5 1.5 3.5-1.5-1.5-1.5-4-1.5-4S5 11.5 5 16c0 3.5 3 6 7 6z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    electricity: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    computers: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="1.8"/>
        <rect x="9" y="9" width="6" height="6" rx="1" stroke={color} strokeWidth="1.8"/>
        <line x1="9" y1="1" x2="9" y2="4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="15" y1="1" x2="15" y2="4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="9" y1="20" x2="9" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="15" y1="20" x2="15" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  };
  return icons[id] ?? null;
}

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
    automated: "Routine physical labor: weaving, grinding, pumping",
    destroyed:
      "Handloom weavers (250,000+ eliminated by 1860), guild craftspeople",
    created:
      "Railway workers (300,000+ by 1850), mechanics, engineers, mine workers. These industries didn\u2019t exist 20 years prior.",
    painfulPart:
      'The "Engel\u2019s Pause": real wages stagnated for 60 years despite massive productivity gains',
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
      "About 1 million horse-economy workers (blacksmiths, stable hands, harness makers), a category essentially wiped out",
    created:
      "Auto manufacturing, trucking, road construction, petroleum, suburban retail. Basically the entire 20th-century consumer economy.",
    painfulPart:
      "Ford\u2019s Five Dollar Day (1914) doubled wages deliberately, because mass production requires mass consumers. The interwar period still saw catastrophic structural unemployment.",
    lesson:
      "Technologies that enable new forms of distribution tend to have larger and more diffuse effects than technologies that merely improve production. Mass productivity gains require mass purchasing power to be economically stable.",
    aiParallel:
      "The demand-side logic: if AI creates enormous value, how it\u2019s distributed determines whether the economy remains stable",
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
      "Paul David\u2019s \u201cProductivity Paradox\u201d: electric dynamos were introduced in the 1880s but didn\u2019t show up in productivity statistics until the 1920s. That took 40 years.",
    lesson:
      "The technology isn\u2019t the bottleneck. The organizational, educational, and institutional ecosystem surrounding it is. On-tap power democratized access to energy in ways that shifted competitive advantage from those who owned power infrastructure to those who used it most intelligently.",
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
      "Telephone operators, bank tellers, travel agents, filing clerks, typists. Many of these roles shrank 80\u201390%.",
    created:
      "Software developers, network engineers, UX designers, social media managers, e-commerce. Industries generating trillions that didn\u2019t exist in 1990.",
    painfulPart:
      '\u201cLabor market polarization\u201d: growth at the top (knowledge workers) and bottom (personal services) of wages, hollowing out of the middle. The college wage premium rose from ~40% to ~70% between 1980\u20132000. Workers without degrees saw real wages stagnate or fall for 40 years. Robert Solow\u2019s observation (1987): "You can see the computer age everywhere but in the productivity statistics."',
    lesson:
      "Technological gains accruing primarily to capital and high-skill workers is not inevitable. It\u2019s a policy choice. The computer era\u2019s inequality reflected specific institutional decisions (declining unions, wage policy, trade) as much as the technology itself.",
    aiParallel:
      "The distributional warning. Without deliberate policy, AI-era gains will follow the computer-era pattern: high returns to capital and top earners, stagnation elsewhere.",
  },
];

export default function RevolutionCards() {
  const [activeTab, setActiveTab] = useState("electricity");
  const [animating, setAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleTabChange = (id: string) => {
    if (id === activeTab || reducedMotion.current) {
      setActiveTab(id);
      return;
    }
    setAnimating(true);
    // Quick fade out, swap, fade in
    setTimeout(() => {
      setActiveTab(id);
      setTimeout(() => setAnimating(false), 30);
    }, 150);
  };

  const active = REVOLUTIONS.find((r) => r.id === activeTab)!;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-2 mb-6">
        {REVOLUTIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => handleTabChange(r.id)}
            className={`revolution-tab flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] sm:text-[12px] font-medium border whitespace-nowrap cursor-pointer ${
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
            <RevolutionIcon
              id={r.id}
              color={activeTab === r.id ? "#ffffff" : r.color}
              size={14}
            />
            {r.closestAnalog && activeTab === r.id && (
              <span className="mr-0.5">&#11088;</span>
            )}
            {r.title}
            <span className="ml-1 opacity-70 hidden lg:inline">{r.period}</span>
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
          <div className="flex items-center gap-3">
            <div
              className="revolution-header-icon flex items-center justify-center w-9 h-9 rounded-lg"
              style={{ backgroundColor: `${active.color}15` }}
            >
              <RevolutionIcon id={active.id} color={active.color} size={20} />
            </div>
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
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="revolution-content p-5 space-y-4"
          key={active.id}
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(6px)" : "translateY(0)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
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
