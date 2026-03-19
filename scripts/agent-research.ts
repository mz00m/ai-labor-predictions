/**
 * Example: Run a research agent against the project.
 *
 * Usage:
 *   npx tsx scripts/agent-research.ts "What sources cover tech sector displacement?"
 *   npx tsx scripts/agent-research.ts "Summarize the methodology for weighted averages"
 */
import { researchAgent } from "./lib/agent.js";

const prompt = process.argv[2];

if (!prompt) {
  console.error("Usage: npx tsx scripts/agent-research.ts <prompt>");
  process.exit(1);
}

async function main() {
  const result = await researchAgent(prompt);
  console.log(result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
