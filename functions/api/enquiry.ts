import {
  formKinds,
  validateEnquiry,
  type EnquiryRequest,
  type EnquiryResponse,
} from "../../src/lib/enquiry-schema";
import { confirmation, notification, send } from "../../server/email";
import {
  fingerprint,
  readJson,
  reserveRateSlot,
  verifyChallenge,
} from "../../server/request-security";

type Env = {
  DB: D1Database;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM: string;
  EMAIL_NOTIFY: string;
};

function reply(body: EnquiryResponse, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      ...(status === 429 ? { "retry-after": "600" } : {}),
    },
  });
}

function attributionJson(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const kept: Record<string, string> = {};
  for (const [key, value] of Object.entries(input).slice(0, 12))
    if (typeof value === "string" && value)
      kept[key.slice(0, 40)] = value.slice(0, 300);
  return Object.keys(kept).length ? JSON.stringify(kept) : null;
}

async function unsubscribed(db: D1Database, email: string) {
  try {
    const row = await db
      .prepare(
        "SELECT 1 FROM enquiries WHERE email = ? AND unsubscribed_at IS NOT NULL LIMIT 1",
      )
      .bind(email)
      .first();
    return row !== null;
  } catch (error) {
    console.error("Could not check for an unsubscribe:", error);
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({
  request,
  env,
  waitUntil,
}) => {
  // Browsers send Origin on every POST; another site's page can't post here.
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin)
    return reply({ ok: false, reason: "challenge" }, 403);

  let body: EnquiryRequest;
  try {
    body = (await readJson(request)) as EnquiryRequest;
  } catch (error) {
    return reply(
      { ok: false, reason: "invalid", errors: {} },
      error instanceof Response ? error.status : 400,
    );
  }
  if (
    !body ||
    !formKinds.includes(body.kind) ||
    !body.values ||
    typeof body.values !== "object" ||
    Array.isArray(body.values) ||
    (body.requestId !== undefined &&
      (typeof body.requestId !== "string" ||
        !/^[a-f0-9-]{36}$/i.test(body.requestId)))
  )
    return reply({ ok: false, reason: "invalid", errors: {} }, 400);

  // Report success to anything that fills the hidden field, and keep nothing.
  if (body.fax) return reply({ ok: true });

  const { values, errors } = validateEnquiry(body.kind, body.values);
  if (Object.keys(errors).length)
    return reply({ ok: false, reason: "invalid", errors }, 422);

  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("TURNSTILE_SECRET_KEY is not set; refusing submissions.");
    return reply({ ok: false, reason: "unavailable" }, 503);
  }
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  try {
    if (
      typeof body.token !== "string" ||
      !(await verifyChallenge(
        env.TURNSTILE_SECRET_KEY,
        body.token,
        ip,
        new URL(request.url).hostname,
      ))
    )
      return reply({ ok: false, reason: "challenge" }, 403);
  } catch (error) {
    console.error("Turnstile could not be reached:", error);
    return reply({ ok: false, reason: "unavailable" }, 503);
  }

  const creator = body.kind === "creator-pilot";
  const id = await fingerprint(
    env.TURNSTILE_SECRET_KEY,
    JSON.stringify([body.kind, values, body.requestId ?? crypto.randomUUID()]),
  );
  const report = body.kind === "report";
  const {
    [report ? "report-name" : "name"]: name,
    [report ? "report-email" : "email"]: email,
    consent,
    instagram,
    ...details
  } = values;
  try {
    if (
      await env.DB.prepare("SELECT id FROM enquiries WHERE id = ?")
        .bind(id)
        .first()
    )
      return reply({ ok: true });
    if (
      !(await reserveRateSlot(
        env.DB,
        env.TURNSTILE_SECRET_KEY,
        "ip",
        ip || "unknown",
        600,
        12,
      )) ||
      !(await reserveRateSlot(
        env.DB,
        env.TURNSTILE_SECRET_KEY,
        "recipient",
        String(email),
        3600,
        6,
      ))
    )
      return reply({ ok: false, reason: "rate_limited" }, 429);
    const inserted = await env.DB.prepare(
      `INSERT INTO enquiries
         (id, kind, name, email, details, consent_at, attribution, instagram)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
    )
      .bind(
        id,
        body.kind,
        name,
        email,
        JSON.stringify(details),
        consent ? new Date().toISOString() : null,
        attributionJson(body.attribution),
        creator ? instagram : null,
      )
      .run();
    if (!inserted.meta.changes) return reply({ ok: true });
    waitUntil(
      env.DB.prepare("DELETE FROM request_limits WHERE expires_at < ?")
        .bind(Math.floor(Date.now() / 1000))
        .run()
        .then(() => undefined),
    );
  } catch (error) {
    console.error("Could not store an enquiry:", error);
    return reply({ ok: false, reason: "unavailable" }, 503);
  }

  // The enquiry is stored, so the person sees success even if email fails.
  const mailer = { apiKey: env.RESEND_API_KEY, from: env.EMAIL_FROM };
  const site = new URL(request.url).origin;
  waitUntil(
    Promise.all([
      send(mailer, {
        to: env.EMAIL_NOTIFY,
        ...notification(body.kind, String(name), String(email), values, id),
      }),
      // An address that unsubscribed gets no confirmation. Its enquiry is
      // still stored and the team is still told.
      unsubscribed(env.DB, String(email)).then(
        (stopped) =>
          stopped ||
          send(mailer, {
            to: String(email),
            ...confirmation(body.kind, String(name), values, site, id),
          }),
      ),
    ]),
  );

  return reply({ ok: true });
};
