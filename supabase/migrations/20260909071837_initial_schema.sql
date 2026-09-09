SET local check_function_bodies = off;

CREATE TABLE "public"."applications" (
  "id"                 uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"            uuid,
  "full_name"          text                     NOT NULL,
  "email"              text                     NOT NULL,
  "program"            text                     NOT NULL,
  "year"               text                     NOT NULL,
  "skills"             text                     NOT NULL,
  "interest_areas"     text                     NOT NULL,
  "github_url"         text,
  "previous_projects"  text,
  "applying_with_team" boolean                  NOT NULL DEFAULT false,
  "teammates"          text,
  "has_project_idea"   boolean                  NOT NULL DEFAULT false,
  "project_idea"       text,
  "weekly_hours"       text                     NOT NULL,
  "goals"              text                     NOT NULL,
  "reviewer_notes"     text,
  "team_id"            uuid,
  "created_at"         timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"         timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "applications_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."applications"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."check_ins" (
  "id"              uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "team_id"         uuid                     NOT NULL,
  "submitted_by"    uuid,
  "cycle"           integer                  NOT NULL,
  "completed"       text                     NOT NULL,
  "in_progress"     text                     NOT NULL,
  "next_up"         text                     NOT NULL,
  "behind_schedule" boolean                  NOT NULL DEFAULT false,
  "blockers"        text,
  "help_needed"     text,
  "created_at"      timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "check_ins_pkey" PRIMARY KEY (id),
  CONSTRAINT "check_ins_team_id_cycle_key" UNIQUE (team_id, CYCLE)
);

ALTER TABLE "public"."check_ins"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."event_rsvps" (
  "event_id"   uuid                     NOT NULL,
  "user_id"    uuid                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "event_rsvps_pkey" PRIMARY KEY (event_id, user_id)
);

ALTER TABLE "public"."event_rsvps"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."events" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "title"       text                     NOT NULL,
  "slug"        text                     NOT NULL,
  "description" text,
  "starts_at"   timestamp with time zone NOT NULL,
  "ends_at"     timestamp with time zone,
  "location"    text,
  "host"        text,
  "rsvp_url"    text,
  "published"   boolean                  NOT NULL DEFAULT false,
  CONSTRAINT "events_pkey" PRIMARY KEY (id),
  CONSTRAINT "events_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."events"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."idea_interests" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "idea_id"      uuid                     NOT NULL,
  "sender_id"    uuid                     NOT NULL,
  "sender_name"  text                     NOT NULL,
  "sender_email" text                     NOT NULL,
  "message"      text                     NOT NULL,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "idea_interests_idea_id_sender_id_key" UNIQUE (idea_id, sender_id),
  CONSTRAINT "idea_interests_message_check" CHECK (((char_length(TRIM(BOTH FROM message)) >= 10) AND (char_length(TRIM(BOTH FROM message)) <= 1000))),
  CONSTRAINT "idea_interests_pkey" PRIMARY KEY (id),
  CONSTRAINT "idea_interests_sender_email_check" CHECK (((char_length(TRIM(BOTH FROM sender_email)) >= 3) AND (char_length(TRIM(BOTH FROM sender_email)) <= 320))),
  CONSTRAINT "idea_interests_sender_name_check" CHECK (((char_length(TRIM(BOTH FROM sender_name)) >= 1) AND (char_length(TRIM(BOTH FROM sender_name)) <= 100)))
);

ALTER TABLE "public"."idea_interests"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."idea_posts" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "author_id"   uuid                     NOT NULL,
  "author_name" text                     NOT NULL,
  "title"       text                     NOT NULL,
  "summary"     text                     NOT NULL,
  "looking_for" text                     NOT NULL,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "idea_posts_author_name_check" CHECK (((char_length(TRIM(BOTH FROM author_name)) >= 1) AND (char_length(TRIM(BOTH FROM author_name)) <= 100))),
  CONSTRAINT "idea_posts_looking_for_check" CHECK (((char_length(TRIM(BOTH FROM looking_for)) >= 5) AND (char_length(TRIM(BOTH FROM looking_for)) <= 600))),
  CONSTRAINT "idea_posts_pkey" PRIMARY KEY (id),
  CONSTRAINT "idea_posts_summary_check" CHECK (((char_length(TRIM(BOTH FROM summary)) >= 20) AND (char_length(TRIM(BOTH FROM summary)) <= 1200))),
  CONSTRAINT "idea_posts_title_check" CHECK (((char_length(TRIM(BOTH FROM title)) >= 5) AND (char_length(TRIM(BOTH FROM title)) <= 100)))
);

