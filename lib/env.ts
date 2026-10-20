// Central access to environment variables.
// Public values are read with literal `process.env.NEXT_PUBLIC_*` so Next.js can inline them.

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False until Supabase keys are configured; the public site then renders built-in fallbacks. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
