import { Metadata } from "next";
import { SOURCE_COUNT_DISPLAY } from "@/lib/constants";
import ResearchPage from "@/components/research/ResearchPage";

export const metadata: Metadata = {
  title: "All Sources | jobsdata.ai Research Library",
  description:
    `Browse all ${SOURCE_COUNT_DISPLAY} verified sources powering jobsdata.ai predictions. Searchable, filterable by evidence tier, and sorted by date.`,
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "All Sources | jobsdata.ai Research Library",
    description:
      `Browse all ${SOURCE_COUNT_DISPLAY} verified sources powering jobsdata.ai predictions. Searchable and filterable by evidence tier.`,
    type: "website",
    siteName: "jobsdata.ai",
  },
};

export default function ResearchRoute() {
  return <ResearchPage />;
}
