import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "gold" | "outline-dark" | "outline-light" | "ghost-dark";

export const buttonVariants: Record<Variant, string> = {
  gold: "bg-gold text-ink-950 hover:bg-gold-hover",
  "outline-dark": "border border-ivory/35 text-ivory hover:border-gold hover:text-gold",
  "outline-light": "border border-ink-950/25 text-ink-950 hover:border-ink-950",
  "ghost-dark": "text-ivory hover:text-gold",
};

export const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xs px-6 text-[15px] font-bold tracking-wide transition-colors duration-300 ease-arch";

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "gold", className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}
