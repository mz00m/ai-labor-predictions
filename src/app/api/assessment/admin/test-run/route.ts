import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser, createAssessment, initAssessmentTables, getAdminPasswordHash } from "@/lib/assessment/db";
import { signToken } from "@/lib/assessment/auth";
import { getPersona } from "@/lib/assessment/test-personas";

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkAuth(token: string | null): Promise<boolean> {
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

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { persona: personaId, token } = body as { persona?: string; token?: string };

  if (!(await checkAuth(token ?? null))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const persona = getPersona(personaId ?? "");
  if (!persona) {
    return NextResponse.json({ error: "Unknown persona" }, { status: 400 });
  }

  await initAssessmentTables();

  const user = await getOrCreateUser(persona.email);
  if (!user) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 500 });
  }

  const assessmentId = await createAssessment(user.id, persona.intake);
  if (!assessmentId) {
    return NextResponse.json({ error: "Could not create assessment" }, { status: 500 });
  }

  const jwt = await signToken(persona.email);

  return NextResponse.json({ assessmentId, jwt });
}
