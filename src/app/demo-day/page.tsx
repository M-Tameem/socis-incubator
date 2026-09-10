import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Demo Day",
  description: "The end-of-semester showcase where incubator teams present what they built.",
};

export const revalidate = 300;

export default async function DemoDayPage() {
  const settings = await getSettings();
  const supabase = await createClient();

  const { data: teams } = await supabase
    .from("teams")
    .select("id, name, slug, tagline, demo_day_slot, github_url, demo_url")
    .eq("showcased", true)
    .order("demo_day_slot", { nullsFirst: false });

  const { data: demoDayEvent } = await supabase
    .from("events")
    .select("rsvp_url, location, starts_at")
    .eq("kind", "demo_day")
    .eq("published", true)
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const dateLabel = settings.demo_day_date ? formatDate(settings.demo_day_date) : null;
  const rsvpUrl = demoDayEvent?.rsvp_url;

  return (
    <div className="space-y-14">
      <PageHeader
        title="Demo Day"
        lede="Finish the semester with a working project and somewhere to present it. SOCIS Demo Day's date and format are TBD; details will follow as plans are confirmed."
      >
        <p className="prose-page text-sm text-muted-foreground">
          Build a working project by semester&apos;s end. Teams will also pitch at the Wood
          Centre&apos;s Open Pitch Night on November 19 at the Bullring. SOCIS Demo Day&apos;s date is TBD.
        </p>
      </PageHeader>

      <section>
        <h2 className="text-lg font-semibold">Details</h2>
        <dl className="mt-4 divide-y divide-border border-y border-border">
          <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-8">
            <dt className="text-muted-foreground">Date</dt>
            <dd>{dateLabel ?? "TBD"}</dd>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-8">
            <dt className="text-muted-foreground">Time</dt>
            <dd>{settings.demo_day_time || "TBD"}</dd>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-8">
            <dt className="text-muted-foreground">Location</dt>
            <dd>{settings.demo_day_location || demoDayEvent?.location || "TBD"}</dd>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-8">
            <dt className="text-muted-foreground">Cost</dt>
            <dd>Free</dd>
          </div>
        </dl>

        {rsvpUrl ? (
          <div className="mt-6">
            <Button asChild>
              <a href={rsvpUrl}>RSVP for Demo Day</a>
            </Button>
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="text-lg font-semibold">What we&apos;re planning</h2>
        <p className="prose-page mt-3 text-muted-foreground">
          Teams will present their projects. The outline below is provisional; the final
          format, schedule, and guest lineup are TBD.
        </p>
        <dl className="mt-4 divide-y divide-border border-y border-border">
          {[
            ["Presentations", "Each team explains the project and runs a live demo."],
            ["Feedback", "Discuss what you built, the decisions you made, and what comes next."],
            ["Open demos", "Guests can try the projects and speak with each team."],
          ].map(([label, detail]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-8">
              <dt className="font-medium">{label}</dt>
              <dd className="text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
        <p className="prose-page mt-4 text-sm text-muted-foreground">
          Prizes and industry participation are TBD. Collaborators will be announced as
          they are confirmed.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Presenting teams</h2>
        {teams && teams.length > 0 ? (
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {teams.map((team) => (
              <li key={team.id} className="py-5">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  {team.demo_day_slot ? (
                    <span className="text-sm text-muted-foreground">{team.demo_day_slot}</span>
                  ) : null}
                  <h3 className="font-medium">
                    <Link href={`/projects/${team.slug}`} className="hover:text-link">
                      {team.name}
                    </Link>
                  </h3>
                </div>
                {team.tagline ? (
                  <p className="prose-page mt-1 text-muted-foreground">{team.tagline}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">
            Presenting teams and their slots will be announced once the event schedule is confirmed.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold">For teams</h2>
        <div className="prose-page mt-3 space-y-4 text-muted-foreground">
          <p>
            Presenting is required for expense reimbursement. If the project is unfinished,
            show the working parts and explain where the plan changed.
          </p>
          <p>
            Before the event, freeze features and clean up the repository. Rehearse on the
            computer you will present from.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">For alumni, mentors, and recruiters</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          If you would like to attend, judge, or sponsor a prize,{" "}
          <Link href="/contact" className="text-link underline underline-offset-4 hover:no-underline">
            get in touch
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
