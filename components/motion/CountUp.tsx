"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "./media";

/**
 * Counts the numeric part of a value (e.g. "50+", "10+") up from zero when it
 * scrolls into view. The final value is server-rendered, so crawlers and
 * no-JS visitors see the real number. Non-numeric values ("A–Z") render as-is.
 */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^(\D*)(\d+)(.*)$/);
    if (!el || !match || prefersReducedMotion()) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already visible: don't flash

    let frame = 0;
    el.textContent = `${prefix}0${suffix}`;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
