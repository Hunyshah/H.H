"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

import { BLUR_DATA_URL } from "@/lib/content/images";

type BeforeAfterProps = {
  before: { url: string; alt: string };
  after: { url: string; alt: string };
  labels: { before: string; after: string; slider: string };
  sizes?: string;
};

/**
 * Draggable before/after comparison. A native range input (invisible, covering
 * the image) handles mouse, touch and keyboard, so it is accessible for free.
 */
export function BeforeAfter({
  before,
  after,
  labels,
  sizes = "(min-width: 1280px) 1232px, 100vw",
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-xs bg-ink-900 select-none has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-gold sm:aspect-[16/9]"
      style={{ "--pos": `${position}%` } as CSSProperties}
    >
      <Image
        src={after.url}
        alt={after.alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover"
      />
      <div className="absolute inset-0 [clip-path:inset(0_calc(100%-var(--pos))_0_0)]">
        <Image
          src={before.url}
          alt={before.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-xs bg-ink-950/85 px-3 py-1.5 text-xs font-bold tracking-(--tracking-eyebrow) text-ivory uppercase">
        {labels.before}
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-xs bg-gold px-3 py-1.5 text-xs font-bold tracking-(--tracking-eyebrow) text-ink-950 uppercase">
        {labels.after}
      </span>

      {/* Divider + handle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-(--pos) w-0.5 -translate-x-1/2 bg-gold"
      >
        <span className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-ink-950 text-gold">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={labels.slider}
        aria-valuetext={`${position}% ${labels.before.toLowerCase()}`}
        className="absolute inset-0 size-full cursor-ew-resize appearance-none opacity-0"
      />
    </div>
  );
}
