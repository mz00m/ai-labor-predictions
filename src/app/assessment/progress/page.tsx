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
} from "@/lib/assessment/types";
import { AUTO_STEPS, STEP_LABELS, STEP_DESCRIPTIONS } from "@/lib/assessment/types";
import { STEP_TIMEOUT_MS, tryRecoverStepFromDb } from "./recovery";

// The progress page only drives the AUTO pipeline (profile → tasks → tools).
// Roadmap, ROI, and risks are opt-in — generated from the report page.
const AUTO_STEP_LOADING_MESSAGES: Partial<Record<AssessmentStep, string[]>> = {
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
    "Ranking tools by where to start, what to add next, and what to consider later...",
    "Pulling pricing and getting-started details...",
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

        // Determine which AUTO steps are already done based on report content.
        // Optional steps (roadmap, roi, risks) are not driven from this page.
        const done = new Set<AssessmentStep>();
        if (a.report?.organizationProfile) done.add("profile");
        if (a.report?.taskAnalysis?.length) done.add("tasks");
        if (a.report?.toolRecommendations?.length) done.add("tools");
        setCompletedSteps(done);

        // Set active step to first incomplete in the AUTO pipeline. Once
        // the auto-pipeline is done, drop the user on the report page —
        // they'll opt in to additional sections from there.
        const nextStep = AUTO_STEPS.find((s) => !done.has(s));
        if (nextStep) {
          setActiveStep(nextStep);
        } else {
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
    const msgs = AUTO_STEP_LOADING_MESSAGES[activeStep];
    if (!msgs || msgs.length === 0) return;
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
      formPayload.append("assessmentId", id);
      formPayload.append("step", step);

      // Only send full intake + files for the first step (profile).
      // Steps 2-4 load intake from DB, skip file/website reprocessing.
      if (step === "profile") {
        formPayload.append("intake", JSON.stringify(assessment.intake));
        formPayload.append("email", "");
      }

      // Advance local state after the step is confirmed complete (either via
      // the direct fetch response or via a DB recovery poll). Extracted so
      // both the happy path and the recovery path go through the same logic.
      const completeStep = (nextReportPatch?: Partial<AssessmentReport>, fullAssessment?: Assessment) => {
        setAssessment((prev) => {
          if (fullAssessment) return fullAssessment;
          if (!prev) return prev;
          return {
            ...prev,
            report: { ...(prev.report || {} as AssessmentReport), ...(nextReportPatch || {}) },
          };
        });
        setCompletedSteps((prev) => new Set([...Array.from(prev), step]));
        const stepIndex = AUTO_STEPS.indexOf(step);
        if (stepIndex >= 0 && stepIndex < AUTO_STEPS.length - 1) {
          setActiveStep(AUTO_STEPS[stepIndex + 1]);
        } else {
          // Auto pipeline finished — let the user opt in to roadmap, ROI,
          // and risks from the report page.
          router.push(`/assessment/report?id=${id}`);
        }
      };

      // Retry up to 2 times on network/server failures with a long timeout
      // aligned to the server's maxDuration. On abort or 5xx, fall through
      // to the DB recovery poll before surfacing an error to the user —
      // the server often finishes the Claude call even when the fetch is
      // terminated client-side.
      let lastErr: Error | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), STEP_TIMEOUT_MS);

          const res = await fetch("/api/assessment/analyze", {
            method: "POST",
            body: formPayload,
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            if (res.status >= 400 && res.status < 500) {
              throw new Error(data.error || `Failed to generate ${step}`);
            }
            throw new Error(data.error || "Server error — please try again.");
          }

          const data = await res.json();
          completeStep(data.report);
          return; // Success
        } catch (err) {
          lastErr = err instanceof Error ? err : new Error("An error occurred");
          // 4xx client errors: no point retrying and no point polling — the
          // request was malformed; surface immediately.
          if (lastErr.message.startsWith("Failed to generate")) {
            throw lastErr;
          }
          if (lastErr.name !== "AbortError" && attempt < 1) {
            // Retryable 5xx: brief pause then try again.
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }
          // Either we aborted, or we've exhausted retries on 5xx. Before
          // surfacing an error, check whether the server actually finished.
          const recovered = await tryRecoverStepFromDb(id, step);
          if (recovered) {
            completeStep(undefined, recovered);
            return;
          }
          if (lastErr.name === "AbortError") {
            throw new Error("This step took longer than expected and we couldn't recover it. Please try again.");
          }
          break;
        }
      }
      throw lastErr || new Error(`Failed to generate ${step}. Please try again.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  }, [id, assessment, router]);

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-base text-red-600">
          {error}
        </div>
      </div>
    );
  }

  const report = assessment?.report;
  const activeStepIndex = AUTO_STEPS.indexOf(activeStep);
  const loadingMessages = AUTO_STEP_LOADING_MESSAGES[activeStep] || [];
  const currentLoadingMsg = loadingMessages.length > 0
    ? loadingMessages[loadingMsgIndex % loadingMessages.length]
    : "";

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
      {/* Header */}
      <h1 className="text-4xl sm:text-heading-2xl font-bold text-gray-900 leading-tight mb-2 tracking-tight">
        Your AI Action Plan
      </h1>
      <p className="text-md text-gray-400 mb-8">
        {assessment?.intake?.organizationName}
      </p>

      {/* Step progress bar — only shows the AUTO pipeline */}
      <div className="flex items-center gap-1 mb-10">
        {AUTO_STEPS.map((s, i) => {
          const isDone = completedSteps.has(s);
          const isActive = s === activeStep;
          return (
            <div key={s} className="flex items-center gap-1">
              <div
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                  isDone
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : isActive
                      ? "bg-accent text-white"
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
              {i < AUTO_STEPS.length - 1 && (
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
              <h4 className="text-base font-semibold text-gray-700 mb-2">Executive Summary</h4>
              <p className="text-base text-gray-600 leading-relaxed">{report.executiveSummary}</p>
            </div>
          )}
          {report.organizationProfile && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-base font-medium text-gray-700">AI Readiness Score</span>
                <span className="text-heading-sm font-bold text-accent">
                  {report.organizationProfile.aiReadinessScore}/10
                </span>
              </div>
              <p className="text-base text-gray-500">{report.organizationProfile.industryContext}</p>
            </div>
          )}
          {report.quickWins && report.quickWins.length > 0 && (
            <div>
              <h4 className="text-base font-semibold text-gray-700 mb-3">Quick Wins (try this week)</h4>
              <div className="space-y-2">
                {report.quickWins.map((qw: QuickWin, i: number) => (
                  <div key={i} className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-medium text-gray-900">{qw.title}</span>
                      <span className={`text-2xs px-1.5 py-0.5 rounded-full font-medium ${
                        qw.impact === "high" ? "bg-green-100 text-green-700" :
                        qw.impact === "medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {qw.impact} impact
                      </span>
                      {qw.timeToImplement && (
                        <span className="text-2xs text-gray-400">{qw.timeToImplement}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{qw.description}</p>
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
                  <span className="text-base font-medium text-gray-900">{task.taskName}</span>
                  <span className={`text-2xs px-1.5 py-0.5 rounded-full font-medium ${
                    task.aiOpportunity === "high" ? "bg-accent/10 text-accent" :
                    task.aiOpportunity === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {task.aiOpportunity} opportunity
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{task.aiApproach}</p>
                {task.estimatedTimeSaved && (
                  <span className="text-xs text-green-600 font-medium">
                    Potential savings: {task.estimatedTimeSaved}
                  </span>
                )}
              </div>
            ))}
            {report.taskAnalysis.length > 6 && (
              <p className="text-sm text-gray-400 text-center">
                + {report.taskAnalysis.length - 6} more tasks in full report
              </p>
            )}
          </div>
        </StepResultSection>
      )}

      {completedSteps.has("tools") && report?.toolRecommendations && (
        <StepResultSection
          title="Tool Recommendations"
          stepKey="tools"
          isLatest={false}
        >
          <div className="space-y-3">
            {report.toolRecommendations.slice(0, 5).map((tool: ToolRecommendation, i: number) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-medium text-gray-900">
                    {tool.toolName || tool.category}
                  </span>
                  <span className={`text-2xs px-1.5 py-0.5 rounded-full font-medium ${
                    tool.recommendationTier === "start-here" ? "bg-green-100 text-green-700" :
                    tool.recommendationTier === "add-next" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {tool.recommendationTier || tool.priorityTier}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{tool.purpose}</p>
                {tool.estimatedMonthlyCost && (
                  <span className="text-xs text-gray-400">{tool.estimatedMonthlyCost}</span>
                )}
              </div>
            ))}
          </div>
        </StepResultSection>
      )}

      {/* Active step section */}
      {!completedSteps.has(activeStep) && (
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-heading-sm font-bold text-gray-900 mb-1">
              Step {activeStepIndex + 1}: {STEP_LABELS[activeStep]}
            </h2>
            <p className="text-base text-gray-400">
              {STEP_DESCRIPTIONS[activeStep]}
            </p>
          </div>

          {/* Feedback form removed from between steps — now only on final report page */}

          {/* Generate / Loading state */}
          {generating ? (
            <div className="border border-accent/20 bg-accent/5 rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <div>
                  <p className="text-md font-medium text-gray-900">
                    {STEP_LABELS[activeStep]}...
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5 transition-opacity duration-500">
                    {currentLoadingMsg}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-accent h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(95, (elapsedSeconds / 120) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")} elapsed</span>
                <span>Typically 1–3 minutes</span>
              </div>
              {elapsedSeconds > 90 && (
                <p className="text-sm text-gray-400 italic">
                  Still working — longer steps can take up to 4 minutes. You can
                  close this tab if you need to — we&rsquo;ll email you when the
                  report is ready.
                </p>
              )}
            </div>
          ) : (
            <div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-base text-red-600 mb-4">
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
                className="w-full bg-accent hover:bg-[#4F52D4] text-white font-semibold text-md py-3 rounded-lg transition-colors"
              >
                {activeStepIndex === 0 ? "Generate" : "Continue"}: {STEP_LABELS[activeStep]}
              </button>

              {activeStepIndex === 0 && (
                <p className="text-sm text-gray-400 text-center mt-3">
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
      isLatest ? "border-accent/20 bg-white" : "border-gray-100 bg-gray-50/50"
    }`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-md font-semibold text-gray-900">{title}</span>
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
