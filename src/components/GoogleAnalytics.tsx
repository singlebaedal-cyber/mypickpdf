"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SITE_CONFIG } from "@/lib/seo-config";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const gaId = SITE_CONFIG.googleAnalyticsId;

  useEffect(() => {
    if (!gaId || gaId === "G-XXXXXXXXXX") return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", gaId, {
        page_path: pathname,
      });
    }
  }, [pathname, gaId]);

  if (!gaId || gaId === "G-XXXXXXXXXX") {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
