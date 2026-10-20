"use client";

import { clsx } from "clsx";

export type ChipOption = { value: string; label: string };

type FilterChipsProps = {
  options: ChipOption[];
  value: string;
  /** Omitted for the static (prerendered) state, where chips are inert until hydration. */
  onChange?: (value: string) => void;
  label: string;
  tone?: "light" | "dark";
};

/** Single-select filter chips (toggle buttons with aria-pressed). */
export function FilterChips({ options, value, onChange, label, tone = "dark" }: FilterChipsProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange?.(o.value)}
            className={clsx(
              "min-h-11 rounded-xs border px-4 text-sm font-bold transition-colors duration-300",
              tone === "dark"
                ? active
                  ? "border-gold bg-gold text-ink-950"
                  : "border-line-dark text-muted-on-dark hover:border-gold hover:text-ivory"
                : active
                  ? "border-ink-950 bg-ink-950 text-ivory"
                  : "border-line text-muted hover:border-ink-950 hover:text-body",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
