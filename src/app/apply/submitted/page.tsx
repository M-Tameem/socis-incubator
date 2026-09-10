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
        lede="Your application is saved. You can return to it and make changes until the deadline."
      />

      <div className="prose-page space-y-4 text-muted-foreground">
        <p>
          Your teammates and project idea are included in your application. You can update
          them as plans come together until applications close
          {settings.applications_close ? ` on ${formatDate(settings.applications_close)}` : ""}.
          We will follow up with program details and help solo applicants find a group.
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
        <Link href="/apply" className="text-link underline underline-offset-4 hover:no-underline">
          Edit your application
        </Link>{" "}
        from your account. Changes are available until the deadline.
      </p>
    </div>
  );
}
