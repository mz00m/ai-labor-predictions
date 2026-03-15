import { Metadata } from "next";
import { Suspense } from "react";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare Predictions | jobsdata.ai",
  description:
    "Compare AI labor market predictions side-by-side. Select sectors, wage impacts, and adoption metrics to see how they stack up.",
  openGraph: {
    title: "Compare AI Labor Predictions | jobsdata.ai",
    description:
      "Side-by-side comparison of AI displacement, wage, and adoption predictions.",
    type: "website",
    siteName: "jobsdata.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare AI Labor Predictions | jobsdata.ai",
    description:
      "Side-by-side comparison of AI displacement, wage, and adoption predictions.",
  },
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[var(--muted)]">Loading...</div>}>
      <CompareClient />
    </Suspense>
  );
}
