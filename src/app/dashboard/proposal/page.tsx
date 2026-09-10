import type { Metadata } from "next";
import { getMyTeam } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProposalForm } from "@/app/dashboard/proposal/proposal-form";
import { StatusBadge } from "@/components/status-badge";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Project proposal" };

export default async function ProposalPage() {
  const team = await getMyTeam();

  if (!team) {
    return <Alert>Add your project idea to your application. Your group can develop its detailed project plan here after joining.</Alert>;
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
          Develop your group&apos;s project plan after joining. Your application already includes
          your initial idea; use this space to agree on a first version, roles, and next steps.
          Your executive contact can help keep the scope achievable.
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
