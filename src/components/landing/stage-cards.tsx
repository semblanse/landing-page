"use client";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { asset } from "./brand";
import { ease } from "./motion";
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
export function StageCards() {
  const reduce = useReducedMotion();
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
      <p className="card-small">Paid to You</p>
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
          <motion.span
            key={i}
            style={{ height: h }}
            initial={false}
            whileInView={reduce ? undefined : { scaleY: [0.1, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.08, ease }}
          />
        ))}
      </div>
      <p className="card-small">30-day licence</p>
      <span className="card-tag renewal">Renewal offered</span>
      <p className="card-small card-note">Example brand-reported data.</p>
    </>,
  ];
  return (
    <div className="stage-grid">
      {cards.map((card, i) => (
        <motion.article
          className="stage-card"
          key={i}
          initial={false}
          whileInView={
            reduce
              ? undefined
              : {
                  y: [20, 0],
                  boxShadow: [
                    "0 0 0 0px #1f6f2200",
                    "0 0 0 2px #1f6f22",
                    "0 0 0 0px #1f6f2200",
                  ],
                }
          }
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.3, delay: i * 0.12, ease }}
          aria-label={`Stage ${i + 1}: ${["Offer", "Stories", "Approval", "Payment", "Launch"][i]}`}
        >
          {card}
        </motion.article>
      ))}
    </div>
  );
}
