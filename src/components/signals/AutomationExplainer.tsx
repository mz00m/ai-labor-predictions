"use client";

import { useState, useEffect, Fragment } from "react";
import type { SignalMetrics } from "@/lib/signal-types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AutomationExplainerProps {
  metrics: SignalMetrics;
}

interface StepConfig {
  id: string;
  label: string;
  icon: JSX.Element;
  statLabel?: string | JSX.Element;
  description: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG, 20x20, stroke-based)                           */
/* ------------------------------------------------------------------ */

const DownloadIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 3v10m0 0l-3-3m3 3l3-3" />
    <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" />
  </svg>
);

const CogIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="3" />
    <path d="M10 1v2m0 14v2M1 10h2m14 0h2m-2.64-6.36l-1.42 1.42M5.06 14.94l-1.42 1.42m0-12.72l1.42 1.42m9.88 9.88l1.42 1.42" />
  </svg>
);

const TrendUpIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 15 8 9 12 12 17 5" />
    <polyline points="13 5 17 5 17 9" />
  </svg>
);

const PeopleIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="7" cy="7" r="2.5" />
    <path d="M2 17v-1a4 4 0 014-4h2a4 4 0 014 4v1" />
    <circle cx="14" cy="8" r="2" />
    <path d="M14 12.5a3.5 3.5 0 013.5 3.5v1" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Step configuration                                                 */
/* ------------------------------------------------------------------ */

function getSteps(metrics: SignalMetrics): StepConfig[] {
  return [
    {
      id: "tools",
      label: "Tool Adoption",
      icon: DownloadIcon,
      statLabel: `${metrics.totalToolCount} tools tracked`,
      description: "Developers download AI automation tools",
      color: "#5C61F6",
    },
    {
      id: "tasks",
      label: "Task Automation",
      icon: CogIcon,
      description: "Tools automate specific tasks within jobs",
      color: "#d97706",
    },
    {
      id: "productivity",
      label: "Productivity Absorption",
      icon: TrendUpIcon,
      description: "Fewer workers produce the same output",
      color: "#16a34a",
    },
    {
      id: "jobs",
      label: "Firm Response",
      icon: PeopleIcon,
      statLabel: (
        <span
          className="flex items-center gap-1 justify-center flex-wrap underline-offset-2 hover:underline decoration-[var(--muted)]"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById("productivity-paths")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="flex items-center gap-0.5" style={{ color: "#dc2626" }}>
            <span className="text-[13px] leading-none" style={{ opacity: 0.6 }}>▼</span> Reduce
          </span>
          <span className="text-[var(--muted)]">/</span>
          <span style={{ color: "#5C61F6" }}>Amplify</span>
          <span className="text-[var(--muted)]">/</span>
          <span className="flex items-center gap-0.5" style={{ color: "#16a34a" }}>
            <span className="text-[13px] leading-none" style={{ opacity: 0.6 }}>▲</span>
            Expand
          </span>
        </span>
      ),
      description: "Firms reduce jobs, amplify output, or expand offerings",
      color: "#dc2626",
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StepNode({ step }: { step: StepConfig }) {
  return (
    <div className="flex-1 flex flex-col items-center text-center px-2 sm:px-3 py-3 min-w-0">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: step.color + "1a", color: step.color }}
      >
        {step.icon}
      </div>
      <p
        className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1"
        style={{ color: step.color }}
      >
        {step.label}
      </p>
      {step.statLabel && (
        <p className="text-[13px] font-mono font-medium stat-number text-[var(--foreground)] mb-1">
          {step.statLabel}
        </p>
      )}
      <p className="text-[11px] text-[var(--muted)] leading-snug max-w-[180px]">
        {step.description}
      </p>
    </div>
  );
}

function Connector({ isDashed, label }: { isDashed?: boolean; label?: string }) {
  const lineColor = isDashed ? "#9ca3af" : "#d1d5db";
  return (
    <>
      {/* Desktop: horizontal arrow */}
      <div
        className="hidden sm:flex flex-col items-center justify-center shrink-0 relative"
        style={{ width: "48px" }}
      >
        {label && (
          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
            {label}
          </span>
        )}
        <div className="w-full flex items-center">
          <div
            className={`flex-1 h-0 ${isDashed ? "connector-lag" : ""}`}
            style={{
              borderTop: isDashed
                ? `2px dashed ${lineColor}`
                : `2px solid ${lineColor}`,
            }}
          />
          <svg
            width="6"
            height="8"
            viewBox="0 0 6 8"
            className="shrink-0 -ml-px"
            fill={lineColor}
            aria-hidden="true"
          >
            <path d="M0 0L6 4L0 8Z" />
          </svg>
        </div>
      </div>
      {/* Mobile: vertical arrow */}
      <div className="flex sm:hidden flex-col items-center py-0.5">
        {label && (
          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] mb-0.5">
            {label}
          </span>
        )}
        <div className="flex flex-col items-center">
          <div
            className="w-0 h-4"
            style={{
              borderLeft: isDashed
                ? `2px dashed ${lineColor}`
                : `2px solid ${lineColor}`,
            }}
          />
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            className="shrink-0 -mt-px"
            fill={lineColor}
            aria-hidden="true"
          >
            <path d="M0 0L4 6L8 0Z" />
          </svg>
        </div>
      </div>
    </>
  );
}

