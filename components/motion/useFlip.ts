"use client";

import { useLayoutEffect, useRef } from "react";

import { prefersReducedMotion } from "./media";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * FLIP layout animation for a list whose items are keyed with `data-flip-key`.
 * When `deps` change, items that stay animate from their old position/size
 * to the new one, and new items fade/scale in. Transform + opacity only, via
 * the Web Animations API — a few hundred bytes instead of a layout-animation
 * library on pages that must stay light.
 */
export function useFlip<T extends HTMLElement>(deps: unknown) {
  const container = useRef<T>(null);
  const rects = useRef(new Map<string, DOMRect>());

  // Call right before the state change that re-orders the list.
  const snapshot = () => {
    const el = container.current;
    if (!el) return;
    rects.current = new Map(
      Array.from(el.querySelectorAll<HTMLElement>("[data-flip-key]")).map((node) => [
        node.dataset.flipKey!,
        node.getBoundingClientRect(),
      ]),
    );
  };

  useLayoutEffect(() => {
    const el = container.current;
    const previous = rects.current;
    if (!el || previous.size === 0 || prefersReducedMotion()) return;

    for (const node of el.querySelectorAll<HTMLElement>("[data-flip-key]")) {
      const before = previous.get(node.dataset.flipKey!);
      const after = node.getBoundingClientRect();
      if (!before) {
        node.animate(
          [
            { opacity: 0, transform: "scale(0.97)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 700, easing: EASE, delay: 120 },
        );
        continue;
      }
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      const sx = before.width / after.width;
      const sy = before.height / after.height;
      if (
        Math.abs(dx) < 1 &&
        Math.abs(dy) < 1 &&
        Math.abs(sx - 1) < 0.01 &&
        Math.abs(sy - 1) < 0.01
      )
        continue;
      node.animate(
        [
          {
            transformOrigin: "top left",
            transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
          },
          { transformOrigin: "top left", transform: "none" },
        ],
        { duration: 800, easing: EASE },
      );
    }
    rects.current = new Map();
  }, [deps]);

  return { ref: container, snapshot };
}
