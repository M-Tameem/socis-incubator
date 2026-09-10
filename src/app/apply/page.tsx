import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ApplicationForm } from "@/app/apply/application-form";
import { getSettings, getApplicationStatus } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";
import { applicationFormValues } from "@/lib/application-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to the SOCIS Computer Science Incubator for this semester.",
};

export default async function ApplyPage() {
  const settings = await getSettings();
  const status = getApplicationStatus(settings);

  if (status === "upcoming") {
    return (
      <div className="space-y-8">
        <PageHeader title={`Applications open ${formatDate(settings.applications_open, { year: undefined })}`} />
        <p className="prose-page text-muted-foreground">
          Start thinking about what you would like to build and who you might build it with.
          {settings.applications_close ? ` Applications run through ${formatDate(settings.applications_close)}.` : " Check back when applications open."}
        </p>
        <Link href="/timeline" className="text-link underline underline-offset-4">See the semester timeline</Link>
      </div>
    );
  }

  if (status === "closed") {
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

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Apply" lede="Apply with your friends or on your own. Create an account so you can save and revise your application until September 27." />
      <p className="text-muted-foreground">Choose a password and recovery answer. Your account is ready immediately, with no email confirmation.</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button asChild><Link href="/login?mode=signup&next=/apply">Create account and apply</Link></Button>
        <Link href="/login?next=/apply" className="text-link underline underline-offset-4">Already have an account? Sign in</Link>
      </div>
    </div>
  );
  const { data: applications, error } = user?.email_confirmed_at
    ? await supabase.rpc("get_my_application")
    : { data: null, error: null };
  if (error) {
    return <Alert variant="error">We could not load your application. Refresh and try again.</Alert>;
  }
  const application = applications?.[0];

  return (
    <div className="space-y-10">
      <PageHeader
        title={application ? "Edit your application" : "Apply"}
        lede="Bring your friends or find people around an idea and apply together. Applying solo? We will help you find a group. Everyone uses this same form."
      />

      <p className="prose-page text-sm leading-6 text-muted-foreground">
        Still looking for people? Browse the{" "}
        <Link href="/ideas" className="text-link underline underline-offset-4 hover:no-underline">
          idea portal
        </Link>
        . Each group member lists the same teammates and project name. You can update your
        answers as your group or idea takes shape.
      </p>

      {settings.applications_close ? (
        <Alert>Submit and revise your application through {formatDate(settings.applications_close)}.</Alert>
      ) : null}

      <ApplicationForm
        initialValues={application ? applicationFormValues(application) : { email: user?.email ?? "" }}
        applicationId={application?.id}
        updatedAt={application?.updated_at}
      />
    </div>
  );
}
