import fs from "fs";
import path from "path";

/**
 * Load environment variables from .env, then .env.local (which overrides).
 * Parses key=value pairs, strips surrounding quotes, skips comments.
 */
export function loadEnv(envFilePath?: string): void {
  if (envFilePath) {
    loadEnvFile(envFilePath);
    return;
  }
  loadEnvFile(path.join(process.cwd(), ".env"));
  loadEnvFile(path.join(process.cwd(), ".env.local"));
}

function loadEnvFile(p: string): void {
  if (!fs.existsSync(p)) return;

  const content = fs.readFileSync(p, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx);
        const value = trimmed.slice(eqIdx + 1).replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  }
}
