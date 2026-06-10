import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Action Plans | jobsdata.ai",
  robots: { index: false, follow: false },
};

export default function AssessmentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
