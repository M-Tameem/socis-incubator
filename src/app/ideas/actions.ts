"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/lib/auth";
import { applicationsOpen, getSettings } from "@/lib/settings";
import { fieldErrors, ideaInterestSchema, ideaPostSchema } from "@/lib/validation";
import { sendIdeaInterest } from "@/lib/email";
import type { IdeaStatus } from "@/lib/types";

export type IdeaPostState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export type IdeaInterestState = {
  error?: string;
  message?: string;
  displayName?: string;
  sent?: boolean;
};

export async function createIdea(
  _previous: IdeaPostState,
  formData: FormData,
): Promise<IdeaPostState> {
  const values = Object.fromEntries(formData) as Record<string, string>;
  const profile = await getProfile();

  if (!profile) {
    return { errors: { form: "Sign in before posting an idea." }, values };
  }

  if (!applicationsOpen(await getSettings())) {
    return { errors: { form: "The idea portal closed with applications." }, values };
  }

  const parsed = ideaPostSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const supabase = await createClient();
  const { display_name, ...idea } = parsed.data;
  const { data, error } = await supabase
    .from("idea_posts")
    .insert({
      author_id: profile.id,
      author_name: display_name,
      ...idea,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      errors: { form: "The idea could not be posted. Try again." },
      values,
    };
  }

  revalidatePath("/ideas");
  redirect(`/ideas/${data.id}` as Route);
}

export async function expressInterest(
  _previous: IdeaInterestState,
  formData: FormData,
): Promise<IdeaInterestState> {
  const message = String(formData.get("message") ?? "");
  const displayName = String(formData.get("display_name") ?? "");
  const parsed = ideaInterestSchema.safeParse({
    idea_id: String(formData.get("idea_id") ?? ""),
    display_name: displayName,
    message,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the form.",
      message,
      displayName,
    };
  }

  const profile = await getProfile();
  if (!profile) {
    return { error: "Sign in before contacting an idea author.", message, displayName };
  }

  if (!applicationsOpen(await getSettings())) {
    return { error: "The idea portal closed with applications.", message, displayName };
  }

  const supabase = await createClient();
  const { data: idea } = await supabase
    .from("idea_posts")
    .select("id, title, author_id, author_name, status")
    .eq("id", parsed.data.idea_id)
    .maybeSingle();

  if (!idea || idea.status !== "open") {
    return { error: "This idea is no longer looking for people.", message, displayName };
  }

  if (idea.author_id === profile.id) {
    return { error: "This is your idea.", message, displayName };
  }

  const senderName = parsed.data.display_name;
  const { error } = await supabase.from("idea_interests").insert({
    idea_id: idea.id,
    sender_id: profile.id,
    sender_name: senderName,
    sender_email: profile.email,
    message: parsed.data.message,
  });

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Interest has already been sent for this idea."
          : "The message could not be sent. Try again.",
      message,
      displayName,
    };
  }

  const admin = createAdminClient();
  const { data: author } = await admin
    .from("profiles")
    .select("email")
    .eq("id", idea.author_id)
    .single();

  if (author?.email) {
    await sendIdeaInterest(
      author.email,
      idea.author_name.split(" ")[0],
      idea.title,
      senderName,
      profile.email,
      parsed.data.message,
    );
  }

  revalidatePath(`/ideas/${idea.id}` as Route);
  return { sent: true };
}

export async function updateIdeaStatus(formData: FormData) {
  const id = String(formData.get("idea_id") ?? "");
  const rawStatus = String(formData.get("status") ?? "");
  const statuses: IdeaStatus[] = ["open", "matched", "closed"];
  if (!id || !statuses.includes(rawStatus as IdeaStatus)) return;

  const supabase = await createClient();
  await supabase
    .from("idea_posts")
    .update({ status: rawStatus as IdeaStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/ideas");
  revalidatePath(`/ideas/${id}` as Route);
}
