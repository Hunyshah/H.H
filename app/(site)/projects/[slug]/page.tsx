import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Markdown } from "@/components/content/Markdown";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BeforeAfter } from "@/components/media/BeforeAfter";
import { ProjectGallery } from "@/components/media/ProjectGallery";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { DetailSkeleton } from "@/components/layout/DetailSkeleton";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { ShareButtons } from "@/components/projects/ShareButtons";
import { CtaBand } from "@/components/sections/CtaBand";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { beforeAfterSection } from "@/lib/content/home";
import { BLUR_DATA_URL, images } from "@/lib/content/images";
import { categoryToProjectType, projectDetail as copy } from "@/lib/content/pages";
import { categoryLabel } from "@/lib/content/projects";
import {
  getAllProjects,
  getProjectBySlug,
  getRelatedProjects,
  type ProjectDetail,
} from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/env";

// Placeholder param so the build has at least one path when there are no
// projects yet (Cache Components requires a non-empty list). It 404s.
const EMPTY_PLACEHOLDER = "__no-projects__";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.length > 0
    ? projects.map((p) => ({ slug: p.slug }))
    : [{ slug: EMPTY_PLACEHOLDER }];
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const title =
    project.seoTitle || `${project.title}${project.location ? `, ${project.location}` : ""}`;
  const description =
    project.seoDescription ||
    project.summary ||
    `${categoryLabel(project.category)} project by H.H Associate${project.location ? ` in ${project.location}` : ""}.`;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { type: "article", title, description, url: `/projects/${project.slug}` },
  };
}

