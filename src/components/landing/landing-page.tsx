"use client";
/*
THESIS: Revision 3 gives creators a clear offer, bounded rights and final approval.
OWN-WORLD: Didot, Albert Sans, ink, ivory, sage, green and lilac. Square controls.
STORY: Understand the campaign, see the process, choose a pilot enquiry.
FIRST VIEWPORT: Dark profile artwork behind a three-line title and two actions.
FORM: Preserve Figma 549:2779, with 554:2845 and 555:2910 responsive layouts.
*/
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Action, Brand, asset } from "./brand";
import { Reveal, Headline, ease } from "./motion";
import { StageCards } from "./stage-cards";
import { FAQ } from "./faq";
import { WorkspacePoster } from "./workspace-poster";

export function Navigation({ home = false }: { home?: boolean }) {
  return (
    <header className={`site-nav ${home ? "hero-nav" : ""}`}>
      <Brand light />
      <nav aria-label="Main navigation">
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#your-control">Your control</Link>
        <Link href="/#for-advertisers">For advertisers</Link>
      </nav>
      <Action href="/creator-pilot" variant="cream">
        Apply as a creator
      </Action>
    </header>
  );
}
function ProfileEchoes({ accent = false }: { accent?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const heights = [200, 260, 340, 285, 355, 270, 320, 240];
  return (
    <div
      ref={ref}
      className={accent ? "profile-accent" : "profile-stage"}
      aria-hidden="true"
    >
      <div className="profile-composition">
        {(accent ? [2, 4, 6] : heights.map((_, i) => i)).map((i) => (
          <motion.div
            key={i}
            className="profile-echo"
            style={{
              height: heights[i],
              left: accent ? [2, 4, 6].indexOf(i) * 78 : i * 107,
              top: (355 - heights[i]) / 2,
            }}
            initial={false}
            animate={seen && !reduce ? { x: [(3.5 - i) * 75, 0] } : { x: 0 }}
            transition={{ duration: 1.5, delay: 0.04 * Math.abs(i - 4), ease }}
          >
            <img
              alt=""
              src={asset(
                `549:2817/imgProfileEcho${i + 1}` as Parameters<
                  typeof asset
                >[0],
              )}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
function Inputs() {
  const heights = [12, 26, 18, 44, 58, 34, 22, 48, 62, 40, 18, 30, 50, 28, 14];
  const reduce = useReducedMotion();
  return (
    <section className="inputs-section" id="your-input">
      <div className="input-intro">
        <h2>
          What we need
          <br />
          from you
        </h2>
        <p>
          Samples are recorded once. Stories and limits are updated for each
          campaign. No brand can use your likeness until you accept its offer.
        </p>
      </div>
      <div className="inputs-list">
        <Reveal className="input-row">
          <div className="identity-art">
            <div className="face-sample">
              <img
                src={asset("549:2973/imgSemblanseFaceArtwork")}
                alt="Semblanse profile artwork"
              />
              <span>Face</span>
            </div>
            <div className="voice-sample">
              <span>Voice</span>
              <div className="waveform" aria-hidden="true">
                {heights.map((h, i) => (
                  <motion.i
                    key={i}
                    style={{ height: h }}
                    initial={false}
                    whileInView={
                      reduce ? undefined : { scaleY: [0.4, 1, 0.65, 1] }
                    }
                    viewport={{ once: true }}
                    transition={{ duration: 1.3, delay: i * 0.04, ease }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="input-copy">
            <h3>Verify it’s you</h3>
            <p>
              Record face, body and voice samples once, and confirm they’re
              yours.
            </p>
          </div>
        </Reveal>
        <Reveal className="input-row" delay={0.12}>
          <blockquote className="context-art">
            “My morning routine
            <br />
            always starts with...”
          </blockquote>
          <div className="input-copy">
            <h3>Share your stories</h3>
            <p>Tell us your stories, what you know, and how you talk.</p>
          </div>
        </Reveal>
        <Reveal className="input-row" delay={0.24}>
          <div className="boundary-art">
            <div>
              <span className="boundary-icon">✓</span>
              <p>
                <small>Allowed</small>Personal experience
              </p>
            </div>
            <div>
              <span className="boundary-icon off">×</span>
              <p>
                <small>Off limits</small>Medical or injury claims
              </p>
            </div>
          </div>
          <div className="input-copy">
            <h3>Set your boundaries</h3>
            <p>Choose the brands, claims and topics you’ll never touch.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
function Licence() {
  return (
    <section className="control-section section-pad" id="your-control">
      <div className="control-grid">
        <div>
          <h2>
            Your likeness,
            <br />
            your terms.
          </h2>
          <p className="control-lead">
            Every campaign gets its own licence. It sets what a brand can use,
            where it can run, and when permission ends.
          </p>
          <div className="commitments">
            {[
              [
                "Used only for the campaign.",
                "Your samples go only to the licensed brand, for that campaign.",
              ],
              [
                "No training rights.",
                "A campaign licence never includes permission to train AI on your samples.",
              ],
              [
                "Campaign use ends at expiry.",
                "The brand must stop running the ads when the licence ends. Renewal needs your yes.",
              ],
            ].map(([title, copy]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <Reveal className="licence-stage" kind="wipe">
          <article className="licence">
            <div className="licence-brand">
              <img src={asset("549:3037/imgImage3")} alt="" />
              <span>semblanse</span>
            </div>
            <h3>Campaign licence</h3>
            <hr />
            {[
              ["BRAND + CAMPAIGN", "Alto Running · Morning miles"],
              ["CHANNELS + TERRITORY", "Instagram + Facebook · Canada"],
              ["TERM + FEE", "30 days · $1,200 creator fee"],
              [
                "VERSIONS + REVIEW",
                "1 video · 30s vertical · you approve the final version",
              ],
            ].map(([label, value], i) => (
              <motion.div
                className="licence-field"
                key={label}
                initial={false}
                whileInView={{
                  outlineColor: ["#1f6f2200", "#1f6f2288", "#1f6f2200"],
                }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, delay: 0.5 + i * 0.15 }}
              >
                <small>{label}</small>
                <p>{value}</p>
              </motion.div>
            ))}
            <div className="licence-field">
              <small>CREATIVE LIMITS</small>
              <p>
                ✓ Everyday running story
                <br />× Injury or performance claims
                <br />× Reuse outside this campaign
              </p>
            </div>
            <strong className="licence-signoff">
              Your final approval is required
            </strong>
            <p className="licence-note">
              Example terms. Each campaign has its own agreement.
            </p>
          </article>
        </Reveal>
      </div>
      <Reveal className="record-banner">
        <h3>
          Every use is
          <br />
          on record.
        </h3>
        <p>
          Each licence is signed and tracked, and its terms make breaking it
          costly for the brand.
        </p>
      </Reveal>
    </section>
  );
}
function Advertisers() {
  return (
    <section className="advertiser-section" id="for-advertisers">
      <div className="advertiser-art">
        <Reveal kind="wipe">
          <img
            src={asset("brand-dither")}
            alt="Illustrated creator recording an ad on a phone"
            className="brand-artwork"
          />
        </Reveal>
        <h3>
          You make the ads.
          <br />
          We clear the rights.
        </h3>
      </div>
      <div className="advertiser-copy">
        <p className="eyebrow">FOR BRANDS &amp; CREATIVE AGENCIES</p>
        <h2>
          Real creators
          <br />
          in your AI ads.
        </h2>
        <div className="bring-grid">
          {[
            {
              title: "You bring.",
              items: [
                "The product and the brief",
                "Your team and your production tools",
                "Your ad accounts",
              ],
            },
            {
              title: "We bring.",
              items: [
                "Creators matched to your brief",
                "Their stories and limits, ready to script",
                "A signed licence, and the creator’s approval on every final ad",
              ],
            },
          ].map(({ title, items }) => (
            <div key={title}>
              <h3>{title}</h3>
              {items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          ))}
        </div>
        <p>
          Build AI ads around a real creator’s experience, voice and point of
          view. For our first paid pilots, we agree the production setup,
          versions, review process and price before work starts, and what to
          test against your current ads.
        </p>
        <div className="advertiser-action">
          <Action href="/brand-pilot">Book a pilot call</Action>
          <small>Scope and pricing agreed on the call</small>
        </div>
      </div>
    </section>
  );
}
function ProductDemo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / 1312),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <Reveal className="workspace-video" kind="scale">
        <div ref={ref} className="workspace-viewport">
          <div
            className="workspace-native"
            style={{ transform: `scale(${scale})` }}
            aria-hidden="true"
            inert
          >
            <WorkspacePoster />
          </div>
          <div className="workspace-shade" />
          <Button
            variant="cream"
            className="play-demo"
            onClick={() => setOpen(true)}
            aria-label="Play creator workspace demo"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4v16l14-8Z" fill="currentColor" />
            </svg>
          </Button>
          <span className="preview-label">Product demo · example data</span>
        </div>
      </Reveal>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="demo-dialog">
          <DialogTitle>Creator workspace · product preview</DialogTitle>
          <DialogDescription>
            Example campaigns and figures. The workspace is in development.
          </DialogDescription>
          {open && (
            <video
              controls
              autoPlay
              playsInline
              preload="metadata"
              src="/media/creator-demo.mp4"
              aria-label="Semblanse creator workspace demonstration"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-navigation">
        <div className="footer-purpose">
          <Brand markOnly />
          <p>
            Creator likeness.
            <br />
            Licensed by campaign.
          </p>
          <small>
            The permission layer for AI ads with real creators. Starting with
            paid social, one campaign at a time.
          </small>
        </div>
        {[
          {
            title: "Explore",
            links: [
              ["How it works", "/#how-it-works"],
              ["Your control", "/#your-control"],
              ["Creator workspace", "/#workspace"],
              ["Questions", "/#questions"],
            ],
          },
          {
            title: "Get involved",
            links: [
              ["Apply as a creator", "/creator-pilot"],
              ["Book a pilot call", "/brand-pilot"],
              ["Pilot overview", "/pilot"],
            ],
          },
          {
            title: "Company",
            links: [
              ["About Semblanse", "/about"],
              ["Contact", "/contact"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
            ],
          },
        ].map((group) => (
          <div className="footer-links" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map(([text, href]) => (
              <Link href={href} key={text}>
                {text}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <p className="copyright">© 2026 Semblanse. All rights reserved.</p>
      <div className="footer-wordmark" aria-label="Semblanse">
        <Reveal>
          <img src={asset("footer-dither")} alt="" loading="lazy" />
        </Reveal>
      </div>
    </footer>
  );
}
export function LandingPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main">
        <section className="hero" id="top">
          <Reveal className="hero-art" kind="scale">
            <picture>
              <source
                media="(max-width: 1023px)"
                srcSet={asset("554:2846/imgImage2")}
              />
              <img src={asset("hero-dither")} alt="" fetchPriority="high" />
            </picture>
          </Reveal>
          <Navigation home />
          <div className="hero-content">
            <p className="eyebrow desktop-eyebrow">
              LICENSED AI ADS STARRING REAL CREATORS · NOW RECRUITING FOR OUR
              FIRST PAID CAMPAIGNS
            </p>
            <p className="eyebrow mobile-eyebrow">
              LICENSED AI ADS STARRING REAL CREATORS · NOW RECRUITING
            </p>
            <Headline
              className="hero-title desktop-title"
              lines={["Get paid for ads", "you never had", "to film."]}
              hero
            />
            <h1 className="hero-title mobile-title">
              Get paid for ads you never had to film.
            </h1>
            <Reveal delay={0.2}>
              <p className="hero-description">
                License your likeness to one brand, for one campaign. Their team
                makes the ads with an AI version of you. Only the ad you approve
                can run, and you’re paid when you approve it.
              </p>
            </Reveal>
            <Reveal className="hero-actions" delay={0.3}>
              <Action href="/creator-pilot">Apply as a creator</Action>
              <Action href="/brand-pilot" variant="secondary">
                <span className="desktop-action-label">
                  Advertisers: license creators for AI ads →
                </span>
                <span className="mobile-action-label">
                  Advertisers: license creators →
                </span>
              </Action>
            </Reveal>
            <p className="hero-note">
              Signing up grants no rights to your likeness. Posting to your own
              audience is optional.
            </p>
            <p className="hero-note">
              Applying takes a few minutes. You join our waitlist, and we’ll
              reach out when a campaign fits you.
            </p>
          </div>
        </section>
        <section className="stories section-pad">
          <h2>Your stories. Fewer shoots.</h2>
          <ProfileEchoes />
          <div className="story-hooks">
            <p>“My morning routine.”</p>
            <p>“What comes on the trail.”</p>
          </div>
          <p className="stories-description">
            Record your samples once. For each campaign, share the stories and
            limits that fit the brand. Their team makes a set number of
            versions, agreed in your licence, and you review them instead of
            shooting them.
          </p>
        </section>
        <section className="process section-pad" id="how-it-works">
          <h2>How it works</h2>
          <p className="section-lead">
            Agree on the offer. Share your stories. Approve the ad. Get paid.
            See what ran.
          </p>
          <StageCards />
          <small className="process-note">Example campaign and fee.</small>
        </section>
        <Inputs />
        <Licence />
        <Advertisers />
        <section className="workspace section-pad" id="workspace">
          <p className="workspace-eyebrow">PRODUCT PREVIEW · IN DEVELOPMENT</p>
          <h2>
            Offers, approvals and
            <br className="desktop-break" /> payments in one place.
          </h2>
          <p className="section-lead">
            A preview of the creator workspace we’re building. It’s in
            development, and every campaign and number shown is an example.
          </p>
          <ProductDemo />
          <Action href="/creator-pilot" variant="cream">
            Apply as a creator
          </Action>
        </section>
        <aside className="status-strip">
          <span>PRE-LAUNCH</span>
          <p>
            We’re interviewing creators and agencies now for our first paid
            pilots.
          </p>
        </aside>
        <section className="questions" id="questions">
          <div className="questions-poster">
            <h2>
              Before
              <br className="desktop-break" /> you join.
            </h2>
            <p>
              Straight answers for creators and brands. Pick your side, and ask
              us anything else.
            </p>
            <ProfileEchoes accent />
          </div>
          <div className="answers">
            <FAQ />
          </div>
        </section>
        <section className="closing" id="join">
          <div className="closing-copy">
            <Reveal>
              <h2>
                Make room for
                <br />
                another brand deal.
              </h2>
            </Reveal>
            <p>
              Creators: join our first paid campaigns.
              <br />
              Agencies: test licensed creators against your current best ads.
            </p>
            <div className="closing-actions">
              <Action href="/creator-pilot" variant="cream">
                Apply as a creator
              </Action>
              <Action href="/brand-pilot" variant="secondary">
                Book a pilot call
              </Action>
            </div>
            <small>
              Campaign fit, rights and payment are agreed before you take part.
            </small>
          </div>
          <Reveal className="closing-art" kind="wipe">
            <img
              src={asset("closing-dither")}
              alt="Illustrated creator in a lilac cap"
              loading="lazy"
            />
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
