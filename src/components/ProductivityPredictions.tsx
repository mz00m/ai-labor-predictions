"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { id: "stagnation",     label: "Stagnation",     range: "< 1%",  color: "#1a3a5c" },
  { id: "status_quo",     label: "Status Quo",     range: "1–2%",  color: "#2e6da4" },
  { id: "solid_breakout", label: "Solid Breakout", range: "2–3%",  color: "#e8a838" },
  { id: "boom",           label: "Boom",           range: "3–4%",  color: "#d4601a" },
  { id: "phase_change",   label: "Phase Change",   range: "> 4%",  color: "#b02020" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface Respondent {
  id: string;
  name: string;
  handle: string;
  title: string;
  xPost: string;
  bio: string;
  linkedin: string | null;
  isCrowd: boolean;
  note: string;
  probs: Record<CategoryId, number>;
}

const RESPONDENTS: Respondent[] = [
  {
    id: "furman",
    name: "Jason Furman",
    handle: "@jasonfurman",
    title: "Aetna Prof. of Economic Policy, Harvard; fmr. Obama CEA Chair",
    xPost: "https://x.com/jasonfurman",
    bio: "https://www.hks.harvard.edu/faculty/jason-furman",
    linkedin: "https://www.linkedin.com/in/jason-furman-6b8b55152/",
    isCrowd: false,
    note: "Exercise creator. Most weight on Solid Breakout. Implied mean ~2.3%.",
    probs: { stagnation: 2, status_quo: 35, solid_breakout: 50, boom: 10, phase_change: 3 },
  },
  {
    id: "crowd_avg",
    name: "Crowd Average",
    handle: "n=23 responses",
    title: "Average of 23 economist responses tracked by Jason Furman across X",
    xPost: "https://x.com/jasonfurman",
    bio: "https://x.com/jasonfurman",
    linkedin: null,
    isCrowd: true,
    note: "Furman noted this gives far more weight to tail outcomes than most individual views.",
    probs: { stagnation: 12, status_quo: 35, solid_breakout: 27, boom: 17, phase_change: 9 },
  },
  {
    id: "noah_smith",
    name: "Noah Smith",
    handle: "@Noahpinion",
    title: "Economist & Substack writer (Noahpinion); fmr. Bloomberg Opinion columnist",
    xPost: "https://x.com/Noahpinion",
    bio: "https://www.noahpinion.blog/about",
    linkedin: "https://www.linkedin.com/in/noah-smith-099122145/",
    isCrowd: false,
    note: "Self-described techno-optimist. Most weight on Solid Breakout while acknowledging structural bottlenecks.",
    probs: { stagnation: 1, status_quo: 20, solid_breakout: 60, boom: 15, phase_change: 4 },
  },
  {
    id: "rayhan_momin",
    name: "Rayhan Momin",
    handle: "@momin_rayhan",
    title: "Finance PhD, UChicago Booth; Economist at PNC",
    xPost: "https://x.com/momin_rayhan",
    bio: "https://rmmomin.github.io",
    linkedin: "https://www.linkedin.com/in/rayhanmomin/",
    isCrowd: false,
    note: "Argued the crowd survey gives too much weight to tail outcomes. 'Preregistered' his forecast as a check against future updating.",
    probs: { stagnation: 2, status_quo: 49, solid_breakout: 43, boom: 6, phase_change: 0 },
  },
  {
    id: "brynjolfsson",
    name: "Erik Brynjolfsson",
    handle: "@erikbryn",
    title: "Prof. & Director, Stanford Digital Economy Lab; Stanford HAI; co-author 'The Second Machine Age'",
    xPost: "https://x.com/erikbryn",
    bio: "https://www.brynjolfsson.com",
    linkedin: "https://www.linkedin.com/in/erikbrynjolfsson/",
    isCrowd: false,
    note: "Emphasized thinking in scenarios rather than point estimates. Outcomes depend heavily on policy choices. GDP measurement weaknesses will be glaring by 2035.",
    probs: { stagnation: 10, status_quo: 20, solid_breakout: 30, boom: 30, phase_change: 10 },
  },
  {
    id: "steinsson",
    name: "Jón Steinsson",
    handle: "@JonSteinsson",
    title: "Marek Prof. of Public Policy & Economics, UC Berkeley; Co-Director, NBER Monetary Economics Program",
    xPost: "https://x.com/JonSteinsson",
    bio: "https://www.econ.berkeley.edu/profile/013121396",
    linkedin: null,
    isCrowd: false,
    note: "Macro economist focused on monetary and fiscal policy. Puts notable 20% weight on stagnation risk — among the higher estimates in the group.",
    probs: { stagnation: 20, status_quo: 35, solid_breakout: 30, boom: 12, phase_change: 3 },
  },
  {
    id: "hammond",
    name: "Samuel Hammond",
    handle: "@hamandcheese",
    title: "Chief Economist, Foundation for American Innovation; Nonresident Fellow, Niskanen Center",
    xPost: "https://x.com/hamandcheese",
    bio: "https://www.thefai.org/profile/Samuel-Hammond",
    linkedin: "https://www.linkedin.com/in/samuel-hammond-4b986955",
    isCrowd: false,
    note: "Most bullish respondent by a wide margin: 60% on Phase Change (>4%). Projects probability rising above 90% over a 20-year horizon.",
    probs: { stagnation: 1, status_quo: 1, solid_breakout: 5, boom: 35, phase_change: 60 },
  },
  {
    id: "kaplan",
    name: "David S. Kaplan",
    handle: "@David_S_Kaplan",
    title: "Lead Labor Market Specialist, Labor Markets & Social Security Division, Inter-American Development Bank",
    xPost: "https://x.com/David_S_Kaplan",
    bio: "https://www.iza.org/person/4294/david-kaplan",
    linkedin: "https://www.linkedin.com/in/david-kaplan-iadb/",
    isCrowd: false,
    note: "Most bearish respondent: 65% on Status Quo (1–2%). Noted similar probability distributions would apply for Latin America & Caribbean.",
    probs: { stagnation: 18, status_quo: 65, solid_breakout: 12, boom: 3, phase_change: 2 },
  },
  {
    id: "berger",
    name: "Guy Berger",
    handle: "@EconBerger",
    title: "Sr. Advisor, Access/Macro; Senior Fellow, Burning Glass Institute; fmr. Principal Economist, LinkedIn; PhD Yale",
    xPost: "https://x.com/EconBerger",
    bio: "https://www.burningglassinstitute.org/guy-berger",
    linkedin: "https://www.linkedin.com/in/guyberger/",
    isCrowd: false,
    note: "Labor market macro specialist. Post reposted by Furman in the original thread.",
    probs: { stagnation: 5, status_quo: 35, solid_breakout: 42, boom: 15, phase_change: 3 },
  },
  {
    id: "henry_curr",
    name: "Henry Curr",
    handle: "@ecurrnomics",
    title: "Economics Editor, The Economist; Visiting Fellow, Nuffield College Oxford; Rybczynski Prize winner",
    xPost: "https://x.com/ecurrnomics",
    bio: "https://www.henrycurr.com",
    linkedin: "https://uk.linkedin.com/in/henrycurr",
    isCrowd: false,
    note: "Stagnation bucket explicitly includes Baumol scenarios where GDP stagnates while consumer welfare surges. Would shift more weight toward Boom/Phase Change over a longer time horizon.",
    probs: { stagnation: 15, status_quo: 35, solid_breakout: 35, boom: 10, phase_change: 5 },
  },
  {
    id: "john_diamond",
    name: "John W. Diamond",
    handle: "@jw_diamond",
    title: "Kelly Senior Fellow in Public Finance & Director, Center for Tax & Budget Policy, Baker Institute at Rice University",
    xPost: "https://x.com/jw_diamond",
    bio: "https://www.bakerinstitute.org/expert/john-w-diamond",
    linkedin: "https://www.linkedin.com/in/john-w-diamond-baker/",
    isCrowd: false,
    note: "Tax and fiscal policy specialist with CGE modeling expertise. Heaviest weight on Status Quo (40%).",
    probs: { stagnation: 15, status_quo: 40, solid_breakout: 30, boom: 10, phase_change: 5 },
  },
  {
    id: "dimartino",
    name: "Daniel Di Martino",
    handle: "@DanielDiMartino",
    title: "Fellow, Manhattan Institute; PhD candidate in Economics, Columbia University; founder, Dissident Project",
    xPost: "https://x.com/DanielDiMartino",
    bio: "https://www.danieldimartino.com",
    linkedin: "https://www.linkedin.com/in/daniel-dimartino/",
    isCrowd: false,
    note: "Immigration economist; Venezuelan-born. Most weight on Status Quo (50%) with Solid Breakout as second most likely (39%).",
    probs: { stagnation: 5, status_quo: 50, solid_breakout: 39, boom: 5, phase_change: 1 },
  },
];

const INDIVIDUALS = RESPONDENTS.filter((r) => !r.isCrowd);
const CROWD = RESPONDENTS.find((r) => r.isCrowd)!;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getCategoryColor(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.color ?? "#666";
}

function getCategoryLabel(id: string) {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat ? `${cat.label} · ${cat.range}` : "";
}

/* ------------------------------------------------------------------ */
/*  SparkBar — mini distribution shown in modal                        */
/* ------------------------------------------------------------------ */

function SparkBar({
  probs,
  activeCategory,
}: {
  probs: Record<CategoryId, number>;
  activeCategory: CategoryId;
}) {
  return (
    <div className="flex gap-1 items-end h-8">
      {CATEGORIES.map((cat) => {
        const val = probs[cat.id];
        const isActive = cat.id === activeCategory;
        return (
          <div
            key={cat.id}
            className="flex-1 rounded-sm"
            style={{
              height: `${Math.max(val * 1.2, 2)}px`,
              backgroundColor: cat.color,
              opacity: isActive ? 1 : 0.3,
            }}
            title={`${cat.label}: ${val}%`}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */

function EconomistModal({
  respondent,
  categoryId,
  onClose,
}: {
  respondent: Respondent;
  categoryId: CategoryId;
  onClose: () => void;
}) {
  const prob = respondent.probs[categoryId];
  const catColor = getCategoryColor(categoryId);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={`${respondent.name} productivity prediction`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <h3 className="text-[18px] font-bold text-[var(--foreground)]">
                {respondent.name}
              </h3>
              <p className="text-[13px] text-[var(--muted)] mt-0.5">
                {respondent.handle}
              </p>
            </div>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-[14px] font-bold text-white shrink-0"
              style={{ backgroundColor: catColor }}
            >
              {prob}%
            </span>
          </div>

          {/* Category badge */}
          <div className="mt-3">
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded"
              style={{
                color: catColor,
                backgroundColor: `${catColor}15`,
              }}
            >
              {getCategoryLabel(categoryId)}
            </span>
          </div>

          {/* Affiliation */}
          <p className="text-[13px] text-[var(--muted)] mt-4 leading-relaxed">
            {respondent.title}
          </p>

          {/* Note */}
          <div className="mt-4 pt-4 border-t border-black/[0.06]">
            <p className="text-[13px] text-[var(--foreground)] italic leading-relaxed">
              &ldquo;{respondent.note}&rdquo;
            </p>
          </div>

          {/* Sparkbar distribution */}
          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-widest text-[var(--muted)] mb-2 font-bold">
              Full distribution
            </p>
            <SparkBar probs={respondent.probs} activeCategory={categoryId} />
            <div className="flex gap-1 mt-1">
              {CATEGORIES.map((cat) => (
                <span
                  key={cat.id}
                  className="flex-1 text-[10px] text-center"
                  style={{ color: cat.id === categoryId ? cat.color : "var(--muted)" }}
                >
                  {respondent.probs[cat.id]}%
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={respondent.xPost}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--foreground)] hover:text-[var(--accent)] underline underline-offset-2"
            >
              View X Post &rarr;
            </a>
            {respondent.linkedin && (
              <a
                href={respondent.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--foreground)] hover:text-[var(--accent)] underline underline-offset-2"
              >
                LinkedIn &rarr;
              </a>
            )}
            <a
              href={respondent.bio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--foreground)] hover:text-[var(--accent)] underline underline-offset-2"
            >
              Full Bio &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bar                                                                */
/* ------------------------------------------------------------------ */

function Bar({
  respondent,
  categoryId,
  catColor,
  onClick,
}: {
  respondent: Respondent;
  categoryId: CategoryId;
  catColor: string;
  onClick: () => void;
}) {
  const prob = respondent.probs[categoryId];
  const isCrowd = respondent.isCrowd;
  const heightPct = Math.max(prob, 1); // min 1% so zero-value bars still show a sliver

  const barStyle: React.CSSProperties = isCrowd
    ? {
        height: `${heightPct}%`,
        background: `repeating-linear-gradient(
          -45deg,
          ${catColor}55,
          ${catColor}55 3px,
          transparent 3px,
          transparent 6px
        )`,
        border: `1.5px dashed ${catColor}88`,
      }
    : {
        height: `${heightPct}%`,
        backgroundColor: catColor,
        opacity: 0.55,
      };

  return (
    <div
      className="relative flex-1 flex flex-col justify-end group cursor-pointer"
      style={{ minWidth: isCrowd ? 18 : 0 }}
      onClick={onClick}
      title={`${respondent.name}: ${prob}%`}
    >
      {/* Hover label */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <span className="text-[10px] font-bold" style={{ color: catColor }}>
          {prob}%
        </span>
      </div>
      <div
        className="w-full rounded-t-sm transition-opacity duration-150 group-hover:!opacity-100"
        style={barStyle}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GroupedCategoryCard                                                 */
/* ------------------------------------------------------------------ */

function GroupedCategoryCard({
  category,
  onBarClick,
}: {
  category: (typeof CATEGORIES)[number];
  onBarClick: (respondentId: string, categoryId: CategoryId) => void;
}) {
  return (
    <div className="flex-1 min-w-[145px] border border-black/[0.06] rounded-lg bg-white px-3 py-4">
      {/* Label */}
      <div className="mb-3">
        <span
          className="inline-block text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
          style={{
            color: category.color,
            backgroundColor: `${category.color}15`,
          }}
        >
          {category.label}
        </span>
        <span className="block text-[12px] text-[var(--muted)] mt-1">
          {category.range}
        </span>
      </div>

      {/* Bar area */}
      <div className="relative h-[200px]">
        {/* Gridlines */}
        {[25, 50, 75].map((line) => (
          <div
            key={line}
            className="absolute w-full border-t border-black/[0.04]"
            style={{ bottom: `${line}%` }}
          />
        ))}

        {/* Bars */}
        <div className="absolute inset-0 flex items-stretch gap-[2px]">
          {INDIVIDUALS.map((r) => (
            <Bar
              key={r.id}
              respondent={r}
              categoryId={category.id}
              catColor={category.color}
              onClick={() => onBarClick(r.id, category.id)}
            />
          ))}
          {/* Crowd Average — slightly wider */}
          <div className="flex flex-col justify-end" style={{ flex: "1.3 1 0" }}>
            <Bar
              respondent={CROWD}
              categoryId={category.id}
              catColor={category.color}
              onClick={() => onBarClick(CROWD.id, category.id)}
            />
          </div>
        </div>
      </div>

      {/* Y-axis hint */}
      <p className="text-[10px] text-[var(--muted)] mt-1 text-right">% probability</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export default function ProductivityPredictions() {
  const [modal, setModal] = useState<{
    respondentId: string;
    categoryId: CategoryId;
  } | null>(null);

  const openModal = useCallback(
    (respondentId: string, categoryId: CategoryId) => {
      setModal({ respondentId, categoryId });
    },
    []
  );

  const closeModal = useCallback(() => setModal(null), []);

  const modalRespondent = modal
    ? RESPONDENTS.find((r) => r.id === modal.respondentId)
    : null;

  return (
    <section id="productivity-predictions">
      {/* Bridge text */}
      <p className="text-[15px] text-[var(--muted)] mb-6 max-w-3xl leading-relaxed">
        The labor market effects above depend fundamentally on how much AI
        actually moves the productivity needle. Here&apos;s what leading
        economists currently think.
      </p>

      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
          What economists expect from AI-driven productivity
        </h2>
        <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
          Probability estimates for US productivity growth 2025&ndash;35, from
          Jason Furman&apos;s February 2026 exercise on X. 12 economists, 5
          scenarios.{" "}
          <span className="opacity-60">Click any bar for source details.</span>
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-[13px] text-[var(--muted)]">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: "#2e6da4", opacity: 0.55 }}
          />
          Individual economist
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{
              background: `repeating-linear-gradient(-45deg, #2e6da455, #2e6da455 2px, transparent 2px, transparent 4px)`,
              border: "1px dashed #2e6da488",
            }}
          />
          Crowd average (n=23)
        </span>
        <span className="opacity-60">
          12 economists &middot; 5 scenarios &middot; Feb 2026
        </span>
      </div>

      {/* Chart row */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <GroupedCategoryCard
            key={cat.id}
            category={cat}
            onBarClick={openModal}
          />
        ))}
      </div>

      {/* Source attribution */}
      <p className="text-[13px] text-[var(--muted)] mt-4">
        Based on 12 economists &middot; X exercise by{" "}
        <a
          href="https://x.com/jasonfurman"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--foreground)]"
        >
          @jasonfurman
        </a>{" "}
        &middot; February 2026 &middot; Click any bar for source
      </p>

      {/* Supporting firm-level evidence */}
      <div className="mt-4 border-l-2 border-[var(--accent)]/20 pl-4">
        <p className="text-[12px] text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">Firm-level check:</span>{" "}
          A{" "}
          <a
            href="https://www.nber.org/papers/w34836"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--foreground)]"
          >
            Feb 2026 NBER survey
          </a>{" "}
          of ~6,000 executives across US, UK, Germany &amp; Australia found firms expect AI to boost
          productivity by +1.4% over the next 3 years (US: +2.3%), while 89% report no productivity
          impact so far. Executives also expect AI to reduce employment by 0.7%, implying +0.8% net
          output growth from AI adoption.
        </p>
      </div>

      {/* Modal */}
      {modal && modalRespondent && (
        <EconomistModal
          respondent={modalRespondent}
          categoryId={modal.categoryId}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
