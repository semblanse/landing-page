"use client";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { asset } from "./brand";
import {
  Reveal,
  useMediaQuery,
  useScrollProgress,
  useSmallViewportHeight,
} from "./motion";
function ExampleAction({
  children,
  secondary = false,
}: {
  children: React.ReactNode;
  secondary?: boolean;
}) {
  const [clicked, setClicked] = useState(false);
  return (
    <Button
      size="sm"
      variant={secondary ? "outline" : "default"}
      onClick={() => setClicked(!clicked)}
      className="example-action"
      aria-pressed={clicked}
    >
      {clicked ? "Example only · reset" : children}
    </Button>
  );
}
const stages = ["Offer", "Stories", "Approval", "Payment", "Launch"];
/** A card that takes focus when the progress line reaches it. */
function FocusCard({
  index,
  progress,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const at = index / stages.length;
  const opacity = useTransform(progress, [at - 0.04, at + 0.1], [0.45, 1]);
  const y = useTransform(progress, [at - 0.04, at + 0.16], [18, 0]);
  return (
    <motion.article
      className="stage-card"
      style={{ opacity, y }}
      aria-label={`Stage ${index + 1}: ${stages[index]}`}
    >
      {children}
    </motion.article>
  );
}
// How much of a covered card stays in view: its top padding and its label.
const TAB = 38;
/**
 * A phone card in the scroll stack. Each card pins one tab lower than the
 * one before, so the labels of every earlier card stay in view as a pile.
 * Pressing a covered card's tab scrolls back to it.
 */
function StackCard({
  index,
  self,
  onOpen,
  children,
}: {
  index: number;
  self: RefObject<HTMLElement | null>;
  onOpen: (index: number) => void;
  children: React.ReactNode;
}) {
  return (
    <article
      ref={self}
      className="stage-card"
      style={{ "--i": index } as React.CSSProperties}
      aria-label={`Stage ${index + 1}: ${stages[index]}`}
    >
      {children}
      <button
        type="button"
        className="stage-tab"
        onClick={() => onOpen(index)}
        aria-label={`Back to stage ${index + 1}: ${stages[index]}`}
      />
    </article>
  );
}
export function StageCards() {
  const flow = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const cardRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];
  // On phones the cards form a scroll stack, each sliding over the last.
  // Very short screens cannot fit the heading, the tabs and a whole card,
  // so they keep the plain list. The height is measured with the browser's
  // toolbars showing: a phone reports much less than its screen height.
  const narrow = useMediaQuery("(max-width: 599px)");
  const viewportHeight = useSmallViewportHeight();
  const phone = narrow && viewportHeight >= 620;
  // On desktop the five cards sit in one row and scroll draws the progress
  // line across them. Stacked layouts reveal each card as it arrives.
  const row = useMediaQuery("(min-width: 1024px)");
  const { progress, enabled } = useScrollProgress(grid, [
    "start 0.85",
    "start 0.32",
  ]);
  const cards = [
    <>
      <span className="card-label">Offer</span>
      <h3 className="card-price">$1,200</h3>
      <p className="card-muted">Example creator fee</p>
      <hr />
      <p className="card-small">
        Instagram + Facebook <br />
        Canada · 30 days
      </p>
      <div className="card-actions offer-actions">
        <ExampleAction>Accept offer</ExampleAction>
        <ExampleAction secondary>Request a change</ExampleAction>
      </div>
      <p className="card-small card-note">
        Accept, decline or ask for changes.
      </p>
    </>,
    <>
      <span className="card-label">Stories</span>
      <h3>Your story</h3>
      <p className="card-body">
        Share how you talk, what you know, and what you won’t say.
      </p>
      <blockquote className="story-quote">
        <span>Your story:</span>
        <p>“I run every day at 5am before the city wakes up.”</p>
      </blockquote>
      <span className="card-tag">Personal experience only</span>
      <div className="card-actions">
        <ExampleAction>Share with Alto</ExampleAction>
      </div>
      <p className="card-small card-note">Your stories shape the script.</p>
    </>,
    <>
      <span className="card-label">Approval</span>
      <h3>Your sign-off</h3>
      <p className="card-body">
        Review the ad. Approve it, ask for changes, or decline it. Only the
        version you approve can run.
      </p>
      <div className="approval-preview">
        <img
          src={asset("549:2841/imgApprovedVideoPreview")}
          alt="Illustrated ad preview"
        />
        <p>
          Video 01 <br />
          <span>
            Version 2 <br />
            30s · 9:16
          </span>
        </p>
      </div>
      <div className="card-actions">
        <ExampleAction>Approve version 2</ExampleAction>
        <ExampleAction secondary>Request changes</ExampleAction>
      </div>
      <p className="card-small card-note">Silence is never approval.</p>
    </>,
    <>
      <span className="card-label">Payment</span>
      <h3 className="card-price">$1,200</h3>
      <p className="card-body">
        Funds secured before you start. Released when you approve, before the ad
        runs.
      </p>
      <span className="card-tag released">Released</span>
      <div className="milestones">
        <span>Secured</span>
        <span>Approved</span>
        <span>Released</span>
      </div>
      <hr />
      <p className="card-small">Paid to you</p>
      <p className="card-small card-muted">After final-video approval</p>
    </>,
    <>
      <span className="card-label">Launch</span>
      <h3>See what ran</h3>
      <p className="card-body">
        See the approved ads and results the brand reports.
      </p>
      <div
        className="results-chart"
        aria-label="Illustrative brand-reported results"
      >
        {[42, 68, 57, 93, 112, 136, 158].map((h, i) => (
          <span
            key={i}
            style={{ height: h, "--i": i } as React.CSSProperties}
          />
        ))}
      </div>
      <p className="card-small">30-day licence</p>
      <span className="card-tag renewal">Renewal offered</span>
      <p className="card-small card-note">Example brand-reported data.</p>
    </>,
  ];
  const linked = row && enabled;
  const stacked = phone && enabled;
  useEffect(() => {
    const container = flow.current;
    const section = container?.closest<HTMLElement>(".process");
    const head = section?.querySelector<HTMLElement>(".process-head");
    if (!stacked || !container || !section || !head) return;
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      // Cards pin directly under the pinned heading.
      const pin = head.offsetHeight;
      section.style.setProperty("--stack-top", `${pin}px`);
      const boxes = cardRefs.map((card) =>
        card.current?.getBoundingClientRect(),
      );
      boxes.forEach((box, i) => {
        const card = cardRefs[i].current;
        const next = boxes[i + 1];
        if (!card || !box) return;
        // Cards differ in height, so a covered card is cut off just under
        // the top edge of the card over it and never shows beneath it.
        const shown = next ? next.top - box.top + 12 : box.height;
        const covered = shown < box.height;
        card.style.clipPath = covered
          ? `inset(-24px -24px ${box.height - Math.max(shown, TAB)}px)`
          : "";
        // Only its tab remains once the next card has landed.
        card.toggleAttribute("data-covered", shown <= TAB + 24);
      });
      // Leaving the section, the browser would release the last card first
      // and slide it up over the tabs. Sticky cards release when their
      // bottom margin meets the end of the grid, so each card gets the
      // margin that lines its release up with the last card's. The next
      // card takes the same amount back, which leaves the layout unchanged.
      // The pile then stops as one block and scrolls away with the page.
      const heights = cardRefs.map((card) => card.current?.offsetHeight ?? 0);
      const last = heights.length - 1;
      let carried = 0;
      cardRefs.forEach((card, i) => {
        if (!card.current) return;
        const hold = (last - i) * TAB + heights[last] - heights[i];
        card.current.style.marginTop = `${-carried}px`;
        card.current.style.marginBottom = `${hold}px`;
        carried = hold;
      });
      const box = grid.current?.getBoundingClientRect();
      // The heading releases at the same moment by the same means, so from
      // there the heading and the pile leave with the page, not under it.
      if (box) {
        const below =
          section.getBoundingClientRect().bottom -
          parseFloat(getComputedStyle(section).paddingBottom) -
          box.bottom;
        const hold = last * TAB + heights[last] + below;
        head.style.marginBottom = `${hold}px`;
        container.style.marginTop = `${-hold}px`;
      }
      // The site header would cover the pinned heading, so it stays away
      // while the stack is pinned.
      root.toggleAttribute(
        "data-stack-pinned",
        !!box && box.top < pin + 120 && box.bottom > pin + 240,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(head);
    return () => {
      window.removeEventListener("scroll", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
      root.removeAttribute("data-stack-pinned");
      section.style.removeProperty("--stack-top");
      head.style.removeProperty("margin-bottom");
      container.style.removeProperty("margin-top");
      for (const card of cardRefs) {
        card.current?.style.removeProperty("margin-top");
        card.current?.style.removeProperty("margin-bottom");
        card.current?.style.removeProperty("clip-path");
        card.current?.removeAttribute("data-covered");
      }
    };
    // Refs are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stacked]);
  // Scrolls to where a card has just landed on top of the pile.
  function openCard(index: number) {
    const head = flow.current
      ?.closest(".process")
      ?.querySelector<HTMLElement>(".process-head");
    if (!grid.current || !head) return;
    const gap = parseFloat(getComputedStyle(grid.current).rowGap) || 0;
    // Pinned cards report where they are stuck, so the resting position is
    // rebuilt from the grid and the heights of the cards before this one.
    let resting = grid.current.getBoundingClientRect().top + window.scrollY;
    for (let i = 0; i < index; i++)
      resting += (cardRefs[i].current?.offsetHeight ?? 0) + gap;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.scrollTo({
      top: resting - (head.offsetHeight + index * TAB),
      behavior: reduce.matches ? "auto" : "smooth",
    });
  }
  return (
    <div ref={flow} className="stage-flow" data-stacked={stacked || undefined}>
      <div className="stage-progress" aria-hidden="true">
        <motion.span style={linked ? { scaleX: progress } : undefined} />
      </div>
      <div ref={grid} className="stage-grid">
        {cards.map((card, i) =>
          linked ? (
            <FocusCard key={i} index={i} progress={progress}>
              {card}
            </FocusCard>
          ) : stacked ? (
            <StackCard key={i} index={i} self={cardRefs[i]} onOpen={openCard}>
              {card}
            </StackCard>
          ) : (
            <Reveal
              as="article"
              className="stage-card"
              key={i}
              delay={row ? i * 0.08 : 0}
              aria-label={`Stage ${i + 1}: ${stages[i]}`}
            >
              {card}
            </Reveal>
          ),
        )}
      </div>
    </div>
  );
}
