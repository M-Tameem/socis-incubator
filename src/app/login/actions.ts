"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { allowAuthAttempt } from "@/lib/auth-attempts";
import { hashRecoveryAnswer, normalizeRecoveryAnswer, verifyRecoveryAnswer } from "@/lib/recovery";

export type LoginState = { error?: string; message?: string; email?: string };
export type LoginMode = "signin" | "signup" | "reset";

function emailFrom(formData: FormData) {
  return z.string().email().max(254).safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
}

function rateLimitMessage(error: { status?: number; code?: string }) {
  if (error.code === "over_email_send_rate_limit") {
    return "Email delivery is temporarily at its limit. Please try again later. If you already have a password, you can sign in without an email.";
  }
  if (error.status === 429 || error.code === "over_request_rate_limit") {
    return "Too many attempts. Please wait a few minutes before trying again.";
  }
  return null;
}

export async function signIn(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = emailFrom(formData);
  if (!parsed.success) return { error: "Enter a valid email address." };
  const email = parsed.data;
  const password = String(formData.get("password") ?? "");
  if (!password || password.length > 1024) return { error: "Enter your password.", email };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return {
    email,
    error: rateLimitMessage(error) ?? (error.code === "email_not_confirmed"
      ? "This older account needs help getting activated. Contact SOCIS to regain access."
      : "Could not sign in. Check your email and password, or reset your password."),
  };
  revalidatePath("/", "layout");
  redirect(safeRedirectPath(String(formData.get("next") ?? "")) as Route);
}

export async function signUp(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = emailFrom(formData);
  if (!parsed.success) return { error: "Enter a valid email address." };
  const email = parsed.data;
  const password = String(formData.get("password") ?? "");
  if (password.length < 8 || password.length > 128) {
    return { error: "Use a password between 8 and 128 characters.", email };
  }
  if (password !== formData.get("confirm_password")) return { error: "The passwords do not match.", email };
  const answer = normalizeRecoveryAnswer(String(formData.get("recovery_answer") ?? ""));
  if (answer.length < 4 || answer.length > 128) return { error: "Choose a recovery answer between 4 and 128 characters.", email };
  if (answer === normalizeRecoveryAnswer(password)) return { error: "Choose a recovery answer different from your password.", email };
  if (!await allowAuthAttempt("signup", email)) return { error: "Account creation is temporarily unavailable or too many attempts were made. Please try again later.", email };
  const next = safeRedirectPath(String(formData.get("next") ?? ""));
  const admin = createAdminClient();
  const answerHash = await hashRecoveryAnswer(answer);
  const { data, error } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    app_metadata: { signup_method: "password_without_verification" },
  });
  if (error || !data.user) return {
    email,
    error: (error && rateLimitMessage(error)) ?? (error?.code === "weak_password"
      ? "Choose a stronger password. A longer, unique passphrase works well."
      : "Could not create the account. Try signing in or resetting your password if you already have one."),
  };
  const { error: recoveryError } = await admin.from("account_recovery").insert({
    user_id: data.user.id, email, answer_hash: answerHash,
  });
  if (recoveryError) return { email, error: "Your account was created, but the recovery answer could not be saved. Sign in with your password and set it in Account settings." };
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) return { email, error: "Your account is ready. Please sign in with your email and password." };
  revalidatePath("/", "layout");
  redirect(next as Route);
}

export async function resetPassword(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = emailFrom(formData);
  if (!parsed.success) return { error: "Enter a valid email address." };
  const email = parsed.data;
  const password = String(formData.get("password") ?? "");
  const answer = String(formData.get("recovery_answer") ?? "");
  if (password.length < 8 || password.length > 128) return { email, error: "Use a password between 8 and 128 characters." };
  if (password !== formData.get("confirm_password")) return { email, error: "The passwords do not match." };
  if (!answer || answer.length > 128) return { email, error: "Enter your recovery answer." };
  if (!await allowAuthAttempt("recovery", email)) return { email, error: "Password recovery is temporarily unavailable or too many attempts were made. Please try again later." };
  const admin = createAdminClient();
  const { data: recovery, error: lookupError } = await admin.from("account_recovery")
    .select("user_id, answer_hash").eq("email", email).maybeSingle();
  const matches = await verifyRecoveryAnswer(answer, recovery?.answer_hash ?? null);
  if (lookupError || !recovery || !matches) return { email, error: "The email and recovery answer do not match. If you never set a recovery answer, contact SOCIS for help." };
  const { data: account, error: accountError } = await admin.auth.admin.getUserById(recovery.user_id);
  if (accountError || account.user?.email?.toLowerCase() !== email) {
    return { email, error: "The email and recovery answer do not match. Contact SOCIS for help." };
  }
  const { error } = await admin.auth.admin.updateUserById(recovery.user_id, {
    password,
  });
  if (error) return { email, error: "Could not reset your password. Try a different password or contact SOCIS." };
  return { email, message: "Password updated. Sign in with your new password." };
}
