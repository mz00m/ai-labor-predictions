import { NextRequest, NextResponse } from "next/server";
import { saveFeedback } from "@/lib/assessment/db";

export async function POST(req: NextRequest) {
  try {
    const { assessmentId, rating, comment } = await req.json();

    if (!assessmentId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid feedback data" }, { status: 400 });
    }

    await saveFeedback(assessmentId, rating, comment);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback save error:", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
