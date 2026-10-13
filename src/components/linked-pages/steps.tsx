"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { Reveal, useScrollProgress } from "@/components/landing/motion";

const steps: [title: string, copy: string | null][] = [
  [
    "Brief",
    "You tell us the product, the audience and the ad you want to beat.",
  ],
  [
    "Creator match",
    "We find creators who fit your brief and write up their stories and limits.",
  ],
  [
    "Offer and licence",
    "You make a paid offer. Each creator who accepts signs a licence for this campaign, stating the channels, countries, dates and fee.",
  ],
  ["Production", null],
  [
    "Creator approval",
    "The creator approves each final version, asks for changes or declines it.",
  ],
  ["Launch", "You run the approved ads in your own ad accounts."],
  [
    "Results",
    "We compare the new ads with the ad you set out to beat. The figures come from your own ad accounts.",
  ],
];

const routes = [
  {
    tone: "ink",
    label: "Standard",
    title: "Your team makes the ads",
    copy: "You make them in the tools you already use, within the licence. For in-house teams and agencies.",
  },
  {
    tone: "green",
    label: "Pilot only",
    title: "Semblanse makes the ads",
    copy: "We make them with you from your brief, during the pilot. For brands that want production handled or are new to AI ads.",
  },
];

/**
 * The seven steps of a pilot. Production is the one step with a choice. A line
 * draws down the numbers as the list scrolls past, like the stage line on the
 * landing page.
 */
export function PilotSteps() {
  const list = useRef<HTMLOListElement>(null);
  const { progress, enabled } = useScrollProgress(list, [
    "start 0.8",
    "end 0.6",
  ]);
  return (
    <ol ref={list} className="sp-numbered">
      <motion.span
        className="sp-numbered-line"
        aria-hidden="true"
        style={enabled ? { scaleY: progress } : undefined}
      />
      {steps.map(([title, copy], i) => (
        <Reveal as="li" key={title} delay={0.04 * i}>
          <span className="sp-number" aria-hidden="true">
            {i + 1}
          </span>
          <h3>{title}</h3>
          {copy ? (
            <p>{copy}</p>
          ) : (
            <div className="sp-fork">
              <p>
                Choose who makes the ads. They’re scripted from the creator’s
                stories, inside their limits.
              </p>
              <div>
                {routes.map((route) => (
                  <div key={route.title} className={`sp-${route.tone}`}>
                    <small>{route.label}</small>
                    <h4>{route.title}</h4>
                    <p>{route.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
