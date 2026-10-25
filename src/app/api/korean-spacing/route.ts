import { NextRequest, NextResponse } from "next/server";
import hanspell from "hanspell";

export const dynamic = "force-dynamic";

function checkSpacingAsync(text: string): Promise<string> {
  return new Promise((resolve) => {
    let corrected = text;
    try {
      hanspell.spellCheckByDAUM(
        text,
        3500,
        (results: any[]) => {
          for (const r of results) {
            if (r.type === "space" && r.token && r.suggestions && r.suggestions[0]) {
              corrected = corrected.replace(r.token, r.suggestions[0]);
            }
          }
        },
        () => resolve(corrected),
        () => resolve(text)
      );
    } catch {
      resolve(text);
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const { texts } = await req.json();
    if (!Array.isArray(texts)) {
      return NextResponse.json({ error: "texts array is required" }, { status: 400 });
    }

    // 최대 30개 문단 동시 정밀 띄어쓰기 교정
    const limited = texts.slice(0, 30);
    const correctedList = await Promise.all(
      limited.map((t) => (typeof t === "string" ? checkSpacingAsync(t) : t))
    );

    return NextResponse.json({ results: correctedList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Spacing failed" }, { status: 500 });
  }
}
