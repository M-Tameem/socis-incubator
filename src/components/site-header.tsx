import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { NavLink } from "@/components/nav-link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDemoRole } from "@/lib/demo";
import { JellyfishMark } from "@/components/jellyfish-mark";

const NAV = [
  { href: "/about", label: "How it works" },
  { href: "/ideas", label: "Ideas" },
  { href: "/timeline", label: "Timeline" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "Projects" },
  { href: "/resources", label: "Resources" },
  { href: "/demo-day", label: "Demo Day" },
  { href: "/faq", label: "FAQ" },
] as const;

export async function SiteHeader() {
  const [profile, demoRole] = await Promise.all([getProfile(), getDemoRole()]);
  const isExec = profile?.role === "exec" || profile?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 sm:flex-nowrap sm:px-7 sm:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight">
          <JellyfishMark className="size-9 shrink-0 text-brand" />
          <span>SOCIS Incubator</span>
        </Link>

        <nav aria-label="Main" className="ml-2 hidden items-center gap-4 text-sm lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 text-sm">
          <ThemeToggle />
          {profile ? (
            <>
              {demoRole ? (
                <NavLink href={demoRole === "exec" ? "/demo/exec" : "/demo/student"}>Demo</NavLink>
              ) : (
                <>
                  {isExec ? <NavLink href="/admin">Admin</NavLink> : null}
                  <NavLink href="/dashboard">Dashboard</NavLink>
                </>
              )}
            </>
          ) : (
            <>
              <NavLink href="/login">Sign in</NavLink>
              <Button asChild size="sm">
                <Link href="/apply">Apply</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <nav
        aria-label="Main mobile"
        className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-5 pb-3 text-sm lg:hidden"
      >
        {NAV.map((item) => (
          <NavLink key={item.href} href={item.href} className="shrink-0">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
