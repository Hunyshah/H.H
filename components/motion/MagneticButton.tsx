"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { isDesktopPointer, prefersReducedMotion } from "./media";

/** Wraps a primary CTA so it drifts slightly toward the cursor (desktop only). */
export function MagneticButton({
  children,
  strength = 0.25,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !isDesktopPointer()) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onLeave = () => {
      el.style.transition = "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = "";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className="inline-flex">
      {children}
    </span>
  );
}
