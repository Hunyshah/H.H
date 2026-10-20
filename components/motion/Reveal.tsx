import type { CSSProperties, ElementType, ReactNode } from "react";

export type RevealVariant = "up" | "fade" | "wipe" | "wipe-up" | "frame";

type RevealProps = {
  as?: ElementType;
  variant?: RevealVariant;
  /** Delay in ms before the reveal starts. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Reveals its content once, when it scrolls into view. Pure CSS + the inline
 * observer in the root layout: renders as a Server Component and ships no JS.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  style,
  children,
}: RevealProps) {
  return (
    <Tag
      data-reveal={variant}
      className={className}
      style={delay ? { ...style, "--reveal-delay": `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
