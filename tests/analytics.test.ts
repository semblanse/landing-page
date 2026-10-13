import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { safeProperties, validateBatch } from "../src/lib/analytics-schema.ts";
import { posthogPayload, reserveAnalyticsBudget } from "../server/analytics.ts";
import { onRequestPost } from "../functions/api/analytics.ts";

const now = Date.parse("2026-10-13T12:00:00Z");
test("API reserves usage before provider capture and never follows redirects", async () => {
  const f = fixture();
  const original = globalThis.fetch;
  const input = batch();
  input.events[0].timestamp = new Date().toISOString();
  let calls = 0;
  const pending: Promise<unknown>[] = [];
  try {
    globalThis.fetch = async (url, init) => {
      calls++;
      assert.equal(String(url), "https://us.i.posthog.com/batch/");
      assert.equal(init?.redirect, "manual");
      assert.equal(
        f.sqlite
          .prepare("SELECT SUM(events) AS count FROM analytics_budget")
          .get()?.count,
        1,
      );
      const captured = JSON.parse(String(init?.body));
      assert.equal(captured.batch[0].properties.$ip, "0.0.0.0");
      assert.equal(captured.batch[0].properties.email, undefined);
      return new Response(null, { status: 307 });
    };
    const context = {
      request: new Request("https://semblanse.com/api/analytics", {
        method: "POST",
        headers: {
          origin: "https://semblanse.com",
          "content-type": "application/json",
        },
        body: JSON.stringify(input),
      }),
      env: {
        DB: f.db,
        POSTHOG_API_KEY: "public-test-key",
        TURNSTILE_SECRET_KEY: "local-test-salt",
        ANALYTICS_EVENT_LIMIT: "1",
      },
      waitUntil(promise: Promise<unknown>) {
        pending.push(promise);
      },
    };
    assert.equal((await onRequestPost(context as never)).status, 502);
    context.request = new Request(context.request.url, {
      method: "POST",
      headers: context.request.headers,
      body: JSON.stringify(input),
    });
    assert.equal((await onRequestPost(context as never)).status, 429);
    assert.equal(calls, 1);
    await Promise.all(pending);
  } finally {
    globalThis.fetch = original;
    f.sqlite.close();
  }
});
function batch() {
  return {
    consent: true,
    distinctId: randomUUID(),
    sessionId: randomUUID(),
    events: [
      {
        event: "form_submitted",
        uuid: randomUUID(),
        timestamp: new Date(now).toISOString(),
        properties: {
          form: "creator-pilot",
          path: "/creator-pilot/?email=secret@example.invalid",
        } as Record<string, unknown>,
      },
    ],
  };
}
function fixture() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(
    readFileSync(
      new URL("../migrations/0003_request_limits.sql", import.meta.url),
      "utf8",
    ),
  );
  sqlite.exec(
    readFileSync(
      new URL("../migrations/0005_analytics_budget.sql", import.meta.url),
      "utf8",
    ),
  );
  const db = {
    prepare(sql: string) {
      return {
        bind(...values: (string | number)[]) {
          return {
            async first() {
              return sqlite.prepare(sql).get(...values) ?? null;
            },
            async run() {
              return sqlite.prepare(sql).run(...values);
            },
          };
        },
      };
    },
  };
  return { sqlite, db };
}

test("analytics strips answers, personal URLs, unknown events and arbitrary properties", () => {
  assert.deepEqual(
    safeProperties({
      path: "/contact/?email=private@example.invalid",
      destination: "https://example.com/private",
      email: "private@example.invalid",
      message: "private",
      field: "email",
      fields: ["name", "private"],
      utm_source: "private@example.invalid",
      utm_campaign: "1234567890",
      section: "apply",
      browser: "Safari",
    }),
    {
      path: "/contact/",
      destination: "/other/",
      field: "email",
      fields: ["name"],
      section: "apply",
      browser: "Safari",
    },
  );
  const valid = batch();
  assert.ok(validateBatch(valid, now));
  assert.equal(validateBatch({ ...valid, consent: false }, now), null);
  assert.equal(
    validateBatch({ ...valid, distinctId: "private@example.invalid" }, now),
    null,
  );
  assert.equal(
    validateBatch({ ...valid, events: Array(11).fill(valid.events[0]) }, now),
    null,
  );
  assert.equal(
    validateBatch(
      { ...valid, events: [{ ...valid.events[0], event: "$autocapture" }] },
      now,
    ),
    null,
  );
  assert.equal(validateBatch(valid, now + 3600001), null);
});

test("server fixes anonymous properties and separates production from previews", () => {
  const raw = batch();
  raw.events[0].properties = {
    ...raw.events[0].properties,
    $ip: "203.0.113.1",
    $process_person_profile: true,
  };
  const result = posthogPayload(raw, "https://semblanse.com", now)!;
  assert.equal(result.environment, "production");
  assert.equal(result.batch[0].properties.$ip, "0.0.0.0");
  assert.equal(result.batch[0].properties.$process_person_profile, false);
  assert.equal(
    result.batch[0].properties.$current_url,
    "https://semblanse.com/creator-pilot/",
  );
  assert.equal(
    posthogPayload(raw, "https://semblanse.com.attacker.invalid", now)!
      .environment,
    "preview",
  );
});

test("concurrent budget reservations stop at the cap across calendar months", async () => {
  const f = fixture();
  try {
    const first = Date.parse("2026-10-31T23:59:59Z");
    const results = await Promise.all(
      Array.from({ length: 12 }, () =>
        reserveAnalyticsBudget(f.db, 10, 100, first),
      ),
    );
    assert.equal(results.filter(Boolean).length, 10);
    assert.equal(
      await reserveAnalyticsBudget(f.db, 1, 100, first + 2000),
      false,
    );
    assert.equal(
      await reserveAnalyticsBudget(f.db, 10, 100, first + 34 * 86400000),
      true,
    );
  } finally {
    f.sqlite.close();
  }
});

test("browser privacy signals and foreign origins never reach analytics storage or upstream", async () => {
  for (const [headers, expected] of [
    [{ origin: "https://elsewhere.invalid" }, 403],
    [{ origin: "https://semblanse.com", "sec-gpc": "1" }, 204],
    [{ origin: "https://semblanse.com", dnt: "1" }, 204],
  ] as const) {
    const result = await onRequestPost({
      request: new Request("https://semblanse.com/api/analytics", {
        method: "POST",
        headers,
      }),
      env: {},
      waitUntil() {},
    } as never);
    assert.equal(result.status, expected);
  }
});
