import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Early Signals of AI Impact",
  description:
    "Track predictions about AI's impact on jobs and wages, with evidence from working papers to social media. A weekend vibe coding project by Matt Zieger.",
  metadataBase: new URL("https://labor.mattzieger.com"),
  openGraph: {
    title: "Early Signals of AI Impact",
    description:
      "15 predictions tracking AI-driven job displacement, wage impacts, and corporate adoption — filtered by evidence quality from working papers to social media.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Early Signals of AI Impact",
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
                <p className="text-[13px] text-[var(--muted)]">
                  Personal project, not affiliated with my day job. Not sponsored and definitely not perfect.
                  Data sourced from academic research, corporate filings, news sources and any other reputable source I can find.
                  Not financial advice. Not career advice. Please don&apos;t sue me.
                  Please share ideas on how to improve:{" "}
                  <a href="https://www.linkedin.com/in/mattzieger" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">LinkedIn</a>
                  {" "}/{" "}
                  <a href="https://x.com/mattzieger" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">X</a>
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
