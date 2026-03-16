import type { Metadata } from "next";
import DemandElasticityPage from "@/components/demand-elasticity/DemandElasticityPage";

export const metadata: Metadata = {
  title: "Demand Elasticity — When AI Creates More Jobs | jobsdata.ai",
  description:
    "Why making work cheaper can create more jobs, not fewer. The Jevons Paradox applied to AI and labor markets: demand elasticity, historical evidence, and an interactive calculator.",
  openGraph: {
    title: "The Demand Elasticity Effect — jobsdata.ai",
    description:
      "When AI makes work cheaper, who hires more? An interactive explainer on Jevons Paradox and AI labor markets.",
  },
};

export default function Page() {
  return (
    <main className="px-6 sm:px-10 py-8 sm:py-12 max-w-5xl mx-auto">
      <DemandElasticityPage />
    </main>
  );
}
