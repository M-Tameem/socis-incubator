"use client";

import { useActionState } from "react";
import { submitCheckIn, type CheckInState } from "@/app/dashboard/check-ins/actions";
import { Field, SubmitButton } from "@/components/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

export function CheckInForm({ teamId, cycle }: { teamId: string; cycle: number }) {
  const [state, action] = useActionState<CheckInState, FormData>(submitCheckIn, {});
  const err = state.errors ?? {};

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <input type="hidden" name="team_id" value={teamId} />
      <input type="hidden" name="cycle" value={cycle} />

      {err.form ? <Alert variant="error">{err.form}</Alert> : null}
      {state.saved ? (
        <Alert variant="success">
          Check-in recorded. If you flagged a problem, your executive contact will follow up.
        </Alert>
      ) : null}

      <p className="text-sm text-muted-foreground">Cycle {cycle}</p>

      <Field label="What did you complete?" name="completed" error={err.completed} required>
        <Textarea id="completed" name="completed" rows={3} aria-invalid={Boolean(err.completed)} />
      </Field>

      <Field label="What are you working on?" name="in_progress" error={err.in_progress} required>
        <Textarea id="in_progress" name="in_progress" rows={3} aria-invalid={Boolean(err.in_progress)} />
      </Field>

      <Field label="What will you complete next?" name="next_up" error={err.next_up} required>
        <Textarea id="next_up" name="next_up" rows={3} aria-invalid={Boolean(err.next_up)} />
      </Field>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="behind_schedule" className="mt-1 h-4 w-4 rounded border-input" />
        <span>
          We are behind schedule
          <span className="mt-0.5 block text-muted-foreground">
            Ticking this is how you get help early. It does not count against you.
          </span>
        </span>
      </label>

      <Field
        label="Any problems?"
        name="blockers"
        hint="Technical blockers, scope trouble, a teammate who has gone quiet."
        error={err.blockers}
      >
        <Textarea id="blockers" name="blockers" rows={3} />
      </Field>

      <Field
        label="Do you need anything from SOCIS?"
        name="help_needed"
        hint="Introductions, a mentor, a workshop, help cutting scope, or budget approval."
        error={err.help_needed}
      >
        <Textarea id="help_needed" name="help_needed" rows={3} />
      </Field>

      <SubmitButton pendingLabel="Submitting…">Submit check-in</SubmitButton>
    </form>
  );
}
