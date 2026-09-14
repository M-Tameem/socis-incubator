import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { CHECK_IN_QUESTIONS, TOOLING } from "@/lib/program";

export const metadata: Metadata = {
  title: "Resources",
  description: "Templates, guidelines, and technical resources for incubator teams.",
};

export default function ResourcesPage() {
  return (
    <div className="space-y-14">
      <PageHeader
        title="Resources"
        lede="Everything you need while working on your project."
      />

      <section>
        <h2 className="text-lg font-semibold">Start your project</h2>
        <div className="prose-page mt-3 space-y-6 text-muted-foreground">
          <div>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <Link
                  href="https://docs.google.com/document/d/1zuGTDYK_a_yGVKvkKlwDhbSbM2P5HDIKSSPUhisa-5E/edit?tab=t.adu1lva7o6gk"
                  className="text-link underline underline-offset-4 hover:no-underline"
                >
                  Project proposal template
                </Link>
                : complete during Week 2
              </li>
              <li>
                <Link
                  href="https://docs.google.com/document/d/1zuGTDYK_a_yGVKvkKlwDhbSbM2P5HDIKSSPUhisa-5E/edit?tab=t.riu8urbffryk"
                  className="text-link underline underline-offset-4 hover:no-underline"
                >
                  MVP scoping worksheet
                </Link>
                : turn your idea into something achievable
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground">GitHub</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Git and GitHub for teams: branches, pull requests, and reviews</li>
              <li>Writing a README people read: a guide to documenting your project</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground">Deployment</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Deploying on Vercel: free hosting for most student projects</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground">Program</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <Link
                  href="https://docs.google.com/document/d/1zuGTDYK_a_yGVKvkKlwDhbSbM2P5HDIKSSPUhisa-5E/edit?tab=t.x8spv7gwhnvq"
                  className="text-link underline underline-offset-4 hover:no-underline"
                >
                  Reimbursement form
                </Link>
                : submit receipts for approved expenses
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Check-in questions</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Your update should take about five minutes on the{" "}
          <Link href="/dashboard/check-ins" className="text-link underline underline-offset-4 hover:no-underline">
            dashboard
          </Link>
          .
        </p>
        <ul className="prose-page mt-4 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {CHECK_IN_QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tools">
        <h2 id="tools" className="text-2xl font-semibold">
          Where things live
        </h2>
        <dl className="mt-6 divide-y divide-border border-y border-border">
          {TOOLING.map((row) => (
          <div key={row.tool} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-8">
            <dt className="font-medium">{row.tool}</dt>
            <dd className="text-muted-foreground">{row.use}</dd>
          </div>
          ))}
        </dl>
        <p className="mt-8 text-sm">
          Can&apos;t find something? Ask your SOCIS executive contact.
        </p>
      </section>
    </div>
  );
}