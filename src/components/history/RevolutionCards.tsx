"use client";

import { useState, useEffect, useRef } from "react";

/** Inline SVG icons for each revolution - precise, geometric */
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
      "Handloom weavers (250,000+ eliminated by 1860), guild craftspeople. On March 11, 1811, framework knitters in Arnold, Nottingham destroyed 63 stocking frames in a single night \u2014 the first Luddite attack. Within three weeks, 200+ frames were smashed across the county. By 1812, over 800 frames had been destroyed and 12,000 troops were deployed to suppress the movement \u2014 more soldiers than Wellington took to Portugal. Mokyr et al. (2015) note that the Luddites\u2019 role has been exaggerated: the uprisings were 'comparable to Occupy Wall Street, with a multitude of causes and a somewhat unclear set of goals.' In Nottingham, workers were more concerned with low wages than mechanization per se.",
    created:
      "Railway workers (300,000+ by 1850), mechanics, engineers, mine workers. These industries didn\u2019t exist 20 years prior.",
    painfulPart:
      'Robert Allen\u2019s "Engels\u2019 Pause" (2009): from the 1780s to the 1840s, Britain\u2019s per capita GDP grew 46%, but real wages for the working class rose only 12%. The profit rate doubled and capital\u2019s share of national income expanded at the expense of labor. Wages didn\u2019t begin growing in line with productivity until after the 1870s \u2014 nearly a century after the first power looms. Even David Ricardo reversed his own position, admitting in the third edition of his Principles (1821) that machinery was "often very injurious to the interests of the class of labourers" \u2014 one of the earliest examples of an economist publicly changing their mind on automation.',
    lesson:
      "Aggregate growth masks generational disruption. New jobs are real but they\u2019re not the same jobs, and they don\u2019t arrive on the same schedule as the losses. Sir James Steuart observed in 1767 that tech unemployment would occur 'only if the innovation was introduced very suddenly' \u2014 a warning that applies directly to AI\u2019s compressed timeline.",
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
      "About 1 million horse-economy workers (blacksmiths, stable hands, harness makers), a category essentially wiped out. In 1900 there were roughly 109,000 carriage and harness makers in the US; by 1930, the occupation had virtually vanished.",
    created:
      "Auto manufacturing, trucking, road construction, petroleum, suburban retail. Basically the entire 20th-century consumer economy.",
    painfulPart:
      "Ford\u2019s Five Dollar Day (January 5, 1914) doubled the prevailing $2.34 wage to $5.00 per day \u2014 deliberately, because mass production requires mass consumers. At Highland Park, the moving assembly line (launched October 7, 1913) cut Model T assembly from 12.5 man-hours to 1.5, and the price from $700 (1910) to $350 (1917). But the interwar period still saw catastrophic structural unemployment as entire occupational categories dissolved.",
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
      "Millwrights, shaft-and-belt mechanics, specific factory roles tied to the old organizational form. Early adopters made the classic mistake: they replaced the steam engine with an electric dynamo but kept the same shaft-and-belt layout. Paul David called this \u201csimply overlaying one technical system upon a preexisting stratum.\u201d",
    created:
      "Electricians, electrical engineers, the entire consumer appliance industry (radio, refrigeration, washing machines). The breakthrough was \u201cunit drive\u201d \u2014 giving each machine its own electric motor \u2014 which freed factories to arrange machinery by production flow instead of proximity to power shafts. Ford\u2019s Highland Park plant exemplified this: conveyors and gravity slides cut assembly time by an estimated 30%. Domestic electrification also created the conditions for women\u2019s mass labor force entry.",
    painfulPart:
      "Paul David\u2019s \u201cProductivity Paradox\u201d (1990): the lightbulb was invented in 1879, but by 1900 only 3% of residences had electric lighting and electric motors accounted for less than 5% of factory mechanical drive. Productivity gains from electrification didn\u2019t appear until the 1920s \u2014 40 years later. The gains then accounted for half of all manufacturing productivity growth during that decade.",
    lesson:
      "The technology isn\u2019t the bottleneck. The organizational, educational, and institutional ecosystem surrounding it is. On-tap power democratized access to energy in ways that shifted competitive advantage from those who owned power infrastructure to those who used it most intelligently.",
    aiParallel:
      "This is the on-tap intelligence moment. AI transforms cognitive capabilities from scarce expert resources into utilities. The productivity gains will arrive later than expected, and through organizational redesign more than simple substitution. Brynjolfsson, Rock & Syverson (2021) call this the \u201cProductivity J-Curve\u201d: trillions in intangible investment are being made now but aren\u2019t captured in measured output.",
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
      "In 1910 there were 167,000+ telephone operators; automation eventually eliminated nearly all of them, though displaced workers shifted to secretarial and food service work (NBER, Feigenbaum & Gross, 2020). Bank tellers fell from 20 per branch to 13 between 1988\u20132004 as ATMs spread \u2014 but banks opened 43% more branches, so total teller employment actually grew to 600,000 by 2010. The real collapse came from the iPhone: tellers dropped from 332,000 (2010) to 164,000 (2022). Travel agents fell from 270,000 (1990) to under 50,000.",
    created:
      "Software developers, network engineers, UX designers, social media managers, e-commerce. Industries generating trillions that didn\u2019t exist in 1990.",
    painfulPart:
      '\u201cLabor market polarization\u201d: growth at the top (knowledge workers) and bottom (personal services), hollowing out of the middle. Goldin & Katz show the college wage premium rose from 39% (1980) to 79% (2000), then stagnated. Real wages for men with a high school diploma declined between 1979\u20131999. Acemoglu & Restrepo (2022) find that 50\u201370% of wage structure changes over four decades are accounted for by automation displacing routine-task workers. Solow (1987): \u201cYou can see the computer age everywhere but in the productivity statistics.\u201d Meanwhile, leisure inequality widened: Aguiar & Hurst (2007) found people without a high school degree gained ~10 hours of weekly leisure (1965\u20132003), mostly TV watching, while college graduates gained less than one hour.',
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
            className={`revolution-tab flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium border whitespace-nowrap cursor-pointer ${
              activeTab === r.id
                ? "text-white border-transparent"
                : "text-[var(--muted)] border-strong hover:border-black/[0.15] bg-white"
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
                className="text-lg font-bold"
                style={{ color: active.color }}
              >
                {active.title}
                {active.closestAnalog && (
                  <span className="ml-2 text-xs font-semibold bg-white/80 px-2 py-0.5 rounded-full">
                    Closest AI Analog
                  </span>
                )}
              </h3>
              <span className="text-sm text-[var(--muted)]">
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
                className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white shrink-0 mt-0.5"
                style={{ backgroundColor: active.color }}
              >
                AI Parallel
              </span>
              <p className="text-base text-[var(--foreground)] leading-relaxed font-medium">
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
      <dt className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
        {label}
      </dt>
      <dd className="text-base text-[var(--foreground)] leading-relaxed">
        {value}
      </dd>
    </div>
  );
}
