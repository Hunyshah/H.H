import { cn } from "@/lib/utils";

type EyebrowProps = {
  /** Section number, e.g. 1 renders "01". Omit for an un-numbered eyebrow. */
  index?: number;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

/** Numbered section label: 40px gold rule + small uppercase text, e.g. "01 · What we build". */
export function Eyebrow({ index, children, tone = "light", className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-4 text-xs font-bold tracking-(--tracking-eyebrow) uppercase",
        tone === "dark" ? "text-gold" : "text-gold-text",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-10 bg-gold" />
      <span>
        {index !== undefined && <>{String(index).padStart(2, "0")} · </>}
        {children}
      </span>
    </p>
  );
}
