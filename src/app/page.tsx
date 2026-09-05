import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PROGRAM, PHASES, TOOLING } from "@/lib/program";
import { getSettings, applicationsOpen } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { JellyfishMark } from "@/components/experiments/jellyfish-mark";

export default async function HomePage() {
  const settings = await getSettings();
  const open = applicationsOpen(settings);
  const showMascot = process.env.NEXT_PUBLIC_SHOW_MASCOT === "true";

  const facts = [
    ["Length", PROGRAM.lengthWeeks],
    ["Team size", PROGRAM.teamSize],
    ["Fall cohort", `${PROGRAM.targetTeams} / ${PROGRAM.targetStudents}`],
    ["Weekly time", "4–6 hours"],
    ["Cost", "Free"],
    [
      "Demo Day",
      settings.demo_day_date ? formatDate(settings.demo_day_date) : "End of the semester",
    ],
  ];

  return (
    <div className="space-y-20">
      <section className="relative isolate max-w-4xl overflow-hidden py-4 sm:overflow-visible sm:py-8">
        {showMascot ? (
          <JellyfishMark className="absolute -right-44 -top-8 -z-10 hidden size-80 rotate-6 text-brand opacity-55 sm:block" />
        ) : null}
        <p className="text-label">{PROGRAM.term} · Applications {open ? "open" : "closed"}</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-7xl">
          <span className="block">Build a project.</span>
          <span className="block">Ship it this semester.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-xl leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
          SOCIS Incubator helps Computer Science and Software Engineering students take one
          useful idea from proposal to working demo.
        </p>
        <p className="prose-page mt-4 leading-7 text-muted-foreground">
          Apply alone or with people you know. You can bring an idea, but you do not need one.
          Expect four to six hours of project work each week.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {open ? (
            <Button asChild>
              <Link href="/apply">Apply for Fall 2026</Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Applications are closed
            </Button>
          )}
          <Link href="/about" className="text-sm text-link underline underline-offset-4 hover:no-underline">
            How the program works
          </Link>
          {open ? (
            <Link href="/ideas" className="text-sm text-link underline underline-offset-4 hover:no-underline">
              Find an idea or teammates
            </Link>
          ) : null}
        </div>

        {open && settings.applications_close ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Applications close {formatDate(settings.applications_close)}.
          </p>
        ) : null}
      </section>

      <section aria-label="Program details" className="border-y border-border">
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {facts.map(([term, value]) => (
            <div key={term} className="border-b border-border py-5 sm:border-b-0 sm:pr-5">
              <dt className="text-label">{term}</dt>
              <dd className="mt-2 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="phases">
        <h2 id="phases" className="text-2xl font-semibold">
          The semester
        </h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Most weeks are for building. Check-ins and scope reviews keep the work moving.
        </p>

        <ol className="mt-8 divide-y divide-border border-y border-border">
          {PHASES.map((phase) => (
            <li key={phase.number} className="grid gap-3 py-6 sm:grid-cols-[3rem_10rem_1fr] sm:gap-8">
              <div className="font-mono text-xs text-muted-foreground">
                {String(phase.number).padStart(2, "0")}
              </div>
              <div className="text-sm text-muted-foreground">{phase.weeks}</div>
              <div>
                <h3 className="font-medium">{phase.name}</h3>
                <p className="prose-page mt-1 leading-7 text-muted-foreground">{phase.summary}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm">
          <Link href="/timeline" className="text-link underline underline-offset-4 hover:no-underline">
            See the full timeline and important dates
          </Link>
        </p>
      </section>

      <section aria-labelledby="tools">
        <h2 id="tools" className="text-2xl font-semibold">
          Where things live
        </h2>
        <p className="prose-page mt-2 text-muted-foreground">
          The site handles program records. Work and conversation stay in the tools teams
          already use.
        </p>
        <dl className="mt-6 divide-y divide-border border-y border-border">
          {TOOLING.map((row) => (
            <div key={row.tool} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <dt className="font-medium">{row.tool}</dt>
              <dd className="text-muted-foreground">{row.use}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-border pt-10">
        <h2 className="text-2xl font-semibold">Questions?</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Check the{" "}
          <Link href="/faq" className="text-link underline underline-offset-4 hover:no-underline">
            FAQ
          </Link>{" "}
          first. You can also email{" "}
          <a
            href={`mailto:${settings.contact_email || PROGRAM.contactEmail}`}
            className="text-link underline underline-offset-4 hover:no-underline"
          >
            {settings.contact_email || PROGRAM.contactEmail}
          </a>{" "}
          or ask in Discord.
        </p>
      </section>
    </div>
  );
}
