// Date helpers for the admin panel. The business runs on Pakistan time
// (UTC+5, no daylight saving), so "this week/month" are computed there.

const PKT_OFFSET_MS = 5 * 60 * 60 * 1000;

const dateTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Karachi",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

/** Start of the current week (Monday 00:00 PKT) as an ISO string. */
export function startOfWeekPkt(now = new Date()): string {
  const pkt = new Date(now.getTime() + PKT_OFFSET_MS);
  const day = (pkt.getUTCDay() + 6) % 7; // Monday = 0
  const start = Date.UTC(pkt.getUTCFullYear(), pkt.getUTCMonth(), pkt.getUTCDate() - day);
  return new Date(start - PKT_OFFSET_MS).toISOString();
}

/** Start of the current month (1st 00:00 PKT) as an ISO string. */
export function startOfMonthPkt(now = new Date()): string {
  const pkt = new Date(now.getTime() + PKT_OFFSET_MS);
  return new Date(
    Date.UTC(pkt.getUTCFullYear(), pkt.getUTCMonth(), 1) - PKT_OFFSET_MS,
  ).toISOString();
}

/** ISO timestamp `days` days before now. */
export function daysAgoIso(days: number, now = new Date()): string {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}
