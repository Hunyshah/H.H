import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Small, safe markdown renderer for admin-written text (project stories,
 * service bodies). Supports headings (##, ###), paragraphs, bullet and numbered
 * lists, **bold**, *italic* and [links](url). Output is React elements only —
 * no raw HTML is ever injected.
 */
export function Markdown({
  source,
  tone = "light",
  className,
}: {
  source: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const blocks = source
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/);
  const text = tone === "dark" ? "text-muted-on-dark" : "text-muted";
  const strong = tone === "dark" ? "text-ivory" : "text-body";

  return (
    <div className={cn("grid gap-5 text-base leading-relaxed sm:text-[17px]", text, className)}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const heading = block.match(/^(#{2,4})\s+(.+)$/);
        if (heading && lines.length === 1) {
          const level = heading[1]!.length;
          const Tag = level === 2 ? "h2" : "h3";
          return (
            <Tag
              key={i}
              className={cn(
                "mt-4 font-bold first:mt-0",
                strong,
                level === 2 ? "text-2xl sm:text-[28px]" : "text-xl",
              )}
            >
              {inline(heading[2]!)}
            </Tag>
          );
        }
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i} className="grid gap-2.5">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-gold" />
                  <span>{inline(l.replace(/^\s*[-*]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol
              key={i}
              className="grid list-decimal gap-2.5 pl-5 marker:font-bold marker:text-gold-text"
            >
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""))}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    if (/^\*[^*]/.test(part) && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const safe = /^(https?:\/\/|\/|mailto:|tel:)/.test(href!) ? href! : "#";
      return safe.startsWith("/") ? (
        <Link
          key={i}
          href={safe}
          className="font-semibold text-gold-text underline underline-offset-4"
        >
          {label}
        </Link>
      ) : (
        <a
          key={i}
          href={safe}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-semibold text-gold-text underline underline-offset-4"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}
