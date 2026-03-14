import type { Metadata } from "next";
import JobTaskVisualizerWrapper from "@/components/task-visualizer/JobTaskVisualizerWrapper";

export const metadata: Metadata = {
  title: "Job Task Visualizer — What parts of your job will AI automate?",
  description:
    "Break your job into tasks and see which ones AI will automate first based on compute costs. Interactive tool to understand automation risk by task, not just by job title.",
};

export default function TaskVisualizerPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[28px] sm:text-[34px] font-bold text-[var(--foreground)] tracking-tight leading-tight">
          What parts of your job will AI automate?
        </h1>
        <p className="text-[14px] text-[var(--muted)] mt-1.5 max-w-2xl leading-relaxed">
          Click a job title below to see which of your tasks AI will automate first — and which stay human.
          You can also search by name above.{" "}
          <a
            href="/task-visualizer/economy"
            className="text-[var(--accent)] hover:underline font-medium"
          >
            Or see the full US economy view →
          </a>
        </p>
      </header>

      <JobTaskVisualizerWrapper />
    </div>
  );
}
