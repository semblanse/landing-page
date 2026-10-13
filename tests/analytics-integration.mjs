import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

// Synthetic analytics only, on loopback. Never creates an enquiry or sends email.
const origin = "http://127.0.0.1:8794";
const send = (body, extra = {}) =>
  fetch(`${origin}/api/analytics`, {
    method: "POST",
    headers: { origin, "content-type": "application/json", ...extra },
    body: JSON.stringify(body),
  });
assert.equal(
  (await send({}, { origin: "https://elsewhere.invalid" })).status,
  403,
);
assert.equal((await send({})).status, 400);
assert.equal((await send({}, { dnt: "1" })).status, 204);
assert.equal((await send({}, { "sec-gpc": "1" })).status, 204);
for (const form of ["creator-pilot", "brand-pilot", "contact", "report"]) {
  const sessionId = randomUUID();
  const distinctId = randomUUID();
  const names = [
    "$pageview",
    "cta_clicked",
    "form_viewed",
    "form_started",
    "form_field_completed",
    "form_submit_attempted",
    "form_error",
    "form_failed",
    "form_submitted",
    "verify_message_opened",
  ];
  const events = names.map((event, i) => ({
    event,
    uuid: randomUUID(),
    timestamp: new Date(Date.now() - (names.length - i) * 1000).toISOString(),
    properties: {
      form,
      path: `/${form === "report" ? "trust" : form}/`,
      landing_path: "/",
      destination: `/${form}/`,
      field: "email",
      fields: ["email"],
      reason: "challenge",
      section: "qa",
      channel: "Direct",
      device: "desktop",
      browser: "Chrome",
      os: "Windows",
      utm_campaign: "readiness-qa",
    },
  }));
  assert.equal(
    (await send({ consent: true, distinctId, sessionId, events })).status,
    204,
  );
}
console.log(
  "Analytics API: invalid origin/body and privacy signals checked; 40 synthetic preview events accepted by PostHog. No enquiries or emails created.",
);
