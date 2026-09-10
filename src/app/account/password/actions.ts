"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashRecoveryAnswer, normalizeRecoveryAnswer } from "@/lib/recovery";

export type PasswordState = { error?: string; saved?: boolean };

export async function savePassword(_previous: PasswordState, formData: FormData): Promise<PasswordState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user?.email) return { error: "Sign in before changing your password and recovery answer." };
  const password = String(formData.get("password") ?? "");
  const answer = normalizeRecoveryAnswer(String(formData.get("recovery_answer") ?? ""));
  if (password.length < 8 || password.length > 128) return { error: "Use a password between 8 and 128 characters." };
  if (password !== formData.get("confirm_password")) return { error: "The passwords do not match." };
  if (answer.length < 4 || answer.length > 128) return { error: "Choose a recovery answer between 4 and 128 characters." };
  if (answer === normalizeRecoveryAnswer(password)) return { error: "Choose a recovery answer different from your password." };
  const answerHash = await hashRecoveryAnswer(answer);
  const { error } = await supabase.auth.updateUser({ password });
  if (error && error.code !== "same_password") return { error: "Could not save your password. Try a stronger password, or sign in again." };
  const admin = createAdminClient();
  const { error: recoveryError } = await admin.from("account_recovery").upsert({
    user_id: user.id, email: user.email.toLowerCase(), answer_hash: answerHash, updated_at: new Date().toISOString(),
  });
  if (recoveryError) return { error: "Your password was saved, but the recovery answer was not. Please try saving again." };
  return { saved: true };
}
