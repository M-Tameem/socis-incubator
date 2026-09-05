import Link from "next/link";
import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { InterestForm } from "@/app/ideas/[id]/interest-form";
import { updateIdeaStatus } from "@/app/ideas/actions";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { applicationsOpen, getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Idea" };

const statusLabel = {
  open: "Looking for people",
  matched: "Team found",
  closed: "Closed",
} as const;

export default async function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: idea }, profile, settings] = await Promise.all([
    supabase.from("idea_posts").select("*").eq("id", id).maybeSingle(),
    getProfile(),
    getSettings(),
  ]);

  if (!idea) notFound();

  const open = applicationsOpen(settings);
  const isAuthor = profile?.id === idea.author_id;
  const isExec = profile?.role === "exec" || profile?.role === "admin";
  const canManage = isAuthor || isExec;
  const { data: visibleInterests } = profile
    ? await supabase
        .from("idea_interests")
        .select("*")
        .eq("idea_id", idea.id)
        .order("created_at", { ascending: false })
    : { data: null };
  const alreadySent = visibleInterests?.some((interest) => interest.sender_id === profile?.id);

  return (
    <article className="space-y-10">
      <PageHeader title={idea.title}>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant={idea.status === "open" ? "good" : "outline"}>
            {statusLabel[idea.status]}
          </Badge>
          <span>Posted by {idea.author_name}</span>
          <span>{formatDate(idea.created_at)}</span>
        </div>
      </PageHeader>

      <section>
        <h2 className="text-lg font-semibold">The idea</h2>
        <p className="prose-page mt-3 whitespace-pre-line leading-7 text-muted-foreground">
          {idea.summary}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Who would help</h2>
        <p className="prose-page mt-3 whitespace-pre-line leading-7 text-muted-foreground">
          {idea.looking_for}
        </p>
      </section>

      {canManage ? (
        <section className="border-t border-border pt-8">
          <h2 className="text-lg font-semibold">Manage this post</h2>
          <form action={updateIdeaStatus} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="idea_id" value={idea.id} />
            <label className="space-y-2 text-sm font-medium">
              <span className="block">Status</span>
              <Select name="status" defaultValue={idea.status} className="w-48">
                <option value="open">Looking for people</option>
                <option value="matched">Team found</option>
                <option value="closed">Closed</option>
              </Select>
            </label>
            <Button type="submit" variant="outline">Update status</Button>
          </form>
        </section>
      ) : null}

      {canManage ? (
        <section className="border-t border-border pt-8">
          <h2 className="text-lg font-semibold">Interested students</h2>
          {visibleInterests && visibleInterests.length > 0 ? (
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {visibleInterests.map((interest) => (
                <li key={interest.id} className="py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{interest.sender_name}</p>
                    <a className="text-sm text-link underline underline-offset-4 hover:no-underline" href={`mailto:${interest.sender_email}`}>
                      {interest.sender_email}
                    </a>
                  </div>
                  <p className="prose-page mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {interest.message}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No one has contacted you through the portal yet.</p>
          )}
        </section>
      ) : (
        <section className="max-w-2xl border-t border-border pt-8">
          <h2 className="text-lg font-semibold">Get in touch</h2>
          {!open ? (
            <Alert className="mt-4">Contacting closed with applications.</Alert>
          ) : idea.status !== "open" ? (
            <Alert className="mt-4">This post is no longer looking for people.</Alert>
          ) : !profile ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Sign in to send a private message. The author will receive your name and email.
              </p>
              <Button asChild>
                <Link href={`/login?next=/ideas/${idea.id}` as Route}>Sign in to contact</Link>
              </Button>
            </div>
          ) : alreadySent ? (
            <Alert className="mt-4" variant="success">Interest already sent. The author has your email address.</Alert>
          ) : (
            <div className="mt-5">
              <InterestForm ideaId={idea.id} defaultName={profile.full_name ?? undefined} />
            </div>
          )}
        </section>
      )}

      <p className="border-t border-border pt-6 text-sm">
        <Link href="/ideas" className="text-link underline underline-offset-4 hover:no-underline">
          Back to all ideas
        </Link>
      </p>
    </article>
  );
}
