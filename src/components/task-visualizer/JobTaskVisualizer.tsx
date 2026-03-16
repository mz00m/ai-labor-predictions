"use client";

import { useState, useCallback, useMemo } from "react";
import { JOB_PROFILES, JobProfile, calculateJobExposure } from "@/data/job-tasks";
import TaskBreakdownChart from "./TaskBreakdownChart";
import TaskSliders from "./TaskSliders";
import ComputeCostChart from "./ComputeCostChart";
import AutomationTimeline from "./AutomationTimeline";
import FocusRecommendations from "./FocusRecommendations";
import ComputeBenchmarks from "./ComputeBenchmarks";
import DurableSkillsSection from "./DurableSkillsSection";
import IndustrySpeedSlider from "./IndustrySpeedSlider";
import MethodologySection from "./MethodologySection";
import { INDUSTRY_ADOPTION_SPEED } from "@/data/industry-adoption-speed";

const DEFAULT_CATEGORY_STYLE = {
  bg: "rgba(92,97,246,0.03)",
  border: "rgba(0,0,0,0.08)",
  text: "#6b7280",
  accent: "#5C61F6",
};

type Tab = "breakdown" | "timeline" | "costs" | "benchmarks";

interface JobTaskVisualizerProps {
  initialJobId?: string;
}

const HIDDEN_CATEGORIES = ["Building & Grounds", "Protective Services"];

export default function JobTaskVisualizer({ initialJobId }: JobTaskVisualizerProps) {
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

  const exposureScore = useMemo(() => {
    if (!selectedJob) return 0;
    return calculateJobExposure(selectedJob);
  }, [selectedJob]);

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
                    className="w-full text-left px-4 py-2.5 hover:bg-black/[0.02] transition-colors flex items-center gap-2"
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
            ).sort(([a], [b]) => a.localeCompare(b)).map(([category, jobs], index) => {
              const hue = (index * 24 + 230) % 360;
              const isExpanded = expandedCategory === category;
              return (
                <div
                  key={category}
                  className={`rounded-lg border transition-all ${isExpanded ? "col-span-3 sm:col-span-3 lg:col-span-5" : ""}`}
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
                      className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
                          className="text-left text-[12px] py-1.5 px-2 rounded-md hover:bg-black/[0.05] text-[var(--foreground)] transition-colors"
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
          {/* Header with job info and exposure score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-black/[0.06]">
            <div>
              <div className="flex items-center gap-3">
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
                  Change
                </button>
              </div>
              <p className="text-[13px] text-[var(--muted)] mt-0.5">
                {selectedJob.category} · ${selectedJob.medianWagePerHr}/hr median wage (BLS) · {selectedJob.tasks.length} tasks
              </p>
            </div>
            <div className="text-center px-5 py-3 rounded-xl bg-black/[0.02] border border-black/[0.06]">
              <p
                className="text-[28px] font-bold tracking-tight"
                style={{
                  color:
                    exposureScore > 60
                      ? "#EF4444"
                      : exposureScore > 35
                        ? "#6366F1"
                        : "#10B981",
                }}
              >
                {exposureScore}
              </p>
              <p className="text-[11px] text-[var(--muted)]">Economic exposure</p>
            </div>
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
            </div>

            {/* Right: Visualizations */}
            <div>
              {/* Tab bar */}
              <div className="flex gap-1 mb-5 border-b border-black/[0.06]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-[12px] font-medium px-3 py-2 border-b-2 transition-colors ${
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
