"use client";

import type { AnchorHTMLAttributes } from "react";

import { trackEvent, type AnalyticsEvent } from "@/lib/analytics/events";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: AnalyticsEvent;
  /** Where on the page the click happened, e.g. "header", "mobile_bar". */
  placement: string;
};

/** Plain anchor (tel:, wa.me, external) that reports a click event. */
export function TrackedLink({ event, placement, onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(event, { placement });
        onClick?.(e);
      }}
    />
  );
}
