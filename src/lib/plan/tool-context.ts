/**
 * Builds the tool knowledge base context for Claude's plan generation prompt.
 *
 * Given an occupation's tasks, extracts the relevant task categories and returns
 * only the tools that apply. This keeps the prompt focused and prevents Claude
 * from hallucinating tools.
 *
 *   tasks[] → extract categories → filter KB → formatted context string
 */

import type { TaskCategory } from "@/data/task-categories";
import type { ToolKB, Tool } from "@/data/tool-kb/types";
import toolKBData from "@/data/tool-kb-compiled.json";

const toolKB = toolKBData as ToolKB;

interface TaskWithCategory {
  category: TaskCategory;
  name: string;
}

/**
 * Get tools relevant to a set of tasks.
 * Returns tools whose primary category OR alsoUsefulFor matches
 * any of the task categories in the occupation.
 */
export function getRelevantTools(tasks: TaskWithCategory[]): Tool[] {
  const categories = Array.from(new Set(tasks.map((t) => t.category)));
  const seen = new Set<string>();
  const relevant: Tool[] = [];

  for (const cat of categories) {
    const primary = toolKB.categories[cat] ?? [];
    for (const tool of primary) {
      if (!seen.has(tool.name)) {
        seen.add(tool.name);
        relevant.push(tool);
      }
    }
  }

  // Also include cross-category tools
  for (const cat of Object.keys(toolKB.categories) as TaskCategory[]) {
    for (const tool of toolKB.categories[cat]) {
      if (seen.has(tool.name)) continue;
      if (tool.alsoUsefulFor.some((c) => categories.includes(c))) {
        seen.add(tool.name);
        relevant.push(tool);
      }
    }
  }

  return relevant;
}

/**
 * Format the tool context for injection into Claude's prompt.
 * Returns a concise string that fits within prompt budget.
 */
export function formatToolContext(tasks: TaskWithCategory[]): string {
  const tools = getRelevantTools(tasks);

  if (tools.length === 0) {
    return "No specific tool recommendations available for this occupation's tasks.";
  }

  const lines = tools.map((t) => {
    const crossCats =
      t.alsoUsefulFor.length > 0
        ? ` (also: ${t.alsoUsefulFor.join(", ")})`
        : "";
    return [
      `- **${t.name}** [${t.category}${crossCats}]`,
      `  ${t.pitch}`,
      `  Pricing: ${t.pricing} (verified ${t.verified}${t.stale ? ", may be out of date" : ""})`,
      `  Best for: ${t.bestFor}`,
      `  Limitations: ${t.limitations}`,
    ].join("\n");
  });

  return [
    `## Available AI Tools (${tools.length} tools matching this occupation's task categories)`,
    "",
    "IMPORTANT: Only recommend tools from this list. Do not invent or hallucinate tools.",
    "If no tool fits a specific task, say \"no established tool yet\" rather than guessing.",
    "Where a price is marked as possibly out of date, present it as approximate rather than exact.",
    "",
    ...lines,
  ].join("\n");
}
