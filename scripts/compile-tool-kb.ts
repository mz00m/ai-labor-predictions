/**
 * Compiles the tool knowledge base from markdown files into structured JSON.
 *
 * Each markdown file in src/data/tool-kb/ corresponds to a task category.
 * Tool entries follow a consistent format parsed by this script.
 *
 * Usage: bun run compile-kb
 * Output: src/data/tool-kb-compiled.json
 */

import * as fs from "fs";
import * as path from "path";
import type { Tool, ToolKB } from "../src/data/tool-kb/types";
import type { TaskCategory } from "../src/data/task-categories";

const KB_DIR = path.join(__dirname, "../src/data/tool-kb");
const OUTPUT = path.join(__dirname, "../src/data/tool-kb-compiled.json");

const VALID_CATEGORIES: TaskCategory[] = [
  "information-processing",
  "communication",
  "analysis-decision",
  "creative-generative",
  "coordination-management",
  "physical-manual",
  "interpersonal",
  "technical-specialized",
];

const STALE_DAYS = 90;
const EXPIRED_DAYS = 180;

function daysSince(isoDate: string): number {
  const then = isoDate ? new Date(isoDate) : new Date(0);
  return Math.floor((Date.now() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function parseTool(block: string): Tool | null {
  const nameMatch = block.match(/^## (.+)$/m);
  if (!nameMatch) return null;

  const field = (label: string): string => {
    const re = new RegExp(`^- \\*\\*${label}\\*\\*:\\s*(.+)$`, "m");
    const m = block.match(re);
    return m ? m[1].trim() : "";
  };

  const pitchMatch = block.match(/^> (.+)$/m);
  const bestForMatch = block.match(
    /\*\*Best for:\*\*\s*(.+?)(?=\n\n|\n\*\*|$)/s
  );
  const limitationsMatch = block.match(
    /\*\*Limitations:\*\*\s*(.+?)(?=\n\n|\n##|$)/s
  );

  const category = field("Category") as TaskCategory;
  if (!VALID_CATEGORIES.includes(category)) {
    console.warn(
      `  Warning: "${nameMatch[1]}" has invalid category "${category}", skipping`
    );
    return null;
  }

  const alsoUsefulFor = field("Also useful for")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && VALID_CATEGORIES.includes(s as TaskCategory)) as TaskCategory[];

  const verified = field("Verified");
  const daysSinceVerified = daysSince(verified);

  const confidence = field("Confidence") as Tool["confidence"];

  return {
    name: nameMatch[1],
    category,
    alsoUsefulFor,
    pricing: field("Pricing"),
    url: field("URL"),
    verified,
    confidence: ["high", "medium", "low"].includes(confidence)
      ? confidence
      : "low",
    pitch: pitchMatch ? pitchMatch[1].trim() : "",
    bestFor: bestForMatch ? bestForMatch[1].trim() : "",
    limitations: limitationsMatch ? limitationsMatch[1].trim() : "",
    stale: daysSinceVerified > STALE_DAYS,
  };
}

function parseFile(filePath: string): Tool[] {
  const content = fs.readFileSync(filePath, "utf-8");
  // Split on ## headings (tool entries), keeping the heading
  const blocks = content.split(/(?=^## )/m).filter((b) => b.startsWith("## "));
  const tools: Tool[] = [];

  for (const block of blocks) {
    const tool = parseTool(block);
    if (tool) tools.push(tool);
  }

  return tools;
}

function compile(): ToolKB {
  const categories: Record<string, Tool[]> = {};
  let totalTools = 0;
  let staleCount = 0;

  for (const cat of VALID_CATEGORIES) {
    const filePath = path.join(KB_DIR, `${cat}.md`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  Missing file: ${cat}.md`);
      categories[cat] = [];
      continue;
    }

    const tools = parseFile(filePath);
    categories[cat] = tools;
    totalTools += tools.length;
    staleCount += tools.filter((t) => t.stale).length;

    console.log(`  ${cat}: ${tools.length} tools`);
    for (const t of tools.filter((t) => t.stale)) {
      console.warn(`    STALE: ${t.name} (verified ${t.verified})`);
    }
  }

  return {
    compiledAt: new Date().toISOString(),
    totalTools,
    staleCount,
    categories: categories as ToolKB["categories"],
  };
}

console.log("Compiling tool knowledge base...\n");
const kb = compile();
fs.writeFileSync(OUTPUT, JSON.stringify(kb, null, 2));
console.log(
  `\nDone: ${kb.totalTools} tools compiled to ${OUTPUT}${kb.staleCount > 0 ? ` (${kb.staleCount} stale)` : ""}`
);

// The Action Plan quotes these prices to users, so an unverified record is a
// wrong-price risk, not just untidy metadata. 90 days warns; past EXPIRED_DAYS
// the build fails rather than shipping figures nobody has checked in half a year.
const expired = Object.values(kb.categories)
  .flat()
  .filter((t) => daysSince(t.verified) > EXPIRED_DAYS);

if (expired.length > 0) {
  console.error(`\n${expired.length} tool records are past the ${EXPIRED_DAYS}-day verification limit:`);
  for (const t of expired) console.error(`  ${t.name} (verified ${t.verified})`);
  console.error("\nRe-verify pricing and URLs in src/data/tool-kb/, or remove the record.\n");
  process.exit(1);
}
