import {
  formKinds,
  validateEnquiry,
  type EnquiryRequest,
  type EnquiryResponse,
} from "../../src/lib/enquiry-schema";
import { confirmation, notification, send } from "../../server/email";

type Env = {
  DB: D1Database;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM: string;
  EMAIL_NOTIFY: string;
};

const maxBodyBytes = 32 * 1024;

function reply(body: EnquiryResponse, status = 200) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

async function passedTurnstile(secret: string, token: string, ip: string) {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    },
  );
  const result = await response.json<{ success: boolean }>();
  return result.success;
}

function attributionJson(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const kept: Record<string, string> = {};
  for (const [key, value] of Object.entries(input).slice(0, 12))
    if (typeof value === "string" && value)
      kept[key.slice(0, 40)] = value.slice(0, 300);
  return Object.keys(kept).length ? JSON.stringify(kept) : null;
}

export const onRequestPost: PagesFunction<Env> = async ({
  request,
  env,
  waitUntil,
}) => {
  // Browsers send Origin on every POST; another site's page can't post here.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return reply({ ok: false, reason: "challenge" }, 403);

  const raw = await request.text();
  if (raw.length > maxBodyBytes)
    return reply({ ok: false, reason: "invalid", errors: {} }, 413);
  let body: EnquiryRequest;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ ok: false, reason: "invalid", errors: {} }, 400);
  }
  if (
    !body ||
    !formKinds.includes(body.kind) ||
    !body.values ||
    typeof body.values !== "object"
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
      !(await passedTurnstile(env.TURNSTILE_SECRET_KEY, body.token, ip))
    )
      return reply({ ok: false, reason: "challenge" }, 403);
  } catch (error) {
    console.error("Turnstile could not be reached:", error);
    return reply({ ok: false, reason: "unavailable" }, 503);
  }

  const creator = body.kind === "creator-pilot";
  const id = crypto.randomUUID();
  const report = body.kind === "report";
  const {
    [report ? "report-name" : "name"]: name,
    [report ? "report-email" : "email"]: email,
    consent,
    instagram,
    ...details
  } = values;
  try {
    await env.DB.prepare(
      `INSERT INTO enquiries
         (id, kind, name, email, details, consent_at, attribution, instagram)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
  } catch (error) {
    console.error("Could not store an enquiry:", error);
    return reply({ ok: false, reason: "unavailable" }, 503);
  }

  // The enquiry is stored, so the person sees success even if email fails.
  const mailer = { apiKey: env.RESEND_API_KEY, from: env.EMAIL_FROM };
  waitUntil(
    Promise.all([
      send(mailer, {
        to: env.EMAIL_NOTIFY,
        ...notification(body.kind, String(name), String(email), values, id),
      }),
      send(mailer, {
        to: String(email),
        ...confirmation(body.kind, String(name), values),
      }),
    ]),
  );

  return reply({ ok: true });
};
