import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { setApplicationStatus, saveReviewerNotes } from "@/app/admin/applications/actions";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Applications" };

const STATUSES: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "accepted",
  "waitlisted",
  "declined",
  "withdrawn",
];

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filter } = await searchParams;
  const supabase = await createClient();

  // The whole table is 30–50 rows, so we fetch once and filter in memory
  // rather than branching the query builder.
  const { data: all } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  const applications =
    filter && filter !== "all" ? (all ?? []).filter((a) => a.status === filter) : (all ?? []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="prose-page mt-2 text-muted-foreground">
          Review applications as they arrive. The email checkbox controls whether a status
          change is sent to the applicant.
        </p>
      </div>

      <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {["all", ...STATUSES].map((s) => (
          <a
            key={s}
            href={`/admin/applications?status=${s}`}
            className={
              (filter ?? "all") === s
                ? "border-b-2 border-link pb-0.5"
                : "border-b-2 border-transparent pb-0.5 text-muted-foreground hover:text-foreground"
            }
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </a>
        ))}
      </nav>

      {applications && applications.length > 0 ? (
        <ul className="divide-y divide-border border-y border-border">
          {applications.map((app) => (
            <li key={app.id} className="py-8">
              <details>
                <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="font-medium">{app.full_name}</span>
                  <span className="text-sm text-muted-foreground">
                    {app.program}, {app.year}
                  </span>
                  <StatusBadge status={app.status} />
                  {app.applying_with_team ? (
                    <span className="text-sm text-muted-foreground">Has teammates</span>
                  ) : null}
                  {app.has_project_idea ? (
                    <span className="text-sm text-muted-foreground">Has an idea</span>
                  ) : null}
                  <span className="ml-auto text-sm text-muted-foreground">
                    {formatDate(app.created_at)}
                  </span>
                </summary>

                <div className="mt-6 space-y-6">
                  <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[12rem_1fr]">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${app.email}`}
                        className="text-link underline underline-offset-4 hover:no-underline"
                      >
                        {app.email}
                      </a>
                    </dd>

                    <dt className="text-muted-foreground">Availability</dt>
                    <dd>{app.weekly_hours}</dd>

                    <dt className="text-muted-foreground">Skills</dt>
                    <dd className="whitespace-pre-line">{app.skills}</dd>

                    <dt className="text-muted-foreground">Interest areas</dt>
                    <dd className="whitespace-pre-line">{app.interest_areas}</dd>

                    {app.github_url ? (
                      <>
                        <dt className="text-muted-foreground">GitHub</dt>
                        <dd>
                          <a
                            href={app.github_url}
                            className="text-link underline underline-offset-4 hover:no-underline"
                          >
                            {app.github_url.replace(/^https?:\/\/(www\.)?/, "")}
                          </a>
                        </dd>
                      </>
                    ) : null}

                    {app.previous_projects ? (
                      <>
                        <dt className="text-muted-foreground">Previous projects</dt>
                        <dd className="whitespace-pre-line">{app.previous_projects}</dd>
                      </>
                    ) : null}

                    {app.teammates ? (
                      <>
                        <dt className="text-muted-foreground">Teammates</dt>
                        <dd className="whitespace-pre-line">{app.teammates}</dd>
                      </>
                    ) : null}

                    {app.project_idea ? (
                      <>
                        <dt className="text-muted-foreground">Project idea</dt>
                        <dd className="whitespace-pre-line">{app.project_idea}</dd>
                      </>
                    ) : null}

                    <dt className="text-muted-foreground">Goals</dt>
                    <dd className="whitespace-pre-line">{app.goals}</dd>
                  </dl>

                  <div className="flex flex-wrap items-end gap-4 border-t border-border pt-5">
                    <form action={setApplicationStatus} className="flex flex-wrap items-end gap-3">
                      <input type="hidden" name="id" value={app.id} />
                      <div className="space-y-1">
                        <label htmlFor={`status-${app.id}`} className="text-sm font-medium">
                          Status
                        </label>
                        <Select
                          id={`status-${app.id}`}
                          name="status"
                          defaultValue={app.status}
                          className="w-48"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <label className="flex items-center gap-2 pb-2 text-sm">
                        <input
                          type="checkbox"
                          name="notify"
                          defaultChecked
                          className="h-4 w-4 rounded border-input"
                        />
                        Email the applicant
                      </label>
                      <Button type="submit" size="sm">
                        Update status
                      </Button>
                    </form>
                  </div>

                  <form action={saveReviewerNotes} className="space-y-2">
                    <input type="hidden" name="id" value={app.id} />
                    <label htmlFor={`notes-${app.id}`} className="text-sm font-medium">
                      Reviewer notes
                    </label>
                    <Textarea
                      id={`notes-${app.id}`}
                      name="reviewer_notes"
                      rows={2}
                      defaultValue={app.reviewer_notes ?? ""}
                      placeholder="Internal only. Never shown to the applicant."
                    />
                    <Button type="submit" size="sm" variant="outline">
                      Save notes
                    </Button>
                  </form>
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No applications match this filter.</p>
      )}
    </div>
  );
}
