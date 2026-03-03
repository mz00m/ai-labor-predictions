import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PyPI Labor Signal Index — Early Signals of AI Impact",
  description:
    "Tracking AI automation acceleration through PyPI package download trends. The Automation Acceleration Index (AAI) measures how fast AI agent and automation libraries are growing relative to foundational AI packages.",
  openGraph: {
    title: "PyPI Labor Signal Index",
    description:
      "AI automation packages are growing faster than the general AI ecosystem. Track the acceleration in real-time.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
};

export default function SignalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
