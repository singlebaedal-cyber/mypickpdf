export const SITE_CONFIG = {
  name: "mypickpdf",
  brandName: "마이픽피디에프",
  domain: "https://mypickpdf.vercel.app",
  title: "무료 PDF 합치기·압축·변환 (프로그램 설치X, 서버저장 0%)",
  description: "로그인이나 프로그램 설치 없이 1초 만에 무료로 끝내는 올인원 PDF 솔루션! PDF 합치기, 분할, 초고속 압축, 워드/엑셀/PPT/HWP 상호 변환 및 동영상 압축까지. 100% 브라우저 로컬 암호화 처리로 회사 기밀도 안전하게 보호됩니다.",
  ogImage: "https://mypickpdf.vercel.app/mascot/mascot_main.png",
  keywords: [
    "mypickpdf",
    "마이픽피디에프",
    "PDF 합치기",
    "PDF 합치기 무료",
    "PDF 합치기 프로그램 없이",
    "PDF 용량 줄이기",
    "PDF 압축",
    "PDF 압축 무료",
    "PDF 나누기",
    "PDF 분할",
    "아이폰 PDF 합치기",
    "갤럭시 PDF 합치기",
    "워드 PDF 변환",
    "파워포인트 PDF 변환",
    "엑셀 PDF 변환",
    "HTML PDF 변환",
    "PDF 워드 변환",
    "PDF 파워포인트 변환",
    "PDF 엑셀 변환",
    "PDF PDF/A 변환",
    "JPG PDF 변환",
    "이미지 PDF 변환",
    "PDF JPG 변환",
    "PDF 회전",
    "PDF 페이지 번호",
    "PDF 쪽번호",
    "PDF 페이지 번호 매기기",
    "PDF 워터마크",
    "PDF 워터마크 추가",
    "PDF 대외비 표시",
    "무료 PDF 변환기",
    "무설치 PDF 툴",
    "알PDF 무료 대체",
    "어도비 PDF 무료 대체",
    "PDF HWP 변환",
    "PDF HWPX 변환",
    "PDF 한글 변환",
    "PDF 한글파일 변환",
    "공공기관 한글 변환",
    "동영상 압축",
    "동영상 용량 줄이기",
    "동영상 GIF 변환",
    "움짤 만들기"
  ],
  author: "mypickpdf Team",
  contactEmail: "fbihan@naver.com",
  googleAdSensePublisherId: "ca-pub-3627143540462840",
  naverSiteVerification: "6e99cef10e0d83ff11779a9206193559aee8eb28",
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "G-C5NS93KXLR",
};

// Global WebApplication Schema for GEO & AEO
export const WEB_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "mypickpdf (마이픽피디에프)",
  "url": "https://mypickpdf.vercel.app",
  "description": "귀여운 래서팬더와 함께하는 무료 브라우저 기반 PDF 편집, 압축 및 오피스 상호 변환 올인원 웹 애플리케이션",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All (Windows, macOS, iOS, Android, Linux)",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  },
  "featureList": [
    "로그인 및 회원가입 불필요",
    "100% 브라우저 메모리 로컬 처리 (서버 전송 없음)",
    "다중 PDF 파일 초고속 병합 및 분할",
    "Word (.docx) ↔ PDF 상호 변환",
    "Excel (.xlsx) ↔ PDF 상호 변환",
    "PowerPoint (.pptx) ↔ PDF 상호 변환",
    "HTML ➔ PDF 변환",
    "PDF ➔ PDF/A 장기 보관 규격 변환",
    "JPG/PNG 이미지 ↔ PDF 고화질 변환",
    "PDF 회전 및 텍스트 추출",
    "무제한 무료 사용"
  ]
};

// FAQ Schema for Google Search Rich Snippet
export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "mypickpdf는 정말 무료이며 프로그램 설치가 필요 없나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "네! mypickpdf는 프로그램 설치나 회원가입, 결제 없이 웹 브라우저에서 바로 사용할 수 있는 100% 무료 올인원 PDF 솔루션입니다."
      }
    },
    {
      "@type": "Question",
      "name": "업로드한 PDF 문서나 개인 정보가 서버에 저장되거나 유출되지 않나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "절대 유출되지 않습니다. mypickpdf는 100% 클라이언트 사이드(Client-Side) WebAssembly 기술을 사용하여 사용자의 컴퓨터나 스마트폰 메모리 내에서 직접 처리합니다. 파일이 외부 서버로 전송되지 않으므로 회사 기밀 문서나 개인정보도 안전합니다."
      }
    },
    {
      "@type": "Question",
      "name": "스마트폰(아이폰, 안드로이드)에서도 PDF를 합치거나 변환할 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "네! 모바일 사파리(Safari), 크롬(Chrome), 카카오톡 인앱 브라우저 등 모든 모바일 환경에서 별도 앱 설치 없이 터치 몇 번으로 손쉽게 PDF를 합치고 변환할 수 있습니다."
      }
    }
  ]
};
