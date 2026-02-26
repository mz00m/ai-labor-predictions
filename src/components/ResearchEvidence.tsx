"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Data: Micro studies (task-specific / individual worker)            */
/* ------------------------------------------------------------------ */

interface MicroStudy {
  id: string;
  authors: string;
  year: number;
  title: string;
  domain: string;
  effectPct: number;
  effectLabel: string;
  finding: string;
  citation: string;
  url: string;
  note?: string;
}

const MICRO_STUDIES: MicroStudy[] = [
  {
    id: "ju-aral-2025",
    authors: "Ju & Aral",
    year: 2025,
    title: "Human-AI Ad Teams",
    domain: "Advertising",
    effectPct: 73,
    effectLabel: "+73%",
    finding: "Human-AI teams showed roughly 73% higher productivity per worker for ad copy; human-human teams remained superior for images.",
    citation: "arXiv:2503.18238",
    url: "https://arxiv.org/abs/2503.18238",
  },
  {
    id: "peng-copilot-2023",
    authors: "Peng, Kalliamvakou, Cihon & Demirer",
    year: 2023,
    title: "GitHub Copilot RCT",
    domain: "Software dev",
    effectPct: 55.8,
    effectLabel: "+55.8%",
    finding: "Developers completed a coding task 55.8% faster with GitHub Copilot assistance.",
    citation: "arXiv:2302.06590",
    url: "https://arxiv.org/abs/2302.06590",
  },
  {
    id: "gambacorta-2024",
    authors: "Gambacorta, Qiu, Shan & Rees",
    year: 2024,
    title: "CodeFuse / Ant Group",
    domain: "Software dev",
    effectPct: 55,
    effectLabel: "+55%",
    finding: "55% total increase in lines of code; 20% directly attributable to AI generation. Junior employees saw larger gains; senior employees saw no significant effect.",
    citation: "BIS Working Paper 1208",
    url: "https://www.bis.org/publ/work1208.htm",
  },
  {
    id: "yeverechyahu-2024",
    authors: "Yeverechyahu, Mayya & Oestreicher-Singer",
    year: 2024,
    title: "GitHub Copilot Observational",
    domain: "Software dev",
    effectPct: 46,
    effectLabel: "+37–55%",
    finding: "37–55% increase in commits, mainly through contributions building on others' work (debugging, small edits).",
    citation: "arXiv:2409.08379",
    url: "https://arxiv.org/abs/2409.08379",
  },
  {
    id: "noy-zhang-2023",
    authors: "Noy & Zhang",
    year: 2023,
    title: "Writing Tasks RCT",
    domain: "Writing",
    effectPct: 37,
    effectLabel: "+0.8 SD faster",
    finding: "Workers completed tasks 0.8 standard deviations faster and produced output rated 0.4 standard deviations higher in quality. Lower-performing workers saw the largest gains.",
    citation: "Science 381(6654): 187–192",
    url: "https://www.science.org/doi/10.1126/science.adh2586",
  },
  {
    id: "cui-microsoft-2025",
    authors: "Cui, Demirer, Jaffe, Musolff, Peng & Salz",
    year: 2025,
    title: "Microsoft/Accenture Fortune 100",
    domain: "Software dev",
    effectPct: 26,
    effectLabel: "+26%",
    finding: "26% increase in completed pull requests; 13.55% increase in commits; 38.38% increase in builds. Build success rate fell by 5.53 percentage points.",
    citation: "Working paper (2025)",
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5106604",
  },
  {
    id: "dellacqua-bcg-2023",
    authors: "Dell'Acqua et al.",
    year: 2023,
    title: "\"Jagged Frontier\" / BCG Consultants",
    domain: "Consulting",
    effectPct: 25.1,
    effectLabel: "+25.1%",
    finding: "For tasks within AI's capabilities: 12.2% more tasks completed, 25.1% faster, output rated 40% higher quality. For tasks outside AI's frontier, performance was 19 percentage points worse.",
    citation: "HBS Working Paper 24-013",
    url: "https://www.hbs.edu/ris/Publication%20Files/24-013_d9b45b68-9e74-42d6-a1c6-c72fb70c7571.pdf",
  },
  {
    id: "paradis-google-2024",
    authors: "Paradis et al.",
    year: 2024,
    title: "Google Internal RCT",
    domain: "Software dev",
    effectPct: 21,
    effectLabel: "+21%",
    finding: "21% reduction in time spent per task. More experienced developers saw bigger effects.",
    citation: "arXiv:2410.12944",
    url: "https://arxiv.org/abs/2410.12944",
    note: "Time reduction; experienced devs benefited more",
  },
  {
    id: "metr-2026",
    authors: "METR",
    year: 2026,
    title: "METR Open-Source Devs (Updated)",
    domain: "Software dev",
    effectPct: 18,
    effectLabel: "+18%",
    finding: "For the subset of original developers who participated in the later study, METR now estimates an 18% reduction in task completion time (CI: 9% to 38% faster). Among newly-recruited developers the estimated time reduction is 4% (CI: -9% to +15%).",
    citation: "METR Blog, Feb 2026",
    url: "https://metr.org/blog/2026-02-24-uplift-update/",
    note: "Updated from initial finding; time reduction = productivity increase; wide confidence intervals",
  },
  {
    id: "fang-ecommerce-2025",
    authors: "Fang, Yuan, Zheng, Donati & Sarvary",
    year: 2025,
    title: "E-Commerce Field Experiments",
    domain: "E-commerce",
    effectPct: 16,
    effectLabel: "+16%",
    finding: "AI chatbots for customer service increased sales by 16%; AI-generated product descriptions increased sales by 2.05%.",
    citation: "arXiv:2510.12049",
    url: "https://arxiv.org/abs/2510.12049",
  },
  {
    id: "brynjolfsson-li-raymond-2025",
    authors: "Brynjolfsson, Li & Raymond",
    year: 2025,
    title: "Customer Support Productivity",
    domain: "Customer service",
    effectPct: 14,
    effectLabel: "+14%",
    finding: "14–15% increase in customer support issues resolved per hour on average; 30–35% gains for less experienced agents; minimal gains for highly skilled agents.",
    citation: "QJE 140(2): 889–942",
    url: "https://academic.oup.com/qje/article/140/2/889/7990658",
  },
  {
    id: "dellacqua-pg-2025",
    authors: "Dell'Acqua et al.",
    year: 2025,
    title: "\"Cybernetic Teammate\" / P&G",
    domain: "Product dev",
    effectPct: 12,
    effectLabel: "Quality +",
    finding: "AI raised solution quality for individuals and teams; reduced expertise gaps between technical and commercial specialists.",
    citation: "HBS Working Paper 25-043 / NBER 33641",
    url: "https://www.nber.org/papers/w33641",
    note: "Quality improvement; gap reduction",
  },
  {
    id: "otis-kenya-2023",
    authors: "Otis, Clarke, Delecourt, Holtz & Koning",
    year: 2023,
    title: "Kenyan Entrepreneurs / GPT-4",
    domain: "Entrepreneurship",
    effectPct: 0,
    effectLabel: "~0%",
    finding: "No statistically significant average effect on revenues. High-performing businesses improved ~15%, low performers did 8–10% worse — widening performance gaps.",
    citation: "HBS Working Paper 24-042",
    url: "https://www.hbs.edu/ris/Publication%20Files/24-042_9d69e71a-98c6-4a9a-9755-93462d7e4394.pdf",
    note: "Widened performance gaps",
  },
];

