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
    element.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    element.async = true;
    element.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error());
    element.onerror = () => {
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
  }>(undefined);

  useEffect(() => {
    load().catch(() => {});
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, []);

  const getToken = useCallback(
    () =>
      new Promise<string>((resolve, reject) => {
        pending.current = { resolve, reject };
        load().then((turnstile) => {
          if (!container.current) return reject(new Error("No container"));
          if (widget.current) turnstile.reset(widget.current);
          else
            widget.current = turnstile.render(container.current, {
              sitekey: siteKey,
              execution: "execute",
              appearance: "interaction-only",
              callback: (token: string) => pending.current?.resolve(token),
              "error-callback": () => {
                pending.current?.reject(new Error("Turnstile failed"));
                return true;
              },
            });
          if (!widget.current) return reject(new Error("Turnstile failed"));
          turnstile.execute(widget.current);
        }, reject);
      }),
    [],
  );

  return { container, getToken };
}
