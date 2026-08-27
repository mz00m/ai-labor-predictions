/**
 * Compiles the knowledge base from markdown files into structured JSON.
 *
 * Reads:
 *   src/data/knowledge-base/tools/*.md        → AI tool entries
 *   src/data/knowledge-base/human-capabilities/*.md → Human capability entries
 *
 * Output: src/data/knowledge-base/compiled.json
 *
 * Usage: bun run compile-kb
 */

import * as fs from "fs";
import * as path from "path";
import type {
  Tool,
  HumanCapability,
  KnowledgeBase,
  FunctionCategory,
  AutomationResistance,
  FUNCTION_CATEGORY_META,
} from "../src/data/knowledge-base/types";
import type { TaskCategory } from "../src/data/task-categories";

const KB_DIR = path.join(__dirname, "../src/data/knowledge-base");
const OUTPUT = path.join(KB_DIR, "compiled.json");

const VALID_FUNCTIONS: FunctionCategory[] = [
  "administrative",
  "marketing",
  "sales",
  "finance",
  "operations",
  "communications",
  "people-management",
  "customer-service",
  "technology",
  "healthcare",
  "legal",
  "education",
  "creative-design",
];

const VALID_TASK_CATEGORIES: TaskCategory[] = [
  "information-processing",
  "communication",
  "analysis-decision",
  "creative-generative",
  "coordination-management",
  "physical-manual",
  "interpersonal",
  "technical-specialized",
];

const VALID_RESISTANCE: AutomationResistance[] = [
  "judgment-under-ambiguity",
  "relationship-trust",
  "embodied-knowledge",
  "cultural-context",
  "ethical-reasoning",
  "creative-taste",
  "crisis-adaptation",
  "motivational-influence",
  "physical-presence",
  "institutional-knowledge",
];

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function field(block: string, label: string): string {
  const re = new RegExp(`^- \\*\\*${label}\\*\\*:\\s*(.+)$`, "m");
  const m = block.match(re);
  return m ? m[1].trim() : "";
}

function parseList(value: string, validValues: string[]): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && validValues.includes(s));
}

const STALE_DAYS = 90;
const EXPIRED_DAYS = 180;

