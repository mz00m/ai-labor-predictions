import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "AI Impact Early Warning Indicators",
  description:
    "Track predictions about AI's impact on jobs and wages, with evidence from working papers to social media. A weekend vibe coding project by Matt Zieger.",
  metadataBase: new URL("https://labor.mattzieger.com"),
  openGraph: {
    title: "AI Impact Early Warning Indicators",
    description:
      "15 predictions tracking AI-driven job displacement, wage impacts, and corporate adoption — filtered by evidence quality from working papers to social media.",
    type: "website",
    siteName: "AI Impact Early Warning Indicators",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Impact Early Warning Indicators",
    description:
      "15 predictions tracking AI-driven job displacement, wage impacts, and corporate adoption — filtered by evidence quality.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[var(--foreground)] antialiased">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
          {children}
        </main>
        <Analytics />
        <footer className="max-w-6xl mx-auto px-6 sm:px-10 pb-16">
          <div className="pt-10 border-t border-black/[0.06]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[13px] text-[var(--muted)] italic">
                  This dashboard was built by an AI, about AI taking jobs, hosted on servers run by AI.
                  If that doesn&apos;t make you laugh nervously, nothing will.
                </p>
                <p className="text-[13px] text-[var(--muted)]">
                  Data sourced from prediction markets, academic research, corporate filings, and news.
                  Not financial advice. Not career advice. Definitely not a reason to panic. (Probably.)
                </p>
              </div>
              <span className="text-[13px] text-[var(--muted)]">
                A weekend vibe coding project by{" "}
                <a
                  href="https://www.linkedin.com/in/mattzieger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--foreground)]"
                >
                  Matt Zieger
                </a>
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
