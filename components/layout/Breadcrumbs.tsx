import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/env";

export type Crumb = { label: string; href: string };

/** Visible breadcrumb trail (Home is implied first) plus BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold text-muted-on-dark">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ivory">
                    {c.label}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className="transition-colors hover:text-gold">
                      {c.label}
                    </Link>
                    <span aria-hidden="true" className="text-gold">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: `${siteUrl}${c.href === "/" ? "" : c.href}`,
          })),
        }}
      />
    </>
  );
}
