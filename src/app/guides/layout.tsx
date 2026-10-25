import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF & 문서 활용 완벽 가이드 26선 - 실무 꿀팁 매거진",
  description: "프로그램 설치 없는 무료 PDF 합치기, 용량 80% 압축, 공공기관 HWPX 변환, 스캔 PDF OCR, 전자서명·화이트아웃부터 로컬 보안 원리까지! 실무에 바로 쓰는 26가지 심층 가이드.",
  keywords: [
    "PDF 가이드",
    "PDF 합치기 방법",
    "PDF 용량 줄이기 팁",
    "PDF HWP 변환",
    "공공기관 HWP 변환",
    "스캔 PDF OCR",
    "PDF 쪽번호 매기기",
    "무료 PDF 팁",
    "알PDF 대체",
    "PDF 사용법",
    "pdfpick 가이드"
  ],
  alternates: {
    canonical: "https://pdfpick.kr/guides",
    languages: {
      "x-default": "https://pdfpick.kr/guides",
      ko: "https://pdfpick.kr/guides?lang=ko",
      en: "https://pdfpick.kr/guides?lang=en",
      ja: "https://pdfpick.kr/guides?lang=ja",
      zh: "https://pdfpick.kr/guides?lang=zh",
      "zh-TW": "https://pdfpick.kr/guides?lang=zh-TW",
      es: "https://pdfpick.kr/guides?lang=es",
      fr: "https://pdfpick.kr/guides?lang=fr",
      de: "https://pdfpick.kr/guides?lang=de",
      it: "https://pdfpick.kr/guides?lang=it",
      pt: "https://pdfpick.kr/guides?lang=pt",
      ru: "https://pdfpick.kr/guides?lang=ru",
      vi: "https://pdfpick.kr/guides?lang=vi",
      th: "https://pdfpick.kr/guides?lang=th",
      id: "https://pdfpick.kr/guides?lang=id",
      hi: "https://pdfpick.kr/guides?lang=hi",
      ar: "https://pdfpick.kr/guides?lang=ar",
      tr: "https://pdfpick.kr/guides?lang=tr",
      nl: "https://pdfpick.kr/guides?lang=nl",
    },
  },
  openGraph: {
    title: "PDF & 문서 활용 완벽 가이드 26선 - 실무 꿀팁 매거진 | pdfpick",
    description: "PDF 합치기, 용량 줄이기, 한글 HWPX 변환, OCR 추출, 동영상 압축 팁까지 총망라한 무료 실무 가이드북",
    url: "https://pdfpick.kr/guides",
    siteName: "pdfpick",
    images: [
      {
        url: "https://pdfpick.kr/opengraph-image",
        width: 1200,
        height: 630,
        alt: "pdfpick 공식 실무 가이드북 26선",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF & 문서 활용 완벽 가이드 26선 - 실무 꿀팁 매거진 | pdfpick",
    description: "PDF 합치기, 용량 줄이기, 한글 HWPX 변환 등 실무 팁 26가지",
    images: ["https://pdfpick.kr/opengraph-image"],
  },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
