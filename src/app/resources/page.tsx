import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { CHECK_IN_QUESTIONS, TOOLING } from "@/lib/program";

export const metadata: Metadata = {
  title: "Resources",
  description: "Templates, guidelines, and technical resources for incubator teams.",
};

export const revalidate = 300;

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("published", true)
    .order("sort_order");

  const grouped = (resources ?? []).reduce<Record<string, typeof resources>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-14">
      <PageHeader
        title="Resources"
        lede="Templates and working notes for current teams. Ask your executive contact if a link is missing."
      />

      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-lg font-semibold">{category}</h2>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {(items ?? []).map((r) => (
                  <li key={r.id} className="py-3">
                    <a
                      href={r.url}
                      className="text-link underline underline-offset-4 hover:no-underline"
                    >
                      {r.title}
                    </a>
                    {r.description ? (
                      <p className="prose-page mt-1 text-sm text-muted-foreground">
                        {r.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Resources will be posted before Week 3.</p>
      )}

      <section>
        <h2 className="text-lg font-semibold">Program guidelines</h2>
        <div className="prose-page mt-3 space-y-4 text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Scope.</span> Your first usable version
            must fit inside ten weeks. Cut features in Week 2, not Week 11.
          </p>
          <p>
            <span className="font-medium text-foreground">Repositories.</span> Use one repository
            per team. Keep it public when possible. The README should explain the project and
            how to run it. Use issues and pull requests for shared work.
          </p>
          <p>
            <span className="font-medium text-foreground">Feature freeze.</span> In Week 11, stop
            adding features. Fix the current build and prepare the demo.
          </p>
          <p>
            <span className="font-medium text-foreground">Spending.</span> Get approval from
            Finance and Operations before you spend anything. Keep receipts. Reimbursement
            requires presenting at Demo Day.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Check-in questions</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Submit one team update every two weeks in the{" "}
          <Link href="/dashboard/check-ins" className="text-link underline underline-offset-4 hover:no-underline">
            dashboard
          </Link>
          . It should take about five minutes.
        </p>
        <ul className="prose-page mt-4 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {CHECK_IN_QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Tools</h2>
        <dl className="mt-4 divide-y divide-border border-y border-border">
          {TOOLING.map((row) => (
            <div key={row.tool} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <dt className="font-medium">{row.tool}</dt>
              <dd className="text-muted-foreground">{row.use}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
