import Anthropic from "@anthropic-ai/sdk";
import { buildChatContext } from "@/lib/chat/context-builder";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Simple in-memory rate limiter.
 * Tracks request timestamps per IP with a sliding window.
 */
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // max requests per window per IP
const GLOBAL_RATE_LIMIT_MAX = 60; // max total requests per window
let globalRequestTimestamps: number[] = [];

function cleanTimestamps(timestamps: number[], now: number): number[] {
  return timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
}

function isRateLimited(ip: string): { limited: boolean; retryAfterMs?: number } {
  const now = Date.now();

  // Global rate limit
  globalRequestTimestamps = cleanTimestamps(globalRequestTimestamps, now);
  if (globalRequestTimestamps.length >= GLOBAL_RATE_LIMIT_MAX) {
    const oldest = globalRequestTimestamps[0];
    return { limited: true, retryAfterMs: RATE_LIMIT_WINDOW_MS - (now - oldest) };
  }

  // Per-IP rate limit
  const timestamps = cleanTimestamps(rateLimitMap.get(ip) || [], now);
  rateLimitMap.set(ip, timestamps);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = timestamps[0];
    return { limited: true, retryAfterMs: RATE_LIMIT_WINDOW_MS - (now - oldest) };
  }

  // Record this request
  timestamps.push(now);
  globalRequestTimestamps.push(now);
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
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Chat is not configured. ANTHROPIC_API_KEY is missing." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  // Rate limit check
  const clientIp = getClientIp(request);
  const { limited, retryAfterMs } = isRateLimited(clientIp);
  if (limited) {
    const retryAfterSec = Math.ceil((retryAfterMs || RATE_LIMIT_WINDOW_MS) / 1000);
    return new Response(
      JSON.stringify({
        error: "You're asking questions faster than we can keep up! Please wait a moment and try again.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSec),
        },
      }
    );
  }

  let body: { messages: ChatMessage[]; sessionId?: string; conversationId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, sessionId, conversationId } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Messages array is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Use the latest user message to build context
  const latestUserMessage = [...messages].reverse().find((m) => m.role === "user");
  if (!latestUserMessage) {
    return new Response(
      JSON.stringify({ error: "No user message found" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { systemPrompt } = buildChatContext(latestUserMessage.content);

  // Keep conversation history manageable (last 20 messages)
  const trimmedMessages = messages.slice(-20).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const client = new Anthropic({ apiKey });
  const startTime = Date.now();
  const userAgent = request.headers.get("user-agent") || null;
  const referrer = request.headers.get("referer") || null;
  let dbConversationId = conversationId || null;

  let stream;
  try {
    stream = await client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: systemPrompt,
      messages: trimmedMessages,
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return new Response(
        JSON.stringify({
          error: "The service is experiencing high demand. Please try again in a few seconds.",
        }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "10" } }
      );
    }
    throw err;
  }

  // Stream response as Server-Sent Events
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let fullText = "";
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullText += event.delta.text;
            const data = JSON.stringify({ type: "delta", text: event.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }

        // Log conversation and messages to DB
        const latencyMs = Date.now() - startTime;
        let dbMessageId: string | null = null;
        try {
          const sql = getDb();
          if (!sql) throw new Error("DB not configured");
          if (!dbConversationId) {
            const sid = sessionId || crypto.randomUUID();
            const rows = await sql`
              INSERT INTO chat_conversations (session_id, user_agent, referrer, message_count)
              VALUES (${sid}, ${userAgent}, ${referrer}, 1)
              RETURNING id
            `;
            dbConversationId = (rows as Record<string, string>[])[0].id;
          } else {
            await sql`
              UPDATE chat_conversations
              SET message_count = message_count + 1, ended_at = NOW()
              WHERE id = ${dbConversationId}::uuid
            `;
          }
          await sql`
            INSERT INTO chat_messages (conversation_id, role, content)
            VALUES (${dbConversationId}::uuid, 'user', ${latestUserMessage.content})
          `;
          const assistantRows = await sql`
            INSERT INTO chat_messages (conversation_id, role, content, latency_ms)
            VALUES (${dbConversationId}::uuid, 'assistant', ${fullText}, ${latencyMs})
            RETURNING id
          `;
          dbMessageId = (assistantRows as Record<string, string>[])[0].id;
        } catch (dbErr) {
          console.error("Failed to log chat analytics:", dbErr);
        }

        const donePayload = {
          type: "done",
          conversationId: dbConversationId,
          messageId: dbMessageId,
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(donePayload)}\n\n`));
        controller.close();
      } catch (err) {
        // Handle rate limit errors that occur mid-stream
        if (err instanceof Anthropic.RateLimitError) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: "High demand right now — please wait a moment and try again." })}\n\n`
            )
          );
        } else {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", error: msg })}\n\n`)
          );
        }
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
