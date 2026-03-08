import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beautiful Data — Interactive Data Visualization for Research & Policy",
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
      <body
        className={`${inter.className} bg-gray-950 text-gray-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
