import type { TaskCategory } from "../task-categories";

export interface Tool {
  name: string;
  category: TaskCategory;
  alsoUsefulFor: TaskCategory[];
  pricing: string;
  url: string;
  verified: string; // YYYY-MM-DD
  confidence: "high" | "medium" | "low";
  pitch: string;
  bestFor: string;
  limitations: string;
  stale: boolean; // true if verified date is >90 days old
}

export interface ToolKB {
  compiledAt: string;
  totalTools: number;
  staleCount: number;
  categories: Record<TaskCategory, Tool[]>;
}
