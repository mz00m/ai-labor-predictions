import type { Metadata } from "next";
import JobTaskVisualizer from "@/components/task-visualizer/JobTaskVisualizer";

export const metadata: Metadata = {
  title: "Job Task Visualizer — What parts of your job will AI automate?",
  description:
    "Break your job into tasks and see which ones AI will automate first based on compute costs. Interactive tool to understand automation risk by task, not just by job title.",
};

export default function TaskVisualizerPage() {
  return (
    <div>
      <header className="mb-10">
        <h1 className="text-[28px] sm:text-[34px] font-bold text-[var(--foreground)] tracking-tight leading-tight">
          What parts of your job will AI automate?
        </h1>
        <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl leading-relaxed">
          AI doesn&apos;t replace jobs — it replaces tasks. Select your job to see how each
          piece of your work maps to AI compute costs, and where you should be building
          irreplaceable human expertise.
        </p>
      </header>

      <JobTaskVisualizer />
    </div>
  );
}
