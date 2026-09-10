-- Verified applicants can retrieve and revise their own answers, including
-- applications submitted before signing in. Private review fields are never returned.
create function public.get_my_application()
returns table (
  id uuid, full_name text, email text, program text, year text, skills text,
  interest_areas text, github_url text, previous_projects text,
  applying_with_team boolean, teammates text, has_project_idea boolean,
  project_idea text, weekly_hours text, goals text, updated_at timestamptz,
  status public.application_status, created_at timestamptz
)
language sql stable security definer set search_path = ''
as $$
  select a.id, a.full_name, a.email, a.program, a.year, a.skills,
    a.interest_areas, a.github_url, a.previous_projects,
    a.applying_with_team, a.teammates, a.has_project_idea,
    a.project_idea, a.weekly_hours, a.goals, a.updated_at, a.status, a.created_at
  from public.applications a
  join auth.users u on u.id = auth.uid() and u.email_confirmed_at is not null
  where lower(a.email) = lower(u.email)
    and (a.user_id is null or a.user_id = u.id);
$$;

create function public.revise_my_application(
  application_id uuid, application_values jsonb, expected_updated_at timestamptz
)
returns timestamptz
language plpgsql security definer set search_path = ''
as $$
declare
  applicant_email text;
  answers public.applications;
  saved_at timestamptz;
begin
  select lower(u.email) into applicant_email from auth.users u
    where u.id = auth.uid() and u.email_confirmed_at is not null;
  if applicant_email is null then
    raise exception 'Sign in with your application email.' using errcode = '42501';
  end if;
  if not public.idea_portal_open() then
    raise exception 'The application deadline has passed.' using errcode = '42501';
  end if;
  if application_values is null or jsonb_typeof(application_values) <> 'object'
    or application_values - array[
      'full_name', 'program', 'year', 'skills', 'interest_areas', 'github_url',
      'previous_projects', 'applying_with_team', 'teammates', 'has_project_idea',
      'project_idea', 'weekly_hours', 'goals'
    ] <> '{}'::jsonb then
    raise exception 'Only application answers can be changed.' using errcode = '22023';
  end if;
  answers := jsonb_populate_record(null::public.applications, application_values);
  update public.applications a set
    full_name = answers.full_name, program = answers.program, year = answers.year,
    skills = answers.skills, interest_areas = answers.interest_areas,
    github_url = answers.github_url, previous_projects = answers.previous_projects,
    applying_with_team = answers.applying_with_team,
    teammates = case when answers.applying_with_team then answers.teammates else null end,
    has_project_idea = answers.has_project_idea,
    project_idea = case when answers.has_project_idea then answers.project_idea else null end,
    weekly_hours = answers.weekly_hours, goals = answers.goals,
    user_id = auth.uid(), updated_at = clock_timestamp()
  where a.id = application_id and lower(a.email) = applicant_email
    and (a.user_id is null or a.user_id = auth.uid())
    and a.updated_at = expected_updated_at
  returning a.updated_at into saved_at;
  if saved_at is null then
    raise exception 'Could not save. Refresh your application and try again.' using errcode = 'P0001';
  end if;
  return saved_at;
end;
$$;

revoke all on function public.get_my_application() from public, anon;
revoke all on function public.revise_my_application(uuid, jsonb, timestamptz) from public, anon;
grant execute on function public.get_my_application() to authenticated;
grant execute on function public.revise_my_application(uuid, jsonb, timestamptz) to authenticated;
