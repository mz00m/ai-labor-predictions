import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AI & Labor Market Predictions",
  description:
    "Track predictions about AI's impact on jobs and wages, with evidence from peer-reviewed research to social media. A weekend vibe coding project by Matt Zieger.",
  openGraph: {
    title: "AI & Labor Market Predictions",
    description:
      "Track predictions about AI's impact on jobs and wages, filtered by evidence quality.",
    type: "website",
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
        <footer className="max-w-6xl mx-auto px-6 sm:px-10 pb-16">
          <div className="pt-10 border-t border-black/[0.06]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-[13px] text-[var(--muted)]">
                Data sourced from prediction markets, academic research, corporate filings, and news.
                Not financial advice.
              </p>
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
