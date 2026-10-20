import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// shadcn/ui-style primitive (admin panel and form controls).
export const buttonStyles = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xs px-4 text-sm font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ink-950 text-ivory hover:bg-brand-purple",
        gold: "bg-gold text-ink-950 hover:bg-gold-hover",
        outline: "border border-line bg-white text-body hover:border-ink-950",
        ghost: "text-body hover:bg-sand",
        destructive: "bg-red-700 text-white hover:bg-red-800",
      },
      size: {
        default: "",
        sm: "min-h-8 px-3 text-xs",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonStyles>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonStyles({ variant, size }), className)} {...props} />
  );
}
