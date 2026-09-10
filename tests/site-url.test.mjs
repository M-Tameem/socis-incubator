import assert from "node:assert/strict";
import { after, test } from "node:test";
import { getSiteUrl } from "../src/lib/site-url.ts";
import { safeRedirectPath } from "../src/lib/navigation.ts";

const originalNodeEnv = process.env.NODE_ENV;
const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
after(() => {
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;
  if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
});

test("production email links stay on the live site with missing or local configuration", () => {
  process.env.NODE_ENV = "production";
  for (const value of [undefined, "", " ", "http://localhost:3000", "https://localhost:3000",
    "https://localhost.", "https://preview.localhost", "https://127.0.0.1", "https://[::1]",
    "https://0.0.0.0", "not-a-url", "http://socis.ca", "javascript:alert(1)",
    "https://user:password@socis.ca"]) {
    if (value === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = value;
    assert.equal(getSiteUrl(), "https://socis-incubator.vercel.app", String(value));
  }
});

test("configured HTTPS origins support a future custom domain and normalize trailing paths", () => {
  process.env.NODE_ENV = "production";
  process.env.NEXT_PUBLIC_SITE_URL = " https://incubator.socis.ca/path?old=1#fragment ";
  assert.equal(getSiteUrl(), "https://incubator.socis.ca");
});

test("local development keeps local sign-in links", () => {
  process.env.NODE_ENV = "development";
  delete process.env.NEXT_PUBLIC_SITE_URL;
  assert.equal(getSiteUrl(), "http://localhost:3000");
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3100/";
  assert.equal(getSiteUrl(), "http://localhost:3100");
});

test("post-login paths retain admin destinations and reject external redirects", () => {
  assert.equal(safeRedirectPath("/admin/applications?status=submitted"), "/admin/applications?status=submitted");
  for (const value of [null, "https://attacker.example", "//attacker.example", "/\\attacker.example"]) {
    assert.equal(safeRedirectPath(value), "/dashboard");
  }
});
