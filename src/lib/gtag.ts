// Google Analytics 4 (GA4) Event Helper

import { SITE_CONFIG } from "./seo-config";

export const GA_TRACKING_ID = SITE_CONFIG.googleAnalyticsId;

// Log pageviews
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag && GA_TRACKING_ID && GA_TRACKING_ID !== "G-XXXXXXXXXX") {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events (e.g. PDF conversion, download, tool usage)
export const trackEvent = (
  action: string,
  category: string = "general",
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && (window as any).gtag && GA_TRACKING_ID && GA_TRACKING_ID !== "G-XXXXXXXXXX") {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
