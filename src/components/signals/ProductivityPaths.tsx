"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PathConfig {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: JSX.Element;
  description: string;
  researchDetail: JSX.Element;
  example: string;
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG, 20×20, stroke-based)                           */
/* ------------------------------------------------------------------ */

const ReduceIcon = (
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
    {/* Person with downward arrow */}
    <circle cx="8" cy="5" r="2.5" />
    <path d="M3 17v-1a4 4 0 014-4h2a4 4 0 014-4v1" />
    <path d="M15 8v7m0 0l-2.5-2.5M15 15l2.5-2.5" />
  </svg>
);

const AmplifyIcon = (
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
    {/* Upward trend with multiplier */}
    <polyline points="3 15 8 9 12 12 17 5" />
    <polyline points="13 5 17 5 17 9" />
    <path d="M3 4v0" strokeWidth="0" />
    <text
      x="2"
      y="8"
      fontSize="7"
      fontWeight="bold"
      fill="currentColor"
      stroke="none"
      fontFamily="system-ui"
    >
      ×
    </text>
  </svg>
);

const ExpandIcon = (
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
    {/* Branching paths */}
    <path d="M4 16V10" />
    <path d="M4 10l6-6" />
    <path d="M4 10l6 0" />
    <path d="M4 10l3 5" />
    <circle cx="10" cy="4" r="1.5" />
    <circle cx="10" cy="10" r="1.5" />
    <circle cx="7" cy="15" r="1.5" />
  </svg>
);

const JCurveIcon = (
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
    {/* J-shaped curve: dips then rises */}
    <path d="M3 6c0 4 2 8 5 8s3-2 4-5c1-3 2-5 5-5" />
  </svg>
);

const LightningIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 1L3 9h4l-1 6 6-8H8l1-6z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Path configuration                                                 */
/* ------------------------------------------------------------------ */

