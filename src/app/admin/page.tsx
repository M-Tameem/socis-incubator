import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ data: applications }, { data: teams }, { data: proposals }, { data: checkIns }] =
    await Promise.all([
      supabase.from("applications").select("status"),
      supabase.from("teams").select("id, name, slug, status, github_url"),
      supabase.from("proposals").select("status"),
      supabase
        .from("check_ins")
        .select("id, cycle, behind_schedule, created_at, teams(name, slug)")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  const count = (status: string) =>
    (applications ?? []).filter((a) => a.status === status).length;

  const stats = [
    ["Applications", applications?.length ?? 0],
    ["Awaiting review", count("submitted") + count("under_review")],
    ["Accepted", count("accepted")],
    ["Waitlisted", count("waitlisted")],
    ["Teams", teams?.length ?? 0],
    [
      "Proposals awaiting review",
      (proposals ?? []).filter((p) => p.status === "submitted").length,
    ],
  ] as const;

  const needsAttention = (teams ?? []).filter(
    (t) => t.status === "behind" || t.status === "inactive" || !t.github_url,
  );

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Program overview</h1>
        <p className="prose-page mt-2 text-muted-foreground">
          Current application, team, proposal, and check-in data. Use the master tracker for
          internal planning.
        </p>
      </div>

      <section>
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Needs attention</h2>
        {needsAttention.length > 0 ? (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {needsAttention.map((team) => (
              <li key={team.id} className="flex flex-wrap items-center gap-3 py-3">
                <Link href="/admin/teams" className="font-medium hover:text-link">
                  {team.name}
                </Link>
                {team.status === "behind" ? <Badge variant="warn">Behind</Badge> : null}
                {team.status === "inactive" ? <Badge variant="bad">Inactive</Badge> : null}
                {!team.github_url ? <Badge variant="outline">No repository</Badge> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">
            No teams are flagged. Every team has a repository and none are marked behind.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold">Recent check-ins</h2>
        {checkIns && checkIns.length > 0 ? (
          <ul className="mt-4 divide-y divide-border border-y border-border text-sm">
            {checkIns.map((c) => {
              const team = c.teams as unknown as { name: string; slug: string } | null;
              return (
                <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                  <span className="font-medium">{team?.name ?? "Unknown team"}</span>
                  <span className="text-muted-foreground">Cycle {c.cycle}</span>
                  <span className="text-muted-foreground">{formatDate(c.created_at)}</span>
                  {c.behind_schedule ? <Badge variant="warn">Behind</Badge> : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">No check-ins submitted yet.</p>
        )}
        <p className="mt-4 text-sm">
          <Link href="/admin/check-ins" className="text-link underline underline-offset-4 hover:no-underline">
            Read all check-ins
          </Link>
        </p>
      </section>
    </div>
  );
}
