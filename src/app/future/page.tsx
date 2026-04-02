import { Metadata } from "next";
import FuturePage from "@/components/future/FuturePage";

export const metadata: Metadata = {
  title: "From Here to There | A Plausible Path Through the AI Transition",
  description:
    "A mechanistic scenario for how AI disruption could resolve into broad-based prosperity — through industrial policy, care economy investment, and material abundance. Every link in the chain is grounded in evidence.",
  alternates: {
    canonical: "/future",
  },
  openGraph: {
    title: "From Here to There | A Plausible Path Through the AI Transition",
    description:
      "A mechanistic scenario for how AI disruption could resolve into broad-based prosperity. Every link in the chain is grounded in evidence.",
    type: "article",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "From Here to There | A Plausible Path Through the AI Transition",
    description:
      "A mechanistic scenario for how AI disruption could resolve into broad-based prosperity. Every link in the chain is grounded in evidence.",
  },
};

export default function FutureRoute() {
  return (
    <main className="px-6 sm:px-10 py-8 sm:py-12 max-w-5xl mx-auto">
      <FuturePage />
    </main>
  );
}
