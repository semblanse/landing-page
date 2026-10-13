import { Action } from "@/components/landing/brand";
import { ScrollArtwork } from "@/components/landing/landing-page";
import { Lines, Reveal } from "@/components/landing/motion";
import { ReportForm } from "./enquiry";
import { PilotSteps } from "./steps";
import { LoadArt, SplitHero, TextLink, art, delay } from "./shared";

export function AboutPage() {
  return (
    <>
      <section className="sp-hero">
        <Lines
          as="h1"
          className="sp-display"
          lines={["AI can copy anyone’s face.", "Permission is what’s scarce."]}
          onLoad
        />
        <p className="sp-lead" data-hero style={delay(0.35)}>
          Semblanse lets brands license a real creator’s face, voice and stories
          for AI-made ads, one campaign at a time. The creator approves every
          final ad.
        </p>
        <div className="sp-actions" data-hero style={delay(0.47)}>
          <Action href="/creator-pilot">Apply as a creator</Action>
          <TextLink href="/brand-pilot">
            Brands and agencies: book a pilot call
          </TextLink>
        </div>
      </section>
      <section className="sp-statements sp-ink">
        <div className="sp-statements-copy">
          <Lines className="sp-heading" lines={["What we believe"]} />
          <ul>
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
                "Their stories and their sign-off are the work, even when they never pick up a camera.",
              ],
            ].map(([title, copy], i) => (
              <Reveal as="li" key={title} delay={0.1 + i * 0.1}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <ScrollArtwork
          className="sp-statements-art"
          src={art("portrait/hand-mirror")}
          alt=""
          from="right"
        />
      </section>
      <section className="sp-aside-rows">
        <Lines className="sp-heading" lines={["What we", "don’t do"]} />
        <ul>
          {[
            [
              "We don’t sell an ad-making tool.",
              "We run a licensing service. During the pilot only, we can also make the ads, so brands can try the approach and we can show finished examples.",
            ],
            [
              "We don’t sell made-up AI faces.",
              "Every ad stars a real creator who confirmed it’s them and said yes.",
            ],
            [
              "No licence includes AI training.",
              "A licence never lets a brand train AI on a creator’s samples.",
            ],
          ].map(([title, copy], i) => (
            <Reveal as="li" key={title} delay={i * 0.1}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </ul>
      </section>
      <section className="sp-row sp-row-about">
        <ScrollArtwork className="sp-row-art" src={art("panels")} alt="" />
        <div className="sp-row-copy">
          <Lines className="sp-heading" lines={["We’re pre-launch."]} />
          <Reveal as="p" delay={0.15}>
            We’re interviewing creators and agencies and running our first paid
            pilots by hand, in Canada and the US. What we learn decides what we
            build next.
          </Reveal>
          <Reveal delay={0.25}>
            <TextLink href="/contact">Investor or press? Get in touch</TextLink>
          </Reveal>
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
          <Lines
            as="h1"
            className="sp-display"
            lines={["Our first campaigns,", "run by hand."]}
            onLoad
          />
          <p className="sp-lead" data-hero style={delay(0.35)}>
            We’re still building and testing the self-service platform. Our team
            handles every licence, approval and payment for a few creators and
            brands, to learn what works before we build the online service.
          </p>
          <div className="sp-actions" data-hero style={delay(0.47)}>
            <Action href="/creator-pilot">Apply as a creator</Action>
            <TextLink href="/brand-pilot">
              Brands and agencies: book a pilot call
            </TextLink>
          </div>
        </div>
        <LoadArt name="ring-light" className="sp-hero-pilot-art" from="right" />
      </section>
      <section className="sp-steps">
        <Lines
          className="sp-heading"
          lines={["Every campaign comes down to four things."]}
        />
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
              "The ad is made, then the creator reviews it. Only the version they approve can run.",
            ],
            [
              "Payment",
              "The fee is secured before production and released when the creator approves, before launch. What’s paid if a creator declines is still being set.",
            ],
          ].map(([title, copy], i) => (
            <Reveal as="li" key={title} delay={0.1 + i * 0.1}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </ol>
      </section>
      <section className="sp-ways sp-ink">
        <Reveal as="p" className="sp-audience">
          For brands and agencies
        </Reveal>
        <Lines className="sp-heading" lines={["Two ways to run a pilot."]} />
        <Reveal as="p" className="sp-lead" delay={0.15}>
          Your team can make the ads in its own tools, or during the pilot
          Semblanse can make them with you. Both routes use a campaign-specific
          creator licence and need the creator’s approval before launch.
        </Reveal>
        <div className="sp-ways-options">
          {[
            [
              "Your team makes the ads",
              "For in-house teams and agencies with their own tools. You make the ads within the agreed licence.",
            ],
            [
              "Semblanse makes the ads (pilot only)",
              "For brands that want production handled. We work with you on the brief and make the ads, during the pilot.",
            ],
          ].map(([title, copy], i) => (
            <Reveal key={title} delay={0.2 + i * 0.1}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4}>
          <TextLink href="/brands#how-a-pilot-works">
            See who does what
          </TextLink>
        </Reveal>
      </section>
      <div className="sp-body">
        <section className="sp-row">
          <ScrollArtwork className="sp-row-art" src={art("curtain")} alt="" />
          <div className="sp-row-copy">
            <Reveal as="p" className="sp-audience">
              For creators
            </Reveal>
            <Lines
              className="sp-heading"
              lines={["Creators review the ad", "instead of filming it."]}
            />
            <Reveal as="p" delay={0.15}>
              You record face, body and voice samples once, before your first
              campaign. For each campaign you tell us which of your stories fit
              and what’s off limits. When the ad is ready, approve it, ask for
              changes or decline it.
            </Reveal>
            <Reveal delay={0.25}>
              <Action href="/creator-pilot">Apply as a creator</Action>
            </Reveal>
          </div>
        </section>
        <section className="sp-row">
          <ScrollArtwork
            className="sp-row-art sp-row-art-wide"
            src={art("signature")}
            alt=""
          />
          <div className="sp-row-copy">
            <Reveal as="p" className="sp-audience">
              For brands and agencies
            </Reveal>
            <Lines
              className="sp-heading"
              lines={[
                "Real creators used in your AI ads,",
                "with their permission.",
              ]}
            />
            <Reveal as="p" delay={0.15}>
              We match creators to your brief and write up their stories and
              limits for your scriptwriters. Your team makes the ads in its own
              tools, or ours makes them with you during the pilot. Then we
              compare the results with the ad you want to beat.
            </Reveal>
            <Reveal delay={0.25}>
              <Action href="/brand-pilot">Book a pilot call</Action>
            </Reveal>
          </div>
        </section>
        <Reveal as="section" className="sp-open">
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
              "Whether a creator can insist the ad is labelled as AI-made",
              "What a pilot costs (for now, quoted per campaign)",
            ].map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </>
  );
}

export function TrustPage() {
  return (
    <>
      <SplitHero artwork="door-and-key" side="left" position={[0.42, 0.5]}>
        <Lines
          as="h1"
          className="sp-display"
          lines={["Nothing runs", "without a yes."]}
          onLoad
        />
        <p className="sp-lead" data-hero style={delay(0.35)}>
          You’re trusting us with your face and voice. Here is how we confirm
          who you are, record what you agreed to, limit what a brand can do, and
          act when something goes wrong.
        </p>
        <div className="sp-actions" data-hero style={delay(0.47)}>
          <Action href="/creator-pilot">Apply as a creator</Action>
          <TextLink href="#report">Report misuse</TextLink>
        </div>
      </SplitHero>
      <section className="sp-ledger">
        <Lines
          className="sp-heading"
          lines={["Four checks before an ad runs."]}
        />
        <div className="sp-ledger-labels" aria-hidden="true">
          <span>Check</span>
          <span>What happens</span>
          <span>What stays on record</span>
        </div>
        <ol>
          {[
            [
              "Identity",
              "You sign in with Instagram so we know the account is yours. Before your first campaign, you record short face, body and voice samples and confirm they show you.",
              "Your sign-in and your confirmation of the samples",
            ],
            [
              "Consent",
              "Every campaign gets its own signed licence. It names one brand and states where the ads can run, for how long, and what you’re paid. No licence, no ad.",
              "The signed licence",
            ],
            [
              "Limits",
              "You choose the stories you’ll share, and the brands, topics and product claims you won’t touch. Scripts use only those stories and stay within those limits.",
              "Your stories and limits, as you gave them",
            ],
            [
              "Approval",
              "You see each final version before it runs. Approve it, ask for changes or decline. Silence is never approval.",
              "Your decision on every version",
            ],
          ].map(([title, copy, record], i) => (
            <Reveal as="li" key={title} delay={i * 0.08}>
              <h3>{title}</h3>
              <p>{copy}</p>
              <p className="sp-ledger-record">
                <span>On record: </span>
                {record}
              </p>
            </Reveal>
          ))}
        </ol>
        <Reveal as="p" className="sp-ledger-note" kind="fade" delay={0.3}>
          <span className="sp-chip">Pre-launch</span>
          For now, a person at Semblanse carries out each check. We’re building
          an online account where you’ll see and do this yourself.
        </Reveal>
      </section>
      <section className="sp-never sp-ink" id="never">
        <div className="sp-never-copy">
          <Reveal as="p" className="sp-never-lead">
            A licence never lets a brand
          </Reveal>
          <ul>
            {[
              [
                "train AI on your samples.",
                "No campaign licence includes training rights.",
              ],
              [
                "use you outside the campaign.",
                "Another brand, product, channel or territory needs a new licence and a new yes.",
              ],
              [
                "run past the end date.",
                "The brand must stop running the ads when the licence ends. Renewal needs your agreement.",
              ],
              [
                "run an ad you haven’t approved.",
                "Only the version you approved can run. A changed ad needs approval again.",
              ],
              [
                "make claims you ruled out.",
                "If you ruled out a topic or a product claim, it stays out of the script.",
              ],
            ].map(([title, copy], i) => (
              <li key={title}>
                <Lines as="h3" lines={[title]} delay={i * 0.06} />
                <Reveal as="p" kind="fade" delay={0.2 + i * 0.06}>
                  {copy}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <ScrollArtwork
          className="sp-never-art"
          src={art("scissors")}
          alt=""
          from="right"
        />
      </section>
      <section className="sp-samples">
        <div>
          <Reveal as="p" className="sp-audience">
            How do advertisers use creator samples?
          </Reveal>
          <Reveal as="p" className="sp-statement" delay={0.1}>
            You record your samples once. They’re used only to make the ads for
            a campaign you’ve signed a licence for, by whoever is producing it:
            the brand’s team or ours. Nobody else gets them.
          </Reveal>
        </div>
        <Reveal as="aside" className="sp-undecided" delay={0.2}>
          <h2>Still being decided</h2>
          <p>
            We won’t ask you to record anything until these are settled and
            you’ve seen them in writing.
          </p>
          <ul>
            {[
              "How long samples are kept after a licence ends",
              "How deletion requests are confirmed",
              "Where samples are stored",
              "Which production tools are permitted",
            ].map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </Reveal>
      </section>
      <ReportForm />
    </>
  );
}

export function BrandsPage() {
  return (
    <>
      <section className="sp-picture-hero">
        <Lines
          as="h1"
          className="sp-display"
          lines={["A real creator in your AI ads."]}
          onLoad
        />
        <div>
          <LoadArt name="picture-frame" className="sp-picture-hero-art" />
          <div className="sp-picture-hero-facts">
            <div>
              <p className="sp-lead" data-hero style={delay(0.35)}>
                Semblanse is the licensing service between your team and the
                creator. Each campaign gets its own licence, the creator’s own
                stories and limits written up for your scriptwriters, and their
                approval of every final ad.
              </p>
              <div className="sp-actions" data-hero style={delay(0.47)}>
                <Action href="/brand-pilot">Book a pilot call</Action>
                <TextLink href="#how-a-pilot-works">See who does what</TextLink>
              </div>
            </div>
            <div className="sp-suits" data-hero style={delay(0.6)}>
              <h2>The pilot suits</h2>
              <ul>
                <li>Brands running creator-style ads on paid social</li>
                <li>Agencies with their own creative teams</li>
                <li>Teams new to AI ads (we can make them during the pilot)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="sp-claim">
        <Reveal as="p" className="sp-statement">
          Semblanse is the licence, not the production. You get permission to
          use a real creator for one campaign, their stories and limits to write
          from, and their sign-off on every final ad.
        </Reveal>
        <Reveal as="p" className="sp-lead" delay={0.15}>
          Normally your team makes the ads. During the pilot we can make them
          with you, so you can try the approach before setting up production,
          and so we have finished work to learn from and show.
        </Reveal>
      </section>
      <section className="sp-how" id="how-a-pilot-works">
        <Lines className="sp-heading" lines={["How a pilot works"]} />
        <Reveal as="p" className="sp-lead" delay={0.15}>
          Every pilot follows the same seven steps. The only choice is who makes
          the ads.
        </Reveal>
        <PilotSteps />
        <Reveal as="p" className="sp-how-note" kind="fade">
          On the call we discuss price, timing, review rounds and which results
          to compare. Nothing is fixed until you accept a written quote.
        </Reveal>
      </section>
      <section className="sp-closing sp-green">
        <div className="sp-closing-copy">
          <Lines
            className="sp-closing-title"
            lines={["Measured against", "your best ads."]}
          />
          <Reveal as="p" className="sp-lead" delay={0.2}>
            Before work starts we agree which ad you want to beat and which
            numbers count. The figures come from your own ad accounts.
          </Reveal>
          <Reveal className="sp-actions" delay={0.3}>
            <Action href="/brand-pilot" variant="cream">
              Book a pilot call
            </Action>
            <TextLink href="/pilot">Read the pilot overview</TextLink>
          </Reveal>
        </div>
        <ScrollArtwork
          className="sp-closing-art"
          src={art("hand-mirror")}
          alt=""
          from="right"
        />
      </section>
    </>
  );
}
