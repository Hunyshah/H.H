"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import { BLUR_DATA_URL } from "@/lib/content/images";
import { projectDetail } from "@/lib/content/pages";

import type { LightboxImage } from "./Lightbox";

// The viewer is only downloaded when someone opens an image.
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

type GalleryGroup = { key: string; label: string; images: LightboxImage[] };

type ProjectGalleryProps = { groups: GalleryGroup[] };

/** Thumbnails grouped by phase (before / construction / completed), opening a lightbox. */
export function ProjectGallery({ groups }: ProjectGalleryProps) {
  const all = groups.flatMap((g) => g.images);
  const [open, setOpen] = useState<number | null>(null);

  // Index of each group's first image within the flattened list.
  const starts = groups.map((_, gi) =>
    groups.slice(0, gi).reduce((n, g) => n + g.images.length, 0),
  );

  return (
    <>
      <div className="grid gap-12">
        {groups.map((group, gi) => {
          const start = starts[gi] ?? 0;
          return (
            <div key={group.key}>
              <h3 className="flex items-center gap-4 text-xs font-bold tracking-(--tracking-eyebrow) text-gold-text uppercase">
                <span aria-hidden="true" className="h-px w-10 bg-gold" />
                {group.label}
                <span className="font-semibold text-muted">({group.images.length})</span>
              </h3>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {group.images.map((img, i) => {
                  const n = start + i;
                  return (
                    <li key={`${img.url}-${n}`}>
                      <button
                        type="button"
                        onClick={() => setOpen(n)}
                        aria-label={`${projectDetail.viewImage(n + 1, all.length)}: ${img.alt}`}
                        className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xs bg-ink-900"
                      >
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 400px, 50vw"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                          className="object-cover transition-transform duration-[1.2s] ease-arch motion-safe:group-hover:scale-105"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      {open !== null && <Lightbox images={all} startIndex={open} onClose={() => setOpen(null)} />}
    </>
  );
}
