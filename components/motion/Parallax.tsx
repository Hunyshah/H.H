"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { clsx } from "clsx";

import { isDesktopPointer, prefersReducedMotion } from "./media";

type ParallaxProps = {
  children: ReactNode;
  /** Max shift in px at the edges of the viewport. */
  strength?: number;
  className?: string;
};

/**
 * Subtle vertical parallax for large images (desktop only, transform only).
 * The wrapper should be slightly taller than its frame (e.g. `inset-[-8%_0]`)
 * so the shift never reveals an edge.
 */
export function Parallax({ children, strength = 40, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !isDesktopPointer()) return;

    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = el.parentElement?.getBoundingClientRect() ?? el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 when the frame's centre is at the bottom of the viewport, 1 at the top.
      const progress = 1 - (rect.top + rect.height / 2) / (vh / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.transform = `translate3d(0, ${(clamped * strength).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) onScroll();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [strength]);

  return (
    <div ref={ref} className={clsx("will-change-transform", className)}>
      {children}
    </div>
  );
}
