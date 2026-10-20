import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons";
import { BLUR_DATA_URL, images } from "@/lib/content/images";
import { categoryLabel } from "@/lib/content/projects";
import type { ProjectCard as ProjectCardData } from "@/lib/data/projects";
import { clsx } from "clsx";

type ProjectCardProps = {
  project: ProjectCardData;
  /** Large bento tile (2×2). */
  large?: boolean;
  sizes?: string;
  className?: string;
};

/** Image-led project card: cover, category tag, title, location and scope. */
export function ProjectCard({ project, large = false, sizes, className }: ProjectCardProps) {
  const meta = [project.location, project.scope].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={clsx(
        "group relative flex h-full flex-col justify-end overflow-hidden rounded-xs bg-ink-900 transition-transform duration-700 ease-arch motion-safe:hover:-translate-y-1.5",
        className,
      )}
    >
      <Image
        src={project.coverUrl ?? images.siteCranes}
        alt=""
        fill
        sizes={
          sizes ??
          (large
            ? "(min-width: 1024px) 620px, 100vw"
            : "(min-width: 1024px) 310px, (min-width: 640px) 50vw, 100vw")
        }
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover transition-transform duration-[1.6s] ease-arch motion-safe:group-hover:scale-[1.06]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/40 to-transparent"
      />
      <span className="absolute top-4 left-4 rounded-xs bg-ink-950/85 px-2.5 py-1.5 text-[11px] font-bold tracking-(--tracking-eyebrow) text-gold uppercase">
        {categoryLabel(project.category, true)}
      </span>
      <div className="relative flex items-end justify-between gap-4 p-5 sm:p-6">
        <div>
          <h3 className={clsx("font-bold text-ivory", large ? "text-2xl sm:text-3xl" : "text-xl")}>
            <span className="draw-line">{project.title}</span>
          </h3>
          {meta && <p className="mt-1.5 text-sm text-muted-on-dark">{meta}</p>}
        </div>
        <ArrowUpRightIcon
          size={20}
          className="mb-1 shrink-0 text-gold transition-transform duration-500 ease-arch group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  );
}
