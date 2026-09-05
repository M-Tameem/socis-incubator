"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
  className,
}: {
  href: Route;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "border-b pb-1 text-muted-foreground hover:text-foreground",
        active ? "border-foreground text-foreground" : "border-transparent",
        className,
      )}
    >
      {children}
    </Link>
  );
}
