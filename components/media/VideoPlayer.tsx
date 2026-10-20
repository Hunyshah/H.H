"use client";

import Image from "next/image";
import { useState } from "react";

import { youTubeId } from "@/lib/video";
import { clsx } from "clsx";

type VideoPlayerProps = {
  url: string;
  title: string;
  className?: string;
};

/**
 * Lightweight video facade: shows a thumbnail and loads the YouTube iframe
 * only after a click. All video on the site goes through this component, so
 * switching to Mux later means changing this file only.
 */
export function VideoPlayer({ url, title, className }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const id = youTubeId(url);
  if (!id) return null;

  return (
    <div className={clsx("relative aspect-video overflow-hidden rounded-xs bg-ink-950", className)}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 size-full"
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ink-950 transition-transform duration-500 ease-arch group-hover:scale-110">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
