// Shared by the forms in the browser and the Pages Function that stores them,
// so both apply the same rules. Keep this file free of DOM and Node APIs.

export type FormKind = "creator-pilot" | "brand-pilot" | "contact" | "report";

export const formKinds: FormKind[] = [
  "creator-pilot",
  "brand-pilot",
  "contact",
  "report",
];

export const options = {
  category: [
    "Fitness",
    "Food",
    "Beauty",
    "Lifestyle",
    "Outdoors",
    "Parenting",
    "Something else",
  ],
  country: ["Canada", "United States", "Somewhere else"],
  type: ["Brand", "Agency"],
  production: ["My team", "Semblanse’s team (pilot only)", "Not sure yet"],
  spend: ["Under $10K", "$10K–$50K", "Over $50K", "Prefer not to say"],
  role: ["Creator", "Brand or agency", "Investor", "Press", "Something else"],
  report: [
    "An ad I didn’t approve",
    "Impersonation",
    "Use after a licence ended",
    "Something else",
  ],
} as const;

type Rule =
  | { type: "text"; max: number; required?: string }
  | { type: "email"; required: string }
  | { type: "url"; required?: string }
  | { type: "instagram"; required: string }
  | { type: "one"; of: readonly string[]; required: string }
  | { type: "many"; of: readonly string[] }
  | { type: "consent"; required: string }
  | { type: "flag" };

const name: Rule = { type: "text", max: 120, required: "Enter your name." };
const consent: Rule = {
  type: "consent",
  required: "Tick the box to continue.",
};

// A rule's `required` is the message shown when the field is left empty.
// Fields are checked, and errors focused, in the order they appear here.
const rules: Record<FormKind, Record<string, Rule>> = {
  "creator-pilot": {
    name,
    email: { type: "email", required: "Enter your email address." },
    instagram: {
      type: "instagram",
      required: "Enter your Instagram username.",
    },
    category: { type: "many", of: options.category },
    profile: { type: "url" },
    country: {
      type: "one",
      of: options.country,
      required: "Choose where you live.",
    },
    limits: { type: "text", max: 2000 },
    consent,
  },
  "brand-pilot": {
    name,
    email: { type: "email", required: "Enter your work email address." },
    company: {
      type: "text",
      max: 160,
      required: "Enter your brand or agency name.",
    },
    type: { type: "one", of: options.type, required: "Choose one." },
    production: {
      type: "one",
      of: options.production,
      required: "Choose one.",
    },
    sell: {
      type: "text",
      max: 300,
      required: "Tell us what you sell, or who your clients are.",
    },
    spend: { type: "one", of: options.spend, required: "Choose one." },
    test: { type: "text", max: 2000 },
    consent,
  },
  contact: {
    name,
    email: { type: "email", required: "Enter your email address." },
    role: {
      type: "one",
      of: options.role,
      required: "Choose the option closest to you.",
    },
    message: { type: "text", max: 5000, required: "Write your message." },
    consent,
  },
  // The report's field names carry a prefix because it shares its page.
  report: {
    "report-name": name,
    "report-email": { type: "email", required: "Enter your email address." },
    "report-kind": {
      type: "one",
      of: options.report,
      required: "Choose what you’re reporting.",
    },
    "report-link": {
      type: "text",
      max: 500,
      required: "Add a link to the ad, or say where you saw it.",
    },
    "report-detail": {
      type: "text",
      max: 5000,
      required: "Tell us what happened.",
    },
    "report-subject": { type: "flag" },
  },
};

export type EnquiryValues = Record<string, string | string[] | boolean>;
export type EnquiryErrors = Record<string, string>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const instagramPattern = /^(?!.*\.\.)(?!.*\.$)[a-z0-9._]{1,30}$/;

/** Reduces "@Name", or a profile link, to the bare lowercase username. */
export function instagramUsername(input: string): string {
  return input
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "")
    .toLowerCase();
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function check(
  rule: Rule,
  raw: unknown,
): { value?: string | string[] | boolean; error?: string } {
  if (rule.type === "flag") return { value: raw === true || raw === "on" };
  if (rule.type === "consent")
    return raw === true || raw === "on"
      ? { value: true }
      : { error: rule.required };
  if (rule.type === "many") {
    const picked = Array.isArray(raw) ? raw : [raw];
    return { value: rule.of.filter((option) => picked.includes(option)) };
  }
  const value = text(raw);
  if (!value) return rule.required ? { error: rule.required } : { value: "" };
  switch (rule.type) {
    case "text":
      return value.length > rule.max
        ? { error: `Keep this under ${rule.max} characters.` }
        : { value };
    case "email":
      return value.length <= 254 && emailPattern.test(value)
        ? { value: value.toLowerCase() }
        : { error: "Enter an email address like you@example.com." };
    case "url": {
      const link = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      let valid = link.length <= 300 && !/\s/.test(link);
      try {
        valid &&= new URL(link).hostname.includes(".");
      } catch {
        valid = false;
      }
      return valid
        ? { value: link }
        : { error: "Enter a link like tiktok.com/@yourname." };
    }
    case "instagram": {
      const username = instagramUsername(value);
      return instagramPattern.test(username)
        ? { value: username }
        : { error: "Enter a username like @yourname." };
    }
    case "one":
      return rule.of.includes(value) ? { value } : { error: rule.required };
  }
}

/**
 * Checks one form's answers. Returns the cleaned values to store, holding
 * only the fields that form defines, and a message for each field that needs
 * fixing.
 */
export function validateEnquiry(
  kind: FormKind,
  input: Record<string, unknown>,
): { values: EnquiryValues; errors: EnquiryErrors } {
  const values: EnquiryValues = {};
  const errors: EnquiryErrors = {};
  for (const [field, rule] of Object.entries(rules[kind])) {
    const result = check(rule, input[field]);
    if (result.error) errors[field] = result.error;
    else values[field] = result.value!;
  }
  return { values, errors };
}

/** The field names of a form, in display order. */
export function enquiryFields(kind: FormKind): string[] {
  return Object.keys(rules[kind]);
}

export type EnquiryRequest = {
  /** Reused after a network failure so retrying cannot create duplicate mail. */
  requestId?: string;
  kind: FormKind;
  values: Record<string, unknown>;
  /** Turnstile response token. */
  token: string;
  /** Honeypot. People never see or fill this field. */
  fax?: string;
  attribution?: Record<string, string>;
};

export type EnquiryResponse =
  | { ok: true }
  | { ok: false; reason: "invalid"; errors: EnquiryErrors }
  | { ok: false; reason: "challenge" | "unavailable" | "rate_limited" };

export const instagramAccount = "semblanse";
export const contactEmail = "hello@semblanse.com";

/**
 * The message a creator sends to @semblanse from their Instagram account to
 * prove it is theirs. The email ties the message to one application.
 */
export const instagramProof = (email: string) => `Application: ${email}`;
