import Link from "next/link";
import type { Metadata, Route } from "next";
import { Lightbulb, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { applicationsOpen, getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ideas",
  description: "Share a project idea and find potential SOCIS Incubator teammates.",
};

const statusLabel = {
  open: "Looking for people",
  matched: "Team found",
  closed: "Closed",
} as const;

export default async function IdeasPage() {
  const supabase = await createClient();
  const [{ data: ideas }, profile, settings] = await Promise.all([
    supabase.from("idea_posts").select("*").order("created_at", { ascending: false }),
    getProfile(),
    getSettings(),
  ]);
  const open = applicationsOpen(settings);

  return (
    <div className="space-y-12">
      <PageHeader
        title="Ideas"
        lede="Looking for a project? Browse ideas and connect with students who want to build something together."
      >
        <div className="flex flex-wrap gap-3">
          {open ? (
            <Button asChild>
              <Link href={profile ? "/ideas/new" : "/login?next=/ideas/new"}>Post an idea</Link>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href="/apply">Apply to the incubator</Link>
          </Button>
        </div>
      </PageHeader>

      {!open ? (
        <Alert>
          New ideas and messages are available during the application period. Check the
          timeline for dates; existing posts remain available to read.
        </Alert>
      ) : null}

      <section className="grid gap-6 border-y border-border py-7 md:grid-cols-2">
        <div className="flex gap-4">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
          <div>
            <h2 className="font-medium">Posting an Idea</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Keep it simple:
              <ul className="mt-2 list-disc pl-5">
                <li>What problem are you trying to solve?</li>
                <li>What's the smallest usable version?</li>
                <li>What skills are needed?</li>
              </ul>
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Users className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
          <div>
            <h2 className="font-medium">Want to join an idea?</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Send the author a private note. They receive your email and can decide whether to reply.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="posted-ideas">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="posted-ideas" className="text-xl font-semibold">Posted ideas</h2>
            <p className="mt-1 text-sm text-muted-foreground">Newest first.</p>
          </div>
          <span className="text-sm text-muted-foreground">
            {ideas?.length ?? 0} {(ideas?.length ?? 0) === 1 ? "idea" : "ideas"}
          </span>
        </div>

        {ideas && ideas.length > 0 ? (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {ideas.map((idea) => (
              <li key={idea.id} className="flex min-h-64 flex-col rounded-md border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant={idea.status === "open" ? "good" : "outline"}>
                    {statusLabel[idea.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(idea.created_at)}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{idea.title}</h3>
                <p className="mt-2 line-clamp-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                  {idea.summary}
                </p>
                <div className="mt-auto pt-6">
                  <p className="text-xs text-muted-foreground">Posted by {idea.author_name}</p>
                  <Link
                    href={`/ideas/${idea.id}` as Route}
                    className="mt-2 inline-block text-sm text-link underline underline-offset-4 hover:no-underline"
                  >
                    Read idea and get in touch
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-md border border-dashed border-border px-5 py-12 text-center">
            <p className="font-medium">No ideas have been posted yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">Be the first!</p>
          </div>
        )}
      </section>

      <section className="border-t border-border pt-8">
        <h2 className="text-xl font-semibold">Found your group?</h2>
        <p className="prose-page mt-3 leading-7 text-muted-foreground">
          Apply together through the incubator application. You can update your teammates and project idea until September 27.
        </p>
      </section>
    </div>
  );
}
