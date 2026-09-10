import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { z } from "zod";
import { safeRedirectPath } from "../src/lib/navigation.ts";
import * as recovery from "../src/lib/recovery.ts";
import { signupErrorDetails } from "../src/lib/signup-error.ts";

const code = ts.transpileModule(readFileSync(new URL("../src/app/login/actions.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const userId = "10000000-0000-4000-8000-000000000001";
function fixture({ allowed = true, matches = true, existing = true, authError = null } = {}) {
  const calls = [];
  const chain = {
    select() { return this; }, eq(key, value) { calls.push(["lookup", key, value]); return this; },
    async maybeSingle() { return { data: existing ? { user_id: userId, answer_hash: "HASH" } : null, error: null }; },
    async insert(row) { calls.push(["saveRecovery", row]); return { error: null }; },
  };
  const admin = {
    from(table) { assert.equal(table, "account_recovery"); return chain; },
    auth: { admin: {
      async createUser(values) { calls.push(["createUser", values]); return { data: { user: { id: userId } }, error: authError }; },
      async getUserById(id) { calls.push(["getUser", id]); return { data: { user: { id, email: "user@example.test" } }, error: null }; },
      async updateUserById(id, values) { calls.push(["setPassword", id, values]); return { error: null }; },
    } },
  };
  const imports = {
    zod: { z },
    "@/lib/supabase/server": { async createClient() { return { auth: {
      async signInWithPassword(values) { calls.push(["signIn", values]); return { error: authError }; },
    } }; } },
    "@/lib/supabase/admin": { createAdminClient() { calls.push(["admin"]); return admin; } },
    "@/lib/navigation": { safeRedirectPath },
    "@/lib/signup-error": { signupErrorDetails },
    "@/lib/auth-attempts": { async allowAuthAttempt(...args) { calls.push(["limit", ...args]); return allowed; } },
    "@/lib/recovery": {
      normalizeRecoveryAnswer: recovery.normalizeRecoveryAnswer,
      async hashRecoveryAnswer() { return "HASH"; },
      async verifyRecoveryAnswer(answer, hash) { calls.push(["verify", hash]); return matches && hash !== null; },
    },
    "next/cache": { revalidatePath() {} },
    "next/navigation": { redirect(path) { throw new Error(`REDIRECT:${path}`); } },
  };
  const context = { exports: {}, console: { error(...args) { calls.push(["log", ...args]); } }, require(name) { assert.ok(imports[name], name); return imports[name]; } };
  vm.runInNewContext(code, context);
  return { actions: context.exports, calls };
}

function form(patch = {}) {
  const result = new FormData();
  for (const [key, value] of Object.entries({ email: " User@Example.Test ", password: "new-password-123", confirm_password: "new-password-123", recovery_answer: "Quiet Jellyfish", next: "/apply", ...patch })) result.set(key, value);
  return result;
}

test("password sign-in sends no email and constrains redirects to this site", async () => {
  const { actions, calls } = fixture();
  await assert.rejects(actions.signIn({}, form({ next: "//attacker.example" })), /REDIRECT:\/dashboard/);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "signIn");
  assert.equal(calls[0][1].email, "user@example.test");
});

test("signup activates a new student account without email and saves only a recovery hash", async () => {
  const { actions, calls } = fixture();
  await assert.rejects(actions.signUp({}, form({ role: "admin", user_id: "another-user" })), /REDIRECT:\/apply/);
  const created = calls.find(([name]) => name === "createUser")[1];
  assert.equal(created.email_confirm, true);
  assert.equal(created.app_metadata.signup_method, "password_without_verification");
  assert.equal(created.role, undefined);
  assert.equal(created.id, undefined);
  assert.equal(created.user_metadata, undefined);
  const saved = calls.find(([name]) => name === "saveRecovery")[1];
  assert.equal(saved.answer_hash, "HASH");
  assert.equal(saved.user_id, userId);
  assert.equal(JSON.stringify(saved).includes("Quiet Jellyfish"), false);
});

test("invalid input and exhausted limits prevent privileged signup and password resets", async () => {
  for (const operation of ["signUp", "resetPassword"]) {
    for (const overrides of [{ confirm_password: "wrong" }, { email: "bad" }, { password: "short" }]) {
      const { actions, calls } = fixture();
      assert.ok((await actions[operation]({}, form(overrides))).error);
      assert.equal(calls.length, 0);
    }
    const { actions, calls } = fixture({ allowed: false });
    assert.ok((await actions[operation]({}, form())).error);
    assert.equal(calls.some(([name]) => name === "admin"), false);
  }
});

test("wrong or missing recovery answers never change a password", async () => {
  for (const options of [{ matches: false }, { existing: false }]) {
    const { actions, calls } = fixture(options);
    const result = await actions.resetPassword({}, form());
    assert.ok(result.error);
    assert.equal(calls.some(([name]) => name === "setPassword"), false);
    assert.equal(JSON.stringify(result).includes("new-password-123"), false);
    assert.equal(JSON.stringify(result).includes("Quiet Jellyfish"), false);
  }
});

test("recovery resets only the account that matched the answer, with no supplied ID or role", async () => {
  const { actions, calls } = fixture();
  assert.match((await actions.resetPassword({}, form({ user_id: "attacker", role: "admin" }))).message, /Password updated/);
  const change = calls.find(([name]) => name === "setPassword");
  assert.equal(change[1], userId);
  assert.deepEqual(Object.keys(change[2]), ["password"]);
});

test("sign-in errors never return passwords or recovery answers", async () => {
  const { actions } = fixture({ authError: { code: "invalid_credentials" } });
  const result = await actions.signIn({}, form());
  assert.ok(result.error);
  assert.deepEqual(Object.keys(result).sort(), ["email", "error"]);
});

test("signup reports Supabase error codes without changing existing accounts or logging secrets", async () => {
  for (const [code, expected] of [
    ["email_exists", /already exists/],
    ["user_already_exists", /already exists/],
    ["unexpected_failure", /could not create/],
    ["not_admin", /not configured/],
    ["weak_password", /password requirements/],
    ["email_address_invalid", /rejected this email/],
  ]) {
    const { actions, calls } = fixture({ authError: { code, status: 400, message: "raw server response with private data" } });
    const result = await actions.signUp({}, form());
    assert.match(result.error, expected);
    assert.ok(result.error.includes(`signup/${code}`));
    assert.equal(calls.some(([name]) => ["saveRecovery", "setPassword", "signIn"].includes(name)), false);
    const log = JSON.stringify(calls.filter(([name]) => name === "log"));
    for (const secret of ["new-password-123", "Quiet Jellyfish", "user@example.test", "private data"]) {
      assert.equal(log.includes(secret), false);
      assert.equal(result.error.includes(secret), false);
    }
  }
  assert.equal(signupErrorDetails({ code: "unsafe code with private data" }).code, "unknown_error");
  assert.equal(signupErrorDetails(null).code, "missing_user");
});

test("recovery hashes are salted and accept normalization but reject wrong answers", async () => {
  const first = await recovery.hashRecoveryAnswer("Quiet Jellyfish");
  const second = await recovery.hashRecoveryAnswer("Quiet Jellyfish");
  assert.notEqual(first, second);
  assert.equal(await recovery.verifyRecoveryAnswer("  QUIET   jellyfish ", first), true);
  assert.equal(await recovery.verifyRecoveryAnswer("wrong", first), false);
  assert.equal(await recovery.verifyRecoveryAnswer("anything", null), false);
  assert.equal(await recovery.verifyRecoveryAnswer("anything", "malformed"), false);
});
