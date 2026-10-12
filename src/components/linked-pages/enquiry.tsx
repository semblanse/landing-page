"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Action } from "@/components/landing/brand";
import { ArrowLink, EditorialRows, PageTitle, ProfileAccent } from "./shared";
import content from "./content.json";
import { DitherImage } from "@/components/landing/dither";

type Kind = "creator-pilot" | "brand-pilot" | "contact";

function Field({
  name,
  label,
  placeholder,
  type = "text",
  optional = false,
  message = false,
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  optional?: boolean;
  message?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="lp-field">
      <Label htmlFor={name}>
        {label}
        {optional && <span> Optional</span>}
      </Label>
      {message ? (
        <Textarea
          id={name}
          name={name}
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
  name,
  options,
  defaultValue,
  multiple = false,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
  multiple?: boolean;
}) {
  return (
    <fieldset className="lp-choice">
      <legend>{label}</legend>
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

function EnquiryForm({
  kind,
  onPreview,
}: {
  kind: Kind;
  onPreview: () => void;
}) {
  const [instagramPreview, setInstagramPreview] = useState(false);
  const creator = kind === "creator-pilot";
  const brand = kind === "brand-pilot";
  return (
    <div
      className={`lp-form-stage ${creator ? "lp-lilac" : brand ? "lp-sage" : "lp-green"}`}
    >
      <form
        className="lp-form"
        onSubmit={(event) => {
          event.preventDefault();
          onPreview();
        }}
      >
        <h2>
          {creator
            ? "Apply as a creator"
            : brand
              ? "Request a pilot call"
              : "Send a message"}
        </h2>
        {creator ? (
          <>
            <p>
              Start by confirming your account. Then tell us a little about what
              you make.
            </p>
            <Button
              className="lp-instagram"
              type="button"
              onClick={() => setInstagramPreview(true)}
            >
              <img src="/linked-pages/563-2975-imgCameraGlyph.svg" alt="" />
              Continue with Instagram
            </Button>
            <p className="lp-form-small">
              We only use this to confirm the account is yours. We can’t post
              for you or see your messages.
            </p>
            {instagramPreview && (
              <p className="lp-preview-notice" role="status">
                Instagram sign-in is a preview. No account was connected. You
                can try the form below.
              </p>
            )}
          </>
        ) : brand ? (
          <p>
            Takes two minutes. Nothing is agreed until you approve the terms.
          </p>
        ) : null}
        <p className="lp-preview-notice">
          Preview form. Your details stay in this browser and are not sent.
        </p>
        <Field
          name="full-name"
          label="FULL NAME"
          placeholder="Your name"
          autoComplete="name"
        />
        <Field
          name="email"
          label={brand ? "WORK EMAIL" : "EMAIL"}
          placeholder={brand ? "you@company.com" : "you@example.com"}
          type="email"
          autoComplete="email"
        />
        {creator ? (
          <>
            <Choice
              label="WHAT DO YOU MAKE?"
              name="category"
              options={[
                "Fitness",
                "Food",
                "Beauty",
                "Lifestyle",
                "Outdoors",
                "Parenting",
                "Something else",
              ]}
              defaultValue="Fitness"
              multiple
            />
            <Field
              name="creator-profile"
              label="TIKTOK OR YOUTUBE"
              placeholder="Link to your profile"
              type="url"
              optional
            />
            <Choice
              label="WHERE DO YOU LIVE?"
              name="country"
              options={["Canada", "United States", "Somewhere else"]}
              defaultValue="Canada"
            />
            <Field
              name="boundaries"
              label="ANYTHING YOU’D NEVER PROMOTE?"
              placeholder="Topics, brands or claims that are off limits for you"
              optional
              message
            />
          </>
        ) : brand ? (
          <>
            <Field
              name="company"
              label="COMPANY"
              placeholder="Brand or agency name"
              autoComplete="organization"
            />
            <Choice
              label="YOU ARE"
              name="team"
              options={["An agency", "A brand"]}
              defaultValue="An agency"
            />
            <Field
              name="product"
              label="WHAT DO YOU SELL?"
              placeholder="e.g. DTC skincare. Agencies: who your clients are"
            />
            <Choice
              label="MONTHLY PAID SOCIAL SPEND"
              name="spend"
              options={[
                "Under $10K",
                "$10K–$50K",
                "$50K+",
                "Prefer not to say",
              ]}
              defaultValue="$10K–$50K"
            />
            <Field
              name="test"
              label="WHAT WOULD YOU WANT TO TEST?"
              placeholder="A product, an audience, or an ad you’d like to beat"
              optional
              message
            />
          </>
        ) : (
          <>
            <Choice
              label="I’M A"
              name="enquirer"
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
              label="MESSAGE"
              placeholder="How can we help?"
              message
            />
          </>
        )}
        <label className="lp-consent">
          <input type="checkbox" required />
          <span>
            {creator
              ? "I’m 18 or older, and I agree to the "
              : "I agree to the "}
            <Link href="/privacy">Privacy Policy</Link>
            {creator && (
              <>
                {" and "}
                <Link href="/terms">Terms</Link>
              </>
            )}
            .
          </span>
        </label>
        <Button type="submit" className="lp-submit">
          {creator
            ? "Join the waitlist"
            : brand
              ? "Request a pilot call"
              : "Send message"}
          <span className="sr-only"> — preview only</span>
        </Button>
        <p className="lp-form-small lp-center">
          {creator
            ? "Applying grants no rights to your likeness."
            : brand
              ? "We’ll reply by email with times for a short call."
              : "We’ll reply by email."}
        </p>
      </form>
    </div>
  );
}

function Confirmation({ kind, onBack }: { kind: Kind; onBack: () => void }) {
  const creator = kind === "creator-pilot";
  const brand = kind === "brand-pilot";
  return (
    <section
      className={`lp-confirmation ${creator ? "lp-green" : brand ? "lp-ink" : "lp-sage"}`}
      tabIndex={-1}
    >
      <div className="lp-confirmation-copy">
        <p className="lp-eyebrow">
          {creator
            ? "APPLICATION PREVIEW"
            : brand
              ? "PILOT REQUEST PREVIEW"
              : "MESSAGE PREVIEW"}
        </p>
        <PageTitle>
          {creator
            ? "You’re at\nthe next step."
            : brand
              ? "Ready for\na pilot call."
              : "Thanks for\ntrying the form."}
        </PageTitle>
        <p className="lp-lead">
          This is the end of the preview. No enquiry was sent, no account was
          connected, and no rights were granted.
        </p>
        {brand ? (
          <>
            <p className="lp-eyebrow">BEFORE THE CALL, IT HELPS TO HAVE</p>
            <ul className="lp-confirmation-list">
              <li>Your product and the audience you’re targeting</li>
              <li>A recent ad that performed well</li>
              <li>The AI tools your team uses today</li>
            </ul>
          </>
        ) : (
          <div className="lp-confirmation-links">
            <ArrowLink href={creator ? "/#how-it-works" : "/#questions"}>
              {creator ? "See how a campaign works" : "Read the FAQ"}
            </ArrowLink>
            <ArrowLink href={creator ? "/#your-control" : "/pilot"}>
              {creator
                ? "Read how we protect your likeness"
                : "See the pilot overview"}
            </ArrowLink>
            <ArrowLink href={creator ? "/#questions" : "/#your-control"}>
              {creator
                ? "Read the creator FAQ"
                : "How we protect your likeness"}
            </ArrowLink>
          </div>
        )}
        <div className="lp-actions">
          <Action href="/" variant={kind === "contact" ? "default" : "cream"}>
            Back to the homepage
          </Action>
          <Button className="lp-back" variant="outline" onClick={onBack}>
            Back to preview form
          </Button>
        </div>
      </div>
      {kind === "contact" ? (
        <ProfileAccent contact />
      ) : (
        <DitherImage
          className="lp-confirmation-art"
          src={
            creator
              ? "/figma/source/cap-scene.webp"
              : "/figma/source/creator-recording.webp"
          }
          alt=""
        />
      )}
    </section>
  );
}

export function EnquiryPage({ kind }: { kind: Kind }) {
  const [preview, setPreview] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = content[kind].sections[0].text;
  const creator = kind === "creator-pilot";
  const brand = kind === "brand-pilot";
  function showPreview(value: boolean) {
    setPreview(value);
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
      sectionRef.current
        ?.querySelector<HTMLElement>(value ? ".lp-confirmation" : "input")
        ?.focus({ preventScroll: true });
    });
  }
  return (
    <div ref={sectionRef}>
      {preview ? (
        <Confirmation kind={kind} onBack={() => showPreview(false)} />
      ) : (
        <section
          className={`lp-enquiry lp-enquiry-${kind}`}
          data-figma-node={content[kind].id}
        >
          <div
            className={`lp-enquiry-story ${creator ? "lp-ink" : brand ? "lp-lilac" : ""}`}
          >
            <p className="lp-eyebrow">{t[0]}</p>
            <PageTitle>{t[1]}</PageTitle>
            <p className="lp-lead">{t[2]}</p>
            {creator || brand ? (
              <div className="lp-enquiry-explainer">
                <p className="lp-eyebrow">{t[3]}</p>
                <EditorialRows
                  texts={t.slice(4, creator ? 10 : 12)}
                  bullets={creator}
                />
              </div>
            ) : (
              <div className="lp-contact-paths">
                <Link href="/creator-pilot" className="lp-sage">
                  <p className="lp-eyebrow">{t[3]}</p>
                  <h2>{t[4]}</h2>
                  <div>
                    {t[5]}
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
                <Link href="/brand-pilot" className="lp-lilac">
                  <p className="lp-eyebrow">{t[7]}</p>
                  <h2>{t[8]}</h2>
                  <div>
                    {t[9]}
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              </div>
            )}
            {!brand && <ProfileAccent contact={kind === "contact"} />}
          </div>
          <div className="lp-enquiry-form-side">
            <EnquiryForm kind={kind} onPreview={() => showPreview(true)} />
          </div>
        </section>
      )}
    </div>
  );
}
