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
        lede="Teams of three to five build one project over a semester. SOCIS sets deadlines and helps when a team gets stuck."
      />

      <section>
        <h2 className="text-xl font-semibold">What you leave with</h2>
        <ul className="prose-page mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>A working project by the end of the semester, with a useful README</li>
          <li>Experience planning and reviewing code with a team</li>
          <li>Feedback from people outside your group</li>
          <li>A pitch at the Wood Centre on November 19 and a SOCIS Demo Day presentation (date TBD)</li>
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
        <h2 className="text-xl font-semibold">How teams are formed</h2>
        <div className="prose-page mt-3 space-y-3 leading-7 text-muted-foreground">
          <p>
            Bring a group of three to five friends, or meet people around an idea and apply
            together. Each person fills out the same application and lists the same teammates
            and project name so we can record your group.
          </p>
          <p>
            Use the idea portal to share an idea, chat with people who like it, and form a group.
            You can revise your application, teammates, and project idea through September 27.
          </p>
          <p>
            If you do not have a group or an idea yet, apply solo by the same deadline. SOCIS
            will help you find a team and give each group an executive contact for support.
          </p>
        </div>
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
          Build a working project by semester&apos;s end. Choose a small first version, then use
          feedback and check-ins to keep it achievable. Weeks 10–13 focus on finalizing and
          presenting; detailed arrangements are TBD, with the Wood Centre pitch on November 19.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Money</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Teams can request microgrants of {PROGRAM.microgrant} for approved project costs. Ask Finance and
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