ALTER TABLE "public"."idea_posts"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"         uuid                     NOT NULL,
  "email"      text                     NOT NULL,
  "full_name"  text,
  "program"    text,
  "year"       text,
  "github_url" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."program_settings" (
  "key"        text                     NOT NULL,
  "value"      text                     NOT NULL,
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "program_settings_pkey" PRIMARY KEY (key)
);

ALTER TABLE "public"."program_settings"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."proposals" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "team_id"      uuid                     NOT NULL,
  "problem"      text                     NOT NULL,
  "solution"     text                     NOT NULL,
  "target_user"  text                     NOT NULL,
  "mvp_scope"    text                     NOT NULL,
  "out_of_scope" text,
  "tech_stack"   text                     NOT NULL,
  "team_roles"   text                     NOT NULL,
  "milestones"   text                     NOT NULL,
  "feedback"     text,
  "submitted_at" timestamp with time zone,
  "updated_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "proposals_pkey" PRIMARY KEY (id),
  CONSTRAINT "proposals_team_id_key" UNIQUE (team_id)
);

ALTER TABLE "public"."proposals"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."resources" (
  "id"          uuid    NOT NULL DEFAULT gen_random_uuid(),
  "title"       text    NOT NULL,
  "url"         text    NOT NULL,
  "description" text,
  "category"    text    NOT NULL DEFAULT 'General'::text,
  "sort_order"  integer NOT NULL DEFAULT 0,
  "published"   boolean NOT NULL DEFAULT true,
  CONSTRAINT "resources_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."resources"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."team_members" (
  "team_id"      uuid    NOT NULL,
  "user_id"      uuid    NOT NULL,
  "role_on_team" text,
  "is_lead"      boolean NOT NULL DEFAULT false,
  CONSTRAINT "team_members_pkey" PRIMARY KEY (team_id, user_id)
);

