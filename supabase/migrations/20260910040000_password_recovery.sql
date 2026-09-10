-- Recovery answers are private to the server, never exposed through user JWTs.
create table public.account_recovery (
  user_id uuid primary key references auth.users on delete cascade,
  email text not null unique check (email = lower(email)),
  answer_hash text not null,
  updated_at timestamptz not null default now()
);
alter table public.account_recovery enable row level security;
revoke all on public.account_recovery from public, anon, authenticated;
grant select, insert, update, delete on public.account_recovery to service_role;

create table public.auth_attempts (
  bucket text primary key,
  attempts integer not null,
  expires_at timestamptz not null
);
alter table public.auth_attempts enable row level security;
revoke all on public.auth_attempts from public, anon, authenticated;
create index auth_attempts_expiry_idx on public.auth_attempts (expires_at);

create function public.consume_auth_attempt(bucket_key text, attempt_limit integer, window_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  used integer;
begin
  if attempt_limit < 1 or window_seconds < 1 or length(bucket_key) <> 64 then
    return false;
  end if;
  delete from public.auth_attempts where expires_at <= now();
  insert into public.auth_attempts (bucket, attempts, expires_at)
  values (bucket_key, 1, now() + make_interval(secs => window_seconds))
  on conflict (bucket) do update set attempts = public.auth_attempts.attempts + 1
    where public.auth_attempts.attempts < attempt_limit
  returning attempts into used;
  return used is not null;
end;
$$;
revoke all on function public.consume_auth_attempt(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_auth_attempt(text, integer, integer) to service_role;

-- Password-only signups do not prove ownership of an existing anonymous application.
-- Legacy email-verified accounts retain their ability to claim their own earlier submission.
drop policy "anyone can apply" on public.applications;
create policy "signed in students apply" on public.applications for insert to authenticated with check (
  user_id = auth.uid() and status = 'submitted' and reviewer_notes is null and team_id is null
  and lower(email) = (select lower(p.email) from public.profiles p where p.id = auth.uid())
  and public.idea_portal_open()
);
revoke insert (
  user_id, full_name, email, program, year, skills, interest_areas,
  github_url, previous_projects, applying_with_team, teammates,
  has_project_idea, project_idea, weekly_hours, goals
) on public.applications from anon;

create or replace function public.get_my_application()
returns table (
  id uuid, full_name text, email text, program text, year text, skills text,
  interest_areas text, github_url text, previous_projects text,
  applying_with_team boolean, teammates text, has_project_idea boolean,
  project_idea text, weekly_hours text, goals text, updated_at timestamptz,
  status public.application_status, created_at timestamptz
)
language sql stable security definer set search_path = '' as $$
  select a.id, a.full_name, a.email, a.program, a.year, a.skills,
    a.interest_areas, a.github_url, a.previous_projects,
    a.applying_with_team, a.teammates, a.has_project_idea,
    a.project_idea, a.weekly_hours, a.goals, a.updated_at, a.status, a.created_at
  from public.applications a
  join auth.users u on u.id = auth.uid() and u.email_confirmed_at is not null
  where lower(a.email) = lower(u.email) and (
    a.user_id = u.id or (a.user_id is null and
      coalesce(u.raw_app_meta_data ->> 'signup_method', '') <> 'password_without_verification')
  );
$$;

create or replace function public.revise_my_application(
  application_id uuid, application_values jsonb, expected_updated_at timestamptz
)
returns timestamptz language plpgsql security definer set search_path = '' as $$
declare
  applicant_email text;
  may_claim boolean;
  answers public.applications;
  saved_at timestamptz;
begin
  select lower(u.email), coalesce(u.raw_app_meta_data ->> 'signup_method', '') <> 'password_without_verification'
    into applicant_email, may_claim from auth.users u
    where u.id = auth.uid() and u.email_confirmed_at is not null;
  if applicant_email is null then
    raise exception 'Sign in with your application account.' using errcode = '42501';
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
    and (a.user_id = auth.uid() or (a.user_id is null and may_claim))
    and a.updated_at = expected_updated_at
  returning a.updated_at into saved_at;
  if saved_at is null then
    raise exception 'Could not save. Refresh your application and try again.' using errcode = 'P0001';
  end if;
  return saved_at;
end;
$$;
