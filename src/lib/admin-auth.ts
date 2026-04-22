import { getAdminPasswordHash } from "./assessment/db";

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkAdminToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const dbHash = await getAdminPasswordHash();
  if (dbHash) {
    const tokenHash = await hashToken(token);
    return tokenHash === dbHash;
  }
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return token === secret;
}
