"use client";

import { useEffect } from "react";

import { prefersReducedMotion } from "./media";

/**
 * Site-wide Lenis smooth scrolling, loaded after hydration so it stays out of
 * the critical JavaScript. Off for reduced motion; touch keeps native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let frame = 0;
    let destroy: (() => void) | undefined;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        anchors: { offset: -76 },
      });
      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      destroy = () => lenis.destroy();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      destroy?.();
    };
  }, []);

  return null;
}
