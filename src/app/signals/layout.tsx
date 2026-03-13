import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Automation Signals — Where is AI Automation Heading?",
  description:
    "Track AI automation acceleration across 6 industries by monitoring open-source package downloads and BLS employment data. Like construction permits for the AI economy.",
  alternates: {
    canonical: "/signals",
  },
  openGraph: {
    title: "AI Automation Signals",
    description:
      "Where is AI automation heading? Track tool adoption and employment trends across Software, Legal, Finance, Healthcare, Creative, and Office industries.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation Signals | Where is AI Automation Heading?",
    description:
      "Track tool adoption and employment trends across Software, Legal, Finance, Healthcare, Creative, and Office industries.",
  },
};

export default function SignalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
