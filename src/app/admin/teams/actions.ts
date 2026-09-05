"use server";

import { revalidatePath } from "next/cache";
import { requireExec } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendProposalFeedback } from "@/lib/email";
import { slugify } from "@/lib/utils";
import type { TeamStatus } from "@/lib/types";

export async function createTeam(formData: FormData) {
  await requireExec();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = createAdminClient();
  await supabase.from("teams").insert({
    name,
    slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`,
    exec_contact_name: String(formData.get("exec_contact_name") ?? "") || null,
    exec_contact_email: String(formData.get("exec_contact_email") ?? "") || null,
  });

  revalidatePath("/admin/teams");
}

export async function updateTeamAdmin(formData: FormData) {
  await requireExec();

  const id = String(formData.get("id"));
  const supabase = createAdminClient();

  await supabase
    .from("teams")
    .update({
      status: String(formData.get("status")) as TeamStatus,
      exec_contact_name: String(formData.get("exec_contact_name") ?? "") || null,
      exec_contact_email: String(formData.get("exec_contact_email") ?? "") || null,
      demo_day_slot: String(formData.get("demo_day_slot") ?? "") || null,
      showcased: formData.get("showcased") === "on",
    })
    .eq("id", id);

  revalidatePath("/admin/teams");
  revalidatePath("/projects");
  revalidatePath("/demo-day");
}

export async function addTeamMember(formData: FormData) {
  await requireExec();

  const teamId = String(formData.get("team_id"));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const isLead = formData.get("is_lead") === "on";

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  // The student must have signed in at least once so a profile exists.
  if (!profile) return;

  await supabase.from("team_members").upsert({
    team_id: teamId,
    user_id: profile.id,
    is_lead: isLead,
    role_on_team: String(formData.get("role_on_team") ?? "") || null,
  });

  await supabase.from("applications").update({ team_id: teamId }).ilike("email", email);

  revalidatePath("/admin/teams");
}

export async function reviewProposal(formData: FormData) {
  await requireExec();

  const teamId = String(formData.get("team_id"));
  const status = String(formData.get("status")) as "approved" | "changes_requested";
  const feedback = String(formData.get("feedback") ?? "").trim();

  const supabase = createAdminClient();
  await supabase
    .from("proposals")
    .update({ status, feedback: feedback || null, updated_at: new Date().toISOString() })
    .eq("team_id", teamId);

  const [{ data: team }, { data: members }] = await Promise.all([
    supabase.from("teams").select("name").eq("id", teamId).single(),
    supabase.from("team_members").select("profiles(email)").eq("team_id", teamId),
  ]);

  const emails = (members ?? [])
    .map((m) => (m.profiles as unknown as { email: string } | null)?.email)
    .filter((e): e is string => Boolean(e));

  if (team && emails.length > 0) {
    await sendProposalFeedback(emails, team.name, status, feedback);
  }

  revalidatePath("/admin/teams");
}
