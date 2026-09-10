"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitApplication, updateApplication, type ApplyState } from "@/app/apply/actions";
import type { ApplicationInput } from "@/lib/validation";
import { Field, SubmitButton } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";

const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "5th year or beyond", "Graduate"];
const HOURS = [
  "Under 4 hours a week",
  "4–6 hours a week",
  "6–10 hours a week",
  "More than 10 hours a week",
];

export function ApplicationForm({ initialValues, applicationId, updatedAt }: {
  initialValues?: Partial<ApplicationInput>;
  applicationId?: string;
  updatedAt?: string;
}) {
  const editing = Boolean(applicationId);
  const [state, action] = useActionState<ApplyState, FormData>(editing ? updateApplication : submitApplication, {});
  const [withTeam, setWithTeam] = useState(initialValues?.applying_with_team ?? false);
  const [withIdea, setWithIdea] = useState(initialValues?.has_project_idea ?? false);

  const err = state.errors ?? {};
  const val = state.values ?? initialValues ?? {};

  return (
    <form action={action} className="max-w-2xl space-y-10" noValidate>
      {err.form ? <Alert variant="error">{err.form}</Alert> : null}
      {state.saved ? <Alert variant="success">Changes saved. Your application is up to date.</Alert> : null}
      {editing ? (
        <>
          <input type="hidden" name="application_id" value={applicationId} />
          <input type="hidden" name="updated_at" value={state.updatedAt ?? updatedAt} />
        </>
      ) : null}

      <section className="space-y-6">
        <h2 className="text-lg font-semibold">About you</h2>

        <Field label="Full name" name="full_name" error={err.full_name} required>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={val.full_name}
            aria-invalid={Boolean(err.full_name)}
            autoComplete="name"
          />
        </Field>

        <Field
          label="Email"
          name="email"
          hint={editing ? "This is the email you used to apply and sign in." : "Use this same address to sign in and edit your application later."}
          error={err.email}
          required
        >
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={val.email}
            readOnly={editing}
            aria-invalid={Boolean(err.email)}
            autoComplete="email"
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Program" name="program" error={err.program} required>
            <Input
              id="program"
              name="program"
              placeholder="e.g. Computer Science"
              defaultValue={val.program}
              aria-invalid={Boolean(err.program)}
            />
          </Field>

          <Field label="Year of study" name="year" error={err.year} required>
            <Select id="year" name="year" defaultValue={val.year ?? ""} aria-invalid={Boolean(err.year)}>
              <option value="" disabled>
                Select a year
              </option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </section>

      <section className="space-y-6 border-t border-border pt-10">
        <h2 className="text-lg font-semibold">Skills and experience</h2>

        <Field
          label="Technical skills"
          name="skills"
          hint="List languages and tools you can use. It is fine to be a beginner."
          error={err.skills}
          required
        >
          <Textarea id="skills" name="skills" rows={4} defaultValue={val.skills} aria-invalid={Boolean(err.skills)} />
        </Field>

        <Field
          label="Areas you would like to work in"
          name="interest_areas"
          hint="For example: web apps, mobile, machine learning, games, developer tools, hardware, design."
          error={err.interest_areas}
          required
        >
          <Textarea
            id="interest_areas"
            name="interest_areas"
            rows={3}
            defaultValue={val.interest_areas}
            aria-invalid={Boolean(err.interest_areas)}
          />
        </Field>

        <Field label="GitHub profile" name="github_url" hint="Optional." error={err.github_url}>
          <Input
            id="github_url"
            name="github_url"
            type="url"
            placeholder="https://github.com/yourusername"
            defaultValue={val.github_url}
            aria-invalid={Boolean(err.github_url)}
          />
        </Field>

        <Field
          label="Previous projects"
          name="previous_projects"
          hint="Optional. Coursework, hackathons, and side projects all count."
          error={err.previous_projects}
        >
          <Textarea id="previous_projects" name="previous_projects" rows={3} defaultValue={val.previous_projects} />
        </Field>
      </section>

      <section className="space-y-6 border-t border-border pt-10">
        <h2 className="text-lg font-semibold">Team and project</h2>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="applying_with_team"
              className="mt-1 h-4 w-4 rounded border-input"
              checked={withTeam}
              onChange={(e) => setWithTeam(e.target.checked)}
            />
            <span>I am applying with a group</span>
          </label>

          {withTeam ? (
            <Field
              label="Your teammates"
              name="teammates"
              hint="List your group's names and emails, one per line. Each person submits this same form and lists the same teammates."
              error={err.teammates}
            >
              <Textarea id="teammates" name="teammates" rows={3} defaultValue={val.teammates} />
            </Field>
          ) : null}
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="has_project_idea"
              className="mt-1 h-4 w-4 rounded border-input"
              checked={withIdea}
              onChange={(e) => setWithIdea(e.target.checked)}
            />
            <span>I have a project idea I would like to build</span>
          </label>

          {withIdea ? (
            <Field
              label="Your project idea"
              name="project_idea"
              hint="Give it a name and describe what you want to build and who it helps. If applying together, use the same project name."
              error={err.project_idea}
            >
              <Textarea id="project_idea" name="project_idea" rows={5} defaultValue={val.project_idea} />
            </Field>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground">
          Apply with friends, or meet people around an idea and apply together. Solo applicants
          are welcome too: leave these options unticked and SOCIS will help you find a group.
          You can add or change teammates and your idea until the application deadline.
        </p>
      </section>

      <section className="space-y-6 border-t border-border pt-10">
        <h2 className="text-lg font-semibold">Availability and goals</h2>

        <Field
          label="Time you can commit"
          name="weekly_hours"
          hint="Be realistic. We would rather place you well than have you overcommit."
          error={err.weekly_hours}
          required
        >
          <Select
            id="weekly_hours"
            name="weekly_hours"
            defaultValue={val.weekly_hours ?? ""}
            aria-invalid={Boolean(err.weekly_hours)}
          >
            <option value="" disabled>
              Select availability
            </option>
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="What do you hope to get out of the program?"
          name="goals"
          error={err.goals}
          required
        >
          <Textarea id="goals" name="goals" rows={4} defaultValue={val.goals} aria-invalid={Boolean(err.goals)} />
        </Field>
      </section>

      <div className="flex items-center gap-4 border-t border-border pt-8">
        <SubmitButton pendingLabel={editing ? "Saving…" : "Submitting…"}>
          {editing ? "Save changes" : "Submit application"}
        </SubmitButton>
        <p className="text-sm text-muted-foreground">
          {editing ? "You can revise these answers until the deadline." : "You will get a confirmation email."}
        </p>
      </div>
      {!editing ? (
        <p className="text-sm text-muted-foreground">
          Already applied?{" "}
          <Link href="/login?next=/apply" className="text-link underline underline-offset-4">Sign in to edit your application</Link>.
        </p>
      ) : null}
    </form>
  );
}
