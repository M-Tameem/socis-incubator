import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { MILESTONES, PHASES, PROGRAM_WEEKS, LATE_SEMESTER_NOTE } from "@/lib/program";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Program phases, deadlines, and important dates for the semester.",
};

export default async function TimelinePage() {
  const settings = await getSettings();

  const keyDates = [
    ["Applications open", settings.applications_open],
    ["Applications and project ideas due", settings.applications_close],
    ["Help finding teammates", settings.teams_announced],
    ["Wood Centre Open Pitch Night", "2026-11-19"],
    ["SOCIS Demo Day", settings.demo_day_date],
  ] as [string, string][];

  return (
    <div className="space-y-14">
      <PageHeader
        title="Timeline"
        lede="Week 1 starts September 14, 2026. Weeks run Monday to Sunday."
      />

      {keyDates.length > 0 ? (
        <section>
          <h2 className="text-xl font-semibold">Important dates</h2>
          <dl className="mt-5 divide-y divide-border border-y border-border">
            {keyDates.map(([label, value]) => (
              <div key={label} className="grid gap-1 py-3 sm:grid-cols-[16rem_1fr] sm:gap-8">
                <dt className="font-medium">{label}</dt>
                <dd className="text-muted-foreground">{value ? formatDate(value) : "TBD"}</dd>
              </div>
            ))}
          </dl>
          {settings.demo_day_location ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Demo Day is at {settings.demo_day_location}
              {settings.demo_day_time ? `, ${settings.demo_day_time}` : ""}.
            </p>
          ) : null}
        </section>
      ) : null}

      <section>
        <h2 className="text-xl font-semibold">Week by week</h2>
        <ol className="mt-5 divide-y divide-border border-y border-border">
          {PROGRAM_WEEKS.map((week) => (
            <li key={week.number} className="grid gap-1 py-4 sm:grid-cols-[5rem_14rem_1fr] sm:gap-6">
              <span className="font-medium">Week {week.number}</span>
              <span className="text-sm text-muted-foreground">{week.dates}</span>
              <p className="text-sm text-muted-foreground">{week.focus}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
