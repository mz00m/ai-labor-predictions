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
      const { generatePdf } = await import("@/lib/assessment/pdf-generator");
      const buffer = generatePdf(assessment.intake, assessment.report, assessment.paid);
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AI-Action-Plan-${assessment.intake.organizationName.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
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
          email: assessment.userId,
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
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-100 rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-gray-50 rounded w-96 mx-auto" />
        </div>
        <p className="mt-8 text-[14px] text-gray-400">Building your plan...</p>
      </div>
    );
  }

  if (error || !assessment?.report) {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 text-center">
        <h1 className="text-[24px] font-bold text-gray-900 mb-4">
          {error || "Report not found"}
        </h1>
        <Link href="/assessment/start" className="text-[#5C61F6] hover:underline">
          Start a new plan
        </Link>
      </div>
    );
  }

  const report = assessment.report;
  const showPaywall = isPreview && !assessment.paid;

  const TOC_SECTIONS = [
    { id: "summary", label: "Executive Summary" },
    { id: "readiness", label: "AI Readiness Assessment" },
    { id: "tasks", label: "Task-by-Task Analysis" },
    ...(showPaywall ? [] : [
      { id: "tools", label: "Recommended Tools & Services" },
      { id: "roadmap", label: "Implementation Roadmap" },
      { id: "risks", label: "Risk Assessment & Considerations" },
      { id: "roi", label: "ROI Projections" },
      { id: "next", label: "Next Steps" },
    ]),
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
      {/* Payment success banner */}
      {paymentSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-[14px] text-green-700">
          Payment successful. Your full plan is ready below.
        </div>
      )}

      {/* Cover header */}
      <header className="border-b border-gray-200 pb-8 mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#5C61F6] mb-2">
          AI Action Plan
        </p>
        <h1 className="text-[28px] sm:text-[34px] font-bold text-gray-900 leading-tight">
          {assessment.intake.organizationName}
        </h1>
        <p className="text-[14px] text-gray-400 mt-2">
          Prepared {new Date(assessment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {" "}&middot; jobsdata.ai
          {showPaywall && (
            <span className="ml-2 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              PREVIEW
            </span>
          )}
        </p>
        <div className="flex gap-3 mt-5">
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
      </header>

      {/* Table of Contents */}
      <nav className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-10">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-400 mb-3">Contents</h2>
        <ol className="space-y-1.5">
          {TOC_SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-[13px] text-gray-600 hover:text-[#5C61F6] transition-colors flex gap-2">
                <span className="text-gray-300 w-4 text-right">{i + 1}.</span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1. Executive Summary */}
      <Section num={1} id="summary" title="Executive Summary">
        <div className="text-[14px] text-gray-600 leading-[1.7] whitespace-pre-line">
          {report.executiveSummary}
        </div>
        {/* Industry context */}
        {report.organizationProfile.industryContext && (
          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-blue-400 mb-2">Industry Context</h4>
            <p className="text-[13px] text-blue-800 leading-relaxed">{report.organizationProfile.industryContext}</p>
          </div>
        )}
      </Section>

      {/* 2. AI Readiness */}
      <Section num={2} id="readiness" title="AI Readiness Assessment">
        {report.organizationProfile.aiReadinessScore > 0 && (
          <div className="mb-6">
            <div className="flex items-end gap-4 mb-3">
              <div className="text-[48px] font-black text-[#5C61F6] leading-none">
                {report.organizationProfile.aiReadinessScore}
              </div>
              <div className="pb-1">
                <div className="text-[14px] font-semibold text-gray-900">out of 10</div>
                <div className="text-[12px] text-gray-400">{report.organizationProfile.summary}</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#5C61F6] h-3 rounded-full transition-all duration-500"
                style={{ width: `${report.organizationProfile.aiReadinessScore * 10}%` }}
              />
            </div>
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          {report.organizationProfile.keyStrengths.length > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-green-600 mb-2">Strengths</h4>
              <ul className="space-y-1.5">
                {report.organizationProfile.keyStrengths.map((s, i) => (
                  <li key={i} className="text-[13px] text-green-800 flex gap-2">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.organizationProfile.keyGaps.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-amber-600 mb-2">Opportunities</h4>
              <ul className="space-y-1.5">
                {report.organizationProfile.keyGaps.map((g, i) => (
                  <li key={i} className="text-[13px] text-amber-800 flex gap-2">
                    <span className="text-amber-400 mt-0.5 flex-shrink-0">&rarr;</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      {/* 3. Task-by-Task Analysis */}
      {report.taskAnalysis.length > 0 && (
        <Section num={3} id="tasks" title="Task-by-Task Analysis">
          <p className="text-[13px] text-gray-400 mb-4">
            {report.taskAnalysis.length} tasks analyzed. Sorted by AI opportunity level.
          </p>
          <div className="space-y-4">
            {report.taskAnalysis.map((task, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Task header */}
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-mono text-gray-300">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h4 className="text-[14px] font-semibold text-gray-900">{task.taskName}</h4>
                      <p className="text-[11px] text-gray-400">{task.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.estimatedTimeSaved && (
                      <span className="text-[11px] text-gray-400 hidden sm:inline">{task.estimatedTimeSaved}</span>
                    )}
                    <OpportunityBadge level={task.aiOpportunity} />
                  </div>
                </div>
                {/* Task body */}
                <div className="px-4 py-3 space-y-3">
                  {task.currentProcess && (
                    <div>
                      <Label>How you do it today</Label>
                      <p className="text-[13px] text-gray-500">{task.currentProcess}</p>
                    </div>
                  )}
                  <div>
                    <Label>How AI can help</Label>
                    <p className="text-[13px] text-gray-700 leading-relaxed">{task.aiApproach}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-gray-400">
                    <span>Impact: <b className="text-gray-600">{task.expectedImpact}</b></span>
                    <span>Complexity: <b className="text-gray-600">{task.complexity}</b></span>
                    {task.onetAlignment && <span>O*NET: {task.onetAlignment}</span>}
                  </div>
                  {/* Example tools */}
                  {task.exampleTools && task.exampleTools.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {task.exampleTools.map((t, j) => (
                        <span key={j} className="inline-flex items-center gap-1 text-[12px] bg-gray-100 text-gray-600 rounded px-2 py-0.5">
                          {t.url ? (
                            <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-[#5C61F6] hover:underline">{t.name}</a>
                          ) : t.name}
                          {t.free && <span className="text-green-600 text-[10px] font-bold">FREE</span>}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Getting started */}
                  {task.gettingStarted && (
                    <div className="bg-[#5C61F6]/[0.04] border border-[#5C61F6]/10 rounded px-3 py-2">
                      <p className="text-[12px] text-[#5C61F6] font-medium">Quick start: <span className="font-normal text-gray-600">{task.gettingStarted}</span></p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Paywall */}
      {showPaywall && (
        <div className="relative my-12">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10" />
          <div className="relative z-20 text-center py-14 bg-gray-50 border-2 border-[#5C61F6]/20 rounded-xl">
            <div className="text-[40px] font-black text-[#5C61F6] mb-2">5 more sections</div>
            <h3 className="text-[18px] font-bold text-gray-900 mb-3">
              Unlock Your Full Plan
            </h3>
            <p className="text-[14px] text-gray-500 mb-6 max-w-md mx-auto">
              Get specific tool recommendations with pricing and setup guides,
              your step-by-step action plan, ROI projections with the math shown,
              and concrete next steps.
            </p>
            <button
              onClick={handleUnlock}
              className="bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[15px] px-8 py-3 rounded-lg transition-colors"
            >
              Unlock Full Plan for $100
            </button>
          </div>
        </div>
      )}

      {/* Full report sections */}
      {!showPaywall && (
        <>
          {/* 4. Recommended Tools & Services */}
          {report.toolRecommendations.length > 0 && (
            <Section num={4} id="tools" title="Recommended Tools & Services">
              <p className="text-[13px] text-gray-400 mb-4">
                {report.toolRecommendations.length} tools evaluated for your workflow. Sorted by priority.
              </p>
              <div className="space-y-5">
                {report.toolRecommendations.map((tool, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Tool header */}
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div>
                        {tool.toolName ? (
                          <>
                            <h4 className="text-[15px] font-semibold text-gray-900">{tool.toolName}</h4>
                            <p className="text-[11px] text-gray-400">{tool.category}</p>
                          </>
                        ) : (
                          <h4 className="text-[15px] font-semibold text-gray-900">{tool.category}</h4>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {tool.estimatedMonthlyCost && (
                          <span className="text-[12px] text-gray-500">{tool.estimatedMonthlyCost}</span>
                        )}
                        <PriorityBadge tier={tool.priorityTier} />
                      </div>
                    </div>
                    {/* Tool body */}
                    <div className="px-4 py-3 space-y-3">
                      <p className="text-[13px] text-gray-700">{tool.purpose}</p>
                      <div className="bg-green-50 border border-green-100 rounded px-3 py-2">
                        <p className="text-[12px] text-green-700"><b>Expected value:</b> {tool.expectedValue}</p>
                      </div>
                      {/* Specific products */}
                      {tool.specificProducts && tool.specificProducts.length > 0 && (
                        <div>
                          <Label>Products to consider</Label>
                          <div className="space-y-2 mt-1">
                            {tool.specificProducts.map((p, j) => (
                              <div key={j} className="flex items-start justify-between bg-gray-50 rounded px-3 py-2">
                                <div>
                                  {p.url ? (
                                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-[#5C61F6] hover:underline">
                                      {p.name} &rarr;
                                    </a>
                                  ) : (
                                    <span className="text-[13px] font-medium text-gray-900">{p.name}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[12px]">
                                  {p.pricing && <span className="text-gray-400">{p.pricing}</span>}
                                  {p.free && <span className="text-green-600 font-bold text-[10px] bg-green-50 border border-green-200 rounded px-1.5 py-0.5">FREE TIER</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Real world example */}
                      {tool.realWorldExample && (
                        <div className="bg-blue-50 border border-blue-100 rounded px-3 py-2">
                          <p className="text-[12px] text-blue-700"><b>Real-world example:</b> {tool.realWorldExample}</p>
                        </div>
                      )}
                      {/* Getting started steps */}
                      {tool.gettingStarted && tool.gettingStarted.length > 0 && (
                        <div>
                          <Label>How to get started</Label>
                          <ol className="space-y-1 mt-1">
                            {tool.gettingStarted.map((step, j) => (
                              <li key={j} className="text-[12px] text-gray-600 flex gap-2">
                                <span className="text-[#5C61F6] font-bold flex-shrink-0">{j + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {/* Meta row */}
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-gray-400 pt-1 border-t border-gray-100">
                        <span>Effort: <b className="text-gray-600">{tool.implementationEffort}</b></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* 5. Implementation Roadmap */}
          <Section num={5} id="roadmap" title="Implementation Roadmap">
            <div className="space-y-8">
              {(["immediate", "mediumTerm", "longTerm"] as const).map((phase, phaseIdx) => {
                const data = report.implementationRoadmap[phase];
                const config = {
                  immediate: { label: "Phase 1: Quick Wins", time: "0-3 months", color: "border-green-400", bg: "bg-green-50", text: "text-green-700" },
                  mediumTerm: { label: "Phase 2: Build Momentum", time: "3-6 months", color: "border-blue-400", bg: "bg-blue-50", text: "text-blue-700" },
                  longTerm: { label: "Phase 3: Level Up", time: "6-12+ months", color: "border-purple-400", bg: "bg-purple-50", text: "text-purple-700" },
                }[phase];

                return (
                  <div key={phase} className={`border-l-4 ${config.color} pl-5`}>
                    <div className="flex items-baseline gap-3 mb-3">
                      <h4 className="text-[15px] font-bold text-gray-900">{config.label}</h4>
                      <span className="text-[12px] text-gray-400">{config.time}</span>
                    </div>
                    {/* Objectives */}
                    {data.objectives.length > 0 && (
                      <div className={`${config.bg} rounded-lg px-4 py-3 mb-3`}>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Objectives</p>
                        <ul className="space-y-1">
                          {data.objectives.map((obj, i) => (
                            <li key={i} className={`text-[13px] ${config.text}`}>&bull; {obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Actions */}
                    {data.actions.length > 0 && (
                      <div className="space-y-2">
                        {data.actions.map((action, i) => (
                          <div key={i} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                action.priority === "critical" ? "bg-red-400" :
                                action.priority === "high" ? "bg-amber-400" :
                                action.priority === "medium" ? "bg-blue-400" : "bg-gray-300"
                              }`} />
                              <span className="text-[13px] font-semibold text-gray-900">{action.title}</span>
                              <span className="text-[10px] uppercase font-bold text-gray-300 ml-auto">{action.priority}</span>
                            </div>
                            <p className="text-[12px] text-gray-500 ml-4 leading-relaxed">{action.description}</p>
                            {action.howTo && (
                              <p className="text-[12px] text-[#5C61F6] ml-4 mt-1">{action.howTo}</p>
                            )}
                            {action.resource && (
                              <a href={action.resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-[#5C61F6] hover:underline ml-4 mt-1">
                                {action.resource.label} &rarr;
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Expected outcomes */}
                    {data.expectedOutcomes && data.expectedOutcomes.length > 0 && (
                      <div className="mt-3 text-[12px] text-gray-400">
                        <span className="font-semibold">Expected outcomes:</span>{" "}
                        {data.expectedOutcomes.join(". ")}
                      </div>
                    )}
                    {data.estimatedInvestment && (
                      <p className="text-[12px] text-gray-400 mt-1">
                        <span className="font-semibold">Est. investment:</span> {data.estimatedInvestment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* 6. Risk Assessment */}
          <Section num={6} id="risks" title="Risk Assessment & Considerations">
            <div className="space-y-4">
              {/* Overall risk level */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[13px] text-gray-500">Overall Risk Level:</span>
                <span className={`text-[13px] font-bold uppercase px-3 py-1 rounded-full ${
                  report.riskAssessment.overallRiskLevel === "low" ? "bg-green-50 text-green-700 border border-green-200" :
                  report.riskAssessment.overallRiskLevel === "moderate" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {report.riskAssessment.overallRiskLevel}
                </span>
              </div>

              {report.riskAssessment.displacementRisk && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <Label>Role Evolution</Label>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{report.riskAssessment.displacementRisk}</p>
                </div>
              )}

              {report.riskAssessment.skillGaps.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <Label>Skills to Build</Label>
                  <ul className="space-y-1.5 mt-1">
                    {report.riskAssessment.skillGaps.map((gap, i) => (
                      <li key={i} className="text-[13px] text-gray-600 flex gap-2">
                        <span className="text-[#5C61F6] flex-shrink-0">{i + 1}.</span> {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.riskAssessment.dataPrivacyConsiderations && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <Label>Data Privacy Considerations</Label>
                  <p className="text-[13px] text-amber-800 leading-relaxed">{report.riskAssessment.dataPrivacyConsiderations}</p>
                </div>
              )}

              {report.riskAssessment.changeManagementNotes && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <Label>Making the Transition Smooth</Label>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{report.riskAssessment.changeManagementNotes}</p>
                </div>
              )}
            </div>
          </Section>

          {/* 7. ROI Projections */}
          {report.roiProjections.length > 0 && (
            <Section num={7} id="roi" title="ROI Projections">
              <div className="space-y-4">
                {report.roiProjections.map((roi, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="text-[14px] font-semibold text-gray-900">{roi.area}</h4>
                    </div>
                    <div className="p-4">
                      {/* Key metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-[11px] text-gray-400 mb-1">Current Cost</div>
                          <div className="text-[13px] font-semibold text-gray-900">{roi.currentCost}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] text-gray-400 mb-1">Projected Savings</div>
                          <div className="text-[13px] font-semibold text-green-700">{roi.projectedSavings}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] text-gray-400 mb-1">Time to Value</div>
                          <div className="text-[13px] font-semibold text-gray-900">{roi.timeToValue}</div>
                        </div>
                      </div>
                      {/* Confidence */}
                      <div className="flex items-center gap-2 text-[12px] mb-2">
                        <span className="text-gray-400">Confidence:</span>
                        <span className={`font-semibold ${
                          roi.confidence === "high" ? "text-green-600" :
                          roi.confidence === "moderate" ? "text-amber-500" : "text-gray-400"
                        }`}>{roi.confidence}</span>
                      </div>
                      {/* Basis */}
                      {roi.basis && (
                        <p className="text-[12px] text-gray-500 leading-relaxed">{roi.basis}</p>
                      )}
                      {/* Calculation detail */}
                      {roi.calculationDetail && (
                        <div className="mt-2 bg-gray-50 border border-gray-100 rounded px-3 py-2">
                          <p className="text-[11px] font-mono text-gray-500">{roi.calculationDetail}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* 8. Next Steps */}
          {report.furtherEvaluation.length > 0 && (
            <Section num={8} id="next" title="Next Steps">
              <div className="space-y-2">
                {report.furtherEvaluation.map((item, i) => (
                  <div key={i} className="flex gap-3 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                    <span className="text-[14px] font-bold text-[#5C61F6] flex-shrink-0 w-6 text-right">{i + 1}.</span>
                    <p className="text-[13px] text-gray-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Add-on upsell */}
          {!assessment.addOns.policyAndPrompts && (
            <div className="mt-10 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <h3 className="text-[18px] font-bold text-gray-900 mb-2">
                Want ready-to-use prompts and guidelines?
              </h3>
              <p className="text-[14px] text-gray-500 mb-5 max-w-lg mx-auto">
                Get AI usage guidelines tailored to your work, plus 10-20 copy-paste prompts
                built around your actual tasks and workflows.
              </p>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/assessment/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        assessmentId: assessment.id,
                        email: assessment.userId,
                        addOn: "policy-prompts",
                      }),
                    });
                    const data = await res.json();
                    if (data.checkoutUrl) window.location.href = data.checkoutUrl;
                  } catch { /* handle error */ }
                }}
                className="bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[14px] px-6 py-2.5 rounded-lg transition-colors"
              >
                Add Prompts & Guidelines for $100
              </button>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200 flex justify-between text-[13px]">
        <Link href="/assessment/dashboard" className="text-gray-400 hover:text-gray-900 transition-colors">
          My Plans
        </Link>
        <Link href="/assessment/start" className="text-[#5C61F6] hover:underline">
          Start a New Plan
        </Link>
      </footer>
    </div>
  );
}

/* ---- Helper Components ---- */

function Section({ num, id, title, children }: { num: number; id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <div className="flex items-baseline gap-3 mb-4 pb-2 border-b border-gray-100">
        <span className="text-[13px] font-mono text-[#5C61F6]">{num}.</span>
        <h2 className="text-[18px] font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">{children}</p>;
}

function OpportunityBadge({ level }: { level: string }) {
  const colors = {
    high: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-gray-50 text-gray-500 border-gray-200",
  };

  return (
    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${colors[level as keyof typeof colors] || colors.low}`}>
      {level}
    </span>
  );
}

function PriorityBadge({ tier }: { tier: string }) {
  const colors = {
    immediate: "bg-[#5C61F6]/10 text-[#5C61F6] border-[#5C61F6]/20",
    "medium-term": "bg-amber-50 text-amber-600 border-amber-200",
    "long-term": "bg-gray-50 text-gray-500 border-gray-200",
  };

  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border whitespace-nowrap ${colors[tier as keyof typeof colors] || colors["long-term"]}`}>
      {tier}
    </span>
  );
}
