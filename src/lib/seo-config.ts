export const SITE_CONFIG = {
  name: "pdfpick",
  brandName: "피디에프픽 (pdfpick)",
  domain: "https://pdfpick.kr",
  title: "무료 PDF 합치기·HWP 한글 변환·압축·도장서명 (서버저장 0%)",
  description:
    "로그인·설치 없이 1초 만에 끝내는 무료 PDF 올인원 솔루션! PDF 합치기, HWP 한글 변환, 용량 줄이기(압축), 계약서 도장·서명 편집, 주민번호 가리기, AI 논문 번역까지 100% 브라우저 로컬 처리로 회사 기밀과 개인정보를 완벽 보호합니다.",
  keywords: [
    "pdfpick",
    "피디에프픽",
    "PDF 합치기",
    "무료 PDF 합치기",
    "PDF 병합",
    "PDF 한글 변환",
    "PDF HWP 변환",
    "PDF HWPX 변환",
    "한글파일 PDF 변환",
    "알PDF 대체 사이트",
    "무료 PDF 한글 변환",
    "PDF 압축",
    "PDF 용량 줄이기",
    "대용량 PDF 압축",
    "정부24 PDF 용량 줄이기",
    "나라장터 PDF 합치기",
    "PDF 나누기",
    "PDF 분할",
    "PDF 페이지 추출",
    "PDF 편집",
    "무료 PDF 편집기",
    "PDF 도장 찍기",
    "PDF 서명 넣기",
    "PDF 계약서 도장 무료",
    "PDF 투명 도장",
    "PDF 전자서명 무료",
    "PDF 개인정보 가리기",
    "PDF 주민번호 가리기",
    "PDF 화이트아웃",
    "PDF 번역",
    "영어 논문 PDF 번역",
    "PDF 대조본 번역",
    "PDF 워드 변환",
    "PDF 엑셀 변환",
    "PDF PPT 변환",
    "JPG PDF 변환",
    "PDF JPG 변환",
    "PDF 쪽번호 매기기",
    "PDF 워터마크 추가",
    "PDF 회전",
    "PDF OCR 글자 추출",
    "스마트폰 PDF 합치기",
    "동영상 용량 줄이기",
    "동영상 GIF 변환",
  ],
  author: "pdfpick Team",
  contactEmail: "fbihan@naver.com",
  googleAdSensePublisherId: "ca-pub-3627143540462840",
  naverSiteVerification: "e39cf0c295093069a2d67e000797b3275af45d86",
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "G-C5NS93KXLR",
  microsoftClarityId: process.env.NEXT_PUBLIC_CLARITY_ID || "z48916b4p1",
};

// Global WebApplication Schema for GEO & AEO (Compliant with Google Structured Data Guidelines)
export const WEB_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "pdfpick (피디에프픽)",
  alternateName: ["피디에프픽", "PDFPick", "pdfpick.kr"],
  url: "https://pdfpick.kr",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All (Windows, macOS, iOS, Android, Linux, ChromeOS)",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  description:
    "프로그램 설치나 서버 업로드 없이 웹 브라우저 로컬 메모리(WebAssembly)에서 즉시 동작하는 100% 무료 PDF 편집·병합·압축·번역·한글(HWPX) 변환 웹 유틸리티",
  inLanguage: "ko-KR",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "100% 클라이언트 로컬 처리: 외부 서버 파일 업로드 0 바이트",
    "로그인·회원가입·일일 횟수 제한 없는 완전 무료 PDF 도구",
    "온라인 PDF 편집기: 텍스트 수정, 전자서명, 도장 날인, 형광펜, 개인정보 마스킹(화이트아웃)",
    "AI 다국어 PDF 번역기: 18개 언어 원문 서식 유지 번역 및 좌우 대조본 PDF 생성",
    "초고속 PDF 합치기(병합), 페이지 분할·추출, 화질 유지 용량 줄이기(압축)",
    "공공기관 표준 아래아한글(HWP/HWPX), Word, Excel, PowerPoint, JPG 상호 변환",
    "스캔 이미지 PDF 광학 문자 인식(OCR) 텍스트 추출 및 PDF/A 장기보관 규격 변환",
    "고화질 MP4 동영상 용량 줄이기 및 GIF 움짤 변환",
  ],
};

