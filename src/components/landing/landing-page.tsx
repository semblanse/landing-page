"use client";
/*
THESIS: Revision 3 gives creators a clear offer, bounded rights and final approval.
OWN-WORLD: Didot, Albert Sans, ink, ivory, sage, green and lilac. Square controls.
STORY: Understand the campaign, see the process, choose a pilot enquiry.
FIRST VIEWPORT: Dark profile artwork behind a three-line title and two actions.
FORM: Preserve Figma 549:2779, with 554:2845 and 555:2910 responsive layouts.
*/
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Maximize } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Action, Brand, asset } from "./brand";
import { Lines, Reveal, useMediaQuery, useScrollProgress } from "./motion";
import { DitherImage, heroDither } from "./dither";
import { StageCards } from "./stage-cards";
import { FAQ } from "./faq";

type NavMenu = {
  label: string;
  links: [title: string, about: string, href: string][];
  action?: [label: string, href: string];
};

// Every page and landing section a visitor can reach, grouped by who it is
// for (Figma 644:2487).
const menus: NavMenu[] = [
  {
    label: "For creators",
    links: [
      [
        "How it works",
        "Offer, stories, approval and payment",
        "/#how-it-works",
      ],
      [
        "Your control",
        "What a licence allows, and what it never does",
        "/#your-control",
      ],
      ["Creator workspace", "A preview of what we’re building", "/#workspace"],
      ["Trust & Safety", "How we protect your face and voice", "/trust"],
    ],
    action: ["Apply as a creator", "/creator-pilot"],
  },
  {
    label: "For brands",
    links: [
      [
        "For brands and agencies",
        "What Semblanse is, and who the pilot suits",
        "/brands",
      ],
      [
        "How a pilot works",
        "Seven steps, and who makes the ads",
        "/brands#how-a-pilot-works",
      ],
      ["Pilot overview", "Our first campaigns, run by hand", "/pilot"],
    ],
    action: ["Book a pilot call", "/brand-pilot"],
  },
  {
    label: "Company",
    links: [
      ["About", "What we believe, and where we are", "/about"],
      [
        "Trust & Safety",
        "The checks before an ad runs, and how to report misuse",
        "/trust",
      ],
      ["Questions", "Answers for creators and brands", "/#questions"],
      ["Careers", "Open roles, and how to apply", "/careers"],
      ["Contact", "Send us a note", "/contact"],
    ],
  },
];
const legal = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
];

