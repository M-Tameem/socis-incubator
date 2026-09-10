import Link from "next/link";
import type { Metadata, Route } from "next";
import { requireExec } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { DeleteForm } from "./delete-form";

export const metadata: Metadata = { title: "Moderation" };
const PAGE_SIZE = 25;

export default async function ModerationPage({ searchParams }: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireExec();
  const { page: rawPage } = await searchParams;
  const parsedPage = Number(rawPage ?? 1);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, 1000000) : 1;
  const start = (page - 1) * PAGE_SIZE;
  const supabase = await createClient();
  const [posts, messages] = await Promise.all([
    supabase.from("idea_posts").select("*", { count: "exact" })
      .order("created_at", { ascending: false }).order("id").range(start, start + PAGE_SIZE - 1),
    supabase.from("idea_interests").select("*", { count: "exact" })
      .order("created_at", { ascending: false }).order("id").range(start, start + PAGE_SIZE - 1),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Moderation</h1>
        <p className="prose-page mt-2 text-muted-foreground">
          Review and remove inappropriate idea posts and private interest messages.
          Deleting a post also deletes its messages. Deletions are permanent;
          email notifications already delivered cannot be recalled.
        </p>
      </div>
      <section aria-labelledby="posts-heading">
        <h2 id="posts-heading" className="text-lg font-semibold">Idea posts</h2>
        {posts.error ? <p role="alert">Posts could not be loaded. Refresh to try again.</p> :
          posts.data?.length ? (
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {posts.data.map((post) => (
                <li key={post.id} className="break-words py-5">
                  <Link href={`/ideas/${post.id}` as Route} className="font-semibold text-link underline underline-offset-4">{post.title}</Link>
                  <p className="mt-1 text-sm text-muted-foreground">{post.author_name} · {formatDateTime(post.created_at)} · {post.status}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm">{post.summary}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm"><span className="font-medium">Looking for: </span>{post.looking_for}</p>
                  <DeleteForm kind="post" id={post.id} />
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-muted-foreground">No posts on this page.</p>}
      </section>
      <section aria-labelledby="messages-heading">
        <h2 id="messages-heading" className="text-lg font-semibold">Interest messages</h2>
        {messages.error ? <p role="alert">Messages could not be loaded. Refresh to try again.</p> :
          messages.data?.length ? (
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {messages.data.map((message) => (
                <li key={message.id} className="break-words py-5">
                  <p className="font-medium">{message.sender_name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{message.sender_email} · {formatDateTime(message.created_at)}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm">{message.message}</p>
                  <Link href={`/ideas/${message.idea_id}` as Route} className="mt-2 inline-block text-sm text-link underline underline-offset-4">View related idea</Link>
                  <DeleteForm kind="message" id={message.id} />
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-muted-foreground">No messages on this page.</p>}
      </section>
      <nav aria-label="Moderation pages" className="flex flex-wrap items-center gap-4 text-sm">
        {page > 1 ? <Link href={`/admin/moderation?page=${page - 1}` as Route} className="text-link underline">Previous</Link> : null}
        <span>Page {page}</span>
        {start + PAGE_SIZE < Math.max(posts.count ?? 0, messages.count ?? 0) ?
          <Link href={`/admin/moderation?page=${page + 1}` as Route} className="text-link underline">Next</Link> : null}
      </nav>
    </div>
  );
}
