-- added to fix code bc applications werent getting submitted:
--- signed in users couldn't submit applications bc their insert 
--- permission got revoked right after being granted, so added a migration to fix it
grant insert (
  user_id, full_name, email, program, year, skills, interest_areas,
  github_url, previous_projects, applying_with_team, teammates,
  has_project_idea, project_idea, weekly_hours, goals
) on public.applications to authenticated;
