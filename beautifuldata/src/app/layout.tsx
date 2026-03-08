import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beautiful Data — Interactive Data Visualization Studio",
  description:
    "We turn research, policy documents, and corporate data into interactive web experiences that tell stories and drive decisions.",
  openGraph: {
    title: "Beautiful Data",
    description:
      "Interactive data visualization for research & policy organizations.",
    url: "https://beautifuldata.org",
    siteName: "Beautiful Data",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-0 font-sans text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
