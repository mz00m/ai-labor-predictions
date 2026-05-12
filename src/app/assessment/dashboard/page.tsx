"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { Assessment } from "@/lib/assessment/types";
import { INDUSTRY_LABELS } from "@/lib/assessment/types";

type AuthState = "email" | "code" | "authenticated";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get("returnTo");
  const [authState, setAuthState] = useState<AuthState>("email");
  const [email, setEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [code, setCode] = useState("");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Poll the dashboard every 15s when an assessment is mid-flight so the
  // user doesn't have to reload to see "ANALYZING" tick to "COMPLETE".
  useEffect(() => {
    if (authState !== "authenticated") return;
    const inFlight = assessments.some(
      (a) => a.status === "analyzing" || a.status === "intake",
    );
    if (!inFlight) return;
    const t = setInterval(async () => {
      try {
        const res = await fetch("/api/assessment/dashboard");
        if (!res.ok) return;
        const data = await res.json();
        setAssessments(data.assessments || []);
      } catch {
        // swallow — next tick will retry
      }
    }, 15_000);
    return () => clearInterval(t);
  }, [authState, assessments]);

  // On mount, check if we already have a valid session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/assessment/dashboard");
        if (res.ok) {
          const data = await res.json();
          // If already authenticated and there's a returnTo, redirect immediately
          if (returnTo) {
            router.push(returnTo);
            return;
          }
          setAssessments(data.assessments || []);
          setVerifiedEmail(data.email || "");
          setAuthState("authenticated");
        }
      } catch {
        // No valid session, show email form
      } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, [returnTo, router]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assessment/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setAuthState("code");
      setTimeout(() => codeInputRef.current?.focus(), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assessment/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // If there's a returnTo URL, redirect there after successful verification
      if (returnTo) {
        router.push(returnTo);
        return;
      }

      // Fetch assessments with the new session
      const dashRes = await fetch("/api/assessment/dashboard");
      const dashData = await dashRes.json();
      setAssessments(dashData.assessments || []);
      setVerifiedEmail(email);
      setAuthState("authenticated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/assessment/auth/logout", { method: "POST" });
    setAuthState("email");
    setEmail("");
    setCode("");
    setVerifiedEmail("");
    setAssessments([]);
    setError(null);
  };

  const handleResendCode = async () => {
    setError(null);
    setCode("");
    setLoading(true);
    try {
      const res = await fetch("/api/assessment/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
        <div className="text-md text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
      <h1 className="font-serif text-4xl font-semibold text-gray-900 mb-2">My Plans</h1>
      <p className="text-md text-gray-500 mb-8">
        View your AI action plans. Verify your email to access your reports.
      </p>

      {/* Email entry */}
      {authState === "email" && (
        <form onSubmit={handleSendCode} className="max-w-md">
          <label className="block text-base font-medium text-gray-700 mb-2">
            Enter the email you used for your assessment
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-md text-gray-900 placeholder:text-gray-400 outline-none focus:border-accent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-[#4F52D4] text-white text-base font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            We&apos;ll send a 6-digit verification code to your email.
          </p>
        </form>
      )}

      {/* Code entry */}
      {authState === "code" && (
        <form onSubmit={handleVerifyCode} className="max-w-md">
          <p className="text-md text-gray-600 mb-4">
            We sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>
          </p>
          <div className="flex gap-3 mb-3">
            <input
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-40 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-2xl font-mono text-center text-gray-900 tracking-widest placeholder:text-gray-300 outline-none focus:border-accent"
              required
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="bg-accent hover:bg-[#4F52D4] text-white text-base font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
          <div className="flex gap-4 text-sm">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-accent hover:underline disabled:opacity-50"
            >
              Resend code
            </button>
            <button
              type="button"
              onClick={() => { setAuthState("email"); setCode(""); setError(null); }}
              className="text-gray-400 hover:text-gray-600"
            >
              Use a different email
            </button>
          </div>
        </form>
      )}

      {/* Authenticated */}
      {authState === "authenticated" && (
        <>
          <div className="flex items-center gap-3 mb-8 text-base">
            <span className="text-gray-500">
              Verified as <span className="font-medium text-gray-900">{verifiedEmail}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign out
            </button>
          </div>

          {assessments.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-md mb-4">No plans found for this email.</p>
              <Link
                href="/assessment/start"
                className="text-accent hover:underline text-md"
              >
                Get your first AI action plan
              </Link>
            </div>
          )}

          {assessments.length > 0 && (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {assessment.intake?.organizationName || "Assessment"}
                      </h3>
                      <p className="text-base text-gray-400 mt-1">
                        {assessment.intake?.industry ? INDUSTRY_LABELS[assessment.intake.industry] : ""} |{" "}
                        {new Date(assessment.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <StatusBadge status={assessment.status} />
                  </div>

                  {/* AI Readiness Score — gate every property access. An
                      in-progress assessment can have `report` set but no
                      `organizationProfile` yet, which crashed render here
                      after the "Resume" feature started surfacing
                      non-complete rows on this page. */}
                  {assessment.report?.organizationProfile?.aiReadinessScore ? (
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-sm text-gray-400">AI Readiness:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-accent h-1.5 rounded-full"
                          style={{ width: `${assessment.report.organizationProfile.aiReadinessScore * 10}%` }}
                        />
                      </div>
                      <span className="text-base font-bold text-accent">
                        {assessment.report.organizationProfile.aiReadinessScore}/10
                      </span>
                    </div>
                  ) : null}

                  {/* Actions + age + stuck hint */}
                  <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex gap-3">
                      {assessment.status === "complete" && (
                        <Link
                          href={`/assessment/report?id=${assessment.id}`}
                          className="text-sm font-medium text-accent hover:underline"
                        >
                          View report &rarr;
                        </Link>
                      )}
                      {assessment.status !== "complete" && (
                        <Link
                          href={`/assessment/progress?id=${assessment.id}`}
                          className="text-sm font-medium text-accent hover:underline"
                        >
                          Resume &rarr;
                        </Link>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {relativeAge(assessment.createdAt)}
                    </span>
                  </div>
                  {stuckHint(assessment) && (
                    <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-1.5 leading-snug">
                      Looks stuck. Click <strong>Resume</strong> to retry the current step,
                      or start a new plan if you&rsquo;d like to begin fresh.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6 text-base text-red-600">
          {error}
        </div>
      )}

      {/* Info section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-md font-semibold text-gray-900 mb-4">About your data</h2>
        <div className="grid sm:grid-cols-2 gap-6 text-base text-gray-500">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">What we store</h3>
            <p>Your email, questionnaire answers, and the AI-generated plan. No uploaded file content is ever stored. Reports are accessible only after email verification.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Updating your plan</h3>
            <p>Start a new plan anytime with updated information as your role or work changes. Each plan builds on the latest context you provide.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function relativeAge(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, (Date.now() - then) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    return `${m} minute${m === 1 ? "" : "s"} ago`;
  }
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  const d = Math.floor(seconds / 86400);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function stuckHint(a: Assessment): boolean {
  if (a.status === "complete") return false;
  const then = new Date(a.createdAt).getTime();
  if (Number.isNaN(then)) return false;
  // If it's been "analyzing" or "intake" for >10 minutes, almost certainly
  // not actively generating. The pipeline typically finishes in 2-4 min.
  return Date.now() - then > 10 * 60 * 1000;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "complete") {
    return (
      <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
        COMPLETE
      </span>
    );
  }
  if (status === "analyzing") {
    return (
      <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
        ANALYZING
      </span>
    );
  }
  return (
    <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
      {status.toUpperCase()}
    </span>
  );
}
