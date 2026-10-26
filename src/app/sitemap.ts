import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo-config";
import { GUIDE_ARTICLES } from "@/lib/guides-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;

  const coreRoutes = [
    { url: "", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/pdf-to-hwp", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/edit-pdf", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/merge-pdf", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/compress-pdf", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/split-pdf", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/translate-pdf", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/rotate-pdf", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/ocr-pdf", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/add-page-numbers", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/add-watermark", priority: 0.9, changeFrequency: "weekly" as const },
    
    // Video & Media Tools
    { url: "/compress-video", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/video-to-gif", priority: 0.9, changeFrequency: "weekly" as const },
    
    // To PDF
    { url: "/image-to-pdf", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/word-to-pdf", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/powerpoint-to-pdf", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/excel-to-pdf", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/html-to-pdf", priority: 0.85, changeFrequency: "weekly" as const },

    // From PDF
    { url: "/pdf-to-image", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/pdf-to-word", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/pdf-to-powerpoint", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/pdf-to-excel", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/pdf-to-pdfa", priority: 0.85, changeFrequency: "weekly" as const },

    // Guides & Knowledge Hub
    { url: "/guides", priority: 0.95, changeFrequency: "daily" as const },

    // Policy
    { url: "/privacy-policy", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/terms", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const guideRoutes = GUIDE_ARTICLES.map((article) => ({
    url: `/guides/${article.slug}`,
    priority: 0.85,
    changeFrequency: "weekly" as const,
  }));

  const allRoutes = [...coreRoutes, ...guideRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
