-- SOCIS Computer Science Incubator database schema
-- Run this in the Supabase SQL editor, or with `supabase db push`.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role as enum ('student', 'exec', 'admin');
create type application_status as enum ('submitted', 'under_review', 'waitlisted', 'accepted', 'declined', 'withdrawn');
create type team_status as enum ('forming', 'active', 'behind', 'inactive', 'completed');
create type proposal_status as enum ('draft', 'submitted', 'changes_requested', 'approved');
create type event_kind as enum ('workshop', 'talk', 'mentor_session', 'networking', 'career', 'demo_day', 'other');
create type idea_status as enum ('open', 'matched', 'closed');

-- ---------------------------------------------------------------------------
-- Profiles — one row per authenticated user
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  program text,
  year text,
  github_url text,
  role user_role not null default 'student',
  created_at timestamptz not null default now()
);

-- Create a profile automatically on signup.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helpers used by policies. security definer so they can read the tables
-- without recursing back through these same policies.
create function public.is_exec()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('exec', 'admin')
  );
$$;

-- ---------------------------------------------------------------------------
-- Applications
-- ---------------------------------------------------------------------------
create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  full_name text not null,
  email text not null,
  program text not null,
  year text not null,
  skills text not null,
  interest_areas text not null,
  github_url text,
  previous_projects text,
  applying_with_team boolean not null default false,
  teammates text,
  has_project_idea boolean not null default false,
  project_idea text,
  weekly_hours text not null,
  goals text not null,
  status application_status not null default 'submitted',
  reviewer_notes text,
  team_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index applications_email_idx on applications (lower(email));

-- ---------------------------------------------------------------------------
-- Teams, members, proposals, check-ins
-- ---------------------------------------------------------------------------
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  github_url text,
  demo_url text,
  tech_stack text,
  mvp_definition text,
  communication_channel text,
  exec_contact_name text,
  exec_contact_email text,
  status team_status not null default 'forming',
  showcased boolean not null default false,
  demo_day_slot text,
  created_at timestamptz not null default now()
);

alter table applications
  add constraint applications_team_id_fkey
  foreign key (team_id) references teams on delete set null;

create table team_members (
  team_id uuid not null references teams on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role_on_team text,
  is_lead boolean not null default false,
  primary key (team_id, user_id)
);

-- Defined after team_members so PostgreSQL can validate the function body.
create function public.is_team_member(target_team uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.team_members
    where team_id = target_team and user_id = auth.uid()
  );
$$;

create function public.shares_team(target_user uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.team_members mine
    join public.team_members theirs on theirs.team_id = mine.team_id
    where mine.user_id = auth.uid() and theirs.user_id = target_user
  );
$$;

create table proposals (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null unique references teams on delete cascade,
  problem text not null,
  solution text not null,
  target_user text not null,
  mvp_scope text not null,
  out_of_scope text,
  tech_stack text not null,
  team_roles text not null,
  milestones text not null,
  status proposal_status not null default 'draft',
  feedback text,
  submitted_at timestamptz,
  updated_at timestamptz not null default now()
);

create table check_ins (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  submitted_by uuid references auth.users on delete set null,
  cycle integer not null,               -- which bi-weekly cycle this covers
  completed text not null,
  in_progress text not null,
  next_up text not null,
  behind_schedule boolean not null default false,
  blockers text,
  help_needed text,
  created_at timestamptz not null default now(),
  unique (team_id, cycle)
);

-- ---------------------------------------------------------------------------
-- Events and resources
-- ---------------------------------------------------------------------------
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  kind event_kind not null default 'workshop',
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  host text,
  rsvp_url text,
  published boolean not null default false
);

create table event_rsvps (
  event_id uuid not null references events on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text,
  category text not null default 'General',
  sort_order integer not null default 0,
  published boolean not null default true
);

-- Key/value for dates shown across the site (demo_day_date, applications_close…)
create table program_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Idea portal
-- ---------------------------------------------------------------------------
create table idea_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles on delete cascade,
  author_name text not null check (char_length(trim(author_name)) between 1 and 100),
  title text not null check (char_length(trim(title)) between 5 and 100),
  summary text not null check (char_length(trim(summary)) between 20 and 1200),
  looking_for text not null check (char_length(trim(looking_for)) between 5 and 600),
  status idea_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idea_posts_status_created_idx on idea_posts (status, created_at desc);

