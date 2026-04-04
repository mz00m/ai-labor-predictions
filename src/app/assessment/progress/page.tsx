"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type {
  Assessment,
  AssessmentStep,
  AssessmentReport,
  QuickWin,
  TaskAnalysis,
  ToolRecommendation,
  RoiProjection,
} from "@/lib/assessment/types";
import { ASSESSMENT_STEPS, STEP_LABELS, STEP_DESCRIPTIONS } from "@/lib/assessment/types";

const STEP_LOADING_MESSAGES: Record<AssessmentStep, string[]> = {
  profile: [
    "Reading your uploaded documents and website...",
    "Analyzing your industry context...",
    "Identifying quick wins and immediate opportunities...",
  ],
  tasks: [
    "Mapping your tasks against our AI capability database...",
    "Analyzing automation potential for each task...",
    "Estimating time savings and impact...",
  ],
  tools: [
    "Matching AI tools to your specific workflows...",
    "Building your implementation roadmap...",
    "Calculating ROI projections...",
  ],
  risks: [
    "Assessing organizational risks and change management...",
    "Generating your AI policy framework...",
    "Building your custom prompt library...",
  ],
};

export default function ProgressPage() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current step being generated or shown
  const [activeStep, setActiveStep] = useState<AssessmentStep>("profile");
  const [generating, setGenerating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // Feedback between steps
  const [feedbackComments, setFeedbackComments] = useState("");
  const [prioritize, setPrioritize] = useState("");
  const [deprioritize, setDeprioritize] = useState("");

  // Track which steps are complete
  const [completedSteps, setCompletedSteps] = useState<Set<AssessmentStep>>(new Set());

  // Load assessment on mount
  useEffect(() => {
    if (!id) return;
    fetch(`/api/assessment/report?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const a = data.assessment as Assessment;
        setAssessment(a);

        // Determine which steps are already done based on report content
        const done = new Set<AssessmentStep>();
        if (a.report?.organizationProfile) done.add("profile");
        if (a.report?.taskAnalysis?.length) done.add("tasks");
        if (a.report?.toolRecommendations?.length) done.add("tools");
        if (a.report?.riskAssessment) done.add("risks");
        setCompletedSteps(done);

        // Set active step to first incomplete
        const nextStep = ASSESSMENT_STEPS.find((s) => !done.has(s));
        if (nextStep) {
          setActiveStep(nextStep);
        } else {
          // All done, redirect to report
          router.push(`/assessment/report?id=${id}`);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, router]);

  // Timer for loading state
  useEffect(() => {
    if (generating) {
      setElapsedSeconds(0);
      setLoadingMsgIndex(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [generating]);

  // Rotate loading messages
  useEffect(() => {
    if (!generating) return;
    const msgs = STEP_LOADING_MESSAGES[activeStep];
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % msgs.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [generating, activeStep]);

  const runStep = useCallback(async (step: AssessmentStep) => {
    if (!id || !assessment) return;
    setGenerating(true);
    setError(null);

    try {
      const formPayload = new FormData();
      formPayload.append("intake", JSON.stringify(assessment.intake));
      formPayload.append("email", ""); // Already created
      formPayload.append("assessmentId", id);
      formPayload.append("step", step);

      // Include feedback if user provided any
      if (feedbackComments || prioritize || deprioritize) {
        formPayload.append("feedback", JSON.stringify({
          comments: feedbackComments || undefined,
          adjustments: (prioritize || deprioritize) ? {
            prioritize: prioritize ? prioritize.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
            deprioritize: deprioritize ? deprioritize.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
          } : undefined,
        }));
      }

      const res = await fetch("/api/assessment/analyze", {
        method: "POST",
        body: formPayload,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to generate ${step}`);
      }

      const data = await res.json();

      // Merge the new step results into the local assessment
      setAssessment((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          report: { ...(prev.report || {} as AssessmentReport), ...data.report },
        };
      });

      setCompletedSteps((prev) => new Set([...Array.from(prev), step]));

      // Reset feedback
      setFeedbackComments("");
      setPrioritize("");
      setDeprioritize("");

      // Move to next step
      const stepIndex = ASSESSMENT_STEPS.indexOf(step);
      if (stepIndex < ASSESSMENT_STEPS.length - 1) {
        setActiveStep(ASSESSMENT_STEPS[stepIndex + 1]);
      } else {
        // All steps done, go to report
        router.push(`/assessment/report?id=${id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  }, [id, assessment, feedbackComments, prioritize, deprioritize, router]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-[13px] text-red-600">
          {error}
        </div>
      </div>
    );
  }

  const report = assessment?.report;
  const activeStepIndex = ASSESSMENT_STEPS.indexOf(activeStep);
  const loadingMessages = STEP_LOADING_MESSAGES[activeStep];
  const currentLoadingMsg = loadingMessages[loadingMsgIndex % loadingMessages.length];

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
      {/* Header */}
      <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-900 leading-tight mb-2 tracking-tight">
        Your AI Action Plan
      </h1>
      <p className="text-[14px] text-gray-400 mb-8">
        {assessment?.intake?.organizationName}
      </p>

      {/* Step progress bar */}
      <div className="flex items-center gap-1 mb-10">
        {ASSESSMENT_STEPS.map((s, i) => {
          const isDone = completedSteps.has(s);
          const isActive = s === activeStep;
          return (
            <div key={s} className="flex items-center gap-1">
              <div
                className={`text-[12px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                  isDone
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : isActive
                      ? "bg-[#5C61F6] text-white"
                      : "bg-gray-50 text-gray-300 border border-gray-100"
                }`}
              >
                {isDone && (
                  <svg className="w-3 h-3 inline mr-1 -mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {STEP_LABELS[s].split(" ")[0]}
              </div>
              {i < ASSESSMENT_STEPS.length - 1 && (
                <svg className="w-3 h-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Completed step results */}
      {completedSteps.has("profile") && report && (
        <StepResultSection
          title="Organization Profile & Quick Wins"
          stepKey="profile"
          isLatest={activeStep === "tasks"}
        >
          {report.executiveSummary && (
            <div className="mb-6">
              <h4 className="text-[13px] font-semibold text-gray-700 mb-2">Executive Summary</h4>
              <p className="text-[13px] text-gray-600 leading-relaxed">{report.executiveSummary}</p>
            </div>
          )}
          {report.organizationProfile && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[13px] font-medium text-gray-700">AI Readiness Score</span>
                <span className="text-[20px] font-bold text-[#5C61F6]">
                  {report.organizationProfile.aiReadinessScore}/10
                </span>
              </div>
              <p className="text-[13px] text-gray-500">{report.organizationProfile.industryContext}</p>
            </div>
          )}
          {report.quickWins && report.quickWins.length > 0 && (
            <div>
              <h4 className="text-[13px] font-semibold text-gray-700 mb-3">Quick Wins (try this week)</h4>
              <div className="space-y-2">
                {report.quickWins.map((qw: QuickWin, i: number) => (
                  <div key={i} className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-medium text-gray-900">{qw.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        qw.impact === "high" ? "bg-green-100 text-green-700" :
                        qw.impact === "medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {qw.impact} impact
                      </span>
                      {qw.timeToImplement && (
                        <span className="text-[10px] text-gray-400">{qw.timeToImplement}</span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500">{qw.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </StepResultSection>
      )}

      {completedSteps.has("tasks") && report?.taskAnalysis && (
        <StepResultSection
          title="Task-by-Task Analysis"
          stepKey="tasks"
          isLatest={activeStep === "tools"}
        >
          <div className="space-y-3">
            {report.taskAnalysis.slice(0, 6).map((task: TaskAnalysis, i: number) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-medium text-gray-900">{task.taskName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    task.aiOpportunity === "high" ? "bg-[#5C61F6]/10 text-[#5C61F6]" :
                    task.aiOpportunity === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {task.aiOpportunity} opportunity
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 mb-1">{task.aiApproach}</p>
                {task.estimatedTimeSaved && (
                  <span className="text-[11px] text-green-600 font-medium">
                    Potential savings: {task.estimatedTimeSaved}
                  </span>
                )}
              </div>
            ))}
            {report.taskAnalysis.length > 6 && (
              <p className="text-[12px] text-gray-400 text-center">
                + {report.taskAnalysis.length - 6} more tasks in full report
              </p>
            )}
          </div>
        </StepResultSection>
      )}

      {completedSteps.has("tools") && report?.toolRecommendations && (
        <StepResultSection
          title="Tool Recommendations & Roadmap"
          stepKey="tools"
          isLatest={activeStep === "risks"}
        >
          <div className="space-y-3">
            {report.toolRecommendations.slice(0, 5).map((tool: ToolRecommendation, i: number) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-medium text-gray-900">
                    {tool.toolName || tool.category}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    tool.recommendationTier === "start-here" ? "bg-green-100 text-green-700" :
                    tool.recommendationTier === "add-next" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {tool.recommendationTier || tool.priorityTier}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500">{tool.purpose}</p>
                {tool.estimatedMonthlyCost && (
                  <span className="text-[11px] text-gray-400">{tool.estimatedMonthlyCost}</span>
                )}
              </div>
            ))}
          </div>
          {report.roiProjections && report.roiProjections.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-[13px] font-semibold text-gray-700 mb-2">ROI Projections</h4>
              <div className="space-y-2">
                {report.roiProjections.slice(0, 3).map((roi: RoiProjection, i: number) => (
                  <div key={i} className="flex items-center justify-between text-[12px]">
                    <span className="text-gray-600">{roi.area}</span>
                    <span className="text-green-600 font-medium">{roi.projectedSavings}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </StepResultSection>
      )}

      {/* Active step section */}
      {!completedSteps.has(activeStep) && (
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-[20px] font-bold text-gray-900 mb-1">
              Step {activeStepIndex + 1}: {STEP_LABELS[activeStep]}
            </h2>
            <p className="text-[13px] text-gray-400">
              {STEP_DESCRIPTIONS[activeStep]}
            </p>
          </div>

          {/* Feedback form (shown for steps 2-4, after previous step completed) */}
          {activeStepIndex > 0 && !generating && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-gray-900 mb-1">
                  Steer the next section (optional)
                </h3>
                <p className="text-[12px] text-gray-400">
                  Based on what you saw above, tell us what to focus on or skip.
                </p>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-600 mb-1">
                  Any guidance or corrections?
                </label>
                <textarea
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  placeholder="e.g., Focus more on client communication tasks. The invoicing analysis was spot-on."
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-700 placeholder:text-gray-300 min-h-[60px] resize-y focus:outline-none focus:border-[#5C61F6]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-600 mb-1">
                    Prioritize (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={prioritize}
                    onChange={(e) => setPrioritize(e.target.value)}
                    placeholder="e.g., email automation, scheduling"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#5C61F6]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-600 mb-1">
                    Deprioritize (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={deprioritize}
                    onChange={(e) => setDeprioritize(e.target.value)}
                    placeholder="e.g., social media, design work"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#5C61F6]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Generate / Loading state */}
          {generating ? (
            <div className="border border-[#5C61F6]/20 bg-[#5C61F6]/5 rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-[#5C61F6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <div>
                  <p className="text-[14px] font-medium text-gray-900">
                    {STEP_LABELS[activeStep]}...
                  </p>
                  <p className="text-[12px] text-gray-400 mt-0.5 transition-opacity duration-500">
                    {currentLoadingMsg}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#5C61F6] h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(95, (elapsedSeconds / 45) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[12px] text-gray-400">
                <span>{Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")} elapsed</span>
                <span>Typically 20-45 seconds</span>
              </div>
            </div>
          ) : (
            <div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-[13px] text-red-600 mb-4">
                  {error}
                  <button
                    onClick={() => { setError(null); runStep(activeStep); }}
                    className="ml-2 underline hover:no-underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              <button
                onClick={() => runStep(activeStep)}
                className="w-full bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[14px] py-3 rounded-lg transition-colors"
              >
                {activeStepIndex === 0 ? "Generate" : "Continue"}: {STEP_LABELS[activeStep]}
              </button>

              {activeStepIndex === 0 && (
                <p className="text-[12px] text-gray-400 text-center mt-3">
                  Your files are processed in-memory only, nothing stored.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StepResultSection({
  title,
  stepKey,
  isLatest,
  children,
}: {
  title: string;
  stepKey: string;
  isLatest: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`mb-6 border rounded-xl overflow-hidden transition-colors ${
      isLatest ? "border-[#5C61F6]/20 bg-white" : "border-gray-100 bg-gray-50/50"
    }`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[14px] font-semibold text-gray-900">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? "" : "rotate-180"}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {!collapsed && (
        <div className="px-5 pb-5">
          {children}
        </div>
      )}
    </div>
  );
}
