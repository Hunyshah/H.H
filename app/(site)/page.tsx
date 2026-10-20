import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Phase 1 placeholder: proves the layout shell. Replaced by the full home page in phase 2.
export default function HomePage() {
  return (
    <section className="bg-ink-950 pt-(--header-height) text-ivory">
      <div className="container-site section-y">
        <Eyebrow tone="dark">Faisalabad · Khurrianwala</Eyebrow>
        <h1 className="mt-6 max-w-4xl text-[40px] font-bold sm:text-[44px] lg:text-[68px]">
          Homes, factories &amp; landmarks, <span className="text-gold">built to last.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-on-dark">
          Design, structural engineering and construction for residential, commercial, industrial
          and civil projects across Faisalabad.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/contact#quote">Get a Free Site Visit</ButtonLink>
          <ButtonLink href="/projects" variant="outline-dark">
            View Our Work
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
