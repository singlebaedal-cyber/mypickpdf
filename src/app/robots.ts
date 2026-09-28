import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "Googlebot",
          "Yeti", // Naver
          "Bingbot",
          "GPTBot", // ChatGPT / OpenAI
          "PerplexityBot", // Perplexity AI
          "ClaudeBot", // Claude AI
          "Applebot", // Apple Intelligence
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
  };
}
