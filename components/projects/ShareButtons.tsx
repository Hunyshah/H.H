"use client";

import { useState } from "react";

import { FacebookIcon, WhatsAppIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics/events";

type ShareButtonsProps = {
  url: string;
  title: string;
  labels: { share: string; copy: string; copied: string };
};

const button =
  "inline-flex min-h-11 items-center gap-2 rounded-xs border border-line px-4 text-sm font-bold text-body transition-colors hover:border-ink-950";

export function ShareButtons({ url, title, labels }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const text = `${title} — ${url}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt(labels.copy, url);
    }
  };

  return (
    <div>
      <p className="text-xs font-bold tracking-(--tracking-eyebrow) text-gold-text uppercase">
        {labels.share}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { placement: "share" })}
          className={button}
        >
          <WhatsAppIcon size={18} className="text-[#128C7E]" />
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={button}
        >
          <FacebookIcon size={18} className="text-[#1877F2]" />
          Facebook
        </a>
        <button type="button" onClick={copy} className={button}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
          </svg>
          <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
        </button>
      </div>
    </div>
  );
}
