import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/seo-config";
import { GUIDE_ARTICLES } from "@/lib/guides-data";
import { TOOLS_REGISTRY } from "@/lib/tools-registry";

const INDEXNOW_KEY = "pdfpick8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c";

export async function GET() {
  return submitIndexNow();
}

export async function POST() {
  return submitIndexNow();
}

async function submitIndexNow() {
  const baseUrl = SITE_CONFIG.domain;
  const host = "pdfpick.kr";

  const staticPaths = [
    "",
    "/guides",
    "/privacy-policy",
    "/terms",
    "/contact",
  ];

  const toolPaths = TOOLS_REGISTRY.map((t) => t.href);
  const guidePaths = GUIDE_ARTICLES.map((a) => `/guides/${a.slug}`);

  const urlList = Array.from(
    new Set([...staticPaths, ...toolPaths, ...guidePaths].map((p) => `${baseUrl}${p}`))
  );

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://searchadvisor.naver.com/indexnow",
  ];

  const results = await Promise.all(
    endpoints.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        });
        return {
          endpoint,
          status: res.status,
          ok: res.status >= 200 && res.status < 300,
        };
      } catch (err: any) {
        return {
          endpoint,
          status: 500,
          ok: false,
          error: err?.message || String(err),
        };
      }
    })
  );

  return NextResponse.json({
    success: true,
    submittedCount: urlList.length,
    keyLocation: payload.keyLocation,
    results,
    urlList,
  });
}
