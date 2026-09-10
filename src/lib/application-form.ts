import type { ApplicationInput } from "@/lib/validation";
import type { ApplicantApplication } from "@/lib/types";

/** Only applicant-authored answers are sent to the form or revision RPC. */
export function applicationFormValues(application: ApplicantApplication): ApplicationInput {
  return {
    full_name: application.full_name,
    email: application.email,
    program: application.program,
    year: application.year,
    skills: application.skills,
    interest_areas: application.interest_areas,
    github_url: application.github_url ?? "",
    previous_projects: application.previous_projects ?? "",
    applying_with_team: application.applying_with_team,
    teammates: application.teammates ?? "",
    has_project_idea: application.has_project_idea,
    project_idea: application.project_idea ?? "",
    weekly_hours: application.weekly_hours,
    goals: application.goals,
  };
}

export function applicationAnswers(values: ApplicationInput) {
  return {
    full_name: values.full_name,
    program: values.program,
    year: values.year,
    skills: values.skills,
    interest_areas: values.interest_areas,
    github_url: values.github_url || null,
    previous_projects: values.previous_projects || null,
    applying_with_team: values.applying_with_team,
    teammates: values.applying_with_team ? values.teammates || null : null,
    has_project_idea: values.has_project_idea,
    project_idea: values.has_project_idea ? values.project_idea || null : null,
    weekly_hours: values.weekly_hours,
    goals: values.goals,
  };
}
