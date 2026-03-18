import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import ChatbotBuddy from "@/components/ChatbotBuddy";
import FooterStats from "@/components/FooterStats";
import { getSourceCount } from "@/lib/search-sources";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "Early Signals of AI Impact | jobsdata.ai",
    template: "%s | jobsdata.ai",
  },
  description:
    "400+ sources tracking AI's impact on jobs, wages, and adoption. AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they're disappearing.",
  metadataBase: new URL("https://jobsdata.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Early Signals of AI Impact",
    description:
      "400+ sources, one pattern: AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they're disappearing.",
    type: "website",
    siteName: "Early Signals of AI Impact",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@mattzieger",
    creator: "@mattzieger",
    title: "Early Signals of AI Impact",
    description:
      "400+ sources, one pattern: AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they're disappearing.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sourceCount = getSourceCount();
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
              url: "https://jobsdata.ai",
              description:
                "Tracking 17 predictions about AI-driven job displacement, wage impacts, and corporate adoption with 400+ sources filtered by evidence quality.",
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
                url: "https://jobsdata.ai",
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
        <Chatbot sourceCount={sourceCount} />
        <ChatbotBuddy sourceCount={sourceCount} />
        <Analytics />
        <footer className="max-w-6xl mx-auto px-6 sm:px-10 pb-16">
          <div className="pt-10 border-t border-black/[0.06] space-y-4">
            <FooterStats />
            <p className="text-[13px] text-[var(--muted)]">
              Data drawn from hundreds of sources (academic research, government statistics, corporate
              filings, journalism, and expert opinion) all able to be reviewed and filtered by you.
              Aggregate figures reflect my independent analysis{" "}
              (<a href="/about" className="underline hover:text-[var(--foreground)]">methodology</a>).
            </p>
            <p className="text-[13px] text-[var(--muted)]">
              Nothing here is investment or career advice. This project is unaffiliated with my
              employer. Corrections and ideas welcome:{" "}
              <a href="https://www.linkedin.com/in/mattzieger" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">LinkedIn</a>
              {" "}/{" "}
              <a href="https://x.com/mattzieger" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">X</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
