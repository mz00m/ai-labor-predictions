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
  company_name: string | null;
  industry: string | null;
  company_size: string | null;
  job_title: string | null;
  step_feedback: Array<{ step: string; rating?: number; comment?: string }> | null;
  has_report: boolean;
  readiness_score: string | null;
}

interface FeedbackRow {
  id: string;
  assessment_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  email: string;
}

interface AdminData {
  stats: {
    total: number;
    complete: number;
    analyzing: number;
    feedbackCount: number;
    avgRating: string | null;
  };
  assessments: AssessmentRow[];
  feedback: FeedbackRow[];
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

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

  // Check URL param on mount
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

  const { stats, assessments, feedback } = data;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Assessment Admin</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Complete" value={stats.complete} />
        <StatCard label="Analyzing" value={stats.analyzing} />
        <StatCard label="Feedback" value={stats.feedbackCount} />
        <StatCard label="Avg Rating" value={stats.avgRating || "—"} />
      </div>

      {/* Assessments table */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-3">Assessments ({assessments.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-zinc-400">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Company</th>
                <th className="py-2 pr-4">Industry</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4">Report</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                  <td className="py-2 pr-4 font-mono text-xs">{a.email}</td>
                  <td className="py-2 pr-4">{a.company_name || "—"}</td>
                  <td className="py-2 pr-4">{a.industry || "—"}</td>
                  <td className="py-2 pr-4">{a.job_title || "—"}</td>
                  <td className="py-2 pr-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="py-2 pr-4">{a.readiness_score || "—"}</td>
                  <td className="py-2 pr-4 text-zinc-500 text-xs">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-4">
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
      </section>

      {/* Feedback */}
      <section>
        <h2 className="text-lg font-medium mb-3">Feedback ({feedback.length})</h2>
        {feedback.length === 0 ? (
          <p className="text-zinc-500 text-sm">No feedback yet.</p>
        ) : (
          <div className="space-y-3">
            {feedback.map((f) => (
              <div key={f.id} className="p-4 bg-zinc-900 rounded border border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-zinc-400">{f.email}</span>
                  <span className="text-yellow-400">
                    {"★".repeat(f.rating)}
                    {"☆".repeat(5 - f.rating)}
                  </span>
                  <span className="text-zinc-600 text-xs">
                    {new Date(f.created_at).toLocaleDateString()}
                  </span>
                </div>
                {f.comment && <p className="text-sm text-zinc-300">{f.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <button
        onClick={() => fetchData(token)}
        className="mt-8 px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded"
      >
        Refresh
      </button>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 bg-zinc-900 rounded border border-zinc-800">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    complete: "bg-green-900/50 text-green-400 border-green-800",
    analyzing: "bg-blue-900/50 text-blue-400 border-blue-800",
    intake: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${colors[status] || colors.intake}`}>
      {status}
    </span>
  );
}
