"use server";

import { revalidatePath } from "next/cache";
import { requireExec } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const KEYS = [
  "applications_open",
  "applications_close",
  "teams_announced",
  "demo_day_date",
  "demo_day_time",
  "demo_day_location",
  "contact_email",
  "discord_url",
] as const;

export async function updateSettings(formData: FormData) {
  await requireExec();

  const supabase = createAdminClient();
  const rows = KEYS.map((key) => ({
    key,
    value: String(formData.get(key) ?? ""),
    updated_at: new Date().toISOString(),
  }));

  await supabase.from("program_settings").upsert(rows, { onConflict: "key" });

  revalidatePath("/", "layout");
}
