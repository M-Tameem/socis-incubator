import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Application received" };

export default async function SubmittedPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your application is in"
        lede="A confirmation is on its way. Check your spam folder if it does not arrive."
      />

      <div className="prose-page space-y-4 text-muted-foreground">
        <p>
          We review applications as they arrive. Team placement starts after
          applications close
          {settings.applications_close ? ` on ${formatDate(settings.applications_close)}` : ""}.
          We will email every applicant with a decision.
        </p>
        <p>
          Join the SOCIS Discord for announcements. The{" "}
          <Link href="/timeline" className="text-link underline underline-offset-4 hover:no-underline">
            timeline
          </Link>{" "}
          shows the semester schedule.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Need to change an answer? Email{" "}
        <a
          href={`mailto:${settings.contact_email}`}
          className="text-link underline underline-offset-4 hover:no-underline"
        >
          {settings.contact_email}
        </a>
        .
      </p>
    </div>
  );
}
