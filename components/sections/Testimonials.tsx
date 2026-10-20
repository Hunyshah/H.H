import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonialsSection as copy } from "@/lib/content/home";
import type { Testimonial } from "@/lib/data/testimonials";

import { TestimonialsCarousel } from "./TestimonialsCarousel";

/** Published testimonials (text or video). Renders nothing when there are none. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-title" className="bg-sand section-y">
      <div className="container-site">
        <SectionHeading id="testimonials-title" eyebrow={copy.eyebrow} title={copy.title} />
        <TestimonialsCarousel items={items} />
      </div>
    </section>
  );
}
