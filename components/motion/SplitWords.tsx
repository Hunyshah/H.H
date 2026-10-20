import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type SplitWordsProps = {
  text: string;
  /** Index offset so a second SplitWords continues the stagger of the first. */
  offset?: number;
  className?: string;
};

/**
 * Splits text into words that rise in one by one. Must sit inside an element
 * with `data-reveal="words"` (see Reveal). The full text stays in the HTML.
 */
export function SplitWords({ text, offset = 0, className }: SplitWordsProps) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className={cn("split-word", className)}>
            <span style={{ "--i": i + offset } as CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
