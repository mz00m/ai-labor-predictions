"use client";

import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from "react";
import { JOB_PROFILES, JobProfile, calculateJobExposure, calculateCrossoverYear } from "@/data/job-tasks";
import type { TaskCategory } from "@/data/task-categories";
import TaskBreakdownChart from "./TaskBreakdownChart";
import TaskSliders from "./TaskSliders";
import ComputeCostChart from "./ComputeCostChart";
import AutomationTimeline from "./AutomationTimeline";
import FocusRecommendations from "./FocusRecommendations";
import ComputeBenchmarks from "./ComputeBenchmarks";
import DurableSkillsSection from "./DurableSkillsSection";
import IndustrySpeedSlider from "./IndustrySpeedSlider";
import MethodologySection from "./MethodologySection";
import ExposureParticles from "./ExposureParticles";
import { INDUSTRY_ADOPTION_SPEED } from "@/data/industry-adoption-speed";
import Link from "next/link";
import { useCountUp } from "@/hooks/useCountUp";
import DimensionSummary, { type DimensionScoreData, workerSummary } from "./DimensionSummary";

export type DimensionScoresMap = Record<string, DimensionScoreData>;

const DEFAULT_CATEGORY_STYLE = {
  bg: "rgba(92,97,246,0.03)",
  border: "rgba(0,0,0,0.08)",
  text: "#6b7280",
  accent: "#5C61F6",
};

type Tab = "breakdown" | "timeline" | "costs" | "benchmarks";

function ExposureTooltip({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[280px] p-3 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-[12px] leading-relaxed shadow-xl pointer-events-auto">
          <p className="font-semibold mb-1">Economic Exposure Score (0–100)</p>
          <p className="opacity-80">
            Measures how much of this role&apos;s economic value is vulnerable to AI automation, based on each task&apos;s time share, current AI capability, and how soon compute costs undercut the human wage rate.
          </p>
          <p className="opacity-60 mt-1.5 text-[11px]">Higher = more tasks approaching cost crossover sooner.</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[var(--foreground)]" />
        </div>
      )}
    </div>
  );
}

interface JobTaskVisualizerProps {
  initialJobId?: string;
  dimensionScores: DimensionScoresMap;
}

const HIDDEN_CATEGORIES: string[] = [];

/**
 * BLS May 2024 employment estimates (thousands) for each profiled occupation.
 * Total US nonfarm employment: ~158.4M (BLS CES, 2024 annual average).
 */
