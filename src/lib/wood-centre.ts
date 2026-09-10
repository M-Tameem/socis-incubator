import { PROGRAM } from "@/lib/program";

// Fall 2026 event details supplied by SOCIS from the Wood Centre postcard and
// its September 8 confirmation email (which confirms November 19 for Open Pitch Night).
export const WOOD_CENTRE_EVENTS = [
  {
    title: "IdeaLab Sprint",
    date: "October 26",
    time: "5:30–8:00 PM",
    location: "University Centre, room 442",
    purpose: "Sharpen your idea",
    description: "Work through the problem your project solves and explore approaches with your team. A useful chance to test your thinking before building further.",
  },
  {
    title: "Winter Entrepreneurship Programs Info Session",
    date: "November 12",
    time: "12:00–1:00 PM in person · 7:00–8:00 PM virtually",
    location: "Macdonald Hall, room 107 · virtual option",
    purpose: "Plan what comes next",
    description: "Explore Wood Centre programs that could help you keep developing your project after the SOCIS semester. Attend whichever session works for your group.",
  },
  {
    title: "Open Pitch Night",
    date: "November 19",
    time: "6:00–8:00 PM",
    location: "Bullring",
    purpose: "Our pitch milestone",
    description: "SOCIS Incubator teams will pitch their projects to judges for feedback. Explain the problem, show your progress, and bring the feedback into your final build.",
  },
  {
    title: "IgniteLab Pitch Competition",
    date: "December 3",
    time: "10:00 AM–12:00 PM",
    location: "MacKinnon, room 113",
    purpose: "Attend and learn",
    description: "Attend as an audience member to support student businesses and see how other founders present their work. Register with the organizer to attend.",
  },
] as const;

export const WOOD_CENTRE_EVENTS_URL = PROGRAM.woodCentreEventsUrl;
