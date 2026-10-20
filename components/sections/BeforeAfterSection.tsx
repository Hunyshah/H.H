import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons";
import { BeforeAfter } from "@/components/media/BeforeAfter";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { beforeAfterSection as copy } from "@/lib/content/home";
import type { BeforeAfterPair } from "@/lib/data/projects";

export function BeforeAfterSection({ pair }: { pair: BeforeAfterPair | null }) {
  if (!pair) return null;

  return (
    <section aria-labelledby="before-after-title" className="bg-ivory section-y">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="before-after-title" eyebrow={copy.eyebrow} title={copy.title} />
          <Reveal>
            <Link
              href={`/projects/${pair.projectSlug}`}
              className="group inline-flex min-h-11 items-center gap-2 font-bold text-body"
            >
              <span className="draw-line">
                {copy.viewProject}: {pair.projectTitle}
              </span>
              <ArrowUpRightIcon size={18} className="text-gold-text" />
            </Link>
          </Reveal>
        </div>
        <Reveal variant="wipe" className="mt-10 lg:mt-14">
          <BeforeAfter
            before={pair.before}
            after={pair.after}
            labels={{ before: copy.before, after: copy.after, slider: copy.sliderLabel }}
          />
        </Reveal>
      </div>
    </section>
  );
}
