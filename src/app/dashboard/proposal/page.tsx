import type { Metadata } from "next";
import { getMyTeam } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProposalForm } from "@/app/dashboard/proposal/proposal-form";
import { StatusBadge } from "@/components/status-badge";
import { Alert } from "@/components/ui/alert";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Project proposal" };

export default async function ProposalPage() {
  const team = await getMyTeam();
  const settings = await getSettings();

  if (!team) {
    return <Alert>You need to be on a team before you can submit a proposal.</Alert>;
  }

  const supabase = await createClient();
  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("team_id", team.id)
    .maybeSingle();

  return (
    <div className="space-y-10">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Project proposal</h1>
          {proposal ? <StatusBadge status={proposal.status} /> : null}
        </div>
        <p className="prose-page mt-3 text-muted-foreground">
          One proposal per team, submitted in Week 2
          {settings.proposals_due ? ` by ${formatDate(settings.proposals_due)}` : ""}. We read it
          for scope more than polish. If we think you cannot finish it in ten weeks, we will
          say so and help you cut it down.
        </p>
      </div>

      {proposal?.status === "changes_requested" && proposal.feedback ? (
        <Alert variant="error">
          <p className="font-medium">Changes requested</p>
          <p className="mt-1 whitespace-pre-line">{proposal.feedback}</p>
        </Alert>
      ) : null}

      {proposal?.status === "approved" ? (
        <Alert variant="success">
          <p className="font-medium">Approved</p>
          <p className="mt-1">
            {proposal.feedback ?? "Your scope looks reasonable. Start building."}
          </p>
        </Alert>
      ) : null}

      <ProposalForm
        teamId={team.id}
        proposal={proposal}
        locked={proposal?.status === "approved"}
      />
    </div>
  );
}
