"use client";

import { useActionState } from "react";
import { updateTeam, type TeamState } from "@/app/dashboard/team/actions";
import { Field, SubmitButton } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import type { Team } from "@/lib/types";

export function TeamForm({ team, canEdit }: { team: Team; canEdit: boolean }) {
  const [state, action] = useActionState<TeamState, FormData>(updateTeam, {});
  const err = state.errors ?? {};

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <input type="hidden" name="team_id" value={team.id} />

      {err.form ? <Alert variant="error">{err.form}</Alert> : null}
      {state.saved ? <Alert variant="success">Project details saved.</Alert> : null}

      <Field label="Team name" name="name" error={err.name}>
        <Input id="name" name="name" defaultValue={team.name} disabled={!canEdit} />
      </Field>

      <Field
        label="One-line summary"
        name="tagline"
        hint="What the project does, in a sentence. This shows up in the projects list."
        error={err.tagline}
      >
        <Input id="tagline" name="tagline" defaultValue={team.tagline ?? ""} disabled={!canEdit} />
      </Field>

      <Field label="Description" name="description" error={err.description}>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={team.description ?? ""}
          disabled={!canEdit}
        />
      </Field>

      <Field
        label="GitHub repository"
        name="github_url"
        hint="Use a public repository when possible."
        error={err.github_url}
      >
        <Input
          id="github_url"
          name="github_url"
          type="url"
          placeholder="https://github.com/your-team/project"
          defaultValue={team.github_url ?? ""}
          disabled={!canEdit}
        />
      </Field>

      <Field label="Live demo URL" name="demo_url" hint="Optional, once you have deployed." error={err.demo_url}>
        <Input
          id="demo_url"
          name="demo_url"
          type="url"
          defaultValue={team.demo_url ?? ""}
          disabled={!canEdit}
        />
      </Field>

      <Field label="Technology stack" name="tech_stack" error={err.tech_stack}>
        <Input
          id="tech_stack"
          name="tech_stack"
          placeholder="Next.js, Postgres, Python"
          defaultValue={team.tech_stack ?? ""}
          disabled={!canEdit}
        />
      </Field>

      {canEdit ? <SubmitButton>Save changes</SubmitButton> : null}
    </form>
  );
}
