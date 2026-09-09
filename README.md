# SOCIS Computer Science Incubator

The public information hub, application system, lightweight program dashboard, and
project showcase for the SOCIS Computer Science Incubator.

Built with Next.js 16, TypeScript, Tailwind CSS v4, Supabase (database, auth, storage),
Resend (transactional email), and deployed on Vercel.

This site deliberately does **not** try to replace GitHub, Discord, Google Drive, or a
project-management tool. Each of those has a job, and the site links out to them.

---

## What is here

**Public**

| Route | Purpose |
| --- | --- |
| `/` | What the incubator is, key facts, the four phases |
| `/about` | How it works: eligibility, expectations, phases, scope rule, money |
| `/ideas`, `/ideas/[id]` | Public idea board with private expressions of interest |
| `/ideas/new` | Signed-in form for posting an idea before applications close |
| `/timeline` | Important dates and the week-by-week schedule |
| `/apply` | Application form (closes automatically after the closing date) |
| `/faq` | Common questions |
| `/events` | Workshops, talks, mentor sessions, with registration links |
| `/projects`, `/projects/[slug]` | Showcase of completed projects |
| `/resources` | Templates, guidelines, check-in questions, tool boundaries |
| `/demo-day` | Date, schedule, presenting teams, info for guests |
| `/contact` | Who does what, and how to reach them |

**Students** (sign-in required)

- `/dashboard`: application status, or team status once placed
- `/dashboard/team`: members, executive contact, GitHub repo, project details
- `/dashboard/proposal`: project proposal with review feedback
- `/dashboard/check-ins`: bi-weekly check-ins and history

**Executives** (`exec` or `admin` role required)

- `/admin`: counts, teams needing attention, recent check-ins
- `/admin/applications`: review, status changes, optional decision emails, private notes
- `/admin/teams`: create teams, assign members and exec contacts, review proposals, publish to the showcase
- `/admin/check-ins`: all check-ins, filterable to those needing follow-up
- `/admin/events`: create and publish events
- `/admin/settings`: the dates and links shown across the public site

---

## Setup

### 1. Install

```bash
nvm use                 # Node 22.13+; install it first if needed
npm ci
cp .env.example .env.local
```

### 2. Supabase

