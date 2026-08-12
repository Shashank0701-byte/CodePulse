import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFallbackSummary, truncateSummary } from "./ai-summary";

test("buildFallbackSummary builds a template from project and language", () => {
  const result = buildFallbackSummary({ project: "codepulse", language: "typescript" });
  assert.equal(result, "Building codepulse in typescript");
});

test("truncateSummary leaves short strings unchanged", () => {
  assert.equal(truncateSummary("Building a Redis pipeline"), "Building a Redis pipeline");
});

test("truncateSummary cuts long strings at a word boundary under the limit", () => {
  const input = "Building an extremely long and detailed pipeline for processing real time developer telemetry events";
  const result = truncateSummary(input, 40);

  assert.ok(result.length <= 40, `expected length <= 40, got ${result.length}`);
  assert.ok(result.endsWith("…"), "expected an ellipsis at the end");
  assert.ok(!input.startsWith(result.slice(0, -1)) || input.slice(0, result.length - 1).endsWith(result.slice(0, -1).split(" ").pop()!), "should not cut mid-word");
});

test("truncateSummary trims surrounding whitespace", () => {
  assert.equal(truncateSummary("  Building codepulse  "), "Building codepulse");
});
