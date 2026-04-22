"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Assessment, AssessmentReport } from "@/lib/assessment/types";
import { INDUSTRY_LABELS, COMPANY_SIZE_LABELS, AI_MATURITY_LABELS } from "@/lib/assessment/types";

// Sections that start expanded by default
const DEFAULT_EXPANDED = new Set(["summary", "readiness"]);

export default function ReportPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const isShared = params.get("shared") === "true";

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(DEFAULT_EXPANDED));
  const [copied, setCopied] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(TOC_SECTIONS.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

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
      const buffer = generatePdf(assessment.intake, assessment.report, true);
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

  const handleDownloadText = useCallback(() => {
    if (!assessment?.report || !assessment?.intake) return;
    const { generateTextExport } = require("@/lib/assessment/text-export");
    const text = generateTextExport(assessment.intake, assessment.report);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AI-Action-Plan-${assessment.intake.organizationName.replace(/[^a-zA-Z0-9]/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [assessment]);

  const handleFeedbackSubmit = async () => {
    if (!id || feedbackRating === null) return;
    setFeedbackSubmitting(true);

    try {
      await fetch("/api/assessment/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: id,
          rating: feedbackRating,
          comment: feedbackText.trim() || undefined,
        }),
      });
      setFeedbackSubmitted(true);
    } catch {
      // Silently handle — feedback is best-effort
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/assessment/report?id=${id}&shared=true`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-100 rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-gray-50 rounded w-96 mx-auto" />
        </div>
        <p className="mt-8 text-md text-gray-400">Building your plan...</p>
      </div>
    );
  }

  if (error === "Verification required") {
    const returnUrl = `/assessment/report?id=${id}`;
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 text-center">
        <h1 className="text-heading font-bold text-gray-900 mb-4">
          Sign in to view your report
        </h1>
        <p className="text-md text-gray-500 mb-6">
          Verify your email to access this AI action plan.
        </p>
        <Link
          href={`/assessment/dashboard?returnTo=${encodeURIComponent(returnUrl)}`}
          className="inline-block bg-accent hover:bg-[#4F52D4] text-white text-md font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (error || !assessment?.report) {
    return (
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 text-center">
        <h1 className="text-heading font-bold text-gray-900 mb-4">
          {error || "Report not found"}
        </h1>
        <Link href="/assessment/start" className="text-accent hover:underline">
          Start a new plan
        </Link>
      </div>
    );
  }

  const report = assessment.report;

  const TOC_SECTIONS = [
    { id: "summary", label: "Executive Summary" },
    { id: "readiness", label: "AI Readiness Assessment" },
    { id: "tasks", label: "Task-by-Task Analysis" },
    { id: "tools", label: "Recommended Tools & Services" },
    { id: "roadmap", label: "Implementation Roadmap" },
    { id: "risks", label: "Risks, Pitfalls & Change Management" },
    { id: "roi", label: "ROI Projections" },
    { id: "capabilities", label: "Skills That Grow With AI" },
    { id: "inputs", label: "Your Inputs" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
      {/* Cover header */}
      <header className="border-b border-gray-200 pb-8 mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
          AI Action Plan
        </p>
        <h1 className="text-4xl sm:text-title-sm font-bold text-gray-900 leading-tight">
          {assessment.intake.organizationName}
        </h1>
        <p className="text-md text-gray-400 mt-2">
          Prepared {new Date(assessment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {" "}&middot; jobsdata.ai
        </p>

        {/* Evidence connection */}
        <p className="text-sm text-gray-400 mt-1.5">
          Analysis informed by{" "}
          <Link href="/" className="text-accent hover:underline">
            478 verified research sources
          </Link>
          {" "}tracked on jobsdata.ai
        </p>

        <div className="flex flex-wrap gap-3 mt-5">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex items-center gap-2 bg-accent hover:bg-[#4F52D4] text-white text-base font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {downloadingPdf ? "Generating..." : "Download PDF"}
          </button>
          <button
            onClick={handleDownloadText}
            className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 text-base font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Export Text
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 text-base font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
            </svg>
            {copied ? "Link copied!" : "Share Report"}
          </button>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Contents</h2>
          <div className="flex gap-3">
            <button onClick={expandAll} className="text-xs text-gray-400 hover:text-accent transition-colors">
              Expand all
            </button>
            <button onClick={collapseAll} className="text-xs text-gray-400 hover:text-accent transition-colors">
              Collapse all
            </button>
          </div>
        </div>
        <ol className="space-y-1.5">
          {TOC_SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={() => setExpandedSections((prev) => { const next = new Set(prev); next.add(s.id); return next; })} className="text-base text-gray-600 hover:text-accent transition-colors flex gap-2">
                <span className="text-gray-300 w-4 text-right">{i + 1}.</span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1. Executive Summary */}
      <Section num={1} id="summary" title="Executive Summary" expanded={expandedSections.has("summary")} onToggle={() => toggleSection("summary")}>
        <div className="text-md text-gray-600 leading-[1.7] whitespace-pre-line" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>
          {report.executiveSummary}
        </div>
        {/* Industry context */}
        {report.organizationProfile.industryContext && (
          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-2">Industry Context</h4>
            <p className="text-base text-blue-800 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{report.organizationProfile.industryContext}</p>
          </div>
        )}
      </Section>

      {/* 2. AI Readiness */}
      <Section num={2} id="readiness" title="AI Readiness Assessment" expanded={expandedSections.has("readiness")} onToggle={() => toggleSection("readiness")}>
        {report.organizationProfile.aiReadinessScore > 0 && (
          <div className="mb-6">
            <div className="flex items-end gap-4 mb-3">
              <div className="text-[64px] font-black text-accent leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>
                {report.organizationProfile.aiReadinessScore}
              </div>
              <div className="pb-2">
                <div className="text-xl font-semibold text-gray-900">out of 10</div>
                <div className="text-base text-gray-400">{report.organizationProfile.summary}</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-accent h-3 rounded-full transition-all duration-500"
                style={{ width: `${report.organizationProfile.aiReadinessScore * 10}%` }}
              />
            </div>
          </div>
        )}
        {report.organizationProfile.aiReadinessRationale && (
          <p className="text-md text-[var(--foreground)]/70 leading-relaxed mt-3" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {report.organizationProfile.aiReadinessRationale}
          </p>
        )}
        {report.organizationProfile.aiReadinessNextSteps && report.organizationProfile.aiReadinessNextSteps.length > 0 && (
          <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-2">To improve your score</h4>
            <ul className="space-y-1">
              {report.organizationProfile.aiReadinessNextSteps.map((step, i) => (
                <li key={i} className="text-base text-indigo-800 flex gap-2">
                  <span className="text-indigo-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {report.organizationProfile.keyStrengths.length > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-green-600 mb-2">Strengths</h4>
              <ul className="space-y-1.5">
                {report.organizationProfile.keyStrengths.map((s, i) => (
                  <li key={i} className="text-base text-green-800 flex gap-2">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.organizationProfile.keyGaps.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-2">Opportunities</h4>
              <ul className="space-y-1.5">
                {report.organizationProfile.keyGaps.map((g, i) => (
                  <li key={i} className="text-base text-amber-800 flex gap-2">
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
        <Section num={3} id="tasks" title="Task-by-Task Analysis" expanded={expandedSections.has("tasks")} onToggle={() => toggleSection("tasks")}>
          <p className="text-base text-gray-400 mb-4">
            {report.taskAnalysis.length} tasks analyzed. Sorted by AI opportunity level.
          </p>
          <div className="space-y-4">
            {report.taskAnalysis.map((task, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Task header */}
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-300">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h4 className="text-md font-semibold text-gray-900">{task.taskName}</h4>
                      <p className="text-xs text-gray-400">{task.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.estimatedTimeSaved && (
                      <span className="text-xs text-gray-400 hidden sm:inline">{task.estimatedTimeSaved}</span>
                    )}
                    <OpportunityBadge level={task.aiOpportunity} />
                  </div>
                </div>
                {/* Task body */}
                <div className="px-4 py-3 space-y-3">
                  {task.currentProcess && (
                    <div>
                      <Label>How you do it today</Label>
                      <p className="text-base text-gray-500" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{task.currentProcess}</p>
                    </div>
                  )}
                  <div>
                    <Label>How AI can help</Label>
                    <p className="text-base text-gray-700 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{task.aiApproach}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
                    <span>Impact: <b className="text-gray-600">{task.expectedImpact}</b></span>
                    <span>Complexity: <b className="text-gray-600">{task.complexity}</b></span>
                    {task.deploymentModel && (
                      <span>Model: <DeploymentModelBadge model={task.deploymentModel} /></span>
                    )}
                    {task.onetAlignment && <span>O*NET: {task.onetAlignment}</span>}
                  </div>
                  {task.deploymentModelRationale && (
                    <p className="text-sm text-gray-400 italic" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{task.deploymentModelRationale}</p>
                  )}
                  {/* Example tools */}
                  {task.exampleTools && task.exampleTools.length > 0 && (
                    <div className="pt-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Tools</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {task.exampleTools.map((t, j) => (
                          <span key={j} className="inline-flex items-center gap-1.5 text-sm bg-gray-50 border border-gray-200 text-gray-700 rounded-md px-2.5 py-1">
                            {t.url ? (
                              <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-accent font-medium hover:underline">{t.name} &rarr;</a>
                            ) : <span className="font-medium">{t.name}</span>}
                            {t.free && <span className="text-green-600 text-2xs font-bold bg-green-50 border border-green-200 rounded px-1 py-px">FREE</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Getting started */}
                  {task.gettingStarted && (
                    <div className="bg-accent/[0.04] border border-accent/10 rounded px-3 py-2">
                      <p className="text-sm text-accent font-medium">Quick start: <span className="font-normal text-gray-600">{task.gettingStarted}</span></p>
                    </div>
                  )}
                  {/* Starter prompt */}
                  {task.starterPrompt && (
                    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Try it now — paste this into any AI chatbot</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(task.starterPrompt!);
                          }}
                          className="text-xs text-accent hover:underline font-medium"
                        >
                          Copy prompt
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 font-mono leading-relaxed whitespace-pre-wrap">{task.starterPrompt}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Full report sections */}
          {/* 4. Recommended Tools & Services */}
          {report.toolRecommendations.length > 0 && (
            <Section num={4} id="tools" title="Recommended Tools & Services" expanded={expandedSections.has("tools")} onToggle={() => toggleSection("tools")}>
              <p className="text-base text-gray-400 mb-4">
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
                            <h4 className="text-lg font-semibold text-gray-900">{tool.toolName}</h4>
                            <p className="text-xs text-gray-400">{tool.category}</p>
                          </>
                        ) : (
                          <h4 className="text-lg font-semibold text-gray-900">{tool.category}</h4>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {tool.estimatedMonthlyCost && (
                          <span className="text-sm text-gray-500">{tool.estimatedMonthlyCost}</span>
                        )}
                        <PriorityBadge tier={tool.priorityTier} />
                      </div>
                    </div>
                    {/* Tool body */}
                    <div className="px-4 py-3 space-y-3">
                      <p className="text-base text-gray-700" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{tool.purpose}</p>
                      <div className="bg-green-50 border border-green-100 rounded px-3 py-2">
                        <p className="text-sm text-green-700"><b>Expected value:</b> {tool.expectedValue}</p>
                      </div>
                      {/* Specific products */}
                      {tool.specificProducts && tool.specificProducts.length > 0 && (
                        <div>
                          <Label>Tools to try</Label>
                          <div className="grid gap-2 mt-1">
                            {tool.specificProducts.map((p, j) => (
                              <div key={j} className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    {p.url ? (
                                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-accent hover:underline">
                                        {p.name} &rarr;
                                      </a>
                                    ) : (
                                      <span className="text-base font-semibold text-gray-900">{p.name}</span>
                                    )}
                                    {p.free && (
                                      <span className="text-green-600 font-bold text-2xs bg-green-50 border border-green-200 rounded px-1.5 py-0.5">FREE TIER</span>
                                    )}
                                  </div>
                                </div>
                                {p.pricing && (
                                  <p className="text-sm text-gray-500">{p.pricing}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Real world example */}
                      {tool.realWorldExample && (
                        <div className="bg-blue-50 border border-blue-100 rounded px-3 py-2">
                          <p className="text-sm text-blue-700" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}><b>Real-world example:</b> {tool.realWorldExample}</p>
                        </div>
                      )}
                      {/* Getting started steps */}
                      {tool.gettingStarted && tool.gettingStarted.length > 0 && (
                        <div>
                          <Label>How to get started</Label>
                          <ol className="space-y-1 mt-1">
                            {tool.gettingStarted.map((step, j) => (
                              <li key={j} className="text-sm text-gray-600 flex gap-2">
                                <span className="text-accent font-bold flex-shrink-0">{j + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {/* Success KPIs */}
                      {tool.successKpis && tool.successKpis.length > 0 && (
                        <div>
                          <Label>How to measure success</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {tool.successKpis.map((kpi, j) => (
                              <span key={j} className="inline-flex items-center gap-1 text-sm bg-purple-50 text-purple-700 border border-purple-100 rounded px-2 py-0.5">
                                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                {kpi}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* What it replaces + learning time + first task */}
                      {(tool.whatItReplaces || tool.learningTime || tool.firstTask) && (
                        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 space-y-1.5">
                          {tool.whatItReplaces && (
                            <p className="text-sm text-gray-600"><span className="font-semibold text-gray-700">Replaces:</span> {tool.whatItReplaces}</p>
                          )}
                          {tool.learningTime && (
                            <p className="text-sm text-gray-600"><span className="font-semibold text-gray-700">Time to learn:</span> {tool.learningTime}</p>
                          )}
                          {tool.firstTask && (
                            <p className="text-sm text-gray-600"><span className="font-semibold text-gray-700">Try first:</span> {tool.firstTask}</p>
                          )}
                        </div>
                      )}
                      {/* Meta row */}
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400 pt-1 border-t border-gray-100">
                        <span>Effort: <b className="text-gray-600">{tool.implementationEffort}</b></span>
                        {tool.recommendationTier && (
                          <span>Tier: <b className="text-gray-600">{
                            tool.recommendationTier === "start-here" ? "Start here" :
                            tool.recommendationTier === "add-next" ? "Add next" :
                            "Consider later"
                          }</b></span>
                        )}
                        {tool.upgradeSignal && (
                          <span>Upgrade when: <b className="text-gray-600">{tool.upgradeSignal}</b></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* 5. Implementation Roadmap */}
          <Section num={5} id="roadmap" title="Implementation Roadmap" expanded={expandedSections.has("roadmap")} onToggle={() => toggleSection("roadmap")}>
            <div className="space-y-8">
              {(["immediate", "mediumTerm", "longTerm"] as const).map((phase) => {
                const data = report.implementationRoadmap[phase];
                const config = {
                  immediate: { label: "Phase 1: Quick Wins", time: "0-3 months", color: "border-green-400", bg: "bg-green-50", text: "text-green-700" },
                  mediumTerm: { label: "Phase 2: Build Momentum", time: "3-6 months", color: "border-blue-400", bg: "bg-blue-50", text: "text-blue-700" },
                  longTerm: { label: "Phase 3: Level Up", time: "6-12+ months", color: "border-purple-400", bg: "bg-purple-50", text: "text-purple-700" },
                }[phase];

                return (
                  <div key={phase} className={`border-l-4 ${config.color} pl-5`}>
                    <div className="flex items-baseline gap-3 mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{config.label}</h4>
                      <span className="text-sm text-gray-400">{config.time}</span>
                    </div>
                    {/* Objectives */}
                    {data.objectives.length > 0 && (
                      <div className={`${config.bg} rounded-lg px-4 py-3 mb-3`}>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Objectives</p>
                        <ul className="space-y-1">
                          {data.objectives.map((obj, i) => (
                            <li key={i} className={`text-base ${config.text}`}>&bull; {obj}</li>
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
                              <span className="text-base font-semibold text-gray-900">{action.title}</span>
                              <span className="text-2xs uppercase font-bold text-gray-300 ml-auto">{action.priority}</span>
                            </div>
                            <p className="text-sm text-gray-500 ml-4 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{action.description}</p>
                            {action.howTo && (
                              <p className="text-sm text-accent ml-4 mt-1">{action.howTo}</p>
                            )}
                            {action.resource && (
                              <a href={action.resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline ml-4 mt-1">
                                {action.resource.label} &rarr;
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Expected outcomes */}
                    {data.expectedOutcomes && data.expectedOutcomes.length > 0 && (
                      <div className="mt-3 text-sm text-gray-400">
                        <span className="font-semibold">Expected outcomes:</span>{" "}
                        {data.expectedOutcomes.join(". ")}
                      </div>
                    )}
                    {data.estimatedInvestment && (
                      <p className="text-sm text-gray-400 mt-1">
                        <span className="font-semibold">Est. investment:</span> {data.estimatedInvestment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* 6. Risk Assessment */}
          <Section num={6} id="risks" title="Risks, Pitfalls & Change Management" expanded={expandedSections.has("risks")} onToggle={() => toggleSection("risks")}>
            <div className="space-y-4">
              {/* Risk context + overall level */}
              <div className="mb-2">
                {report.riskAssessment.riskContextNote && (
                  <p className="text-base text-gray-500 mb-2 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>
                    {report.riskAssessment.riskContextNote}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-base text-gray-500">Overall Risk Level:</span>
                  <span className={`text-base font-bold uppercase px-3 py-1 rounded-full ${
                    report.riskAssessment.overallRiskLevel === "low" ? "bg-green-50 text-green-700 border border-green-200" :
                    report.riskAssessment.overallRiskLevel === "moderate" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {report.riskAssessment.overallRiskLevel}
                  </span>
                </div>
                {report.riskAssessment.overallRiskLevel !== "low" && report.humanCapabilities && report.humanCapabilities.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    See <a href="#capabilities" onClick={() => setExpandedSections((prev) => { const next = new Set(prev); next.add("capabilities"); return next; })} className="text-accent hover:underline">Skills That Grow With AI</a> below for detailed guidance on developing capabilities that make your role more resilient.
                  </p>
                )}
              </div>

              {report.riskAssessment.displacementRisk && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <Label>Role Evolution</Label>
                  <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{report.riskAssessment.displacementRisk}</p>
                </div>
              )}

              {report.riskAssessment.skillGaps.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <Label>Skills to Build</Label>
                  <ul className="space-y-1.5 mt-1">
                    {report.riskAssessment.skillGaps.map((gap, i) => (
                      <li key={i} className="text-base text-gray-600 flex gap-2">
                        <span className="text-accent flex-shrink-0">{i + 1}.</span> {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.riskAssessment.dataPrivacyConsiderations && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <Label>Data Privacy Considerations</Label>
                  <p className="text-base text-amber-800 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{report.riskAssessment.dataPrivacyConsiderations}</p>
                </div>
              )}

              {/* "Making the Transition Smooth" block removed: duplicated the
                  Implementation Roadmap. Change-management guidance now lives
                  inside roadmap actions. Preserves changeManagementNotes on
                  the schema for backward compat with old stored reports. */}

              {/* Common Pitfalls */}
              {report.riskAssessment.commonPitfalls && report.riskAssessment.commonPitfalls.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <Label>Common Pitfalls to Avoid</Label>
                  <p className="text-xs text-gray-400 mb-2">Based on research into why AI projects fail (Stanford Digital Economy Lab, 2026)</p>
                  <ul className="space-y-2">
                    {report.riskAssessment.commonPitfalls.map((pitfall, i) => (
                      <li key={i} className="text-base text-red-800 flex gap-2">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">!</span>
                        {pitfall}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resistance Sources */}
              {report.riskAssessment.resistanceSources && report.riskAssessment.resistanceSources.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <Label>Where to Expect Pushback</Label>
                  <ul className="space-y-1.5">
                    {report.riskAssessment.resistanceSources.map((source, i) => (
                      <li key={i} className="text-base text-gray-600 flex gap-2">
                        <span className="text-amber-400 mt-0.5 flex-shrink-0">&rarr;</span>
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Data Readiness */}
              {report.riskAssessment.dataReadinessNote && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <Label>Your Data Readiness</Label>
                  <p className="text-base text-blue-800 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{report.riskAssessment.dataReadinessNote}</p>
                </div>
              )}
            </div>
          </Section>

          {/* 7. ROI Projections */}
          {report.roiProjections.length > 0 && (
            <Section num={7} id="roi" title="ROI Projections" expanded={expandedSections.has("roi")} onToggle={() => toggleSection("roi")}>
              <div className="space-y-4">
                {report.roiProjections.map((roi, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="text-md font-semibold text-gray-900">{roi.area}</h4>
                    </div>
                    <div className="p-4">
                      {/* Key metrics — hero numbers */}
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-400 mb-1">Current Cost</div>
                          <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Mono', monospace" }}>{roi.currentCost}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400 mb-1">Projected Savings</div>
                          <div className="text-2xl font-bold text-green-700" style={{ fontFamily: "'DM Mono', monospace" }}>{roi.projectedSavings}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400 mb-1">Time to Value</div>
                          <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Mono', monospace" }}>{roi.timeToValue}</div>
                        </div>
                      </div>
                      {/* Confidence */}
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="text-gray-400">Confidence:</span>
                        <span className={`font-semibold ${
                          roi.confidence === "high" ? "text-green-600" :
                          roi.confidence === "moderate" ? "text-amber-500" : "text-gray-400"
                        }`}>{roi.confidence}</span>
                      </div>
                      {/* Basis */}
                      {roi.basis && (
                        <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{roi.basis}</p>
                      )}
                      {/* Calculation detail */}
                      {roi.calculationDetail && (
                        <div className="mt-2 bg-gray-50 border border-gray-100 rounded px-3 py-2">
                          <p className="text-xs font-mono text-gray-500">{roi.calculationDetail}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* 8. Human Capabilities */}
          {report.humanCapabilities && report.humanCapabilities.length > 0 && (
            <Section num={8} id="capabilities" title="Skills That Grow With AI" expanded={expandedSections.has("capabilities")} onToggle={() => toggleSection("capabilities")}>
              <p className="text-sm text-gray-400 mb-4">
                As AI handles more routine work, these capabilities become <em>more</em> valuable — not less.
                Drawn from our framework of 62 human capabilities scored for AI-era appreciation.
              </p>
              <div className="space-y-3">
                {report.humanCapabilities.map((cap, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-md font-semibold text-gray-900">{cap.name}</h4>
                      <span className="flex-shrink-0 text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        {cap.appreciationScore}/10
                      </span>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed mb-2" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>
                      {cap.whyItMatters}
                    </p>
                    <div className="bg-gray-50 rounded-md px-3 py-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">How to develop</span>
                      <p className="text-base text-gray-700 mt-0.5">{cap.howToDevelop}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* "Next Steps" (section #9) removed: it duplicated the Implementation
              Roadmap's immediate phase. The roadmap's action list now carries
              that content. See fix/simplify-steps commit for rationale. */}

          {/* 9. Your Inputs */}
          <Section num={9} id="inputs" title="Your Inputs" expanded={expandedSections.has("inputs")} onToggle={() => toggleSection("inputs")}>
            <p className="text-sm text-gray-400 mb-4">What you told us — for reference. The more detail you provide, the more tailored your report.</p>
            <div className="space-y-2">
              {[
                ["Organization", assessment.intake.organizationName],
                ["Industry", INDUSTRY_LABELS[assessment.intake.industry] || assessment.intake.industry],
                ["Size", COMPANY_SIZE_LABELS[assessment.intake.companySize] || assessment.intake.companySize],
                ["Scope", assessment.intake.assessmentScope.replace(/-/g, " ")],
                ...(assessment.intake.departmentName ? [["Department", assessment.intake.departmentName]] : []),
                ...(assessment.intake.jobTitle ? [["Your Role", assessment.intake.jobTitle]] : []),
                ["AI Experience", AI_MATURITY_LABELS[assessment.intake.currentAiUsage] || assessment.intake.currentAiUsage],
                ...(assessment.intake.primaryFunctions.length > 0 ? [["Key Functions", assessment.intake.primaryFunctions.join(", ")]] : []),
                ...(assessment.intake.keyRoles.length > 0 ? [["Key Roles", assessment.intake.keyRoles.join(", ")]] : []),
                ...(assessment.intake.currentTools.length > 0 ? [["Current Tools", assessment.intake.currentTools.join(", ")]] : []),
                ...(assessment.intake.biggestChallenges.length > 0 ? [["Challenges", assessment.intake.biggestChallenges.join("; ")]] : []),
                ...(assessment.intake.goals.length > 0 ? [["Goals", assessment.intake.goals.join("; ")]] : []),
              ].map(([label, value], i) => (
                <div key={i} className="flex gap-3 text-base">
                  <span className="font-semibold text-gray-500 w-28 flex-shrink-0 text-right">{label}</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
              {/* Open responses */}
              {assessment.intake.teamDescription && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">Day-to-day description</p>
                  <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{assessment.intake.teamDescription}</p>
                </div>
              )}
              {assessment.intake.specificProblem && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">Specific problem to solve</p>
                  <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{assessment.intake.specificProblem}</p>
                </div>
              )}
              {assessment.intake.additionalContext && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">Additional context</p>
                  <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif" }}>{assessment.intake.additionalContext}</p>
                </div>
              )}
            </div>
          </Section>

      {/* Feedback — hide on shared view */}
      {!isShared && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How was your plan?</h2>
          <p className="text-base text-gray-400 mb-5">Your feedback helps us improve these reports.</p>

          {feedbackSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-md text-green-700">
              Thank you for your feedback.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Star rating — accent colored */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className="w-10 h-10 rounded-lg border-2 transition-all duration-150"
                    style={{
                      borderColor: feedbackRating !== null && star <= feedbackRating ? "#5C61F6" : undefined,
                      backgroundColor: feedbackRating !== null && star <= feedbackRating ? "rgba(92, 97, 246, 0.1)" : undefined,
                      color: feedbackRating !== null && star <= feedbackRating ? "#5C61F6" : undefined,
                    }}
                  >
                    <svg
                      className="w-5 h-5 mx-auto"
                      fill={feedbackRating !== null && star <= feedbackRating ? "#5C61F6" : "none"}
                      viewBox="0 0 24 24"
                      stroke={feedbackRating !== null && star <= feedbackRating ? "#5C61F6" : "#D1D5DB"}
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                ))}
                <span className="text-sm text-gray-400 self-center ml-2">
                  {feedbackRating === 1 && "Not helpful"}
                  {feedbackRating === 2 && "Needs work"}
                  {feedbackRating === 3 && "Decent"}
                  {feedbackRating === 4 && "Helpful"}
                  {feedbackRating === 5 && "Very helpful"}
                </span>
              </div>

              {/* Text feedback */}
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What could be better? What was most useful?"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-700 placeholder-gray-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-[#5C61F6]/20 resize-none"
              />

              <button
                onClick={handleFeedbackSubmit}
                disabled={feedbackRating === null || feedbackSubmitting}
                className="bg-gray-900 hover:bg-gray-800 text-white text-base font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {feedbackSubmitting ? "Sending..." : "Submit Feedback"}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Disclaimer */}
      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
        <p className="text-xs leading-[1.7] text-gray-400">
          <span className="font-semibold text-gray-500">Disclaimer:</span> This report is generated using AI and is intended for informational purposes only. It does not constitute professional, legal, financial, or technical advice. The tools, strategies, and recommendations described here are suggestions based on the information you provided and publicly available research. Before implementing any changes to your workflows, adopting new tools, or making organizational decisions based on this report, we strongly encourage you to consult with your internal leadership, IT, legal, compliance, and procurement teams to ensure alignment with your organization&apos;s policies, security requirements, and regulatory obligations. You assume full responsibility for evaluating and acting on any information contained in this report. jobsdata.ai and its affiliates disclaim all liability for any outcomes resulting from the use of this material.
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-6 pt-6 border-t border-gray-200 flex justify-between text-base">
        <Link href="/assessment/dashboard" className="text-gray-400 hover:text-gray-900 transition-colors">
          My Plans
        </Link>
        <Link href="/assessment/start" className="text-accent hover:underline">
          Start a New Plan
        </Link>
      </footer>
    </div>
  );
}

/* ---- Helper Components ---- */

function Section({ num, id, title, expanded, onToggle, children }: { num: number; id: string; title: string; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 mb-4 pb-2 border-b border-gray-100 group cursor-pointer text-left"
      >
        <span className="text-base font-mono text-accent">{num}.</span>
        <h2 className="text-2xl font-bold text-gray-900 flex-1">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        {children}
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{children}</p>;
}

function OpportunityBadge({ level }: { level: string }) {
  const colors = {
    high: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-gray-50 text-gray-500 border-gray-200",
  };

  return (
    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${colors[level as keyof typeof colors] || colors.low}`}>
      {level}
    </span>
  );
}

function PriorityBadge({ tier }: { tier: string }) {
  const colors = {
    immediate: "bg-accent/10 text-accent border-accent/20",
    "medium-term": "bg-amber-50 text-amber-600 border-amber-200",
    "long-term": "bg-gray-50 text-gray-500 border-gray-200",
  };

  return (
    <span className={`text-2xs font-bold uppercase px-2 py-0.5 rounded border whitespace-nowrap ${colors[tier as keyof typeof colors] || colors["long-term"]}`}>
      {tier}
    </span>
  );
}

function DeploymentModelBadge({ model }: { model: string }) {
  const config: Record<string, { label: string; color: string }> = {
    copilot: { label: "Copilot", color: "bg-blue-50 text-blue-700" },
    escalation: { label: "Escalation", color: "bg-green-50 text-green-700" },
    "full-automation": { label: "Full Auto", color: "bg-purple-50 text-purple-700" },
    agentic: { label: "Agentic", color: "bg-orange-50 text-orange-700" },
  };
  const c = config[model] || { label: model, color: "bg-gray-50 text-gray-600" };

  return (
    <span className={`text-2xs font-bold px-1.5 py-0.5 rounded ${c.color}`}>
      {c.label}
    </span>
  );
}
