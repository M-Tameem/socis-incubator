"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveProposal, type ProposalState } from "@/app/dashboard/proposal/actions";
import { Field } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import type { Proposal } from "@/lib/types";

export function ProposalForm({
  teamId,
  proposal,
  locked,
}: {
  teamId: string;
  proposal: Proposal | null;
  locked: boolean;
}) {
  const [state, action] = useActionState<ProposalState, FormData>(saveProposal, {});
  const err = state.errors ?? {};

  return (
    <form action={action} className="max-w-2xl space-y-8">
      <input type="hidden" name="team_id" value={teamId} />

      {err.form ? <Alert variant="error">{err.form}</Alert> : null}
      {state.saved ? <Alert variant="success">Draft saved. It is not submitted yet.</Alert> : null}
      {state.submitted ? (
        <Alert variant="success">
          Proposal submitted. Your executive contact will review it and leave feedback here.
        </Alert>
      ) : null}

      <Field
        label="What problem are you solving?"
        name="problem"
        hint="Who has this problem today, and how do they deal with it now?"
        error={err.problem}
        required
      >
        <Textarea id="problem" name="problem" rows={4} defaultValue={proposal?.problem} disabled={locked} />
      </Field>

      <Field label="What are you building?" name="solution" error={err.solution} required>
        <Textarea id="solution" name="solution" rows={4} defaultValue={proposal?.solution} disabled={locked} />
      </Field>

      <Field
        label="Who is the target user?"
        name="target_user"
        hint="Be specific. 'Students' is too broad; 'first-year students looking for a study group' is usable."
        error={err.target_user}
        required
      >
        <Textarea id="target_user" name="target_user" rows={3} defaultValue={proposal?.target_user} disabled={locked} />
      </Field>

      <Field
        label="Your MVP"
        name="mvp_scope"
        hint="The smallest version that works end to end. List the features that must exist for the project to be worth demoing."
        error={err.mvp_scope}
        required
      >
        <Textarea id="mvp_scope" name="mvp_scope" rows={5} defaultValue={proposal?.mvp_scope} disabled={locked} />
      </Field>

      <Field
        label="Explicitly not in the MVP"
        name="out_of_scope"
        hint="Optional, but teams that write this down finish more often. Park the good ideas here."
        error={err.out_of_scope}
      >
        <Textarea
          id="out_of_scope"
          name="out_of_scope"
          rows={3}
          defaultValue={proposal?.out_of_scope ?? ""}
          disabled={locked}
        />
      </Field>

      <Field label="Technology stack" name="tech_stack" error={err.tech_stack} required>
        <Input
          id="tech_stack"
          name="tech_stack"
          placeholder="React, Express, Postgres"
          defaultValue={proposal?.tech_stack}
          disabled={locked}
        />
      </Field>

      <Field
        label="Team roles"
        name="team_roles"
        hint="Who is doing what. Roles can overlap, but someone should own each part."
        error={err.team_roles}
        required
      >
        <Textarea id="team_roles" name="team_roles" rows={3} defaultValue={proposal?.team_roles} disabled={locked} />
      </Field>

      <Field
        label="Milestones"
        name="milestones"
        hint="Rough targets for the next ten weeks, one per line. These become your check-in reference points."
        error={err.milestones}
        required
      >
        <Textarea id="milestones" name="milestones" rows={5} defaultValue={proposal?.milestones} disabled={locked} />
      </Field>

      {!locked ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <IntentButton intent="submit">Submit for review</IntentButton>
          <IntentButton intent="save" variant="outline">
            Save draft
          </IntentButton>
          <p className="text-sm text-muted-foreground">
            You can keep editing until we approve it.
          </p>
        </div>
      ) : null}
    </form>
  );
}

/**
 * Submit buttons that each carry their own intent, so one form handles both
 * saving a draft and submitting for review.
 */
function IntentButton({
  intent,
  children,
  variant = "default",
}: {
  intent: "save" | "submit";
  children: React.ReactNode;
  variant?: "default" | "outline";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" name="intent" value={intent} variant={variant} disabled={pending}>
      {children}
    </Button>
  );
}
