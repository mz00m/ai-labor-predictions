import { getDb } from "@/lib/db";
import { submissionSchema } from "@/lib/submissions";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

const WINDOW_MS = 3_600_000; // 1 hour
const PER_IP_MAX = 3;
const GLOBAL_MAX = 30;

export async function POST(request: Request) {
  // Rate limit
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit({
    namespace: "study-submission",
    identifier: ip,
    limit: PER_IP_MAX,
    globalLimit: GLOBAL_MAX,
    windowSeconds: WINDOW_MS / 1000,
  });
  if (!rateLimit.allowed) {
    return Response.json(
      { error: rateLimit.unavailable ? "Submissions are temporarily unavailable." : "Too many submissions. Please try again later." },
      { status: rateLimit.unavailable ? 503 : 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
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
