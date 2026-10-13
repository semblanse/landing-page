import {
  contactEmail,
  instagramAccount,
  type EnquiryValues,
  type FormKind,
} from "../src/lib/enquiry-schema";

type Message = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export type Mailer = { apiKey?: string; from: string };

/** Sends through Resend. Resolves false, without throwing, on any failure. */
export async function send(mailer: Mailer, message: Message) {
  if (!mailer.apiKey) {
    console.warn("RESEND_API_KEY is not set; skipped email:", message.subject);
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${mailer.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: mailer.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
        reply_to: message.replyTo,
      }),
    });
    if (!response.ok)
      console.error("Resend refused an email:", response.status);
    return response.ok;
  } catch (error) {
    console.error("Resend could not be reached:", error);
    return false;
  }
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

const labels: Record<FormKind, string> = {
  "creator-pilot": "Creator application",
  "brand-pilot": "Brand pilot request",
  contact: "Contact message",
  report: "Misuse report",
};

/** The message the team receives for each submission. */
export function notification(
  kind: FormKind,
  name: string,
  email: string,
  values: EnquiryValues,
  id: string,
  code?: string,
): Omit<Message, "to"> {
  const lines = Object.entries(values)
    .filter(([field]) => field !== "consent")
    .map(
      ([field, value]) =>
        `${field}: ${Array.isArray(value) ? value.join(", ") : value || "—"}`,
    );
  if (code) lines.push(`verification code: ${code}`);
  lines.push("", `id: ${id}`);
  return {
    subject: `${labels[kind]}: ${name}`,
    text: lines.join("\n"),
    replyTo: email,
  };
}

const copy: Record<FormKind, { subject: string; body: string[] }> = {
  "creator-pilot": {
    subject: "You’re on the Semblanse waitlist",
    body: [
      "Thanks for applying. When a campaign fits what you make, we’ll email you the brand, fee, channels and term, and you decide.",
      "Applying grants no rights to your likeness.",
    ],
  },
  "brand-pilot": {
    subject: "We’ve got your pilot request",
    body: [
      "Thanks for telling us about your brand. We’ll reply with a few times for a short call.",
      "It helps to have your product, a recent ad that worked, and the AI tools your team uses.",
    ],
  },
  contact: {
    subject: "We’ve got your message",
    body: ["Thanks for writing. We’ll reply to this address."],
  },
  report: {
    subject: "We’ve got your report",
    body: [
      "Thanks for telling us. A person reads every report, and we’ll reply to this address with what we found and what was done.",
    ],
  },
};

/** The message the person who submitted the form receives. */
export function confirmation(
  kind: FormKind,
  name: string,
  values: EnquiryValues,
  code?: string,
): Omit<Message, "to"> {
  const { subject, body } = copy[kind];
  const first = name.split(/\s+/)[0];
  const paragraphs = [`Hi ${first},`, ...body];
  const dm = `https://ig.me/m/${instagramAccount}`;
  if (code)
    paragraphs.push(
      `One last step: confirm @${values.instagram} is yours. From that account, send this code to @${instagramAccount} on Instagram: ${code}`,
    );
  const text = [
    ...paragraphs,
    ...(code ? [dm] : []),
    `Questions? Reply to this email or write to ${contactEmail}.`,
    "Semblanse",
  ].join("\n\n");
  const html = `<!doctype html><html><body style="margin:0;background:#f5f2e9;color:#18231b;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:24px"><div style="max-width:520px;margin:0 auto;padding:40px 24px">${paragraphs
    .map((p) => `<p style="margin:0 0 16px">${escapeHtml(p)}</p>`)
    .join(
      "",
    )}${code ? `<p style="margin:24px 0"><a href="${dm}" style="display:inline-block;padding:12px 20px;background:#1f6f22;color:#ffffff;text-decoration:none;font-weight:600">Message @${instagramAccount}</a></p>` : ""}<p style="margin:32px 0 0;font-size:14px;line-height:20px;color:#647067">Questions? Reply to this email or write to ${contactEmail}.<br>Semblanse</p></div></body></html>`;
  return { subject, text, html, replyTo: contactEmail };
}