function daysSince(isoDate: string): number {
  const then = isoDate ? new Date(isoDate) : new Date(0);
  return Math.floor((Date.now() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function computeStale(verified: string): boolean {
  if (!verified) return true;
  return daysSince(verified) > STALE_DAYS;
}

// ---------------------------------------------------------------------------
// Tool parser (same format as before, adapted for function categories)
// ---------------------------------------------------------------------------

function parseTool(block: string): Tool | null {
  const nameMatch = block.match(/^## (.+)$/m);
  if (!nameMatch) return null;

  const pitchMatch = block.match(/^> (.+)$/m);
  const bestForMatch = block.match(
    /\*\*Best for:\*\*\s*(.+?)(?=\n\n|\n\*\*|$)/s
  );
  const limitationsMatch = block.match(
    /\*\*Limitations:\*\*\s*(.+?)(?=\n\n|\n##|$)/s
  );

  const func = field(block, "Function") as FunctionCategory;
  if (!VALID_FUNCTIONS.includes(func)) {
    console.warn(
      `  Warning: tool "${nameMatch[1]}" has invalid function "${func}", skipping`
    );
    return null;
  }

  const alsoUsefulFor = parseList(
    field(block, "Also useful for"),
    VALID_FUNCTIONS
  ) as FunctionCategory[];

  const verified = field(block, "Verified");
  const confidence = field(block, "Confidence") as Tool["confidence"];

  return {
    name: nameMatch[1],
    function: func,
    alsoUsefulFor,
    pricing: field(block, "Pricing"),
    url: field(block, "URL"),
    verified,
    confidence: ["high", "medium", "low"].includes(confidence)
      ? confidence
      : "low",
    pitch: pitchMatch ? pitchMatch[1].trim() : "",
    bestFor: bestForMatch ? bestForMatch[1].trim() : "",
    limitations: limitationsMatch ? limitationsMatch[1].trim() : "",
    stale: computeStale(verified),
  };
}

// ---------------------------------------------------------------------------
// Human Capability parser
// ---------------------------------------------------------------------------

function parseCapability(block: string): HumanCapability | null {
  const nameMatch = block.match(/^## (.+)$/m);
  if (!nameMatch) return null;

  const pitchMatch = block.match(/^> (.+)$/m);

  const func = field(block, "Function") as FunctionCategory;
  if (!VALID_FUNCTIONS.includes(func)) {
    console.warn(
      `  Warning: capability "${nameMatch[1]}" has invalid function "${func}", skipping`
    );
    return null;
  }

  const alsoRelevantTo = parseList(
    field(block, "Also relevant to"),
    VALID_FUNCTIONS
  ) as FunctionCategory[];

  const automationResistance = parseList(
    field(block, "Automation resistance"),
    VALID_RESISTANCE
  ) as AutomationResistance[];

  const taskCategories = parseList(
    field(block, "Task categories"),
    VALID_TASK_CATEGORIES
  ) as TaskCategory[];

  const appreciationScore = parseInt(field(block, "Appreciation score"), 10);
  const verified = field(block, "Verified");
  const confidence = field(block, "Confidence") as
    | "high"
    | "medium"
    | "low";

  // Extract the "Why appreciating" and "How to develop" blocks
  const whyMatch = block.match(
    /\*\*Why appreciating\*\*:\s*(.+?)(?=\n- \*\*How to develop\*\*)/s
  );
  const howMatch = block.match(
    /\*\*How to develop\*\*:\s*(.+?)(?=\n- \*\*Automation resistance\*\*)/s
  );

  return {
    name: nameMatch[1],
    function: func,
    alsoRelevantTo,
    whyAppreciating: whyMatch ? whyMatch[1].trim() : "",
    howToDevelop: howMatch ? howMatch[1].trim() : "",
    automationResistance,
    taskCategories,
    appreciationScore: isNaN(appreciationScore) ? 5 : appreciationScore,
    verified,
    confidence: ["high", "medium", "low"].includes(confidence)
      ? confidence
      : "low",
    stale: computeStale(verified),
  };
}

// ---------------------------------------------------------------------------
// File parser
// ---------------------------------------------------------------------------

function parseFile<T>(
  filePath: string,
  parser: (block: string) => T | null
): T[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const blocks = content
    .split(/(?=^## )/m)
    .filter((b) => b.startsWith("## "));
  const results: T[] = [];

  for (const block of blocks) {
    const item = parser(block);
    if (item) results.push(item);
  }

  return results;
}

// ---------------------------------------------------------------------------
// Compile
// ---------------------------------------------------------------------------

function compile(): KnowledgeBase {
  const tools: Record<string, Tool[]> = {};
  const capabilities: Record<string, HumanCapability[]> = {};
  let totalTools = 0;
  let totalCapabilities = 0;
  let staleCount = 0;

  console.log("--- Tools ---");
  const toolsDir = path.join(KB_DIR, "tools");
  for (const func of VALID_FUNCTIONS) {
    const filePath = path.join(toolsDir, `${func}.md`);
    if (!fs.existsSync(filePath)) {
      tools[func] = [];
      continue;
    }
    const parsed = parseFile(filePath, parseTool);
    tools[func] = parsed;
    totalTools += parsed.length;
    staleCount += parsed.filter((t) => t.stale).length;
    console.log(`  ${func}: ${parsed.length} tools`);
  }

  console.log("\n--- Human Capabilities ---");
  const capDir = path.join(KB_DIR, "human-capabilities");
  for (const func of VALID_FUNCTIONS) {
    const filePath = path.join(capDir, `${func}.md`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  Missing: ${func}.md`);
      capabilities[func] = [];
      continue;
    }
    const parsed = parseFile(filePath, parseCapability);
    capabilities[func] = parsed;
    totalCapabilities += parsed.length;
    staleCount += parsed.filter((c) => c.stale).length;
    console.log(`  ${func}: ${parsed.length} capabilities`);
  }

  return {
    compiledAt: new Date().toISOString(),
    totalTools,
    totalCapabilities,
    staleCount,
    tools: tools as KnowledgeBase["tools"],
    capabilities: capabilities as KnowledgeBase["capabilities"],
  };
}

console.log("Compiling knowledge base...\n");
const kb = compile();
if (fs.existsSync(OUTPUT)) {
  try {
    const previous = JSON.parse(fs.readFileSync(OUTPUT, "utf8")) as KnowledgeBase;
    const { compiledAt: _previousTimestamp, ...previousContent } = previous;
    const { compiledAt: _nextTimestamp, ...nextContent } = kb;
    if (JSON.stringify(previousContent) === JSON.stringify(nextContent)) {
      kb.compiledAt = previous.compiledAt;
    }
  } catch {
    // A malformed or incompatible generated file should be replaced below.
  }
}
fs.writeFileSync(OUTPUT, JSON.stringify(kb, null, 2));
console.log(
  `\nDone: ${kb.totalTools} tools + ${kb.totalCapabilities} capabilities compiled to ${OUTPUT}${kb.staleCount > 0 ? ` (${kb.staleCount} stale)` : ""}`
);

// These records drive user-facing recommendations, including pricing, so an
// unverified one is a wrong-answer risk rather than untidy metadata. `stale`
// warns at 90 days; past EXPIRED_DAYS the build fails instead of shipping
// claims nobody has rechecked in half a year.
const expired = [
  ...Object.values(kb.tools).flat(),
  ...Object.values(kb.capabilities).flat(),
].filter((r) => daysSince(r.verified) > EXPIRED_DAYS);

if (expired.length > 0) {
  console.error(`\n${expired.length} records are past the ${EXPIRED_DAYS}-day verification limit:`);
  for (const r of expired) console.error(`  ${r.name} (verified ${r.verified || "never"})`);
  console.error("\nRe-verify in src/data/knowledge-base/, or remove the record.\n");
  process.exit(1);
}
