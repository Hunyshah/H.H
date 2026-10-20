import type { Metadata } from "next";

import { ThankYouActions } from "@/components/forms/ThankYouActions";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { thankYou as copy } from "@/lib/content/forms";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: copy.metaTitle,
  robots: { index: false, follow: false },
};

export default async function ThankYouPage() {
  const settings = await getSiteSettings();

  return (
    <section className="relative isolate flex min-h-[80svh] items-center bg-ink-950 pt-(--header-height) text-ivory">
      <div className="container-site py-20">
        <Reveal variant="fade">
          <Eyebrow tone="dark">{copy.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 max-w-3xl text-[38px] leading-[1.06] font-extrabold sm:text-[44px] lg:text-[62px]">
            {copy.title}
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 max-w-xl text-lg text-muted-on-dark">{copy.text}</p>
        </Reveal>
        <Reveal delay={300} className="mt-10 flex flex-wrap gap-4">
          <ThankYouActions whatsapp={settings.whatsapp} />
          <ButtonLink href="/projects" variant="outline-dark">
            {copy.viewProjects}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
