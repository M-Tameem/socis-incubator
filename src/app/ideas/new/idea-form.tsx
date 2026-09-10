"use client";

import { useActionState } from "react";
import { createIdea, type IdeaPostState } from "@/app/ideas/actions";
import { Field, SubmitButton } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

export function IdeaForm({ defaultName }: { defaultName?: string }) {
  const [state, action] = useActionState<IdeaPostState, FormData>(createIdea, {});
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form action={action} className="max-w-2xl space-y-7" noValidate>
      {errors.form ? <Alert variant="error">{errors.form}</Alert> : null}

      <Field
        label="Your name"
        name="display_name"
        hint="Shown publicly on the idea. Your email stays private."
        error={errors.display_name}
        required
      >
        <Input
          id="display_name"
          name="display_name"
          maxLength={100}
          autoComplete="name"
          defaultValue={values.display_name ?? defaultName}
          aria-invalid={Boolean(errors.display_name)}
        />
      </Field>

      <Field label="Idea title" name="title" error={errors.title} required>
        <Input
          id="title"
          name="title"
          maxLength={100}
          defaultValue={values.title}
          placeholder="A plain name for the project"
          aria-invalid={Boolean(errors.title)}
        />
      </Field>

      <Field
        label="What would it do?"
        name="summary"
        hint="Describe the problem, the intended user, and the smallest useful version."
        error={errors.summary}
        required
      >
        <Textarea
          id="summary"
          name="summary"
          rows={7}
          maxLength={1200}
          defaultValue={values.summary}
          aria-invalid={Boolean(errors.summary)}
        />
      </Field>

      <Field
        label="Who are you looking for?"
        name="looking_for"
        hint="Mention useful skills, interests, or roles. Beginners are allowed."
        error={errors.looking_for}
        required
      >
        <Textarea
          id="looking_for"
          name="looking_for"
          rows={4}
          maxLength={600}
          defaultValue={values.looking_for}
          aria-invalid={Boolean(errors.looking_for)}
        />
      </Field>

      <Alert>
        Interested students can message you here. Once you have a group, apply together with
        the same teammates and project name. You can revise your applications until September 27.
      </Alert>

      <SubmitButton pendingLabel="Posting…">Post idea</SubmitButton>
    </form>
  );
}
