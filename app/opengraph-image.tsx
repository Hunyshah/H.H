import { images } from "@/lib/content/images";
import { site } from "@/lib/content/site";
import { siteUrl } from "@/lib/env";
import { OG_SIZE, jpegResponse, renderOgJpeg } from "@/lib/og/render";

export const alt = `${site.name} — construction and civil engineering in Faisalabad`;
export const size = OG_SIZE;
export const contentType = "image/jpeg";

export default async function Image() {
  return jpegResponse(
    await renderOgJpeg({
      title: "Homes, factories & landmarks, built to last.",
      eyebrow: "Construction · Faisalabad · Khurrianwala",
      photoUrl: images.factoryHall,
      footer: `${site.tagline} · ${new URL(siteUrl).host}`,
    }),
  );
}
