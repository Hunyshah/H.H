"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = {
  /** Resolves with a token, waiting up to `timeoutMs` for the widget to produce one. */
  getToken: (timeoutMs?: number) => Promise<string | undefined>;
  reset: () => void;
};

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Cloudflare Turnstile in "interaction-only" mode: invisible for most people,
 * shows a checkbox only when Cloudflare needs it. Renders nothing when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set (local development).
 */
export function Turnstile({ ref }: { ref?: Ref<TurnstileHandle> }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string | undefined>(undefined);
  const waiters = useRef<((t: string | undefined) => void)[]>([]);

  useEffect(() => {
    if (!siteKey || !container.current) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !container.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(container.current, {
          sitekey: siteKey,
          appearance: "interaction-only",
          theme: "light",
          action: "quote",
          callback: (t: string) => {
            token.current = t;
            waiters.current.splice(0).forEach((resolve) => resolve(t));
          },
          "expired-callback": () => {
            token.current = undefined;
          },
          "error-callback": () => {
            token.current = undefined;
          },
        });
      })
      .catch((err: unknown) => console.error("[turnstile]", err));

    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  useImperativeHandle(ref, () => ({
    getToken: (timeoutMs = 8000) => {
      if (!siteKey || token.current) return Promise.resolve(token.current);
      return new Promise((resolve) => {
        waiters.current.push(resolve);
        setTimeout(() => resolve(token.current), timeoutMs);
      });
    },
    reset: () => {
      token.current = undefined;
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    },
  }));

  if (!siteKey) return null;
  return <div ref={container} className="mt-6 empty:hidden" />;
}
