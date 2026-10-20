"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";

import { quoteForm as copy } from "@/lib/content/forms";

import type { QuoteForm as QuoteFormType } from "./QuoteForm";

const QuoteForm = dynamic(() => import("./QuoteForm").then((m) => m.QuoteForm), {
  ssr: false,
  loading: () => <FormPlaceholder />,
});

/**
 * Loads the quote form (React Hook Form + Zod) only when it approaches the
 * viewport, keeping it out of the initial JavaScript of long pages like home.
 */
export function LazyQuoteForm(props: ComponentProps<typeof QuoteFormType>) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{load ? <QuoteForm {...props} /> : <FormPlaceholder />}</div>;
}

/** Same footprint as the form, so nothing shifts when it loads. */
function FormPlaceholder() {
  return (
    <div className="flex min-h-[560px] items-center justify-center rounded-xs bg-ivory p-8 md:min-h-[740px]">
      <p className="text-sm text-muted" aria-live="polite">
        {copy.loading}
      </p>
    </div>
  );
}