const EMPLOYMENT_THOUSANDS: Record<string, number> = {
  "retail-salesperson": 4300, "fast-food-worker": 3800, "home-health-aide": 3200,
  "cashier": 3300, "general-operations-manager": 3000, "registered-nurse": 3200,
  "office-clerk": 2700, "customer-service-rep": 2800, "waiter-waitress": 2300,
  "laborer-material-mover": 2600, "stocker-order-filler": 2000,
  "administrative-assistant": 2000, "janitor-custodian": 2100,
  "truck-driver": 2000, "software-developer": 1800, "bookkeeper": 1500,
  "accountant": 1500, "assembler-fabricator": 1500, "teacher-k12": 1500,
  "nursing-assistant": 1300, "construction-laborer": 1300, "maid-housekeeper": 1400,
  "teaching-assistant": 1400, "landscaping-worker": 1300, "retail-store-manager": 1400,
  "restaurant-manager": 1100, "food-service-supervisor": 1100,
  "warehouse-worker": 1200, "security-guard": 1100, "delivery-driver": 1100,
  "carpenter": 1000, "childcare-worker": 1000, "personal-care-aide": 1800,
  "medical-assistant": 800, "hairdresser-barber": 800, "bus-driver": 700,
  "electrician": 800, "plumber": 500, "hvac-technician": 400,
  "automotive-mechanic": 800, "maintenance-repair-worker": 1400,
  "dental-hygienist": 230, "receptionist": 1000, "sales-representative": 1700,
  "lawyer": 800, "physician": 730, "pharmacist": 330, "dentist": 160,
  "financial-analyst": 330, "marketing-manager": 400, "hr-specialist": 800,
  "project-manager": 900, "data-analyst": 500, "executive-assistant": 600,
  "graphic-designer": 270, "operations-manager": 400, "it-manager": 520,
  "product-manager": 400, "management-analyst": 900,
  "loan-officer": 350, "insurance-agent": 530, "real-estate-agent": 500,
  "paralegal": 350, "social-worker": 730, "therapist": 350,
  "college-professor": 1300, "school-counselor": 350,
  "hotel-front-desk": 300, "chef-line-cook": 1300, "police-officer": 700,
  "supply-chain-analyst": 200, "copywriter": 130, "video-editor": 60,
  "pr-specialist": 280, "technical-writer": 55, "merch-buyer": 200,
  "journalist": 45, "ux-designer": 110, "construction-manager": 500,
  "translator-interpreter": 60, "radiologist": 35, "compliance-officer": 350,
  "claims-adjuster": 300, "architect": 130, "tax-preparer": 90,
  "research-scientist": 180, "photographer": 60, "civil-engineer": 330,
  "bank-teller": 400, "retail-supervisor": 1400,
  "licensed-practical-nurse": 630, "industrial-machinery-mechanic": 500,
  "pharmacy-technician": 450, "welder": 430, "preschool-teacher": 400,
  "substance-abuse-counselor": 350, "firefighter": 330, "emt-paramedic": 270,
  "genetic-counselor": 5, "veterinary-technician": 120, "chief-of-staff": 50,
  "cook-restaurant": 1400, "food-prep-worker": 900, "production-supervisor": 700,
  "packer-packager": 650, "bartender": 650, "forklift-operator": 600,
  "inspector-tester-sorter": 600, "hotel-housekeeper": 600, "dining-attendant": 550,
  "shipping-receiving-clerk": 550, "systems-analyst": 500, "billing-clerk": 500,
  "dishwasher": 500,
};
const TOTAL_US_EMPLOYMENT = 158400; // thousands
const coveredEmployment = JOB_PROFILES.reduce(
  (sum, job) => sum + (EMPLOYMENT_THOUSANDS[job.id] ?? 0), 0
);
const coveragePct = Math.round((coveredEmployment / TOTAL_US_EMPLOYMENT) * 100);

