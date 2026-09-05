"use client";

import { useActionState } from "react";
import { expressInterest, type IdeaInterestState } from "@/app/ideas/actions";
import { Field, SubmitButton } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

export function InterestForm({ ideaId, defaultName }: { ideaId: string; defaultName?: string }) {
  const [state, action] = useActionState<IdeaInterestState, FormData>(expressInterest, {});

  if (state.sent) {
    return (
      <Alert variant="success">
        Message sent. The author received your email address and can reply directly.
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="idea_id" value={ideaId} />
      {state.error ? <Alert variant="error">{state.error}</Alert> : null}
      <Field label="Your name" name="display_name" required>
        <Input
          id="display_name"
          name="display_name"
          maxLength={100}
          autoComplete="name"
          defaultValue={state.displayName ?? defaultName}
        />
      </Field>
      <Field
        label="Message to the author"
        name="message"
        hint="Say what interests you and what you could contribute."
        required
      >
        <Textarea
          id="message"
          name="message"
          rows={5}
          maxLength={1000}
          defaultValue={state.message}
        />
      </Field>
      <SubmitButton pendingLabel="Sending…">Send interest</SubmitButton>
    </form>
  );
}
