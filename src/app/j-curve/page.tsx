import { Metadata } from "next";
import JCurvePage from "@/components/j-curve/JCurvePage";

export const metadata: Metadata = {
  title: "The Productivity J-Curve | Why AI's Impact Hasn't Shown Up Yet",
  description:
    "New technologies often make productivity look worse before making it better. This visual explainer breaks down the J-Curve framework from Brynjolfsson, Rock & Syverson, and what it means for AI.",
  alternates: {
    canonical: "/j-curve",
  },
  openGraph: {
    title: "The Productivity J-Curve | Why AI's Impact Hasn't Shown Up Yet",
    description:
      "New technologies often make productivity look worse before making it better. A visual explainer of the J-Curve framework.",
    type: "article",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Productivity J-Curve | Why AI's Impact Hasn't Shown Up Yet",
    description:
      "New technologies often make productivity look worse before making it better. A visual explainer of the J-Curve framework.",
  },
};

export default function JCurveRoute() {
  return (
    <main className="px-6 sm:px-10 py-8 sm:py-12 max-w-5xl mx-auto">
      <JCurvePage />
    </main>
  );
}
