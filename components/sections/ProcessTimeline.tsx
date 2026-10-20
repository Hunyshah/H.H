"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/components/motion/media";

type Step = { title: string; text: string };

/**
 * Five-step timeline. The gold line draws as the section scrolls and each step
 * lights up when the line reaches it (GSAP ScrollTrigger, loaded only when the
 * section approaches the viewport). Server HTML shows every step lit, so the
 * content is complete without JavaScript or with reduced motion.
 */
export function ProcessTimeline({ steps }: { steps: readonly Step[] }) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const line = el.querySelector<HTMLElement>("[data-line]");
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
      if (!line) return;

      const horizontal = window.matchMedia("(min-width: 1024px)").matches;
      const prop = horizontal ? "scaleX" : "scaleY";
      items.forEach((item) => (item.dataset.active = "false"));

      const tween = gsap.fromTo(
        line,
        { [prop]: 0 },
        {
          [prop]: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: horizontal ? "top 75%" : "top 70%",
            end: horizontal ? "bottom 45%" : "bottom 60%",
            scrub: 0.6,
            onUpdate: (self) => {
              items.forEach((item, i) => {
                const threshold = items.length > 1 ? i / (items.length - 1) : 0;
                item.dataset.active = String(self.progress >= threshold - 0.02);
              });
            },
          },
        },
      );

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(line, { clearProps: "transform" });
        items.forEach((item) => (item.dataset.active = "true"));
      };
    };

    // Load GSAP only when the timeline is close to the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          io.disconnect();
          void start();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <ol
      ref={root}
      className="relative mt-14 grid gap-10 pl-10 lg:mt-20 lg:grid-cols-5 lg:gap-8 lg:pt-12 lg:pl-0"
    >
      {/* Track + progress line: vertical on mobile, horizontal on desktop */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[7px] w-px bg-line-dark lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
      />
      <span
        aria-hidden="true"
        data-line
        className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gold lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:origin-left"
      />

      {steps.map((step, i) => (
        <li key={step.title} data-step data-active="true" className="group/step relative">
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-10 size-[15px] rounded-full border border-line-dark bg-ink-900 transition-colors duration-500 group-data-[active=true]/step:border-gold group-data-[active=true]/step:bg-gold lg:-top-12 lg:left-0"
          />
          <span className="block font-display text-sm font-bold text-muted-on-dark transition-colors duration-500 group-data-[active=true]/step:text-gold">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 text-2xl font-bold text-ivory">{step.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-on-dark">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