create table idea_interests (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references idea_posts on delete cascade,
  sender_id uuid not null references profiles on delete cascade,
  sender_name text not null check (char_length(trim(sender_name)) between 1 and 100),
  sender_email text not null check (char_length(trim(sender_email)) between 3 and 320),
  message text not null check (char_length(trim(message)) between 10 and 1000),
  created_at timestamptz not null default now(),
  unique (idea_id, sender_id)
);

create index idea_interests_idea_idx on idea_interests (idea_id, created_at desc);

-- The portal follows the same closing date as applications. A missing closing
-- date keeps local previews usable; a malformed date closes the portal.
create function public.idea_portal_open()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select coalesce((
    select case
      when value = '' then true
      when value ~ '^\d{4}-\d{2}-\d{2}$' then current_date <= value::date
      else false
    end
    from public.program_settings
    where key = 'applications_close'
  ), true);
$$;

-- Public project credits expose only the three fields returned here. Keeping
-- this behind a narrow function avoids making profile emails publicly readable.
create function public.get_project_members(project_team uuid)
returns table (full_name text, github_url text, role_on_team text)
language sql
stable
security definer set search_path = ''
as $$
  select p.full_name, p.github_url, tm.role_on_team
  from public.team_members tm
  join public.profiles p on p.id = tm.user_id
  join public.teams t on t.id = tm.team_id
  where tm.team_id = project_team and t.showcased
  order by p.full_name nulls last;
$$;

revoke all on function public.get_project_members(uuid) from public;
grant execute on function public.get_project_members(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table applications enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table proposals enable row level security;
alter table check_ins enable row level security;
alter table events enable row level security;
alter table event_rsvps enable row level security;
alter table resources enable row level security;
alter table program_settings enable row level security;
alter table idea_posts enable row level security;
alter table idea_interests enable row level security;

-- Profiles
create policy "read own or teammate profile" on profiles for select using (
  auth.uid() = id or public.shares_team(id) or public.is_exec()
);
create policy "update own profile" on profiles for update using (auth.uid() = id);
create policy "execs manage profiles" on profiles for all using (public.is_exec());

-- A student may edit public profile fields, never their authorization role.
revoke all on profiles from anon, authenticated;
grant select on profiles to authenticated;
grant update (full_name, program, year, github_url) on profiles to authenticated;

-- Applications: anyone may submit a fresh application; applicants read their own;
-- execs read and manage all. Prevent direct API callers from choosing another
-- user's id or pre-setting review-only fields.
create policy "anyone can apply" on applications for insert with check (
  status = 'submitted'
  and reviewer_notes is null
  and team_id is null
  and (user_id is null or user_id = auth.uid())
);
create policy "read own application" on applications for select using (auth.uid() = user_id or public.is_exec());
create policy "execs manage applications" on applications for all using (public.is_exec());

revoke all on applications from anon, authenticated;
grant select on applications to authenticated;
grant insert (
  user_id, full_name, email, program, year, skills, interest_areas,
  github_url, previous_projects, applying_with_team, teammates,
  has_project_idea, project_idea, weekly_hours, goals
) on applications to anon, authenticated;

-- Teams: showcased teams are public; members and execs see the rest.
create policy "public reads showcased teams" on teams for select using (showcased or public.is_team_member(id) or public.is_exec());
create policy "team leads update own team" on teams for update using (
  exists (select 1 from team_members m where m.team_id = teams.id and m.user_id = auth.uid() and m.is_lead)
);
create policy "execs manage teams" on teams for all using (public.is_exec());

-- Team leads can edit project copy, but not publication state or admin fields.
revoke all on teams from anon, authenticated;
grant select on teams to anon, authenticated;
grant update (
  name, tagline, description, github_url, demo_url, tech_stack,
  mvp_definition, communication_channel
) on teams to authenticated;

create policy "read team memberships" on team_members for select using (
  public.is_team_member(team_id) or public.is_exec()
);
create policy "execs manage memberships" on team_members for all using (public.is_exec());

-- Proposals and check-ins: team members write, execs read everything.
create policy "team reads own proposal" on proposals for select using (public.is_team_member(team_id) or public.is_exec());
create policy "team writes own proposal" on proposals for insert with check (
  public.is_team_member(team_id) and status in ('draft', 'submitted')
);
create policy "team updates own proposal" on proposals for update
  using (public.is_team_member(team_id) and status <> 'approved')
  with check (public.is_team_member(team_id) and status in ('draft', 'submitted'));
create policy "execs manage proposals" on proposals for all using (public.is_exec());

create policy "team reads own check-ins" on check_ins for select using (public.is_team_member(team_id) or public.is_exec());
create policy "team writes own check-ins" on check_ins for insert with check (
  public.is_team_member(team_id) and submitted_by = auth.uid()
);
create policy "execs manage check-ins" on check_ins for all using (public.is_exec());

-- Events and resources: published rows are public.
create policy "public reads published events" on events for select using (published or public.is_exec());
create policy "execs manage events" on events for all using (public.is_exec());

create policy "read own rsvps" on event_rsvps for select using (user_id = auth.uid() or public.is_exec());
create policy "rsvp for self" on event_rsvps for insert with check (user_id = auth.uid());
create policy "cancel own rsvp" on event_rsvps for delete using (user_id = auth.uid());

create policy "public reads resources" on resources for select using (published or public.is_exec());
create policy "execs manage resources" on resources for all using (public.is_exec());

create policy "public reads settings" on program_settings for select using (true);
create policy "execs manage settings" on program_settings for all using (public.is_exec());

-- Ideas are public to browse. Posting and contacting require a signed-in
-- profile and close with applications. Contact details are visible only to the
-- sender, the idea owner, and executives.
create policy "public reads ideas" on idea_posts for select using (true);
create policy "authors create ideas" on idea_posts for insert to authenticated with check (
  author_id = auth.uid() and public.idea_portal_open()
);
create policy "authors update ideas" on idea_posts for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());
create policy "authors delete ideas" on idea_posts for delete to authenticated using (
  author_id = auth.uid()
);
create policy "execs manage ideas" on idea_posts for all using (public.is_exec());

