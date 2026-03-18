"use client";

import { useState, useEffect, useRef } from "react";

const PHASES = [
  {
    phase: "I",
    name: "Emergence",
    duration: "5–20 yrs",
    aiDuration: "~10 yrs (2012–2022), complete",
    description:
      "Technology arrives; specialists created; little aggregate effect on total employment.",
    example:
      "Steam engines existed for decades before anyone built a railway. Early electricity powered arc lamps, not factories.",
    aiNote:
      "For AI: deep learning breakthroughs (2012) through GPT-3 (2020). Specialists created, but little aggregate labor market effect. This phase is complete.",
    workerEffect:
      "Technology arrives; specialists created; little aggregate effect",
  },
  {
    phase: "II",
    name: "Rapid Diffusion",
    duration: "10–25 yrs",
    aiDuration: "~1–3 yrs (2022–2025), nearly complete",
    description:
      "Spreads across sectors; high-skill workers who adopt early benefit most. Productivity rises faster than wages.",
    example:
      "By 1900, electric motors were spreading across US factories but most still used shaft-and-belt power. Early adopters saw enormous gains.",
    aiNote:
      "For AI: ChatGPT hit 100M users in 2 months; 54.6% of US adults used gen AI by 2025 (St. Louis Fed). Enterprise adoption surged from 33% to 88% in ~2 years (McKinsey). Anthropic's 2026 analysis of first-party API traffic found ~70% of US workers already have observed AI task coverage, and AI-exposed workers earn 47% more than unexposed workers, the classic early-adopter premium. A phase that took electricity 25 years effectively completed in under 3 for AI.",
    workerEffect: "Spreads across sectors; high-skill workers benefit most",
  },
  {
    phase: "III",
    name: "Displacement",
    duration: "10–30 yrs",
    aiDuration: "~1–3 yrs (beginning now)",
    description:
      "Routine-task workers face wage pressure and job loss. The technology is now cheap and reliable enough to substitute for labor at scale.",
    example:
      "Power looms destroyed 250,000+ handloom weaving jobs. Telephone operators, bank tellers, and typists were decimated by computers.",
    aiNote:
      "For AI: displacement signals are emerging but not yet systematic. Anthropic (2026) found no statistically significant unemployment increase for highly AI-exposed workers (+0.20pp), but customer service reps show 70.1% and programmers 74.5% observed task exposure. Suggestive evidence that hiring of younger workers has slowed in exposed occupations. The acute displacement window that historically lasted decades could compress to 1–3 years.",
    workerEffect:
      "Routine-task workers face wage pressure and job loss",
  },
  {
    phase: "IV",
    name: "Reorganization",
    duration: "15–40 yrs",
    aiDuration: "~3–7 yrs",
    description:
      "New industries emerge; organizations restructure around the technology. The 'productivity paradox' resolves as complements develop.",
    example:
      "Factories redesigned around electric motors (1920s). The web spawned e-commerce, social media, and the app economy (2000s).",
    aiNote:
      "For AI: organizational restructuring is partially constrained by human speed, but AI itself accelerates institutional adaptation (automated compliance, AI-assisted education, rapid prototyping of new business models). The productivity paradox could resolve by the early 2030s.",
    workerEffect:
      "New industries emerge; productivity paradox resolves",
  },
  {
    phase: "V",
    name: "New Equilibrium",
    duration: "Ongoing",
    aiDuration: "~7–15 yrs out",
    description:
      "Higher average wages; completely different job distribution. The economy has absorbed the GPT and a new normal emerges.",
    example:
      "By 1950, electrification was invisible infrastructure. By 2020, 'using a computer' wasn't a skill. It was assumed.",
    aiNote:
      "For AI: at 10x compression, a new occupational equilibrium could emerge by the mid-2030s to early 2040s. That's within the careers of workers being displaced today, not their grandchildren's.",
    workerEffect:
      "Higher avg wages; completely different job distribution",
  },
];

const AI_POSITION = 1.5; // Between Phase II and III (0-indexed)
const WALK_DURATION_MS = 2800;
const TARGET_LEFT = `${((AI_POSITION + 0.5) / PHASES.length) * 100}%`;

