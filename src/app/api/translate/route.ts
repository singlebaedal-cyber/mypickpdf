import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizeLang(code: string): string {
  if (!code || code === "auto") return "auto";
  if (code === "zh") return "zh-CN";
  return code;
}

/**
 * Google GTX & MyMemory Translation Helper
 */
async function translateChunk(text: string, sourceLang = "auto", targetLang = "en"): Promise<string> {
  if (!text.trim()) return "";

  const sl = normalizeLang(sourceLang);
  const tl = normalizeLang(targetLang);

  // 1. Primary: Google GTX Engine (Free, high neural accuracy, fast)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).filter(Boolean).join("");
        if (translated) return translated;
      }
    }
  } catch (err) {
    console.warn("Google GTX primary failed, trying fallback:", err);
  }

  // 2. Secondary Fallback: MyMemory Translation API
  try {
    const sl = sourceLang === "auto" ? "autodetect" : sourceLang;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${sl}|${targetLang}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
    }
  } catch (err) {
    console.error("Translation fallback error:", err);
  }

  // If all failed, return original text safely
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, texts, sourceLang = "auto", targetLang = "en" } = body;

    if (Array.isArray(texts)) {
      const results: string[] = [];
      for (const t of texts) {
        const translated = await translateChunk(t, sourceLang, targetLang);
        results.push(translated);
      }
      return NextResponse.json({ success: true, translations: results });
    }

    if (typeof text === "string") {
      // If text is long, split by paragraphs
      const paragraphs = text.split("\n\n");
      const translatedParagraphs: string[] = [];

      for (const p of paragraphs) {
        if (!p.trim()) {
          translatedParagraphs.push("");
          continue;
        }
        // Split into chunks if > 1500 chars
        if (p.length > 1500) {
          const sentences = p.split(/([.?!]\s+)/);
          let currentChunk = "";
          let chunkResult = "";

          for (const s of sentences) {
            if ((currentChunk + s).length > 1200) {
              const res = await translateChunk(currentChunk, sourceLang, targetLang);
              chunkResult += res + " ";
              currentChunk = s;
            } else {
              currentChunk += s;
            }
          }
          if (currentChunk) {
            const res = await translateChunk(currentChunk, sourceLang, targetLang);
            chunkResult += res;
          }
          translatedParagraphs.push(chunkResult.trim());
        } else {
          const res = await translateChunk(p, sourceLang, targetLang);
          translatedParagraphs.push(res);
        }
      }

      return NextResponse.json({
        success: true,
        translatedText: translatedParagraphs.join("\n\n"),
      });
    }

    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  } catch (err: any) {
    console.error("Translation API error:", err);
    return NextResponse.json({ error: err.message || "Translation failed" }, { status: 500 });
  }
}
