import { getDb } from "@/lib/db";
import { submissionSchema } from "@/lib/submissions";

export const dynamic = "force-dynamic";

/**
 * In-memory rate limiter for submissions.
 * Tighter than chat: 3 per hour per IP, 30 per hour globally.
 */
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 3_600_000; // 1 hour
const PER_IP_MAX = 3;
const GLOBAL_MAX = 30;
let globalTimestamps: number[] = [];

function clean(ts: number[], now: number) {
  return ts.filter((t) => now - t < WINDOW_MS);
}

function isRateLimited(ip: string): { limited: boolean; retryAfterMs?: number } {
  const now = Date.now();

  globalTimestamps = clean(globalTimestamps, now);
  if (globalTimestamps.length >= GLOBAL_MAX) {
    return { limited: true, retryAfterMs: WINDOW_MS - (now - globalTimestamps[0]) };
  }

  const timestamps = clean(rateLimitMap.get(ip) || [], now);
  rateLimitMap.set(ip, timestamps);
  if (timestamps.length >= PER_IP_MAX) {
    return { limited: true, retryAfterMs: WINDOW_MS - (now - timestamps[0]) };
  }

  timestamps.push(now);
  globalTimestamps.push(now);
  return { limited: false };
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(request: Request) {
  // Rate limit
  const ip = getClientIp(request);
  const { limited, retryAfterMs } = isRateLimited(ip);
  if (limited) {
    const retryAfterSec = Math.ceil((retryAfterMs || WINDOW_MS) / 1000);
    return Response.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate
  const result = submissionSchema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Invalid input";
    return Response.json({ error: firstError }, { status: 400 });
  }

  const { url, note, email } = result.data;

  // Store in DB
  try {
    const sql = getDb();
    if (!sql) {
      return Response.json(
        { error: "Database not configured. Submissions are temporarily unavailable." },
        { status: 503 },
      );
    }
    await sql`
      CREATE TABLE IF NOT EXISTS study_submissions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        url TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        ip TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        reviewed_at TIMESTAMPTZ
      )
    `;
    await sql`
      INSERT INTO study_submissions (url, note, email, ip)
      VALUES (${url}, ${note || ""}, ${email || ""}, ${ip})
    `;
  } catch (err) {
    console.error("Failed to store submission:", err);
    return Response.json(
      { error: "Failed to save submission. Please try again." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
