/**
 * Run a code review agent over recent changes or a specific file.
 *
 * Usage:
 *   npx tsx scripts/agent-review.ts "Review src/lib/prediction-stats.ts for correctness"
 *   npx tsx scripts/agent-review.ts "Check all prediction JSON files for schema violations"
 */
import { researchAgent } from "./lib/agent.js";

const prompt = process.argv[2];

if (!prompt) {
  console.error("Usage: npx tsx scripts/agent-review.ts <prompt>");
  process.exit(1);
}

const systemPrompt = `You are a senior code reviewer for a Next.js data dashboard (jobsdata.ai).
Focus on: data integrity, schema compliance, evidence tier accuracy, and TypeScript correctness.
Be specific — reference file paths, line numbers, and concrete issues.`;

async function main() {
  const result = await researchAgent(prompt);
  console.log(result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