revoke all on idea_posts from anon, authenticated;
grant select on idea_posts to anon, authenticated;
grant insert (author_id, author_name, title, summary, looking_for) on idea_posts to authenticated;
grant update (title, summary, looking_for, status, updated_at) on idea_posts to authenticated;
grant delete on idea_posts to authenticated;

create policy "participants read idea interests" on idea_interests for select to authenticated using (
  sender_id = auth.uid()
  or exists (
    select 1 from public.idea_posts
    where idea_posts.id = idea_interests.idea_id
      and idea_posts.author_id = auth.uid()
  )
  or public.is_exec()
);
create policy "students contact idea authors" on idea_interests for insert to authenticated with check (
  sender_id = auth.uid()
  and sender_email = (
    select profiles.email from public.profiles where profiles.id = auth.uid()
  )
  and public.idea_portal_open()
  and exists (
    select 1 from public.idea_posts
    where idea_posts.id = idea_interests.idea_id
      and idea_posts.author_id <> auth.uid()
      and idea_posts.status = 'open'
  )
);
create policy "senders withdraw idea interest" on idea_interests for delete to authenticated using (
  sender_id = auth.uid()
);
create policy "execs manage idea interests" on idea_interests for all using (public.is_exec());

revoke all on idea_interests from anon, authenticated;
grant select, delete on idea_interests to authenticated;
grant insert (idea_id, sender_id, sender_name, sender_email, message) on idea_interests to authenticated;

-- Explicit table privileges backstop RLS and remove Supabase's broad default
-- grants from public API roles. Administrative writes use the service role
-- only after the server action verifies the executive session.
revoke all on team_members, proposals, check_ins, events, event_rsvps,
  resources, program_settings from anon, authenticated;
grant select on team_members, proposals, check_ins to authenticated;
grant insert (
  team_id, problem, solution, target_user, mvp_scope, out_of_scope,
  tech_stack, team_roles, milestones, status, submitted_at, updated_at
) on proposals to authenticated;
grant update (
  team_id, problem, solution, target_user, mvp_scope, out_of_scope,
  tech_stack, team_roles, milestones, status, submitted_at, updated_at
) on proposals to authenticated;
grant insert on check_ins to authenticated;
grant select on events, resources, program_settings to anon, authenticated;
grant select, insert, delete on event_rsvps to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: team logos and Demo Day screenshots. The bucket itself is created
-- by a migration because declarative schema files cannot contain data rows.
-- ---------------------------------------------------------------------------
create policy "public reads project media" on storage.objects
  for select using (bucket_id = 'project-media');
create policy "signed-in users upload project media" on storage.objects
  for insert to authenticated with check (bucket_id = 'project-media');
create policy "owners update project media" on storage.objects
  for update to authenticated using (bucket_id = 'project-media' and owner = auth.uid());