// Global Organization Schema
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "pdfpick",
  alternateName: "피디에프픽",
  url: "https://pdfpick.kr",
  logo: "https://pdfpick.kr/icon.png",
  sameAs: ["https://pdfpick.kr"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "fbihan@naver.com",
    availableLanguage: ["Korean", "English", "Japanese"],
  },
};

// Global FAQ Schema for Search Rich Snippets & AI Overviews
export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "pdfpick(피디에프픽)은 정말 로그인이나 회원가입 없이 무료인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네! pdfpick은 어떠한 로그인, 개인정보 입력, 유료 결제 유도나 워터마크 없이 평생 100% 무료로 모든 PDF 변환 및 편집 도구를 무제한 제공합니다.",
      },
    },
    {
      "@type": "Question",
      name: "문서 변환 및 편집 시 파일이 외부 서버에 저장되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "전혀 저장되지 않습니다. pdfpick은 최신 WebAssembly(Wasm) 기술을 통해 사용자의 PC나 스마트폰 웹 브라우저 메모리 안에서 100% 로컬 연산을 수행합니다. 문서가 외부 서버로 단 1바이트도 전송되지 않아 회사 기밀 계약서나 신분증·금융 서류도 완벽하게 보호됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "공공기관 및 학교 제출용 한글(HWP/HWPX) 변환도 지원하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네! 정부24, 조달청 나라장터, 학교, 지자체 전자결재 표준 규격인 개방형 한글(HWPX) 및 HWP 포맷 변환을 지원하여 표와 텍스트를 한글 프로그램에서 즉시 수정할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "PDF에 도장을 찍거나 주민등록번호 뒷자리를 가릴 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네! [PDF 편집] 도구에서 투명 배경 도장 이미지나 자필 전자서명을 원하는 위치에 날인할 수 있으며, 화이트아웃(가리기) 기능으로 주민등록번호, 계좌번호 등 민감한 개인정보를 영구 마스킹할 수 있습니다.",
      },
    },
  ],
};

// Global HowTo Schema for Step-by-Step Google Rich Results
export const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "프로그램 설치 및 서버 업로드 없이 무료로 PDF 합치기·압축·편집·변환하는 방법",
  description:
    "pdfpick을 활용하여 브라우저 로컬 환경에서 안전하게 PDF 문서를 병합, 분할, 용량 압축, 한글(HWPX)·오피스 변환하는 단계별 방법입니다.",
  image: "https://pdfpick.kr/icon.png",
  totalTime: "PT10S",
  step: [
    {
      "@type": "HowToStep",
      name: "PDF 또는 오피스 문서 파일 선택",
      text: "웹 브라우저 화면의 파일 영역에 문서를 끌어다 놓거나(드래그 앤 드롭) 파일 선택 버튼을 클릭합니다.",
      url: "https://pdfpick.kr",
    },
    {
      "@type": "HowToStep",
      name: "편집·압축·변환 옵션 설정",
      text: "페이지 순서 조정, 압축 강도 선택, 서명·도장 추가 또는 변환할 목표 포맷(HWPX, Word, Excel, JPG 등)을 선택합니다.",
      url: "https://pdfpick.kr",
    },
    {
      "@type": "HowToStep",
      name: "100% 브라우저 로컬 초고속 처리",
      text: "외부 서버 전송 없이 사용자의 기기 브라우저 메모리(WebAssembly) 안에서 1~3초 내에 안전하게 처리가 완료됩니다.",
      url: "https://pdfpick.kr",
    },
    {
      "@type": "HowToStep",
      name: "완성된 파일 즉시 다운로드",
      text: "다운로드 버튼을 눌러 워터마크나 횟수 제한 없이 완성된 문서를 내 기기에 즉시 저장합니다.",
      url: "https://pdfpick.kr",
    },
  ],
};
