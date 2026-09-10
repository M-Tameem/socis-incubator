import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8").replaceAll("\r\n", "\n");
const applicant = "10000000-0000-4000-8000-000000000001";
const stranger = "10000000-0000-4000-8000-000000000002";
const unverified = "10000000-0000-4000-8000-000000000003";
const application = "20000000-0000-4000-8000-000000000001";
const otherApplication = "20000000-0000-4000-8000-000000000002";
const initialTimestamp = "2026-09-10T01:00:00Z";
const answers = {
  full_name: "Maya Chen", program: "Computer Science", year: "2nd year",
  skills: "TypeScript", interest_areas: "Web apps", github_url: null,
  previous_projects: null, applying_with_team: true,
  teammates: "A friend <friend@example.test>", has_project_idea: true,
  project_idea: "A campus meal planner", weekly_hours: "4–6 hours a week",
  goals: "Build a working project with friends",
};

test("applicant revisions enforce ownership, deadline, and field boundaries in Postgres", async (t) => {
  const db = new PGlite();
  const asUser = async (id) => {
    await db.exec("reset role;");
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
    await db.exec("set role authenticated;");
  };
  const save = (id, values, stamp) => db.query(
    "select public.revise_my_application($1::uuid, $2::jsonb, $3::timestamptz)::text as saved_at",
    [id, JSON.stringify(values), stamp],
  );
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key, email text, email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      create type public.application_status as enum ('submitted', 'under_review', 'waitlisted', 'accepted', 'declined', 'withdrawn');
      create table public.program_settings (key text primary key, value text not null, updated_at timestamptz default now());
    `);
    const schema = read("../supabase/schemas/public.sql");
    const table = schema.slice(schema.indexOf("create table applications ("), schema.indexOf("-- Teams, members, proposals, check-ins"));
    await db.exec(table);
    await db.exec("alter table public.applications enable row level security;");
    const schedule = read("../supabase/migrations/20260910020000_fall_2026_schedule.sql");
    const revisions = read("../supabase/migrations/20260910030000_applicant_revisions.sql");
    await db.exec(schedule);
    await db.exec(revisions);
    assert.ok(schema.endsWith(revisions), "declarative functions match the deployable migration");
    await db.exec("update public.program_settings set value = case key when 'applications_open' then '2000-01-01' else '2999-12-31' end where key in ('applications_open','applications_close');");
    await db.query("insert into auth.users values ($1, 'maya@example.test', now()), ($2, 'other@example.test', now()), ($3, 'unverified@example.test', null)", [applicant, stranger, unverified]);
    await db.query(`insert into public.applications
      (id, email, full_name, program, year, skills, interest_areas, weekly_hours, goals, status, reviewer_notes, updated_at)
      values ($1, 'Maya@Example.Test', 'Maya', 'CS', '2', 'TS', 'Apps', '4 hours', 'Build', 'under_review', 'Private staff note', $3),
             ($2, 'other@example.test', 'Other', 'CS', '2', 'TS', 'Apps', '4 hours', 'Build', 'submitted', 'Other private note', $3)`,
    [application, otherApplication, initialTimestamp]);

    await t.test("verified email retrieves an earlier anonymous submission without private review fields", async () => {
      await asUser(applicant);
      const result = await db.query("select * from public.get_my_application()");
      assert.equal(result.rows.length, 1);
      assert.equal(result.rows[0].id, application);
      assert.equal(result.rows[0].status, "under_review");
      for (const field of ["reviewer_notes", "team_id", "user_id"]) assert.ok(!(field in result.rows[0]));
    });

    let savedAt;
    await t.test("revision updates the same row, claims ownership, and preserves staff decisions", async () => {
      await asUser(applicant);
      savedAt = (await save(application, answers, initialTimestamp)).rows[0].saved_at;
      await db.exec("reset role;");
      const row = (await db.query("select * from public.applications where id = $1", [application])).rows[0];
      assert.equal(row.user_id, applicant);
      assert.equal(row.full_name, answers.full_name);
      assert.equal(row.teammates, answers.teammates);
      assert.equal(row.project_idea, answers.project_idea);
      assert.equal(row.status, "under_review");
      assert.equal(row.reviewer_notes, "Private staff note");
      assert.equal(row.email, "Maya@Example.Test");
      assert.equal((await db.query("select count(*)::int as count from public.applications")).rows[0].count, 2);
    });

    await t.test("another account, anonymous calls, and unverified accounts cannot revise", async () => {
      await asUser(stranger);
      await assert.rejects(save(application, answers, savedAt));
      assert.equal((await db.query("select * from public.get_my_application()")).rows[0].id, otherApplication);
      await asUser(unverified);
      assert.equal((await db.query("select * from public.get_my_application()")).rows.length, 0);
      await assert.rejects(save(application, answers, savedAt));
      await db.exec("reset role; set role anon;");
      await assert.rejects(db.query("select * from public.get_my_application()"));
      await assert.rejects(save(application, answers, savedAt));
    });

    await t.test("review fields, email, ownership, and stale submissions cannot be overwritten", async () => {
      await asUser(applicant);
      for (const patch of [{ status: "accepted" }, { reviewer_notes: "changed" }, { email: "new@example.test" }, { user_id: stranger }, { team_id: stranger }]) {
        await assert.rejects(save(application, { ...answers, ...patch }, savedAt));
      }
      await assert.rejects(save(application, answers, initialTimestamp));
      await assert.rejects(db.exec("update public.applications set status = 'accepted'"));
    });

    await t.test("applicants can remove teammates and ideas without leaving hidden stale answers", async () => {
      await asUser(applicant);
      savedAt = (await save(application, { ...answers, applying_with_team: false, has_project_idea: false }, savedAt)).rows[0].saved_at;
      const row = (await db.query("select * from public.get_my_application()")).rows[0];
      assert.equal(row.teammates, null);
      assert.equal(row.project_idea, null);
    });

    await t.test("database blocks revisions outside the application window", async () => {
      await db.exec("reset role; update public.program_settings set value = '2000-01-02' where key = 'applications_close';");
      await asUser(applicant);
      await assert.rejects(save(application, answers, savedAt));
      await db.exec("reset role; update public.program_settings set value = '2999-12-31' where key in ('applications_open','applications_close');");
      await asUser(applicant);
      await assert.rejects(save(application, answers, savedAt));
    });
  } finally {
    await db.close();
  }
});
