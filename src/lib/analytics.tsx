"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  eventNames,
  safePath,
  safeProperties,
  uuidPattern,
  type AnalyticsEvent,
  type SiteEvent,
} from "./analytics-schema";

const choiceKey = "semblanse:analytics-choice:v1";
const visitorKey = "semblanse:anonymous-visitor:v1";
const sessionKey = "semblanse:analytics-session:v1";
const attributionKey = "semblanse:attribution";
type Choice = "unknown" | "allowed" | "denied" | "blocked";
let memoryChoice: Choice = "unknown";
let enabled = false;
let visitor = "";
let session = { id: "", expires: 0, count: 0 };
let first: Record<string, string> = {};
let queue: { item: AnalyticsEvent; sessionId: string }[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let inflight = false;
let controller: AbortController | undefined;

function browserBlocksTracking() {
  return (
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true || navigator.doNotTrack === "1"
  );
}
function choice(): Choice {
  if (browserBlocksTracking()) return "blocked";
  try {
    const stored = JSON.parse(localStorage.getItem(choiceKey) ?? "null");
    if (
      stored?.expires > Date.now() &&
      ["allowed", "denied"].includes(stored.value)
    )
      return stored.value;
  } catch {
    /* Storage may be unavailable. */
  }
  return memoryChoice;
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("semblanse:analytics-choice", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("semblanse:analytics-choice", callback);
  };
}
function stop() {
  enabled = false;
  queue = [];
  visitor = "";
  first = {};
  session = { id: "", expires: 0, count: 0 };
  clearTimeout(timer);
  controller?.abort();
  try {
    localStorage.removeItem(visitorKey);
    sessionStorage.removeItem(sessionKey);
    sessionStorage.removeItem(attributionKey);
  } catch {
    /* No optional storage remains in memory. */
  }
}
export function chooseAnalytics(value: "allowed" | "denied") {
  memoryChoice = value;
  try {
    localStorage.setItem(
      choiceKey,
      JSON.stringify({ value, expires: Date.now() + 180 * 86400_000 }),
    );
  } catch {
    /* Apply this choice for the current page. */
  }
  if (value === "denied") stop();
  window.dispatchEvent(new Event("semblanse:analytics-choice"));
}
function initialize() {
  try {
    const saved = JSON.parse(localStorage.getItem(visitorKey) ?? "null");
    if (saved?.expires > Date.now() && uuidPattern.test(saved.id))
      visitor = saved.id;
    else {
      visitor = crypto.randomUUID();
      localStorage.setItem(
        visitorKey,
        JSON.stringify({ id: visitor, expires: Date.now() + 90 * 86400_000 }),
      );
    }
    const visit = JSON.parse(sessionStorage.getItem(sessionKey) ?? "null");
    if (
      visit?.expires > Date.now() &&
      uuidPattern.test(visit.id) &&
      typeof visit.count === "number" &&
      visit.count >= 0 &&
      visit.count <= 100
    )
      session = visit;
    const savedAttribution = JSON.parse(
      sessionStorage.getItem(attributionKey) ?? "null",
    );
    if (savedAttribution)
      first = safeProperties(savedAttribution) as Record<string, string>;
  } catch {
    /* Capture without persistence only after the choice to allow it. */
  }
  visitor ||= crypto.randomUUID();
  if (!session.id || session.expires <= Date.now())
    session = {
      id: crypto.randomUUID(),
      expires: Date.now() + 30 * 60_000,
      count: 0,
    };
  if (!Object.keys(first).length) {
    const tags: Record<string, string> = {
      landing_path: safePath(location.pathname),
      channel: "Direct",
    };
    const params = new URLSearchParams(location.search);
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]) {
      const value = params.get(key);
      if (value) tags[key] = value;
    }
    try {
      const host = new URL(document.referrer).hostname;
      tags.channel = host.includes("google.")
        ? "Google"
        : host.endsWith("bing.com")
          ? "Bing"
          : host.endsWith("instagram.com")
            ? "Instagram"
            : host.endsWith("facebook.com")
              ? "Facebook"
              : host.endsWith("linkedin.com")
                ? "LinkedIn"
                : host === location.hostname
                  ? "Direct"
                  : "Other referral";
    } catch {
      /* No referral. */
    }
    first = safeProperties(tags) as Record<string, string>;
    try {
      sessionStorage.setItem(attributionKey, JSON.stringify(first));
    } catch {
      /* Optional storage. */
    }
  }
}
export function attribution(): Record<string, string> | undefined {
  return enabled && choice() === "allowed" ? { ...first } : undefined;
}

async function flush() {
  clearTimeout(timer);
  if (!enabled || choice() !== "allowed" || inflight || !queue.length) return;
  const sessionId = queue[0].sessionId;
  let count = 0;
  while (count < 10 && queue[count]?.sessionId === sessionId) count++;
  const events = queue.splice(0, count).map((q) => q.item);
  inflight = true;
  controller = new AbortController();
  const timeout = setTimeout(() => controller?.abort(), 8_000);
  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        consent: true,
        distinctId: visitor,
        sessionId,
        events,
      }),
      keepalive: true,
      signal: controller.signal,
    });
    if (response.status === 429) {
      enabled = false;
      queue = [];
    }
    // Deliberately do not retry lost analytics: bounded usage is more important.
  } catch {
    /* Analytics never blocks navigation or a form. */
  } finally {
    clearTimeout(timeout);
    inflight = false;
    if (queue.length && enabled) timer = setTimeout(flush, 1000);
  }
}

