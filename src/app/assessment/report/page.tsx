"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Assessment, AssessmentReport } from "@/lib/assessment/types";

export default function ReportPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const isPreview = params.get("preview") === "true";
  const paymentSuccess = params.get("payment") === "success";

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/assessment/report?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAssessment(data.assessment);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadPdf = useCallback(async () => {
    if (!assessment?.report || !assessment?.intake) return;
    setDownloadingPdf(true);

    try {
      // Dynamic import for PDF generation (client-side)
      const { generatePdf } = await import("@/lib/assessment/pdf-generator");
      const buffer = generatePdf(assessment.intake, assessment.report, assessment.paid);
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AI-Assessment-${assessment.intake.organizationName.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloadingPdf(false);
    }
  }, [assessment]);

  const handleUnlock = async () => {
    if (!id || !assessment) return;

    try {
      const res = await fetch("/api/assessment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: id,
          email: assessment.userId, // TODO: resolve email from user
          addOn: false,
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      // Handle error
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-white/[0.06] rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-white/[0.04] rounded w-96 mx-auto" />
        </div>
        <p className="mt-8 text-[14px] text-[#5A6478]">Loading your assessment...</p>
      </div>
    );
  }

  if (error || !assessment?.report) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 text-center">
        <h1 className="text-[24px] font-bold text-white mb-4">
          {error || "Report not found"}
        </h1>
        <Link href="/assessment/start" className="text-[#5C61F6] hover:underline">
          Start a new assessment
        </Link>
      </div>
    );
  }

  const report = assessment.report;
  const showPaywall = isPreview && !assessment.paid;

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
      {/* Payment success banner */}
      {paymentSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-8 text-[14px] text-green-400">
          Payment successful. Your full report is now available.
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-white">
            AI Adoption Assessment
          </h1>
          <p className="text-[15px] text-[#8B95A5] mt-1">
            {assessment.intake.organizationName}
            {showPaywall && (
              <span className="ml-2 text-[12px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                PREVIEW
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="flex items-center gap-2 bg-[#5C61F6] hover:bg-[#4F52D4] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {downloadingPdf ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {/* Executive Summary */}
      <ReportSection title="Executive Summary">
        <p className="text-[14px] text-[#C5CDD8] leading-relaxed whitespace-pre-line">
          {report.executiveSummary}
        </p>
      </ReportSection>

      {/* AI Readiness */}
      {report.organizationProfile.aiReadinessScore > 0 && (
        <div className="bg-[#111827]/60 border border-white/[0.06] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-white">AI Readiness Score</h3>
              <p className="text-[12px] text-[#5A6478] mt-1">{report.organizationProfile.summary}</p>
            </div>
            <div className="text-[36px] font-black text-[#5C61F6]">
              {report.organizationProfile.aiReadinessScore}<span className="text-[16px] text-[#5A6478]">/10</span>
            </div>
          </div>
          <div className="mt-4 w-full bg-[#1a2032] rounded-full h-2">
            <div
              className="bg-[#5C61F6] h-2 rounded-full transition-all duration-500"
              style={{ width: `${report.organizationProfile.aiReadinessScore * 10}%` }}
            />
          </div>
        </div>
      )}

      {/* Task Analysis */}
      {report.taskAnalysis.length > 0 && (
        <ReportSection title="Task-Level AI Opportunity Analysis">
          <div className="space-y-3">
            {report.taskAnalysis.map((task, i) => (
              <div key={i} className="bg-[#111827]/40 border border-white/[0.04] rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-[14px] font-semibold text-white">{task.taskName}</h4>
                    <p className="text-[12px] text-[#5A6478]">{task.department}</p>
                  </div>
                  <OpportunityBadge level={task.aiOpportunity} />
                </div>
                <p className="text-[13px] text-[#8B95A5] mb-2">{task.aiApproach}</p>
                <p className="text-[12px] text-[#5A6478]">
                  Impact: {task.expectedImpact} | Complexity: {task.complexity}
                  {task.onetAlignment && ` | O*NET: ${task.onetAlignment}`}
                </p>
              </div>
            ))}
          </div>
        </ReportSection>
      )}

      {/* Paywall */}
      {showPaywall && (
        <div className="relative my-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0F1A] z-10" />
          <div className="relative z-20 text-center py-12 bg-[#111827]/80 border border-[#5C61F6]/20 rounded-xl">
            <h3 className="text-[20px] font-bold text-white mb-3">
              Unlock Your Full Report
            </h3>
            <p className="text-[14px] text-[#8B95A5] mb-6 max-w-md mx-auto">
              Get the complete analysis with tool recommendations, implementation roadmap,
              ROI projections, and actionable next steps.
            </p>
            <button
              onClick={handleUnlock}
              className="bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[14px] px-8 py-3 rounded-lg transition-colors"
            >
              Unlock Full Report — $100
            </button>
          </div>
        </div>
      )}

      {/* Full report sections (only shown if paid or not preview) */}
      {!showPaywall && (
        <>
          {/* Tool Recommendations */}
          {report.toolRecommendations.length > 0 && (
            <ReportSection title="Tool Recommendations">
              <div className="space-y-3">
                {report.toolRecommendations.map((tool, i) => (
                  <div key={i} className="bg-[#111827]/40 border border-white/[0.04] rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-[14px] font-semibold text-white">{tool.category}</h4>
                      <span className={`text-[11px] font-bold uppercase ${
                        tool.priorityTier === "immediate" ? "text-[#5C61F6]" :
                        tool.priorityTier === "medium-term" ? "text-amber-400" : "text-[#5A6478]"
                      }`}>
                        {tool.priorityTier}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#8B95A5] mb-1">{tool.purpose}</p>
                    <p className="text-[12px] text-[#5A6478]">
                      Value: {tool.expectedValue} | Effort: {tool.implementationEffort}
                      {tool.estimatedMonthlyCost && ` | ~${tool.estimatedMonthlyCost}/mo`}
                    </p>
                  </div>
                ))}
              </div>
            </ReportSection>
          )}

          {/* Implementation Roadmap */}
          <ReportSection title="Implementation Roadmap">
            {(["immediate", "mediumTerm", "longTerm"] as const).map((phase) => {
              const data = report.implementationRoadmap[phase];
              const label = phase === "immediate" ? "Immediate (0-3 months)" :
                phase === "mediumTerm" ? "Medium-Term (3-6 months)" : "Long-Term (6-12+ months)";

              return (
                <div key={phase} className="mb-6">
                  <h4 className="text-[14px] font-bold text-[#5C61F6] mb-3">{label}</h4>
                  {data.objectives.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[12px] font-semibold text-[#8B95A5] mb-1">Objectives</p>
                      <ul className="space-y-1">
                        {data.objectives.map((obj, i) => (
                          <li key={i} className="text-[13px] text-[#C5CDD8] flex gap-2">
                            <span className="text-[#5C61F6]">-</span> {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.actions.length > 0 && (
                    <div className="space-y-2">
                      {data.actions.map((action, i) => (
                        <div key={i} className="bg-[#111827]/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              action.priority === "critical" ? "bg-red-400" :
                              action.priority === "high" ? "bg-amber-400" : "bg-[#5A6478]"
                            }`} />
                            <span className="text-[13px] font-medium text-white">{action.title}</span>
                          </div>
                          <p className="text-[12px] text-[#8B95A5] ml-3.5">{action.description}</p>
                          <p className="text-[11px] text-[#5A6478] ml-3.5 mt-1">Owner: {action.owner}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {data.estimatedInvestment && (
                    <p className="text-[12px] text-[#5A6478] mt-2">Est. investment: {data.estimatedInvestment}</p>
                  )}
                </div>
              );
            })}
          </ReportSection>

          {/* Risk Assessment */}
          <ReportSection title="Risk Assessment">
            <div className="space-y-4">
              <div>
                <span className="text-[12px] font-semibold text-[#8B95A5]">Overall Risk</span>
                <span className={`ml-2 text-[12px] font-bold uppercase ${
                  report.riskAssessment.overallRiskLevel === "low" ? "text-green-400" :
                  report.riskAssessment.overallRiskLevel === "moderate" ? "text-amber-400" : "text-red-400"
                }`}>
                  {report.riskAssessment.overallRiskLevel}
                </span>
              </div>
              {report.riskAssessment.displacementRisk && (
                <div>
                  <p className="text-[12px] font-semibold text-[#8B95A5] mb-1">Displacement Risk</p>
                  <p className="text-[13px] text-[#C5CDD8]">{report.riskAssessment.displacementRisk}</p>
                </div>
              )}
              {report.riskAssessment.skillGaps.length > 0 && (
                <div>
                  <p className="text-[12px] font-semibold text-[#8B95A5] mb-1">Skill Gaps</p>
                  <ul className="space-y-1">
                    {report.riskAssessment.skillGaps.map((gap, i) => (
                      <li key={i} className="text-[13px] text-[#C5CDD8] flex gap-2">
                        <span className="text-[#5C61F6]">-</span> {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ReportSection>

          {/* ROI */}
          {report.roiProjections.length > 0 && (
            <ReportSection title="ROI Projections">
              <div className="space-y-3">
                {report.roiProjections.map((roi, i) => (
                  <div key={i} className="bg-[#111827]/40 border border-white/[0.04] rounded-lg p-4">
                    <h4 className="text-[14px] font-semibold text-white mb-1">{roi.area}</h4>
                    <div className="grid grid-cols-3 gap-4 text-[12px]">
                      <div>
                        <span className="text-[#5A6478]">Projected savings</span>
                        <p className="text-[#C5CDD8] font-medium">{roi.projectedSavings}</p>
                      </div>
                      <div>
                        <span className="text-[#5A6478]">Time to value</span>
                        <p className="text-[#C5CDD8] font-medium">{roi.timeToValue}</p>
                      </div>
                      <div>
                        <span className="text-[#5A6478]">Confidence</span>
                        <p className={`font-medium ${
                          roi.confidence === "high" ? "text-green-400" : roi.confidence === "moderate" ? "text-amber-400" : "text-[#5A6478]"
                        }`}>{roi.confidence}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ReportSection>
          )}

          {/* Further Evaluation */}
          {report.furtherEvaluation.length > 0 && (
            <ReportSection title="Recommended Next Steps">
              <ul className="space-y-2">
                {report.furtherEvaluation.map((item, i) => (
                  <li key={i} className="text-[13px] text-[#C5CDD8] flex gap-2">
                    <span className="text-[#5C61F6] font-bold">{i + 1}.</span> {item}
                  </li>
                ))}
              </ul>
            </ReportSection>
          )}

          {/* Add-on upsell */}
          {!assessment.addOns.policyAndPrompts && (
            <div className="mt-10 bg-[#111827]/60 border border-[#5C61F6]/20 rounded-xl p-6 text-center">
              <h3 className="text-[18px] font-bold text-white mb-2">
                Want an AI Policy & Prompt Library?
              </h3>
              <p className="text-[14px] text-[#8B95A5] mb-4 max-w-lg mx-auto">
                Get a draft AI usage policy customized to your organization, plus 10-20 ready-to-use
                prompts matched to your specific workflows.
              </p>
              <Link
                href={`/api/assessment/checkout?assessmentId=${assessment.id}&addOn=policy-prompts`}
                className="inline-block bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[14px] px-6 py-2.5 rounded-lg transition-colors"
              >
                Add AI Policy & Prompts — $100
              </Link>
            </div>
          )}
        </>
      )}

      {/* Footer actions */}
      <div className="mt-10 flex justify-between text-[13px]">
        <Link href="/assessment/dashboard" className="text-[#5A6478] hover:text-white transition-colors">
          Go to Dashboard
        </Link>
        <Link href="/assessment/start" className="text-[#5C61F6] hover:underline">
          Start New Assessment
        </Link>
      </div>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-[18px] font-bold text-white mb-4 flex items-center gap-3">
        <span className="w-8 h-px bg-[#5C61F6]" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function OpportunityBadge({ level }: { level: string }) {
  const colors = {
    high: "bg-green-500/10 text-green-400 border-green-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${colors[level as keyof typeof colors] || colors.low}`}>
      {level}
    </span>
  );
}
