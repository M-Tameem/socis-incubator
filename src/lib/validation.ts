import { z } from "zod";

const required = (label: string) => z.string().trim().min(1, `${label} is required.`);

export const applicationSchema = z.object({
  full_name: required("Your name").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(320),
  program: required("Program").max(120),
  year: required("Year of study").max(40),
  skills: required("Skills").max(2000),
  interest_areas: required("Areas you want to work in").max(1000),
  github_url: z
    .string()
    .trim()
    .url("Enter a full URL, including https://")
    .optional()
    .or(z.literal("")),
  previous_projects: z.string().trim().max(2000).optional().or(z.literal("")),
  applying_with_team: z.coerce.boolean().default(false),
  teammates: z.string().trim().max(1000).optional().or(z.literal("")),
  has_project_idea: z.coerce.boolean().default(false),
  project_idea: z.string().trim().max(2000).optional().or(z.literal("")),
  weekly_hours: required("Weekly availability").max(100),
  goals: required("What you hope to gain").max(2000),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const proposalSchema = z.object({
  problem: required("Problem").max(1500),
  solution: required("What you are building").max(1500),
  target_user: required("Target user").max(800),
  mvp_scope: required("MVP scope").max(2000),
  out_of_scope: z.string().trim().max(1500).optional().or(z.literal("")),
  tech_stack: required("Technology stack").max(800),
  team_roles: required("Team roles").max(1000),
  milestones: required("Milestones").max(2000),
});

export const checkInSchema = z.object({
  cycle: z.coerce.number().int().min(1).max(6),
  completed: required("What you completed").max(2000),
  in_progress: required("What you are working on").max(2000),
  next_up: required("What you will complete next").max(2000),
  behind_schedule: z.coerce.boolean().default(false),
  blockers: z.string().trim().max(2000).optional().or(z.literal("")),
  help_needed: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const teamSchema = z.object({
  name: required("Team name").max(80),
  tagline: z.string().trim().max(140).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  github_url: z.string().trim().url("Enter a full URL.").optional().or(z.literal("")),
  demo_url: z.string().trim().url("Enter a full URL.").optional().or(z.literal("")),
  tech_stack: z.string().trim().max(400).optional().or(z.literal("")),
});

/** Turns a Zod error into { field: message } for rendering next to inputs. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
