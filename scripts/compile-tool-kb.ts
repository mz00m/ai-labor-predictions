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
  const now = new Date();
  const verifiedDate = verified ? new Date(verified) : new Date(0);
  const daysSinceVerified = Math.floor(
    (now.getTime() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

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
    stale: daysSinceVerified > 90,
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
