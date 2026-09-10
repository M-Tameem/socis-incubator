import { NavLink } from "@/components/nav-link";
import { requireExec } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireExec();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-4">
        <nav aria-label="Admin" className="flex flex-wrap gap-4 text-sm">
          <NavLink href="/admin">Overview</NavLink>
          <NavLink href="/admin/applications">Applications</NavLink>
          <NavLink href="/admin/teams">Teams</NavLink>
          <NavLink href="/admin/check-ins">Check-ins</NavLink>
          <NavLink href="/admin/events">Events</NavLink>
          <NavLink href="/admin/moderation">Moderation</NavLink>
          <NavLink href="/admin/settings">Settings</NavLink>
        </nav>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>
      {children}
    </div>
  );
}
