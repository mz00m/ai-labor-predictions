import type { Metadata } from "next";
import PortfolioBuilderPage from "@/components/model/PortfolioBuilderPage";

export const metadata: Metadata = {
  title: "Workforce Policy Portfolio Builder | jobsdata.ai",
  description:
    "Stack policies from the catalog at custom funding levels and see the combined regional workforce impact. Manual allocation across the Windfall Trust Policy Atlas of labor market adaptation interventions.",
  openGraph: {
    title: "Workforce Policy Portfolio Builder | jobsdata.ai",
    description:
      "Build your own policy portfolio. Allocate $ across multiple interventions. See combined impact in real time.",
  },
};

export default function Page() {
  return (
    <main className="px-6 sm:px-10 py-8 sm:py-12">
      <PortfolioBuilderPage />
    </main>
  );
}
