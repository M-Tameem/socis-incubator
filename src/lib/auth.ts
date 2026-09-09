import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { getDemoProfile } from "@/lib/demo";

export async function getProfile(): Promise<Profile | null> {
  const demoProfile = await getDemoProfile();
  if (demoProfile) return demoProfile;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data ?? null;
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireExec(): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== "exec" && profile.role !== "admin") redirect("/dashboard");
  return profile;
}

/** The team the signed-in student belongs to, if any. */
export async function getMyTeam() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("team_members")
    .select("is_lead, role_on_team, teams(*)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data?.teams) return null;
  return { ...data.teams, isLead: data.is_lead, roleOnTeam: data.role_on_team };
}
