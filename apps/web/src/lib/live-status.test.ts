import { test } from "node:test";
import assert from "node:assert/strict";
import { getStatusHeadline } from "./live-status";

test("getStatusHeadline returns null when there is no presence", () => {
  assert.equal(getStatusHeadline(null), null);
});

test("getStatusHeadline returns the AI summary when present", () => {
  const result = getStatusHeadline({ project: "codepulse", summary: "Refactoring the auth flow" });
  assert.equal(result, "Refactoring the auth flow");
});

test("getStatusHeadline falls back to the project line when there is no summary yet", () => {
  const result = getStatusHeadline({ project: "codepulse" });
  assert.equal(result, 'Working on "codepulse"');
});

test("getStatusHeadline falls back when the summary is blank", () => {
  const result = getStatusHeadline({ project: "codepulse", summary: "   " });
  assert.equal(result, 'Working on "codepulse"');
});
