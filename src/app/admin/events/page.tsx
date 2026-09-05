import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createEvent, toggleEventPublished } from "@/app/admin/events/actions";
import { formatDateTime } from "@/lib/utils";
import type { EventKind } from "@/lib/types";

export const metadata: Metadata = { title: "Events" };

const KINDS: EventKind[] = [
  "workshop",
  "talk",
  "mentor_session",
  "networking",
  "career",
  "demo_day",
  "other",
];

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
        <p className="prose-page mt-2 text-muted-foreground">
          Drafts stay hidden until you publish them. Aim for roughly one event every few
          weeks.
        </p>
      </div>

      <section className="rounded-md border border-border p-5">
        <h2 className="font-semibold">New event</h2>
        <form action={createEvent} className="mt-4 max-w-2xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-1">
              <label htmlFor="kind" className="text-sm font-medium">
                Type
              </label>
              <Select id="kind" name="kind" defaultValue="workshop">
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <label htmlFor="starts_at" className="text-sm font-medium">
                Starts
              </label>
              <Input id="starts_at" name="starts_at" type="datetime-local" required />
            </div>
            <div className="space-y-1">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input id="location" name="location" />
            </div>
            <div className="space-y-1">
              <label htmlFor="host" className="text-sm font-medium">
                Host
              </label>
              <Input id="host" name="host" />
            </div>
            <div className="space-y-1">
              <label htmlFor="rsvp_url" className="text-sm font-medium">
                Registration URL
              </label>
              <Input id="rsvp_url" name="rsvp_url" type="url" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea id="description" name="description" rows={3} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" className="h-4 w-4 rounded border-input" />
              Publish immediately
            </label>
            <Button type="submit">Create event</Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold">All events</h2>
        {events && events.length > 0 ? (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {events.map((event) => (
              <li key={event.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
                <span className="font-medium">{event.title}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDateTime(event.starts_at)}
                </span>
                <Badge variant="outline">{event.kind.replace("_", " ")}</Badge>
                {event.published ? (
                  <Badge variant="good">Published</Badge>
                ) : (
                  <Badge>Draft</Badge>
                )}
                <form action={toggleEventPublished} className="ml-auto">
                  <input type="hidden" name="id" value={event.id} />
                  <input type="hidden" name="published" value={String(event.published)} />
                  <Button type="submit" size="sm" variant="outline">
                    {event.published ? "Unpublish" : "Publish"}
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">No events yet.</p>
        )}
      </section>
    </div>
  );
}
