"use client";

import { useState, useEffect } from "react";

interface AssessmentRow {
  id: string;
  email: string;
  status: string;
  current_step: string | null;
  created_at: string;
  completed_at: string | null;
  paid: boolean;
  add_on_policy: boolean;
  preview_generated: boolean;
  organization: string | null;
  industry: string | null;
  company_size: string | null;
  job_title: string | null;
  scope: string | null;
  ai_maturity: string | null;
  step_feedback: Array<{ step: string; rating?: number; comment?: string }> | null;
  has_report: boolean;
  readiness_score: string | null;
  duration_minutes: number | null;
}

interface FeedbackRow {
  id: string;
  assessment_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  email: string;
  organization: string | null;
  industry: string | null;
}

interface DailyCount {
  date: string;
  started: number;
  completed: number;
  paid: number;
}

interface AdminData {
  stats: {
    total: number;
    complete: number;
    analyzing: number;
    errored: number;
    intake: number;
    paid: number;
    uniqueUsers: number;
    feedbackCount: number;
    avgRating: string | null;
    avgDurationMinutes: string | null;
    completionRate: string;
  };
  assessments: AssessmentRow[];
  feedback: FeedbackRow[];
  dailyCounts: DailyCount[];
}

type Tab = "overview" | "assessments" | "feedback";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const changePassword = async () => {
    if (newPassword.length < 6) {
      setPasswordMsg("Must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    setPasswordMsg(null);
    try {
      const res = await fetch(`/api/assessment/admin?token=${encodeURIComponent(token)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) throw new Error("Failed to change password");
      setToken(newPassword);
      setNewPassword("");
      setPasswordMsg("Password changed. Use the new password next time.");
      // Update URL so refresh works
      const url = new URL(window.location.href);
      url.searchParams.set("token", newPassword);
      window.history.replaceState({}, "", url.toString());
    } catch {
      setPasswordMsg("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const fetchData = async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessment/admin?token=${encodeURIComponent(t)}`);
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid token");
        throw new Error("Failed to fetch");
      }
      const json = await res.json();
      setData(json);
      setAuthed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      setToken(t);
      fetchData(t);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) fetchData(token);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
          <h1 className="text-xl font-semibold">Assessment Admin</h1>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin token"
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : "Access"}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    );
  }

  if (!data) return null;

  const { stats, assessments, feedback, dailyCounts } = data;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Assessment Admin</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-36 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs"
            />
            <button
              onClick={changePassword}
              disabled={changingPassword || !newPassword}
              className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50"
            >
              {changingPassword ? "..." : "Change"}
            </button>
            {passwordMsg && (
              <span className={`text-xs ${passwordMsg.includes("Failed") || passwordMsg.includes("Must") ? "text-red-400" : "text-green-400"}`}>
                {passwordMsg}
              </span>
            )}
          </div>
          <button
            onClick={() => fetchData(token)}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Stat cards — 2 rows */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Complete" value={stats.complete} accent="green" />
        <StatCard label="Analyzing" value={stats.analyzing} accent="blue" />
        <StatCard label="Intake" value={stats.intake} />
        <StatCard label="Errored" value={stats.errored} accent="red" />
        <StatCard label="Paid" value={stats.paid} accent="amber" />
        <StatCard label="Unique Users" value={stats.uniqueUsers} />
        <StatCard label="Completion" value={`${stats.completionRate}%`} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <StatCard label="Avg Duration" value={stats.avgDurationMinutes ? `${stats.avgDurationMinutes}m` : "—"} />
        <StatCard label="Avg Rating" value={stats.avgRating ? `${stats.avgRating}/5` : "—"} />
        <StatCard label="Feedback" value={stats.feedbackCount} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {(["overview", "assessments", "feedback"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          {/* Daily throughput */}
          <section className="mb-10">
            <h2 className="text-lg font-medium mb-3">Daily Throughput (30 days)</h2>
            {dailyCounts.length === 0 ? (
              <p className="text-zinc-500 text-sm">No data yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left text-zinc-400">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4 text-right">Started</th>
                      <th className="py-2 pr-4 text-right">Completed</th>
                      <th className="py-2 pr-4 text-right">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyCounts.map((d) => (
                      <tr key={d.date} className="border-b border-zinc-900">
                        <td className="py-1.5 pr-4 text-zinc-400 text-xs font-mono">
                          {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="py-1.5 pr-4 text-right">{d.started}</td>
                        <td className="py-1.5 pr-4 text-right text-green-400">{d.completed}</td>
                        <td className="py-1.5 pr-4 text-right text-amber-400">{d.paid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Funnel */}
          <section className="mb-10">
            <h2 className="text-lg font-medium mb-3">Funnel</h2>
            <FunnelBar label="Started" value={stats.total} max={stats.total} color="bg-zinc-600" />
            <FunnelBar label="Completed" value={stats.complete} max={stats.total} color="bg-green-600" />
            <FunnelBar label="Paid" value={stats.paid} max={stats.total} color="bg-amber-600" />
          </section>

          {/* Recent assessments */}
          <section>
            <h2 className="text-lg font-medium mb-3">Recent Assessments</h2>
            <AssessmentTable assessments={assessments.slice(0, 10)} />
            {assessments.length > 10 && (
              <button
                onClick={() => setTab("assessments")}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                View all {assessments.length} assessments
              </button>
            )}
          </section>
        </>
      )}

      {tab === "assessments" && (
        <section>
          <h2 className="text-lg font-medium mb-3">All Assessments ({assessments.length})</h2>
          <AssessmentTable assessments={assessments} />
        </section>
      )}

      {tab === "feedback" && (
        <section>
          <h2 className="text-lg font-medium mb-3">Feedback ({feedback.length})</h2>
          {feedback.length === 0 ? (
            <p className="text-zinc-500 text-sm">No feedback yet.</p>
          ) : (
            <div className="space-y-3">
              {feedback.map((f) => (
                <div key={f.id} className="p-4 bg-zinc-900 rounded border border-zinc-800">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-yellow-400 text-sm">
                      {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">{f.email}</span>
                    <span className="text-zinc-600 text-xs">
                      {new Date(f.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {(f.organization || f.industry) && (
                    <div className="text-xs text-zinc-500 mb-2">
                      {[f.organization, f.industry].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  {f.comment && <p className="text-sm text-zinc-300">{f.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ── Components ─────────────────────────────────────────── */

function AssessmentTable({ assessments }: { assessments: AssessmentRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-zinc-400">
            <th className="py-2 pr-3">Email</th>
            <th className="py-2 pr-3">Organization</th>
            <th className="py-2 pr-3">Industry</th>
            <th className="py-2 pr-3">Status</th>
            <th className="py-2 pr-3">Score</th>
            <th className="py-2 pr-3">Duration</th>
            <th className="py-2 pr-3">Paid</th>
            <th className="py-2 pr-3">Created</th>
            <th className="py-2 pr-3">Report</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((a) => (
            <tr key={a.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
              <td className="py-2 pr-3 font-mono text-xs">{a.email}</td>
              <td className="py-2 pr-3 text-xs">{a.organization || "—"}</td>
              <td className="py-2 pr-3 text-xs">{a.industry || "—"}</td>
              <td className="py-2 pr-3">
                <StatusBadge status={a.status} />
              </td>
              <td className="py-2 pr-3">{a.readiness_score || "—"}</td>
              <td className="py-2 pr-3 text-zinc-400 text-xs">
                {a.duration_minutes != null ? `${a.duration_minutes}m` : "—"}
              </td>
              <td className="py-2 pr-3">
                {a.paid ? (
                  <span className="text-amber-400 text-xs">Paid</span>
                ) : (
                  <span className="text-zinc-600 text-xs">—</span>
                )}
              </td>
              <td className="py-2 pr-3 text-zinc-500 text-xs">
                {new Date(a.created_at).toLocaleDateString()}
              </td>
              <td className="py-2 pr-3">
                {a.has_report ? (
                  <a
                    href={`/assessment/report?id=${a.id}`}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-zinc-600 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "green" | "blue" | "red" | "amber";
}) {
  const accentClasses: Record<string, string> = {
    green: "text-green-400",
    blue: "text-blue-400",
    red: "text-red-400",
    amber: "text-amber-400",
  };
  return (
    <div className="p-3 bg-zinc-900 rounded border border-zinc-800">
      <div className={`text-xl font-semibold ${accent ? accentClasses[accent] : ""}`}>
        {value}
      </div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    complete: "bg-green-900/50 text-green-400 border-green-800",
    analyzing: "bg-blue-900/50 text-blue-400 border-blue-800",
    intake: "bg-zinc-800 text-zinc-400 border-zinc-700",
    error: "bg-red-900/50 text-red-400 border-red-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${colors[status] || colors.intake}`}>
      {status}
    </span>
  );
}

function FunnelBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-sm text-zinc-400 w-24 text-right">{label}</span>
      <div className="flex-1 h-6 bg-zinc-900 rounded overflow-hidden">
        <div
          className={`h-full ${color} rounded transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-mono w-16 text-right">
        {value} <span className="text-zinc-600">({pct.toFixed(0)}%)</span>
      </span>
    </div>
  );
}
