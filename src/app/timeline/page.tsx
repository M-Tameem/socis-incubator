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
    ["Demo Day", settings.demo_day_date],
  ] as [string, string][];

  return (
    <div className="space-y-14">
      <PageHeader
        title="Timeline"
        lede="Week 1 starts September 14, 2026. Build through the fall, then polish your project and prepare to share it."
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
        <p className="prose-page mt-2 text-muted-foreground">
          All dates are in 2026. Weeks run Monday to Sunday; deadlines use Guelph local time.
          The Wood Centre pitch is November 19; SOCIS Demo Day&apos;s date will be announced separately.
        </p>
        <p className="prose-page mt-3 text-muted-foreground">{LATE_SEMESTER_NOTE}</p>
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

      <section>
        <h2 className="text-xl font-semibold">Schedule</h2>
        <dl className="mt-5 divide-y divide-border border-y border-border">
          {MILESTONES.map((m) => (
            <div key={`${m.when}-${m.label}`} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <dt className="text-sm text-muted-foreground">{m.when}</dt>
              <dd>
                <span className="font-medium">{m.label}</span>
                <p className="prose-page mt-0.5 text-muted-foreground">{m.detail}</p>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Phases</h2>
        <div className="mt-5 grid gap-8 sm:grid-cols-2">
          {PHASES.map((phase) => (
            <div key={phase.number}>
              <h3 className="font-medium">{phase.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{phase.weeks} · {phase.dates}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
