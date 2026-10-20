// Royalty-free placeholder photography (Unsplash). Replace with the firm's own
// photos as they become available — every static image on the site is here.

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const images = {
  factoryHall: u("1565008447742-97f6f38c985c"),
  modernHouse: u("1600596542815-ffad4c1539a9"),
  houseDusk: u("1600585154340-be6161a56a0c"),
  villa: u("1613490493576-7fde63acd811"),
  commercial: u("1486406146926-c627a92ad1ab"),
  warehouse: u("1586528116311-ad8dd3c8310d"),
  siteCranes: u("1541888946425-d81bb19240f5"),
  greyStructure: u("1503387762-592deb58ef4e"),
  siteWorker: u("1504307651254-35680f356dfd"),
  engineer: u("1581094794329-c8112a89af12"),
} as const;

/** Neutral ink-toned blur placeholder for remote images without their own blur hash. */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64," +
  // 8x5 ink gradient
  "PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA4IDUnPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0nZycgeDE9JzAnIHkxPScwJyB4Mj0nMScgeTI9JzEnPjxzdG9wIG9mZnNldD0nMCcgc3RvcC1jb2xvcj0nIzJhMjM0MicvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nIzE1MTEyYScvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzUnIGZpbGw9J3VybCgjZyknLz48L3N2Zz4=";
