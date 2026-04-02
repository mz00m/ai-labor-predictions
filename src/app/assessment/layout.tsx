import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Action Plan | jobsdata.ai",
  description:
    "Find out exactly which parts of your work AI can handle. A personalized, task-by-task action plan for individual workers and small business teams.",
  openGraph: {
    title: "AI Action Plan | jobsdata.ai",
    description:
      "Get your time back with a clear AI plan. Personalized recommendations based on your actual tasks and workflows.",
  },
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="assessment-wrapper min-h-screen bg-[#0B0F1A] text-[#E2E8F0]">
      {/* Premium nav */}
      <nav className="border-b border-white/[0.06] bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[13px] text-[#8B95A5] hover:text-white transition-colors"
            >
              jobsdata.ai
            </Link>
            <span className="text-[#2A3040]">/</span>
            <Link
              href="/assessment"
              className="text-[14px] font-semibold text-white"
            >
              AI Action Plan
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/assessment/dashboard"
              className="text-[13px] text-[#8B95A5] hover:text-white transition-colors"
            >
              My Plans
            </Link>
            <Link
              href="/assessment/start"
              className="text-[13px] font-medium bg-[#5C61F6] hover:bg-[#4F52D4] text-white px-4 py-1.5 rounded-md transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Page content — override the main site's max-w and padding */}
      <main className="!max-w-none !p-0">{children}</main>

      {/* Minimal footer */}
      <footer className="border-t border-white/[0.06] mt-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-[12px] text-[#5A6478]">
            Built on jobsdata.ai research &middot; {new Date().getFullYear()}
          </p>
          <div className="flex gap-6 text-[12px] text-[#5A6478]">
            <Link href="/about" className="hover:text-[#8B95A5] transition-colors">
              About
            </Link>
            <Link href="/methodology" className="hover:text-[#8B95A5] transition-colors">
              Methodology
            </Link>
            <span className="cursor-default">
              Your data processed in-memory only &middot; Nothing stored
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
