import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Account settings" };

export default async function PasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/password");
  return (
    <div className="max-w-md space-y-8">
      <PageHeader title="Account settings" lede={`Set a password and recovery answer for ${user.email}. Your account and application stay the same.`} />
      <PasswordForm />
    </div>
  );
}
