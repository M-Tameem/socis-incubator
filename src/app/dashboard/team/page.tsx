import type { Metadata } from "next";
import { getMyTeam } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TeamForm } from "@/app/dashboard/team/team-form";
import { StatusBadge } from "@/components/status-badge";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Your team" };

export default async function TeamPage() {
  const team = await getMyTeam();

  if (!team) {
    return (
      <Alert>
        You are not on a team yet. Teams are placed after applications close, and yours will
        show up here.
      </Alert>
    );
  }

  const supabase = await createClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("role_on_team, is_lead, profiles(full_name, email, github_url, year)")
    .eq("team_id", team.id);

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{team.name}</h1>
        <StatusBadge status={team.status} />
      </div>

      <section>
        <h2 className="text-lg font-semibold">Members</h2>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {(members ?? []).map((m, i) => {
            const p = m.profiles as unknown as {
              full_name: string | null;
              email: string;
              github_url: string | null;
              year: string | null;
            } | null;
            return (
              <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3">
                <span className="font-medium">{p?.full_name ?? p?.email}</span>
                {m.is_lead ? <span className="text-sm text-muted-foreground">Team lead</span> : null}
                {m.role_on_team ? (
                  <span className="text-sm text-muted-foreground">{m.role_on_team}</span>
                ) : null}
                {p?.github_url ? (
                  <a
                    href={p.github_url}
                    className="text-sm text-link underline underline-offset-4 hover:no-underline"
                  >
                    GitHub
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Membership changes go through your executive contact.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Project details</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          {team.isLead
            ? "This copy appears on the public project page and at Demo Day. Write it for people outside your team."
            : "Your team lead can edit these. Ask them if something needs changing."}
        </p>

        <div className="mt-6">
          <TeamForm team={team} canEdit={team.isLead} />
        </div>
      </section>
    </div>
  );
}
