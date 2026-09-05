import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PHASES, ELIGIBILITY, EXPECTATIONS, EXEC_ROLES, CHECK_IN_QUESTIONS, PROGRAM } from "@/lib/program";

export const metadata: Metadata = {
  title: "How it works",
  description: "What the SOCIS Computer Science Incubator is, who it is for, and what is expected of you.",
};

export default function AboutPage() {
  return (
    <div className="space-y-14">
      <PageHeader
        title="How it works"
        lede="Teams of three to five build one project over a semester. SOCIS sets deadlines and helps when a team gets stuck."
      />

      <section>
        <h2 className="text-xl font-semibold">What you leave with</h2>
        <ul className="prose-page mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>A working project with a useful README</li>
          <li>Experience planning and reviewing code with a team</li>
          <li>Feedback from people outside your group</li>
          <li>A public Demo Day presentation</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Who can apply</h2>
        <ul className="prose-page mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          {ELIGIBILITY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">What we expect from you</h2>
        <ul className="prose-page mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          {EXPECTATIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">The four phases</h2>
        <ol className="mt-6 space-y-10">
          {PHASES.map((phase) => (
            <li key={phase.number}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-base font-medium">{phase.name}</h3>
                <span className="text-sm text-muted-foreground">{phase.weeks}</span>
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
        <h2 className="text-xl font-semibold">Bi-weekly check-ins</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Every two weeks, one person submits a five-minute update for the team. SOCIS uses it
          to spot blockers early.
        </p>
        <ul className="prose-page mt-4 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {CHECK_IN_QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Keep the scope small</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          The project must be usable by Week 11. We review proposals in Week 2 and cut features
          that put the deadline at risk. After feature freeze, teams fix and document what they
          already have.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Money</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Teams can request about $100 to $150 for approved project costs. Ask Finance and
          Operations before spending and keep the receipt. Reimbursement is processed after
          the team presents at Demo Day.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Who runs it</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          SOCIS executives run the program. Your team gets one contact for questions and
          blockers.
        </p>
        <dl className="mt-6 divide-y divide-border border-y border-border">
          {EXEC_ROLES.map((role) => (
            <div key={role.title} className="grid gap-1 py-3 sm:grid-cols-[16rem_1fr] sm:gap-8">
              <dt className="font-medium">{role.title}</dt>
              <dd className="text-muted-foreground">{role.duties}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-semibold">Apply</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          The form takes about fifteen minutes. Teammates and project ideas are optional.
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
