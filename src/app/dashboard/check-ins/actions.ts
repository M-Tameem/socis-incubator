"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkInSchema, fieldErrors } from "@/lib/validation";
import { sendCheckInReceipt } from "@/lib/email";

export type CheckInState = { errors?: Record<string, string>; saved?: boolean };

export async function submitCheckIn(
  _prev: CheckInState,
  formData: FormData,
): Promise<CheckInState> {
  const teamId = String(formData.get("team_id") ?? "");
  const raw = Object.fromEntries(formData) as Record<string, string>;

  const parsed = checkInSchema.safeParse({
    ...raw,
    behind_schedule: raw.behind_schedule === "on",
  });

  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("check_ins").insert({
    team_id: teamId,
    submitted_by: user?.id ?? null,
    ...parsed.data,
    blockers: parsed.data.blockers || null,
    help_needed: parsed.data.help_needed || null,
  });

  if (error) {
    return {
      errors: {
        form:
          error.code === "23505"
            ? "A check-in for that cycle has already been submitted. Pick the next cycle, or ask your executive contact to amend it."
            : "We could not save the check-in. Try again.",
      },
    };
  }

  const { data: team } = await supabase.from("teams").select("name").eq("id", teamId).single();
  if (user?.email && team) {
    await sendCheckInReceipt([user.email], team.name, parsed.data.cycle);
  }

  revalidatePath("/dashboard/check-ins");
  return { saved: true };
}
