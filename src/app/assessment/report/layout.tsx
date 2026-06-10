import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your AI Action Plan | jobsdata.ai",
  robots: { index: false, follow: false },
};

export default function AssessmentReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
