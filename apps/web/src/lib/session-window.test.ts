import { test } from "node:test";
import assert from "node:assert/strict";
import { getEffectiveSessionEnd } from "./session-window";

const TIMEOUT_MS = 2 * 60 * 1000;

test("returns the recorded endTime when the session was explicitly closed", () => {
  const endTime = new Date("2026-01-01T00:05:00.000Z");
  const session = { endTime, lastHeartbeat: new Date("2026-01-01T00:04:00.000Z") };
  const now = new Date("2026-01-01T01:00:00.000Z");

  assert.equal(getEffectiveSessionEnd(session, now, TIMEOUT_MS).getTime(), endTime.getTime());
});

test("returns now for an open session that is still within the timeout window", () => {
  const lastHeartbeat = new Date("2026-01-01T00:00:30.000Z");
  const session = { endTime: null, lastHeartbeat };
  const now = new Date("2026-01-01T00:01:00.000Z"); // 30s after last heartbeat

  assert.equal(getEffectiveSessionEnd(session, now, TIMEOUT_MS).getTime(), now.getTime());
});

test("caps an open but idle session at lastHeartbeat + timeout instead of now", () => {
  const lastHeartbeat = new Date("2026-01-01T00:00:00.000Z");
  const session = { endTime: null, lastHeartbeat };
  const now = new Date("2026-01-01T05:00:00.000Z"); // abandoned hours ago, never closed

  const expected = new Date(lastHeartbeat.getTime() + TIMEOUT_MS);
  assert.equal(getEffectiveSessionEnd(session, now, TIMEOUT_MS).getTime(), expected.getTime());
});
