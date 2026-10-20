import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSection } from "@/lib/content/home";

import { ProcessTimeline } from "./ProcessTimeline";

export function Process() {
  return (
    <section aria-labelledby="process-title" className="bg-ink-900 section-y text-ivory">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="process-title"
            index={4}
            eyebrow={processSection.eyebrow}
            title={processSection.title}
            intro={processSection.intro}
            tone="dark"
          />
          <Reveal className="shrink-0">
            <ButtonLink href="/process" variant="outline-dark">
              {processSection.cta}
            </ButtonLink>
          </Reveal>
        </div>
        <ProcessTimeline steps={processSection.steps} />
      </div>
    </section>
  );
}
