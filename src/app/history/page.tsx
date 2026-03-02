import { Metadata } from "next";
import HistoryPage from "@/components/history/HistoryPage";

export const metadata: Metadata = {
  title: "On Tap Intelligence — What History Tells Us About AI and Work",
  description:
    "Lessons from four industrial revolutions — steam, combustion, electricity, and computers — that provide historical context for understanding AI's labor market impact.",
  openGraph: {
    title: "On Tap Intelligence — What History Tells Us About AI and Work",
    description:
      "Every great technology has transformed work. Here's what history tells us about what comes next.",
    type: "article",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "On Tap Intelligence — What History Tells Us About AI and Work",
    description:
      "Every great technology has transformed work. Here's what history tells us about what comes next.",
  },
};

export default function HistoryPageRoute() {
  return <HistoryPage />;
}
