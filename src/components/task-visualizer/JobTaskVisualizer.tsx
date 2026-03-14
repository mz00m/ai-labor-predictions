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
import MethodologySection from "./MethodologySection";

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

export default function JobTaskVisualizer({ initialJobId }: JobTaskVisualizerProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(() => {
    if (initialJobId && JOB_PROFILES.find((j) => j.id === initialJobId)) {
      return initialJobId;
    }
    return "";
  });
  const [searchQuery, setSearchQuery] = useState("");
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
    setActiveTab("breakdown");
  }, []);

  const handleShareChange = useCallback((taskId: string, value: number) => {
    setAdjustedShares((prev) => {
      const clamped = Math.max(0, Math.min(1, value));
      const oldValue = prev[taskId] ?? 0;
      const delta = clamped - oldValue;
      if (delta === 0) return prev;

      // Sum of all OTHER sliders
      const othersSum = Object.entries(prev)
        .filter(([id]) => id !== taskId)
        .reduce((s, [, v]) => s + v, 0);

      const next: Record<string, number> = {};

      if (othersSum === 0) {
        // Edge case: all others are zero, just set this one
        for (const [id, v] of Object.entries(prev)) {
          next[id] = id === taskId ? clamped : v;
        }
      } else {
        // Proportionally scale other sliders so total stays at 1.0
        const remainingForOthers = Math.max(0, 1 - clamped);
        const scale = remainingForOthers / othersSum;
        for (const [id, v] of Object.entries(prev)) {
          if (id === taskId) {
            next[id] = clamped;
          } else {
            next[id] = Math.max(0, Math.round(v * scale * 1000) / 1000);
          }
        }
      }
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (!selectedJob) return;
    const shares: Record<string, number> = {};
    selectedJob.tasks.forEach((t) => (shares[t.id] = t.timeShare));
    setAdjustedShares(shares);
  }, [selectedJob]);

  const exposureScore = useMemo(() => {
    if (!selectedJob) return 0;
    return calculateJobExposure(selectedJob);
  }, [selectedJob]);

  const tabs: { id: Tab; label: string; question: string }[] = [
    { id: "breakdown", label: "Task Breakdown", question: "How is your time spent, and which tasks face the most automation pressure?" },
    { id: "timeline", label: "Automation Timeline", question: "When will it become cheaper to automate each of your tasks than to pay you?" },
    { id: "costs", label: "Compute Costs", question: "How fast is AI getting cheaper for each of your specific tasks?" },
    { id: "benchmarks", label: "Cost Benchmarks", question: "How much does AI compute cost today, and how fast is it falling?" },
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
            onChange={(e) => {
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
              {filteredJobs.map((job) => {
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

        {/* Sector grid - compact colored cards */}
        {!selectedJob && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {Object.entries(
              JOB_PROFILES.reduce<Record<string, typeof JOB_PROFILES>>((acc, job) => {
                (acc[job.category] ??= []).push(job);
                return acc;
              }, {})
            ).map(([category, jobs]) => {
              const colors = DEFAULT_CATEGORY_STYLE;
              return (
                <div
                  key={category}
                  className="rounded-lg border p-3 transition-colors hover:shadow-sm"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <p
                    className="text-[11px] font-semibold mb-2 tracking-wide uppercase"
                    style={{ color: colors.text }}
                  >
                    {category}
                  </p>
                  <div className="space-y-0.5">
                    {jobs.map((job) => (
                      <button
                        key={job.id}
                        onClick={() => handleSelectJob(job)}
                        className="block w-full text-left text-[12px] py-1 px-1.5 rounded transition-colors hover:bg-black/[0.04] text-[var(--foreground)]"
                      >
                        {job.title}
                      </button>
                    ))}
                  </div>
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
                {selectedJob.category} — Median wage: ${selectedJob.medianWagePerHr}/hr (BLS) —{" "}
                {selectedJob.tasks.length} task components
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
              <p className="text-[11px] text-[var(--muted)]">Automation exposure</p>
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
                  />
                </div>
              )}

              {activeTab === "timeline" && (
                <AutomationTimeline
                  tasks={selectedJob.tasks}
                  adjustedShares={adjustedShares}
                  humanWagePerHr={selectedJob.medianWagePerHr}
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
