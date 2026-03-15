import { Metadata } from "next";
import ProductivityPage from "@/components/productivity/ProductivityPage";

export const metadata: Metadata = {
  title: "AI & Productivity | What the Research Says",
  description:
    "A comprehensive explainer connecting AI productivity research, economist forecasts, and what it all means for jobs. 18+ studies, 12 economist predictions, three pathways from productivity to labor markets.",
  alternates: {
    canonical: "/productivity",
  },
  openGraph: {
    title: "AI & Productivity | What the Research Says",
    description:
      "18+ micro studies show 14-56% individual gains. BLS data hints at macro impact. 12 economists weigh in on what comes next. Here's how productivity connects to jobs.",
    type: "article",
    siteName: "jobsdata.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI & Productivity | What the Research Says",
    description:
      "18+ micro studies show 14-56% individual gains. BLS data hints at macro impact. 12 economists weigh in on what comes next.",
  },
};

export default function ProductivityRoute() {
  return <ProductivityPage />;
}
