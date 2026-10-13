"use client";

import { useCallback, useEffect, useRef } from "react";

// Falls back to Cloudflare's always-pass test key, which only a server holding
// the matching test secret accepts.
const siteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA";

type Turnstile = {
  render: (
    container: HTMLElement,
    options: Record<string, unknown>,
  ) => string | undefined;
  execute: (widget: string) => void;
  reset: (widget: string) => void;
  remove: (widget: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let script: Promise<Turnstile> | undefined;

function load() {
  script ??= new Promise<Turnstile>((resolve, reject) => {
    const element = document.createElement("script");
    const timeout = setTimeout(
      () => element.onerror?.(new Event("error")),
      15_000,
    );
    element.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    element.async = true;
    element.onload = () => {
      clearTimeout(timeout);
      if (window.turnstile) resolve(window.turnstile);
      else {
        script = undefined;
        reject(new Error("Turnstile did not initialise"));
      }
    };
    element.onerror = () => {
      clearTimeout(timeout);
      element.remove();
      script = undefined;
      reject(new Error("Turnstile did not load"));
    };
    document.head.append(element);
  });
  return script;
}

/**
 * Cloudflare's bot check for one form. Put `container` on an empty element
 * inside the form; the check stays invisible unless Cloudflare needs the
 * visitor to interact. `getToken` resolves a fresh single-use token.
 */
export function useTurnstile() {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string>(undefined);
  const pending = useRef<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
    timer: ReturnType<typeof setTimeout>;
  }>(undefined);

  const finish = useCallback((error?: Error, token?: string) => {
    const current = pending.current;
    pending.current = undefined;
    if (!current) return;
    clearTimeout(current.timer);
    if (error) current.reject(error);
    else current.resolve(token!);
  }, []);

  useEffect(() => {
    load().catch(() => {});
    return () => {
      finish(new Error("Form closed"));
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [finish]);

  const getToken = useCallback(
    () =>
      new Promise<string>((resolve, reject) => {
        finish(new Error("Challenge restarted"));
        pending.current = {
          resolve,
          reject,
          timer: setTimeout(
            () => finish(new Error("Challenge timed out")),
            30_000,
          ),
        };
        load()
          .then((turnstile) => {
            if (!pending.current) return;
            if (!container.current) return finish(new Error("No container"));
            if (widget.current) turnstile.reset(widget.current);
            else
              widget.current = turnstile.render(container.current, {
                sitekey: siteKey,
                action: "enquiry",
                execution: "execute",
                appearance: "interaction-only",
                callback: (token: string) => finish(undefined, token),
                "expired-callback": () =>
                  finish(new Error("Challenge expired")),
                "timeout-callback": () =>
                  finish(new Error("Challenge timed out")),
                "error-callback": () => {
                  finish(new Error("Turnstile failed"));
                  return true;
                },
              });
            if (!widget.current) return finish(new Error("Turnstile failed"));
            turnstile.execute(widget.current);
          })
          .catch((error: Error) => finish(error));
      }),
    [finish],
  );

  return { container, getToken };
}
