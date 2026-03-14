"use client";

import { useState, useCallback, useMemo } from "react";
import { JOB_PROFILES, JobProfile, calculateJobExposure } from "@/data/job-tasks";
import TaskBreakdownChart from "./TaskBreakdownChart";
import TaskSliders from "./TaskSliders";
import ComputeCostChart from "./ComputeCostChart";
import AutomationTimeline from "./AutomationTimeline";
import FocusRecommendations from "./FocusRecommendations";
import ComputeBenchmarks from "./ComputeBenchmarks";

type Tab = "breakdown" | "timeline" | "costs" | "benchmarks";

export default function JobTaskVisualizer() {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustedShares, setAdjustedShares] = useState<Record<string, number>>({});
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
    setAdjustedShares((prev) => ({ ...prev, [taskId]: value }));
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "breakdown", label: "Task Breakdown" },
    { id: "timeline", label: "Automation Timeline" },
    { id: "costs", label: "Compute Costs" },
    { id: "benchmarks", label: "Cost Benchmarks" },
  ];

  return (
    <div>
      {/* Job selector */}
      <div className="mb-8">
        <label className="block text-[13px] font-medium text-[var(--foreground)] mb-2">
          Select your job
        </label>
        <div className="relative">
          <input
            type="text"
            value={selectedJob ? (searchQuery || selectedJob.title) : searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (selectedJob && e.target.value !== selectedJob.title) {
                // Typing in search mode
              }
            }}
            onFocus={() => {
              if (selectedJob) setSearchQuery("");
            }}
            placeholder="Search for your job title..."
            className="w-full max-w-md px-4 py-2.5 rounded-xl border border-black/[0.08] text-[14px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
          />
          {/* Dropdown */}
          {searchQuery && !selectedJob && (
            <div className="absolute top-full left-0 right-0 max-w-md mt-1 bg-white rounded-xl border border-black/[0.08] shadow-lg max-h-[280px] overflow-y-auto z-30">
              {filteredJobs.length === 0 ? (
                <p className="text-[13px] text-[var(--muted)] px-4 py-3">
                  No matching jobs. Try a different search term.
                </p>
              ) : (
                filteredJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => handleSelectJob(job)}
                    className="w-full text-left px-4 py-2.5 hover:bg-black/[0.02] transition-colors"
                  >
                    <span className="text-[13px] font-medium text-[var(--foreground)]">
                      {job.title}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] ml-2">
                      {job.category} — ${job.medianWagePerHr}/hr
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
          {!searchQuery && !selectedJob && (
            <div className="absolute top-full left-0 right-0 max-w-md mt-1 bg-white rounded-xl border border-black/[0.08] shadow-lg max-h-[280px] overflow-y-auto z-30">
              {/* Show nothing until they type, or show all on focus */}
            </div>
          )}
        </div>

        {/* Quick select chips */}
        {!selectedJob && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {JOB_PROFILES.slice(0, 10).map((job) => (
              <button
                key={job.id}
                onClick={() => handleSelectJob(job)}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-black/[0.08] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-black/[0.15] transition-colors"
              >
                {job.title}
              </button>
            ))}
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
            <div className="text-center px-5 py-3 rounded-xl border border-black/[0.06]">
              <p
                className="text-[28px] font-bold tracking-tight"
                style={{
                  color:
                    exposureScore > 60
                      ? "#EF4444"
                      : exposureScore > 35
                        ? "#F59E0B"
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

      {/* Methodology note */}
      <div className="mt-12 pt-8 border-t border-black/[0.06]">
        <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
          How this works
        </h3>
        <div className="text-[12px] text-[var(--muted)] space-y-2 max-w-2xl">
          <p>
            Every job is a bundle of tasks. This tool breaks your job into its component activities
            (informed by the O*NET work activity taxonomy) and estimates the current compute cost
            to fully automate each one.
          </p>
          <p>
            The key insight: <strong className="text-[var(--foreground)]">automation follows economics, not capability</strong>.
            Even if AI <em>can</em> do a task, it only <em>will</em> when the compute cost drops
            below the human labor cost. By tracking the declining cost curve for each task type,
            we can project when each piece of your job faces automation pressure.
          </p>
          <p>
            Compute costs are estimated from current AI API pricing, cloud GPU rates, and
            task-specific complexity multipliers. Cost decline rates (30-48% annually) are based on
            observed trends from Epoch AI, Stanford HAI, and LLM pricing data since 2020.
          </p>
          <p>
            This is a simplified model — real-world adoption involves regulatory, organizational,
            and trust barriers beyond pure cost. Use it as a directional guide, not a forecast.
            Inspired by Charles Dillon&apos;s{" "}
            <a
              href="https://github.com/CharlesD353/ai-labour-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              AI Labour Calculator
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
