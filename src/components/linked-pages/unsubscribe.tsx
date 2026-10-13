"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Action } from "@/components/landing/brand";
import { Lines } from "@/components/landing/motion";
import { contactEmail } from "@/lib/enquiry-schema";
import { SplitHero, delay } from "./shared";

/**
 * Where the unsubscribe link in our emails lands. Not in Figma; it follows
 * the form confirmations. Unsubscribing takes a press of the button, so a
 * mail scanner that only opens the link changes nothing.
 */
export function UnsubscribePage() {
  const [state, setState] = useState<"ready" | "sending" | "done" | "failed">(
    "ready",
  );
  async function unsubscribe() {
    setState("sending");
    try {
      const id = new URLSearchParams(window.location.search).get("id") ?? "";
      const response = await fetch(
        `/api/unsubscribe?id=${encodeURIComponent(id)}`,
        { method: "POST" },
      );
      setState(response.ok ? "done" : "failed");
    } catch {
      setState("failed");
    }
  }
  const done = state === "done";
  return (
    <SplitHero artwork="envelope" className="sp-confirmation">
      <Lines
        // Remounts so the new headline plays its entrance.
        key={String(done)}
        as="h1"
        className="sp-display"
        lines={done ? ["You’re", "unsubscribed."] : ["Stop our", "emails?"]}
        onLoad
      />
      <p className="sp-lead" data-hero style={delay(0.35)} role="status">
        {done
          ? `We won’t email this address again. If that changes, write to ${contactEmail}.`
          : "We’ll stop emailing this address. If you’re on the creator waitlist, that includes campaign offers."}
      </p>
      <div className="sp-actions" data-hero style={delay(0.47)}>
        {done ? (
          <Action href="/">Back to the homepage</Action>
        ) : (
          <Button
            size="lg"
            className="brand-action action-default"
            aria-disabled={state === "sending"}
            onClick={() => state !== "sending" && unsubscribe()}
          >
            {state === "sending" ? "Unsubscribing…" : "Unsubscribe"}
          </Button>
        )}
      </div>
      {state === "failed" && (
        <p className="sp-error" role="alert">
          That didn’t work. Open the link from your email again, or write to{" "}
          {contactEmail} and we’ll do it for you.
        </p>
      )}
    </SplitHero>
  );
}
