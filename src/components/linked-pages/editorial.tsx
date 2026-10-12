import { Action } from "@/components/landing/brand";
import { DitherImage } from "@/components/landing/dither";
import { ProfileRow, ProfileTrio, TextLink } from "./shared";

const capScene = (
  <DitherImage src="/figma/source/cap-scene.webp" alt="" flipX />
);

export function AboutPage() {
  return (
    <>
      <section className="sp-hero">
        <h1 className="sp-display">
          AI can copy anyone’s face.{"\n"}Permission is what’s scarce.
        </h1>
        <p className="sp-lead">
          Semblanse lets brands license a real creator’s face, voice and stories
          for AI-made ads, one campaign at a time. The creator approves every
          final ad.
        </p>
        <div className="sp-actions">
          <Action href="/creator-pilot">Apply as a creator</Action>
          <TextLink href="/brand-pilot">
            Brands and agencies: book a pilot call
          </TextLink>
        </div>
      </section>
      <section className="sp-beliefs sp-ink">
        <div className="sp-band">
          <h2 className="sp-heading">What we believe</h2>
          <div className="sp-columns">
            {[
              [
                "A creator is more than a face.",
                "Their stories, tone and limits are what make an ad believable.",
              ],
              [
                "Permission should be specific.",
                "One brand, one campaign, a set term and an end date.",
              ],
              [
                "Creators should be paid for judgment, not hours.",
                "Their context and approval are the work, even when they don’t film.",
              ],
            ].map(([title, copy]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <ProfileRow />
      </section>
      <section className="sp-band sp-refusals">
        <h2 className="sp-heading">What we don’t do</h2>
        <div className="sp-columns">
          {[
            [
              "We don’t make the ads.",
              "Brands produce them in their own tools. We handle the licence, the approvals and the record.",
            ],
            [
              "We don’t sell generic AI actors.",
              "Every ad stars a real creator who confirmed it’s them and said yes.",
            ],
            [
              "We don’t grant training rights.",
              "A licence never lets a brand train AI on a creator’s samples.",
            ],
          ].map(([title, copy]) => (
            <div key={title}>
              <span aria-hidden="true">×</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="sp-row sp-row-about">
        <div className="sp-row-art">{capScene}</div>
        <div className="sp-row-copy">
          <h2 className="sp-heading">We’re pre-launch.</h2>
          <p>
            We’re interviewing creators and agencies and running our first paid
            pilots by hand, in Canada and the US. What we learn decides what we
            build next.
          </p>
          <TextLink href="/contact">Investor or press? Get in touch</TextLink>
        </div>
      </section>
    </>
  );
}

export function PilotPage() {
  return (
    <>
      <section className="sp-hero sp-hero-pilot">
        <div>
          <h1 className="sp-display">Our first campaigns,{"\n"}run by hand.</h1>
          <p className="sp-lead">
            We’re running our first paid campaigns by hand with a few creators
            and brands, to learn what works before we build the full product.
          </p>
          <div className="sp-actions">
            <Action href="/creator-pilot">Apply as a creator</Action>
            <TextLink href="/brand-pilot">
              Brands and agencies: book a pilot call
            </TextLink>
          </div>
        </div>
        <ProfileTrio />
      </section>
      <div className="sp-body">
        <section className="sp-steps">
          <h2 className="sp-heading">
            Every pilot follows the same four steps.
          </h2>
          <ol>
            {[
              [
                "Offer",
                "The brand makes a paid offer: fee, channels, territory and term.",
              ],
              [
                "Licence",
                "If the creator accepts, a licence is signed for that one campaign.",
              ],
              [
                "Approval",
                "The brand’s team makes the ad. Only the version the creator approves can run.",
              ],
              [
                "Payment",
                "The fee is secured before production and released at approval, before launch.",
              ],
            ].map(([title, copy]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="sp-row">
          <div className="sp-row-art">{capScene}</div>
          <div className="sp-row-copy">
            <h2 className="sp-heading">
              Creators review the ad{"\n"}instead of filming it.
            </h2>
            <p>
              Record your samples once. For each campaign, share the stories and
              limits that fit it. When the ad is ready, approve it, ask for
              changes or decline it.
            </p>
            <Action href="/creator-pilot">Apply as a creator</Action>
          </div>
        </section>
        <section className="sp-row">
          <div className="sp-row-art sp-row-art-wide">
            <DitherImage src="/figma/source/creator-recording.webp" alt="" />
          </div>
          <div className="sp-row-copy">
            <h2 className="sp-heading">Real creators,{"\n"}cleared to run.</h2>
            <p>
              We match creators to your brief and write up their stories and
              limits so your team can script from them. You produce the ads in
              the tools you already use. Then we compare the results against
              your current best ads.
            </p>
            <Action href="/brand-pilot">Book a pilot call</Action>
          </div>
        </section>
        <section className="sp-open">
          <h2>Still being decided</h2>
          <p>
            We’re setting these with our first creators and brands. You’ll see
            them in writing before you agree to anything.
          </p>
          <ul>
            {[
              "What a creator is paid if they decline the final ad",
              "How many rounds of changes a licence includes",
              "How quickly creators review",
              "Whether a creator can require an AI label",
              "What a pilot costs",
            ].map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