ALTER TABLE "public"."team_members"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."teams" (
  "id"                    uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"                  text                     NOT NULL,
  "slug"                  text                     NOT NULL,
  "tagline"               text,
  "description"           text,
  "github_url"            text,
  "demo_url"              text,
  "tech_stack"            text,
  "mvp_definition"        text,
  "communication_channel" text,
  "exec_contact_name"     text,
  "exec_contact_email"    text,
  "showcased"             boolean                  NOT NULL DEFAULT false,
  "demo_day_slot"         text,
  "created_at"            timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "teams_pkey" PRIMARY KEY (id),
  CONSTRAINT "teams_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."teams"
  ENABLE ROW LEVEL SECURITY;

CREATE TYPE "public"."application_status" AS ENUM (
  'submitted',
  'under_review',
  'waitlisted',
  'accepted',
  'declined',
  'withdrawn'
);

ALTER TABLE "public"."applications"
  ADD COLUMN "status" public.application_status NOT NULL DEFAULT 'submitted'::public.application_status;

CREATE TYPE "public"."event_kind" AS ENUM (
  'workshop',
  'talk',
  'mentor_session',
  'networking',
  'career',
  'demo_day',
  'other'
);

ALTER TABLE "public"."events"
  ADD COLUMN "kind" public.event_kind NOT NULL DEFAULT 'workshop'::public.event_kind;

CREATE TYPE "public"."idea_status" AS ENUM (
  'open',
  'matched',
  'closed'
);

ALTER TABLE "public"."idea_posts"
  ADD COLUMN "status" public.idea_status NOT NULL DEFAULT 'open'::public.idea_status;

CREATE TYPE "public"."proposal_status" AS ENUM (
  'draft',
  'submitted',
  'changes_requested',
  'approved'
);

ALTER TABLE "public"."proposals"
  ADD COLUMN "status" public.proposal_status NOT NULL DEFAULT 'draft'::public.proposal_status;

CREATE TYPE "public"."team_status" AS ENUM (
  'forming',
  'active',
  'behind',
  'inactive',
  'completed'
);

ALTER TABLE "public"."teams"
  ADD COLUMN "status" public.team_status NOT NULL DEFAULT 'forming'::public.team_status;

CREATE TYPE "public"."user_role" AS ENUM (
  'student',
  'exec',
  'admin'
);

ALTER TABLE "public"."profiles"
  ADD COLUMN "role" public.user_role NOT NULL DEFAULT 'student'::public.user_role;

CREATE OR REPLACE FUNCTION public.get_project_members (
  project_team uuid
)
  RETURNS TABLE (
    full_name    text,
    github_url   text,
    role_on_team text
  )
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select p.full_name, p.github_url, tm.role_on_team
  from public.team_members tm
  join public.profiles p on p.id = tm.user_id
  join public.teams t on t.id = tm.team_id
  where tm.team_id = project_team and t.showcased
  order by p.full_name nulls last;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.idea_portal_open()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select coalesce((
    select case
      when value = '' then true
      when value ~ '^\d{4}-\d{2}-\d{2}$' then current_date <= value::date
      else false
    end
    from public.program_settings
    where key = 'applications_close'
  ), true);
$function$;

CREATE OR REPLACE FUNCTION public.is_exec()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('exec', 'admin')
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_team_member (
  target_team uuid
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select exists (
    select 1 from public.team_members
    where team_id = target_team and user_id = auth.uid()
  );
$function$;

CREATE OR REPLACE FUNCTION public.shares_team (
  target_user uuid
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select exists (
    select 1
    from public.team_members mine
    join public.team_members theirs on theirs.team_id = mine.team_id
    where mine.user_id = auth.uid() and theirs.user_id = target_user
  );
$function$;

ALTER TABLE "public"."applications"
  ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE "public"."check_ins"
  ADD CONSTRAINT "check_ins_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE "public"."event_rsvps"
  ADD CONSTRAINT "event_rsvps_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."event_rsvps"
  ADD CONSTRAINT "event_rsvps_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE "public"."idea_interests"
  ADD CONSTRAINT "idea_interests_idea_id_fkey" FOREIGN KEY (idea_id) REFERENCES public.idea_posts(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."idea_interests"
  ADD CONSTRAINT "idea_interests_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."idea_posts"
  ADD CONSTRAINT "idea_posts_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."team_members"
  ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."applications"
  ADD CONSTRAINT "applications_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

ALTER TABLE "public"."check_ins"
  ADD CONSTRAINT "check_ins_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

ALTER TABLE "public"."proposals"
  ADD CONSTRAINT "proposals_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

ALTER TABLE "public"."team_members"
  ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX applications_email_idx ON public.applications USING btree (lower(email));

CREATE INDEX idea_interests_idea_idx ON public.idea_interests USING btree (idea_id, created_at DESC);

CREATE INDEX idea_posts_status_created_idx ON public.idea_posts USING btree (status, created_at DESC);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "anyone can apply" ON "public"."applications"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((status = 'submitted'::public.application_status) AND (reviewer_notes IS NULL) AND (team_id IS NULL) AND ((user_id IS NULL) OR (user_id = auth.uid()))));

CREATE POLICY "execs manage applications" ON "public"."applications"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "read own application" ON "public"."applications"
  FOR SELECT
  TO PUBLIC
  USING (((auth.uid() = user_id) OR public.is_exec()));

CREATE POLICY "execs manage check-ins" ON "public"."check_ins"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "team reads own check-ins" ON "public"."check_ins"
  FOR SELECT
  TO PUBLIC
  USING ((public.is_team_member(team_id) OR public.is_exec()));

CREATE POLICY "team writes own check-ins" ON "public"."check_ins"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((public.is_team_member(team_id) AND (submitted_by = auth.uid())));

CREATE POLICY "cancel own rsvp" ON "public"."event_rsvps"
  FOR DELETE
  TO PUBLIC
  USING ((user_id = auth.uid()));

CREATE POLICY "read own rsvps" ON "public"."event_rsvps"
  FOR SELECT
  TO PUBLIC
  USING (((user_id = auth.uid()) OR public.is_exec()));

CREATE POLICY "rsvp for self" ON "public"."event_rsvps"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "execs manage events" ON "public"."events"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "public reads published events" ON "public"."events"
  FOR SELECT
  TO PUBLIC
  USING ((published OR public.is_exec()));

CREATE POLICY "execs manage idea interests" ON "public"."idea_interests"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "participants read idea interests" ON "public"."idea_interests"
  FOR SELECT
  TO "authenticated"
  USING (((sender_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.idea_posts
  WHERE ((idea_posts.id = idea_interests.idea_id) AND (idea_posts.author_id = auth.uid())))) OR public.is_exec()));

CREATE POLICY "senders withdraw idea interest" ON "public"."idea_interests"
  FOR DELETE
  TO "authenticated"
  USING ((sender_id = auth.uid()));

CREATE POLICY "students contact idea authors" ON "public"."idea_interests"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((sender_id = auth.uid()) AND (sender_email = ( SELECT profiles.email
   FROM public.profiles
  WHERE (profiles.id = auth.uid()))) AND public.idea_portal_open() AND (EXISTS ( SELECT 1
   FROM public.idea_posts
  WHERE ((idea_posts.id = idea_interests.idea_id) AND (idea_posts.author_id <> auth.uid()) AND (idea_posts.status = 'open'::public.idea_status))))));

CREATE POLICY "authors create ideas" ON "public"."idea_posts"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((author_id = auth.uid()) AND public.idea_portal_open()));

