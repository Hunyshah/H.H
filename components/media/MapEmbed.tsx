"use client";

import { useState } from "react";

import { MapPinIcon } from "@/components/icons";

type MapEmbedProps = {
  src: string | null;
  address: string;
  labels: { title: string; load: string; notice: string; open: string; placeholder: string };
};

/**
 * Google Maps behind a click-to-load facade: no third-party requests (or
 * cookies) until the visitor asks for the map. Falls back to a directions link
 * when no embed URL is configured.
 */
export function MapEmbed({ src, address, labels }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/[[\]]/g, ""))}`;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xs bg-ink-900 text-ivory sm:aspect-[16/9]">
      {src && loaded ? (
        <iframe
          src={src}
          title={labels.title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 [background-image:linear-gradient(var(--color-line-dark)_1px,transparent_1px),linear-gradient(to_right,var(--color-line-dark)_1px,transparent_1px)] [background-size:48px_48px] p-6 text-center">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-gold text-ink-950">
            <MapPinIcon size={26} />
          </span>
          <p className="max-w-sm text-sm text-muted-on-dark">{address}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {src ? (
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="inline-flex min-h-11 items-center rounded-xs bg-gold px-5 text-sm font-bold text-ink-950 hover:bg-gold-hover"
              >
                {labels.load}
                <span className="sr-only"> ({labels.notice})</span>
              </button>
            ) : (
              <p className="w-full text-xs text-muted-on-dark">{labels.placeholder}</p>
            )}
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-xs border border-ivory/35 px-5 text-sm font-bold text-ivory hover:border-gold hover:text-gold"
            >
              {labels.open}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
