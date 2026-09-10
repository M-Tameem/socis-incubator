import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/admin/moderation/actions.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const id = "12345678-1234-4234-8234-123456789012";

function fixture({ authorized = true, result = { data: { id }, error: null } } = {}) {
  const calls = [];
  const chain = {
    delete() { calls.push(["delete"]); return this; },
    eq(...args) { calls.push(["eq", ...args]); return this; },
    select(...args) { calls.push(["select", ...args]); return this; },
    async maybeSingle() { return result; },
  };
  const imports = {
    "@/lib/auth": { async requireExec() {
      calls.push(["authorize"]);
      if (!authorized) throw new Error("Access denied");
    } },
    "@/lib/supabase/server": { async createClient() {
      calls.push(["client"]);
      return { from(table) { calls.push(["from", table]); return chain; } };
    } },
    "next/cache": { revalidatePath(...args) { calls.push(["revalidate", ...args]); } },
  };
  const context = { exports: {}, require(name) {
    assert.ok(imports[name], `Unexpected import: ${name}`);
    return imports[name];
  } };
  vm.runInNewContext(compiled, context);
  return { calls, action: context.exports.deleteModerationItem };
}

function form(kind = "post", itemId = id) {
  const data = new FormData();
  data.set("kind", kind);
  data.set("id", itemId);
  return data;
}

test("moderation rejects non-executives before creating a database client", async () => {
  const { calls, action } = fixture({ authorized: false });
  await assert.rejects(action({}, form()), /Access denied/);
  assert.deepEqual(calls, [["authorize"]]);
});

test("moderation rejects arbitrary tables and invalid IDs without a database call", async () => {
  for (const data of [form("profiles"), form("post", "not-an-id")]) {
    const { calls, action } = fixture();
    assert.match((await action({}, data)).error, /valid/);
    assert.deepEqual(calls, [["authorize"]]);
  }
});

test("moderation deletes only the selected post or message and refreshes affected pages", async () => {
  for (const [kind, table] of [["post", "idea_posts"], ["message", "idea_interests"]]) {
    const { calls, action } = fixture();
    assert.equal((await action({}, form(kind))).deleted, true);
    assert.deepEqual(calls.slice(0, 5), [
      ["authorize"], ["client"], ["from", table], ["delete"], ["eq", "id", id],
    ]);
    assert.deepEqual(calls.filter(([name]) => name === "revalidate"), [
      ["revalidate", "/admin/moderation"], ["revalidate", "/ideas"], ["revalidate", "/ideas/[id]", "page"],
    ]);
  }
});

test("failed or unauthorized row deletion never reports success", async () => {
  for (const result of [{ data: null, error: { message: "denied" } }, { data: null, error: null }]) {
    const { calls, action } = fixture({ result });
    const state = await action({}, form());
    assert.ok(state.error);
    assert.equal(state.deleted, undefined);
    assert.equal(calls.some(([name]) => name === "revalidate"), false);
  }
});
