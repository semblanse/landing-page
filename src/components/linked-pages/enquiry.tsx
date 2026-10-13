"use client";

import { useRef, useState, type ReactNode } from "react";
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

export type EnquiryKind = "creator-pilot" | "brand-pilot" | "contact";

function Field({
  name,
  label,
  placeholder,
  type = "text",
  optional = false,
  rows,
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  optional?: boolean;
  /** Renders a multi-line field of this height in rows. */
  rows?: number;
  autoComplete?: string;
}) {
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
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={!optional}
          autoComplete={autoComplete}
        />
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
  options: string[];
  defaultValue?: string;
  multiple?: boolean;
}) {
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
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Consent({ children }: { children: ReactNode }) {
  return (
    <label className="sp-consent">
      <input type="checkbox" required />
      <span>{children}</span>
    </label>
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
    lead: "Brands pay to use an AI version of your face and voice in their ads, one campaign at a time. You see every ad first, and nothing runs without your yes. Joining the waitlist takes a few minutes.",
    notesTitle: "What happens next",
    notes: [
      [
        "We confirm it’s you.",
        "Signing in with Instagram shows us the account is really yours.",
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
  const [instagram, setInstagram] = useState(false);
  if (kind === "creator-pilot")
    return (
      <>
        <div className="sp-instagram">
          <p className="sp-label">First, confirm your Instagram account</p>
          <Button
            type="button"
            className="sp-instagram-button"
            aria-pressed={instagram}
            onClick={() => setInstagram(true)}
          >
            <span className="sp-camera" aria-hidden="true" />
            {instagram
              ? "Preview only: no account was connected"
              : "Continue with Instagram"}
          </Button>
          <p className="sp-hint">
            We only use this to confirm the account is yours. We can’t post for
            you or see your messages.
          </p>
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
          options={[
            "Fitness",
            "Food",
            "Beauty",
            "Lifestyle",
            "Outdoors",
            "Parenting",
            "Something else",
          ]}
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
          options={["Canada", "United States", "Somewhere else"]}
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
          options={["Brand", "Agency"]}
        />
        <Choice
          label="Who would make the ads?"
          hint="Either way, the creator approves every final ad."
          name="production"
          defaultValue="My team"
          options={["My team", "Semblanse’s team (pilot only)", "Not sure yet"]}
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
          options={[
            "Under $10K",
            "$10K–$50K",
            "Over $50K",
            "Prefer not to say",
          ]}
        />
        <Field
          name="test"
          label="What would you want to test?"
          placeholder="A product, an audience, or an ad you’d like to beat"
          rows={4}
          optional
        />
        <Consent>I agree to the {privacy}.</Consent>
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
      <Choice
        label="I’m a…"
        name="role"
        options={[
          "Creator",
          "Brand or agency",
          "Investor",
          "Press",
          "Something else",
        ]}
      />
      <Field
        name="message"
        label="Message"
        placeholder="How can we help?"
        rows={5}
      />
      <Consent>I agree to the {privacy}.</Consent>
    </>
  );
}

const previewNote = "Preview only. No details left this browser.";

function Confirmation({ kind }: { kind: EnquiryKind }) {
  const home = <Action href="/">Back to the homepage</Action>;
  const copy = (lines: string[], body: string, actions: ReactNode) => (
    <>
      <Lines as="h1" className="sp-display" lines={lines} onLoad />
      <p className="sp-lead" data-hero style={delay(0.35)}>
        {body}
      </p>
      <div className="sp-actions" data-hero style={delay(0.47)}>
        {actions}
      </div>
      <p className="sp-preview-note" data-hero style={delay(0.6)}>
        {previewNote}
      </p>
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

export function EnquiryPage({ kind }: { kind: EnquiryKind }) {
  const [sent, setSent] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const page = pages[kind];
  // The last level is the page itself until the form is sent.
  const here = page.crumbs.map(([label, href], i): Crumb =>
    !sent && i === page.crumbs.length - 1 ? [label] : [label, href],
  );
  const trail: Crumb[] = [
    ["Home", "/"],
    ...here,
    ...(sent ? [[page.sent] as Crumb] : []),
  ];
  function submit() {
    setSent(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      wrap.current
        ?.querySelector<HTMLElement>(".sp-confirmation")
        ?.focus({ preventScroll: true });
    });
  }
  if (sent)
    return (
      <div ref={wrap}>
        <Breadcrumbs trail={trail} />
        <Confirmation kind={kind} />
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
            <div className="sp-notes" data-hero style={delay(0.47)}>
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
        <div className="sp-form-column" data-hero style={delay(0.2)}>
          <h2 className="sp-form-title">{page.formTitle}</h2>
          <form
            className="sp-form"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <Fields kind={kind} />
            <div className="sp-submit">
              <Button type="submit" className="sp-submit-button">
                {page.submit}
              </Button>
              {page.small && <p className="sp-hint">{page.small}</p>}
              {/* Not in Figma. The form is not connected, and says so. */}
              <p className="sp-hint">
                Preview form. Your details stay in this browser and are not
                sent.
              </p>
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
            <p>{previewNote}</p>
          </div>
        ) : (
          <>
            <h2 className="sp-form-title">Send a report.</h2>
            <form
              className="sp-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <Field name="report-name" label="Your name" autoComplete="name" />
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
                options={[
                  "An ad I didn’t approve",
                  "Impersonation",
                  "Use after a licence ended",
                  "Something else",
                ]}
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
              <div className="sp-submit">
                <Button type="submit" className="sp-submit-button">
                  Send report
                </Button>
                <p className="sp-hint">
                  We use these details only to look into your report.
                </p>
                <p className="sp-hint">
                  Preview form. Your details stay in this browser and are not
                  sent.
                </p>
              </div>
            </form>
          </>
        )}
      </Reveal>
    </section>
  );
}
