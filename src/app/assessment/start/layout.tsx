import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Your AI Assessment | jobsdata.ai",
  description:
    "A 5-step intake to map where AI fits your actual work: organization, role, tasks, and goals. Takes about 10 minutes; produces a personalized action plan.",
  alternates: {
    canonical: "/assessment/start",
  },
};

export default function AssessmentStartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
