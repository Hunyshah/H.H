import Script from "next/script";

import { AttributionCapture } from "./AttributionCapture";
import { PixelPageViews } from "./PixelPageViews";
import { VercelAnalytics } from "./VercelAnalytics";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const VERCEL = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "1";

const safeId = (id: string) => /^[\w-]+$/.test(id);

/**
 * Third-party analytics, each loaded only when its env var is set.
 * GA4 and the Pixel queue events immediately but download their libraries
 * after the page has loaded, so they never compete with LCP.
 * GA4 tracks client-side navigations itself (enhanced measurement).
 */
export function Analytics() {
  return (
    <>
      <AttributionCapture />

      {GA4_ID && safeId(GA4_ID) && (
        <>
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="lazyOnload"
          />
        </>
      )}

      {PIXEL_ID && /^\d+$/.test(PIXEL_ID) && (
        <>
          <Script id="meta-pixel" strategy="lazyOnload">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
          </Script>
          <PixelPageViews />
        </>
      )}

      {VERCEL && <VercelAnalytics />}
    </>
  );
}
