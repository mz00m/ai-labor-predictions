"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAssessment = pathname.startsWith("/assessment");
  // /map ships its own full-width layout so the regional explorer can render
  // edge-to-edge. The page's downstream sections are constrained internally.
  const isMap = pathname.startsWith("/map");

  if (isAssessment || isMap) {
    return <>{children}</>;
  }

  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-10 py-16">
      {children}
    </main>
  );
}

export function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/assessment")) return null;
  return <>{children}</>;
}
