import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createTeam,
  updateTeamAdmin,
  addTeamMember,
  reviewProposal,
} from "@/app/admin/teams/actions";
import type { TeamStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Teams" };

const TEAM_STATUSES: TeamStatus[] = ["forming", "active", "behind", "inactive", "completed"];

export default async function AdminTeamsPage() {
  const supabase = await createClient();

  const { data: teams } = await supabase
    .from("teams")
    .select("*, team_members(is_lead, role_on_team, profiles(full_name, email)), proposals(*)")
    .order("name");

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
        <p className="prose-page mt-2 text-muted-foreground">
          Create teams, assign executive contacts, review proposals, and mark projects for the
          public showcase. Students must sign in once before they can be added to a team.
        </p>
      </div>

      <section className="rounded-md border border-border p-5">
        <h2 className="font-semibold">New team</h2>
        <form action={createTeam} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label htmlFor="new-team-name" className="text-sm font-medium">
              Team name
            </label>
            <Input id="new-team-name" name="name" required className="w-56" />
          </div>
          <div className="space-y-1">
            <label htmlFor="new-team-exec" className="text-sm font-medium">
              Executive contact
            </label>
            <Input id="new-team-exec" name="exec_contact_name" className="w-48" />
          </div>
          <div className="space-y-1">
            <label htmlFor="new-team-exec-email" className="text-sm font-medium">
              Contact email
            </label>
            <Input id="new-team-exec-email" name="exec_contact_email" type="email" className="w-56" />
          </div>
          <Button type="submit">Create team</Button>
        </form>
      </section>

      {teams && teams.length > 0 ? (
        <ul className="space-y-10">
          {teams.map((team) => {
            const members = (team.team_members ?? []) as unknown as {
              is_lead: boolean;
              role_on_team: string | null;
              profiles: { full_name: string | null; email: string } | null;
            }[];
            const proposal = (Array.isArray(team.proposals) ? team.proposals[0] : team.proposals) as
              | { status: string; mvp_scope: string; problem: string; feedback: string | null }
              | undefined;

            return (
              <li key={team.id} className="space-y-6 border-t border-border pt-8">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">{team.name}</h2>
                  <StatusBadge status={team.status} />
                  {proposal ? <StatusBadge status={proposal.status} /> : null}
                  {team.showcased ? (
                    <span className="text-sm text-muted-foreground">Public</span>
                  ) : null}
                </div>

                <div className="text-sm">
                  <p className="text-muted-foreground">Members</p>
                  <ul className="mt-2">
                    {members.length > 0 ? (
                      members.map((m, i) => (
                        <li key={i}>
                          {m.profiles?.full_name ?? m.profiles?.email}
                          {m.is_lead ? " · lead" : ""}
                          {m.role_on_team ? ` · ${m.role_on_team}` : ""}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">No members yet</li>
                    )}
                  </ul>
                </div>

                <form action={addTeamMember} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="team_id" value={team.id} />
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Add member by email</label>
                    <Input name="email" type="email" required className="w-64" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Role</label>
                    <Input name="role_on_team" placeholder="Backend" className="w-40" />
                  </div>
                  <label className="flex items-center gap-2 pb-2 text-sm">
                    <input type="checkbox" name="is_lead" className="h-4 w-4 rounded border-input" />
                    Team lead
                  </label>
                  <Button type="submit" size="sm" variant="outline">
                    Add
                  </Button>
                </form>

                <form action={updateTeamAdmin} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={team.id} />
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Status</label>
                    <Select name="status" defaultValue={team.status} className="w-36">
                      {TEAM_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Exec contact</label>
                    <Input
                      name="exec_contact_name"
                      defaultValue={team.exec_contact_name ?? ""}
                      className="w-40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Contact email</label>
                    <Input
                      name="exec_contact_email"
                      type="email"
                      defaultValue={team.exec_contact_email ?? ""}
                      className="w-56"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Demo Day slot</label>
                    <Input
                      name="demo_day_slot"
                      placeholder="6:15 pm"
                      defaultValue={team.demo_day_slot ?? ""}
                      className="w-32"
                    />
                  </div>
                  <label className="flex items-center gap-2 pb-2 text-sm">
                    <input
                      type="checkbox"
                      name="showcased"
                      defaultChecked={team.showcased}
                      className="h-4 w-4 rounded border-input"
                    />
                    Show publicly
                  </label>
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </form>

                {proposal ? (
                  <div className="space-y-3 rounded-md border border-border p-5">
                    <h3 className="font-medium">Proposal</h3>
                    <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[8rem_1fr]">
                      <dt className="text-muted-foreground">Problem</dt>
                      <dd className="whitespace-pre-line">{proposal.problem}</dd>
                      <dt className="text-muted-foreground">MVP</dt>
                      <dd className="whitespace-pre-line">{proposal.mvp_scope}</dd>
                    </dl>

                    <form action={reviewProposal} className="space-y-3 pt-2">
                      <input type="hidden" name="team_id" value={team.id} />
                      <Textarea
                        name="feedback"
                        rows={3}
                        defaultValue={proposal.feedback ?? ""}
                        placeholder="Feedback for the team. Be specific about what to cut."
                      />
                      <div className="flex flex-wrap gap-3">
                        <Button type="submit" name="status" value="approved" size="sm">
                          Approve proposal
                        </Button>
                        <Button
                          type="submit"
                          name="status"
                          value="changes_requested"
                          size="sm"
                          variant="outline"
                        >
                          Request changes
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No proposal submitted yet.</p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground">No teams yet. Create the first one above.</p>
      )}
    </div>
  );
}
