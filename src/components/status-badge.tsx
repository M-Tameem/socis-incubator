import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus, ProposalStatus, TeamStatus } from "@/lib/types";

const LABELS: Record<string, { label: string; variant: "default" | "good" | "warn" | "bad" | "outline" }> = {
  // Applications
  submitted: { label: "Submitted", variant: "default" },
  under_review: { label: "Under review", variant: "default" },
  waitlisted: { label: "Waitlisted", variant: "warn" },
  accepted: { label: "Accepted", variant: "good" },
  declined: { label: "Not accepted", variant: "outline" },
  withdrawn: { label: "Withdrawn", variant: "outline" },
  // Teams
  forming: { label: "Forming", variant: "default" },
  active: { label: "Active", variant: "good" },
  behind: { label: "Behind", variant: "warn" },
  inactive: { label: "Inactive", variant: "bad" },
  completed: { label: "Completed", variant: "good" },
  // Proposals
  draft: { label: "Draft", variant: "outline" },
  changes_requested: { label: "Changes requested", variant: "warn" },
  approved: { label: "Approved", variant: "good" },
};

export function StatusBadge({
  status,
}: {
  status: ApplicationStatus | TeamStatus | ProposalStatus | string;
}) {
  const meta = LABELS[status] ?? { label: status, variant: "default" as const };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
