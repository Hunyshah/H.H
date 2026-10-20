"use client";

import { useState } from "react";

let isFirstRender = true;

/**
 * Re-mounts on every navigation inside the public site and plays a short
 * fade/slide. Skipped on the initial page load so it never delays LCP.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => {
    if (typeof window === "undefined") return false;
    const shouldAnimate = !isFirstRender;
    isFirstRender = false;
    return shouldAnimate;
  });

  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