/** Phase-specific icons — small, geometric */
function PhaseIcon({ phase, active }: { phase: string; active: boolean }) {
  const color = active ? "white" : "var(--muted)";
  const size = 11;
  const icons: Record<string, JSX.Element> = {
    I: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke={color} strokeWidth="1.5"/><path d="M8 2v2m0 8v2M2 8h2m8 0h2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    II: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 13l5-10 5 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    III: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M2 12l4-4 3 3 5-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    IV: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="10" rx="1.5" stroke={color} strokeWidth="1.5"/><path d="M6 8h4m-2-2v4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    V: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke={color} strokeWidth="1.5"/><path d="M8 5v3l2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  return icons[phase] ?? null;
}

/** Walking robot SVG — front-facing with animated legs, 30% larger */
function WalkingRobot({ walking, leaning }: { walking: boolean; leaning: boolean }) {
  const legStyle = (anim: string): React.CSSProperties => ({
    transformOrigin: anim === "robot-step-l" ? "8px 21px" : "14px 21px",
    animation: walking ? `${anim} 0.3s linear infinite` : "none",
    transform: leaning
      ? anim === "robot-step-l"
        ? "rotate(6deg) translateX(2px)"
        : "rotate(-2deg)"
      : undefined,
    transition: "transform 0.4s ease",
  });

  const spring = "cubic-bezier(0.34,1.56,0.64,1)";

  return (
    <svg
      width="27"
      height="36"
      viewBox="0 0 22 29"
      fill="none"
      aria-hidden="true"
      className="robot-walking"
      style={{
        overflow: "visible",
        animation: walking ? "robot-bob 0.3s linear infinite" : "none",
        filter: "drop-shadow(0 1px 2px rgba(92,97,246,0.2))",
      }}
    >
      {/* Upper body — tilts on lean */}
      <g
        style={{
          transformOrigin: "11px 21px",
          transform: leaning ? "rotate(6deg)" : "rotate(0deg)",
          transition: `transform 0.6s ${spring}`,
        }}
      >
        {/* Antenna */}
        <line x1="11" y1="0.5" x2="11" y2="4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="0.5" r="1.5" fill="var(--accent)" opacity={walking ? "1" : leaning ? "1" : "0.7"}>
          {leaning && (
            <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
          )}
        </circle>

        {/* Head */}
        <rect x="3" y="4" width="16" height="10" rx="2.5" fill="var(--accent)" />
        {/* Eyes */}
        <rect x="5.5" y="7" width="3.5" height="3" rx="1" fill="white" />
        <rect x="13" y="7" width="3.5" height="3" rx="1" fill="white" />
        {/* Mouth — wider smirk when leaning */}
        <rect
          x={leaning ? 6.5 : 8}
          y="11.5"
          width={leaning ? 9 : 6}
          height="1.5"
          rx="0.75"
          fill="white"
          opacity="0.5"
        />

        {/* Body */}
        <rect x="4.5" y="14.5" width="13" height="7" rx="2" fill="var(--accent)" opacity="0.85" />

        {/* Left arm */}
        <rect x="1.5" y="15.5" width="2.5" height="5" rx="1" fill="var(--accent)" opacity="0.6" />
        {/* Right arm — reaches toward cane on lean */}
        <g
          style={{
            transformOrigin: "19px 15.5px",
            transform: leaning ? "rotate(14deg)" : "rotate(0deg)",
            transition: `transform 0.5s ${spring}`,
          }}
        >
          <rect x="18" y="15.5" width="2.5" height="5" rx="1" fill="var(--accent)" opacity="0.6" />
        </g>
      </g>

      {/* Left leg — crosses in front on lean */}
      <g style={legStyle("robot-step-l")}>
        <rect x="5.5" y="21.5" width="3.5" height="5" rx="1.2" fill="var(--accent)" opacity="0.75" />
        <rect x="4.5" y="25.5" width="5" height="2.5" rx="1" fill="var(--accent)" opacity="0.6" />
      </g>

      {/* Right leg */}
      <g style={legStyle("robot-step-r")}>
        <rect x="13" y="21.5" width="3.5" height="5" rx="1.2" fill="var(--accent)" opacity="0.75" />
        <rect x="12.5" y="25.5" width="5" height="2.5" rx="1" fill="var(--accent)" opacity="0.6" />
      </g>

      {/* Cane — swings into place on lean */}
      <g
        style={{
          opacity: leaning ? 1 : 0,
          transform: leaning ? "rotate(0deg)" : "rotate(-40deg)",
          transformOrigin: "20px 18px",
          transition: `all 0.5s ${spring}`,
        }}
      >
        {/* Shaft */}
        <line x1="20" y1="18" x2="22" y2="29" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
        {/* Curved handle */}
        <path d="M20,18 Q20,15.5 17.5,15.5" stroke="#6B5335" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Tip */}
        <circle cx="22" cy="29" r="0.8" fill="#6B5335" />
      </g>
    </svg>
  );
}

