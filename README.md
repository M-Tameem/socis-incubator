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
| `/apply` | One application for groups or solo applicants; sign in to revise until the deadline |
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

- `/admin/moderation`: review and permanently delete any idea post or private interest message. Deleting a post cascades to its messages. Confirmation is required in the interface; delivered email notifications cannot be recalled. Both the server action and existing database policies enforce executive access, including after applications close.

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
http://localhost:3000/auth/callback**
https://socis-incubator.vercel.app/auth/callback**
```

Sign-in uses an email address and password. Signup creates an active account immediately,
without sending a confirmation email. Users choose a recovery answer at signup and can reset
their password with that answer; the answer is salted and hashed with scrypt in a server-only
table. Signup and recovery each allow five attempts per email per hour, plus 200 per IP per
hour on Vercel, enforced in Postgres across app instances. Other hosts share the IP bucket
until their trusted proxy is configured. Ordinary sign-in uses Supabase's password endpoint.

Apply all migrations through `20260910040000_password_recovery.sql` before deploying this
flow. The app uses the server-only admin API to activate **new** accounts and marks them
`password_without_verification`; it never activates or changes an existing account just
because somebody enters its email. Leave Supabase's direct email-signup confirmation setting
enabled so clients outside this flow cannot masquerade as legacy email-verified accounts.
No SMTP setup is required for the app's signup, login, or recovery flows.

Existing users who are still signed in can open `/account/password` to set a password and
recovery answer. Users who have neither a password nor a recovery answer need a trusted
SOCIS operator to verify them and set a temporary password through the Supabase Auth Admin
API. Never create a replacement account or change its role to resolve a forgotten password.

For the hosted project, set **Site URL** to `https://socis-incubator.vercel.app`.
The callback allow-list entries above include the `?next=...` query used by sign-in.
`supabase/config.toml` configures local development; it does not update the hosted project's
Authentication URL Configuration when database migrations are pushed.

### 3. Resend

