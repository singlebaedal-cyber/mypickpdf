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
          // Global Search Engines
          "Googlebot",
          "Google-Extended", // Google Gemini / Bard training & search
          "Bingbot",
          "Yeti", // Naver
          "Daumoa", // Daum / Kakao
          "Baiduspider", // Baidu (China)
          "YandexBot", // Yandex (Russia / Europe)
          "DuckDuckBot", // DuckDuckGo
          "Sogou web spider", // Sogou
          // AI Agents & Search Bots (GEO / AEO)
          "GPTBot", // OpenAI ChatGPT
          "ChatGPT-User", // ChatGPT web browsing
          "OAI-SearchBot", // OpenAI Search / SearchGPT
          "PerplexityBot", // Perplexity AI
          "ClaudeBot", // Anthropic Claude
          "Claude-Web", // Claude web search
          "Applebot", // Apple Intelligence / Siri
          "Applebot-Extended",
          "cohere-ai", // Cohere
          "CCBot", // Common Crawl
          "Diffbot",
          "FacebookBot", // Meta AI
          "meta-externalagent",
          "Bytespider", // TikTok / ByteDance AI
          "Amazonbot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
    host: SITE_CONFIG.domain,
  };
}
