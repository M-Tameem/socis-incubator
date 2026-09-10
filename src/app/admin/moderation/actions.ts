"use server";

import { revalidatePath } from "next/cache";
import { requireExec } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ModerationState = { error?: string; deleted?: boolean };

export async function deleteModerationItem(
  _previous: ModerationState,
  formData: FormData,
): Promise<ModerationState> {
  await requireExec();
  const kind = formData.get("kind");
  const id = String(formData.get("id") ?? "");
  if ((kind !== "post" && kind !== "message") ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return { error: "Choose a valid post or message." };
  }

  // Use the caller's session so database permissions also enforce access.
  const supabase = await createClient();
  const result = kind === "post"
    ? await supabase.from("idea_posts").delete().eq("id", id).select("id").maybeSingle()
    : await supabase.from("idea_interests").delete().eq("id", id).select("id, idea_id").maybeSingle();

  if (result.error) return { error: "Could not delete this item. Please try again." };
  if (!result.data) return { error: "This item was already removed or you no longer have access." };

  revalidatePath("/admin/moderation");
  revalidatePath("/ideas");
  revalidatePath("/ideas/[id]", "page");
  return { deleted: true };
}
