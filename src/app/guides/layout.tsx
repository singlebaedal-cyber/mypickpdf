import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF & 문서 활용 완벽 가이드 20선 | mypickpdf (마이픽피디에프)",
  description: "프로그램 설치 없는 무료 PDF 합치기, 용량 80% 압축, 공공기관 HWPX 변환부터 로컬 보안 팁까지! 초보자도 쉽게 따라하는 20가지 실전 가이드.",
  keywords: [
    "PDF 가이드",
    "PDF 합치기 방법",
    "PDF 용량 줄이기 팁",
    "PDF HWP 변환",
    "무료 PDF 팁",
    "알PDF 대체",
    "PDF 사용법",
    "how to merge pdf",
    "how to compress pdf free"
  ],
  alternates: {
    canonical: "https://mypickpdf.vercel.app/guides",
  },
  openGraph: {
    title: "mypickpdf 공식 가이드북 - PDF & 문서 활용 실전 팁 20선",
    description: "PDF 합치기, 용량 줄이기, 한글 HWPX 변환, 동영상 압축 팁까지 총망라한 무료 가이드북",
    url: "https://mypickpdf.vercel.app/guides",
    siteName: "mypickpdf",
    images: [
      {
        url: "/mascot/mascot_main.png",
        width: 1200,
        height: 630,
        alt: "mypickpdf 가이드북 마스코트 래서팬더",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "mypickpdf 공식 가이드북 - PDF & 문서 활용 실전 팁 20선",
    description: "PDF 합치기, 용량 줄이기, 한글 HWPX 변환 팁 20가지",
    images: ["/mascot/mascot_main.png"],
  },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
