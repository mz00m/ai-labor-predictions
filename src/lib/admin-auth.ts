import { getAdminPasswordHash } from "./assessment/db";

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Constant-time string comparison. Both inputs are hashed first so the
 * compared values always have equal length and the loop runs in fixed time,
 * which keeps response timing from leaking how much of a secret matched.
 */
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256Hex(a), sha256Hex(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) {
    diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
  }
  return diff === 0;
}

export async function checkAdminToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const dbHash = await getAdminPasswordHash();
  if (dbHash) {
    const tokenHash = await sha256Hex(token);
    return timingSafeEqual(tokenHash, dbHash);
  }
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return timingSafeEqual(token, secret);
}
