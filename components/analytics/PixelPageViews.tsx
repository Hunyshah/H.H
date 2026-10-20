"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Meta Pixel PageView for client-side navigations (the first view is sent by the snippet). */
export function PixelPageViews() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
