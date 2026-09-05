import { createClient } from "@/lib/supabase/server";

export type Settings = Record<string, string>;

const FALLBACK: Settings = {
  applications_open: "",
  applications_close: "",
  teams_announced: "",
  proposals_due: "",
  demo_day_date: "",
  demo_day_time: "",
  demo_day_location: "",
  contact_email: "incubator@socis.ca",
  discord_url: "https://discord.gg/socis",
};

/**
 * Dates and links the executive team edits during the semester. Falls back to
 * empty strings so the site still renders before anything has been set.
 */
export async function getSettings(): Promise<Settings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("program_settings").select("key, value");
    const rows = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
    return { ...FALLBACK, ...rows };
  } catch {
    return FALLBACK;
  }
}

/** True while applications are open, based on the configured close date. */
export function applicationsOpen(settings: Settings) {
  if (!settings.applications_close) return true;
  return new Date(settings.applications_close).getTime() + 86_400_000 > Date.now();
}
