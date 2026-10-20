/** Extracts a YouTube video ID from watch, share, embed or shorts URLs. */
export function youTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const match = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{6,})/);
      return match?.[1] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}
