import { WhatsAppIcon } from "@/components/icons";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink, buttonBase, buttonVariants } from "@/components/ui/ButtonLink";
import { whatsappHref } from "@/lib/contact";
import { ctaBand } from "@/lib/content/pages";
import { ui } from "@/lib/content/site";
import { cn } from "@/lib/utils";

type CtaBandProps = {
  whatsapp: string;
  title?: string;
  text?: string;
  /** Quote form link, e.g. with a pre-selected project type. */
  href?: string;
  ctaLabel?: string;
};

/** Closing call to action used on inner pages (keeps them free of the form's JS). */
export function CtaBand({
  whatsapp,
  title = ctaBand.title,
  text = ctaBand.text,
  href = "/contact#quote",
  ctaLabel = ctaBand.estimate,
}: CtaBandProps) {
  return (
    <section className="bg-ink-950 text-ivory">
      <div aria-hidden="true" className="h-px bg-gold/60" />
      <div className="container-site flex flex-col gap-10 py-20 md:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="text-[32px] font-bold sm:text-[34px] lg:text-[46px]">{title}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 text-lg text-muted-on-dark">{text}</p>
          </Reveal>
        </div>
        <Reveal delay={200} className="flex flex-wrap gap-4">
          <MagneticButton>
            <ButtonLink href={href} className="px-7">
              {ctaLabel}
            </ButtonLink>
          </MagneticButton>
          <TrackedLink
            href={whatsappHref(whatsapp, ui.whatsappGreeting)}
            event="whatsapp_click"
            placement="cta_band"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonBase, buttonVariants["outline-dark"], "px-7")}
          >
            <WhatsAppIcon size={18} />
            {ctaBand.whatsapp}
          </TrackedLink>
        </Reveal>
      </div>
    </section>
  );
}
