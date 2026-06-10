import { Metadata } from "next";
import { SOURCE_COUNT_DISPLAY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Assessment Methodology | jobsdata.ai",
  description: `How the AI action plan is built: ${SOURCE_COUNT_DISPLAY} verified research sources, 64 evaluated tools, and a 4-step analysis pipeline — with scoring, limitations, and privacy practices documented.`,
  alternates: {
    canonical: "/assessment/methodology",
  },
  openGraph: {
    title: "Assessment Methodology",
    description:
      "What's behind the AI action plan: research foundation, tool evaluation, scoring, and limitations.",
    type: "website",
    siteName: "jobsdata.ai",
  },
};

export default function AssessmentMethodologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
