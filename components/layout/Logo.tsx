import Link from "next/link";

import { site } from "@/lib/content/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** `dark` = placed on a dark background, `light` = on a light background. */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  /** Wrap in a link to the home page (default true). */
  asLink?: boolean;
  className?: string;
  taglineClassName?: string;
};

const sizes = {
  sm: { block: "text-[13px] px-2 py-1", tagline: "text-[8.5px]" },
  md: { block: "text-[15px] px-2.5 py-1.5", tagline: "text-[9.5px]" },
  lg: { block: "text-xl px-3 py-2", tagline: "text-[11px]" },
} as const;

/**
 * Text wordmark used until the real SVG logo is supplied.
 * To switch to the SVG: replace the wordmark spans in `mark` below and keep this API.
 */
export function Logo({
  variant = "dark",
  size = "md",
  showTagline = true,
  asLink = true,
  className,
  taglineClassName,
}: LogoProps) {
  const s = sizes[size];

  const mark = (
    <span className={cn("inline-flex flex-col items-start gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex font-display leading-none font-extrabold tracking-[0.04em]",
          variant === "dark" && "ring-1 ring-white/10",
        )}
      >
        <span className={cn("bg-brand-purple text-ivory", s.block)}>H.H</span>
        <span className={cn("bg-gold text-ink-950", s.block)}>ASSOCIATE</span>
      </span>
      {showTagline && (
        <span
          className={cn(
            "font-semibold tracking-[0.14em] whitespace-nowrap uppercase",
            s.tagline,
            variant === "dark" ? "text-muted-on-dark" : "text-muted",
            taglineClassName,
          )}
        >
          {site.tagline}
        </span>
      )}
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link href="/" aria-label={`${site.name} — home`} className="inline-flex">
      {mark}
    </Link>
  );
}
