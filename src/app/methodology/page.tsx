import { Metadata } from "next";
import MethodologyPage from "@/components/methodology/MethodologyPage";
import { getSourceCount } from "@/lib/search-sources";

export const metadata: Metadata = {
  title: "Methodology | How jobsdata.ai Works",
  description:
    "Complete methodology: evidence tiers, weighted averages, 5-dimensional displacement risk, proxy metrics, signal data, and known limitations. Every number on this site traces back to a cited source.",
  alternates: {
    canonical: "/methodology",
  },
  openGraph: {
    title: "Methodology | How jobsdata.ai Works",
    description:
      "Complete methodology for jobsdata.ai: evidence tiers, weighted averages, displacement risk framework, proxy metrics, and known limitations.",
    type: "article",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Methodology | How jobsdata.ai Works",
    description:
      "Complete methodology for jobsdata.ai: evidence tiers, weighted averages, displacement risk framework, proxy metrics, and known limitations.",
  },
};

export default function MethodologyRoute() {
  return <MethodologyPage sourceCount={getSourceCount()} />;
}