Create an API key at [resend.com](https://resend.com) and verify the sending domain.
Set `RESEND_API_KEY`, `EMAIL_FROM`, and `EMAIL_ADMIN`.

The public contact and transactional email Reply-To address is `socis@uoguelph.ca`.
Set `EMAIL_ADMIN=socis@uoguelph.ca` in Vercel for application alerts. Keep `EMAIL_FROM`
on your verified Resend sending domain; a contact address does not grant permission to send
from the university's domain. Signup, sign-in, and recovery do not send email.

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

### 5. Enroll SOCIS staff and executives

Have each staff member create an account at `/login?mode=signup` and sign in with their password. This creates their profile; they do not need to submit a student application.
A trusted Supabase project operator then runs this in the production SQL editor, replacing
the example address with the staff member's exact sign-in email:

```sql
update public.profiles
set role = 'exec'
where lower(email) = lower('staff-member@uoguelph.ca')
returning id, email, role;
```

Confirm that the returned row is the intended person. Zero rows means no matching profile
exists yet. They can then reload `/admin`; the app reads the role from the database on each
request, so no new deployment is needed.

Roles are `student`, `exec`, and `admin`; there is no separate `staff` role or staff invitation
screen. Use `exec` for staff who should operate the incubator and `admin` for the owner.
Both currently have the same program-management permissions, including private applications,
team management, and settings. Neither can grant roles through the website; role assignment
requires trusted database access. Never grant access to everyone sharing an email domain.

To remove staff access, run the same update with `role = 'student'` and verify the returned row.

---

## Deploying to Vercel

Import the repository, then add the same environment variables from `.env.example`.
Set `NEXT_PUBLIC_SITE_URL` to the production URL. Email links are built from it.

For this deployment, use `NEXT_PUBLIC_SITE_URL=https://socis-incubator.vercel.app` in the
Vercel **Production** environment and redeploy after changing it. The app uses that origin
for auth and transactional links; missing, malformed, insecure, or localhost production
values fall back to the production address above. Development still defaults to localhost.

For previously issued magic links that send you to localhost, check both that Vercel variable and Supabase
**Authentication → URL Configuration** (Site URL and allowed callback URL above). Keep the
Magic Link email template pointing to `{{ .ConfirmationURL }}` for the existing code-exchange
flow. After correcting the settings, request a fresh link and open it in the browser where
you requested it. Already-issued emails retain their original redirect URL.

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. It bypasses row-level security and is
used by executive actions after authorization, account settings after session verification,
and signup/recovery after validation and persistent rate-limit checks. Recovery requires the
correct answer before the admin API changes the matching account password.

Before the first production deploy:

1. Push the migrations in `supabase/migrations` to the target Supabase project.
2. Add every variable from `.env.example` to the Vercel project. Production needs real values
   for both public Supabase variables and `SUPABASE_SERVICE_ROLE_KEY`.
3. Add the production `/auth/callback` URL to Supabase Authentication URL Configuration.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, with no trailing slash.
5. Run `npm run check`, then exercise signup, password login, recovery, application submission,
   and an admin status update against the production Supabase project.

---

## Running a semester

Fall 2026 targets 15 teams (45–75 students). Week 1 begins September 14, applications run
September 9–27, with help finding teammates available from September 22. Friends and groups
formed around an idea each list the same teammates and project name in the normal application.
Solo applicants use the same form and can be matched after the deadline. Initial project ideas
are part of the application; detailed team planning happens after joining.

Teams will finish a working project by semester's end, pitch at the Wood Centre's Open Pitch
Night on **November 19 at the Bullring**, and present at SOCIS Demo Day (date, time, and location
TBD). Weeks 10–13 focus on finalization; remaining arrangements are TBD. The calendar is in
`src/lib/program.ts` and selected Wood Centre opportunities are in `src/lib/wood-centre.ts`,
using the event postcard and September 8 organizer confirmation supplied by SOCIS.
Microgrants are **$50–$75 per team** for approved costs. Prize and industry collaborator details
will be announced as confirmed.

Apply `20260910020000_fall_2026_schedule.sql` when deploying these dates to an existing
Supabase project. It updates the saved schedule and aligns idea-board access with the full
application window in Toronto time. New/local previews use the same dates by default.
Keep unconfirmed Demo Day settings empty so the site displays **TBD**, rather than saving
the text `TBD` in a date field.

Also apply `20260910030000_applicant_revisions.sql` before deploying application editing.
New applicants create an account before submitting, then return to `/apply` to revise.
Applications are attached to the signed-in user's ID. Legacy email-verified accounts can still
retrieve an earlier anonymous submission. New password-only accounts cannot claim one by
matching its email; SOCIS must verify the person and link that existing application to their
account ID. Narrow database functions
return only applicant-visible fields and revise only their own answers while the application
window is open. Email, review decisions, notes, and team assignments cannot be changed through
this flow. A revision updates the existing row, checks for stale edits, and sends no duplicate
submission emails. The Postgres tests exercise these access and deadline boundaries.

1. **Before the semester:** set the dates in `/admin/settings`, add resource links, edit
   `src/lib/program.ts` if the phases or FAQ change.
2. **Week 1:** applications arrive at `/admin/applications`. Each status change optionally
   emails the applicant, so you can reorganize quietly and notify everyone at once.
3. **Weeks 2–3:** record groups that applied together in `/admin/teams` and help solo applicants
   find teammates after the deadline. Add members by email and assign executive contacts.
   Students must sign in once before they can be added, so a profile exists.
4. **Week 3 onward:** groups develop their project plans. Use the existing proposal review
   tools for feedback on scope after joining. Approved plans lock.
5. **Weeks 4–9:** watch `/admin/check-ins?flagged=1` for teams that are behind or asking
   for help. That filter is the early-warning system the program plan depends on.
6. **Weeks 10–13:** pitch at the Wood Centre on November 19 and finalize the project. Once
   Demo Day is scheduled, set slots and tick **Show publicly** to publish teams to `/projects`
   and `/demo-day`.
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
an interest message or email address. Students form groups through conversation and list the
same teammates when applying; executives record those groups in `/admin/teams`.

**`proxy.ts`** (called `middleware.ts` before Next 16) refreshes the Supabase session on
every request and redirects signed-out visitors away from `/dashboard` and `/admin`.

**Design constraints**, if you are adding pages: one type family (the system UI stack, no
webfonts), a pink-purple SOCIS accent, hairline borders instead of shadows, and no decorative
motion. Light and dark themes share the same semantic colour tokens. Body copy is capped with
`.prose-page`.

The custom jellyfish is an inline SVG in `src/components/jellyfish-mark.tsx`, rendered in the
shared header and on the home and About pages at mobile and desktop sizes. It needs no
environment flag or JavaScript. `src/app/icon.svg` is its matching browser icon. The public
contact defaults to `socis@uoguelph.ca`; an old seeded `incubator@socis.ca` value is also
resolved to that address, while other addresses saved in `/admin/settings` are preserved.

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
    auth/                 legacy email-link callback and sign-out
    account/password/     password and recovery-answer settings
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
