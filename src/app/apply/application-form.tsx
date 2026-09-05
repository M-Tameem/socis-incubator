"use client";

import { useActionState, useState } from "react";
import { submitApplication, type ApplyState } from "@/app/apply/actions";
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

export function ApplicationForm() {
  const [state, action] = useActionState<ApplyState, FormData>(submitApplication, {});
  const [withTeam, setWithTeam] = useState(false);
  const [withIdea, setWithIdea] = useState(false);

  const err = state.errors ?? {};
  const val = state.values ?? {};

  return (
    <form action={action} className="max-w-2xl space-y-10" noValidate>
      {err.form ? <Alert variant="error">{err.form}</Alert> : null}

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
          hint="Program email will go to this address."
          error={err.email}
          required
        >
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={val.email}
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
            <span>I am applying with people I already know</span>
          </label>

          {withTeam ? (
            <Field
              label="Your teammates"
              name="teammates"
              hint="Names and emails, one per line. Everyone still needs to submit their own application."
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
              hint="Describe the problem and who has it. We will review the scope in Week 2."
              error={err.project_idea}
            >
              <Textarea id="project_idea" name="project_idea" rows={5} defaultValue={val.project_idea} />
            </Field>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground">
          Neither box checked is completely fine. Most students apply alone with no idea and get
          matched into a team.
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
        <SubmitButton pendingLabel="Submitting…">Submit application</SubmitButton>
        <p className="text-sm text-muted-foreground">You will get a confirmation email.</p>
      </div>
    </form>
  );
}
