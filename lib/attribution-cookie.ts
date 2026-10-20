// Cookie name and lifetime shared by the client capture and the server parser.
// Kept free of Zod so the client component stays tiny.

export const ATTRIBUTION_COOKIE = "hh_attr";
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
};
