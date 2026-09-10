import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { EventKind } from "@/lib/types";
import { WOOD_CENTRE_EVENTS, WOOD_CENTRE_EVENTS_URL } from "@/lib/wood-centre";

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
        lede="Build with your team, learn from others, and put your project in front of people. These opportunities are open to SOCIS Incubator teams."
      />

      <section>
        <h2 className="text-xl font-semibold">Wood Centre opportunities</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          The John F. Wood Centre welcomes SOCIS teams to its events. Make November 19 your
          pitch milestone and choose the other sessions that help your project. All dates
          below are for Fall 2026; times are local to Guelph.
        </p>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {WOOD_CENTRE_EVENTS.map((event) => (
            <li key={event.title} className="grid gap-3 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <p className="text-sm font-medium">{event.date}</p>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-medium">{event.title}</h3>
                  <Badge variant="outline">{event.purpose}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{event.time} · {event.location}</p>
                <p className="prose-page mt-3 text-muted-foreground">{event.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">Hosted by the John F. Wood Centre</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <a href={WOOD_CENTRE_EVENTS_URL} className="text-link underline underline-offset-4 hover:no-underline">
            Check organizer details and registration
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Entrepreneur in Residence</h2>
        <p className="prose-page mt-2 text-muted-foreground">
          Book a conversation with the Wood Centre&apos;s Entrepreneur in Residence for feedback
          on your idea, business questions, or challenges your team is facing. It is another
          way to get advice as your project takes shape.
        </p>
        <a href="https://www.uoguelph.ca/wood-centre/" className="mt-4 inline-block text-sm text-link underline underline-offset-4 hover:no-underline">
          Find out more through the Wood Centre
        </a>
      </section>

      <section>
        <h2 className="text-lg font-semibold">More SOCIS events</h2>
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
            Additional SOCIS workshops and meetups will appear here and in Discord.
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
