import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { DemoAccountSwitcher } from "@/components/demo-account-switcher";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEMO_EXEC, DEMO_STUDENT, demoEnabled, getDemoRole } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Executive lifecycle demo",
  robots: { index: false, follow: false },
};

export default async function ExecutiveDemoPage() {
  if (!demoEnabled()) notFound();
  const role = await getDemoRole();
  if (!role) redirect("/login");
  if (role !== "exec") redirect("/demo/student");

  const data = DEMO_EXEC;

  return (
    <div className="space-y-12">
      <PageHeader
        title="Executive lifecycle"
        lede="The operating view for intake, team formation, proposal review, interventions, events, and project publication."
      >
        <DemoAccountSwitcher active="exec" />
      </PageHeader>

      <Alert>
        Local demo session. Controls are shown in context but are read-only, so no email or production record can change.
      </Alert>

      <section aria-label="Program counts" className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
        {[
          ["Applications", data.counts.applications],
          ["Accepted", data.counts.accepted],
          ["Teams", data.counts.teams],
          ["Need follow-up", data.counts.flagged],
        ].map(([label, value]) => (
          <div key={label} className="bg-card p-5">
            <p className="text-label">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-5" aria-labelledby="exec-applications">
        <div>
          <h2 id="exec-applications" className="text-xl font-semibold">Application review</h2>
          <p className="mt-1 text-sm text-muted-foreground">Executives see all submitted answers and private reviewer notes.</p>
        </div>
        <Card>
          <CardContent className="pt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.applications.map((application) => (
                  <TableRow key={application.name}>
                    <TableCell className="font-medium">{application.name}</TableCell>
                    <TableCell>{application.program}</TableCell>
                    <TableCell>{application.year}</TableCell>
                    <TableCell><StatusBadge status={application.status.replace(" ", "_")} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Selected application: Maya Chen</CardTitle></CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <div className="space-y-4 text-sm">
              <DemoField label="Skills" value={DEMO_STUDENT.application.skills} />
              <DemoField label="Interests" value={DEMO_STUDENT.application.interests} />
              <DemoField label="Availability" value={DEMO_STUDENT.application.availability} />
              <DemoField label="GitHub" value={DEMO_STUDENT.profile.github} />
              <DemoField label="Preferred teammates" value="Alex Morgan and Priya Shah" />
            </div>
            <div className="space-y-4 rounded-md border border-border bg-secondary p-4">
              <DemoField label="Private reviewer note" value="Strong scope judgment. Place with one experienced backend student." />
              <div className="flex flex-wrap gap-2">
                <Button disabled size="sm">Accept</Button>
                <Button disabled size="sm" variant="outline">Waitlist</Button>
                <Button disabled size="sm" variant="outline">Decline</Button>
              </div>
              <p className="text-xs text-muted-foreground">Decision emails are optional and sent only when the executive checks Notify.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5" aria-labelledby="exec-teams">
        <div>
          <h2 id="exec-teams" className="text-xl font-semibold">Team formation</h2>
          <p className="mt-1 text-sm text-muted-foreground">Portal conversations and teammate preferences inform placement. Executives create the official record.</p>
        </div>
        <Card>
          <CardContent className="pt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Team status</TableHead>
                  <TableHead>Proposal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.teams.map((team) => (
                  <TableRow key={team.name}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.members}</TableCell>
                    <TableCell>{team.lead}</TableCell>
                    <TableCell><StatusBadge status={team.status} /></TableCell>
                    <TableCell><StatusBadge status={team.proposal.replace(" ", "_")} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <p className="prose-page text-sm leading-6 text-muted-foreground">
          Adding a member uses their sign-in email. One member can be marked lead. The executive also records the team contact, communication channel, and initial status.
        </p>
      </section>

      <section className="space-y-5" aria-labelledby="exec-proposal">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="exec-proposal" className="text-xl font-semibold">Proposal review</h2>
          <StatusBadge status="approved" />
        </div>
        <Card>
          <CardContent className="grid gap-6 pt-5 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4 text-sm">
              <DemoField label="Problem" value={DEMO_STUDENT.proposal.problem} />
              <DemoField label="First usable version" value={DEMO_STUDENT.proposal.mvp} />
              <DemoField label="Out of scope" value={DEMO_STUDENT.proposal.excluded} />
            </div>
            <div className="space-y-4 rounded-md border border-border p-4">
              <DemoField label="Feedback sent to team" value={DEMO_STUDENT.proposal.feedback} />
              <div className="flex flex-wrap gap-2">
                <Button disabled size="sm">Approve</Button>
                <Button disabled size="sm" variant="outline">Request changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5" aria-labelledby="exec-followup">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="exec-followup" className="text-xl font-semibold">Follow-up queue</h2>
          <Badge variant="warn">{data.flaggedCheckIns.length} flagged</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {data.flaggedCheckIns.map((checkIn) => (
            <Card key={checkIn.team}>
              <CardHeader><CardTitle>{checkIn.team}</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <DemoField label="Reported issue" value={checkIn.issue} />
                <DemoField label="Requested help" value={checkIn.request} />
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="prose-page text-sm leading-6 text-muted-foreground">
          This is the intervention point. The executive contacts the team, records any change outside the site, and adjusts status if the project remains behind.
        </p>
      </section>

      <section className="space-y-5 border-t border-border pt-8" aria-labelledby="exec-operations">
        <h2 id="exec-operations" className="text-xl font-semibold">Program operations</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {data.upcoming.map((item) => (
            <Card key={item.item}>
              <CardContent className="pt-5">
                <p className="font-medium">{item.item}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <ul className="prose-page list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          <li>Settings control application dates, deadlines, contact details, and Demo Day information.</li>
          <li>Events are drafted privately and published when details are final.</li>
          <li>Completed teams appear publicly only after an executive enables the showcase flag.</li>
          <li>Idea authors and executives can close posts; private responses remain restricted.</li>
        </ul>
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
