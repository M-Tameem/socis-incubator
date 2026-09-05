"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { applicationSchema, fieldErrors } from "@/lib/validation";
import { sendApplicationReceived, sendNewApplicationAlert } from "@/lib/email";
import { applicationsOpen, getSettings } from "@/lib/settings";

export type ApplyState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  if (!applicationsOpen(await getSettings())) {
    return {
      errors: { form: "Applications for this semester are closed." },
      values: raw,
    };
  }

  const parsed = applicationSchema.safeParse({
    ...raw,
    applying_with_team: raw.applying_with_team === "on",
    has_project_idea: raw.has_project_idea === "on",
  });

  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: raw };
  }

  const values = parsed.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("applications").insert({
    ...values,
    github_url: values.github_url || null,
    previous_projects: values.previous_projects || null,
    teammates: values.teammates || null,
    project_idea: values.project_idea || null,
    user_id: user?.id ?? null,
  });

  if (error) {
    const duplicate = error.code === "23505";
    return {
      errors: {
        form: duplicate
          ? "There is already an application with this email address. Email us if you need to change your answers."
          : "We could not save your application. Try again, and email us if it keeps failing.",
      },
      values: raw,
    };
  }

  await Promise.all([
    sendApplicationReceived(values.email, values.full_name.split(" ")[0]),
    sendNewApplicationAlert(values.full_name, values.program),
  ]);

  redirect("/apply/submitted");
}
