import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "pdfpick - 무료 온라인 PDF 도구 (합치기·압축·변환·편집 | 서버저장 0%)";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #3b0764 100%)",
          padding: "56px 68px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Row: Brand & Badges */}
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
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #f43f5e, #ea580c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
                boxShadow: "0 10px 25px rgba(244, 63, 94, 0.4)",
              }}
            >
              🐾
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: "38px",
                  fontWeight: 900,
                  letterSpacing: "-1px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#ffffff" }}>pdf</span>
                <span style={{ color: "#fb923c" }}>pick</span>
                <span
                  style={{
                    fontSize: "20px",
                    marginLeft: "10px",
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
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "10px 20px",
                borderRadius: "999px",
                background: "rgba(16, 185, 129, 0.2)",
                border: "2px solid rgba(16, 185, 129, 0.5)",
                color: "#6ee7b7",
                fontSize: "20px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
              }}
            >
              🔒 서버 저장 0% (100% 로컬 보안)
            </div>
            <div
              style={{
                padding: "10px 20px",
                borderRadius: "999px",
                background: "rgba(244, 63, 94, 0.22)",
                border: "2px solid rgba(244, 63, 94, 0.5)",
                color: "#fda4af",
                fontSize: "20px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
              }}
            >
              ⚡ 무설치 · 무제한 무료
            </div>
          </div>
        </div>

        {/* Center Hero Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              fontSize: "62px",
              fontWeight: 900,
              lineHeight: 1.18,
              letterSpacing: "-1.5px",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>로그인·설치 없이 1초 만에 끝내는</span>
            <span
              style={{
                color: "#fb7185",
                marginTop: "4px",
              }}
            >
              올인원 무료 PDF & 오피스 변환 도구
            </span>
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#cbd5e1",
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            브라우저 WebAssembly 기술로 기밀 문서 유출 걱정 없이 안전하게 처리하세요.
          </div>
        </div>

        {/* Bottom Feature Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          {[
            "✏️ PDF 편집·서명·도장",
            "🌐 AI 18개국어 PDF 번역",
            "📑 PDF 합치기·분할",
            "📉 화질유지 80% 압축",
            "🇰🇷 PDF ⇄ 한글(HWP/HWPX)",
            "📊 Word · Excel · PPT · JPG 변환",
            "🎬 동영상 압축 & GIF 움짤",
          ].map((label, idx) => (
            <div
              key={idx}
              style={{
                padding: "12px 22px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: "#f8fafc",
                fontSize: "20px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
