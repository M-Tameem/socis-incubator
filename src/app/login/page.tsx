import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { LoginForm } from "@/app/login/login-form";
import { getProfile } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/navigation";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const profile = await getProfile();
  const destination = safeRedirectPath(next);
  // The helper validates this untyped query string as a same-origin path.
  if (profile) redirect(destination as Route);

  return (
    <div className="max-w-md space-y-8">
      <PageHeader
        title="Sign in"
        lede="Enter the email address from your application. We will send you a one-time sign-in link."
      />
      <LoginForm next={destination} />
    </div>
  );
}
