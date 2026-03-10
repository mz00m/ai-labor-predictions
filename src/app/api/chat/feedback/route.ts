import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { messageId: string; rating: number };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messageId, rating } = body;
  if (!messageId || (rating !== 1 && rating !== -1)) {
    return new Response(
      JSON.stringify({ error: "messageId and rating (1 or -1) required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const sql = getDb();
    if (!sql) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    await sql`
      INSERT INTO chat_feedback (message_id, rating)
      VALUES (${messageId}::uuid, ${rating})
      ON CONFLICT DO NOTHING
    `;
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to save feedback:", err);
    return new Response(
      JSON.stringify({ error: "Failed to save feedback" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
