import { spawn } from "child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { prompt, workingDir } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const args = ["--print", "--output-format", "text", prompt];

  const child = spawn("claude", args, {
    cwd: workingDir || process.cwd(),
    env: { ...process.env },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const encoder = new TextEncoder();
  let aborted = false;

  const stream = new ReadableStream({
    start(controller) {
      child.stdout.on("data", (chunk: Buffer) => {
        if (aborted) return;
        const text = chunk.toString();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      });

      child.stderr.on("data", (chunk: Buffer) => {
        if (aborted) return;
        const text = chunk.toString();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: text })}\n\n`));
      });

      child.on("close", (code) => {
        if (aborted) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, exitCode: code })}\n\n`)
        );
        controller.close();
      });

      child.on("error", (err) => {
        if (aborted) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`)
        );
        controller.close();
      });
    },
    cancel() {
      aborted = true;
      child.kill("SIGTERM");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
