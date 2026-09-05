import { NavLink } from "@/components/nav-link";
import { requireProfile } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-4">
        <nav aria-label="Dashboard" className="flex flex-wrap gap-4 text-sm">
          <NavLink href="/dashboard">Overview</NavLink>
          <NavLink href="/dashboard/team">Team</NavLink>
          <NavLink href="/dashboard/proposal">Proposal</NavLink>
          <NavLink href="/dashboard/check-ins">Check-ins</NavLink>
        </nav>

        <form action="/auth/signout" method="post" className="text-sm text-muted-foreground">
          <span className="mr-3">{profile.email}</span>
          <button type="submit" className="underline underline-offset-4 hover:no-underline">
            Sign out
          </button>
        </form>
      </div>

      {children}
    </div>
  );
}
