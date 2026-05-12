"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log to the browser console so users can copy the full stack on report,
  // and so Vercel's client-error capture picks it up. The default behavior
  // strips error details from the page entirely.
  useEffect(() => {
    console.error("[ErrorBoundary]", {
      message: error?.message,
      digest: error?.digest,
      name: error?.name,
      stack: error?.stack,
      path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
      <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] flex items-center justify-center mb-6">
        <span className="text-[var(--muted)] text-lg font-semibold">!</span>
      </div>
      <h2 className="text-heading-sm font-bold text-[var(--foreground)] mb-2">
        Something went wrong
      </h2>
      <p className="text-md text-[var(--muted)] max-w-md mb-3">
        An unexpected error occurred. This has been logged.
      </p>
      {error?.message && (
        <p className="text-sm text-[var(--muted)] max-w-md mb-3 font-mono break-words">
          {error.message.slice(0, 240)}
        </p>
      )}
      {error?.digest && (
        <p className="text-xs text-[var(--muted)] mb-6 opacity-60">
          Error ID: <span className="font-mono">{error.digest}</span>
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2 text-base font-semibold rounded-md bg-[var(--accent)] text-white hover:opacity-90"
        >
          Try again
        </button>
        <button
          onClick={() => {
            if (typeof window !== "undefined") window.location.href = "/";
          }}
          className="px-5 py-2 text-base font-semibold rounded-md border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
        >
          Go home
        </button>
      </div>
    </div>
  );
}
