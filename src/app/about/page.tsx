import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { JellyfishMark } from "@/components/jellyfish-mark";
import { Button } from "@/components/ui/button";
import { PHASES, ELIGIBILITY, EXPECTATIONS, EXEC_ROLES, CHECK_IN_QUESTIONS, PROGRAM, LATE_SEMESTER_NOTE } from "@/lib/program";

export const metadata: Metadata = {
  title: "How it works",
  description: "What the SOCIS Computer Science Incubator is, who it is for, and what is expected of you.",
};

export default function AboutPage() {
  return (
    <div className="space-y-14">
      <PageHeader
        title="How it works"
        illustration={<JellyfishMark className="size-36 justify-self-center text-brand sm:size-48" />}
        lede="Teams of 3–5 students spend one semester building a working project. SOCIS provides structure, check-ins, workshops, and support when teams get stuck."
      />

      <section>
        <h2 className="text-xl font-semibold">Who can apply</h2>
        <ul className="prose-page mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          {ELIGIBILITY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Your commitment</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Plan for 4–6 hours a week. Teams also need to:
        </p>
        <ul className="prose-page mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          {EXPECTATIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Build something small first</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Start with the smallest useful version of your idea. Build that first, get feedback, then decide what&apos;s worth adding.
        </p>
      </section>

            <section>
        <h2 className="text-xl font-semibold">How teams form</h2>
        <p className="prose-page mt-3 text-muted-foreground">You can:</p>
        <ul className="prose-page mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Apply with 3–5 friends</li>
          <li>Find teammates through the Idea Portal</li>
          <li>Apply solo and let SOCIS help you find a team</li>
        </ul>
        <p className="prose-page mt-4 leading-7 text-muted-foreground">
          Only one person per team needs to submit the application. You can change your
          teammates or project idea until September 27.
        </p>
        <p className="mt-5 text-sm">
          <Link href="/ideas" className="text-link underline underline-offset-4 hover:no-underline">
            Browse project ideas
          </Link>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">The four phases</h2>
        <p className="prose-page mt-3 text-muted-foreground">{LATE_SEMESTER_NOTE}</p>
        <ol className="mt-6 space-y-10">
          {PHASES.map((phase) => (
            <li key={phase.number}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-base font-medium">{phase.name}</h3>
                <span className="text-sm text-muted-foreground">{phase.weeks} · {phase.dates}</span>
              </div>
              <p className="prose-page mt-1 text-muted-foreground">{phase.summary}</p>
              <ul className="prose-page mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Support</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Every team has a SOCIS executive contact for questions. Workshops, mentors, and other support will be announced throughout the semester.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Project Costs</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Microgrants of {PROGRAM.microgrant} are available for approved project costs. Get approval from Finance and Operations before spending.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">What you leave with</h2>
        <ul className="prose-page mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>A working project</li>
          <li>A GitHub repository and README</li>
          <li>Experience building with a team</li>
          <li>Feedback on your work</li>
          <li>Experience presenting a project</li>
        </ul>
      </section>

      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-semibold">Apply</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Apply with your group or on your own using the same form. Add or revise your teammates
          and project idea until September 27.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button asChild>
            <Link href="/apply">Apply to the incubator</Link>
          </Button>
          <Link href="/faq" className="text-sm text-link underline underline-offset-4 hover:no-underline">
            Read the FAQ
          </Link>
          <a
            href={PROGRAM.discordUrl}
            className="text-sm text-link underline underline-offset-4 hover:no-underline"
          >
            Join the Discord
          </a>
        </div>
      </section>
    </div>
  );
}
