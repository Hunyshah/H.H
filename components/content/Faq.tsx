import { JsonLd } from "@/components/seo/JsonLd";
import type { FaqItem } from "@/lib/data/services";

/**
 * Accordion built on <details>/<summary>: keyboard accessible, works without
 * JavaScript, and every answer stays in the HTML for search engines.
 * Also emits FAQPage structured data.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <>
      <div className="border-t border-line">
        {items.map((item) => (
          <details key={item.q} className="group border-b border-line">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold tracking-(--tracking-display) text-body [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden="true" className="relative size-4 shrink-0">
                <span className="absolute top-1/2 left-0 h-px w-4 bg-gold-text" />
                <span className="absolute top-0 left-1/2 h-4 w-px bg-gold-text transition-transform duration-500 ease-arch group-open:scale-y-0" />
              </span>
            </summary>
            <p className="pb-6 text-base leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </>
  );
}