export default function GPTTimeline() {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [pulsingNode, setPulsingNode] = useState<number | null>(null);
  const [walkStarted, setWalkStarted] = useState(false);
  const [walkDone, setWalkDone] = useState(false);
  const [leaning, setLeaning] = useState(false);
  const reducedMotion = useRef(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Trigger walk when timeline scrolls into view
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          obs.disconnect();
          if (reducedMotion.current) {
            setWalkStarted(true);
            setWalkDone(true);
            setLeaning(true);
          } else {
            setWalkStarted(true);
            setTimeout(() => {
              setWalkDone(true);
              setTimeout(() => setLeaning(true), 300);
            }, WALK_DURATION_MS);
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handlePhaseHover = (i: number) => {
    setActivePhase(i);
    if (!reducedMotion.current) {
      setPulsingNode(i);
      setTimeout(() => setPulsingNode(null), 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Desktop timeline */}
      <div className="hidden md:block" ref={timelineRef}>
        <div className="relative pt-8">
          {/* Track */}
          <div className="h-1 bg-black/[0.06] rounded-full mx-8" />

          {/* Walking robot — walks from left edge of track to AI position */}
          <div
            className="absolute z-[1] flex flex-col items-center"
            style={{
              // feet sit directly on the track line: track top is at pt-8 (2rem)
              top: "calc(2rem + 2px)",
              transform: "translateX(-50%) translateY(-100%)",
              left: walkStarted ? TARGET_LEFT : "2rem",
              transition: walkStarted
                ? `left ${WALK_DURATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
                : "none",
            }}
          >
            <WalkingRobot walking={walkStarted && !walkDone} leaning={leaning} />
            {/* Label fades in after walk completes */}
            <span
              className="text-[7px] font-bold text-[var(--accent)] tracking-wider whitespace-nowrap mt-0.5"
              style={{
                opacity: walkDone ? 1 : 0,
                transition: walkDone ? "opacity 0.5s ease 0.2s" : "none",
              }}
            >
              AI IS HERE
            </span>
          </div>

          {/* Phases */}
          <div className="flex justify-between relative z-[5] -mt-3.5">
            {PHASES.map((p, i) => {
              const isActive = activePhase === i;

              return (
                <button
                  key={p.phase}
                  onClick={() =>
                    setActivePhase(isActive ? null : i)
                  }
                  onMouseEnter={() => handlePhaseHover(i)}
                  className="flex flex-col items-center flex-1 group cursor-pointer"
                >
                  {/* Node with pulse ring */}
                  <div className="relative">
                    {pulsingNode === i && (
                      <div
                        className="phase-pulse-ring absolute inset-0 rounded-full"
                        style={{
                          boxShadow: `0 0 0 0 rgba(92,97,246,0.4)`,
                          animation: "phase-ring-pulse 0.5s ease-out forwards",
                        }}
                      />
                    )}
                    <div
                      className={`timeline-node w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                        isActive
                          ? "bg-[var(--accent)] border-[var(--accent)] text-white scale-110 shadow-[0_0_0_4px_rgba(92,97,246,0.15)]"
                          : "bg-white border-black/[0.15] text-[var(--muted)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
                      }`}
                    >
                      <PhaseIcon phase={p.phase} active={isActive} />
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={`mt-2 text-[11px] font-semibold tracking-wide text-center ${
                      isActive
                        ? "text-[var(--foreground)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {p.name}
                  </span>

                  {/* Duration */}
                  <span className="text-[10px] text-[var(--muted)] mt-0.5">
                    {p.duration}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile timeline — vertical */}
      <div className="md:hidden space-y-0">
        {PHASES.map((p, i) => {
          const isActive = activePhase === i;
          const showAIMarker = i === 1;

          return (
            <div key={p.phase}>
              <button
                onClick={() =>
                  setActivePhase(isActive ? null : i)
                }
                className="flex items-start gap-3 w-full text-left py-3"
              >
                {/* Vertical track */}
                <div className="flex flex-col items-center">
                  <div
                    className={`timeline-node w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      isActive
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_0_0_4px_rgba(92,97,246,0.15)]"
                        : "bg-white border-black/[0.15] text-[var(--muted)]"
                    }`}
                  >
                    {p.phase}
                  </div>
                  {i < PHASES.length - 1 && (
                    <div className="w-px h-full min-h-[20px] bg-black/[0.08]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-2">
                  <span className="text-[13px] font-semibold text-[var(--foreground)]">
                    {p.name}
                  </span>
                  <span className="text-[11px] text-[var(--muted)] ml-2">
                    {p.duration}
                  </span>
                  <p className="text-[12px] text-[var(--muted)] mt-0.5">
                    {p.workerEffect}
                  </p>
                </div>
              </button>

              {/* AI marker after Phase II */}
              {showAIMarker && (
                <div className="flex items-center gap-2 py-2 ml-0.5">
                  <svg width="20" height="24" viewBox="0 0 22 30" fill="none" aria-hidden="true">
                    <line x1="11" y1="0.5" x2="11" y2="4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="11" cy="0.5" r="1.5" fill="var(--accent)" />
                    <rect x="3" y="4" width="16" height="10" rx="2.5" fill="var(--accent)" />
                    <rect x="5.5" y="7" width="3.5" height="3" rx="1" fill="white" />
                    <rect x="13" y="7" width="3.5" height="3" rx="1" fill="white" />
                    <rect x="8" y="11.5" width="6" height="1.5" rx="0.75" fill="white" opacity="0.5" />
                    <rect x="4.5" y="14.5" width="13" height="7" rx="2" fill="var(--accent)" opacity="0.85" />
                    <rect x="5.5" y="21.5" width="3.5" height="5" rx="1.2" fill="var(--accent)" opacity="0.75" />
                    <rect x="4.5" y="25.5" width="5" height="2.5" rx="1" fill="var(--accent)" opacity="0.6" />
                    <rect x="13" y="21.5" width="3.5" height="5" rx="1.2" fill="var(--accent)" opacity="0.75" />
                    <rect x="12.5" y="25.5" width="5" height="2.5" rx="1" fill="var(--accent)" opacity="0.6" />
                  </svg>
                  <span className="text-[10px] font-bold text-[var(--accent)] tracking-wide">
                    AI IS HERE
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active phase detail card */}
      {activePhase !== null && (
        <div className="revolution-content border border-black/[0.06] rounded-lg p-5 bg-[var(--accent-light)]/30">
          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
            <span className="text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider">
              Phase {PHASES[activePhase].phase}
            </span>
            <span className="text-[14px] font-semibold text-[var(--foreground)]">
              {PHASES[activePhase].name}
            </span>
            <span className="text-[12px] text-[var(--muted)]">
              Historical: {PHASES[activePhase].duration}
            </span>
            <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
              AI: {PHASES[activePhase].aiDuration}
            </span>
          </div>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
            {PHASES[activePhase].description}
          </p>
          <p className="text-[12px] text-[var(--foreground)]/70 leading-relaxed italic mb-3">
            <span className="font-semibold not-italic text-[var(--foreground)]">
              Historical example:
            </span>{" "}
            {PHASES[activePhase].example}
          </p>
          <p className="text-[12px] text-[var(--accent)] leading-relaxed">
            {PHASES[activePhase].aiNote}
          </p>
        </div>
      )}

      {activePhase === null && (
        <p className="text-[12px] text-[var(--muted)] text-center">
          Click or hover on a phase to learn more
        </p>
      )}
    </div>
  );
}
