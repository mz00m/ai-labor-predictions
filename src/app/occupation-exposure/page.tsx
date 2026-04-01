import type { Metadata } from "next";
import OccupationExposurePage from "@/components/occupation-exposure/OccupationExposurePage";

export const metadata: Metadata = {
  title:
    "Beyond Exposure: Multi-Dimensional AI Displacement Risk | jobsdata.ai",
  description:
    "AI exposure alone doesn't predict job displacement. This tool scores 342 BLS occupations across 5 research-backed dimensions: technical exposure, adoption speed, worker adaptability, demand elasticity, and AI complementarity.",
  openGraph: {
    title: "Beyond Exposure | jobsdata.ai",
    description:
      "Why AI exposure scores alone get displacement wrong. A 5-dimensional framework for understanding AI's real labor market impact.",
  },
};

export default function Page() {
  return (
    <main className="px-6 sm:px-10 py-8 sm:py-12">
      <OccupationExposurePage />
    </main>
  );
}
