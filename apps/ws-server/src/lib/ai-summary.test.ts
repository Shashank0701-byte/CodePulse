import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFallbackSummary, truncateSummary, generateSummary, SUMMARY_TTL_SECONDS } from "./ai-summary";

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

const PAYLOAD = { file: "src/index.ts", language: "typescript", project: "codepulse", branch: "main" };

function withEnv(vars: Record<string, string | undefined>, fn: () => Promise<void>) {
  const original: Record<string, string | undefined> = {};
  for (const key of Object.keys(vars)) {
    original[key] = process.env[key];
    if (vars[key] === undefined) delete process.env[key];
    else process.env[key] = vars[key];
  }
  return fn().finally(() => {
    for (const key of Object.keys(original)) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  });
}

test("SUMMARY_TTL_SECONDS is 4 hours", () => {
  assert.equal(SUMMARY_TTL_SECONDS, 4 * 60 * 60);
});

test("generateSummary returns the fallback without calling fetch when no API key is set", async () => {
  await withEnv({ OPENROUTER_API_KEY: undefined }, async () => {
    let called = false;
    const fetchImpl = (async () => {
      called = true;
      throw new Error("should not be called");
    }) as unknown as typeof fetch;

    const result = await generateSummary(PAYLOAD, { fetchImpl });

    assert.equal(result, "Building codepulse in typescript");
    assert.equal(called, false);
  });
});

test("generateSummary returns model output when the call succeeds", async () => {
  await withEnv({ OPENROUTER_API_KEY: "test-key" }, async () => {
    const fetchImpl = (async () =>
      new Response(
        JSON.stringify({ choices: [{ message: { content: "Refactoring the auth flow" } }] }),
        { status: 200 }
      )) as unknown as typeof fetch;

    const result = await generateSummary(PAYLOAD, { fetchImpl });

    assert.equal(result, "Refactoring the auth flow");
  });
});

test("generateSummary falls back when the response is not ok", async () => {
  await withEnv({ OPENROUTER_API_KEY: "test-key" }, async () => {
    const fetchImpl = (async () => new Response("server error", { status: 500 })) as unknown as typeof fetch;

    const result = await generateSummary(PAYLOAD, { fetchImpl });

    assert.equal(result, "Building codepulse in typescript");
  });
});

test("generateSummary falls back when the response body is malformed", async () => {
  await withEnv({ OPENROUTER_API_KEY: "test-key" }, async () => {
    const fetchImpl = (async () => new Response(JSON.stringify({ nope: true }), { status: 200 })) as unknown as typeof fetch;

    const result = await generateSummary(PAYLOAD, { fetchImpl });

    assert.equal(result, "Building codepulse in typescript");
  });
});

test("generateSummary falls back when fetch throws", async () => {
  await withEnv({ OPENROUTER_API_KEY: "test-key" }, async () => {
    const fetchImpl = (async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;

    const result = await generateSummary(PAYLOAD, { fetchImpl });

    assert.equal(result, "Building codepulse in typescript");
  });
});
