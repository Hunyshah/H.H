import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const fieldStyles =
  "block w-full rounded-xs border border-line bg-white px-3 text-[15px] text-body placeholder:text-muted/70 focus:border-ink-950 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold aria-invalid:border-red-700 disabled:opacity-60";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldStyles, "min-h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldStyles, "py-2 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldStyles, "min-h-10 pr-8", className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-sm font-bold text-body", className)} {...props} />;
}
