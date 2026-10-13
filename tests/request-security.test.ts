import assert from "node:assert/strict";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import {
  fingerprint,
  readJson,
  verifyChallenge,
  reserveRateSlot,
} from "../server/request-security.ts";

test("rate buckets enforce the limit atomically and expire into a fresh window", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(readFileSync(new URL("../migrations/0002_request_limits.sql", import.meta.url), "utf8"));
  const db = { prepare: (sql: string) => ({ bind: (...values: unknown[]) => ({ first: async <T>() => (sqlite.prepare(sql).get(...values as (string | number)[]) ?? null) as T | null }) }) };
  try {
    const checks = await Promise.all(Array.from({ length: 20 }, () => reserveRateSlot(db, "secret", "ip", "192.0.2.1", 60, 5, 120000)));
    assert.equal(checks.filter(Boolean).length, 5);
    assert.equal(await reserveRateSlot(db, "secret", "ip", "192.0.2.1", 60, 5, 180000), true);
    assert.equal(await reserveRateSlot(db, "secret", "ip", "192.0.2.2", 60, 5, 120000), true);
    const rows = sqlite.prepare("SELECT key FROM request_limits").all();
    assert.equal(rows.length, 3);
    assert.equal(JSON.stringify(rows).includes("192.0.2"), false);
  } finally { sqlite.close(); }
});

const request = (body: string, contentType = "application/json") =>
  new Request("https://example.com/api/enquiry", {
    method: "POST",
    headers: { "content-type": contentType },
    body,
  });

test("body limit counts UTF-8 bytes, not string length", async () => {
  await assert.rejects(
    readJson(request(JSON.stringify({ text: "é".repeat(17000) }))),
    (e: unknown) => e instanceof Response && e.status === 413,
  );
  assert.deepEqual(await readJson(request('{"ok":true}')), { ok: true });
});

test("body reader cancels an oversized chunked upload before draining it", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(33000));
    },
    cancel() {
      cancelled = true;
    },
  });
  const req = new Request("https://example.com", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: stream,
    duplex: "half",
  } as RequestInit);
  await assert.rejects(
    readJson(req),
    (e: unknown) => e instanceof Response && e.status === 413,
  );
  assert.equal(cancelled, true);
});

test("only valid JSON and the JSON content type pass", async () => {
  await assert.rejects(
    readJson(request("{")),
    (e: unknown) => e instanceof Response && e.status === 400,
  );
  await assert.rejects(
    readJson(request("{}", "text/plain")),
    (e: unknown) => e instanceof Response && e.status === 415,
  );
});

test("fingerprints bind identifiers to the secret without exposing them", async () => {
  const a = await fingerprint("test-secret", "person@example.com");
  assert.equal(a.length, 64);
  assert.equal(a, await fingerprint("test-secret", "person@example.com"));
  assert.notEqual(a, await fingerprint("other-secret", "person@example.com"));
});

test("challenge binds hostname/action and rejects production test secrets", async () => {
  const original = globalThis.fetch;
  let result = { success: true, hostname: "example.com", action: "enquiry" };
  globalThis.fetch = async () => Response.json(result);
  try {
    assert.equal(
      await verifyChallenge("real-secret", "token", "", "example.com"),
      true,
    );
    result = { ...result, hostname: "another.example.com" };
    assert.equal(
      await verifyChallenge("real-secret", "token", "", "example.com"),
      false,
    );
    result = { ...result, hostname: "example.com", action: "different" };
    assert.equal(
      await verifyChallenge("real-secret", "token", "", "example.com"),
      false,
    );
    assert.equal(
      await verifyChallenge("1x000000test", "token", "", "example.com"),
      false,
    );
    assert.equal(
      await verifyChallenge("1x000000test", "token", "", "localhost"),
      true,
    );
    assert.equal(
      await verifyChallenge("real-secret", "x".repeat(2049), "", "example.com"),
      false,
    );
  } finally {
    globalThis.fetch = original;
  }
});
