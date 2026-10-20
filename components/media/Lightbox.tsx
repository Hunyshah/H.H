"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { CloseIcon } from "@/components/icons";

export type LightboxImage = { url: string; alt: string; caption?: string | null };

type LightboxProps = {
  images: LightboxImage[];
  startIndex: number;
  onClose: () => void;
};

const MAX_SCALE = 4;
const ZOOM_STEP = 2.5;
const SWIPE_DISTANCE = 60;

/**
 * Full-screen image viewer.
 * Keyboard: ←/→ previous/next, +/− zoom, Esc close; focus is trapped inside.
 * Touch: swipe to change image, pinch or double-tap to zoom, drag to pan.
 * Mouse: double-click to zoom, drag to pan when zoomed.
 */
export default function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const view = useRef({ scale: 1, x: 0, y: 0 });
  const gesture = useRef({
    pointers: new Map<number, { x: number; y: number }>(),
    startDist: 0,
    startScale: 1,
    swipeX: 0,
    lastTap: 0,
    moved: false,
  });

  const total = images.length;
  const image = images[index];

  const apply = useCallback((animate: boolean) => {
    const el = layerRef.current;
    if (!el) return;
    const { scale, x, y } = view.current;
    el.style.transition = animate ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
    el.style.transform = `translate3d(${x + gesture.current.swipeX}px, ${y}px, 0) scale(${scale})`;
  }, []);

  const reset = useCallback(() => {
    view.current = { scale: 1, x: 0, y: 0 };
    gesture.current.swipeX = 0;
    setZoomed(false);
    apply(true);
  }, [apply]);

  const go = useCallback(
    (dir: 1 | -1) => {
      view.current = { scale: 1, x: 0, y: 0 };
      gesture.current.swipeX = 0;
      setZoomed(false);
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  const zoomTo = useCallback(
    (scale: number, originX = 0, originY = 0) => {
      const s = Math.min(MAX_SCALE, Math.max(1, scale));
      const prev = view.current;
      // Keep the point under the cursor/finger in place while zooming.
      const ratio = s / prev.scale;
      view.current =
        s === 1
          ? { scale: 1, x: 0, y: 0 }
          : {
              scale: s,
              x: originX - (originX - prev.x) * ratio,
              y: originY - (originY - prev.y) * ratio,
            };
      setZoomed(s > 1);
      apply(true);
    },
    [apply],
  );

  // Reset the transform whenever the image changes.
  useEffect(() => {
    apply(false);
  }, [index, apply]);

  // Scroll lock, initial focus, focus restore.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  // Keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") zoomTo(view.current.scale * 1.5);
      else if (e.key === "-") zoomTo(view.current.scale / 1.5);
      else if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose, zoomTo]);

  // Pointer gestures on the stage.
  const local = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const g = gesture.current;
    g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    g.moved = false;
    if (g.pointers.size === 2) {
      const [a, b] = [...g.pointers.values()];
      g.startDist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      g.startScale = view.current.scale;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    const prev = g.pointers.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (Math.abs(dx) + Math.abs(dy) > 2) g.moved = true;

    if (g.pointers.size === 2) {
      const [a, b] = [...g.pointers.values()];
      const dist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      view.current.scale = Math.min(MAX_SCALE, Math.max(1, (g.startScale * dist) / g.startDist));
      apply(false);
      return;
    }
    if (view.current.scale > 1) {
      view.current.x += dx;
      view.current.y += dy;
    } else if (total > 1) {
      g.swipeX += dx;
    }
    apply(false);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    g.pointers.delete(e.pointerId);
    if (g.pointers.size > 0) return;

    if (view.current.scale <= 1.02 && Math.abs(g.swipeX) > SWIPE_DISTANCE) {
      go(g.swipeX < 0 ? 1 : -1);
      return;
    }
    g.swipeX = 0;
    if (view.current.scale <= 1.02) {
      view.current = { scale: 1, x: 0, y: 0 };
      setZoomed(false);
    } else {
      setZoomed(true);
    }
    apply(true);

    // Double tap / double click toggles zoom.
    if (!g.moved) {
      const now = performance.now();
      if (now - g.lastTap < 300) {
        const p = local(e);
        if (view.current.scale > 1) reset();
        else zoomTo(ZOOM_STEP, p.x, p.y);
        g.lastTap = 0;
      } else {
        g.lastTap = now;
      }
    }
  };

  if (!image) return null;

  const control =
    "inline-flex size-12 items-center justify-center rounded-full border border-white/20 bg-ink-950/70 text-ivory transition-colors hover:border-gold hover:text-gold";

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${total}`}
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex flex-col bg-ink-950/97 text-ivory"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="text-sm font-semibold text-muted-on-dark tabular-nums" aria-live="polite">
          {index + 1} / {total}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => (zoomed ? reset() : zoomTo(ZOOM_STEP))}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
            aria-pressed={zoomed}
            className={control}
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
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5M8 11h6" />
              {!zoomed && <path d="M11 8v6" />}
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-autofocus
            className={control}
          >
            <CloseIcon size={22} />
          </button>
        </div>
      </div>

      <div
        className="relative min-h-0 flex-1 touch-none overflow-hidden select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: zoomed ? "grab" : "zoom-in" }}
      >
        <div ref={layerRef} className="absolute inset-0 will-change-transform">
          <Image
            key={image.url}
            src={image.url}
            alt={image.alt}
            fill
            sizes="100vw"
            quality={75}
            draggable={false}
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {total > 1 ? (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className={control}
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
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        ) : (
          <span />
        )}
        <p className="line-clamp-2 max-w-2xl text-center text-sm text-muted-on-dark">
          {image.caption || image.alt}
        </p>
        {total > 1 ? (
          <button type="button" onClick={() => go(1)} aria-label="Next image" className={control}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>,
    document.body,
  );
}
