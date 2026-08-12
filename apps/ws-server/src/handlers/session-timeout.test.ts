import { test } from "node:test";
import assert from "node:assert/strict";
import { isSessionStale } from "./session-timeout";

test("session is not stale when last heartbeat is within the timeout window", () => {
  const lastHeartbeat = new Date("2026-01-01T00:00:00.000Z");
  const now = new Date("2026-01-01T00:01:00.000Z"); // 1 minute later
  assert.equal(isSessionStale(lastHeartbeat, now, 2 * 60 * 1000), false);
});

test("session is stale once the gap since the last heartbeat reaches the timeout", () => {
  const lastHeartbeat = new Date("2026-01-01T00:00:00.000Z");
  const now = new Date("2026-01-01T00:02:00.000Z"); // exactly 2 minutes later
  assert.equal(isSessionStale(lastHeartbeat, now, 2 * 60 * 1000), true);
});
