"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { signIn, signUp, resetPassword, type LoginState, type LoginMode } from "./actions";
import { Field, SubmitButton } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { RecoveryField } from "@/components/recovery-field";

const actions = { signin: signIn, signup: signUp, reset: resetPassword };
const labels = { signin: "Sign in", signup: "Create account", reset: "Reset password" };

export function LoginForm({ next, mode }: { next: string; mode: LoginMode }) {
  const [state, action] = useActionState<LoginState, FormData>(actions[mode], {});
  const link = (target: LoginMode) => `/login?mode=${target}&next=${encodeURIComponent(next)}` as Route;
  return (
    <div className="space-y-6">
      <form action={action} className="space-y-6">
        <input type="hidden" name="next" value={next} />
        {state.error ? <Alert variant="error" role="alert">{state.error}</Alert> : null}
        {state.message ? <Alert variant="success">{state.message}</Alert> : null}
        <Field label="Email" name="email" required>
          <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.email} required maxLength={254} />
        </Field>
        {mode === "reset" ? <RecoveryField /> : null}
        <Field label={mode === "reset" ? "New password" : "Password"} name="password" required hint={mode !== "signin" ? "Use at least 8 characters." : undefined}>
          <Input id="password" name="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required minLength={mode === "signin" ? undefined : 8} maxLength={mode === "signin" ? 1024 : 128} />
        </Field>
        {mode !== "signin" ? (
          <Field label="Confirm password" name="confirm_password" required>
            <Input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
          </Field>
        ) : null}
        {mode === "signup" ? <RecoveryField creating /> : null}
        <SubmitButton pendingLabel={mode === "signin" ? "Signing in…" : mode === "signup" ? "Creating account…" : "Resetting…"}>{labels[mode]}</SubmitButton>
      </form>
      <nav aria-label="Account access" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {mode !== "signin" ? <Link href={link("signin")} className="text-link underline underline-offset-4">Sign in</Link> : null}
        {mode !== "signup" ? <Link href={link("signup")} className="text-link underline underline-offset-4">Create an account</Link> : null}
        {mode !== "reset" ? <Link href={link("reset")} className="text-link underline underline-offset-4">Forgot password?</Link> : null}
      </nav>
      <p className="text-sm text-muted-foreground">
        {mode === "signup" ? "Your account is ready immediately. No confirmation email needed."
          : "Previously used email links, or never set a recovery answer? If you're still signed in, use Account settings. Otherwise, "}
        {mode !== "signup" ? <><Link href="/contact" className="text-link underline underline-offset-4">contact SOCIS</Link> for help accessing your existing account.</> : null}
      </p>
    </div>
  );
}
