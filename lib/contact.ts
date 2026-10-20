// Helpers for phone / WhatsApp links. Placeholder values like "[0300-0000000]"
// still produce syntactically valid links so the UI can be tested.

/** Digits only, converted to international format for Pakistan (92…). */
export function toInternational(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

export function telHref(phone: string): string {
  return `tel:+${toInternational(phone)}`;
}

export function whatsappHref(number: string, message?: string): string {
  const base = `https://wa.me/${toInternational(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
