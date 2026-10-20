import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";

import { revealScript } from "@/components/motion/reveal-script";
import { site } from "@/lib/content/site";
import { siteUrl } from "@/lib/env";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Construction Company in Faisalabad`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: site.name,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#15112A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable}`}
      // The reveal script adds the `js` class before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
