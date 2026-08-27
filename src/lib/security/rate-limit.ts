import { createHash } from "node:crypto";
import { getDb } from "@/lib/db";

export interface RateLimitOptions {
  namespace: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
  globalLimit?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  unavailable?: boolean;
}

let tableReady: Promise<void> | null = null;
const localFallback = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function opaqueKey(namespace: string, identifier: string): string {
  return `${namespace}:${createHash("sha256").update(identifier).digest("hex")}`;
}

function localCheck(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const existing = localFallback.get(key);
  if (!existing || existing.resetAt <= now) {
    localFallback.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, retryAfterSeconds: windowSeconds };
  }
  existing.count += 1;
  return {
    allowed: existing.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

async function ensureTable(): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS api_rate_limits (
          rate_key TEXT NOT NULL,
          window_start TIMESTAMPTZ NOT NULL,
          request_count INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (rate_key, window_start)
        )
      `;
      await sql`DELETE FROM api_rate_limits WHERE window_start < NOW() - INTERVAL '2 days'`;
    })().catch((error) => {
      tableReady = null;
      throw error;
    });
  }
  await tableReady;
}

async function increment(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const sql = getDb();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs).toISOString();
  const resetAt = new Date(new Date(windowStart).getTime() + windowMs);
  const rows = await sql`
    INSERT INTO api_rate_limits (rate_key, window_start, request_count, updated_at)
    VALUES (${key}, ${windowStart}::timestamptz, 1, NOW())
    ON CONFLICT (rate_key, window_start)
    DO UPDATE SET request_count = api_rate_limits.request_count + 1, updated_at = NOW()
    RETURNING request_count
  ` as Array<{ request_count: number | string }>;
  const count = Number(rows[0]?.request_count ?? limit + 1);
  return {
    allowed: count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt.getTime() - now) / 1000)),
  };
}

/** Database-backed fixed-window limiter; local fallback is development-only. */
export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const key = opaqueKey(options.namespace, options.identifier);
  const globalKey = `${options.namespace}:global`;

  try {
    await ensureTable();
    const checks = [increment(key, options.limit, options.windowSeconds)];
    if (options.globalLimit) {
      checks.push(increment(globalKey, options.globalLimit, options.windowSeconds));
    }
    const results = await Promise.all(checks);
    return {
      allowed: results.every((result) => result.allowed),
      retryAfterSeconds: Math.max(...results.map((result) => result.retryAfterSeconds)),
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      return localCheck(key, options.limit, options.windowSeconds);
    }
    console.error("Rate limiter unavailable:", error instanceof Error ? error.message : error);
    return { allowed: false, retryAfterSeconds: 60, unavailable: true };
  }
}
