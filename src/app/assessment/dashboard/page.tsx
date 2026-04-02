"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Assessment } from "@/lib/assessment/types";
import { INDUSTRY_LABELS } from "@/lib/assessment/types";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/assessment/dashboard?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setAssessments(data.assessments || []);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
      <h1 className="text-[28px] font-bold text-white mb-2">My Reports</h1>
      <p className="text-[14px] text-[#8B95A5] mb-8">
        View and manage your AI adoption assessments.
      </p>

      {/* Email lookup */}
      <form onSubmit={handleLookup} className="flex gap-3 mb-10">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the email used for your assessment"
          className="flex-1 bg-[#111827]/50 border border-white/[0.08] rounded-lg px-4 py-2.5 text-[14px] text-[#E2E8F0] placeholder:text-[#3A4250] outline-none focus:border-[#5C61F6]"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#5C61F6] hover:bg-[#4F52D4] text-white text-[13px] font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Looking up..." : "Find My Reports"}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-[13px] text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {searched && assessments.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#5A6478] text-[14px] mb-4">No assessments found for this email.</p>
          <Link
            href="/assessment/start"
            className="text-[#5C61F6] hover:underline text-[14px]"
          >
            Start your first assessment
          </Link>
        </div>
      )}

      {assessments.length > 0 && (
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="bg-[#111827]/60 border border-white/[0.06] rounded-xl p-6 hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[16px] font-semibold text-white">
                    {assessment.intake?.organizationName || "Assessment"}
                  </h3>
                  <p className="text-[13px] text-[#5A6478] mt-1">
                    {assessment.intake?.industry ? INDUSTRY_LABELS[assessment.intake.industry] : ""} |{" "}
                    {new Date(assessment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <StatusBadge status={assessment.status} paid={assessment.paid} />
              </div>

              {/* AI Readiness Score */}
              {assessment.report?.organizationProfile.aiReadinessScore && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[12px] text-[#5A6478]">AI Readiness:</span>
                  <div className="flex-1 bg-[#1a2032] rounded-full h-1.5">
                    <div
                      className="bg-[#5C61F6] h-1.5 rounded-full"
                      style={{ width: `${assessment.report.organizationProfile.aiReadinessScore * 10}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-bold text-[#5C61F6]">
                    {assessment.report.organizationProfile.aiReadinessScore}/10
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-3">
                {assessment.status === "complete" && (
                  <Link
                    href={`/assessment/report?id=${assessment.id}${!assessment.paid ? "&preview=true" : ""}`}
                    className="text-[12px] font-medium text-[#5C61F6] hover:underline"
                  >
                    View Report
                  </Link>
                )}
                {!assessment.paid && assessment.status === "complete" && (
                  <Link
                    href={`/assessment/report?id=${assessment.id}&preview=true`}
                    className="text-[12px] font-medium text-amber-400 hover:underline"
                  >
                    Unlock Full Report
                  </Link>
                )}
                {assessment.paid && !assessment.addOns.policyAndPrompts && (
                  <span className="text-[12px] text-[#5A6478]">
                    AI Policy add-on available
                  </span>
                )}
                {assessment.addOns.policyAndPrompts && (
                  <span className="text-[12px] text-green-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Policy & Prompts included
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info section */}
      <div className="mt-12 border-t border-white/[0.06] pt-8">
        <h2 className="text-[14px] font-semibold text-white mb-4">About your data</h2>
        <div className="grid sm:grid-cols-2 gap-6 text-[13px] text-[#8B95A5]">
          <div>
            <h3 className="font-medium text-white mb-1">What we store</h3>
            <p>Only your email, assessment questionnaire answers, and the AI-generated report output. No uploaded file content is ever stored.</p>
          </div>
          <div>
            <h3 className="font-medium text-white mb-1">Refining your assessment</h3>
            <p>Start a new assessment with updated information to get refined recommendations as your organization evolves.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, paid }: { status: string; paid: boolean }) {
  if (status === "complete" && paid) {
    return (
      <span className="text-[11px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded">
        COMPLETE
      </span>
    );
  }
  if (status === "complete" && !paid) {
    return (
      <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
        PREVIEW
      </span>
    );
  }
  if (status === "analyzing") {
    return (
      <span className="text-[11px] font-bold text-[#5C61F6] bg-[#5C61F6]/10 border border-[#5C61F6]/20 px-2 py-0.5 rounded">
        ANALYZING
      </span>
    );
  }
  return (
    <span className="text-[11px] font-bold text-[#5A6478] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded">
      {status.toUpperCase()}
    </span>
  );
}
