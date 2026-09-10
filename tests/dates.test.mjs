import assert from "node:assert/strict";
import { test } from "node:test";
import { formatDate } from "../src/lib/utils.ts";
import { getApplicationStatus } from "../src/lib/application-window.ts";

test("date-only deadlines retain their calendar date across daylight saving changes", () => {
  assert.equal(formatDate("2026-09-14"), "September 14, 2026");
  assert.equal(formatDate("2026-09-27"), "September 27, 2026");
  assert.equal(formatDate("2026-12-07"), "December 7, 2026");
});

test("timestamps still display the date in Toronto", () => {
  assert.equal(formatDate("2026-09-14T02:00:00Z"), "September 13, 2026");
});

test("applications open at Toronto midnight and include the entire closing day", () => {
  const settings = { applications_open: "2026-09-14", applications_close: "2026-09-20" };
  assert.equal(getApplicationStatus(settings, new Date("2026-09-14T03:59:59Z")), "upcoming");
  assert.equal(getApplicationStatus(settings, new Date("2026-09-14T04:00:00Z")), "open");
  assert.equal(getApplicationStatus(settings, new Date("2026-09-21T03:59:59Z")), "open");
  assert.equal(getApplicationStatus(settings, new Date("2026-09-21T04:00:00Z")), "closed");
});

test("application windows support unset boundaries and winter time", () => {
  assert.equal(getApplicationStatus({}, new Date("2026-09-14T00:00:00Z")), "open");
  assert.equal(getApplicationStatus({ applications_close: "TBD" }), "closed");
  const settings = { applications_close: "2026-12-07" };
  assert.equal(getApplicationStatus(settings, new Date("2026-12-08T04:59:59Z")), "open");
  assert.equal(getApplicationStatus(settings, new Date("2026-12-08T05:00:00Z")), "closed");
});
