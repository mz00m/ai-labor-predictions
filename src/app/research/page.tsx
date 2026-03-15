import { Metadata } from "next";
import ResearchPage from "@/components/research/ResearchPage";

export const metadata: Metadata = {
  title: "All Sources | jobsdata.ai Research Library",
  description:
    "Browse all 410+ verified sources powering jobsdata.ai predictions. Searchable, filterable by evidence tier, and sorted by date.",
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "All Sources | jobsdata.ai Research Library",
    description:
      "Browse all 410+ verified sources powering jobsdata.ai predictions. Searchable and filterable by evidence tier.",
    type: "website",
    siteName: "jobsdata.ai",
  },
};

export default function ResearchRoute() {
  return <ResearchPage />;
}
