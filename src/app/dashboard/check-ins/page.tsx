import type { Metadata } from "next";
import { getMyTeam } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CheckInForm } from "@/app/dashboard/check-ins/check-in-form";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Check-ins" };

export default async function CheckInsPage() {
  const team = await getMyTeam();

  if (!team) {
    return <Alert>Check-ins start once you are placed on a team.</Alert>;
  }

  const supabase = await createClient();
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("*")
    .eq("team_id", team.id)
    .order("cycle", { ascending: false });

  const nextCycle = (checkIns?.[0]?.cycle ?? 0) + 1;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Check-ins</h1>
        <p className="prose-page mt-3 text-muted-foreground">
          Submit one short team update every two weeks. Any member can do it. Flag delays while
          there is time to adjust the plan.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">New check-in</h2>
        <div className="mt-5">
          <CheckInForm teamId={team.id} cycle={nextCycle} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Past check-ins</h2>
        {checkIns && checkIns.length > 0 ? (
          <ol className="mt-5 divide-y divide-border border-y border-border">
            {checkIns.map((c) => (
              <li key={c.id} className="space-y-3 py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-medium">Cycle {c.cycle}</span>
                  <span className="text-sm text-muted-foreground">{formatDate(c.created_at)}</span>
                  {c.behind_schedule ? <Badge variant="warn">Behind schedule</Badge> : null}
                </div>
                <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[10rem_1fr]">
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
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-muted-foreground">
            No check-ins yet. The first is due two weeks after development
            starts.
          </p>
        )}
      </section>
    </div>
  );
}