CREATE POLICY "authors delete ideas" ON "public"."idea_posts"
  FOR DELETE
  TO "authenticated"
  USING ((author_id = auth.uid()));

CREATE POLICY "authors update ideas" ON "public"."idea_posts"
  FOR UPDATE
  TO "authenticated"
  USING ((author_id = auth.uid()))
  WITH CHECK ((author_id = auth.uid()));

CREATE POLICY "execs manage ideas" ON "public"."idea_posts"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "public reads ideas" ON "public"."idea_posts"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "execs manage profiles" ON "public"."profiles"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "read own or teammate profile" ON "public"."profiles"
  FOR SELECT
  TO PUBLIC
  USING (((auth.uid() = id) OR public.shares_team(id) OR public.is_exec()));

CREATE POLICY "update own profile" ON "public"."profiles"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = id));

CREATE POLICY "execs manage settings" ON "public"."program_settings"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "public reads settings" ON "public"."program_settings"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "execs manage proposals" ON "public"."proposals"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "team reads own proposal" ON "public"."proposals"
  FOR SELECT
  TO PUBLIC
  USING ((public.is_team_member(team_id) OR public.is_exec()));

CREATE POLICY "team updates own proposal" ON "public"."proposals"
  FOR UPDATE
  TO PUBLIC
  USING ((public.is_team_member(team_id) AND (status <> 'approved'::public.proposal_status)))
  WITH CHECK ((public.is_team_member(team_id) AND (status = ANY (ARRAY['draft'::public.proposal_status, 'submitted'::public.proposal_status]))));

CREATE POLICY "team writes own proposal" ON "public"."proposals"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((public.is_team_member(team_id) AND (status = ANY (ARRAY['draft'::public.proposal_status, 'submitted'::public.proposal_status]))));

CREATE POLICY "execs manage resources" ON "public"."resources"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "public reads resources" ON "public"."resources"
  FOR SELECT
  TO PUBLIC
  USING ((published OR public.is_exec()));

CREATE POLICY "execs manage memberships" ON "public"."team_members"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "read team memberships" ON "public"."team_members"
  FOR SELECT
  TO PUBLIC
  USING ((public.is_team_member(team_id) OR public.is_exec()));

CREATE POLICY "execs manage teams" ON "public"."teams"
  FOR ALL
  TO PUBLIC
  USING (public.is_exec());

CREATE POLICY "public reads showcased teams" ON "public"."teams"
  FOR SELECT
  TO PUBLIC
  USING ((showcased OR public.is_team_member(id) OR public.is_exec()));

CREATE POLICY "team leads update own team" ON "public"."teams"
  FOR UPDATE
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.team_members m
  WHERE ((m.team_id = teams.id) AND (m.user_id = auth.uid()) AND m.is_lead))));

CREATE POLICY "owners update project media" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING (((bucket_id = 'project-media'::text) AND (OWNER = auth.uid())));

CREATE POLICY "public reads project media" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'project-media'::text));

CREATE POLICY "signed-in users upload project media" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'project-media'::text));

