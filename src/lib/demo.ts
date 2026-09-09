import { cookies } from "next/headers";
import type { Profile } from "@/lib/types";

export const DEMO_COOKIE = "socis_demo_role";
export type DemoRole = "student" | "exec";

export function demoEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.DEMO_MODE === "true";
}

export async function getDemoRole(): Promise<DemoRole | null> {
  if (!demoEnabled()) return null;
  const value = (await cookies()).get(DEMO_COOKIE)?.value;
  return value === "student" || value === "exec" ? value : null;
}

const PROFILES: Record<DemoRole, Profile> = {
  student: {
    id: "10000000-0000-4000-8000-000000000001",
    email: "student.demo@socis.local",
    full_name: "Maya Chen",
    program: "Software Engineering",
    year: "3rd year",
    github_url: "https://github.com/maya-demo",
    role: "student",
    created_at: "2026-09-08T14:00:00.000Z",
  },
  exec: {
    id: "10000000-0000-4000-8000-000000000002",
    email: "exec.demo@socis.local",
    full_name: "Jordan Lee",
    program: null,
    year: null,
    github_url: null,
    role: "admin",
    created_at: "2026-09-01T14:00:00.000Z",
  },
};

export async function getDemoProfile() {
  const role = await getDemoRole();
  return role ? PROFILES[role] : null;
}

export const DEMO_STUDENT = {
  profile: {
    name: "Maya Chen",
    email: "student.demo@socis.local",
    program: "Software Engineering",
    year: "3rd year",
    github: "github.com/maya-demo",
  },
  application: {
    status: "accepted",
    submitted: "September 9, 2026",
    skills: "TypeScript, React, basic PostgreSQL, Figma",
    interests: "Accessible web applications and campus tools",
    availability: "6 to 10 hours a week",
    goals: "Ship a project with real users and learn how to review code on a team.",
  },
  idea: {
    title: "QuietSpace",
    status: "Team found",
    summary: "A live map of quiet study spaces with noise, capacity, and accessibility notes.",
    response: "Alex is interested in the API and data collection work.",
  },
  team: {
    name: "QuietSpace",
    status: "active",
    repository: "github.com/socis/quietspace",
    channel: "Discord / #team-quietspace",
    executive: "Jordan Lee",
    members: [
      { name: "Maya Chen", role: "Frontend and accessibility", lead: true },
      { name: "Alex Morgan", role: "API and database", lead: false },
      { name: "Priya Shah", role: "Research and design", lead: false },
      { name: "Noah Williams", role: "Maps and deployment", lead: false },
    ],
  },
  proposal: {
    status: "approved",
    problem: "Students waste time walking between buildings to find a suitable place to study.",
    mvp: "Searchable campus map, space details, and student-submitted occupancy reports.",
    excluded: "Reservations, indoor navigation, and automated occupancy sensors.",
    feedback: "Approved after removing reservations from the first release.",
  },
  checkIns: [
    {
      cycle: 1,
      state: "On track",
      completed: "Interviewed twelve students and built the initial map view.",
      next: "Connect the space list to Supabase and add filters.",
    },
    {
      cycle: 2,
      state: "Needs follow-up",
      completed: "Added filters and occupancy reports.",
      next: "Fix mobile map controls and test keyboard navigation.",
    },
  ],
  demoDay: {
    date: "December 2, 2026",
    slot: "6:10 pm",
    state: "Not yet showcased",
  },
} as const;

export const DEMO_EXEC = {
  counts: {
    applications: 38,
    accepted: 24,
    teams: 7,
    flagged: 2,
  },
  applications: [
    { name: "Maya Chen", program: "Software Engineering", year: "3rd", status: "accepted" },
    { name: "Ethan Brown", program: "Computer Science", year: "2nd", status: "under review" },
    { name: "Samira Khan", program: "Data Science", year: "4th", status: "waitlisted" },
    { name: "Lucas Martin", program: "Computer Science", year: "1st", status: "submitted" },
  ],
  teams: [
    { name: "QuietSpace", members: 4, lead: "Maya Chen", status: "active", proposal: "approved" },
    { name: "CourseGraph", members: 3, lead: "Ethan Brown", status: "forming", proposal: "changes requested" },
    { name: "MealMatch", members: 5, lead: "Samira Khan", status: "behind", proposal: "approved" },
  ],
  flaggedCheckIns: [
    { team: "QuietSpace", issue: "Map controls are difficult to use on mobile.", request: "Accessibility review" },
    { team: "MealMatch", issue: "Authentication work is two weeks behind.", request: "Technical mentor" },
  ],
  upcoming: [
    { item: "Git and GitHub workshop", date: "September 24" },
    { item: "First team check-in", date: "October 6" },
    { item: "Demo Day", date: "December 2" },
  ],
} as const;
