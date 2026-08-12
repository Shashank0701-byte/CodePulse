import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeSummaryIntoPresence } from "../lib/presence-merge";

test("mergeSummaryIntoPresence returns the payload unchanged when there is no summary", () => {
  const payload = { project: "codepulse", file: "index.ts" };
  assert.deepEqual(mergeSummaryIntoPresence(payload, null), payload);
});

test("mergeSummaryIntoPresence adds the summary field when present", () => {
  const payload = { project: "codepulse", file: "index.ts" };
  const result = mergeSummaryIntoPresence(payload, "Building codepulse in typescript");

  assert.deepEqual(result, {
    project: "codepulse",
    file: "index.ts",
    summary: "Building codepulse in typescript",
  });
});