export function Navigation({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  // The dropdown showing on a wide screen, and the group open in the phone menu.
  const [menu, setMenu] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(menus[0].label);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (Math.abs(y - previous) < 4) return;
    setHidden(y > previous && y > 240 && !open && !menu);
  });
  // The open phone menu fills the screen, so the page behind stays put.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("menu-open");
    return () => root.classList.remove("menu-open");
  }, [open]);
  // A dropdown closes when the visitor presses anywhere outside it.
  useEffect(() => {
    if (!menu) return;
    const close = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menu]);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      render={
        <header
          className={`site-nav ${home ? "hero-nav" : ""}`}
          data-hidden={hidden || undefined}
          data-menu-open={open || undefined}
        />
      }
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        if (menu) {
          nav.current
            ?.querySelector<HTMLElement>(`[aria-expanded="true"]`)
            ?.focus();
          setMenu(null);
        } else if (open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <Brand light />
      <nav
        ref={nav}
        aria-label="Main navigation"
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setMenu(null);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setMenu(null);
        }}
      >
        {menus.map(({ label, links, action }, n) => {
          const shown = menu === label;
          return (
            <div
              className="nav-menu"
              key={label}
              data-open={shown || undefined}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setMenu(label);
              }}
            >
              <button
                type="button"
                aria-expanded={shown}
                aria-controls={`nav-menu-${n}`}
                onClick={() => setMenu(shown ? null : label)}
              >
                {label}
                <ChevronDown aria-hidden="true" />
              </button>
              <div className="nav-dropdown" id={`nav-menu-${n}`}>
                <div onClick={() => setMenu(null)}>
                  {links.map(([title, about, href], i) => (
                    <Link
                      href={href}
                      key={title}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <strong>{title}</strong>
                      <span>{about}</span>
                    </Link>
                  ))}
                  {action && (
                    <Link
                      href={action[1]}
                      className="nav-dropdown-action"
                      style={{ "--i": links.length } as React.CSSProperties}
                    >
                      {action[0]} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                  {!action && (
                    <p
                      className="nav-dropdown-legal"
                      style={{ "--i": links.length } as React.CSSProperties}
                    >
                      {legal.map(([text, href]) => (
                        <Link href={href} key={text}>
                          {text}
                        </Link>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
      <Action
        href="/creator-pilot"
        variant="cream"
        className="desktop-creator-action"
      >
        Apply as a creator
      </Action>
      <CollapsibleTrigger
        ref={toggle}
        render={<Button variant="ghost" size="icon" className="menu-toggle" />}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X /> : <Menu />}
      </CollapsibleTrigger>
      <CollapsibleContent className="mobile-menu">
        <div className="mobile-menu-inner" data-lenis-prevent>
          <nav aria-label="Mobile navigation">
            {menus.map(({ label, links }, n) => {
              const shown = group === label;
              return (
                <div
                  className="mobile-group"
                  key={label}
                  data-open={shown || undefined}
                >
                  <button
                    type="button"
                    aria-expanded={shown}
                    aria-controls={`mobile-group-${n}`}
                    onClick={() => setGroup(shown ? null : label)}
                  >
                    {label}
                    <ChevronDown aria-hidden="true" />
                  </button>
                  {/* Closed groups stay in the page for the height
                      transition, so they are made inert. */}
                  <div id={`mobile-group-${n}`} inert={!shown}>
                    <div onClick={() => setOpen(false)}>
                      {links.map(([title, , href]) => (
                        <Link href={href} key={title}>
                          {title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <p className="mobile-legal" onClick={() => setOpen(false)}>
              {legal.map(([text, href]) => (
                <Link href={href} key={text}>
                  {text}
                </Link>
              ))}
            </p>
          </nav>
          <div className="mobile-menu-actions" onClick={() => setOpen(false)}>
            <Action href="/creator-pilot">Apply as a creator</Action>
            <Action href="/brand-pilot" variant="cream">
              Book a pilot call
            </Action>
            <p className="mobile-menu-notice">
              Applying grants no rights to your likeness.
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
// Where each profile starts before the row spreads, from Figma 495:1423.
const echoOffsets = [472.6, 348.4, 218.3, 127.2, 0, -82.5, -203.9, -287.9];
const echoHeights = [200, 260, 340, 285, 355, 270, 320, 240];
function ProfileEcho({
  index,
  left,
  spread,
}: {
  index: number;
  left: number;
  spread?: ReturnType<typeof useScrollProgress>;
}) {
  const still = useMotionValue(1);
  const progress = spread?.progress ?? still;
  // Outer profiles start later, so the row opens from the centre.
  const start = Math.abs(index - 4) * 0.045;
  const x = useTransform(
    progress,
    [start, start + 0.7],
    [echoOffsets[index], 0],
  );
  const scale = useTransform(progress, [start, start + 0.7], [0.78, 1]);
  const opacity = useTransform(progress, [start, start + 0.3], [0, 1]);
  return (
    <motion.div
      className="profile-echo"
      style={{
        height: echoHeights[index],
        left,
        top: (355 - echoHeights[index]) / 2,
        ...(spread?.enabled ? { x, scale, opacity } : null),
      }}
    >
      <img
        alt=""
        src={asset(
          `549:2817/imgProfileEcho${index + 1}` as Parameters<typeof asset>[0],
        )}
      />
    </motion.div>
  );
}
function ProfileEchoes() {
  const ref = useRef<HTMLDivElement>(null);
  const spread = useScrollProgress(ref, ["start 0.95", "center 0.55"]);
  return (
    <div ref={ref} className="profile-stage" aria-hidden="true">
      <div className="profile-composition">
        {echoHeights.map((_, i) => (
          <ProfileEcho key={i} index={i} left={i * 107} spread={spread} />
        ))}
      </div>
    </div>
  );
}
function ProfileAccent() {
  return (
    <Reveal className="profile-accent" aria-hidden="true">
      <div className="profile-composition">
        {[2, 4, 6].map((index, i) => (
          <ProfileEcho key={index} index={index} left={i * 78} />
        ))}
      </div>
    </Reveal>
  );
}
function Inputs() {
  const heights = [12, 26, 18, 44, 58, 34, 22, 48, 62, 40, 18, 30, 50, 28, 14];
  return (
    <section className="inputs-section" id="your-input">
      <div className="input-intro">
        <Lines lines={["What we need", "from you"]} />
        <Reveal as="p" delay={0.15}>
          Samples are recorded once. Stories and limits are updated for each
          campaign. No brand can use your likeness until you accept its offer.
        </Reveal>
      </div>
      <div className="inputs-list">
        <Reveal className="input-row">
          <div className="identity-art">
            <div className="face-sample">
              <img
                src="/figma/source/hero.webp"
                alt="Semblanse profile artwork"
                loading="lazy"
              />
              <span>Face</span>
            </div>
            <div className="voice-sample">
              <span>Voice</span>
              <div className="waveform" aria-hidden="true">
                {heights.map((h, i) => (
                  <i
                    key={i}
                    style={
                      {
                        height: h,
                        "--i": i,
                        "--dip": 0.35 + ((i * 7) % 5) * 0.16,
                      } as React.CSSProperties
                    }
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
          <Lines
            as="blockquote"
            className="context-art lines-keep"
            delay={0.3}
            lines={["“My morning routine", "always starts with...”"]}
          />
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
          <Lines
            className="lines-keep"
            lines={["Your likeness,", "your terms."]}
          />
          <Reveal as="p" className="control-lead" delay={0.15}>
            Every campaign gets its own licence. It sets what a brand can use,
            where it can run, and when permission ends.
          </Reveal>
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
            ].map(([title, copy], i) => (
              <Reveal key={title} delay={0.2 + i * 0.1}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
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
              <div
                className="licence-field"
                key={label}
                data-focus={i < 3 || undefined}
                style={{ "--i": i } as React.CSSProperties}
              >
                <small>{label}</small>
                <p>{value}</p>
              </div>
            ))}
            <div className="licence-field">
              <small>CREATIVE LIMITS</small>
              <p>
                ✓ Everyday running story <br />× Injury or performance claims{" "}
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
          Every use is <br />
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
/**
 * Artwork that opens behind a straight edge as it scrolls into view, while
 * the image inside settles from a slight zoom and its dither grain resolves.
 */
/** Artwork that opens behind a straight edge and settles as it scrolls in. */
export function ScrollArtwork({
  className,
  from = "left",
  ...image
}: {
  className: string;
  from?: "left" | "right";
} & Pick<
  React.ComponentProps<typeof DitherImage>,
  "src" | "alt" | "position" | "flipX"
>) {
  const ref = useRef<HTMLDivElement>(null);
  const { progress, enabled } = useScrollProgress(ref, [
    "start 0.95",
    "start 0.3",
  ]);
  const clipPath = useTransform(progress, [0, 0.85], [100, 0], {
    clamp: true,
  });
  const inset = useTransform(clipPath, (v) =>
    from === "left" ? `inset(0 ${v}% 0 0)` : `inset(0 0 0 ${v}%)`,
  );
  const scale = useTransform(progress, [0, 1], [1.14, 1]);
  const coarse = useTransform(progress, [0, 0.7], [4, 1], { clamp: true });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { clipPath: inset } : undefined}
    >
      <motion.div className="art-zoom" style={enabled ? { scale } : undefined}>
        <DitherImage {...image} coarse={enabled ? coarse : undefined} />
      </motion.div>
    </motion.div>
  );
}
function Advertisers() {
  return (
    <section className="advertiser-section" id="for-advertisers">
      <div className="advertiser-art">
        <ScrollArtwork
          className="brand-artwork"
          src="/figma/source/creator-recording.webp"
          alt="Illustrated creator recording an ad on a phone"
        />
        <Lines
          as="h3"
          className="lines-keep"
          lines={["You make the ads.", "We clear the rights."]}
        />
      </div>
      <div className="advertiser-copy">
        <Reveal as="p" className="eyebrow">
          FOR BRANDS &amp; CREATIVE AGENCIES
        </Reveal>
        <Lines
          className="lines-keep"
          lines={["Real creators", "in your AI ads."]}
          delay={0.05}
        />
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
          ].map(({ title, items }, i) => (
            <Reveal key={title} delay={0.15 + i * 0.1}>
              <h3>{title}</h3>
              {items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </Reveal>
          ))}
        </div>
        <Reveal as="p" delay={0.3}>
          Build AI ads around a real creator’s experience, voice and point of
          view. For our first paid pilots, we agree the production setup,
          versions, review process and price before work starts, and what to
          test against your current ads.
        </Reveal>
        <Reveal className="advertiser-action" delay={0.38}>
          <Action href="/brand-pilot">Book a pilot call</Action>
          <small>Scope and pricing agreed on the call</small>
        </Reveal>
      </div>
    </section>
  );
}
function ProductDemo() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(frame, { amount: 0.4 });
  const [expanded, setExpanded] = useState(false);
  // Once the visitor pauses, scrolling back must not restart the demo.
  const pausedByVisitor = useRef(false);
  useEffect(() => {
    const player = video.current;
    if (!player) return;
    if (inView && !pausedByVisitor.current && !reduce) {
      player.muted = true;
      void player.play().catch(() => undefined);
    } else {
      player.pause();
    }
  }, [inView, reduce]);
  useEffect(() => {
    if (!expanded) return;
    const previousFocus = document.activeElement;
    frame.current?.querySelector<HTMLButtonElement>(".demo-exit")?.focus();
    const exit = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", exit);
    return () => {
      window.removeEventListener("keydown", exit);
      if (previousFocus instanceof HTMLElement)
        previousFocus.focus({ preventScroll: true });
    };
  }, [expanded]);
  async function fullscreen() {
    const player = video.current as
      (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!player) return;
    try {
      if (player.requestFullscreen) await player.requestFullscreen();
      else if (player.webkitEnterFullscreen) player.webkitEnterFullscreen();
      else throw new Error("Fullscreen is unavailable");
    } catch {
      // Embedded browsers may block native fullscreen. Fill their viewport.
      setExpanded(true);
    }
  }
  // The frame grows to full size as it scrolls into view.
  const grow = useScrollProgress(frame, ["start 0.98", "start 0.35"]);
  const scale = useTransform(grow.progress, [0, 1], [0.9, 1]);
  return (
    <div className="workspace-video">
      <motion.div
        ref={frame}
        className="workspace-viewport"
        data-expanded={expanded || undefined}
        data-lenis-prevent={expanded || undefined}
        style={grow.enabled && !expanded ? { scale } : undefined}
      >
        <video
          ref={video}
          className="workspace-player"
          controls
          tabIndex={0}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/creator-demo-poster.jpg"
          src="/media/creator-demo.mp4"
          aria-label="Semblanse creator workspace demonstration"
          onPlay={() => {
            pausedByVisitor.current = false;
          }}
          onPause={() => {
            if (inView) pausedByVisitor.current = true;
          }}
        />
        {expanded && (
          <Button
            variant="cream"
            className="demo-exit fullscreen-demo"
            onClick={() => setExpanded(false)}
          >
            <X aria-hidden="true" /> Exit fullscreen
          </Button>
        )}
      </motion.div>
      <div className="preview-meta">
        <p className="preview-label">Product preview · example data</p>
        <Button
          variant="cream"
          className="fullscreen-demo"
          onClick={fullscreen}
        >
          <Maximize aria-hidden="true" /> Fullscreen demo
        </Button>
      </div>
    </div>
  );
}
export function Footer({ ink = false }: { ink?: boolean }) {
  const wordmark = useRef<HTMLDivElement>(null);
  // The wordmark rises into its cropped position as the page ends.
  const rise = useScrollProgress(wordmark, ["start end", "end end"]);
  const y = useTransform(rise.progress, [0, 1], ["70%", "0%"]);
  return (
    <footer className={`site-footer ${ink ? "site-footer-ink" : ""}`}>
      <div className="footer-navigation">
        <div className="footer-purpose">
          <Brand markOnly light={ink} />
          <p>
            Creator likeness. <br />
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
              ["For brands and agencies", "/brands"],
              ["Book a pilot call", "/brand-pilot"],
              ["Pilot overview", "/pilot"],
            ],
          },
          {
            title: "Company",
            links: [
              ["About", "/about"],
              ["Careers", "/careers"],
              ["Contact", "/contact"],
              ["Trust & Safety", "/trust"],
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
      <div ref={wordmark} className="footer-wordmark" aria-hidden="true">
        <motion.div style={rise.enabled ? { y } : undefined}>
          <span>semblanse</span>
        </motion.div>
      </div>
    </footer>
  );
}
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { progress, enabled } = useScrollProgress(ref, [
    "start start",
    "end start",
  ]);
  // The artwork trails the page and the copy leaves a little ahead of it.
  const artY = useTransform(progress, [0, 1], ["0%", "18%"]);
  const artScale = useTransform(progress, [0, 1], [1, 1.08]);
  const copyY = useTransform(progress, [0, 1], [0, -70]);
  const copyOpacity = useTransform(progress, [0.25, 0.85], [1, 0]);
  // Wide screens anchor the artwork top left, as in Figma. Narrow screens
  // crop in close, so they centre on the profile instead.
  const narrow = useMediaQuery("(max-width: 1023px)");
  const delay = (seconds: number) =>
    ({ "--d": `${seconds}s` }) as React.CSSProperties;
  return (
    <section ref={ref} className="hero" id="top">
      <motion.div
        className="hero-art"
        style={enabled ? { y: artY, scale: artScale } : undefined}
      >
        <DitherImage
          src="/figma/source/hero.webp"
          alt=""
          position={narrow ? [0.62, 0.4] : [0, 0]}
          settings={heroDither}
          priority
          intro
        />
      </motion.div>
      <Navigation home />
      <motion.div
        className="hero-content"
        style={enabled ? { y: copyY, opacity: copyOpacity } : undefined}
      >
        <p className="eyebrow" data-hero style={delay(0)}>
          LICENSED AI ADS STARRING REAL CREATORS · NOW RECRUITING
          <span className="desktop-only"> FOR OUR FIRST PAID CAMPAIGNS</span>
        </p>
        <Lines
          as="h1"
          className="hero-title"
          lines={["Get paid for ads", "you never had", "to film."]}
          delay={0.08}
          onLoad
        />
        <p className="hero-description" data-hero style={delay(0.5)}>
          License your likeness to one brand, for one campaign. Their team makes
          the ads with an AI version of you. Only the ad you approve can run,
          and you’re paid when you approve it.
        </p>
        <div className="hero-actions" data-hero style={delay(0.62)}>
          <Action href="/creator-pilot">Apply as a creator</Action>
          <Action href="/brand-pilot" variant="secondary">
            <span>
              Advertisers: license creators
              <span className="desktop-only"> for AI ads</span> →
            </span>
          </Action>
        </div>
        <div className="hero-notes" data-hero style={delay(0.74)}>
          <p>
            Signing up grants no rights to your likeness. Posting to your own
            audience is optional.
          </p>
          <p>
            Applying takes a few minutes. You join our waitlist, and we’ll reach
            out when a campaign fits you.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
export function LandingPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main">
        <Hero />
        <section className="stories section-pad">
          <Lines
            className="lines-inline"
            lines={["Your stories.", "Fewer shoots."]}
          />
          <ProfileEchoes />
          <Reveal className="story-hooks" kind="fade">
            <p>“My morning routine.”</p>
            <p>“What comes on the trail.”</p>
          </Reveal>
          <Reveal as="p" className="stories-description">
            Record your samples once. For each campaign, share the stories and
            limits that fit the brand. Their team makes a set number of
            versions, agreed in your licence, and you review them instead of
            shooting them.
          </Reveal>
        </section>
        <section className="process section-pad" id="how-it-works">
          <div className="process-head">
            <Lines lines={["How it works"]} />
            <Reveal as="p" className="section-lead" delay={0.12}>
              Agree on the offer. Share your stories. Approve the ad. Get paid.
              See what ran.
            </Reveal>
          </div>
          <StageCards />
          <small className="process-note">Example campaign and fee.</small>
        </section>
        <Inputs />
        <Licence />
        <Advertisers />
        <section className="workspace section-pad" id="workspace">
          <Reveal as="p" className="workspace-eyebrow eyebrow">
            PRODUCT PREVIEW · IN DEVELOPMENT
          </Reveal>
          <Lines lines={["Offers, approvals and", "payments in one place."]} />
          <Reveal as="p" className="section-lead" delay={0.15}>
            A preview of the creator workspace we’re building. It’s in
            development, and every campaign and number shown is an example.
          </Reveal>
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
            <Lines lines={["Before", "you join."]} />
            <Reveal as="p" delay={0.15}>
              Straight answers for creators and brands. Pick your side, and ask
              us anything else.
            </Reveal>
            <ProfileAccent />
          </div>
          <div className="answers">
            <FAQ />
          </div>
        </section>
        <section className="closing" id="join">
          <div className="closing-copy">
            <Lines lines={["Make room for", "another brand deal."]} />
            <Reveal as="p" delay={0.2}>
              Creators: join our first paid campaigns. <br />
              Agencies: test licensed creators against your current best ads.
            </Reveal>
            <Reveal className="closing-actions" delay={0.3}>
              <Action href="/creator-pilot" variant="cream">
                Apply as a creator
              </Action>
              <Action href="/brand-pilot" variant="secondary">
                Book a pilot call
              </Action>
            </Reveal>
            <Reveal as="small" kind="fade" delay={0.4}>
              Campaign fit, rights and payment are agreed before you take part.
            </Reveal>
          </div>
          <ScrollArtwork
            className="closing-art"
            from="right"
            src="/figma/source/cap-scene.webp"
            alt="Illustrated creator in a lilac cap"
            flipX
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
