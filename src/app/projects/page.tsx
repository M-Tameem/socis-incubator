import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { PROGRAM } from "@/lib/program";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects built by teams in the SOCIS Computer Science Incubator.",
};

export const revalidate = 300;

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: teams } = await supabase
    .from("teams")
    .select("id, name, slug, tagline, tech_stack, github_url, demo_url")
    .eq("showcased", true)
    .order("name");

  return (
    <div className="space-y-12">
      <PageHeader
        title="Projects"
        lede="Projects published by past incubator teams."
      />

      {teams && teams.length > 0 ? (
        <ul className="divide-y divide-border border-b border-border">
          {teams.map((team) => (
            <li key={team.id} className="py-6">
              <h2 className="text-lg font-medium">
                <Link href={`/projects/${team.slug}`} className="hover:text-link">
                  {team.name}
                </Link>
              </h2>
              {team.tagline ? (
                <p className="prose-page mt-1 text-muted-foreground">{team.tagline}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                {team.tech_stack ? (
                  <span className="text-muted-foreground">{team.tech_stack}</span>
                ) : null}
                {team.github_url ? (
                  <a
                    href={team.github_url}
                    className="text-link underline underline-offset-4 hover:no-underline"
                  >
                    Repository
                  </a>
                ) : null}
                {team.demo_url ? (
                  <a
                    href={team.demo_url}
                    className="text-link underline underline-offset-4 hover:no-underline"
                  >
                    Live demo
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="prose-page space-y-4 text-muted-foreground">
          <p>
            No projects are published yet. They appear here after Demo Day.
          </p>
          <p>
            If you want to be on this page next semester,{" "}
            <Link href="/apply" className="text-link underline underline-offset-4 hover:no-underline">
              apply to the incubator
            </Link>
            .
          </p>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Team repositories live under{" "}
        <a href={PROGRAM.githubOrg} className="text-link underline underline-offset-4 hover:no-underline">
          GitHub
        </a>
        . Each team owns its code.
      </p>
    </div>
  );
}
