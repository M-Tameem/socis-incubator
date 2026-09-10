"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, SubmitButton } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { RecoveryField } from "@/components/recovery-field";
import { savePassword } from "./actions";

export function PasswordForm() {
  const [state, action] = useActionState(savePassword, {});
  if (state.saved) return (
    <div className="space-y-4">
      <Alert variant="success">Password and recovery answer saved. Use your email and password next time you sign in.</Alert>
      <Link href="/dashboard" className="text-link underline underline-offset-4">Go to your dashboard</Link>
    </div>
  );
  return (
    <form action={action} className="space-y-6">
      {state.error ? <Alert variant="error" role="alert">{state.error}</Alert> : null}
      <Field label="Password" name="password" hint="Use at least 8 characters." required>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
      </Field>
      <Field label="Confirm password" name="confirm_password" required>
        <Input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
      </Field>
      <RecoveryField creating />
      <SubmitButton pendingLabel="Saving…">Save account settings</SubmitButton>
    </form>
  );
}
