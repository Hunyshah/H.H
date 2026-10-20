import { site } from "@/lib/content/site";
import type { SiteSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/env";

import { JsonLd } from "./JsonLd";

/** Values still in [brackets] are placeholders and are left out of structured data. */
const real = (v: string | null | undefined) => (v && !/\[.*\]/.test(v) ? v : undefined);

/** GeneralContractor (a LocalBusiness subtype) for local search. */
export function OrganizationJsonLd({ settings }: { settings: SiteSettings }) {
  const street = real(settings.address.split(",")[0]?.trim());
  const sameAs = Object.values(settings.socials).filter((v): v is string => Boolean(v));

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "GeneralContractor",
        "@id": `${siteUrl}/#organization`,
        name: site.name,
        slogan: site.tagline,
        description: site.description,
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        image: `${siteUrl}/opengraph-image`,
        telephone: real(settings.phone),
        email: real(settings.email),
        address: {
          "@type": "PostalAddress",
          ...(street ? { streetAddress: street } : {}),
          addressLocality: site.locality,
          addressRegion: site.region,
          addressCountry: "PK",
        },
        areaServed: [
          { "@type": "City", name: site.city },
          { "@type": "Place", name: site.locality },
        ],
        knowsAbout: [
          "House construction",
          "Factory construction",
          "Commercial building construction",
          "Steel and PEB sheds",
          "Architectural design",
          "Structural engineering",
        ],
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  );
}
