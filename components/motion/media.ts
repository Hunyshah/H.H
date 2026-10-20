// Shared media-query checks for motion components (client only).

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Desktop-class device: wide screen with a precise pointer (no touch-first phones/tablets). */
export function isDesktopPointer(): boolean {
  return window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
}
