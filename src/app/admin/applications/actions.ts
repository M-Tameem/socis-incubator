"use server";

import { revalidatePath } from "next/cache";
import { requireExec } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendApplicationDecision } from "@/lib/email";
import type { ApplicationStatus } from "@/lib/types";

const NOTIFIABLE = ["accepted", "waitlisted", "declined"] as const;

export async function setApplicationStatus(formData: FormData) {
  await requireExec();

  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as ApplicationStatus;
  const notify = formData.get("notify") === "on";

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("full_name, email")
    .single();

  if (error || !data) return;

  if (notify && (NOTIFIABLE as readonly string[]).includes(status)) {
    await sendApplicationDecision(
      data.email,
      data.full_name.split(" ")[0],
      status as "accepted" | "waitlisted" | "declined",
    );
  }

  revalidatePath("/admin/applications");
}

export async function saveReviewerNotes(formData: FormData) {
  await requireExec();

  const id = String(formData.get("id"));
  const notes = String(formData.get("reviewer_notes") ?? "");

  const supabase = createAdminClient();
  await supabase.from("applications").update({ reviewer_notes: notes || null }).eq("id", id);

  revalidatePath("/admin/applications");
}
