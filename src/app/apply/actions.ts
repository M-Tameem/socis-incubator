"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { applicationSchema, fieldErrors } from "@/lib/validation";
import { sendApplicationReceived, sendNewApplicationAlert } from "@/lib/email";
import { applicationsOpen, getSettings } from "@/lib/settings";
import { applicationAnswers } from "@/lib/application-form";

export type ApplyState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
  saved?: boolean;
  updatedAt?: string;
};

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { errors: { form: "Sign in before submitting your application." }, values: raw };

  if (!applicationsOpen(await getSettings())) {
    return {
      errors: { form: "Applications are not open. Check the timeline for this semester's dates." },
      values: raw,
    };
  }

  const parsed = applicationSchema.safeParse({
    ...raw,
    email: user.email,
    applying_with_team: raw.applying_with_team === "on",
    has_project_idea: raw.has_project_idea === "on",
  });

  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: raw };
  }

  const values = parsed.data;

  const { error } = await supabase.from("applications").insert({
    ...applicationAnswers(values),
    email: values.email.toLowerCase(),
    user_id: user.id,
  });

  if (error) {
    const duplicate = error.code === "23505";
    return {
      errors: {
        form: duplicate
          ? "An application already exists for this email. If it was submitted before you created your account, contact SOCIS to link it."
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

export async function updateApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || !user.email_confirmed_at) {
    return { errors: { form: "Sign in with your application email to save changes." }, values: raw };
  }
  if (!applicationsOpen(await getSettings())) {
    return { errors: { form: "The application deadline has passed. Your last saved answers are still submitted." }, values: raw };
  }
  const parsed = applicationSchema.safeParse({
    ...raw,
    email: user.email,
    applying_with_team: raw.applying_with_team === "on",
    has_project_idea: raw.has_project_idea === "on",
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: raw };

  const { data, error } = await supabase.rpc("revise_my_application", {
    application_id: raw.application_id ?? "",
    expected_updated_at: raw.updated_at ?? "",
    application_values: applicationAnswers(parsed.data),
  });
  if (error || !data) {
    return {
      errors: { form: "We could not save your changes. The deadline may have passed, or this application changed in another tab. Refresh and try again." },
      values: raw,
    };
  }
  revalidatePath("/apply");
  revalidatePath("/dashboard");
  revalidatePath("/admin/applications");
  return { saved: true, updatedAt: data, values: raw };
}
