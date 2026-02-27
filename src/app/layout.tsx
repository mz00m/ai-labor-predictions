import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Early Signals of AI Impact",
  description:
    "300+ sources tracking AI's impact on jobs, wages, and adoption. AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they're disappearing.",
  metadataBase: new URL("https://jobsdata.org"),
  openGraph: {
    title: "Early Signals of AI Impact",
    description:
      "300+ sources, one pattern: AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they're disappearing.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Early Signals of AI Impact",
    description:
      "300+ sources, one pattern: AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they're disappearing.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Early Signals of AI Impact",
              url: "https://jobsdata.org",
              description:
                "Tracking 17 predictions about AI-driven job displacement, wage impacts, and corporate adoption with 300+ sources filtered by evidence quality.",
              author: {
                "@type": "Person",
                name: "Matt Zieger",
                url: "https://linkedin.com/in/mattzieger",
                jobTitle: "Chief Program & Partnership Officer",
                worksFor: {
                  "@type": "Organization",
                  name: "GitLab Foundation",
                },
              },
              mainEntity: {
                "@type": "Dataset",
                name: "AI Labor Market Impact Predictions",
                description:
                  "A curated dataset of predictions about AI's impact on the labor market, sourced from peer-reviewed research, government data, think tanks, corporate filings, and journalism.",
                url: "https://jobsdata.org",
                license: "https://creativecommons.org/licenses/by/4.0/",
                keywords: [
                  "artificial intelligence",
                  "labor market",
                  "job displacement",
                  "wages",
                  "AI adoption",
                  "workforce",
                  "economic impact",
                  "automation",
                ],
                variableMeasured: [
                  "Job displacement rate",
                  "Wage impact",
                  "AI adoption rate",
                  "Earnings call AI mentions",
                  "Workforce AI exposure",
                ],
                temporalCoverage: "2023/..",
                spatialCoverage: "United States",
              },
            }),
          }}
        />
      </head>
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
