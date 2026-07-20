import { Metadata } from "next";
import { PREDICTION_COUNT, SOURCE_COUNT_DISPLAY } from "@/lib/constants";

const count = PREDICTION_COUNT;

export const metadata: Metadata = {
  title: "AI Labor Market Predictions | jobsdata.ai",
  description: `${count} evidence-weighted predictions tracking AI's impact on jobs, wages, and adoption — built from ${SOURCE_COUNT_DISPLAY} verified sources with transparent tier weighting.`,
  alternates: {
    canonical: "/predictions",
  },
  openGraph: {
    title: "AI Labor Market Predictions",
    description: `${count} evidence-weighted predictions on displacement, wages, and adoption, each traceable to verified sources.`,
    type: "website",
    siteName: "jobsdata.ai",
  },
};

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
