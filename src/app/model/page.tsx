import type { Metadata } from "next";
import CompositeModelPage from "@/components/model/CompositeModelPage";

export const metadata: Metadata = {
  title: "The Composite Displacement Model | jobsdata.ai",
  description:
    "A sector-level engine combining five research-backed dimensions — technical exposure, AI capability, adoption speed, demand elasticity, and friction — into adjustable employment and wage forecasts. Anchored to BTOS Census AI Supplement (2026).",
  openGraph: {
    title: "The Composite Displacement Model | jobsdata.ai",
    description:
      "Adjustable five-dimension model of AI's sector-level employment impact.",
  },
};

export default function Page() {
  return (
    <main className="px-6 sm:px-10 py-8 sm:py-12">
      <CompositeModelPage />
    </main>
  );
}
