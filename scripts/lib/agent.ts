import { query } from "@anthropic-ai/claude-agent-sdk";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");

/**
 * Run a Claude Agent SDK query against this project.
 *
 * @param prompt - The task for the agent
 * @param options - Override default agent options
 * @returns The agent's final text result
 */
export async function runAgent(
  prompt: string,
  options?: {
    allowedTools?: string[];
    maxTurns?: number;
    systemPrompt?: string;
    permissionMode?: "default" | "plan" | "acceptEdits" | "dontAsk" | "bypassPermissions";
  },
): Promise<string> {
  const allowedTools = options?.allowedTools ?? [
    "Read",
    "Glob",
    "Grep",
    "Bash",
    "WebSearch",
    "WebFetch",
  ];

  let result = "";

  for await (const message of query({
    prompt,
    options: {
      cwd: PROJECT_ROOT,
      allowedTools,
      maxTurns: options?.maxTurns ?? 20,
      ...(options?.systemPrompt && { systemPrompt: options.systemPrompt }),
      ...(options?.permissionMode && { permissionMode: options.permissionMode }),
    },
  })) {
    if ("result" in message) {
      result = message.result;
    }
  }

  return result;
}

/**
 * Run a read-only research agent (no file writes or shell commands).
 */
export async function researchAgent(prompt: string): Promise<string> {
  return runAgent(prompt, {
    allowedTools: ["Read", "Glob", "Grep", "WebSearch", "WebFetch"],
    maxTurns: 15,
  });
}

/**
 * Run an agent that can edit project files.
 */
export async function editAgent(prompt: string): Promise<string> {
  return runAgent(prompt, {
    allowedTools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"],
    permissionMode: "acceptEdits",
    maxTurns: 30,
  });
}
