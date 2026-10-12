"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Action } from "@/components/landing/brand";
import { DitherImage, heroDither } from "@/components/landing/dither";
import { PosterPage, ProfileRow, TextLink } from "./shared";

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
    title: "Your likeness.\nYour call.",
    lead: "Applying takes a few minutes. You join our waitlist, and we’ll reach out when a campaign fits you.",
    notesTitle: "What happens next",
    notes: [
      [
        "We confirm it’s you.",
        "Signing in with Instagram means no one else can apply as you.",
      ],
      [
        "We reach out when a campaign fits.",
        "You see the brand, fee, channels and term before anything starts.",
      ],
      [
        "You decide.",
        "Accept, ask for changes or say no. Nothing is used until you accept.",
      ],
    ],
    formTitle: "Tell us about you.",
    submit: "Join the waitlist",
    small: "Applying grants no rights to your likeness.",
  },
  "brand-pilot": {
    tone: "green",
    title: "Put a real\ncreator in your\nnext AI ad.",
    lead: "Tell us about your brand or your clients. We’ll reply by email with times for a short call to scope a first campaign.",
    notesTitle: "On the call",
    notes: [
      [
        "Your brief.",
        "What you’re selling, who it’s for, and the creators who could fit.",
      ],
      [
        "Your production setup.",
        "Who makes your ads, the tools they use, and how creator approval fits your schedule.",
      ],
      [
        "Price and the test.",
        "What a pilot costs, and which of your ads we’ll compare it against.",
      ],
    ],
    formTitle: "Tell us about your brand.",
    submit: "Request a pilot call",
    small: "Nothing is agreed until you’ve seen and accepted a quote.",
  },
  contact: {
    tone: "lilac",
    title: "Get in touch.",
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

function Artwork({ kind }: { kind: EnquiryKind }) {
  if (kind === "creator-pilot")
    return (
      <DitherImage
        className="sp-panel-art"
        src="/figma/source/cap-scene.webp"
        alt=""
        flipX
      />
    );
  if (kind === "brand-pilot")
    return (
      <DitherImage
        className="sp-panel-art"
        src="/figma/source/creator-recording.webp"
        alt=""
      />
    );
  // The landing hero artwork, with its treatment: 36% on white over ink.
  return (
    <div className="sp-panel-art sp-panel-art-hero">
      <DitherImage
        src="/figma/source/hero.webp"
        alt=""
        position={[0.9, 0.5]}
        settings={heroDither}
      />
    </div>
  );
}

const previewNote = "Preview only. No details left this browser.";

function Confirmation({ kind }: { kind: EnquiryKind }) {
  const home = (variant: "default" | "cream") => (
    <Action href="/" variant={variant}>
      Back to the homepage
    </Action>
  );
  if (kind === "creator-pilot")
    return (
      <PosterPage
        tone="ink"
        title={"You’re on\nthe waitlist."}
        actions={
          <>
            {home("default")}
            <TextLink href="/#how-it-works">See how a campaign works</TextLink>
          </>
        }
        note={previewNote}
        profiles={<ProfileRow />}
      >
        Thanks for applying. When a campaign fits what you make, we’ll email you
        the brand, fee, channels and term, and you decide. There’s nothing else
        to do for now.
      </PosterPage>
    );
  if (kind === "brand-pilot")
    return (
      <PosterPage
        tone="green"
        title={"We’ll send\nyou some times."}
        actions={
          <>
            {home("cream")}
            <TextLink href="/pilot">See the pilot overview</TextLink>
          </>
        }
        note={previewNote}
        profiles={<ProfileRow tones={{ a: "var(--ink)" }} />}
      >
        Look out for an email from us with a few times for a short call. It
        helps to have your product, a recent ad that worked, and the AI tools
        your team uses.
      </PosterPage>
    );
  return (
    <PosterPage
      tone="lilac"
      title={"Thanks for\nwriting."}
      actions={
        <>
          {home("default")}
          <TextLink href="/#questions">Read the FAQ</TextLink>
          <TextLink href="/pilot">See the pilot overview</TextLink>
        </>
      }
      note={previewNote}
      profiles={<ProfileRow tones={{ c: "#4f405e" }} />}
    >
      We’ll reply to the email you gave us. In the meantime, the FAQ and the
      pilot overview answer most questions.
    </PosterPage>
  );
}

export function EnquiryPage({ kind }: { kind: EnquiryKind }) {
  const [sent, setSent] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const page = pages[kind];
  function submit() {
    setSent(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      wrap.current
        ?.querySelector<HTMLElement>(".sp-poster")
        ?.focus({ preventScroll: true });
    });
  }
  if (sent)
    return (
      <div ref={wrap}>
        <Confirmation kind={kind} />
      </div>
    );
  return (
    <div ref={wrap} className="sp-split">
      <div className={`sp-panel sp-${page.tone}`}>
        <div className="sp-panel-copy">
          <h1 className="sp-panel-title">{page.title}</h1>
          <p className="sp-panel-lead">{page.lead}</p>
          <div className="sp-notes">
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
                  <TextLink href="/creator-pilot">Apply as a creator</TextLink>
                </div>
                <div>
                  <h3>Planning a campaign?</h3>
                  <TextLink href="/brand-pilot">Book a pilot call</TextLink>
                </div>
              </>
            )}
          </div>
        </div>
        <Artwork kind={kind} />
      </div>
      <div className="sp-form-column">
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
              Preview form. Your details stay in this browser and are not sent.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
