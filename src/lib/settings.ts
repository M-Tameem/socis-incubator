import { createClient } from "@/lib/supabase/server";
import { PROGRAM, PROGRAM_DATES } from "@/lib/program";
import { getApplicationStatus } from "@/lib/application-window";
export { getApplicationStatus } from "@/lib/application-window";

export type Settings = Record<string, string>;

const FALLBACK: Settings = {
  ...PROGRAM_DATES,
  contact_email: PROGRAM.contactEmail,
  discord_url: "https://discord.gg/socis",
};

/**
 * Dates and links the executive team edits during the semester. Falls back to
 * the current semester's schedule before anything has been saved.
 */
export async function getSettings(): Promise<Settings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("program_settings").select("key, value");
    const rows = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
    // Existing deployments may still have the original seed address saved.
    if (!rows.contact_email?.trim() || rows.contact_email.trim().toLowerCase() === "incubator@socis.ca") {
      rows.contact_email = PROGRAM.contactEmail;
    }
    return { ...FALLBACK, ...rows };
  } catch {
    return FALLBACK;
  }
}

/** True during the configured application dates, in Guelph local time. */
export function applicationsOpen(settings: Settings) {
  return getApplicationStatus(settings) === "open";
}
