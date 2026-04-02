"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AssessmentNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex items-center gap-1 text-[13px]">
      <NavLink href="/assessment" active={isActive("/assessment")}>
        Overview
      </NavLink>
      <NavLink href="/assessment/start" active={isActive("/assessment/start")}>
        New Assessment
      </NavLink>
      <NavLink href="/assessment/dashboard" active={isActive("/assessment/dashboard")}>
        My Reports
      </NavLink>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md transition-colors ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-[#8B95A5] hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      {children}
    </Link>
  );
}
