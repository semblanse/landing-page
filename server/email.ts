import {
  contactEmail,
  instagramAccount,
  instagramProof,
  type EnquiryValues,
  type FormKind,
} from "../src/lib/enquiry-schema";

export type Message = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

export type Mailer = { apiKey?: string; from: string };

/** Sends through Resend. Resolves false, without throwing, on any failure. */
export async function send(
  mailer: Mailer,
  message: Message,
  idempotencyKey?: string,
) {
  if (!mailer.apiKey) {
    console.warn("RESEND_API_KEY is not set; email remains queued.");
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: {
        authorization: `Bearer ${mailer.apiKey}`,
        "content-type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: mailer.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
        reply_to: message.replyTo,
        headers: message.headers,
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
): Omit<Message, "to"> {
  const lines = Object.entries(values)
    .filter(([field]) => field !== "consent")
    .map(
      ([field, value]) =>
        `${field}: ${Array.isArray(value) ? value.join(", ") : value || "—"}`,
    );
  if (kind === "creator-pilot")
    lines.push(`expected Instagram message: ${instagramProof(email)}`);
  lines.push("", `id: ${id}`);
  return {
    subject: `${labels[kind]}: ${name}`,
    text: lines.join("\n"),
    replyTo: email,
  };
}

// The confirmation emails follow the "Emails · Form confirmations" section
// (663:2133) in Figma. Mail apps need table layout and inline styles.

const ink = "#18231b";
const cream = "#f5f2e9";
const green = "#1f6f22";
const lilac = "#d9cdea";
// Apple Mail loads the site's fonts; other mail apps use the fallbacks.
const serif = "'GFS Didot',Didot,'Bodoni 72',Georgia,'Times New Roman',serif";
const sans = "'Albert Sans','Helvetica Neue',Helvetica,Arial,sans-serif";

type Link = [label: string, path: string];

const copy: Record<
  FormKind,
  {
    subject: string;
    /** Headline panel colours, matching the form's page on the site. */
    panel: string;
    onPanel: string;
    title: string[];
    body: string[];
    links?: Link[];
    /** Why the person is getting this email, for the footer. */
    reason: string;
  }
> = {
  "creator-pilot": {
    subject: "You’re on the Semblanse waitlist",
    panel: ink,
    onPanel: cream,
    title: ["You’re on", "the waitlist."],
    body: [
      "Thanks for applying. When a campaign fits what you make, we’ll email you which brand it is, what you’d be paid, where the ads would run and for how long, and you decide.",
      "Joining doesn’t give us or any brand the right to use your face or voice.",
    ],
    reason: "you applied to the creator waitlist",
  },
  "brand-pilot": {
    subject: "We’ve got your pilot request",
    panel: green,
    onPanel: cream,
    title: ["We’ll send", "you some times."],
    body: [
      "Thanks for telling us about your brand. We’ll reply with a few times for a short call.",
      "It helps to have your product, the ad you’d like to beat and, if your team will make the ads, the AI tools it uses.",
    ],
    links: [["See the pilot overview", "/pilot/"]],
    reason: "you asked about a brand pilot",
  },
  contact: {
    subject: "We’ve got your message",
    panel: lilac,
    onPanel: ink,
    title: ["Thanks for", "writing."],
    body: [
      "We’ll reply to this address. In the meantime, the FAQ and the pilot overview answer most questions.",
    ],
    links: [
      ["Read the FAQ", "/#questions"],
      ["See the pilot overview", "/pilot/"],
    ],
    reason: "you sent us a message",
  },
  report: {
    subject: "We’ve got your report",
    panel: green,
    onPanel: cream,
    title: ["Report noted."],
    body: [
      "Thanks for telling us. A person reads every report, and we’ll reply to this address with what we found and what was done.",
    ],
    reason: "you sent us a report",
  },
};

const paragraph = (text: string) =>
  `<p style="margin:0 0 18px">${escapeHtml(text)}</p>`;

/**
 * The message the person who submitted the form receives. `site` is the
 * origin the form was sent from, so links and images match that deployment.
 */
export function confirmation(
  kind: FormKind,
  name: string,
  values: EnquiryValues,
  site: string,
  id: string,
): Omit<Message, "to"> {
  const {
    subject,
    panel,
    onPanel,
    title,
    body,
    links = [],
    reason,
  } = copy[kind];
  const host = new URL(site).host;
  const greeting = `Hi ${name.split(/\s+/)[0]},`;
  const why = `You’re receiving this because ${reason} at ${host}.`;
  const unsubscribe = `${site}/unsubscribe/?id=${id}`;
  const dm = `https://ig.me/m/${instagramAccount}`;
  const proof =
    kind === "creator-pilot" && instagramProof(String(values.email));
  const handle = `@${values.instagram}`;

  const text = [
    greeting,
    ...body,
    ...(proof
      ? [
          `One last step: confirm ${handle} is yours. From that account, send this message to @${instagramAccount} on Instagram:`,
          proof,
          dm,
        ]
      : []),
    ...links.map(([label, path]) => `${label}: ${site}${path}`),
    `${why} Questions? Reply to this email or write to ${contactEmail}.`,
    `Unsubscribe: ${unsubscribe}`,
    "Semblanse",
  ].join("\n\n");

  const verify = proof
    ? `<div style="margin-top:32px;border-top:1px solid #d1d0c8;padding-top:26px">
<h2 style="margin:0 0 16px;font-family:${serif};font-size:28px;line-height:34px;font-weight:400;letter-spacing:-0.02em">One last step: confirm ${escapeHtml(handle)} is yours.</h2>
<p style="margin:0 0 16px">From that account, send this message to @${instagramAccount} on Instagram.</p>
<p style="margin:0 0 16px;padding:15px 20px;border:1px solid #c0c2b9;background:#ffffff;font-size:17px;line-height:24px;font-weight:600;word-break:break-word">${escapeHtml(proof)}</p>
<a class="button" href="${dm}" style="display:inline-block;padding:16px 26px;background:${green};color:#ffffff;font-size:16px;line-height:22px;font-weight:600;letter-spacing:-0.04em;text-decoration:none">Message @${instagramAccount}</a>
</div>`
    : "";
  const linkRow = links.length
    ? `<p style="margin:24px 0 0;font-size:16px;line-height:22px;font-weight:500">${links
        .map(
          ([label, path]) =>
            `<a href="${site}${path}" style="display:inline-block;margin:0 28px 12px 0;color:${ink};text-decoration:underline">${escapeHtml(label)} →</a>`,
        )
        .join("")}</p>`
    : "";
  const footerLink = (label: string, href: string) =>
    `<a href="${href}" style="display:inline-block;margin-right:20px;color:${cream};text-decoration:underline;white-space:nowrap">${label}</a>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(subject)}</title>
<style>
@font-face{font-family:"GFS Didot";font-weight:400;src:url("${site}/email/fonts/gfs-didot.woff2") format("woff2")}
@font-face{font-family:"Albert Sans";font-weight:100 900;src:url("${site}/email/fonts/albert-sans.woff2") format("woff2")}
@media (max-width:480px){
.gutter{padding-left:24px!important;padding-right:24px!important}
.title{font-size:40px!important;line-height:44px!important;padding-top:36px!important;padding-bottom:40px!important}
.button{display:block!important;text-align:center!important}
}
</style>
</head>
<body style="margin:0;padding:0;background:${cream}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${cream}">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${cream}">
<tr><td class="gutter" style="padding:22px 40px;background:${ink}"><a href="${site}/"><img src="${site}/email/wordmark.png" width="146" height="34" alt="Semblanse" style="display:block;border:0;font-family:${serif};font-size:26px;color:${cream}"></a></td></tr>
<tr><td class="gutter title" style="padding:48px 40px 52px;background:${panel};color:${onPanel};font-family:${serif};font-size:52px;line-height:56px;font-weight:400;letter-spacing:-0.04em">${title.map(escapeHtml).join("<br>")}</td></tr>
<tr><td class="gutter" style="padding:40px 40px 30px;font-family:${sans};font-size:17px;line-height:26px;color:${ink}">
${[greeting, ...body].map(paragraph).join("\n")}
${verify}${linkRow}
</td></tr>
<tr><td style="height:18px;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td class="gutter" style="padding:32px 40px 36px;background:${ink};font-family:${sans};color:${cream}">
<p style="margin:0 0 14px;font-size:18px;line-height:24px">Creator likeness.<br>Licensed by campaign.</p>
<p style="margin:0 0 18px;font-size:13px;line-height:20px;color:#bbbdb4">${escapeHtml(why)} Questions? Reply to this email or write to <a href="mailto:${contactEmail}" style="color:#bbbdb4">${contactEmail}</a>.</p>
<p style="margin:0;font-size:13px;line-height:20px;font-weight:500">${footerLink("Unsubscribe", unsubscribe)}${footerLink("Privacy Policy", `${site}/privacy/`)}${footerLink(host, `${site}/`)}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return {
    subject,
    text,
    html,
    replyTo: contactEmail,
    // Lets mail apps show their own unsubscribe button, which posts here.
    headers: {
      "List-Unsubscribe": `<${site}/api/unsubscribe?id=${id}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
