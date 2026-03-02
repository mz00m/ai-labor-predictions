"use client";

import { useState } from "react";

const PHASES = [
  {
    phase: "I",
    name: "Emergence",
    duration: "5–20 yrs",
    aiDuration: "~10 yrs (2012–2022)",
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
    aiDuration: "~2–5 yrs (2022–now)",
    description:
      "Spreads across sectors; high-skill workers who adopt early benefit most. Productivity rises faster than wages.",
    example:
      "By 1900, electric motors were spreading across US factories but most still used shaft-and-belt power. Early adopters saw enormous gains.",
    aiNote:
      "For AI: ChatGPT hit 100M users in 2 months; 54.6% of US adults used gen AI by 2025 (St. Louis Fed). Enterprise adoption surged from 33% to 88% in ~2 years (McKinsey). Microsoft quantifies this as '5x faster than the internet.' This phase that took electricity 25 years is happening in 2–5 for AI — built on PCs and internet already in place.",
    workerEffect: "Spreads across sectors; high-skill workers benefit most",
  },
  {
    phase: "III",
    name: "Displacement",
    duration: "10–30 yrs",
    aiDuration: "~5–15 yrs (beginning now)",
    description:
      "Routine-task workers face wage pressure and job loss. The technology is now cheap and reliable enough to substitute for labor at scale.",
    example:
      "Power looms destroyed 250,000+ handloom weaving jobs. Telephone operators, bank tellers, and typists were decimated by computers.",
    aiNote:
      "For AI: early displacement signals are already visible — content writing, customer service, and junior coding roles are seeing wage pressure. The acceleration factor compresses what historically took decades into years.",
    workerEffect:
      "Routine-task workers face wage pressure and job loss",
  },
  {
    phase: "IV",
    name: "Reorganization",
    duration: "15–40 yrs",
    aiDuration: "~7–20 yrs",
    description:
      "New industries emerge; organizations restructure around the technology. The 'productivity paradox' resolves as complements develop.",
    example:
      "Factories redesigned around electric motors (1920s). The web spawned e-commerce, social media, and the app economy (2000s).",
    aiNote:
      "For AI: this phase is constrained by human/institutional speed — education systems, regulations, and corporate culture can't be updated via software. Expect some compression but not as dramatic as the adoption phase.",
    workerEffect:
      "New industries emerge; productivity paradox resolves",
  },
  {
    phase: "V",
    name: "New Equilibrium",
    duration: "Ongoing",
    aiDuration: "~20–40 yrs out",
    description:
      "Higher average wages; completely different job distribution. The economy has absorbed the GPT and a new normal emerges.",
    example:
      "By 1950, electrification was invisible infrastructure. By 2020, 'using a computer' was not a skill — it was assumed.",
    aiNote:
      "For AI: if the pattern holds at 2–3x compression, a new equilibrium could emerge by the 2050s–2060s rather than the 2080s–2090s that a historical baseline would predict.",
    workerEffect:
      "Higher avg wages; completely different job distribution",
  },
];

const AI_POSITION = 1.5; // Between Phase II and III (0-indexed)

export default function GPTTimeline() {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Desktop timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Track */}
          <div className="h-1 bg-black/[0.06] rounded-full mx-8" />

          {/* Phases */}
          <div className="flex justify-between relative -mt-3.5">
            {PHASES.map((p, i) => {
              const isActive = activePhase === i;
              const isAI =
                i === Math.floor(AI_POSITION) ||
                i === Math.ceil(AI_POSITION);

              return (
                <button
                  key={p.phase}
                  onClick={() =>
                    setActivePhase(isActive ? null : i)
                  }
                  onMouseEnter={() => setActivePhase(i)}
                  className="flex flex-col items-center flex-1 group cursor-pointer"
                >
                  {/* Node */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white scale-110"
                        : "bg-white border-black/[0.15] text-[var(--muted)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
                    }`}
                  >
                    {p.phase}
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

          {/* AI position indicator — between Phase II and III */}
          <div
            className="absolute top-0 -mt-8 flex flex-col items-center"
            style={{
              left: `${((AI_POSITION + 0.5) / PHASES.length) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center gap-1.5 bg-[var(--accent)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              AI is here
            </div>
            <div className="w-px h-4 bg-[var(--accent)]" />
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
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      isActive
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white"
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
                <div className="flex items-center gap-3 py-2 ml-1">
                  <div className="flex items-center gap-1.5 bg-[var(--accent)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    AI is here
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active phase detail card */}
      {activePhase !== null && (
        <div className="border border-black/[0.06] rounded-lg p-5 bg-[var(--accent-light)]/30">
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
