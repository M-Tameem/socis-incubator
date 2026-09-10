import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { DemoAccountSwitcher } from "@/components/demo-account-switcher";
import { DEMO_STUDENT, demoEnabled, getDemoRole } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Student lifecycle demo",
  robots: { index: false, follow: false },
};

const steps = [
  ["01", "Apply", "Each person submits their own application."],
  ["02", "Team placement", "SOCIS confirms members and an executive contact."],
  ["03", "Scope review", "The team submits one proposal before development starts."],
  ["04", "Build", "One team check-in is submitted every two weeks."],
  ["05", "Demo Day", "The team freezes features, deploys, and presents."],
] as const;

export default async function StudentDemoPage() {
  if (!demoEnabled()) notFound();
  const role = await getDemoRole();
  if (!role) redirect("/login");
  if (role !== "student") redirect("/demo/exec");

  const data = DEMO_STUDENT;

  return (
    <div className="space-y-12">
      <PageHeader
        title="Student lifecycle"
        lede="A populated walkthrough from application to Demo Day. Maya is accepted, leads a team, and is midway through development."
      >
        <DemoAccountSwitcher active="student" />
      </PageHeader>

      <Alert>
        Local demo session. The records are fictional and read-only, so production data cannot be changed.
      </Alert>

      <ol className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-5">
        {steps.map(([number, title, detail]) => (
          <li key={number} className="bg-card p-4">
            <span className="font-mono text-xs text-brand">{number}</span>
            <p className="mt-2 font-medium">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
          </li>
        ))}
      </ol>

      <section className="space-y-5" aria-labelledby="student-profile">
        <h2 id="student-profile" className="text-xl font-semibold">Account profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>{data.profile.name}</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <DemoField label="Email" value={data.profile.email} />
              <DemoField label="Program" value={data.profile.program} />
              <DemoField label="Year" value={data.profile.year} />
              <DemoField label="GitHub" value={data.profile.github} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>No resume upload</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>The application collects structured answers, project history, and an optional GitHub link.</p>
              <p>This gives reviewers enough context for team placement without storing a sensitive document.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="student-application">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="student-application" className="text-xl font-semibold">Application</h2>
          <StatusBadge status={data.application.status} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Submitted answers</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <DemoField label="Submitted" value={data.application.submitted} />
              <DemoField label="Skills" value={data.application.skills} />
              <DemoField label="Interests" value={data.application.interests} />
              <DemoField label="Availability" value={data.application.availability} />
              <DemoField label="Goal" value={data.application.goals} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>What happens here</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>The student can see the current decision but cannot see reviewer notes.</p>
              <p>Friends apply together: each person lists the same teammates and project name.</p>
              <p>Once executives add the student to a team, the dashboard changes from application status to project work.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="student-idea">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="student-idea" className="text-xl font-semibold">Idea portal</h2>
          <Badge variant="good">{data.idea.status}</Badge>
        </div>
        <Card>
          <CardContent className="grid gap-5 pt-5 sm:grid-cols-[1fr_1fr]">
            <div>
              <p className="font-medium">{data.idea.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{data.idea.summary}</p>
            </div>
            <div>
              <p className="text-label">Private response</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{data.idea.response}</p>
              <p className="mt-2 text-xs text-muted-foreground">Email is revealed only after a student sends interest.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5" aria-labelledby="student-team">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="student-team" className="text-xl font-semibold">Team placement</h2>
          <StatusBadge status={data.team.status} />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader><CardTitle>{data.team.name}</CardTitle></CardHeader>
            <CardContent>
              <ul className="divide-y divide-border border-y border-border text-sm">
                {data.team.members.map((member) => (
                  <li key={member.name} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <span>{member.name}{member.lead ? <Badge className="ml-2">Lead</Badge> : null}</span>
                    <span className="text-muted-foreground">{member.role}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Team details</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <DemoField label="Executive contact" value={data.team.executive} />
              <DemoField label="Repository" value={data.team.repository} />
              <DemoField label="Communication" value={data.team.channel} />
              <p className="text-muted-foreground">Only the team lead edits shared project details.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="student-proposal">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="student-proposal" className="text-xl font-semibold">Project proposal</h2>
          <StatusBadge status={data.proposal.status} />
        </div>
        <Card>
          <CardContent className="grid gap-6 pt-5 md:grid-cols-2">
            <div className="space-y-4 text-sm">
              <DemoField label="Problem" value={data.proposal.problem} />
              <DemoField label="First usable version" value={data.proposal.mvp} />
              <DemoField label="Out of scope" value={data.proposal.excluded} />
            </div>
            <div className="rounded-md border border-border bg-secondary p-4">
              <p className="text-label">Executive feedback</p>
              <p className="mt-2 text-sm leading-6">{data.proposal.feedback}</p>
              <p className="mt-3 text-xs text-muted-foreground">Approved proposals lock until an executive requests changes.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5" aria-labelledby="student-checkins">
        <h2 id="student-checkins" className="text-xl font-semibold">Bi-weekly check-ins</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.checkIns.map((checkIn) => (
            <Card key={checkIn.cycle}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Cycle {checkIn.cycle}</CardTitle>
                  <Badge variant={checkIn.state === "On track" ? "good" : "warn"}>{checkIn.state}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <DemoField label="Completed" value={checkIn.completed} />
                <DemoField label="Next" value={checkIn.next} />
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="prose-page text-sm leading-6 text-muted-foreground">
          One member submits for the whole team. Behind-schedule answers and help requests appear in the executive follow-up queue.
        </p>
      </section>

      <section className="border-t border-border pt-8" aria-labelledby="student-demo-day">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="student-demo-day" className="text-xl font-semibold">Demo Day</h2>
          <Badge variant="outline">{data.demoDay.state}</Badge>
        </div>
        <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
          <DemoField label="Date" value={data.demoDay.date} />
          <DemoField label="Presentation slot" value={data.demoDay.slot} />
        </dl>
        <p className="prose-page mt-5 text-sm leading-6 text-muted-foreground">
          Executives publish the team only when its project page, repository, demo link, and presentation slot are ready.
        </p>
      </section>
    </div>
  );
}

function DemoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label">{label}</p>
      <p className="mt-1 leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
