import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("name, tagline")
    .eq("slug", slug)
    .eq("showcased", true)
    .maybeSingle();

  if (!data) return { title: "Project not found" };
  return { title: data.name, description: data.tagline ?? undefined };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("slug", slug)
    .eq("showcased", true)
    .maybeSingle();

  if (!team) notFound();

  const { data: members } = await supabase.rpc("get_project_members", {
    project_team: team.id,
  });

  return (
    <article className="space-y-10">
      <header className="border-b border-border pb-8">
        <p className="text-sm text-muted-foreground">
          <Link href="/projects" className="hover:text-foreground">
            Projects
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{team.name}</h1>
        {team.tagline ? (
          <p className="prose-page mt-3 text-lg text-muted-foreground">{team.tagline}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {team.github_url ? (
            <a
              href={team.github_url}
              className="text-link underline underline-offset-4 hover:no-underline"
            >
              View the repository
            </a>
          ) : null}
          {team.demo_url ? (
            <a
              href={team.demo_url}
              className="text-link underline underline-offset-4 hover:no-underline"
            >
              Open the live demo
            </a>
          ) : null}
        </div>
      </header>

      {team.description ? (
        <section>
          <h2 className="text-lg font-semibold">About the project</h2>
          <p className="prose-page mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
            {team.description}
          </p>
        </section>
      ) : null}

      {team.mvp_definition ? (
        <section>
          <h2 className="text-lg font-semibold">What they set out to build</h2>
          <p className="prose-page mt-3 whitespace-pre-line text-muted-foreground">
            {team.mvp_definition}
          </p>
        </section>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold">Team</h2>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {(members ?? []).map((m, i) => {
            return (
              <li key={i} className="flex flex-wrap items-baseline gap-x-4 py-3">
                <span>{m.full_name ?? "Team member"}</span>
                {m.role_on_team ? (
                  <span className="text-sm text-muted-foreground">{m.role_on_team}</span>
                ) : null}
                {m.github_url ? (
                  <a
                    href={m.github_url}
                    className="text-sm text-link underline underline-offset-4 hover:no-underline"
                  >
                    GitHub
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {team.tech_stack ? (
        <section>
          <h2 className="text-lg font-semibold">Built with</h2>
          <p className="mt-2 text-muted-foreground">{team.tech_stack}</p>
        </section>
      ) : null}
    </article>
  );
}
