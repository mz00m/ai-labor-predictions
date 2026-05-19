import type { Metadata } from "next";
import PolicyAnalysisPage from "@/components/model/PolicyAnalysisPage";

export const metadata: Metadata = {
  title: "Workforce Policy Diagnostic | jobsdata.ai",
  description:
    "Review a model workforce policy against actual regional sector employment data. Surfaces where the policy meets the workforce's needs post-AI and where the gaps are. Every recommendation cites the underlying parameter, shows what would change the assessment, and reports a robustness band.",
  openGraph: {
    title: "Workforce Policy Diagnostic | jobsdata.ai",
    description:
      "Pick a region, a scenario, and a policy. Get a guidance document for policymakers.",
  },
};

export default function Page() {
  return (
    <main className="px-6 sm:px-10 py-8 sm:py-12">
      <PolicyAnalysisPage />
    </main>
  );
}
