"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Action } from "@/components/landing/brand";
import { DitherImage } from "@/components/landing/dither";
import { ScrollArtwork } from "@/components/landing/landing-page";
import { Lines, Reveal } from "@/components/landing/motion";
import {
  Breadcrumbs,
  SplitHero,
  TextLink,
  art,
  delay,
  type Crumb,
} from "./shared";
import {
  contactEmail,
  enquiryFields,
  instagramAccount,
  instagramProof,
  options,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryRequest,
  type EnquiryResponse,
  type EnquiryValues,
  type FormKind,
} from "@/lib/enquiry-schema";
import { useTurnstile } from "@/lib/turnstile";
import { attribution, track } from "@/lib/analytics";

export type EnquiryKind = "creator-pilot" | "brand-pilot" | "contact";

/** Each field shows its own message from here, keyed by field name. */
const Errors = createContext<EnquiryErrors>({});

function FieldError({ name }: { name: string }) {
  const error = useContext(Errors)[name];
  return error ? (
    <p id={`${name}-error`} className="sp-error">
      {error}
    </p>
  ) : null;
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  optional = false,
  rows,
  autoComplete,
  hint,
  verbatim = type !== "text",
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  optional?: boolean;
  hint?: string;
  /** Turns off the keyboard's capitals and corrections. On for links and emails. */
  verbatim?: boolean;
  /** Renders a multi-line field of this height in rows. */
  rows?: number;
  autoComplete?: string;
}) {
  const invalid = name in useContext(Errors);
  const describedBy =
    [invalid && `${name}-error`, hint && `${name}-hint`]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className="sp-field">
      <Label htmlFor={name}>
        {label}
        {optional && <span>(optional)</span>}
      </Label>
      {rows ? (
        <Textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={!optional}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={!optional}
          autoComplete={autoComplete}
          autoCapitalize={verbatim ? "none" : undefined}
          autoCorrect={verbatim ? "off" : undefined}
          spellCheck={verbatim ? false : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
      )}
      <FieldError name={name} />
      {hint && (
        <p id={`${name}-hint`} className="sp-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

function Choice({
  label,
  hint,
  name,
  options,
  defaultValue,
  multiple = false,
}: {
  label: string;
  hint?: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
  multiple?: boolean;
}) {
  const invalid = name in useContext(Errors);
  return (
    <fieldset className="sp-choice">
      <legend>{label}</legend>
      {hint && <p className="sp-hint">{hint}</p>}
      <div>
        {options.map((option) => (
          <label key={option}>
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option}
              defaultChecked={option === defaultValue}
              required={!multiple && !defaultValue}
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? `${name}-error` : undefined}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <FieldError name={name} />
    </fieldset>
  );
}

function Consent({ children }: { children: ReactNode }) {
  const invalid = "consent" in useContext(Errors);
  return (
    <div className="sp-consent-field">
      <label className="sp-consent">
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "consent-error" : undefined}
        />
        <span>{children}</span>
      </label>
      <FieldError name="consent" />
    </div>
  );
}

const privacy = <Link href="/privacy">Privacy Policy</Link>;

const pages = {
  "creator-pilot": {
    tone: "ink",
    art: "portrait/ring-light",
    crumbs: [["Apply as a creator", "/creator-pilot"]],
    sent: "Application received",
    title: ["Your likeness.", "Your call."],
    lead: "We’re building a way for brands to license an AI version of your face and voice for their ads, one campaign at a time. You see every ad first, and nothing runs without your yes. Apply to join our pilot waitlist.",
    notesTitle: "What happens next",
    notes: [
      [
        "We check your account.",
        "A message from your Instagram account shows us the account is really yours.",
      ],
      [
        "We reach out when a campaign fits.",
        "You see which brand it is, what you’d be paid, where the ads would run and for how long, before anything starts.",
      ],
      [
        "You decide.",
        "Accept, ask for changes or say no. Your face and voice aren’t used until you accept and sign.",
      ],
      [
        "Before your first campaign.",
        "You record face, body and voice samples once. After that, you approve each ad.",
      ],
    ],
    formTitle: "Tell us about you.",
    submit: "Join the waitlist",
    small:
      "Joining doesn’t give us or any brand the right to use your face or voice.",
  },
  "brand-pilot": {
    tone: "green",
    art: "portrait/phone-call",
    crumbs: [
      ["For brands and agencies", "/brands"],
      ["Book a pilot call", "/brand-pilot"],
    ],
    sent: "Request received",
    title: ["Put a real", "creator in your", "next AI ad."],
    lead: "Tell us about your brand or your clients. We’ll reply by email with times for a short call to plan a first campaign.",
    notesTitle: "On the call",
    notes: [
      [
        "Your brief.",
        "What you’re selling, who it’s for, and the kind of creator who’d suit it.",
      ],
      [
        "Your production setup.",
        "Whether our team or yours makes the ads, the tools used, and how creator approval fits your schedule.",
      ],
      [
        "Price and what we measure.",
        "What a pilot costs, and which ad you want to beat.",
      ],
    ],
    formTitle: "Tell us about your brand.",
    submit: "Request a pilot call",
    small: "Nothing is agreed until you’ve seen and accepted a quote.",
  },
  contact: {
    tone: "lilac",
    art: "portrait/envelope",
    crumbs: [["Contact", "/contact"]],
    sent: "Message sent",
    title: ["Get in touch."],
    lead: "Questions about the pilots, a partnership or press? Send us a note and we’ll reply by email.",
    notesTitle: "",
    notes: [],
    formTitle: "Send us a note.",
    submit: "Send message",
    small: "",
  },
} as const;

function Fields({ kind }: { kind: EnquiryKind }) {
  if (kind === "creator-pilot")
    return (
      <>
        <div className="sp-instagram">
          <Field
            name="instagram"
            label="First, confirm your Instagram account"
            placeholder="@yourname"
            verbatim
            hint="After you apply, you’ll message us from this account to confirm it’s yours. We can’t post for you or see your other messages."
          />
        </div>
        <hr />
        <Field name="name" label="Full name" autoComplete="name" />
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Choice
          label="What do you make?"
          hint="Pick any that fit."
          name="category"
          multiple
          defaultValue="Fitness"
          options={options.category}
        />
        <Field
          name="profile"
          label="TikTok or YouTube"
          type="url"
          placeholder="Link to your profile"
          optional
        />
        <Choice
          label="Where do you live?"
          name="country"
          defaultValue="Canada"
          options={options.country}
        />
        <Field
          name="limits"
          label="Anything you’d never promote?"
          placeholder="Topics, brands or claims that are off limits for you"
          rows={4}
          optional
        />
        <Consent>
          I’m 18 or older, and I agree to the {privacy} and{" "}
          <Link href="/terms">Terms</Link>.
        </Consent>
      </>
    );
  if (kind === "brand-pilot")
    return (
      <>
        <Field name="name" label="Full name" autoComplete="name" />
        <Field
          name="email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />
        <Field
          name="company"
          label="Company"
          placeholder="Brand or agency name"
          autoComplete="organization"
        />
        <Choice
          label="Are you a brand or an agency?"
          name="type"
          defaultValue="Agency"
          options={options.type}
        />
        <Choice
          label="Who would make the ads?"
          hint="Either way, the creator approves every final ad."
          name="production"
          defaultValue="My team"
          options={options.production}
        />
        <Field
          name="sell"
          label="What do you sell, or who are your clients?"
          placeholder="e.g. DTC skincare, or the supplement brands you run ads for"
        />
        <Choice
          label="Monthly paid social spend"
          hint="Agencies: across the clients you’d test with."
          name="spend"
          defaultValue="$10K–$50K"
          options={options.spend}
        />
        <Field
          name="test"
          label="What would you want to test?"
          placeholder="A product, an audience, or an ad you’d like to beat"
          rows={4}
          optional
        />
        <Consent>
          I’ve read the {privacy} and agree to the use of these details to
          handle my pilot enquiry.
        </Consent>
      </>
    );
  return (
    <>
      <Field name="name" label="Full name" autoComplete="name" />
      <Field
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
      />
      <Choice label="I’m a…" name="role" options={options.role} />
      <Field
        name="message"
        label="Message"
        placeholder="How can we help?"
        rows={5}
      />
      <Consent>
        I’ve read the {privacy} and agree to the use of these details to reply
        to my message.
      </Consent>
    </>
  );
}

/** The creator's last step: prove the Instagram account is theirs. */
function VerifyInstagram({
  email,
  username,
}: {
  email: string;
  username: string;
}) {
  const [copied, setCopied] = useState(false);
  const message = instagramProof(email);
  return (
    <div className="sp-verify" data-hero style={delay(0.6)}>
      <h2>One last step: confirm @{username} is yours.</h2>
      <p>
        From that account, send this to @{instagramAccount} in an Instagram
        message. It’s in your confirmation email too, if you’d rather do it
        later.
      </p>
      <div className="sp-verify-code">
        <output aria-label="Your message">{message}</output>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            navigator.clipboard?.writeText(message).then(
              () => {
                setCopied(true);
                track("verify_message_copied", { form: "creator-pilot" });
              },
              () => {},
            );
          }}
        >
          <span aria-live="polite">{copied ? "Copied" : "Copy message"}</span>
        </Button>
      </div>
      {/* Opens in a new tab so the message stays on screen. */}
      <a
        className="sp-link"
        href={`https://ig.me/m/${instagramAccount}`}
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          track("verify_message_opened", { form: "creator-pilot" })
        }
      >
        Message @{instagramAccount} on Instagram{" "}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

type Sent = { email?: string; username?: string };

function Confirmation({ kind, sent }: { kind: EnquiryKind; sent: Sent }) {
  const home = <Action href="/">Back to the homepage</Action>;
  const copy = (
    lines: string[],
    body: string,
    actions: ReactNode,
    after?: ReactNode,
  ) => (
    <>
      <Lines as="h1" className="sp-display" lines={lines} onLoad />
      <p className="sp-lead" data-hero style={delay(0.35)}>
        {body}
      </p>
      <div className="sp-actions" data-hero style={delay(0.47)}>
        {actions}
      </div>
      {after}
    </>
  );
  if (kind === "creator-pilot")
    return (
      <SplitHero artwork="mug" className="sp-confirmation">
        {copy(
          ["You’re on", "the waitlist."],
          "Thanks for applying. When a campaign fits what you make, we’ll email you which brand it is, what you’d be paid, where the ads would run and for how long, and you decide. We’re running only a few campaigns for now, so this may take a while, and we can’t promise an offer.",
          <>
            {home}
            <TextLink href="/#how-it-works">See how a campaign works</TextLink>
          </>,
          sent.email && sent.username && (
            <VerifyInstagram email={sent.email} username={sent.username} />
          ),
        )}
      </SplitHero>
    );
  if (kind === "brand-pilot")
    return (
      <SplitHero artwork="headphones" side="left" className="sp-confirmation">
        {copy(
          ["We’ll send", "you some times."],
          "Look out for an email from us with a few times for a short call. It helps to have your product, the ad you’d like to beat and, if your team will make the ads, the AI tools it uses.",
          <>
            {home}
            <TextLink href="/pilot">See the pilot overview</TextLink>
          </>,
        )}
      </SplitHero>
    );
  return (
    <SplitHero artwork="envelope" className="sp-confirmation">
      {copy(
        ["Thanks for", "writing."],
        "We’ll reply to the email you gave us. In the meantime, the FAQ and the pilot overview answer most questions.",
        <>
          {home}
          <TextLink href="/#questions">Read the FAQ</TextLink>
          <TextLink href="/pilot">See the pilot overview</TextLink>
        </>,
      )}
    </SplitHero>
  );
}

const failures = {
  rate_limited: `Please wait before trying again, or email ${contactEmail} if you need help now.`,
  challenge: "We couldn’t confirm this came from a person. Please try again.",
  unavailable: `That didn’t send, and your answers are still here. Try again, or email ${contactEmail}.`,
};

/**
 * Checks, sends and reports on one form. Spread `form` on the <form>, wrap
 * its fields in `Errors`, and render `challenge` and `alert` beside the
 * submit button.
 */
function useEnquiry(kind: FormKind, onSent: (values: EnquiryValues) => void) {
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [failure, setFailure] = useState<keyof typeof failures>();
  const started = useRef(false);
  const completed = useRef(new Set<string>());
  const requestId = useRef<string>(undefined);
  const { container, getToken } = useTurnstile();

  function showErrors(form: HTMLFormElement, found: EnquiryErrors) {
    setErrors(found);
    track("form_error", { form: kind, fields: Object.keys(found) });
    requestAnimationFrame(() =>
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    track("form_submit_attempted", { form: kind });
    const form = event.currentTarget;
    const data = new FormData(form);
    const input: Record<string, unknown> = {};
    for (const field of enquiryFields(kind)) {
      const all = data.getAll(field);
      input[field] = all.length > 1 ? all : all[0];
    }
    const { values, errors: found } = validateEnquiry(kind, input);
    setFailure(undefined);
    if (Object.keys(found).length) return showErrors(form, found);

    setErrors({});
    setSending(true);
    let result: EnquiryResponse;
    try {
      const request: EnquiryRequest = {
        requestId: (requestId.current ??= crypto.randomUUID()),
        kind,
        values: input,
        token: await getToken(),
        fax: String(data.get("fax") ?? ""),
        attribution: attribution(),
      };
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(20_000),
      });
      result = await response.json();
    } catch {
      result = { ok: false, reason: "unavailable" };
    }
    setSending(false);

    if (!result.ok) {
      if (result.reason === "invalid" && Object.keys(result.errors).length)
        return showErrors(form, result.errors);
      const reason =
        result.reason === "challenge"
          ? "challenge"
          : result.reason === "rate_limited"
            ? "rate_limited"
            : "unavailable";
      track("form_failed", { form: kind, reason });
      return setFailure(reason);
    }
    track("form_submitted", { form: kind });
    onSent(values);
  }

  const count = Object.keys(errors).length;
  return {
    errors,
    sending,
    form: {
      method: "post" as const,
      action: "/api/enquiry",
      "data-analytics-form": kind,
      // The form shows its own message under each field.
      noValidate: true,
      onSubmit,
      onFocus: () => {
        if (started.current) return;
        started.current = track("form_started", { form: kind });
      },
      onBlur: (event: FormEvent<HTMLFormElement>) => {
        const input = event.target;
        if (
          !(
            input instanceof HTMLInputElement ||
            input instanceof HTMLTextAreaElement
          ) ||
          !enquiryFields(kind).includes(input.name) ||
          !input.value ||
          !input.validity.valid ||
          (input instanceof HTMLInputElement &&
            ["radio", "checkbox"].includes(input.type) &&
            !input.checked) ||
          completed.current.has(input.name)
        )
          return;
        if (track("form_field_completed", { form: kind, field: input.name }))
          completed.current.add(input.name);
      },
      onChange: (event: FormEvent<HTMLFormElement>) => {
        const name = (event.target as Element).getAttribute("name") ?? "";
        if (name in errors)
          setErrors((current) => {
            const rest = { ...current };
            delete rest[name];
            return rest;
          });
      },
    },
    challenge: (
      <>
        {/* A trap for scripts that fill every field. People never see it. */}
        <div className="sp-fax" aria-hidden="true">
          <label>
            Fax
            <input name="fax" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div ref={container} className="sp-turnstile" />
      </>
    ),
    alert: (
      <div role="alert">
        {count > 0 ? (
          <p className="sp-error">
            {count === 1
              ? "Check the highlighted answer above."
              : `Check the ${count} highlighted answers above.`}
          </p>
        ) : (
          failure && <p className="sp-error">{failures[failure]}</p>
        )}
      </div>
    ),
  };
}

export function EnquiryPage({ kind }: { kind: EnquiryKind }) {
  const [sent, setSent] = useState<Sent>();
  const wrap = useRef<HTMLDivElement>(null);
  const page = pages[kind];
  const enquiry = useEnquiry(kind, (values) => {
    setSent({
      email: values.email as string,
      username: values.instagram as string,
    });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      wrap.current
        ?.querySelector<HTMLElement>(".sp-confirmation")
        ?.focus({ preventScroll: true });
    });
  });
  // The last level is the page itself until the form is sent.
  const here = page.crumbs.map(([label, href], i): Crumb =>
    !sent && i === page.crumbs.length - 1 ? [label] : [label, href],
  );
  const trail: Crumb[] = [
    ["Home", "/"],
    ...here,
    ...(sent ? [[page.sent] as Crumb] : []),
  ];
  if (sent)
    return (
      <div ref={wrap}>
        <Breadcrumbs trail={trail} />
        <Confirmation kind={kind} sent={sent} />
      </div>
    );
  return (
    <div ref={wrap}>
      <Breadcrumbs trail={trail} />
      <div className="sp-split">
        <div className={`sp-panel sp-panel-art-bg sp-${page.tone}`}>
          {/* The portrait artwork fills the panel, under a tint of its colour
              that thins towards the foot. */}
          <div className="sp-panel-art" aria-hidden="true">
            <DitherImage src={art(page.art)} alt="" priority intro />
          </div>
          <div className="sp-panel-copy">
            <Lines
              as="h1"
              className="sp-panel-title"
              lines={[...page.title]}
              onLoad
            />
            <p className="sp-panel-lead" data-hero style={delay(0.35)}>
              {page.lead}
            </p>
            <div className="sp-form-jump">
              <TextLink href="#application-form">
                {kind === "creator-pilot"
                  ? "Start your application"
                  : kind === "brand-pilot"
                    ? "Open the pilot form"
                    : "Open the message form"}
              </TextLink>
            </div>
            <div className="sp-notes" data-hero style={delay(0.47)}>
              {kind === "contact" && (
                <h2 className="sr-only">Other ways to get in touch</h2>
              )}
              {page.notesTitle && <h2>{page.notesTitle}</h2>}
              {page.notes.map(([title, copy]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
              {kind === "contact" && (
                <>
                  <div>
                    <h3>Want to be in a campaign?</h3>
                    <TextLink href="/creator-pilot">
                      Apply as a creator
                    </TextLink>
                  </div>
                  <div>
                    <h3>Planning a campaign?</h3>
                    <TextLink href="/brand-pilot">Book a pilot call</TextLink>
                  </div>
                  <div>
                    <h3>Seen an ad that misuses someone’s likeness?</h3>
                    <TextLink href="/trust#report">Report it</TextLink>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div
          className="sp-form-column"
          id="application-form"
          data-hero
          style={delay(0.2)}
        >
          <h2 className="sp-form-title">{page.formTitle}</h2>
          <noscript>
            <style>{".sp-form { display: none; }"}</style>
            <p>
              Enable JavaScript to use this form, or email{" "}
              <a href="mailto:hello@semblanse.com">hello@semblanse.com</a>.
            </p>
          </noscript>
          <form className="sp-form" {...enquiry.form}>
            <Errors value={enquiry.errors}>
              <Fields kind={kind} />
            </Errors>
            <div className="sp-submit">
              {enquiry.challenge}
              {enquiry.alert}
              <Button
                type="submit"
                className="sp-submit-button"
                aria-disabled={enquiry.sending}
              >
                {enquiry.sending ? "Sending…" : page.submit}
              </Button>
              {page.small && <p className="sp-hint">{page.small}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/** The misuse report at the foot of Trust & Safety: a panel beside its form. */
export function ReportForm() {
  const [sent, setSent] = useState(false);
  const enquiry = useEnquiry("report", () => setSent(true));
  return (
    <section className="sp-split sp-report" id="report">
      <div className="sp-panel sp-green">
        <div className="sp-panel-copy">
          <Lines
            className="sp-panel-title"
            lines={["Report misuse, or ask us to get an ad taken down."]}
          />
          <Reveal as="p" className="sp-panel-lead" delay={0.15}>
            Seen an ad that uses your likeness, or someone else’s, without
            approval? Tell us. You don’t need to be a Semblanse creator.
          </Reveal>
          <Reveal className="sp-notes" delay={0.25}>
            <h3 className="sp-notes-title">What happens next</h3>
            {[
              [
                "We check the record.",
                "Each licence is signed and tracked, so we compare the ad with what was agreed.",
              ],
              [
                "We tell the brand to stop.",
                "If the ad was made under a Semblanse licence, the brand has to take it down. If it wasn’t, we’ll tell you how to report it to the platform.",
              ],
              [
                "We tell you what happened.",
                "You hear what we found and what was done. A person reads every report. We’re still setting formal response times.",
              ],
            ].map(([title, copy]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </Reveal>
        </div>
        <ScrollArtwork className="sp-report-art" src={art("hood")} alt="" />
      </div>
      <Reveal className="sp-form-column" delay={0.1}>
        {sent ? (
          <div className="sp-report-sent" role="status">
            <h2 className="sp-form-title">Report noted.</h2>
            <p>
              A person reads every report. We’ll reply to the email you gave us.
            </p>
          </div>
        ) : (
          <>
            <h2 className="sp-form-title">Send a report.</h2>
            <noscript>
              <p>
                Enable JavaScript to send a report, or email{" "}
                <a href="mailto:hello@semblanse.com?subject=Misuse%20report">
                  hello@semblanse.com
                </a>
                .
              </p>
              <style>{".sp-form { display: none; }"}</style>
            </noscript>
            <form className="sp-form" {...enquiry.form}>
              <Errors value={enquiry.errors}>
                <Field
                  name="report-name"
                  label="Your name"
                  autoComplete="name"
                />
                <Field
                  name="report-email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <Choice
                  label="What are you reporting?"
                  name="report-kind"
                  defaultValue="An ad I didn’t approve"
                  options={options.report}
                />
                <Field
                  name="report-link"
                  label="Link to the ad, or where you saw it"
                  placeholder="https://"
                />
                <Field
                  name="report-detail"
                  label="What happened?"
                  placeholder="When you saw it, who appears in it, and what you’d like to happen"
                  rows={4}
                />
                <label className="sp-consent">
                  <input type="checkbox" name="report-subject" />
                  <span>I’m the person shown in the ad.</span>
                </label>
              </Errors>
              <div className="sp-submit">
                {enquiry.challenge}
                {enquiry.alert}
                <Button
                  type="submit"
                  className="sp-submit-button"
                  aria-disabled={enquiry.sending}
                >
                  {enquiry.sending ? "Sending…" : "Send report"}
                </Button>
                <p className="sp-hint">
                  We use these details only to look into your report.
                </p>
              </div>
            </form>
          </>
        )}
      </Reveal>
    </section>
  );
}
