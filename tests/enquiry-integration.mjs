import assert from "node:assert/strict";
import { randomUUID, randomInt } from "node:crypto";
const origin = "http://127.0.0.1:8794";
const run = randomUUID();
const ip = `198.51.100.${randomInt(1, 254)}`;
const body = {
  kind: "contact",
  requestId: randomUUID(),
  token: "XXXX.DUMMY.TOKEN.XXXX",
  values: {
    name: "Local QA",
    email: `local-qa-${run}@example.invalid`,
    role: "Something else",
    message: "Local integration test only.",
    consent: true,
  },
};
async function post(input, headers = {}) {
  const r = await fetch(origin + "/api/enquiry", {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      "cf-connecting-ip": ip,
      ...headers,
    },
    body: typeof input === "string" ? input : JSON.stringify(input),
  });
  return {
    status: r.status,
    headers: Object.fromEntries(r.headers),
    body: await r.json(),
  };
}
const checks = [];
const invalid = await post({});
assert.equal(invalid.status, 400);
checks.push("invalid input: 400");
const foreign = await post({}, { origin: "https://example.com" });
assert.equal(foreign.status, 403);
checks.push("foreign Origin: 403");
const plain = await post("{}", { "content-type": "text/plain" });
assert.equal(plain.status, 415);
checks.push("wrong content type: 415");
const oversized = await post(JSON.stringify({ x: "é".repeat(17000) }));
assert.equal(oversized.status, 413);
checks.push("UTF-8 byte limit: 413");
const missing = await post({ ...body, values: {} });
assert.equal(missing.status, 422);
checks.push("missing fields: 422");
const first = await post(body);
assert.equal(first.status, 200, JSON.stringify(first));
assert.equal(first.body.ok, true);
checks.push("valid local submission stored: 200");
const retry = await post(body);
assert.equal(retry.status, 200);
checks.push("same submission ID retry: 200");
assert.equal(first.headers["x-content-type-options"], "nosniff");
assert.equal(first.headers["x-frame-options"], "DENY");
checks.push("Function response security headers present");
const statuses = [];
for (let i = 0; i < 13; i++) {
  const r = await post({
    ...body,
    requestId: randomUUID(),
    values: { ...body.values, email: `local-qa-${run}-${i}@example.invalid` },
  });
  statuses.push(r.status);
}
assert.ok(statuses.includes(429), JSON.stringify(statuses));
checks.push("repeated valid submissions rate limited: 429");
console.log(JSON.stringify({ checks, statuses }, null, 2));