function ExpandedContent({ metrics }: { metrics: SignalMetrics }) {
  const sections = [
    {
      color: "#5C61F6",
      title: "Developers download tools",
      content: (
        <>
          <p>
            Every tool on this page automates a specific category of work.{" "}
            <code>browser-use</code> automates clicking through websites.{" "}
            <code>faster-whisper</code> automates transcription.{" "}
            <code>docling</code> automates document processing. When download
            counts spike, it means more teams are building systems to perform
            these tasks without a human.
          </p>
          <p>
            We currently track {metrics.totalToolCount} tools across{" "}
            {metrics.industries.length} industries, with{" "}
            {metrics.surgingPackages.length} flagged as surging.
          </p>
        </>
      ),
    },
    {
      color: "#d97706",
      title: "Tasks get automated, not jobs",
      content: (
        <p>
          A paralegal&apos;s job includes document review, legal research,
          deadline tracking, and client communication. AI tools are automating
          the first two tasks right now &mdash; but not the last two. This is
          why employment numbers often lag tool adoption: the job still exists,
          but it&apos;s shrinking. One paralegal can now do what three did
          before.
        </p>
      ),
    },
    {
      color: "#16a34a",
      title: "Productivity absorbs the impact \u2014 until it doesn\u2019t",
      content: (
        <>
          <p>
            When AI automates 30% of a role&apos;s tasks, companies don&apos;t
            immediately cut 30% of headcount. Instead, remaining workers become
            more productive. This is the{" "}
            <strong className="text-[var(--accent)]">
              productivity absorption phase
            </strong>{" "}
            &mdash; output stays the same (or grows) with fewer hours of human
            labor per unit of work.
          </p>
          <p>
            The inflection point comes when the economics shift: when it&apos;s
            cheaper to restructure teams around AI-augmented workflows than to
            keep headcount flat. That&apos;s when employment numbers start to
            move. The gap between tool adoption growth and employment decline on
            this page is, roughly, a measure of how long the productivity
            absorption phase lasts in each industry.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Important caveat:</strong>{" "}
            Historical technology transitions suggest a 2&ndash;10 year lag
            between tool adoption and measurable employment effects. For AI,
            this timeline is unknown. Downloads are a signal of builder intent,
            not a guarantee of labor market impact &mdash; many tools are
            exploratory, and organizational adoption lags developer
            experimentation significantly.
          </p>
        </>
      ),
    },
    {
      color: "#dc2626",
      title: "The task composition determines vulnerability",
      content: (
        <p>
          Not all jobs within an industry are equally exposed. The key variable
          is what percentage of the job&apos;s tasks are automatable with
          current tools. A job that&apos;s 80% document review and 20%
          relationship management is more vulnerable than one that&apos;s 20%
          document review and 80% relationship management &mdash; even though
          both sit in the same BLS employment category.
        </p>
      ),
    },
    {
      color: "#5C61F6",
      title: "What this page measures",
      content: (
        <>
          <p>
            We track the leading edge of this chain. Package downloads are a
            proxy for how many teams are actively building automation for
            specific task categories. By the time these tools are in production
            and affecting headcount, the signal appeared here months earlier
            &mdash; just like construction permits precede new buildings.
          </p>
          <p>
            The industries where tool adoption is growing fastest and employment
            is already declining are furthest along this chain. Industries where
            tools are surging but employment hasn&apos;t moved yet may be in the
            productivity absorption phase &mdash; and worth watching closely.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="pt-5 space-y-5">
      <h3 className="text-[16px] font-bold text-[var(--foreground)]">
        How AI Automation Reaches the Labor Market
      </h3>
      {sections.map((section) => (
        <div
          key={section.title}
          className="pl-4 border-l-2"
          style={{ borderColor: section.color }}
        >
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            {section.title}
          </h4>
          <div className="text-[13px] text-[var(--muted)] leading-relaxed space-y-2 [&_code]:font-mono [&_code]:text-[12px] [&_code]:text-[var(--foreground)] [&_code]:bg-black/[0.04] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded">
            {section.content}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function AutomationExplainer({
  metrics,
}: AutomationExplainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const steps = getSteps(metrics);

  return (
    <section>
      {/* Connector pulse animation for lag arrow */}
      <style>{`
        @keyframes connector-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .connector-lag {
          animation: connector-pulse 2.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .connector-lag { animation: none; opacity: 1; }
        }
      `}</style>

      <div
        className={`rounded-xl border bg-white ${
          isExpanded ? "border-black/[0.12]" : "border-black/[0.06]"
        }`}
        style={{
          transition: reducedMotion ? "none" : "border-color 150ms ease",
        }}
      >
        {/* Clickable header + flow diagram */}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full text-left p-4 sm:p-6 cursor-pointer"
          aria-expanded={isExpanded}
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
              How AI Automation Works
            </p>
            <span className="text-[11px] text-[var(--accent)] flex items-center gap-1">
              {isExpanded ? "Collapse" : "Learn more"}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isExpanded ? "rotate-180" : ""}
                style={{
                  transition: reducedMotion ? "none" : "transform 200ms ease",
                }}
                aria-hidden="true"
              >
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </span>
          </div>

          {/* Flow diagram */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
            {steps.map((step, i) => (
              <Fragment key={step.id}>
                <StepNode step={step} />
                {i < steps.length - 1 && (
                  <Connector
                    isDashed={i === 2}
                    label={i === 2 ? "lag" : undefined}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </button>

        {/* Expandable content */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: isExpanded ? "1fr" : "0fr",
            transition: reducedMotion
              ? "none"
              : "grid-template-rows 350ms ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div className="px-4 sm:px-6 pb-6">
              <div className="border-t border-black/[0.06] pt-5">
                <ExpandedContent metrics={metrics} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
