import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawTitle =
    searchParams.get("title") ||
    "무료 온라인 PDF 합치기·압축·편집·번역·HWP 한글 변환";
  const subtitle =
    searchParams.get("subtitle") ||
    "설치·로그인 없이 브라우저에서 1초 만에 처리하는 100% 로컬 보안 PDF 솔루션";
  const badge = searchParams.get("badge") || "무료 웹 도구 · 서버저장 0%";

  const title = rawTitle.length > 52 ? rawTitle.slice(0, 50) + "…" : rawTitle;
  const cleanSub = subtitle.length > 85 ? subtitle.slice(0, 83) + "…" : subtitle;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #4c0519 100%)",
          padding: "54px 68px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #f43f5e, #ea580c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}
            >
              🐾
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#ffffff" }}>pdf</span>
              <span style={{ color: "#fb923c" }}>pick</span>
              <span
                style={{
                  fontSize: "18px",
                  marginLeft: "12px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.12)",
                  color: "#cbd5e1",
                  fontWeight: 700,
                }}
              >
                pdfpick.kr
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                padding: "9px 18px",
                borderRadius: "999px",
                background: "rgba(16, 185, 129, 0.2)",
                border: "2px solid rgba(16, 185, 129, 0.45)",
                color: "#6ee7b7",
                fontSize: "18px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
              }}
            >
              🔒 서버 저장 0% (로컬 보안)
            </div>
            <div
              style={{
                padding: "9px 18px",
                borderRadius: "999px",
                background: "rgba(244, 63, 94, 0.24)",
                border: "2px solid rgba(244, 63, 94, 0.5)",
                color: "#fda4af",
                fontSize: "18px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
              }}
            >
              ⚡ {badge}
            </div>
          </div>
        </div>

        {/* Center Main Title & Subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "8px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              fontSize: "54px",
              fontWeight: 900,
              lineHeight: 1.24,
              letterSpacing: "-1.2px",
              color: "#ffffff",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#cbd5e1",
              fontWeight: 500,
              lineHeight: 1.45,
              display: "flex",
            }}
          >
            {cleanSub}
          </div>
        </div>

        {/* Bottom Feature Strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              "PDF 합치기·압축",
              "도장·서명·주민번호 가리기",
              "PDF ⇄ 한글(HWPX)",
              "AI 논문 번역",
            ].map((tag, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.09)",
                  color: "#f1f5f9",
                  fontSize: "18px",
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#fb7185",
              display: "flex",
            }}
          >
            무설치 · 무제한 100% 무료 →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
