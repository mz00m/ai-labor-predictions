"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function SubmissionForm() {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          note: note.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setStatus("success");
      setUrl("");
      setNote("");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-card rounded-lg px-6 py-8 bg-white text-center max-w-xl">
        <p className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Thank you!
        </p>
        <p className="text-md text-[var(--muted)]">
          Your suggestion has been received and will be reviewed for inclusion.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-base font-semibold text-[var(--accent)] hover:underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-card rounded-lg px-6 py-6 bg-white max-w-xl space-y-5"
    >
      {/* URL (required) */}
      <div>
        <label
          htmlFor="submission-url"
          className="block text-base font-semibold text-[var(--foreground)] mb-1.5"
        >
          URL <span className="text-[var(--accent)]">*</span>
        </label>
        <input
          id="submission-url"
          type="url"
          required
          maxLength={2048}
          placeholder="https://arxiv.org/abs/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full text-md px-3 py-2 rounded-md border border-black/[0.1] bg-[var(--background)] text-[var(--foreground)] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
        />
        <p className="text-sm text-[var(--muted)] mt-1">
          Link to a study, article, dataset, or report relevant to AI and labor markets.
        </p>
      </div>

      {/* Note (optional) */}
      <div>
        <label
          htmlFor="submission-note"
          className="block text-base font-semibold text-[var(--foreground)] mb-1.5"
        >
          Note <span className="text-sm font-normal text-[var(--muted)]">(optional)</span>
        </label>
        <textarea
          id="submission-note"
          maxLength={500}
          rows={3}
          placeholder="Why is this relevant? Which prediction graph might it apply to?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full text-md px-3 py-2 rounded-md border border-black/[0.1] bg-[var(--background)] text-[var(--foreground)] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] resize-none"
        />
        <p className="text-sm text-[var(--muted)] mt-1">
          {note.length}/500
        </p>
      </div>

      {/* Email (optional) */}
      <div>
        <label
          htmlFor="submission-email"
          className="block text-base font-semibold text-[var(--foreground)] mb-1.5"
        >
          Email <span className="text-sm font-normal text-[var(--muted)]">(optional)</span>
        </label>
        <input
          id="submission-email"
          type="email"
          maxLength={254}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-md px-3 py-2 rounded-md border border-black/[0.1] bg-[var(--background)] text-[var(--foreground)] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
        />
        <p className="text-sm text-[var(--muted)] mt-1">
          Only used to notify you if your source is added. Never shared.
        </p>
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-base text-highlight bg-[#F66B5C]/[0.06] border border-[#F66B5C]/20 rounded px-3 py-2">
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto px-6 py-2.5 rounded-md text-md font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting..." : "Suggest Source"}
      </button>
    </form>
  );
}
