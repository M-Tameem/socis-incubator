"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { proposalSchema, fieldErrors } from "@/lib/validation";

export type ProposalState = { errors?: Record<string, string>; saved?: boolean; submitted?: boolean };

export async function saveProposal(
  _prev: ProposalState,
  formData: FormData,
): Promise<ProposalState> {
  const teamId = String(formData.get("team_id") ?? "");
  const intent = String(formData.get("intent") ?? "save");
  const parsed = proposalSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const status = intent === "submit" ? "submitted" : "draft";

  const { error } = await supabase.from("proposals").upsert(
    {
      team_id: teamId,
      ...parsed.data,
      out_of_scope: parsed.data.out_of_scope || null,
      status,
      submitted_at: intent === "submit" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "team_id" },
  );

  if (error) {
    return {
      errors: {
        form: "We could not save the proposal. Approved proposals are locked. Contact your executive if it needs to change.",
      },
    };
  }

  revalidatePath("/dashboard/proposal");
  return intent === "submit" ? { submitted: true } : { saved: true };
}
