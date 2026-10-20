import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { cacheLife, cacheTag } from "next/cache";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const OG_SIZE = { width: 1200, height: 630 };

type OgInput = {
  title: string;
  eyebrow: string;
  /** Background photo (absolute URL). */
  photoUrl: string | null;
  footer: string;
  tags?: string[];
};

/** Unsplash can resize on its side; other hosts are resized by sharp. */
function sourceUrl(url: string) {
  if (!url.startsWith("https://images.unsplash.com/")) return url;
  const u = new URL(url);
  u.search = "w=1200&h=630&fit=crop&fm=jpg&q=70";
  return u.toString();
}

async function photoDataUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(sourceUrl(url), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(OG_SIZE.width, OG_SIZE.height, { fit: "cover" })
      .jpeg({ quality: 70 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Social share image (WhatsApp, Facebook, LinkedIn): project photo, brand
 * wordmark and title at 1200×630. Rendered with Satori, then re-encoded as
 * JPEG by sharp — a photographic PNG would be ~1 MB, too large for WhatsApp
 * previews. Cached and tagged so admin edits regenerate it.
 */
export async function renderOgJpeg(input: OgInput): Promise<Uint8Array> {
  "use cache";
  cacheLife("weeks");
  cacheTag("og", ...(input.tags ?? []));

  const [sora, manrope, photo] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Sora-ExtraBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Manrope-SemiBold.ttf")),
    photoDataUrl(input.photoUrl),
  ]);

  const title = input.title.length > 90 ? `${input.title.slice(0, 87)}…` : input.title;
  const titleSize = title.length > 50 ? 54 : 66;

  const png = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#15112A",
        fontFamily: "Manrope",
      }}
    >
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>
        <img
          src={photo}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            objectFit: "cover",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          backgroundImage:
            "linear-gradient(90deg, rgba(21,17,42,0.96) 0%, rgba(21,17,42,0.88) 45%, rgba(21,17,42,0.25) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 64px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Sora", fontSize: 30, letterSpacing: 1 }}>
          <span style={{ background: "#4A3F78", color: "#F7F4EE", padding: "10px 16px" }}>H.H</span>
          <span style={{ background: "#C9A24D", color: "#15112A", padding: "10px 16px" }}>
            ASSOCIATE
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#C9A24D",
              fontSize: 21,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: 48, height: 2, background: "#C9A24D", marginRight: 18 }} />
            {input.eyebrow}
          </div>
          <div
            style={{
              marginTop: 22,
              color: "#F7F4EE",
              fontFamily: "Sora",
              fontSize: titleSize,
              lineHeight: 1.06,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", color: "#CFC9E0", fontSize: 24 }}>{input.footer}</div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Sora", data: sora, weight: 800, style: "normal" },
        { name: "Manrope", data: manrope, weight: 600, style: "normal" },
      ],
    },
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 76, mozjpeg: true })
    .toBuffer();
  return new Uint8Array(jpeg);
}

export function jpegResponse(bytes: Uint8Array) {
  return new Response(new Blob([bytes as BlobPart], { type: "image/jpeg" }), {
    headers: { "Content-Type": "image/jpeg" },
  });
}
