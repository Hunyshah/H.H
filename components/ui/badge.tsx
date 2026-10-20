import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const badgeStyles = cva(
  "inline-flex items-center rounded-xs px-2 py-0.5 text-xs font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-sand text-body",
        dark: "bg-ink-950 text-ivory",
        gold: "bg-gold text-ink-950",
        success: "bg-emerald-100 text-emerald-900",
        warning: "bg-amber-100 text-amber-900",
        danger: "bg-red-100 text-red-900",
        info: "bg-indigo-100 text-indigo-900",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeStyles>) {
  return <span className={cn(badgeStyles({ variant }), className)} {...props} />;
}
