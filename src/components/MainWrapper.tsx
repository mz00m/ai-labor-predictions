"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAssessment = pathname.startsWith("/assessment");

  if (isAssessment) {
    return <>{children}</>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
      {children}
    </main>
  );
}

export function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/assessment")) return null;
  return <>{children}</>;
}
