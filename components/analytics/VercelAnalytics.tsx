"use client";

import dynamic from "next/dynamic";

// Loaded only when enabled, so the package never reaches the bundle otherwise.
const Analytics = dynamic(() => import("@vercel/analytics/next").then((m) => m.Analytics), {
  ssr: false,
});

export function VercelAnalytics() {
  return <Analytics />;
}
