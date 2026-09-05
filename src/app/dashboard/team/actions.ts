"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { teamSchema, fieldErrors } from "@/lib/validation";

export type TeamState = { errors?: Record<string, string>; saved?: boolean };

export async function updateTeam(_prev: TeamState, formData: FormData): Promise<TeamState> {
  const teamId = String(formData.get("team_id") ?? "");
  const parsed = teamSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("teams")
    .update({
      name: parsed.data.name,
      tagline: parsed.data.tagline || null,
      description: parsed.data.description || null,
      github_url: parsed.data.github_url || null,
      demo_url: parsed.data.demo_url || null,
      tech_stack: parsed.data.tech_stack || null,
    })
    .eq("id", teamId);

  if (error) {
    return { errors: { form: "Only the team lead can edit these details." } };
  }

  revalidatePath("/dashboard/team");
  return { saved: true };
}
