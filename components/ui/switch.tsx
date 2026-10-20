import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Toggle switch built on a native checkbox (form-submittable, keyboard accessible). */
export function Switch({
  className,
  label,
  ...props
}: ComponentProps<"input"> & { label: string }) {
  return (
    <label
      className={cn(
        "inline-flex min-h-10 cursor-pointer items-center gap-3 text-sm font-bold text-body",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-ink-950 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
      />
      {label}
    </label>
  );
}
