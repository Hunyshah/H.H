import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  index?: number;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  /** Use h1 for page-level headings; defaults to h2. */
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  tone = "light",
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Reveal>
        <Eyebrow index={index} tone={tone}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <Reveal delay={80}>
        <Heading
          id={id}
          className={cn(
            "mt-5 text-[32px] font-bold sm:text-[34px] lg:text-[46px]",
            tone === "dark" ? "text-ivory" : "text-body",
          )}
        >
          {title}
        </Heading>
      </Reveal>
      {intro && (
        <Reveal delay={160}>
          <p
            className={cn(
              "mt-5 text-base leading-relaxed sm:text-lg",
              tone === "dark" ? "text-muted-on-dark" : "text-muted",
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