const PATHS: PathConfig[] = [
  {
    id: "reduce",
    title: "Reduce",
    subtitle: "Same output, fewer workers",
    color: "#dc2626",
    icon: ReduceIcon,
    description:
      "Firms maintain output levels while reducing headcount. Early research shows entry-level roles are hit hardest.",
    researchDetail: (
      <>
        <p>
          Employment for 22&ndash;25 year olds in AI-exposed occupations
          declined ~16% since late 2022, while experienced workers remained
          stable or grew.
        </p>
        <p className="mt-2">
          <a
            href="https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            Brynjolfsson, Chandar &amp; Chen (2025)
          </a>{" "}
          &mdash; Stanford Digital Economy Lab
        </p>
        <p className="mt-2">
          Corroborated by{" "}
          <a
            href="https://www.adpresearch.com/yes-ai-is-affecting-employment-heres-the-data/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            ADP Research (2025)
          </a>{" "}
          payroll data showing hiring slowdowns concentrated in entry-level
          positions within AI-exposed industries.
        </p>
      </>
    ),
    example:
      "IBM replaced several hundred back-office HR positions with AI agents, consolidating routine processing that previously required large junior teams.",
  },
  {
    id: "amplify",
    title: "Amplify",
    subtitle: "Same team, more output",
    color: "#16a34a",
    icon: AmplifyIcon,
    description:
      "Existing workers become dramatically more productive. The team stays the same size but output per person increases significantly.",
    researchDetail: (
      <>
        <p>
          Customer support agents using AI resolved 14&ndash;15% more issues per
          hour, with gains up to 35% for the least experienced workers.
          Microsoft/Accenture field experiments showed ~26% increase in completed
          pull requests for developers.
        </p>
        <p className="mt-2">
          <a
            href="https://academic.oup.com/qje/article/140/2/889/7990658"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            Brynjolfsson, Li &amp; Raymond (2025)
          </a>{" "}
          &mdash; Quarterly Journal of Economics
        </p>
      </>
    ),
    example:
      "A 50-person support team handles the volume that previously required 70 people, with faster resolution times and higher customer satisfaction scores.",
  },
  {
    id: "expand",
    title: "Expand",
    subtitle: "New work, new roles, new markets",
    color: "#5C61F6",
    icon: ExpandIcon,
    description:
      "When the cost of work drops, firms discover more work worth doing. They expand into new offerings, serve new markets, or create entirely new roles.",
    researchDetail: (
      <>
        <p>
          This is{" "}
          <strong className="text-[var(--foreground)]">
            Jevons Paradox
          </strong>{" "}
          applied to labor: efficiency doesn&apos;t shrink demand, it grows it.
          IBM&apos;s AI-driven HR savings were reinvested into hiring more
          engineers and salespeople.
        </p>
        <p className="mt-2">
          Historical precedent: ATMs didn&apos;t eliminate bank tellers &mdash;
          they made branches cheaper to operate, so banks opened more branches,
          and total teller employment rose for decades.
        </p>
      </>
    ),
    example:
      "A marketing agency uses AI to cut production costs 40%, then expands from 3 service lines to 7, hiring specialists for the new offerings.",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PathCard({
  path,
  isExpanded,
  onToggle,
  reducedMotion,
}: {
  path: PathConfig;
  isExpanded: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
}) {
  return (
    <div
      className={`rounded-xl border ${
        isExpanded ? "border-black/[0.12] shadow-sm" : "border-black/[0.06]"
      } bg-white`}
      style={{
        transition: reducedMotion ? "none" : "border-color 150ms ease, box-shadow 150ms ease",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 sm:p-5 cursor-pointer"
        aria-expanded={isExpanded}
      >
        {/* Colored icon circle */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: path.color + "1a", color: path.color }}
        >
          {path.icon}
        </div>

        {/* Title + subtitle */}
        <p
          className="text-[13px] font-bold uppercase tracking-[0.04em] mb-0.5"
          style={{ color: path.color }}
        >
          {path.title}
        </p>
        <p className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
          {path.subtitle}
        </p>
        <p className="text-[12px] text-[var(--muted)] leading-relaxed">
          {path.description}
        </p>

        {/* Expand hint */}
        <span
          className="mt-3 flex items-center gap-1 text-[11px]"
          style={{ color: path.color }}
        >
          {isExpanded ? "Collapse" : "See research"}
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
      </button>

      {/* Expandable research detail */}
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
          <div className="px-4 sm:px-5 pb-4 sm:pb-5">
            <div className="border-t border-black/[0.06] pt-4">
              {/* Research */}
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-2">
                Research
              </p>
              <div className="text-[13px] text-[var(--muted)] leading-relaxed">
                {path.researchDetail}
              </div>

              {/* Real-world example */}
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mt-4 mb-2">
                Example
              </p>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed italic">
                {path.example}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchConnector() {
  return (
    <>
      {/* Desktop: horizontal branching lines */}
      <div
        className="hidden sm:flex justify-center mb-4"
        aria-hidden="true"
      >
        <svg
          className="w-full"
          height="28"
          viewBox="0 0 300 28"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Center trunk down */}
          <line
            x1="150"
            y1="0"
            x2="150"
            y2="10"
            stroke="#d1d5db"
            strokeWidth="1.5"
          />
          {/* Horizontal bar */}
          <line
            x1="50"
            y1="10"
            x2="250"
            y2="10"
            stroke="#d1d5db"
            strokeWidth="1.5"
          />
          {/* Left branch */}
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="24"
            stroke="#d1d5db"
            strokeWidth="1.5"
          />
          <polygon points="46,24 50,28 54,24" fill="#d1d5db" />
          {/* Center branch */}
          <line
            x1="150"
            y1="10"
            x2="150"
            y2="24"
            stroke="#d1d5db"
            strokeWidth="1.5"
          />
          <polygon points="146,24 150,28 154,24" fill="#d1d5db" />
          {/* Right branch */}
          <line
            x1="250"
            y1="10"
            x2="250"
            y2="24"
            stroke="#d1d5db"
            strokeWidth="1.5"
          />
          <polygon points="246,24 250,28 254,24" fill="#d1d5db" />
        </svg>
      </div>

      {/* Mobile: simple vertical connector */}
      <div
        className="flex sm:hidden justify-center mb-3"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center">
          <div
            className="w-0 h-4"
            style={{ borderLeft: "1.5px solid #d1d5db" }}
          />
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            className="shrink-0 -mt-px"
            fill="#d1d5db"
            aria-hidden="true"
          >
            <path d="M0 0L4 6L8 0Z" />
          </svg>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ProductivityPaths() {
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({
    reduce: false,
    amplify: false,
    expand: false,
  });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const togglePath = (id: string) => {
    setExpandedPaths((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="productivity-paths" style={{ scrollMarginTop: "4rem" }}>
      {/* Subtle pulse animation for starting node */}
      <style>{`
        @keyframes node-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(92, 97, 246, 0.15); }
          50% { box-shadow: 0 0 0 6px rgba(92, 97, 246, 0); }
        }
        .node-pulse {
          animation: node-pulse 2.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .node-pulse { animation: none; }
        }
      `}</style>

      {/* Section heading */}
      <div className="mb-6">
        <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
          What Happens When Workers Get More Productive?
        </h2>
        <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
          AI-driven productivity gains lead firms down three paths &mdash; often
          simultaneously. Click each to see the research.
        </p>
      </div>

      {/* Main card with starting node + branching paths */}
      <div className="rounded-xl border border-black/[0.06] bg-white p-4 sm:p-6">
        {/* Starting node */}
        <div className="flex justify-center mb-4">
          <div className="node-pulse inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--accent-light)] border border-[var(--accent)]/20">
            <span style={{ color: "var(--accent)" }}>{LightningIcon}</span>
            <span className="text-[13px] font-semibold text-[var(--foreground)]">
              AI makes workers more productive
            </span>
          </div>
        </div>

        {/* Branch connector */}
        <BranchConnector />

        {/* Three path cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {PATHS.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              isExpanded={expandedPaths[path.id]}
              onToggle={() => togglePath(path.id)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>

      {/* J-Curve note */}
      <div className="mt-4 rounded-xl border border-black/[0.06] bg-white p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: "#d976061a", color: "#d97706" }}
          >
            {JCurveIcon}
          </div>
          <div>
            <p className="text-[14px] font-bold text-[var(--foreground)] mb-1">
              The Productivity J-Curve
            </p>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed">
              Most firms do all three at once. And it takes time &mdash;
              measured productivity often{" "}
              <em className="text-[var(--foreground)]">dips before it rises</em>{" "}
              as firms invest in AI tools, reorganize workflows, and retrain
              workers before reaping the gains. The same pattern played out with
              electricity and computers.
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <p className="text-[11px] text-[var(--muted)]">
                <a
                  href="https://www.nber.org/papers/w24001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  Brynjolfsson, Rock &amp; Syverson (2021)
                </a>{" "}
                &mdash; NBER Working Paper 24001
              </p>
              <Link
                href="/j-curve"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] hover:underline"
              >
                Read the full explainer
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4.5 2.5L8 6L4.5 9.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer interpretive line */}
      <p className="mt-4 text-[12px] text-[var(--muted)] text-center leading-relaxed max-w-xl mx-auto">
        The automation tools tracked above are the leading indicator. The BLS
        data tells you which path each industry is taking.
      </p>
    </section>
  );
}
