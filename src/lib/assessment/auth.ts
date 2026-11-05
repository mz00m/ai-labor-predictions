import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "assessment_session";
const ACCESS_COOKIE_NAME = "assessment_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const MAX_SCOPED_ASSESSMENTS = 10;

function getSecret() {
  const secret = process.env.ASSESSMENT_JWT_SECRET;
  if (!secret) throw new Error("ASSESSMENT_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export function generateCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function signToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.email !== "string" || payload.scope !== undefined) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

/**
 * Assessment-scoped access, issued when someone submits a new assessment
 * without a verified session. It grants the specific assessments they
 * created, never the email's other assessments: listing those (the
 * dashboard) requires the emailed code. Submitting someone else's email
 * therefore yields access only to the submitter's own new row.
 */
export async function signAccessToken(assessmentIds: string[]): Promise<string> {
  return new SignJWT({ scope: "assessment", aids: assessmentIds.slice(-MAX_SCOPED_ASSESSMENTS) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function getScopedAssessmentIds(req: NextRequest): Promise<string[]> {
  const token = req.cookies.get(ACCESS_COOKIE_NAME)?.value;
  if (!token) return [];
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.scope !== "assessment" || !Array.isArray(payload.aids)) return [];
    return payload.aids.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function makeAccessCookie(token: string) {
  return { ...makeSessionCookie(token), name: ACCESS_COOKIE_NAME };
}

export async function getVerifiedEmail(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const result = await verifyToken(token);
  return result?.email ?? null;
}

export function makeSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  };
}
