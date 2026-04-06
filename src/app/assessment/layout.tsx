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
    <div className="assessment-wrapper min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors"
            >
              jobsdata.ai
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href="/assessment"
              className="text-[14px] font-semibold text-gray-900"
            >
              AI Action Plan
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/assessment/methodology"
              className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/assessment/dashboard"
              className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors"
            >
              My Plans
            </Link>
            <Link
              href="/assessment/start"
              className="text-[13px] font-medium text-gray-500 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-4 py-1.5 rounded-md transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="!max-w-none !p-0">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-[12px] text-gray-400">
            Built on jobsdata.ai research &middot; {new Date().getFullYear()}
          </p>
          <div className="flex gap-6 text-[12px] text-gray-400">
            <Link href="/about" className="hover:text-gray-600 transition-colors">
              About
            </Link>
            <Link href="/methodology" className="hover:text-gray-600 transition-colors">
              Methodology
            </Link>
            <span className="cursor-default">
              Uploaded files processed in-memory only &middot; Reports verified by email
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
