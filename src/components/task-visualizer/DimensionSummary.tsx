"use client";

import { useState, useRef, useEffect } from "react";
import { DIMENSION_META, type DimensionKey } from "@/lib/composite-risk";

export interface DimensionScoreData {
  scores: Record<DimensionKey, number>;
  dimensionality: {
    effectiveDimensions: number;
    complementarityBase: number;
    dimensionalityAdj: number;
    source: "cfo" | "heuristic";
  };
}

interface Props {
  data: DimensionScoreData;
  jobTitle: string;
}

const BAR_DIMENSIONS: DimensionKey[] = [
  "technicalExposure",
  "adoptionSpeed",
  "adaptability",
  "demandElasticity",
  "complementarity",
];

/** Plain-language explainers + links for each dimension */
const DIMENSION_TIPS: Record<
  string,
  { tip: string; link?: string }
> = {
  technicalExposure: {
    tip: "How many of this job's tasks can AI actually perform today? Based on GPT-scored analysis of 342 occupations validated against 6 academic exposure indices.",
    link: "/occupation-exposure#methodology-exposure",
  },
  adoptionSpeed: {
    tip: "How fast will firms in this sector actually deploy AI? Regulated industries and complex organizations lag years behind tech companies.",
    link: "/occupation-exposure#methodology-adoption",
  },
  adaptability: {
    tip: "Can workers transition to new roles? Based on financial buffers, transferable skills, geographic job density, and age demographics.",
    link: "/occupation-exposure#methodology-adaptability",
  },
  demandElasticity: {
    tip: "When AI makes this work cheaper, does demand grow enough to offset job losses? ATMs led to more bank tellers for 30 years.",
    link: "/occupation-exposure#methodology-elasticity",
  },
  complementarity: {
    tip: "Does AI replace workers or make them more productive? Jobs with more distinct task clusters tend toward augmentation — AI handles some tasks so you can focus on the rest.",
    link: "/occupation-exposure#methodology-complementarity",
  },
};

function riskColor(value: number): string {
  return value > 6 ? "#DC2626" : value > 4 ? "#D97706" : "#059669";
}

function scoreColor(value: number, isPressure: boolean): string {
  if (isPressure) {
    return value > 6 ? "#DC2626" : value > 3 ? "#D97706" : "#059669";
  }
  return value > 6 ? "#059669" : value > 3 ? "#D97706" : "#DC2626";
}

/** Build specific buffer/pressure language from the actual scores */
function bufferDetail(scores: Record<DimensionKey, number>): {
  strongestBuffer: string;
  pressureNote: string;
  actionable: string;
} {
  const buffers: { key: string; score: number; strong: string; action: string }[] = [
    {
      key: "adaptability",
      score: scores.adaptability,
      strong: "the people who do this work tend to have transferable skills and the financial capacity to make a transition if they need to",
      action: "Focus on building AI fluency in your specific domain. Your existing skills transfer well to adjacent roles, and the workers who combine deep expertise with comfort using AI tools will have the strongest hand as the field shifts.",
    },
    {
      key: "demandElasticity",
      score: scores.demandElasticity,
      strong: "when AI makes this kind of work cheaper to produce, demand for the output tends to grow. Historically, that pattern has preserved or even expanded employment in fields like this one",
      action: "Focus on moving toward the higher-complexity, higher-judgment work in your field. As AI brings costs down, expect more demand for this kind of work, not less. The people who can handle the volume and the harder cases that expansion brings will be the most valuable.",
    },
    {
      key: "complementarity",
      score: scores.complementarity,
      strong: "AI tends to make people in this role more productive rather than replacing them, especially on tasks that require combining judgment across multiple skill areas",
      action: "Focus on the parts of your work where AI makes you faster and better, not redundant. The people who learn to use AI for the routine subtasks will free up time for the higher-value work that clients and employers actually pay a premium for.",
    },
  ];

  const sorted = [...buffers].sort((a, b) => b.score - a.score);
  const best = sorted[0];

  const fastAdoption = scores.adoptionSpeed > 6;
  const pressureNote = fastAdoption
    ? "This is a sector that tends to adopt new technology quickly, so the timeline for change is shorter than in other fields."
    : "This is a sector where adoption tends to be gradual, which means there is more time to prepare than in faster-moving industries.";

  return {
    strongestBuffer: best.strong,
    pressureNote,
    actionable: best.action,
  };
}

