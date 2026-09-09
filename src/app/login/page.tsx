import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { LoginForm } from "@/app/login/login-form";
import { getProfile } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/navigation";
import { DemoAccountSwitcher } from "@/components/demo-account-switcher";
import { demoEnabled, getDemoRole } from "@/lib/demo";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const demoRole = await getDemoRole();
  if (demoRole) redirect(demoRole === "student" ? "/demo/student" : "/demo/exec");
  const profile = await getProfile();
  const destination = safeRedirectPath(next);
  // The helper validates this untyped query string as a same-origin path.
  if (profile) redirect(destination as Route);

  return (
    <div className="max-w-md space-y-8">
      <PageHeader
        title="Sign in"
        lede="Enter your email address. A one-time sign-in link will be sent to you."
      />
      <LoginForm next={destination} />
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
