import type { Metadata } from "next";
import JobTaskVisualizerWrapper from "@/components/task-visualizer/JobTaskVisualizerWrapper";

export const metadata: Metadata = {
  title: "What parts of your job will be cheaper to do with AI?",
  description:
    "Every job is made up of tasks. AI costs are dropping fast, and some of your tasks will be cheaper to do with AI before others. See which ones, and when.",
};

export default function TaskVisualizerPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[28px] sm:text-[34px] font-bold text-[var(--foreground)] tracking-tight leading-tight">
          What parts of your job will be cheaper to do with AI?
        </h1>
        <p className="text-[14px] text-[var(--muted)] mt-1.5 max-w-2xl leading-relaxed">
          Every job is really a bundle of tasks. As AI gets cheaper and more capable,
          some of those tasks will cost less to do with AI than with a person. This tool
          breaks your job into its tasks and shows you which ones face that pressure first,
          which ones stay human for a long time, and how the economics are shifting.
        </p>
      </header>

      <JobTaskVisualizerWrapper />
    </div>
  );
}
