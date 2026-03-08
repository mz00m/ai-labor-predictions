import Anthropic from "@anthropic-ai/sdk";
import { buildChatContext } from "@/lib/chat/context-builder";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Chat is not configured. ANTHROPIC_API_KEY is missing." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { messages: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = body;
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

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: trimmedMessages,
  });

  // Stream response as Server-Sent Events
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({ type: "delta", text: event.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: msg })}\n\n`)
        );
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