/** Generate a worker-friendly summary based on the scores */
export function workerSummary(
  scores: Record<DimensionKey, number>,
  jobTitle: string
): { headline: string; context: string; action: string } {
  const risk = scores.netRisk;
  const detail = bufferDetail(scores);
  const exposureLevel = scores.technicalExposure > 7
    ? "a high share"
    : scores.technicalExposure > 4
      ? "a meaningful share"
      : "a smaller share";

  const article = /^[aeiou]/i.test(jobTitle) ? "an" : "a";

  if (risk <= 3.5) {
    return {
      headline: `The job of ${article} ${jobTitle.toLowerCase()} has strong structural protection against AI displacement.`,
      context: `AI can currently perform ${exposureLevel} of the tasks involved in this work, but ${detail.strongestBuffer}. ${detail.pressureNote}`,
      action: detail.actionable,
    };
  }

  if (risk <= 5.5) {
    return {
      headline: `The job of ${article} ${jobTitle.toLowerCase()} faces moderate AI pressure, but has real room to adapt.`,
      context: `AI can currently perform ${exposureLevel} of the tasks involved in this work. The important context: ${detail.strongestBuffer}. ${detail.pressureNote}`,
      action: detail.actionable,
    };
  }

  return {
    headline: `The job of ${article} ${jobTitle.toLowerCase()} faces significant AI pressure, which means acting now matters most.`,
    context: `AI can currently perform ${exposureLevel} of the tasks involved in this work, and that share is growing. That said, ${detail.strongestBuffer}. ${detail.pressureNote}`,
    action: detail.actionable,
  };
}

function Tooltip({
  tip,
  link,
  children,
}: {
  tip: string;
  link?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="cursor-help"
      >
        {children}
      </div>
      {open && (
        <div className="absolute z-50 bottom-full left-0 mb-1.5 w-[240px] p-2.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-[11px] leading-relaxed shadow-xl">
          <p className="opacity-90">{tip}</p>
          {link && (
            <a
              href={link}
              className="inline-block mt-1.5 text-[10px] font-medium opacity-70 hover:opacity-100 underline"
            >
              Learn more
            </a>
          )}
          <div className="absolute top-full left-4 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--foreground)]" />
        </div>
      )}
    </div>
  );
}

export default function DimensionSummary({ data, jobTitle }: Props) {
  const { scores } = data;
  const rc = riskColor(scores.netRisk);
  void jobTitle; // used by parent via workerSummary export

  return (
    <div
      id="dimension-summary"
      className="mt-5 pt-5 border-t border-black/[0.06]"
    >
      <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-3">
        Displacement risk
      </h4>

      {/* Net risk score */}
      <div
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-4"
        style={{ background: rc + "0A" }}
      >
        <span
          className="text-[26px] font-black leading-none"
          style={{
            fontFamily: "'DM Mono', monospace",
            color: rc,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {scores.netRisk.toFixed(1)}
        </span>
        <div>
          <p className="text-[12px] font-semibold" style={{ color: rc }}>
            {scores.netRisk > 6
              ? "Higher displacement risk"
              : scores.netRisk > 4
                ? "Moderate displacement risk"
                : "Lower displacement risk"}
          </p>
          <p className="text-[10px] text-[var(--muted)]">
            Net risk score (0-10)
          </p>
        </div>
      </div>

      {/* 5 dimension bars with tooltips */}
      <div className="space-y-2.5">
        {BAR_DIMENSIONS.map((dim) => {
          const meta = DIMENSION_META[dim];
          const value = scores[dim];
          const pct = (value / 10) * 100;
          const color = scoreColor(value, meta.isPressure);
          const tipData = DIMENSION_TIPS[dim];

          return (
            <div key={dim}>
              <div className="flex items-center justify-between mb-0.5">
                <Tooltip tip={tipData.tip} link={tipData.link}>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-[var(--foreground)]">
                      {meta.shortLabel}
                    </span>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-[var(--muted)] opacity-40"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 7v4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
                    </svg>
                    <span className="text-[8px] uppercase tracking-wider text-[var(--muted)] opacity-60">
                      {meta.isPressure ? "pressure" : "buffer"}
                    </span>
                  </div>
                </Tooltip>
                <span
                  className="text-[11px] font-bold"
                  style={{ fontFamily: "'DM Mono', monospace", color }}
                >
                  {value.toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Link to full analysis */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[9px] text-[var(--muted)] opacity-60">
          Pressure dimensions drive risk up. Buffer dimensions absorb it.
        </p>
        <a
          href="/occupation-exposure"
          className="text-[10px] text-[var(--accent-text)] hover:underline whitespace-nowrap ml-2"
        >
          Full methodology
        </a>
      </div>
    </div>
  );
}
