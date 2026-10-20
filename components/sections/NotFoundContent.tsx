import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function NotFoundContent() {
  return (
    <section className="bg-ink-950 pt-(--header-height) text-ivory">
      <div className="container-site section-y">
        <Eyebrow tone="dark">404</Eyebrow>
        <h1 className="mt-6 text-[40px] font-bold lg:text-[62px]">This page could not be found.</h1>
        <p className="mt-6 max-w-xl text-lg text-muted-on-dark">
          The link may be old or the project may have moved.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/projects">View Our Work</ButtonLink>
          <ButtonLink href="/" variant="outline-dark">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
