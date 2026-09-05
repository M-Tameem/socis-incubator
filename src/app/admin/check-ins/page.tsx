import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Check-ins" };

export default async function AdminCheckInsPage({
  searchParams,
}: {
  searchParams: Promise<{ flagged?: string }>;
}) {
  const { flagged } = await searchParams;
  const supabase = await createClient();

  const { data: all } = await supabase
    .from("check_ins")
    .select("*, teams(name, exec_contact_name)")
    .order("created_at", { ascending: false });

  const checkIns =
    flagged === "1" ? (all ?? []).filter((c) => c.behind_schedule) : (all ?? []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Check-ins</h1>
        <p className="prose-page mt-2 text-muted-foreground">
          Team updates, with delays and requests for help shown first. Executive contacts
          should follow up within two days.
        </p>
      </div>

      <nav className="flex gap-4 text-sm">
        <a
          href="/admin/check-ins"
          className={
            flagged !== "1"
              ? "border-b-2 border-link pb-0.5"
              : "border-b-2 border-transparent pb-0.5 text-muted-foreground hover:text-foreground"
          }
        >
          All
        </a>
        <a
          href="/admin/check-ins?flagged=1"
          className={
            flagged === "1"
              ? "border-b-2 border-link pb-0.5"
              : "border-b-2 border-transparent pb-0.5 text-muted-foreground hover:text-foreground"
          }
        >
          Needs follow-up
        </a>
      </nav>

      {checkIns && checkIns.length > 0 ? (
        <ul className="divide-y divide-border border-y border-border">
          {checkIns.map((c) => {
            const team = c.teams as unknown as {
              name: string;
              exec_contact_name: string | null;
            } | null;
            return (
              <li key={c.id} className="space-y-3 py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-medium">{team?.name}</span>
                  <span className="text-sm text-muted-foreground">Cycle {c.cycle}</span>
                  <span className="text-sm text-muted-foreground">{formatDate(c.created_at)}</span>
                  {c.behind_schedule ? <Badge variant="warn">Behind schedule</Badge> : null}
                  {c.help_needed ? <Badge variant="outline">Asked for help</Badge> : null}
                  {team?.exec_contact_name ? (
                    <span className="ml-auto text-sm text-muted-foreground">
                      Contact: {team.exec_contact_name}
                    </span>
                  ) : null}
                </div>

                <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[9rem_1fr]">
                  <dt className="text-muted-foreground">Completed</dt>
                  <dd className="whitespace-pre-line">{c.completed}</dd>
                  <dt className="text-muted-foreground">In progress</dt>
                  <dd className="whitespace-pre-line">{c.in_progress}</dd>
                  <dt className="text-muted-foreground">Next up</dt>
                  <dd className="whitespace-pre-line">{c.next_up}</dd>
                  {c.blockers ? (
                    <>
                      <dt className="text-muted-foreground">Problems</dt>
                      <dd className="whitespace-pre-line">{c.blockers}</dd>
                    </>
                  ) : null}
                  {c.help_needed ? (
                    <>
                      <dt className="text-muted-foreground">Help needed</dt>
                      <dd className="whitespace-pre-line">{c.help_needed}</dd>
                    </>
                  ) : null}
                </dl>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground">No check-ins yet.</p>
      )}
    </div>
  );
}
