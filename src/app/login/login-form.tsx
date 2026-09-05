"use client";

import { useActionState } from "react";
import Link from "next/link";
import { sendMagicLink, type LoginState } from "@/app/login/actions";
import { Field, SubmitButton } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState<LoginState, FormData>(sendMagicLink, {});

  if (state.sent) {
    return (
      <div className="space-y-4">
        <Alert variant="success">
          Check {state.email}. The sign-in link is valid for one hour.
        </Alert>
        <p className="text-sm text-muted-foreground">
          If it does not arrive, check your spam folder or try another address.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="next" value={next} />

      {state.error ? <Alert variant="error">{state.error}</Alert> : null}

      <Field label="Email" name="email" error={state.error}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          required
        />
      </Field>

      <SubmitButton pendingLabel="Sending…">Email me a sign-in link</SubmitButton>

      <p className="text-sm text-muted-foreground">
        Have not applied yet?{" "}
        <Link href="/apply" className="text-link underline underline-offset-4 hover:no-underline">
          Apply to the incubator
        </Link>
        .
      </p>
    </form>
  );
}
