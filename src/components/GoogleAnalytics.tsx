"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SITE_CONFIG } from "@/lib/seo-config";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const gaId = SITE_CONFIG.googleAnalyticsId;
  const initialInteractionSent = useRef(false);
  const scrollMilestones = useRef(new Set<number>());

  // Track page navigation changes
  useEffect(() => {
    if (!gaId || gaId === "G-XXXXXXXXXX") return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", gaId, {
        page_path: pathname,
      });
    }
  }, [pathname, gaId]);

  // Track engagement, user actions, and bot detection
  useEffect(() => {
    if (!gaId || gaId === "G-XXXXXXXXXX") return;
    if (typeof window === "undefined") return;

    // 1. Detect Bots / Headless Chrome (common for automated previewers / cloud pings)
    const isBot = Boolean(
      (navigator as any).webdriver ||
      /bot|crawler|spider|headless|lighthouse/i.test(navigator.userAgent || "")
    );

    if (isBot && (window as any).gtag) {
      (window as any).gtag("event", "bot_visit", {
        bot_ua: (navigator.userAgent || "").slice(0, 100),
        non_interaction: true,
      });
    }

    // 2. Early micro-interaction listener (pointerdown, keydown, scroll)
    const handleFirstUserAction = (e: Event) => {
      if (initialInteractionSent.current) return;
      initialInteractionSent.current = true;
      if ((window as any).gtag) {
        (window as any).gtag("event", "user_first_action", {
          action_type: e.type,
          page_path: window.location.pathname,
        });
      }
    };

    window.addEventListener("pointerdown", handleFirstUserAction, { passive: true, once: true });
    window.addEventListener("keydown", handleFirstUserAction, { passive: true, once: true });
    window.addEventListener("scroll", handleFirstUserAction, { passive: true, once: true });

    // 3. Scroll depth milestones (25%, 50%, 75%, 90%)
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = Math.round((window.scrollY / scrollHeight) * 100);

      [25, 50, 75, 90].forEach((milestone) => {
        if (progress >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          if ((window as any).gtag) {
            (window as any).gtag("event", "scroll_depth", {
              percent_scrolled: milestone,
              page_path: window.location.pathname,
            });
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 4. Engagement Heartbeats at 4s and 10s
    // GA4 requires 10s of active engagement or an interaction event to register an engaged session.
    // Firing an engagement event at 4s and 10s ensures GA4 captures real active reading time.
    const timer4s = setTimeout(() => {
      if (document.visibilityState === "visible" && (window as any).gtag) {
        (window as any).gtag("event", "engagement_heartbeat_4s", {
          page_path: window.location.pathname,
        });
      }
    }, 4000);

    const timer10s = setTimeout(() => {
      if (document.visibilityState === "visible" && (window as any).gtag) {
        (window as any).gtag("event", "engagement_heartbeat_10s", {
          page_path: window.location.pathname,
        });
      }
    }, 10000);

    // 5. Drag & Drop file intent tracking
    const handleDragEnter = (e: DragEvent) => {
      if (e.dataTransfer && Array.from(e.dataTransfer.types).includes("Files")) {
        if ((window as any).gtag) {
          (window as any).gtag("event", "file_drag_intent", {
            page_path: window.location.pathname,
          });
        }
      }
    };
    window.addEventListener("dragenter", handleDragEnter, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstUserAction);
      window.removeEventListener("keydown", handleFirstUserAction);
      window.removeEventListener("scroll", handleFirstUserAction);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("dragenter", handleDragEnter);
      clearTimeout(timer4s);
      clearTimeout(timer10s);
    };
  }, [gaId]);

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
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
