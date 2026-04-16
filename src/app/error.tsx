"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
      <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] flex items-center justify-center mb-6">
        <span className="text-[var(--muted)] text-lg font-semibold">!</span>
      </div>
      <h2 className="text-[20px] font-bold text-[var(--foreground)] mb-2">
        Something went wrong
      </h2>
      <p className="text-md text-[var(--muted)] max-w-md mb-6">
        An unexpected error occurred. This has been logged.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2 text-base font-semibold rounded-md bg-[var(--accent)] text-white hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
