"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// PostHog's public project key. Analytics stay off when it is not set.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Events go through this site's own /relay path (functions/relay), so they
// arrive first-party.
const host = "/relay";

let started = false;

/**
 * Records an event. Send names, counts and field names only; never what a
 * person typed into a form.
 */
export function track(event: string, properties?: Record<string, unknown>) {
  if (started) posthog.capture(event, properties);
}

const attributionKey = "semblanse:attribution";
const tags = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

function rememberAttribution() {
  try {
    if (sessionStorage.getItem(attributionKey)) return;
    const params = new URLSearchParams(location.search);
    const first: Record<string, string> = { landing: location.pathname };
    if (document.referrer) first.referrer = document.referrer;
    for (const tag of tags) {
      const value = params.get(tag);
      if (value) first[tag] = value;
    }
    sessionStorage.setItem(attributionKey, JSON.stringify(first));
  } catch {
    // Storage is blocked; forms are sent without attribution.
  }
}

/** How this visit began: campaign tags, referrer and first page. */
export function attribution(): Record<string, string> | undefined {
  try {
    return JSON.parse(sessionStorage.getItem(attributionKey) ?? "null");
  } catch {
    return undefined;
  }
}

/** Starts analytics once per visit. Renders nothing. */
export function Analytics() {
  useEffect(() => {
    rememberAttribution();
    if (!key || started) return;
    posthog.init(key, {
      api_host: host,
      ui_host: "https://us.posthog.com",
      // PostHog uses no cookies or browser storage. Attribution above uses
      // session storage; consent requirements still need a launch review.
      cookieless_mode: "always",
      capture_pageview: "history_change",
      capture_pageleave: true,
      // Only the events named in this codebase are sent.
      autocapture: false,
      disable_session_recording: true,
    });
    started = true;

    // Clicks on the links that lead to a form, with where on the page they sit.
    function onClick(event: MouseEvent) {
      const link = (event.target as Element).closest?.("a[href]");
      const href = link?.getAttribute("href");
      if (!href || !/^\/(creator-pilot|brand-pilot|contact)\/?$/.test(href))
        return;
      track("cta_clicked", {
        destination: href,
        label: link!.textContent?.trim().slice(0, 80),
        section:
          link!.closest("section[id]")?.id ??
          link!.closest("header, footer")?.tagName.toLowerCase(),
      });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
