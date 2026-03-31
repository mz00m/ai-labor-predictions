/**
 * Maps O*NET Generalized Work Activities to our 8 internal task categories.
 *
 * O*NET defines ~41 Generalized Work Activities (GWAs). Each occupation has
 * importance scores (1-5) for each GWA. We map each GWA to exactly one of
 * our 8 task categories, then compute a weighted task composition.
 *
 * Source: O*NET Content Model, "Generalized Work Activities" taxonomy
 * Internal categories: src/data/task-categories.ts
 */

import type { TaskCategory } from "../../src/data/task-categories";

/**
 * Each O*NET GWA Element ID (e.g., "4.A.1.a.1") maps to one internal category.
 * Element IDs follow the O*NET Content Model hierarchy:
 *   4.A.1 = Information Input
 *   4.A.2 = Mental Processes
 *   4.A.3 = Work Output
 *   4.A.4 = Interacting with Others
 */
export const WORK_ACTIVITY_TO_CATEGORY: Record<string, TaskCategory> = {
  // === 4.A.1: Information Input ===
  "4.A.1.a.1": "information-processing",   // Getting Information
  "4.A.1.a.2": "information-processing",   // Monitor Processes, Materials, or Surroundings
  "4.A.1.b.1": "information-processing",   // Identifying Objects, Actions, and Events
  "4.A.1.b.2": "technical-specialized",    // Inspecting Equipment, Structures, or Materials
  "4.A.1.b.3": "analysis-decision",        // Estimating the Quantifiable Characteristics

  // === 4.A.2: Mental Processes ===
  "4.A.2.a.1": "analysis-decision",        // Judging the Qualities of Objects, Services, or People
  "4.A.2.a.2": "information-processing",   // Processing Information
  "4.A.2.a.3": "analysis-decision",        // Evaluating Information to Determine Compliance
  "4.A.2.a.4": "analysis-decision",        // Analyzing Data or Information
  "4.A.2.b.1": "analysis-decision",        // Making Decisions and Solving Problems
  "4.A.2.b.2": "creative-generative",      // Thinking Creatively
  "4.A.2.b.3": "information-processing",   // Updating and Using Relevant Knowledge
  "4.A.2.b.4": "coordination-management",  // Developing Objectives and Strategies
  "4.A.2.b.5": "coordination-management",  // Scheduling Work and Activities
  "4.A.2.b.6": "coordination-management",  // Organizing, Planning, and Prioritizing Work

  // === 4.A.3: Work Output ===
  "4.A.3.a.1": "physical-manual",          // Performing General Physical Activities
  "4.A.3.a.2": "physical-manual",          // Handling and Moving Objects
  "4.A.3.a.3": "technical-specialized",    // Controlling Machines and Processes
  "4.A.3.a.4": "physical-manual",          // Operating Vehicles, Mechanized Devices, or Equipment
  "4.A.3.b.1": "information-processing",   // Working with Computers
  "4.A.3.b.4": "technical-specialized",    // Drafting, Laying Out, and Specifying Technical Devices
  "4.A.3.b.5": "technical-specialized",    // Repairing and Maintaining Mechanical Equipment
  "4.A.3.b.6": "technical-specialized",    // Repairing and Maintaining Electronic Equipment
  "4.A.3.b.2": "information-processing",   // Documenting/Recording Information

  // === 4.A.4: Interacting with Others ===
  "4.A.4.a.1": "communication",            // Interpreting the Meaning of Information for Others
  "4.A.4.a.2": "communication",            // Communicating with Supervisors, Peers, or Subordinates
  "4.A.4.a.3": "communication",            // Communicating with People Outside the Organization
  "4.A.4.a.4": "interpersonal",            // Establishing and Maintaining Interpersonal Relationships
  "4.A.4.a.5": "interpersonal",            // Assisting and Caring for Others
  "4.A.4.a.6": "interpersonal",            // Selling or Influencing Others
  "4.A.4.a.7": "interpersonal",            // Resolving Conflicts and Negotiating with Others
  "4.A.4.a.8": "interpersonal",            // Performing for or Working Directly with the Public
  "4.A.4.b.1": "coordination-management",  // Coordinating the Work and Activities of Others
  "4.A.4.b.2": "coordination-management",  // Developing and Building Teams
  "4.A.4.b.3": "interpersonal",            // Training and Teaching Others
  "4.A.4.b.4": "coordination-management",  // Guiding, Directing, and Motivating Subordinates
  "4.A.4.b.5": "interpersonal",            // Coaching and Developing Others
  "4.A.4.b.6": "communication",            // Providing Consultation and Advice to Others
  "4.A.4.c.1": "information-processing",   // Performing Administrative Activities
  "4.A.4.c.2": "coordination-management",  // Staffing Organizational Units
  "4.A.4.c.3": "coordination-management",  // Monitoring and Controlling Resources
};

/** All 8 task categories in canonical order */
export const ALL_TASK_CATEGORIES: TaskCategory[] = [
  "information-processing",
  "communication",
  "analysis-decision",
  "creative-generative",
  "coordination-management",
  "physical-manual",
  "interpersonal",
  "technical-specialized",
];

/**
 * Given O*NET work activity importance scores for one occupation,
 * compute the task composition as Record<TaskCategory, number> summing to 1.0.
 *
 * @param activities Array of { elementId, importance } where importance is 1-5
 * @returns Task composition record, same shape as OccupationGroup.taskComposition
 */
export function computeTaskComposition(
  activities: Array<{ elementId: string; importance: number }>
): Record<string, number> {
  const categoryWeights: Record<string, number> = {};
  for (const cat of ALL_TASK_CATEGORIES) {
    categoryWeights[cat] = 0;
  }

  let totalWeight = 0;
  for (const { elementId, importance } of activities) {
    const category = WORK_ACTIVITY_TO_CATEGORY[elementId];
    if (!category) continue;
    // Use importance score directly as weight (1-5 scale)
    categoryWeights[category] += importance;
    totalWeight += importance;
  }

  // Normalize to sum to 1.0
  if (totalWeight === 0) {
    // Fallback: equal distribution
    for (const cat of ALL_TASK_CATEGORIES) {
      categoryWeights[cat] = 1 / ALL_TASK_CATEGORIES.length;
    }
  } else {
    for (const cat of ALL_TASK_CATEGORIES) {
      categoryWeights[cat] = Math.round((categoryWeights[cat] / totalWeight) * 1000) / 1000;
    }
  }

  // Fix rounding to ensure sum = 1.0
  const sum = Object.values(categoryWeights).reduce((a, b) => a + b, 0);
  const diff = 1.0 - sum;
  if (Math.abs(diff) > 0.001) {
    // Add remainder to largest category
    const largest = ALL_TASK_CATEGORIES.reduce((a, b) =>
      categoryWeights[a] >= categoryWeights[b] ? a : b
    );
    categoryWeights[largest] = Math.round((categoryWeights[largest] + diff) * 1000) / 1000;
  }

  return categoryWeights;
}
