import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF & 문서 활용 완벽 가이드 27선 - 실무 꿀팁 매거진",
  description: "프로그램 설치 없는 무료 PDF 합치기, 용량 80% 압축, 공공기관·정부24 HWPX 변환, PDF 도장 찍기·전자서명, 주민번호 가리기(화이트아웃), 영어 논문 번역까지! 실무에 바로 쓰는 27가지 심층 가이드.",
  keywords: [
    "PDF 가이드",
    "PDF 도장 찍기",
    "PDF 서명 넣기",
    "PDF 주민번호 가리기",
    "PDF 합치기 방법",
    "PDF 용량 줄이기 팁",
    "정부24 PDF 용량 줄이기",
    "PDF HWP 변환",
    "공공기관 HWP 변환",
    "스캔 PDF OCR",
    "영어 논문 PDF 번역",
    "PDF 쪽번호 매기기",
    "무료 PDF 팁",
    "알PDF 대체",
    "pdfpick 가이드"
  ],
  alternates: {
    canonical: "https://pdfpick.kr/guides",
    languages: {
      "ko-KR": "https://pdfpick.kr/guides",
      "x-default": "https://pdfpick.kr/guides",
    },
  },
  openGraph: {
    title: "PDF & 문서 활용 완벽 가이드 27선 - 실무 꿀팁 매거진 | pdfpick",
    description: "PDF 도장·서명, 개인정보 마스킹, 합치기, 용량 줄이기, 한글 HWPX 변환, 논문 번역 팁까지 총망라한 무료 실무 가이드북",
    url: "https://pdfpick.kr/guides",
    siteName: "pdfpick",
    images: [
      {
        url: "https://pdfpick.kr/opengraph-image",
        width: 1200,
        height: 630,
        alt: "pdfpick 공식 실무 가이드북 27선",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF & 문서 활용 완벽 가이드 27선 - 실무 꿀팁 매거진 | pdfpick",
    description: "PDF 도장·서명, 합치기, 용량 줄이기, 한글 HWPX 변환 등 실무 팁 27가지",
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