export default function JobTaskVisualizer({ initialJobId, dimensionScores }: JobTaskVisualizerProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(() => {
    if (initialJobId && JOB_PROFILES.find((j) => j.id === initialJobId)) {
      return initialJobId;
    }
    return "";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [adjustedShares, setAdjustedShares] = useState<Record<string, number>>(() => {
    if (initialJobId) {
      const job = JOB_PROFILES.find((j) => j.id === initialJobId);
      if (job) {
        const shares: Record<string, number> = {};
        job.tasks.forEach((t) => (shares[t.id] = t.timeShare));
        return shares;
      }
    }
    return {};
  });
  const [activeTab, setActiveTab] = useState<Tab>("breakdown");
  const [industrySpeedMultiplier, setIndustrySpeedMultiplier] = useState<number>(() => {
    if (initialJobId) {
      const job = JOB_PROFILES.find((j) => j.id === initialJobId);
      if (job) return INDUSTRY_ADOPTION_SPEED[job.category]?.multiplier ?? 1.0;
    }
    return 1.0;
  });

  const selectedJob = useMemo(
    () => JOB_PROFILES.find((j) => j.id === selectedJobId) ?? null,
    [selectedJobId]
  );

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return JOB_PROFILES;
    const q = searchQuery.toLowerCase();
    return JOB_PROFILES.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectJob = useCallback((job: JobProfile) => {
    setSelectedJobId(job.id);
    setSearchQuery("");
    // Initialize sliders with default shares
    const shares: Record<string, number> = {};
    job.tasks.forEach((t) => (shares[t.id] = t.timeShare));
    setAdjustedShares(shares);
    setIndustrySpeedMultiplier(INDUSTRY_ADOPTION_SPEED[job.category]?.multiplier ?? 1.0);
    setActiveTab("breakdown");
  }, []);

  const handleShareChange = useCallback((taskId: string, value: number) => {
    setAdjustedShares((prev: Record<string, number>) => {
      const clamped = Math.max(0, Math.min(1, value));
      const oldValue = prev[taskId] ?? 0;
      const delta = clamped - oldValue;
      if (delta === 0) return prev;

      // Sum of all OTHER sliders
      const othersSum = Object.entries(prev)
        .filter(([id]) => id !== taskId)
        .reduce((s: number, [, v]) => s + (v as number), 0);

      const next: Record<string, number> = {};

      if (othersSum === 0) {
        // Edge case: all others are zero, just set this one
        for (const [id, v] of Object.entries(prev)) {
          next[id] = id === taskId ? clamped : (v as number);
        }
      } else {
        // Proportionally scale other sliders so total stays at 1.0
        const remainingForOthers = Math.max(0, 1 - clamped);
        const scale = remainingForOthers / othersSum;
        for (const [id, v] of Object.entries(prev)) {
          if (id === taskId) {
            next[id] = clamped;
          } else {
            next[id] = Math.max(0, Math.round((v as number) * scale * 1000) / 1000);
          }
        }
      }
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (!selectedJob) return;
    const shares: Record<string, number> = {};
    selectedJob.tasks.forEach((t: { id: string; timeShare: number }) => (shares[t.id] = t.timeShare));
    setAdjustedShares(shares);
  }, [selectedJob]);

  const exposureScoreRaw = useMemo(() => {
    if (!selectedJob) return 0;
    return calculateJobExposure(selectedJob);
  }, [selectedJob]);

  const exposureScore = useCountUp(exposureScoreRaw, 600);

  // Job dimensionality: count unique task categories with >= 10% time share
  // Low-dimensional jobs face higher displacement risk (Gans & Goldfarb 2024)
  const dimensionalityInfo = useMemo(() => {
    if (!selectedJob) return null;
    const categoryShares: Record<string, number> = {};
    for (const task of selectedJob.tasks) {
      const cat = task.category as TaskCategory;
      categoryShares[cat] = (categoryShares[cat] ?? 0) + task.timeShare;
    }
    const effectiveDimensions = Object.values(categoryShares).filter((s) => s >= 0.10).length;
    const totalCategories = Object.keys(categoryShares).length;

    // Phase transition: count categories that have crossed cost parity
    let crossedCategories = 0;
    const categoryCrossed: Record<string, boolean> = {};
    for (const task of selectedJob.tasks) {
      const cat = task.category as TaskCategory;
      if (categoryCrossed[cat] !== undefined) continue;
      const crossover = calculateCrossoverYear(task, selectedJob.medianWagePerHr);
      categoryCrossed[cat] = crossover !== null && crossover <= 2030;
    }
    crossedCategories = Object.values(categoryCrossed).filter(Boolean).length;
    const crossedRatio = totalCategories > 0 ? crossedCategories / totalCategories : 0;

    return { effectiveDimensions, totalCategories, crossedCategories, crossedRatio };
  }, [selectedJob]);

  // Particle burst trigger — fires on job selection
  const [particleTrigger, setParticleTrigger] = useState(0);
  const prevJobRef = useRef<string>("");
  useEffect(() => {
    if (selectedJobId && selectedJobId !== prevJobRef.current) {
      // Small delay to let the count-up animation get close to final value
      const timer = setTimeout(() => setParticleTrigger((n) => n + 1), 650);
      prevJobRef.current = selectedJobId;
      return () => clearTimeout(timer);
    }
  }, [selectedJobId]);

  const tabs: { id: Tab; label: string; question: string }[] = [
    { id: "breakdown", label: "Task Breakdown", question: "Where does your time go, and which tasks are getting cheaper to do with AI?" },
    { id: "timeline", label: "Economic Timeline", question: "When will AI be cheaper than a person for each of your tasks?" },
    { id: "costs", label: "Compute Costs", question: "How fast is AI getting cheaper for your specific tasks?" },
    { id: "benchmarks", label: "Cost Benchmarks", question: "What does AI compute cost today, and how fast are prices dropping?" },
  ];

  return (
    <div>
      {/* Job selector */}
      <div className="mb-6">
        {/* CTA prompt */}
        {!selectedJob && (
          <div className="mb-5 px-5 py-4 rounded-xl bg-[var(--accent)]/[0.07] border border-[var(--accent)]/[0.15] max-w-2xl">
            <p className="text-[15px] font-semibold text-[var(--foreground)]">
              Pick a job title from the categories below, or search by name:
            </p>
            <p className="text-[13px] text-[var(--muted)] mt-1">
              Each job is broken into its individual tasks so you can see where AI pressure hits first.{" "}
              <a
                href="/task-visualizer/economy"
                className="text-[var(--accent)] hover:underline font-medium"
              >
                Or see the full US economy view &rarr;
              </a>
            </p>
            <p className="text-[11px] text-[var(--muted)] mt-2 opacity-70">
              {JOB_PROFILES.length}+ occupations covering ~{coveragePct}% of US employment (BLS 2024)
            </p>
          </div>
        )}
        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={selectedJob ? (searchQuery || selectedJob.title) : searchQuery}
            onChange={(e: { target: { value: string } }) => {
              setSearchQuery(e.target.value);
            }}
            onFocus={() => {
              if (selectedJob) setSearchQuery("");
            }}
            placeholder="Search for your job title..."
            className="w-full max-w-lg px-4 py-3 rounded-xl border border-black/[0.08] text-[14px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
          />
          {searchQuery && !selectedJob && filteredJobs.length > 0 && (
            <div className="absolute top-full left-0 right-0 max-w-lg mt-1 bg-white rounded-xl border border-black/[0.08] shadow-lg max-h-[280px] overflow-y-auto z-30">
              {filteredJobs.map((job: JobProfile) => {
                const colors = DEFAULT_CATEGORY_STYLE;
                return (
                  <button
                    key={job.id}
                    onClick={() => handleSelectJob(job)}
                    className="search-result-item w-full text-left px-4 py-2.5 hover:bg-black/[0.02] flex items-center gap-2"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: colors.accent }}
                    />
                    <span className="text-[13px] font-medium text-[var(--foreground)]">
                      {job.title}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] ml-auto">
                      ${job.medianWagePerHr}/hr
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {searchQuery && !selectedJob && filteredJobs.length === 0 && (
            <div className="absolute top-full left-0 right-0 max-w-lg mt-1 bg-white rounded-xl border border-black/[0.08] shadow-lg z-30">
              <p className="text-[13px] text-[var(--muted)] px-4 py-3">
                No matching jobs found.
              </p>
            </div>
          )}
        </div>

        {/* Sector grid - clickable category cards */}
        {!selectedJob && (
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {Object.entries(
              JOB_PROFILES.reduce<Record<string, typeof JOB_PROFILES>>((acc, job) => {
                if (!HIDDEN_CATEGORIES.includes(job.category)) {
                  (acc[job.category] ??= []).push(job);
                }
                return acc;
              }, {})
            ).sort(([a], [b]) => a.localeCompare(b)).map(([category, catJobs], index) => {
              const jobs = [...catJobs].sort((a, b) => a.title.localeCompare(b.title));
              const hue = (index * 24 + 230) % 360;
              const isExpanded = expandedCategory === category;
              return (
                <div
                  key={category}
                  className={`category-card rounded-lg border ${isExpanded ? "col-span-3 sm:col-span-3 lg:col-span-5" : ""}`}
                  style={{
                    backgroundColor: `hsla(${hue}, 40%, 97%, 1)`,
                    borderColor: isExpanded ? `hsla(${hue}, 30%, 75%, 1)` : `hsla(${hue}, 30%, 88%, 1)`,
                  }}
                >
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category)}
                    className="w-full text-left p-3 flex items-center justify-between gap-2"
                  >
                    <p
                      className="text-[11px] font-semibold tracking-wide uppercase"
                      style={{ color: `hsla(${hue}, 25%, 40%, 1)` }}
                    >
                      {category}
                      <span className="ml-1.5 text-[10px] font-normal normal-case tracking-normal opacity-60">
                        {jobs.length} {jobs.length === 1 ? "role" : "roles"}
                      </span>
                    </p>
                    <svg
                      className={`category-chevron w-3.5 h-3.5 ${isExpanded ? "rotate-180" : ""}`}
                      style={{ color: `hsla(${hue}, 25%, 55%, 1)` }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1">
                      {jobs.map((job) => (
                        <button
                          key={job.id}
                          onClick={() => handleSelectJob(job)}
                          className="job-item text-left text-[12px] py-1.5 px-2 rounded-md hover:bg-black/[0.05] text-[var(--foreground)]"
                        >
                          {job.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected job view */}
      {selectedJob && (
        <>
          {/* Header with job info */}
          <div className="mb-6 pb-6 border-b border-black/[0.06]">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
              <h2 className="text-[20px] font-bold text-[var(--foreground)] tracking-tight">
                {selectedJob.title}
              </h2>
              <button
                onClick={() => {
                  setSelectedJobId("");
                  setSearchQuery("");
                  setAdjustedShares({});
                }}
                className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] underline"
              >
                Change job
              </button>
            </div>

            {/* Scannable stat pills - each links to its explainer */}
            <div className="flex flex-wrap gap-2 mb-4">
              <ExposureTooltip>
                <div className="exposure-score relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/[0.02] border border-black/[0.06] overflow-hidden cursor-help">
                  <ExposureParticles score={exposureScoreRaw} trigger={particleTrigger} />
                  <p
                    className="text-[16px] font-bold tracking-tight relative z-10 leading-none"
                    style={{
                      color:
                        exposureScoreRaw > 60
                          ? "#EF4444"
                          : exposureScoreRaw > 35
                            ? "#6366F1"
                            : "#10B981",
                    }}
                  >
                    {exposureScore}
                  </p>
                  <span className="relative z-10 text-[11px] text-[var(--muted)]">
                    exposure score
                  </span>
                </div>
              </ExposureTooltip>

              <button
                onClick={() => setActiveTab("breakdown")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/[0.02] border border-black/[0.06] text-[11px] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)] transition-colors"
              >
                <span className="text-[14px] font-bold text-[var(--foreground)]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {selectedJob.tasks.length}
                </span>
                tasks analyzed
              </button>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/[0.02] border border-black/[0.06] text-[11px] text-[var(--muted)]">
                <span className="text-[14px] font-bold text-[var(--foreground)]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  ${selectedJob.medianWagePerHr}
                </span>
                /hr median wage
              </span>

              <a
                href={`https://www.bls.gov/ooh/${selectedJob.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/[0.02] border border-black/[0.06] text-[11px] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)] transition-colors"
              >
                {selectedJob.category}
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="opacity-40">
                  <path d="M6 3h7v7M13 3L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {dimensionalityInfo && (
                <a
                  href="/occupation-exposure#methodology-complementarity"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] hover:border-[var(--accent)] transition-colors"
                  style={{
                    borderColor:
                      dimensionalityInfo.effectiveDimensions <= 2
                        ? "rgba(239,68,68,0.25)"
                        : dimensionalityInfo.effectiveDimensions <= 4
                          ? "rgba(245,158,11,0.25)"
                          : "rgba(16,185,129,0.25)",
                    backgroundColor:
                      dimensionalityInfo.effectiveDimensions <= 2
                        ? "rgba(239,68,68,0.04)"
                        : dimensionalityInfo.effectiveDimensions <= 4
                          ? "rgba(245,158,11,0.04)"
                          : "rgba(16,185,129,0.04)",
                    color:
                      dimensionalityInfo.effectiveDimensions <= 2
                        ? "#DC2626"
                        : dimensionalityInfo.effectiveDimensions <= 4
                          ? "#D97706"
                          : "#059669",
                  }}
                >
                  <span className="text-[14px] font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {dimensionalityInfo.effectiveDimensions}/{dimensionalityInfo.totalCategories}
                  </span>
                  <span className="opacity-80">task dimensions</span>
                </a>
              )}
            </div>

            {/* Plain-language AI impact summary */}
            {dimensionScores[selectedJob.id] && (() => {
              const summary = workerSummary(
                dimensionScores[selectedJob.id].scores as Parameters<typeof workerSummary>[0],
                selectedJob.title
              );
              const rc = dimensionScores[selectedJob.id].scores.netRisk > 6
                ? "#DC2626"
                : dimensionScores[selectedJob.id].scores.netRisk > 4
                  ? "#D97706"
                  : "#059669";
              return (
                <div
                  className="px-4 py-3 rounded-lg border"
                  style={{
                    borderColor: rc + "18",
                    background: rc + "06",
                  }}
                >
                  <p className="text-[13px] font-medium text-[var(--foreground)] leading-snug">
                    {summary.headline}
                  </p>
                  <p className="text-[12px] text-[var(--muted)] mt-1.5 leading-relaxed">
                    {summary.guidance}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Two-column layout: sliders + main content */}
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
            {/* Left: Sliders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-semibold text-[var(--foreground)]">
                  Your task mix
                </h3>
                <button
                  onClick={handleReset}
                  className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] underline"
                >
                  Reset to defaults
                </button>
              </div>
              <TaskSliders
                tasks={selectedJob.tasks}
                adjustedShares={adjustedShares}
                onShareChange={handleShareChange}
                humanWagePerHr={selectedJob.medianWagePerHr}
              />
              <IndustrySpeedSlider
                category={selectedJob.category}
                value={industrySpeedMultiplier}
                onChange={setIndustrySpeedMultiplier}
              />
              {dimensionScores[selectedJob.id] && (
                <DimensionSummary
                  data={dimensionScores[selectedJob.id]}
                  jobTitle={selectedJob.title}
                />
              )}
            </div>

            {/* Right: Visualizations */}
            <div>
              {/* Tab bar */}
              <div className="flex gap-1 mb-5 border-b border-black/[0.06]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    data-active={activeTab === tab.id}
                    className={`viz-tab text-[12px] font-medium px-3 py-2 border-b-2 ${
                      activeTab === tab.id
                        ? "border-[var(--accent)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab question */}
              <p className="text-[14px] font-medium text-[var(--foreground)] mb-4 -mt-1">
                {tabs.find((t) => t.id === activeTab)?.question}
              </p>

              {/* Tab content */}
              {activeTab === "breakdown" && (
                <div className="space-y-8">
                  <TaskBreakdownChart
                    tasks={selectedJob.tasks}
                    adjustedShares={adjustedShares}
                    humanWagePerHr={selectedJob.medianWagePerHr}
                  />
                  <FocusRecommendations
                    tasks={selectedJob.tasks}
                    adjustedShares={adjustedShares}
                    humanWagePerHr={selectedJob.medianWagePerHr}
                    industrySpeedMultiplier={industrySpeedMultiplier}
                    adaptiveCapacity={selectedJob.adaptiveCapacity}
                    highVulnerability={selectedJob.highVulnerability}
                  />
                </div>
              )}

              {activeTab === "timeline" && (
                <AutomationTimeline
                  tasks={selectedJob.tasks}
                  adjustedShares={adjustedShares}
                  humanWagePerHr={selectedJob.medianWagePerHr}
                  industrySpeedMultiplier={industrySpeedMultiplier}
                />
              )}

              {activeTab === "costs" && (
                <ComputeCostChart
                  tasks={selectedJob.tasks}
                  adjustedShares={adjustedShares}
                  humanWagePerHr={selectedJob.medianWagePerHr}
                />
              )}

              {activeTab === "benchmarks" && <ComputeBenchmarks />}
            </div>
          </div>
        </>
      )}

      {/* Durable human skills — optimistic closing */}
      <DurableSkillsSection
        selectedJob={selectedJob}
        adjustedShares={adjustedShares}
      />

      {/* Methodology */}
      <MethodologySection />
    </div>
  );
}
