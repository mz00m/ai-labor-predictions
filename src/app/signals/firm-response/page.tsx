import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Firms Respond to AI Productivity — Reduce, Amplify, or Expand",
  description:
    "AI-driven productivity gains lead firms down three paths: Reduce (same output, fewer workers), Amplify (same team, more output), or Expand (new work, new roles, new markets).",
  openGraph: {
    title: "How Firms Respond to AI Productivity",
    description:
      "Three paths: Reduce headcount, Amplify output, or Expand into new markets. See the research behind each.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Firms Respond to AI Productivity",
    description:
      "Three paths: Reduce headcount, Amplify output, or Expand into new markets.",
  },
};

export default function FirmResponsePage() {
  redirect("/signals#productivity-paths");
}
