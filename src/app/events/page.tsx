import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { EventKind } from "@/lib/types";

export const metadata: Metadata = {
  title: "Events",
  description: "Workshops, alumni talks, mentor sessions, and networking events.",
};

export const revalidate = 120;

const KIND_LABELS: Record<EventKind, string> = {
  workshop: "Workshop",
  talk: "Talk",
  mentor_session: "Mentor session",
  networking: "Networking",
  career: "Career",
  demo_day: "Demo Day",
  other: "Event",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: upcoming } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .gte("starts_at", now)
    .order("starts_at");

  const { data: past } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .lt("starts_at", now)
    .order("starts_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-12">
      <PageHeader
        title="Events"
        lede="Workshops and mentor sessions are posted here once dates are confirmed. Most events are open to all SOCIS students."
      />

      <section>
        <h2 className="text-lg font-semibold">Upcoming</h2>
        {upcoming && upcoming.length > 0 ? (
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {upcoming.map((event) => (
              <li key={event.id} className="py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-medium">{event.title}</h3>
                  <Badge variant="outline">{KIND_LABELS[event.kind]}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDateTime(event.starts_at)}
                  {event.location ? ` · ${event.location}` : ""}
                </p>
                {event.description ? (
                  <p className="prose-page mt-3 text-muted-foreground">{event.description}</p>
                ) : null}
                {event.host ? (
                  <p className="mt-2 text-sm text-muted-foreground">Hosted by {event.host}</p>
                ) : null}
                {event.rsvp_url ? (
                  <p className="mt-3 text-sm">
                    <a
                      href={event.rsvp_url}
                      className="text-link underline underline-offset-4 hover:no-underline"
                    >
                      Register for this event
                    </a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">
            No events are scheduled. New dates will appear here and in Discord.
          </p>
        )}
      </section>

      {past && past.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold">Past events</h2>
          <ul className="mt-5 divide-y divide-border border-y border-border text-sm">
            {past.map((event) => (
              <li key={event.id} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3">
                <span>{event.title}</span>
                <span className="text-muted-foreground">{formatDateTime(event.starts_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
