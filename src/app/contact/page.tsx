import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { EXEC_ROLES, PROGRAM } from "@/lib/program";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach the SOCIS Incubator executive team.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-12">
      <PageHeader
        title="Contact"
        lede="Use email for program decisions or expenses. Use Discord for quick questions."
      />

      <section>
        <dl className="divide-y divide-border border-y border-border">
          <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-8">
            <dt className="font-medium">SOCIS website</dt>
            <dd>
              <a href={PROGRAM.websiteUrl} className="text-link underline underline-offset-4 hover:no-underline">
                socis.ca
              </a>
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-8">
            <dt className="font-medium">Email</dt>
            <dd>
              <a
                href={`mailto:${settings.contact_email}`}
                className="text-link underline underline-offset-4 hover:no-underline"
              >
                {settings.contact_email}
              </a>
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-8">
            <dt className="font-medium">Discord</dt>
            <dd>
              <a
                href={settings.discord_url}
                className="text-link underline underline-offset-4 hover:no-underline"
              >
                SOCIS server
              </a>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask in #incubator-help. Announcements go to #announcements.
              </p>
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-8">
            <dt className="font-medium">In the program</dt>
            <dd className="text-muted-foreground">
              Your assigned executive contact is listed on your team page in the dashboard.
              Start with them.
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Who does what</h2>
        <dl className="mt-5 divide-y divide-border border-y border-border">
          {EXEC_ROLES.map((role) => (
            <div key={role.title} className="grid gap-1 py-3 sm:grid-cols-[16rem_1fr] sm:gap-8">
              <dt className="font-medium">{role.title}</dt>
              <dd className="text-muted-foreground">{role.duties}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Alumni, mentors, and sponsors</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Email us if you want to mentor a team, run an event, judge Demo Day, or sponsor the
          program. Include a short note about what you have in mind.
        </p>
      </section>
    </div>
  );
}
