import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { updateSettings } from "@/app/admin/settings/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Program settings" };

const FIELDS = [
  { key: "applications_open", label: "Applications open", type: "date" },
  { key: "applications_close", label: "Applications close", type: "date" },
  { key: "teams_announced", label: "Help finding teammates begins", type: "date" },
  { key: "demo_day_date", label: "Demo Day date", type: "date" },
  { key: "demo_day_time", label: "Demo Day time", type: "text" },
  { key: "demo_day_location", label: "Demo Day location", type: "text" },
  { key: "contact_email", label: "Contact email", type: "email" },
  { key: "discord_url", label: "Discord invite", type: "url" },
] as const;

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Program settings</h1>
        <p className="prose-page mt-2 text-muted-foreground">
          The dates and links shown across the public site. The application form closes
          automatically the day after the closing date.
        </p>
      </div>

      <form action={updateSettings} className="max-w-lg space-y-5">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-1">
            <label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </label>
            <Input
              id={field.key}
              name={field.key}
              type={field.type}
              defaultValue={settings[field.key] ?? ""}
            />
          </div>
        ))}

        <Button type="submit">Save settings</Button>
      </form>
    </div>
  );
}
