import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser, createAssessment, initAssessmentTables } from "@/lib/assessment/db";
import { signToken } from "@/lib/assessment/auth";
import { getPersona } from "@/lib/assessment/test-personas";
import { checkAdminToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { persona: personaId } = body as { persona?: string };

  if (!(await checkAdminToken(req.headers.get("x-admin-token")))) {
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
