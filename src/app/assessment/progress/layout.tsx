import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment In Progress | jobsdata.ai",
  robots: { index: false, follow: false },
};

export default function AssessmentProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
