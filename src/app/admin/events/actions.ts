"use server";

import { revalidatePath } from "next/cache";
import { requireExec } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import type { EventKind } from "@/lib/types";

export async function createEvent(formData: FormData) {
  await requireExec();

  const title = String(formData.get("title") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "");
  if (!title || !startsAt) return;

  const supabase = createAdminClient();
  await supabase.from("events").insert({
    title,
    slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`,
    kind: (String(formData.get("kind")) || "workshop") as EventKind,
    description: String(formData.get("description") ?? "") || null,
    starts_at: new Date(startsAt).toISOString(),
    location: String(formData.get("location") ?? "") || null,
    host: String(formData.get("host") ?? "") || null,
    rsvp_url: String(formData.get("rsvp_url") ?? "") || null,
    published: formData.get("published") === "on",
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function toggleEventPublished(formData: FormData) {
  await requireExec();

  const id = String(formData.get("id"));
  const published = formData.get("published") === "true";

  const supabase = createAdminClient();
  await supabase.from("events").update({ published: !published }).eq("id", id);

  revalidatePath("/admin/events");
  revalidatePath("/events");
}