/* ------------------------------------------------------------------ */
/*  Data: Macro studies (economy-wide / aggregate)                     */
/* ------------------------------------------------------------------ */

interface MacroStudy {
  id: string;
  authors: string;
  year: number;
  title: string;
  metric: string;
  effectPct: number;
  effectLabel: string;
  finding: string;
  citation: string;
  url: string;
  direction: "positive" | "negative" | "neutral";
}

const MACRO_STUDIES: MacroStudy[] = [
  {
    id: "bick-blandin-deming-2024",
    authors: "Bick, Blandin & Deming",
    year: 2024,
    title: "Large U.S. Worker Survey",
    metric: "Time savings",
    effectPct: 1.4,
    effectLabel: "~1.4%",
    finding: "~40% of working-age Americans use generative AI; self-reported time savings average 5–6% of work hours among users, implying aggregate savings of ~1.4% across all workers (~6.72 extra minutes/day).",
    citation: "NBER Working Paper 32966",
    url: "https://www.nber.org/papers/w32966",
    direction: "positive",
  },
  {
    id: "stlouis-fed-2025",
    authors: "St. Louis Fed",
    year: 2025,
    title: "Labor Productivity Estimate",
    metric: "Labor productivity",
    effectPct: 1.2,
    effectLabel: "+1.1–1.3%",
    finding: "Generative AI may have increased labor productivity by up to 1.1–1.3% since ChatGPT's release (based on self-reported time savings — likely overstated).",
    citation: "St. Louis Fed, 2025",
    url: "https://www.stlouisfed.org/on-the-economy/2025/feb/how-much-has-gen-ai-increased-labor-productivity",
    direction: "positive",
  },
  {
    id: "pwbm-2025",
    authors: "Penn Wharton Budget Model",
    year: 2025,
    title: "TFP Growth Projection",
    metric: "TFP growth",
    effectPct: 0.01,
    effectLabel: "+0.01pp",
    finding: "AI's contribution to total factor productivity growth projected at approximately 0.01 percentage points in 2025 — essentially negligible.",
    citation: "PWBM 2025",
    url: "https://budgetmodel.wharton.upenn.edu/issues/2025/9/8/projected-impact-of-generative-ai-on-future-productivity-growth",
    direction: "neutral",
  },
  {
    id: "babina-pre-genai-2023",
    authors: "Babina, Fedyk, He & Hodson",
    year: 2023,
    title: "Pre-GenAI AI Investment Study",
    metric: "TFP",
    effectPct: 0,
    effectLabel: "0%",
    finding: "Firms with more AI workers had ~20% higher sales, 18% higher employment, 22% higher valuations over 8 years — but zero relationship with productivity per worker or TFP. All growth came through product innovation.",
    citation: "Published study (pre-GenAI era data)",
    url: "https://www.nber.org/papers/w30400",
    direction: "neutral",
  },
];