/** Returns whether an explicit, sanitized event entered the bounded queue. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (
    !enabled ||
    choice() !== "allowed" ||
    !eventNames.includes(event as SiteEvent)
  )
    return false;
  if (session.expires <= Date.now())
    session = {
      id: crypto.randomUUID(),
      expires: Date.now() + 30 * 60_000,
      count: 0,
    };
  const important = /^(form_|verify_)/.test(event);
  if (session.count >= (important ? 100 : 90)) return false;
  session.count++;
  session.expires = Date.now() + 30 * 60_000;
  try {
    sessionStorage.setItem(sessionKey, JSON.stringify(session));
  } catch {
    /* Optional storage. */
  }
  const device =
    innerWidth < 600 ? "mobile" : innerWidth < 1024 ? "tablet" : "desktop";
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Firefox\//.test(ua)
      ? "Firefox"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Safari\//.test(ua)
          ? "Safari"
          : "Other";
  const os = /Android/.test(ua)
    ? "Android"
    : /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Windows/.test(ua)
        ? "Windows"
        : /Macintosh/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Other";
  queue.push({
    sessionId: session.id,
    item: {
      event: event as SiteEvent,
      uuid: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      properties: safeProperties({
        ...first,
        ...properties,
        path: safePath(properties?.path ?? location.pathname),
        device,
        browser,
        os,
      }),
    },
  });
  if (queue.length >= 10) void flush();
  else {
    clearTimeout(timer);
    timer = setTimeout(flush, 1000);
  }
  return true;
}

export function AnalyticsChoicesButton() {
  return (
    <button
      type="button"
      className="footer-analytics-choice"
      aria-controls="analytics-choice"
      onClick={() =>
        window.dispatchEvent(new Event("semblanse:open-analytics"))
      }
    >
      Analytics choices
    </button>
  );
}

export function Analytics() {
  const path = usePathname();
  const preference = useSyncExternalStore(
    subscribe,
    choice,
    () => "unknown" as Choice,
  );
  const [open, setOpen] = useState(false);
  const notice = useRef<HTMLElement>(null);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("semblanse:open-analytics", show);
    return () => window.removeEventListener("semblanse:open-analytics", show);
  }, []);
  useEffect(() => {
    if (open) notice.current?.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    if (preference !== "allowed" || path.startsWith("/unsubscribe")) {
      // Hydration first uses the server snapshot. Preserve an existing opt-in
      // identifier until the actual browser preference has been read.
      if (choice() !== "allowed" || path.startsWith("/unsubscribe")) stop();
      return;
    }
    enabled = true;
    initialize();
    track("$pageview");
    const form = document.querySelector<HTMLFormElement>(
      "form[data-analytics-form]",
    );
    if (form) track("form_viewed", { form: form.dataset.analyticsForm });
    const viewed = new Set<string>();
    const depths = new Set<number>();
    const startedAt = Date.now();
    let left = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting && !viewed.has(entry.target.id)) {
            viewed.add(entry.target.id);
            track("section_viewed", { section: entry.target.id });
          }
      },
      { threshold: 0 },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((s) => observer.observe(s));
    const click = (e: MouseEvent) => {
      const link =
        e.target instanceof Element ? e.target.closest("a[href]") : null;
      const href = link?.getAttribute("href");
      if (!href) return;
      const section =
        link!.closest("section[id]")?.id ??
        link!.closest("header,footer")?.tagName.toLowerCase() ??
        "main";
      if (href.startsWith("mailto:"))
        track("contact_channel_clicked", {
          destination_type: "email",
          section,
        });
      else if (
        /^\/(creator-pilot|brand-pilot|contact|investors)\/?(?:[?#]|$)/.test(
          href,
        )
      )
        track("cta_clicked", { destination: safePath(href), section });
    };
    const scroll = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      if (total <= 0) return;
      const progress = (scrollY / total) * 100;
      for (const milestone of [25, 50, 75, 100])
        if (progress >= milestone - 0.5 && !depths.has(milestone)) {
          depths.add(milestone);
          track("scroll_depth", { milestone });
        }
    };
    const leave = () => {
      if (left) return;
      left = true;
      track("$pageleave", { path, seconds: (Date.now() - startedAt) / 1000 });
      void flush();
    };
    document.addEventListener("click", click);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pagehide", leave);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", click);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pagehide", leave);
      leave();
    };
  }, [preference, path]);
  const visible = open || preference === "unknown";
  if (!visible) return null;
  return (
    <section
      id="analytics-choice"
      ref={notice}
      tabIndex={-1}
      className="analytics-choice"
      aria-label="Analytics choices"
    >
      <div>
        <p>
          {preference === "blocked"
            ? "Analytics are off, as your browser requested."
            : "Help us improve the site? Allow optional visit and click stats."}{" "}
          <Link href="/privacy/#what-we-collect">Privacy details</Link>
        </p>
      </div>
      <div className="analytics-choice-actions">
        {preference !== "blocked" && (
          <button
            type="button"
            className="analytics-choice-allow"
            onClick={() => {
              chooseAnalytics("allowed");
              setOpen(false);
            }}
          >
            Allow
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            chooseAnalytics("denied");
            setOpen(false);
          }}
        >
          {preference === "blocked" ? "Close" : "No thanks"}
        </button>
      </div>
    </section>
  );
}