REVOKE ALL ON FUNCTION "public"."get_project_members"(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."get_project_members"(uuid) TO "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."idea_portal_open"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_exec"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_team_member"(uuid) TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."shares_team"(uuid) TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

REVOKE ALL ("applying_with_team") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("applying_with_team") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("email") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("email") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("full_name") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("full_name") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("github_url") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("github_url") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("goals") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("goals") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("has_project_idea") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("has_project_idea") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("interest_areas") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("interest_areas") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("previous_projects") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("previous_projects") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("program") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("program") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("project_idea") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("project_idea") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("skills") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("skills") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("teammates") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("teammates") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("user_id") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("user_id") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("weekly_hours") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("weekly_hours") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("year") ON TABLE "public"."applications" FROM "anon";

GRANT INSERT ("year") ON TABLE "public"."applications" TO "anon";

REVOKE ALL ("applying_with_team") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("applying_with_team") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("email") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("email") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("full_name") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("full_name") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("github_url") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("github_url") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("goals") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("goals") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("has_project_idea") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("has_project_idea") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("interest_areas") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("interest_areas") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("previous_projects") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("previous_projects") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("program") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("program") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("project_idea") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("project_idea") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("skills") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("skills") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("teammates") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("teammates") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("user_id") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("user_id") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("weekly_hours") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("weekly_hours") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ("year") ON TABLE "public"."applications" FROM "authenticated";

GRANT INSERT ("year") ON TABLE "public"."applications" TO "authenticated";

REVOKE ALL ON TABLE "public"."applications" FROM "authenticated";

GRANT SELECT ON TABLE "public"."applications" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."applications" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."check_ins" FROM "authenticated";

GRANT INSERT, SELECT ON TABLE "public"."check_ins" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."check_ins" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."event_rsvps" FROM "authenticated";

GRANT DELETE, INSERT, SELECT ON TABLE "public"."event_rsvps" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."event_rsvps" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."events" FROM "anon";

GRANT SELECT ON TABLE "public"."events" TO "anon";

REVOKE ALL ON TABLE "public"."events" FROM "authenticated";

GRANT SELECT ON TABLE "public"."events" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."events" TO "postgres", "service_role";

REVOKE ALL ("idea_id") ON TABLE "public"."idea_interests" FROM "authenticated";

GRANT INSERT ("idea_id") ON TABLE "public"."idea_interests" TO "authenticated";

REVOKE ALL ("message") ON TABLE "public"."idea_interests" FROM "authenticated";

GRANT INSERT ("message") ON TABLE "public"."idea_interests" TO "authenticated";

REVOKE ALL ("sender_email") ON TABLE "public"."idea_interests" FROM "authenticated";

GRANT INSERT ("sender_email") ON TABLE "public"."idea_interests" TO "authenticated";

REVOKE ALL ("sender_id") ON TABLE "public"."idea_interests" FROM "authenticated";

GRANT INSERT ("sender_id") ON TABLE "public"."idea_interests" TO "authenticated";

REVOKE ALL ("sender_name") ON TABLE "public"."idea_interests" FROM "authenticated";

GRANT INSERT ("sender_name") ON TABLE "public"."idea_interests" TO "authenticated";

REVOKE ALL ON TABLE "public"."idea_interests" FROM "authenticated";

GRANT DELETE, SELECT ON TABLE "public"."idea_interests" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."idea_interests" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."idea_posts" FROM "anon";

GRANT SELECT ON TABLE "public"."idea_posts" TO "anon";

REVOKE ALL ("author_id") ON TABLE "public"."idea_posts" FROM "authenticated";

GRANT INSERT ("author_id") ON TABLE "public"."idea_posts" TO "authenticated";

REVOKE ALL ("author_name") ON TABLE "public"."idea_posts" FROM "authenticated";

GRANT INSERT ("author_name") ON TABLE "public"."idea_posts" TO "authenticated";

REVOKE ALL ("looking_for") ON TABLE "public"."idea_posts" FROM "authenticated";

GRANT INSERT ("looking_for"), UPDATE ("looking_for") ON TABLE "public"."idea_posts" TO "authenticated";

REVOKE ALL ("status") ON TABLE "public"."idea_posts" FROM "authenticated";

GRANT UPDATE ("status") ON TABLE "public"."idea_posts" TO "authenticated";

REVOKE ALL ("summary") ON TABLE "public"."idea_posts" FROM "authenticated";

GRANT INSERT ("summary"), UPDATE ("summary") ON TABLE "public"."idea_posts" TO "authenticated";

REVOKE ALL ("title") ON TABLE "public"."idea_posts" FROM "authenticated";

GRANT INSERT ("title"), UPDATE ("title") ON TABLE "public"."idea_posts" TO "authenticated";

REVOKE ALL ("updated_at") ON TABLE "public"."idea_posts" FROM "authenticated";

GRANT UPDATE ("updated_at") ON TABLE "public"."idea_posts" TO "authenticated";

REVOKE ALL ON TABLE "public"."idea_posts" FROM "authenticated";

GRANT DELETE, SELECT ON TABLE "public"."idea_posts" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."idea_posts" TO "postgres", "service_role";

REVOKE ALL ("full_name") ON TABLE "public"."profiles" FROM "authenticated";

GRANT UPDATE ("full_name") ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ("github_url") ON TABLE "public"."profiles" FROM "authenticated";

GRANT UPDATE ("github_url") ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ("program") ON TABLE "public"."profiles" FROM "authenticated";

GRANT UPDATE ("program") ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ("year") ON TABLE "public"."profiles" FROM "authenticated";

GRANT UPDATE ("year") ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "authenticated";

GRANT SELECT ON TABLE "public"."profiles" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."program_settings" FROM "anon";

GRANT SELECT ON TABLE "public"."program_settings" TO "anon";

REVOKE ALL ON TABLE "public"."program_settings" FROM "authenticated";

GRANT SELECT ON TABLE "public"."program_settings" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."program_settings" TO "postgres", "service_role";

REVOKE ALL ("milestones") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("milestones"), UPDATE ("milestones") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("mvp_scope") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("mvp_scope"), UPDATE ("mvp_scope") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("out_of_scope") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("out_of_scope"), UPDATE ("out_of_scope") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("problem") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("problem"), UPDATE ("problem") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("solution") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("solution"), UPDATE ("solution") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("status") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("status"), UPDATE ("status") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("submitted_at") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("submitted_at"), UPDATE ("submitted_at") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("target_user") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("target_user"), UPDATE ("target_user") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("team_id") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("team_id"), UPDATE ("team_id") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("team_roles") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("team_roles"), UPDATE ("team_roles") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("tech_stack") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("tech_stack"), UPDATE ("tech_stack") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ("updated_at") ON TABLE "public"."proposals" FROM "authenticated";

GRANT INSERT ("updated_at"), UPDATE ("updated_at") ON TABLE "public"."proposals" TO "authenticated";

REVOKE ALL ON TABLE "public"."proposals" FROM "authenticated";

GRANT SELECT ON TABLE "public"."proposals" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."proposals" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."resources" FROM "anon";

GRANT SELECT ON TABLE "public"."resources" TO "anon";

REVOKE ALL ON TABLE "public"."resources" FROM "authenticated";

GRANT SELECT ON TABLE "public"."resources" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."resources" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."team_members" FROM "authenticated";

GRANT SELECT ON TABLE "public"."team_members" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."team_members" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."teams" FROM "anon";

GRANT SELECT ON TABLE "public"."teams" TO "anon";

REVOKE ALL ("communication_channel") ON TABLE "public"."teams" FROM "authenticated";

GRANT UPDATE ("communication_channel") ON TABLE "public"."teams" TO "authenticated";

REVOKE ALL ("demo_url") ON TABLE "public"."teams" FROM "authenticated";

GRANT UPDATE ("demo_url") ON TABLE "public"."teams" TO "authenticated";

REVOKE ALL ("description") ON TABLE "public"."teams" FROM "authenticated";

GRANT UPDATE ("description") ON TABLE "public"."teams" TO "authenticated";

REVOKE ALL ("github_url") ON TABLE "public"."teams" FROM "authenticated";

GRANT UPDATE ("github_url") ON TABLE "public"."teams" TO "authenticated";

REVOKE ALL ("mvp_definition") ON TABLE "public"."teams" FROM "authenticated";

GRANT UPDATE ("mvp_definition") ON TABLE "public"."teams" TO "authenticated";

REVOKE ALL ("name") ON TABLE "public"."teams" FROM "authenticated";

GRANT UPDATE ("name") ON TABLE "public"."teams" TO "authenticated";

REVOKE ALL ("tagline") ON TABLE "public"."teams" FROM "authenticated";

GRANT UPDATE ("tagline") ON TABLE "public"."teams" TO "authenticated";

REVOKE ALL ("tech_stack") ON TABLE "public"."teams" FROM "authenticated";

GRANT UPDATE ("tech_stack") ON TABLE "public"."teams" TO "authenticated";

REVOKE ALL ON TABLE "public"."teams" FROM "authenticated";

GRANT SELECT ON TABLE "public"."teams" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."teams" TO "postgres", "service_role";

GRANT USAGE ON TYPE "public"."application_status" TO "postgres";

GRANT USAGE ON TYPE "public"."event_kind" TO "postgres";

GRANT USAGE ON TYPE "public"."idea_status" TO "postgres";

GRANT USAGE ON TYPE "public"."proposal_status" TO "postgres";

GRANT USAGE ON TYPE "public"."team_status" TO "postgres";

GRANT USAGE ON TYPE "public"."user_role" TO "postgres";
