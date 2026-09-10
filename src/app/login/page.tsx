import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { LoginForm } from "@/app/login/login-form";
import { getProfile } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/navigation";
import { DemoAccountSwitcher } from "@/components/demo-account-switcher";
import { demoEnabled, getDemoRole } from "@/lib/demo";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; mode?: string; error?: string }>;
}) {
  const { next, mode: rawMode, error } = await searchParams;
  const mode = rawMode === "signup" || rawMode === "reset" ? rawMode : "signin";
  const demoRole = await getDemoRole();
  if (demoRole) redirect(demoRole === "student" ? "/demo/student" : "/demo/exec");
  const profile = await getProfile();
  const destination = safeRedirectPath(next);
  // The helper validates this untyped query string as a same-origin path.
  if (profile) redirect(destination as Route);

  return (
    <div className="max-w-md space-y-8">
      <PageHeader
        title={mode === "signup" ? "Create an account" : mode === "reset" ? "Reset your password" : "Sign in"}
        lede={mode === "signup"
          ? "Choose a password and recovery answer, then you're ready to go. Use the email address you want associated with your application."
          : mode === "reset"
            ? "Answer your recovery question and choose a new password. No email needed."
            : "Sign in with your email and password to manage your application and team."}
      />
      {error === "link_expired" ? <Alert variant="error" role="alert">This email link could not be verified. Sign in with your password, or contact SOCIS if you have not set one yet.</Alert> : null}
      <LoginForm key={mode} next={destination} mode={mode} />
      {demoEnabled() ? (
        <section className="border-t border-border pt-7">
          <p className="text-label">Local walkthrough</p>
          <h2 className="mt-2 text-lg font-semibold">Open a populated demo</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            These sessions use fictional local data. Nothing is sent, saved, or connected to a
            production account.
          </p>
          <div className="mt-5">
            <DemoAccountSwitcher />
          </div>
        </section>
      ) : null}
    </div>
  );
}
