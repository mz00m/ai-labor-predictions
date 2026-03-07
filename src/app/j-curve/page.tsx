import { Metadata } from "next";
import JCurvePage from "@/components/j-curve/JCurvePage";

export const metadata: Metadata = {
  title: "The Productivity J-Curve — Why AI's Impact Hasn't Shown Up Yet",
  description:
    "New technologies often make productivity look worse before making it better. This visual explainer breaks down the J-Curve framework from Brynjolfsson, Rock & Syverson — and what it means for AI.",
  openGraph: {
    title: "The Productivity J-Curve — Why AI's Impact Hasn't Shown Up Yet",
    description:
      "New technologies often make productivity look worse before making it better. A visual explainer of the J-Curve framework.",
    type: "article",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Productivity J-Curve — Why AI's Impact Hasn't Shown Up Yet",
    description:
      "New technologies often make productivity look worse before making it better. A visual explainer of the J-Curve framework.",
  },
};

export default function JCurveRoute() {
  return <JCurvePage />;
}
