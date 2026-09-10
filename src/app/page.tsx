import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PROGRAM, PHASES, TOOLING, LATE_SEMESTER_NOTE } from "@/lib/program";
import { getSettings, getApplicationStatus } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { JellyfishMark } from "@/components/jellyfish-mark";

export default async function HomePage() {
  const settings = await getSettings();
  const applicationStatus = getApplicationStatus(settings);
  const open = applicationStatus === "open";
  const applicationLabel = applicationStatus === "upcoming"
    ? `open ${formatDate(settings.applications_open, { year: undefined })}`
    : applicationStatus;

  const facts = [
    ["Length", PROGRAM.lengthWeeks],
    ["Team size", PROGRAM.teamSize],
    ["Fall cohort", `${PROGRAM.targetTeams} / ${PROGRAM.targetStudents}`],
    ["Weekly time", "4–6 hours"],
    ["Cost", "Free"],
    [
      "Demo Day",
      settings.demo_day_date ? formatDate(settings.demo_day_date) : "TBD",
    ],
  ];

  return (
    <div className="space-y-20">
      <section className="grid items-center gap-6 py-4 sm:py-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div>
          <p className="text-label">{PROGRAM.term} · Applications {applicationLabel}</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-7xl">
            <span className="block">Build a project.</span>
            <span className="block">Ship it this semester.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
            SOCIS Incubator helps Computer Science and Software Engineering students take one
            useful idea to a working project by the end of the semester.
          </p>
          <p className="prose-page mt-4 leading-7 text-muted-foreground">
            Bring friends or meet people around an idea and apply together. Solo applicants are
            welcome too. Build your project, pitch at the Wood Centre on November 19, and present
            at SOCIS Demo Day (date TBD).
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {open ? (
              <Button asChild>
                <Link href="/apply">Apply for Fall 2026</Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                {applicationStatus === "upcoming" ? `Applications ${applicationLabel}` : "Applications are closed"}
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
        </div>
        <JellyfishMark className="size-36 justify-self-center text-brand sm:size-48 lg:size-60 lg:rotate-6" />
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
              <div className="text-sm text-muted-foreground">
                <p>{phase.weeks}</p>
                <p className="mt-1 text-xs">{phase.dates}</p>
              </div>
              <div>
                <h3 className="font-medium">{phase.name}</h3>
                <p className="prose-page mt-1 leading-7 text-muted-foreground">{phase.summary}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="prose-page mt-5 text-sm text-muted-foreground">{LATE_SEMESTER_NOTE}</p>

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
