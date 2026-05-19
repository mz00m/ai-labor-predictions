import type { Metadata } from "next";
import BudgetPlannerPage from "@/components/model/BudgetPlannerPage";

export const metadata: Metadata = {
  title: "Workforce Budget Planner | jobsdata.ai",
  description:
    "Given a region and a budget, the planner recommends a portfolio of real workforce policies that maximizes net regional jobs while covering as many framework categories as possible. Greedy gap-aware optimizer over the policy catalog.",
  openGraph: {
    title: "Workforce Budget Planner | jobsdata.ai",
    description:
      "How should we spend $10M in this region? An evidence-anchored policy portfolio.",
  },
};

export default function Page() {
  return (
    <main className="px-6 sm:px-10 py-8 sm:py-12">
      <BudgetPlannerPage />
    </main>
  );
}
