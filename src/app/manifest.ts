import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "pdfpick - Free & Private Online PDF Tools",
    short_name: "pdfpick",
    description: "100% Free & Secure Online PDF Tools processed in local browser memory via WebAssembly.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e11d48",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "PDF 편집 (Edit PDF)",
        short_name: "편집",
        description: "텍스트, 서명, 형광펜, 도형 추가 및 화이트아웃",
        url: "/edit-pdf",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "PDF 합치기 (Merge PDF)",
        short_name: "합치기",
        description: "여러 PDF 문서를 하나로 안전하게 결합",
        url: "/merge-pdf",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "PDF 압축 (Compress PDF)",
        short_name: "압축",
        description: "고화질 유지 최적 용량 압축",
        url: "/compress-pdf",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "PDF 워드 변환 (To Word)",
        short_name: "Word 변환",
        description: "PDF 문서를 수정 가능한 Word(DOCX)로 변환",
        url: "/pdf-to-word",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
