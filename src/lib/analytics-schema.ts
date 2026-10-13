/** Explicit events only. Never accept arbitrary PostHog events or form answers. */
export const eventNames = [
  "$pageview",
  "$pageleave",
  "section_viewed",
  "scroll_depth",
  "cta_clicked",
  "form_viewed",
  "form_started",
  "form_field_completed",
  "form_submit_attempted",
  "form_error",
  "form_failed",
  "form_submitted",
  "verify_message_copied",
  "verify_message_opened",
  "faq_audience_changed",
  "faq_question_toggled",
  "faq_list_toggled",
  "demo_played",
  "demo_progress",
  "demo_fullscreen_opened",
  "contact_channel_clicked",
] as const;
export type SiteEvent = (typeof eventNames)[number];
export const trackedPaths = [
  "/",
  "/creator-pilot/",
  "/brand-pilot/",
  "/brands/",
  "/pilot/",
  "/about/",
  "/careers/",
  "/contact/",
  "/trust/",
  "/privacy/",
  "/terms/",
  "/investors/",
  "/tracking/",
  "/accessibility/",
];
export function safePath(path: unknown) {
  if (typeof path !== "string") return "/other/";
  const clean = path.split(/[?#]/)[0];
  const normalized = clean === "/" || clean.endsWith("/") ? clean : `${clean}/`;
  return trackedPaths.includes(normalized) ? normalized : "/other/";
}
export const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type AnalyticsEvent = {
  event: SiteEvent;
  properties: Record<string, string | number | boolean | string[]>;
  timestamp: string;
  uuid: string;
};
export type AnalyticsBatch = {
  consent: true;
  distinctId: string;
  sessionId: string;
  events: AnalyticsEvent[];
};
const forms = ["creator-pilot", "brand-pilot", "contact", "report"];
const fields = [
  "instagram",
  "name",
  "email",
  "category",
  "profile",
  "country",
  "limits",
  "consent",
  "company",
  "type",
  "production",
  "sell",
  "spend",
  "test",
  "role",
  "message",
  "report-name",
  "report-email",
  "report-kind",
  "report-link",
  "report-detail",
  "report-subject",
];
const identifiers = /^[a-z][a-z0-9_-]{0,63}$/i;
export function safeProperties(raw: unknown): AnalyticsEvent["properties"] {
  const kept: AnalyticsEvent["properties"] = {};
  if (!raw || typeof raw !== "object") return kept;
  const input = raw as Record<string, unknown>;
  if (input.path !== undefined) kept.path = safePath(input.path);
  if (input.landing_path !== undefined)
    kept.landing_path = safePath(input.landing_path);
  if (input.destination !== undefined)
    kept.destination = safePath(input.destination);
  if (forms.includes(String(input.form))) kept.form = String(input.form);
  if (fields.includes(String(input.field))) kept.field = String(input.field);
  if (Array.isArray(input.fields))
    kept.fields = input.fields
      .filter((v): v is string => typeof v === "string" && fields.includes(v))
      .slice(0, 25);
  for (const key of [
    "section",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ])
    if (
      typeof input[key] === "string" &&
      identifiers.test(input[key]) &&
      !/\d{7}/.test(input[key])
    )
      kept[key] = input[key];
  const enums: Record<string, string[]> = {
    audience: ["creators", "brands"],
    state: ["opened", "closed"],
    reason: ["challenge", "unavailable", "rate_limited"],
    device: ["mobile", "tablet", "desktop"],
    browser: ["Chrome", "Edge", "Firefox", "Safari", "Other"],
    os: ["Windows", "macOS", "iOS", "Android", "Linux", "Other"],
    channel: [
      "Direct",
      "Google",
      "Bing",
      "Instagram",
      "Facebook",
      "LinkedIn",
      "Other referral",
    ],
    destination_type: ["email", "instagram"],
  };
  for (const [key, allowed] of Object.entries(enums))
    if (typeof input[key] === "string" && allowed.includes(input[key]))
      kept[key] = input[key];
  if ([25, 50, 75, 100].includes(Number(input.milestone)))
    kept.milestone = Number(input.milestone);
  if (
    typeof input.question === "number" &&
    Number.isInteger(input.question) &&
    input.question >= 0 &&
    input.question <= 20
  )
    kept.question = input.question;
  if (typeof input.seconds === "number" && Number.isFinite(input.seconds))
    kept.seconds = Math.max(0, Math.min(1800, Math.round(input.seconds)));
  if (typeof input.muted === "boolean") kept.muted = input.muted;
  return kept;
}

export function validateBatch(
  raw: unknown,
  now = Date.now(),
): AnalyticsBatch | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  if (
    b.consent !== true ||
    typeof b.distinctId !== "string" ||
    !uuidPattern.test(b.distinctId) ||
    typeof b.sessionId !== "string" ||
    !uuidPattern.test(b.sessionId) ||
    !Array.isArray(b.events) ||
    !b.events.length ||
    b.events.length > 10
  )
    return null;
  const events: AnalyticsEvent[] = [];
  for (const item of b.events) {
    if (
      !item ||
      typeof item !== "object" ||
      !eventNames.includes(item.event) ||
      typeof item.uuid !== "string" ||
      !uuidPattern.test(item.uuid)
    )
      return null;
    const time = Date.parse(item.timestamp);
    if (!Number.isFinite(time) || Math.abs(now - time) > 60 * 60 * 1000)
      return null;
    events.push({
      event: item.event,
      uuid: item.uuid,
      timestamp: new Date(time).toISOString(),
      properties: safeProperties(item.properties),
    });
  }
  return {
    consent: true,
    distinctId: b.distinctId,
    sessionId: b.sessionId,
    events,
  };
}