/* ------------------------------------------------------------------ */
/*  Colors                                                             */
/* ------------------------------------------------------------------ */

function barColor(pct: number): string {
  if (pct > 30) return "#16a34a";
  if (pct > 10) return "#22c55e";
  if (pct > 0) return "#4ade80";
  if (pct === 0) return "#9ca3af";
  return "#ef4444";
}

function macroBarColor(direction: string): string {
  if (direction === "positive") return "#22c55e";
  if (direction === "negative") return "#ef4444";
  return "#9ca3af";
}

/* ------------------------------------------------------------------ */
/*  Study Modal                                                        */
/* ------------------------------------------------------------------ */

function StudyModal({
  study,
  onClose,
  type,
}: {
  study: MicroStudy | MacroStudy;
  onClose: () => void;
  type: "micro" | "macro";
}) {
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

  const isMicro = type === "micro";
  const micro = isMicro ? (study as MicroStudy) : null;
  const macro = !isMicro ? (study as MacroStudy) : null;
  const color = isMicro
    ? barColor(micro!.effectPct)
    : macroBarColor(macro!.direction);

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
        aria-label={`${study.authors} study details`}
      >
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
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <h3 className="text-[18px] font-bold text-[var(--foreground)]">
                {study.authors} ({study.year})
              </h3>
              <p className="text-[13px] text-[var(--muted)] mt-0.5">
                {study.title}
              </p>
            </div>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-[14px] font-bold text-white shrink-0"
              style={{ backgroundColor: color }}
            >
              {isMicro ? micro!.effectLabel : macro!.effectLabel}
            </span>
          </div>

          {isMicro && (
            <div className="mt-3">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded"
                style={{ color: "#2e6da4", backgroundColor: "rgba(46,109,164,0.08)" }}
              >
                {micro!.domain}
              </span>
            </div>
          )}

          {!isMicro && (
            <div className="mt-3">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded"
                style={{ color, backgroundColor: `${color}15` }}
              >
                {macro!.metric}
              </span>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-black/[0.06]">
            <p className="text-[13px] text-[var(--foreground)] leading-relaxed">
              {study.finding}
            </p>
          </div>

          {"note" in study && study.note && (
            <p className="text-[12px] text-[var(--muted)] mt-3 italic">
              {study.note}
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-black/[0.06]">
            <p className="text-[11px] text-[var(--muted)]">
              {study.citation}
            </p>
          </div>

          <div className="mt-4">
            <a
              href={study.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--foreground)] hover:text-[var(--accent)] underline underline-offset-2"
            >
              View Paper &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Micro Study Bar Chart                                              */
/* ------------------------------------------------------------------ */

function MicroBar({
  study,
  maxAbsPct,
  onClick,
}: {
  study: MicroStudy;
  maxAbsPct: number;
  onClick: () => void;
}) {
  const widthPct = Math.max(Math.abs(study.effectPct) / maxAbsPct * 100, 2);
  const isNeg = study.effectPct < 0;
  const color = barColor(study.effectPct);

  return (
    <button
      className="group flex items-center gap-3 w-full text-left py-1.5 px-2 rounded-md hover:bg-black/[0.02] transition-colors"
      onClick={onClick}
      title={`${study.authors} (${study.year}): ${study.effectLabel}`}
    >
      {/* Label */}
      <div className="w-[140px] sm:w-[180px] shrink-0 text-right">
        <span className="text-[12px] text-[var(--foreground)] font-medium leading-tight">
          {study.authors}
        </span>
        <span className="text-[10px] text-[var(--muted)] ml-1">
          ({study.year})
        </span>
      </div>

      {/* Bar area */}
      <div className="flex-1 flex items-center" style={{ minHeight: 24 }}>
        {isNeg ? (
          <div className="flex items-center justify-end w-full">
            <span
              className="text-[11px] font-bold mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color }}
            >
              {study.effectLabel}
            </span>
            <div
              className="h-5 rounded-sm transition-opacity group-hover:opacity-100"
              style={{
                width: `${widthPct}%`,
                backgroundColor: color,
                opacity: 0.7,
              }}
            />
          </div>
        ) : (
          <div className="flex items-center w-full">
            <div
              className="h-5 rounded-sm transition-opacity group-hover:opacity-100"
              style={{
                width: `${widthPct}%`,
                backgroundColor: color,
                opacity: study.effectPct === 0 ? 0.4 : 0.7,
                minWidth: study.effectPct === 0 ? 4 : undefined,
              }}
            />
            <span
              className="text-[11px] font-bold ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color }}
            >
              {study.effectLabel}
            </span>
          </div>
        )}
      </div>

      {/* Domain tag */}
      <span className="hidden sm:inline text-[10px] text-[var(--muted)] w-[80px] shrink-0 truncate">
        {study.domain}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Macro Study Bar                                                    */
/* ------------------------------------------------------------------ */

function MacroBar({
  study,
  onClick,
}: {
  study: MacroStudy;
  onClick: () => void;
}) {
  const color = macroBarColor(study.direction);
  const icon =
    study.direction === "positive"
      ? "\u2191"
      : study.direction === "negative"
        ? "\u2193"
        : "\u2194";

  return (
    <button
      className="group flex items-center gap-3 w-full text-left py-2 px-2 rounded-md hover:bg-black/[0.02] transition-colors"
      onClick={onClick}
      title={`${study.authors} (${study.year}): ${study.effectLabel}`}
    >
      {/* Direction icon */}
      <span
        className="text-[16px] font-bold shrink-0 w-5 text-center"
        style={{ color }}
      >
        {icon}
      </span>

      {/* Label */}
      <div className="w-[130px] sm:w-[170px] shrink-0">
        <span className="text-[12px] text-[var(--foreground)] font-medium leading-tight">
          {study.authors}
        </span>
        <span className="text-[10px] text-[var(--muted)] ml-1">
          ({study.year})
        </span>
      </div>

      {/* Effect badge */}
      <span
        className="text-[12px] font-bold px-2 py-0.5 rounded-full shrink-0"
        style={{ color, backgroundColor: `${color}15` }}
      >
        {study.effectLabel}
      </span>

      {/* Metric tag */}
      <span className="hidden sm:inline text-[10px] text-[var(--muted)] flex-1 truncate">
        {study.metric}
      </span>

      {/* Short finding */}
      <span className="hidden md:inline text-[11px] text-[var(--muted)] max-w-[200px] truncate">
        {study.finding.slice(0, 80)}{study.finding.length > 80 ? "..." : ""}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export default function ResearchEvidence() {
  const [modal, setModal] = useState<{
    study: MicroStudy | MacroStudy;
    type: "micro" | "macro";
  } | null>(null);

  const openModal = useCallback(
    (study: MicroStudy | MacroStudy, type: "micro" | "macro") => {
      setModal({ study, type });
    },
    []
  );

  const closeModal = useCallback(() => setModal(null), []);

  const maxAbsMicro = Math.max(...MICRO_STUDIES.map((s) => Math.abs(s.effectPct)));

  // Summary stats
  const positiveCount = MICRO_STUDIES.filter((s) => s.effectPct > 0).length;
  const negativeCount = MICRO_STUDIES.filter((s) => s.effectPct < 0).length;
  const neutralCount = MICRO_STUDIES.filter((s) => s.effectPct === 0).length;
  const medianEffect = [...MICRO_STUDIES]
    .map((s) => s.effectPct)
    .sort((a, b) => a - b)[Math.floor(MICRO_STUDIES.length / 2)];

  return (
    <section id="research-evidence" className="mt-12">
      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
          What the research actually shows
        </h2>
        <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
          {MICRO_STUDIES.length} micro studies on individual/task productivity and{" "}
          {MACRO_STUDIES.length} macro studies on economy-wide effects. The micro
          evidence leans heavily positive; the macro gains have not yet shown up
          in aggregate statistics.{" "}
          <span className="opacity-60">Click any row for details and source.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Micro Tile ── */}
        <div className="border border-black/[0.06] rounded-lg bg-white p-5 sm:p-6">
          {/* Tile header */}
          <div className="mb-5">
            <h3 className="text-[18px] font-bold text-[var(--foreground)]">
              Task &amp; Individual Productivity
            </h3>
            <p className="text-[13px] text-[var(--muted)] mt-1">
              RCTs and field experiments measuring individual or team-level
              productivity changes with AI tools
            </p>
          </div>

          {/* Summary badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {positiveCount} positive
            </span>
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-red-50 text-red-600">
              {negativeCount} negative
            </span>
            {neutralCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                {neutralCount} null
              </span>
            )}
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-purple-50 text-purple-700">
              Median: +{medianEffect}%
            </span>
          </div>

          {/* Horizontal bar chart */}
          <div className="space-y-0">
            {MICRO_STUDIES.map((study) => (
              <MicroBar
                key={study.id}
                study={study}
                maxAbsPct={maxAbsMicro}
                onClick={() => openModal(study, "micro")}
              />
            ))}
          </div>

          {/* Axis label */}
          <div className="flex justify-between text-[10px] text-[var(--muted)] mt-2 px-2">
            <span className="ml-[140px] sm:ml-[180px]">0%</span>
            <span>Productivity change &rarr;</span>
          </div>
        </div>

        {/* ── Macro Tile ── */}
        <div className="border border-black/[0.06] rounded-lg bg-white p-5 sm:p-6">
          {/* Tile header */}
          <div className="mb-5">
            <h3 className="text-[18px] font-bold text-[var(--foreground)]">
              Macro Productivity
            </h3>
            <p className="text-[13px] text-[var(--muted)] mt-1">
              Economy-wide studies measuring aggregate productivity gains —
              TFP, labor productivity, and time savings
            </p>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {MACRO_STUDIES.filter((s) => s.direction === "positive").length} small positive
            </span>
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {MACRO_STUDIES.filter((s) => s.direction === "neutral").length} negligible
            </span>
          </div>

          {/* Macro studies list */}
          <div className="space-y-0">
            {MACRO_STUDIES.map((study) => (
              <MacroBar
                key={study.id}
                study={study}
                onClick={() => openModal(study, "macro")}
              />
            ))}
          </div>

          {/* Key takeaway box */}
          <div className="mt-5 p-3 rounded-md bg-amber-50/50 border border-amber-200/30">
            <p className="text-[12px] text-amber-900 leading-relaxed">
              <span className="font-bold">Key gap:</span>{" "}
              Micro studies show 14–56% individual productivity gains, but
              macro data shows ~0–1.4% aggregate effect so far. The gap likely
              reflects adoption frictions, bottleneck tasks, and the J-curve
              dynamic of technology investment.
            </p>
          </div>
        </div>
      </div>

      {/* Source attribution */}
      <p className="text-[13px] text-[var(--muted)] mt-4">
        {MICRO_STUDIES.length + MACRO_STUDIES.length} studies &middot; Based on
        synthesis by Alex Imas (behavioral economist) &middot; Studies range from
        peer-reviewed (Science, QJE) to working papers &middot; Click any row for
        source
      </p>

      {/* Modal */}
      {modal && (
        <StudyModal
          study={modal.study}
          type={modal.type}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
