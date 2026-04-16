import type { Metadata } from "next";
import { Inter, Source_Serif_4, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MainWrapper, { FooterWrapper } from "@/components/MainWrapper";
import Chatbot from "@/components/Chatbot";
import ChatbotBuddy from "@/components/ChatbotBuddy";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";
import { getSourceCount } from "@/lib/search-sources";
import { SOURCE_COUNT_DISPLAY } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/react";
import DelightsWrapper from "@/components/delights/DelightsWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Early Signals of AI Impact | jobsdata.ai",
    template: "%s | jobsdata.ai",
  },
  description:
    `${SOURCE_COUNT_DISPLAY} sources tracking AI's impact on jobs, wages, and adoption. AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they're disappearing.`,
  metadataBase: new URL("https://jobsdata.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Early Signals of AI Impact",
    description:
      `${SOURCE_COUNT_DISPLAY} sources, one pattern: AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they're disappearing.`,
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
      `${SOURCE_COUNT_DISPLAY} sources, one pattern: AI adoption is accelerating, productivity is climbing, and jobs are changing faster than they're disappearing.`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sourceCount = getSourceCount();
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} ${dmSans.variable} ${dmMono.variable}`}>
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
                `Tracking 17 predictions about AI-driven job displacement, wage impacts, and corporate adoption with ${SOURCE_COUNT_DISPLAY} sources filtered by evidence quality.`,
              author: {
                "@type": "Person",
                name: "Matt Zieger",
                url: "https://www.linkedin.com/in/mattzieger",
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
        <DelightsWrapper>
          <Navbar />
          <MainWrapper>
            {children}
          </MainWrapper>
          <Chatbot sourceCount={sourceCount} />
          <ChatbotBuddy sourceCount={sourceCount} />
          <KonamiEasterEgg />
          <Analytics />
          <FooterWrapper>
            <footer className="max-w-6xl mx-auto px-6 sm:px-10 pb-16">
              <div className="pt-10 border-t border-black/[0.06] flex flex-wrap justify-end items-center gap-x-6 gap-y-2 text-base text-[var(--muted)]">
                <a href="/about" className="hover:text-[var(--foreground)] transition-colors">About</a>
                <a href="/methodology" className="hover:text-[var(--foreground)] transition-colors">Methodology</a>
                <a href="/learn/reading-list" className="hover:text-[var(--foreground)] transition-colors">Reading List</a>
                <a href="/research" className="hover:text-[var(--foreground)] transition-colors">Sources</a>
                <a href="/suggest" className="hover:text-[var(--foreground)] transition-colors">Suggest a Source</a>
              </div>
            </footer>
          </FooterWrapper>
        </DelightsWrapper>
      </body>
    </html>
  );
}
