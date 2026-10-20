import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = { ok: true; skipped?: boolean } | { ok: false; reason: string };

/**
 * Verifies a Cloudflare Turnstile token. When TURNSTILE_SECRET_KEY is not set
 * (local development) verification is skipped with a warning — always set it
 * in production.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY not set — skipping verification.");
    return { ok: true, skipped: true };
  }
  if (!token) return { ok: false, reason: "missing-token" };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    return data.success
      ? { ok: true }
      : { ok: false, reason: (data["error-codes"] ?? []).join(",") || "failed" };
  } catch (err) {
    console.error(
      "[turnstile] verification request failed:",
      err instanceof Error ? err.message : err,
    );
    return { ok: false, reason: "unreachable" };
  }
}
