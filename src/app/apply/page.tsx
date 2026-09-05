import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ApplicationForm } from "@/app/apply/application-form";
import { getSettings, applicationsOpen } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to the SOCIS Computer Science Incubator for this semester.",
};

export default async function ApplyPage() {
  const settings = await getSettings();
  const open = applicationsOpen(settings);

  if (!open) {
    return (
      <div className="space-y-8">
        <PageHeader title="Applications are closed" />
        <p className="prose-page text-muted-foreground">
          Applications for this semester are closed. Watch Discord and the{" "}
          <Link href="/events" className="text-link underline underline-offset-4 hover:no-underline">
            our events page
          </Link>{" "}
          for the next intake. Public events remain open.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Apply"
        lede="The form takes about fifteen minutes. Apply alone or list people you want to work with. A project idea is optional."
      />

      {settings.applications_close ? (
        <Alert>Applications close {formatDate(settings.applications_close)}.</Alert>
      ) : null}

      <ApplicationForm />
    </div>
  );
}
