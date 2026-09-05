import Link from "next/link";
import type { Metadata } from "next";
import { requireProfile, getMyTeam } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { Alert } from "@/components/ui/alert";
import { CHECK_IN_QUESTIONS } from "@/lib/program";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await requireProfile();
  const team = await getMyTeam();
  const supabase = await createClient();
  const settings = await getSettings();

  const { data: application } = await supabase
    .from("applications")
    .select("status, created_at")
    .eq("email", profile.email)
    .maybeSingle();

  const { data: proposal } = team
    ? await supabase.from("proposals").select("status").eq("team_id", team.id).maybeSingle()
    : { data: null };

  const { data: checkIns } = team
    ? await supabase
        .from("check_ins")
        .select("cycle, created_at, behind_schedule")
        .eq("team_id", team.id)
        .order("cycle", { ascending: false })
    : { data: [] };

  const latest = checkIns?.[0];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {profile.full_name ? `Hi, ${profile.full_name.split(" ")[0]}` : "Your dashboard"}
        </h1>
        <p className="prose-page mt-2 text-muted-foreground">
          View your team, proposal, and check-ins here.
        </p>
      </div>

      {!team ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Your application</h2>
          {application ? (
            <div className="rounded-md border border-border p-5">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={application.status} />
                <span className="text-sm text-muted-foreground">
                  Submitted {formatDate(application.created_at)}
                </span>
              </div>
              <p className="prose-page mt-3 text-muted-foreground">
                {application.status === "accepted"
                  ? "You are in. Your team will appear here once placement is finished."
                  : application.status === "waitlisted"
                    ? "You are on the waitlist. Spots often open in the first two weeks, and we will email you if one does."
                    : application.status === "declined"
                      ? "We could not offer you a spot this semester. Workshops and events are still open to you."
                      : "We are reviewing applications and will email you once teams are placed" +
                        (settings.teams_announced ? ` on ${formatDate(settings.teams_announced)}.` : ".")}
              </p>
            </div>
          ) : (
            <Alert>
              We could not find an application for {profile.email}.{" "}
              <Link href="/apply" className="underline underline-offset-4">
                Apply to the incubator
              </Link>{" "}
              or email us if you applied with a different address.
            </Alert>
          )}
        </section>
      ) : (
        <>
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{team.name}</h2>
              <StatusBadge status={team.status} />
            </div>

            <dl className="divide-y divide-border border-y border-border text-sm">
              <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="text-muted-foreground">Executive contact</dt>
                <dd>
                  {team.exec_contact_name ? (
                    <>
                      {team.exec_contact_name}
                      {team.exec_contact_email ? (
                        <>
                          {" · "}
                          <a
                            href={`mailto:${team.exec_contact_email}`}
                            className="text-link underline underline-offset-4 hover:no-underline"
                          >
                            {team.exec_contact_email}
                          </a>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Being assigned</span>
                  )}
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="text-muted-foreground">Repository</dt>
                <dd>
                  {team.github_url ? (
                    <a
                      href={team.github_url}
                      className="text-link underline underline-offset-4 hover:no-underline"
                    >
                      {team.github_url.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">
                      Not added yet. Add it on your{" "}
                      <Link href="/dashboard/team" className="underline underline-offset-4">
                        team page
                      </Link>
                    </span>
                  )}
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="text-muted-foreground">Proposal</dt>
                <dd>
                  {proposal ? (
                    <StatusBadge status={proposal.status} />
                  ) : (
                    <Link href="/dashboard/proposal" className="text-link underline underline-offset-4">
                      Not started
                    </Link>
                  )}
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="text-muted-foreground">Latest check-in</dt>
                <dd>
                  {latest ? (
                    <>
                      Cycle {latest.cycle}, {formatDate(latest.created_at)}
                      {latest.behind_schedule ? " · flagged as behind" : ""}
                    </>
                  ) : (
                    <span className="text-muted-foreground">None submitted yet</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">What is due from you</h2>
            <ul className="prose-page list-disc space-y-2 pl-5 text-muted-foreground">
              {!proposal || proposal.status !== "approved" ? (
                <li>
                  <Link href="/dashboard/proposal" className="text-link underline underline-offset-4">
                    Submit or update your project proposal
                  </Link>
                  {settings.proposals_due ? ` · due ${formatDate(settings.proposals_due)}` : ""}
                </li>
              ) : null}
              <li>
                <Link href="/dashboard/check-ins" className="text-link underline underline-offset-4">
                  A check-in every two weeks
                </Link>{" "}
                answering: {CHECK_IN_QUESTIONS.slice(0, 3).join(" ").toLowerCase()}
              </li>
              {settings.demo_day_date ? (
                <li>Demo Day is {formatDate(settings.demo_day_date)}. Presenting is required.</li>
              ) : null}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
