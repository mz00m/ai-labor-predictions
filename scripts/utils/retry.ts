/**
 * Shared exponential backoff retry utility.
 * Wraps any async function and retries on transient failures.
 */

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; baseDelayMs?: number; label?: string } = {}
): Promise<T> {
  const { retries = 3, baseDelayMs = 1000, label = "request" } = options;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLast = attempt === retries - 1;
      if (isLast) throw err;
      const delay = baseDelayMs * 2 ** attempt;
      console.warn(
        `[retry] ${label} failed (attempt ${attempt + 1}/${retries}), retrying in ${delay}ms...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("unreachable");
}