Create a project at [supabase.com](https://supabase.com), link the Supabase CLI to it, then apply
the checked-in database history:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

The migrations create the tables, enums, row-level security policies, grants, and storage bucket.
`supabase/seed.sql` contains optional starter dates and resource links; edit it before running it
in the SQL editor.

Copy the project URL and keys from **Project Settings → API** into `.env.local`.

Under **Authentication → URL Configuration**, add your redirect URLs:

```
http://localhost:3000/auth/callback
https://your-domain.vercel.app/auth/callback
```

Sign-in is by emailed magic link, so there are no passwords to manage or reset.

### 3. Resend

Create an API key at [resend.com](https://resend.com) and verify the sending domain.
Set `RESEND_API_KEY`, `EMAIL_FROM`, and `EMAIL_ADMIN`.

Without `RESEND_API_KEY` the app logs emails to the console instead of sending them,
so local development works with no Resend account.

### 4. Run

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint + Next.js Core Web Vitals rules
npm run check      # lint, typecheck, and production build
```

The repository includes a GitHub Actions workflow that runs the same deployment checks on
every push and pull request.

### 5. Make yourself an executive

Sign in once so a profile row is created, then in the Supabase SQL editor:

```sql
update profiles set role = 'admin' where email = 'you@socis.ca';
```

Roles are `student`, `exec`, and `admin`. Both `exec` and `admin` can reach `/admin`.

---

## Deploying to Vercel

Import the repository, then add the same environment variables from `.env.example`.
Set `NEXT_PUBLIC_SITE_URL` to the production URL. Email links are built from it.

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. It bypasses row-level security and is
used only by admin server actions that have already verified the caller is an executive.

Before the first production deploy:

1. Push the migrations in `supabase/migrations` to the target Supabase project.
2. Add every variable from `.env.example` to the Vercel project. Production needs real values
   for both public Supabase variables and `SUPABASE_SERVICE_ROLE_KEY`.
3. Add the production `/auth/callback` URL to Supabase Authentication URL Configuration.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, with no trailing slash.
5. Run `npm run check`, then exercise one magic-link login, application submission, and admin
   status update against the production Supabase project.

---

## Running a semester

1. **Before the semester:** set the dates in `/admin/settings`, add resource links, edit
   `src/lib/program.ts` if the phases or FAQ change.
2. **Week 1:** applications arrive at `/admin/applications`. Each status change optionally
   emails the applicant, so you can reorganize quietly and notify everyone at once.
3. **Week 2:** create teams in `/admin/teams`, add members by email, assign executive
   contacts. Students must sign in once before they can be added, so a profile exists.
4. **Week 2–3:** teams submit proposals; approve or request changes. Feedback is emailed
   to the whole team. Approved proposals lock.
5. **Weeks 4–11:** watch `/admin/check-ins?flagged=1` for teams that are behind or asking
   for help. That filter is the early-warning system the program plan depends on.
6. **Weeks 11–13:** set Demo Day slots and tick **Show publicly** on each team to publish
   them to `/projects` and `/demo-day`.
7. **After Demo Day:** leave the projects published. That archive is the point.

---

## Notes for whoever maintains this

**Program copy lives in `src/lib/program.ts`.** Phases, milestones, FAQ, eligibility,
expectations, exec roles, and the check-in questions are all there, in version control
rather than the database, because they change once a semester. Dates and links that change
mid-semester live in the `program_settings` table and are edited at `/admin/settings`.

**Database types are hand-written** in `src/lib/types.ts`. If you change the schema,
regenerate them instead of editing by hand:

```bash
npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
```

Then import `Database` from that file in `src/lib/supabase/*.ts`.

**Row-level security does the real access control.** The UI hides things, but the policies
in `schemas/public.sql` are what actually enforce that students only read their own application,
their own team's proposal, and their own team's check-ins. Do not disable RLS to fix a bug.

**Idea posts are public; contact details are not.** Signed-in students can post and express
interest until applications close. Only the sender, the idea author, and executives can read
an interest message or email address. A portal response does not create a team; executives
still finalize membership in `/admin/teams`.

**`proxy.ts`** (called `middleware.ts` before Next 16) refreshes the Supabase session on
every request and redirects signed-out visitors away from `/dashboard` and `/admin`.

**Design constraints**, if you are adding pages: one type family (the system UI stack, no
webfonts), a pink-purple SOCIS accent, hairline borders instead of shadows, and no decorative
motion. Light and dark themes share the same semantic colour tokens. Body copy is capped with
`.prose-page`.

The jellyfish on the local home page is an isolated experiment. It lives in
`src/components/experiments/jellyfish-mark.tsx` and only renders when
`NEXT_PUBLIC_SHOW_MASCOT=true`. That flag is intentionally absent from `.env.example`, so the
mascot will not appear in a normal deployment unless someone opts in.

**The lifecycle demo is local-only.** Set `DEMO_MODE=true` in `.env.local`, open `/login`, and
choose the student or executive session. The sessions use fictional read-only fixtures and an
HTTP-only role cookie. `DEMO_MODE` is ignored in production even if it is accidentally set, and
the flag is intentionally absent from `.env.example`.

---

## Project structure

```
src/
  app/
    (public pages)        home, about, timeline, apply, faq, events,
                          ideas, projects, resources, demo-day, contact
    dashboard/            student area: team, proposal, check-ins
    admin/                executive area: applications, teams, check-ins,
                          events, settings
    auth/                 magic-link callback and sign-out
  components/
    ui/                   shadcn-style primitives
    site-header, site-footer, nav-link, page-header, status-badge, form
  lib/
    supabase/             browser, server, admin, and proxy clients
    program.ts            program content from the execution plan
    settings.ts           editable dates and links
    validation.ts         Zod schemas for every form
    email.ts              Resend templates
    types.ts              database types
supabase/
  schemas/public.sql      declarative tables and RLS
  migrations/             deployable database history
  seed.sql                local starter data
```