// params are awaited inside <Suspense> so Next.js can keep a generic App Shell
// for this route (new projects published from the admin render on demand and
// re-render after cache invalidation). Known slugs still prerender fully.
export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  if (!project) notFound();

  const related = await getRelatedProjects(project.category, project.slug);
  const imagesOnly = project.media.filter((m) => m.type === "image" && m.url);
  const videos = project.media.filter((m) => m.type === "video" && m.videoUrl);
  const firstBefore = imagesOnly.find((m) => m.phase === "before");
  const firstAfter = imagesOnly.find((m) => m.phase === "after");

  const groups = (["before", "progress", "after"] as const)
    .map((phase) => ({
      key: phase,
      label: copy.phases[phase],
      images: imagesOnly
        .filter((m) => m.phase === phase)
        .map((m) => ({ url: m.url!, alt: m.alt, caption: m.caption })),
    }))
    .filter((g) => g.images.length > 0);

  const cover = project.coverUrl ?? firstAfter?.url ?? images.siteCranes;
  const projectType = categoryToProjectType[project.category];

  return (
    <article>
      {/* Header + full-width cover */}
      <header className="relative bg-ink-950 pt-(--header-height) text-ivory">
        <div className="container-site pt-8 md:pt-12">
          <Reveal variant="fade">
            <Breadcrumbs
              items={[
                { label: copy.breadcrumb, href: "/projects" },
                { label: project.title, href: `/projects/${project.slug}` },
              ]}
            />
          </Reveal>
          <div className="mt-10 flex flex-col gap-6 pb-12 md:mt-14 lg:flex-row lg:items-end lg:justify-between lg:pb-16">
            <div className="max-w-3xl">
              <Reveal variant="fade" delay={80}>
                <Eyebrow tone="dark">
                  {categoryLabel(project.category)}
                  {project.location ? ` · ${project.location}` : ""}
                </Eyebrow>
              </Reveal>
              <Reveal variant="rise" delay={140}>
                <h1 className="mt-5 text-[36px] leading-[1.06] font-extrabold sm:text-[44px] lg:text-[60px]">
                  {project.title}
                </h1>
              </Reveal>
              {project.summary && (
                <Reveal variant="rise" delay={240}>
                  <p className="mt-5 text-base leading-relaxed text-muted-on-dark sm:text-lg">
                    {project.summary}
                  </p>
                </Reveal>
              )}
            </div>
            {project.status === "ongoing" && (
              <Reveal delay={300} className="shrink-0">
                <span className="inline-flex items-center gap-2 rounded-xs border border-gold/60 px-3 py-2 text-xs font-bold tracking-(--tracking-eyebrow) text-gold uppercase">
                  <span aria-hidden="true" className="size-2 rounded-full bg-gold" />
                  {copy.statusLabels.ongoing}
                </span>
              </Reveal>
            )}
          </div>
        </div>
        <div className="relative z-10 container-site">
          <div className="relative overflow-hidden rounded-xs">
            {project.heroVideoUrl ? (
              <VideoPlayer
                url={project.heroVideoUrl}
                title={project.title}
                poster={cover}
                preload
                sizes="(min-width: 1280px) 1232px, 100vw"
                className="aspect-[4/3] sm:aspect-video lg:aspect-[21/9]"
              />
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xs bg-ink-900 sm:aspect-video lg:aspect-[21/9]">
                <Image
                  src={cover}
                  alt={`${project.title}${project.location ? `, ${project.location}` : ""}`}
                  fill
                  preload
                  fetchPriority="high"
                  sizes="(min-width: 1280px) 1232px, 100vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
            )}
            <Reveal
              variant="curtain"
              delay={150}
              className="pointer-events-none absolute inset-0 bg-ink-950"
            />
          </div>
        </div>
        {/* Ivory runs behind the lower half of the cover */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[18%] bg-ivory" />
      </header>

      {/* Story + facts */}
      <section className="bg-ivory section-y">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_380px] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>{copy.story}</Eyebrow>
            </Reveal>
            {project.story && (
              <Reveal delay={100} className="mt-8">
                <Markdown source={project.story} />
              </Reveal>
            )}
            <Reveal delay={150} className="mt-12">
              <ShareButtons
                url={`${siteUrl}/projects/${project.slug}`}
                title={project.title}
                labels={{ share: copy.share, copy: copy.copyLink, copied: copy.copied }}
              />
            </Reveal>
          </div>
          <Reveal
            as="aside"
            delay={120}
            className="lg:sticky lg:top-[calc(var(--header-height)+32px)] lg:self-start"
          >
            <Facts project={project} />
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      {groups.length > 0 && (
        <section aria-labelledby="gallery-title" className="border-t border-line bg-sand section-y">
          <div className="container-site">
            <Reveal>
              <h2 id="gallery-title" className="text-[32px] font-bold lg:text-[46px]">
                {copy.gallery}
              </h2>
            </Reveal>
            <div className="mt-10">
              <ProjectGallery groups={groups} />
            </div>
          </div>
        </section>
      )}

      {/* Before / after */}
      {firstBefore?.url && firstAfter?.url && (
        <section aria-labelledby="ba-title" className="bg-ivory section-y">
          <div className="container-site">
            <Reveal>
              <h2 id="ba-title" className="text-[32px] font-bold lg:text-[46px]">
                {copy.beforeAfter}
              </h2>
            </Reveal>
            <Reveal variant="wipe" className="mt-10">
              <BeforeAfter
                before={{ url: firstBefore.url, alt: firstBefore.alt }}
                after={{ url: firstAfter.url, alt: firstAfter.alt }}
                labels={{
                  before: beforeAfterSection.before,
                  after: beforeAfterSection.after,
                  slider: beforeAfterSection.sliderLabel,
                }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section aria-labelledby="videos-title" className="bg-ink-950 section-y text-ivory">
          <div className="container-site">
            <Reveal>
              <h2 id="videos-title" className="text-[32px] font-bold lg:text-[46px]">
                {copy.videos}
              </h2>
            </Reveal>
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {videos.map((v) => (
                <Reveal as="li" key={v.id}>
                  <VideoPlayer url={v.videoUrl!} title={v.caption || project.title} />
                  {v.caption && <p className="mt-3 text-sm text-muted-on-dark">{v.caption}</p>}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {project.testimonial && (project.testimonial.quote || project.testimonial.videoUrl) && (
        <section aria-labelledby="testimonial-title" className="bg-sand section-y">
          <div className="container-site grid gap-10 lg:grid-cols-[0.4fr_1fr]">
            <Reveal>
              <Eyebrow>
                <span id="testimonial-title">{copy.testimonial}</span>
              </Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              {project.testimonial.videoUrl && (
                <VideoPlayer
                  url={project.testimonial.videoUrl}
                  title={`${project.testimonial.clientName} testimonial`}
                  className="mb-8 max-w-2xl"
                />
              )}
              {project.testimonial.quote && (
                <blockquote className="font-display text-2xl leading-snug font-semibold tracking-(--tracking-display) sm:text-3xl">
                  “{project.testimonial.quote}”
                </blockquote>
              )}
              <p className="mt-6 font-bold">{project.testimonial.clientName}</p>
            </Reveal>
          </div>
        </section>
      )}

      <CtaBand
        whatsapp={settings.whatsapp}
        title={copy.similarTitle}
        text={copy.similarText}
        ctaLabel={copy.similarCta}
        href={`/contact?type=${encodeURIComponent(projectType)}#quote`}
      />

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-ivory section-y">
          <div className="container-site">
            <Reveal>
              <h2 id="related-title" className="text-[32px] font-bold lg:text-[46px]">
                {copy.related}
              </h2>
            </Reveal>
            <ProjectsGrid projects={related} />
          </div>
        </section>
      )}
    </article>
  );
}

function Facts({ project }: { project: ProjectDetail }) {
  const rows: [string, string | null][] = [
    [copy.location, project.location],
    [copy.category, categoryLabel(project.category)],
    [copy.plotSize, project.plotSize],
    [
      copy.coveredArea,
      project.coveredAreaSqft ? `${project.coveredAreaSqft.toLocaleString("en-US")} sq ft` : null,
    ],
    [copy.floors, project.floors != null ? String(project.floors) : null],
    [copy.scope, project.scope],
    [copy.year, project.year ? String(project.year) : null],
    [copy.status, copy.statusLabels[project.status]],
  ];

  return (
    <div className="rounded-xs bg-ink-950 p-7 text-ivory sm:p-8">
      <h2 className="text-xs font-bold tracking-(--tracking-eyebrow) text-gold uppercase">
        {copy.facts}
      </h2>
      <dl className="mt-5">
        {rows
          .filter((r): r is [string, string] => Boolean(r[1]))
          .map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-6 border-b border-line-dark py-3.5 last:border-b-0"
            >
              <dt className="text-sm text-muted-on-dark">{label}</dt>
              <dd className="text-right text-sm font-bold">{value}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
