"use server";

import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/navigation";

export type LoginState = { error?: string; sent?: boolean; email?: string };

export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeRedirectPath(String(formData.get("next") ?? "/dashboard"));

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address.", email };
  }

  const supabase = await createClient();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${site}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return { error: "We could not send the link. Check the address and try again.", email };
  }

  return { sent: true, email };
}
