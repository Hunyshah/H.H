"use client";

import Link from "next/link";
import { useRef } from "react";

import { VideoPlayer } from "@/components/media/VideoPlayer";
import { testimonialsSection as copy } from "@/lib/content/home";
import type { Testimonial } from "@/lib/data/testimonials";

/** Scroll-snap carousel: native swipe on touch, arrow buttons on desktop. */
export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? el.clientWidth) + 20), behavior: "smooth" });
  };

  return (
    <>
      {items.length > 1 && (
        <div className="mt-8 hidden justify-end gap-2 md:flex">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => scroll(dir)}
              aria-label={dir < 0 ? copy.previous : copy.next}
              className="inline-flex size-12 items-center justify-center rounded-full border border-line text-body transition-colors hover:border-ink-950"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d={dir < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
              </svg>
            </button>
          ))}
        </div>
      )}
      <ul
        ref={track}
        className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:scroll-px-0 md:px-0"
      >
        {items.map((t) => (
          <li
            key={t.id}
            className="flex w-[86%] shrink-0 snap-start flex-col rounded-xs border border-line bg-ivory p-7 sm:w-[60%] lg:w-[calc((100%-40px)/3)]"
          >
            {t.videoUrl && (
              <VideoPlayer
                url={t.videoUrl}
                title={`${t.clientName} testimonial`}
                className="mb-6"
              />
            )}
            {t.rating && (
              <p className="text-gold" aria-label={`Rated ${t.rating} out of 5`}>
                {"★".repeat(t.rating)}
                <span className="text-line">{"★".repeat(5 - t.rating)}</span>
              </p>
            )}
            {t.quote && (
              <blockquote className="mt-4 font-display text-lg leading-snug font-semibold tracking-(--tracking-display) text-body">
                “{t.quote}”
              </blockquote>
            )}
            <footer className="mt-auto pt-6 text-sm">
              <span className="block font-bold text-body">{t.clientName}</span>
              {t.project && (
                <Link
                  href={`/projects/${t.project.slug}`}
                  className="text-gold-text underline-offset-4 hover:underline"
                >
                  {t.project.title}
                </Link>
              )}
            </footer>
          </li>
        ))}
      </ul>
    </>
  );
}
