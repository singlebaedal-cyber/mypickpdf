import type { Metadata } from "next";

export interface ToolSeoData {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
}

export const TOOLS_SEO_MAP: Record<string, ToolSeoData> = {
  "merge-pdf": {
    title: "PDF 합치기 무료 - 여러 PDF 파일 하나로 병합 (설치X·서버저장 0%)",
    description:
      "프로그램 설치나 로그인 없이 웹 브라우저에서 1초 만에 여러 PDF 파일을 원하는 순서로 하나로 합치세요. 100% 로컬 처리로 이력서·계약서·회사 기밀 문서를 완벽 보호하는 무료 PDF 병합기.",
    canonical: "https://pdfpick.kr/merge-pdf",
    keywords: [
      "PDF 합치기",
      "PDF 병합",
      "PDF 하나로 합치기",
      "PDF 합치기 무료",
      "PDF 파일 합치기 사이트",
      "프로그램 없이 PDF 합치기",
      "이력서 포트폴리오 PDF 합치기",
    ],
  },
  "split-pdf": {
    title: "PDF 나누기 무료 - 원하는 페이지만 추출·삭제·낱장 분할",
    description:
      "대용량 PDF에서 필요한 특정 페이지만 쏙 골라 추출하거나 불필요한 빈 페이지를 삭제하세요. 로그인이나 설치 없이 썸네일을 보며 안전하고 빠르게 나누는 무료 PDF 분할 도구.",
    canonical: "https://pdfpick.kr/split-pdf",
    keywords: [
      "PDF 나누기",
      "PDF 분할",
      "PDF 페이지 추출",
      "PDF 특정 페이지 저장",
      "PDF 페이지 삭제",
      "PDF 낱장 분리",
      "무료 PDF 자르기",
    ],
  },
  "compress-pdf": {
    title: "PDF 용량 줄이기 무료 - 화질 저하 없이 대용량 PDF 80% 초고속 압축",
    description:
      "글자와 표 깨짐 없이 PDF 파일 크기만 최대 80% 줄이세요. 이메일 대용량 첨부, 정부24·나라장터·채용 사이트 제출용 PDF 용량 축소. 서버 전송 없는 100% 안전한 무료 PDF 압축기.",
    canonical: "https://pdfpick.kr/compress-pdf",
    keywords: [
      "PDF 용량 줄이기",
      "PDF 압축",
      "대용량 PDF 압축",
      "PDF 용량 축소 무료",
      "이메일 첨부 PDF 용량 줄이기",
      "정부24 PDF 용량 줄이기",
      "화질 저하 없이 PDF 압축",
    ],
  },
  "edit-pdf": {
    title: "무료 PDF 편집기 - PDF 도장 찍기·전자서명 넣기·주민번호 가리기·텍스트 수정",
    description:
      "프로그램 설치 없이 브라우저에서 바로 쓰는 무료 온라인 PDF 편집기! 계약서 투명 도장 찍기, 자필 전자서명 넣기, 주민등록번호·개인정보 가리기(화이트아웃), 글자 수정 및 형광펜 기능을 무료로 이용하세요.",
    canonical: "https://pdfpick.kr/edit-pdf",
    keywords: [
      "PDF 편집",
      "무료 PDF 편집기",
      "PDF 도장 찍기",
      "PDF 서명 넣기",
      "PDF 전자서명 무료",
      "PDF 주민번호 가리기",
      "PDF 개인정보 마스킹",
      "PDF 화이트아웃",
      "PDF 글자 수정",
    ],
  },
  "translate-pdf": {
    title: "PDF 번역기 무료 - 영어 논문·계약서 서식 유지 번역 및 좌우 대조본 만들기",
    description:
      "해외 영어 논문, 원서, 영문 계약서, 일본어·중국어 매뉴얼 PDF를 원본 레이아웃 그대로 번역하세요. 원문과 번역문을 한눈에 비교하는 좌우 대조본 PDF 및 단독 번역본 무료 다운로드 지원.",
    canonical: "https://pdfpick.kr/translate-pdf",
    keywords: [
      "PDF 번역",
      "PDF 번역기 무료",
      "영어 논문 PDF 번역",
      "PDF 대조본 번역",
      "영문 계약서 PDF 번역",
      "일본어 PDF 번역",
      "서식 유지 PDF 번역",
    ],
  },
  "pdf-to-hwp": {
    title: "PDF 한글 변환 무료 - 공공기관·정부24·나라장터 공문서 HWP·HWPX 변환",
    description:
      "공공기관, 관공서 공고문, 학교 가정통신문 PDF를 아래아한글(HWP/HWPX) 파일로 즉시 변환하세요. 표 서식과 텍스트를 살려 한컴오피스에서 바로 편집 가능한 100% 무료 국산 PDF 한글 변환기.",
    canonical: "https://pdfpick.kr/pdf-to-hwp",
    keywords: [
      "PDF 한글 변환",
      "PDF HWP 변환",
      "PDF HWPX 변환",
      "PDF 한글파일 변환 무료",
      "공공기관 PDF 한글 변환",
      "정부24 PDF 한글 변환",
      "나라장터 공고문 한글 변환",
    ],
  },
  "pdf-to-word": {
    title: "PDF 워드 변환 무료 - 서식 깨짐 없는 PDF to Word (DOCX) 변환기",
    description:
      "PDF 문서를 편집 가능한 Microsoft Word(.docx) 파일로 1초 만에 변환하세요. 줄바꿈과 문단 서식을 보존하며 외부 서버 업로드 없이 브라우저에서 안전하게 변환됩니다.",
    canonical: "https://pdfpick.kr/pdf-to-word",
    keywords: [
      "PDF 워드 변환",
      "PDF Word 변환",
      "PDF to DOCX 무료",
      "PDF 워드 파일 변환",
      "PDF 문서 워드로 수정",
    ],
  },
  "word-to-pdf": {
    title: "워드 PDF 변환 무료 - 폰트 깨짐 없는 Word(DOCX) to PDF 변환",
    description:
      "MS Word(.docx) 문서를 레이아웃과 글꼴 깨짐 없이 깔끔한 A4 PDF로 즉시 변환하세요. 이력서, 보고서, 계약서 제출용 무료 Word to PDF 변환 도구.",
    canonical: "https://pdfpick.kr/word-to-pdf",
    keywords: [
      "워드 PDF 변환",
      "Word to PDF",
      "DOCX PDF 변환",
      "워드 파일 PDF 저장",
    ],
  },
  "pdf-to-excel": {
    title: "PDF 엑셀 변환 무료 - PDF 표·단가표·재무제표 데이터 Excel(XLSX) 추출",
    description:
      "복사하면 한 칸에 뭉치는 PDF 속 표와 숫자 데이터를 엑셀(XLSX) 행·열 셀로 정확하게 분리 추출하세요. 세금계산서, 견적서, 재무제표 정리에 최적화된 무료 PDF 엑셀 변환기.",
    canonical: "https://pdfpick.kr/pdf-to-excel",
    keywords: [
      "PDF 엑셀 변환",
      "PDF 표 엑셀 복사",
      "PDF 표 추출",
      "PDF to Excel 무료",
      "PDF XLSX 변환",
    ],
  },
  "excel-to-pdf": {
    title: "엑셀 PDF 변환 무료 - 시트 잘림 없는 Excel(XLSX) to PDF 변환",
    description:
      "Excel(.xlsx) 스프레드시트와 표를 페이지 잘림 없이 깔끔한 A4 PDF 문서로 변환하세요. 견적서·거래명세서 배포용 무료 엑셀 PDF 변환 도구.",
    canonical: "https://pdfpick.kr/excel-to-pdf",
    keywords: [
      "엑셀 PDF 변환",
      "Excel to PDF",
      "XLSX PDF 변환",
      "엑셀 시트 PDF 저장",
    ],
  },
  "pdf-to-powerpoint": {
    title: "PDF PPT 변환 무료 - 발표자료 PDF를 파워포인트(PPTX) 슬라이드로 복원",
    description:
      "원본이 없는 PDF 발표 자료나 강의 교안을 파워포인트(PPTX) 슬라이드로 1초 만에 변환하세요. 16:9 및 4:3 비율과 고해상도 그래픽을 그대로 유지합니다.",
    canonical: "https://pdfpick.kr/pdf-to-powerpoint",
    keywords: [
      "PDF PPT 변환",
      "PDF 파워포인트 변환",
      "PDF to PPTX 무료",
      "발표자료 PDF PPT 변환",
    ],
  },
  "powerpoint-to-pdf": {
    title: "PPT PDF 변환 무료 - 글꼴 깨짐 방지 파워포인트(PPTX) to PDF 변환",
    description:
      "PPT/PPTX 프레젠테이션 발표 슬라이드를 어느 PC나 태블릿에서도 폰트 깨짐 없이 열람할 수 있는 고화질 PDF로 변환하세요.",
    canonical: "https://pdfpick.kr/powerpoint-to-pdf",
    keywords: [
      "PPT PDF 변환",
      "파워포인트 PDF 변환",
      "PPTX to PDF",
      "발표자료 PDF 변환",
    ],
  },
  "image-to-pdf": {
    title: "JPG PDF 변환 무료 - 스마트폰 서류·영수증 사진(PNG/JPG) A4 PDF 하나로 묶기",
    description:
      "스마트폰으로 찍은 영수증, 계약서, 신분증 사본 이미지 여러 장을 순서대로 정렬해 깔끔한 단일 A4 PDF 파일로 만드세요. 연말정산·은행·관공서 증빙 서류 제출 필수 도구.",
    canonical: "https://pdfpick.kr/image-to-pdf",
    keywords: [
      "JPG PDF 변환",
      "사진 PDF 변환",
      "이미지 PDF 만들기",
      "PNG PDF 변환",
      "영수증 사진 PDF 묶기",
      "여러 장 사진 PDF 하나로",
    ],
  },
  "pdf-to-image": {
    title: "PDF JPG 변환 무료 - PDF 페이지를 고화질 이미지(JPG/PNG)로 추출 저장",
    description:
      "PDF 문서의 각 페이지를 선명한 300 DPI 고화질 JPG 또는 PNG 이미지 파일로 변환하세요. 낱장 저장 및 전체 페이지 ZIP 일괄 다운로드 지원.",
    canonical: "https://pdfpick.kr/pdf-to-image",
    keywords: [
      "PDF JPG 변환",
      "PDF 이미지 변환",
      "PDF PNG 변환",
      "PDF 사진으로 저장",
      "PDF 고화질 이미지 추출",
    ],
  },
  "rotate-pdf": {
    title: "PDF 회전 무료 - 거꾸로 뒤집힌 스캔 PDF 방향 바꾸기 및 영구 저장",
    description:
      "스캔 후 거꾸로 뒤집히거나 가로·세로 방향이 틀어진 PDF 페이지를 90도·180도로 회전하여 영구 저장하세요. 특정 페이지만 개별 회전하거나 전체 일괄 회전 지원.",
    canonical: "https://pdfpick.kr/rotate-pdf",
    keywords: [
      "PDF 회전",
      "PDF 방향 바꾸기",
      "PDF 회전 저장",
      "거꾸로 된 PDF 돌리기",
      "PDF 가로 세로 회전",
    ],
  },
  "ocr-pdf": {
    title: "스캔 PDF 글자 복사(OCR) 무료 - 이미지 PDF 한국어·영어 텍스트 추출",
    description:
      "마우스 드래그나 복사가 안 되는 스캔 문서·이미지 PDF 속 글자를 AI 광학 문자 인식(OCR)으로 정확하게 판독하여 복사 가능한 텍스트로 즉시 추출하세요.",
    canonical: "https://pdfpick.kr/ocr-pdf",
    keywords: [
      "PDF OCR",
      "스캔 PDF 글자 복사",
      "PDF 텍스트 추출",
      "이미지 PDF 글자 추출",
      "복사 안되는 PDF 텍스트 복사",
    ],
  },
  "add-page-numbers": {
    title: "PDF 쪽번호 매기기 무료 - 표지 제외 페이지 번호 일괄 삽입 도구",
    description:
      "포트폴리오, 학위 논문, 제안서 PDF 하단이나 상단에 깔끔한 페이지 번호(쪽번호)를 일괄 삽입하세요. 표지 제외, 시작 번호 지정, 여백 및 글자 크기 맞춤 설정 지원.",
    canonical: "https://pdfpick.kr/add-page-numbers",
    keywords: [
      "PDF 페이지 번호",
      "PDF 쪽번호 매기기",
      "PDF 페이지 번호 추가",
      "포트폴리오 쪽번호 삽입",
      "PDF 표지 제외 쪽번호",
    ],
  },
  "add-watermark": {
    title: "PDF 워터마크 추가 무료 - 대외비·복제금지 투명 텍스트 스탬프 삽입",
    description:
      "계약서, 도면, 제안서 무단 유출 방지를 위한 '대외비', 'CONFIDENTIAL', 회사명 텍스트 워터마크를 투명도와 대각선 각도를 조절하여 전 페이지에 1초 만에 삽입하세요.",
    canonical: "https://pdfpick.kr/add-watermark",
    keywords: [
      "PDF 워터마크",
      "PDF 대외비 표시",
      "PDF 워터마크 추가 무료",
      "문서 무단복제 방지 워터마크",
    ],
  },
  "html-to-pdf": {
    title: "HTML PDF 변환 무료 - 웹페이지·전자영수증·HTML 코드 A4 PDF 저장",
    description:
      "HTML 소스 코드와 CSS 스타일을 그대로 반영하여 인쇄 규격 A4 PDF 문서로 깔끔하게 렌더링하세요. 전자영수증, 뉴스레터, 웹 보고서 저장 도구.",
    canonical: "https://pdfpick.kr/html-to-pdf",
    keywords: [
      "HTML PDF 변환",
      "웹페이지 PDF 저장",
      "HTML to PDF 무료",
      "전자영수증 PDF 변환",
    ],
  },
  "pdf-to-pdfa": {
    title: "PDF/A 변환 무료 - 국회도서관 논문·법원·공공기관 장기보관 표준(ISO 19005) 변환",
    description:
      "학위논문 제출, 법원 전자소송, 공공기관 영구 보존을 위한 국제 표준 규격(ISO 19005) PDF/A 파일로 1초 만에 변환하여 폰트와 메타데이터를 완벽 보존하세요.",
    canonical: "https://pdfpick.kr/pdf-to-pdfa",
    keywords: [
      "PDF/A 변환",
      "PDF PDF/A 변환",
      "학위논문 PDF/A 변환",
      "공공기관 장기보관 PDF",
      "ISO 19005 PDF 변환",
    ],
  },
  "compress-video": {
    title: "동영상 용량 줄이기 무료 - 카카오톡·이메일 첨부용 고화질 MP4/MOV 압축",
    description:
      "화질 저하를 최소화하면서 대용량 MP4·아이폰 MOV 동영상 용량을 최대 80% 압축하세요. 카카오톡 300MB 제한 및 이메일 25MB 첨부 한계 해결. 서버 업로드 없는 100% 로컬 압축.",
    canonical: "https://pdfpick.kr/compress-video",
    keywords: [
      "동영상 압축",
      "동영상 용량 줄이기",
      "MP4 용량 줄이기",
      "카카오톡 동영상 용량 제한",
      "아이폰 MOV MP4 압축",
    ],
  },
  "video-to-gif": {
    title: "동영상 GIF 변환 무료 - 워터마크 없는 고화질 움짤 만들기 (MP4 to GIF)",
    description:
      "MP4, MOV, WebM 동영상에서 원하는 구간만 잘라 로고 워터마크 없는 선명한 GIF 움짤로 1초 만에 변환하세요. 네이버 블로그·노션·상세페이지 최적화.",
    canonical: "https://pdfpick.kr/video-to-gif",
    keywords: [
      "동영상 GIF 변환",
      "움짤 만들기 무료",
      "MP4 GIF 변환",
      "블로그 고화질 움짤 제작",
    ],
  },
  "privacy-policy": {
    title: "개인정보처리방침",
    description:
      "pdfpick(피디에프픽)의 개인정보처리방침 안내입니다. pdfpick은 100% 클라이언트 사이드 기술을 통해 사용자의 어떠한 문서도 원격 서버에 전송하거나 저장하지 않습니다.",
    canonical: "https://pdfpick.kr/privacy-policy",
    keywords: ["pdfpick 개인정보처리방침", "로컬 PDF 보안 정책"],
  },
  "terms": {
    title: "서비스 이용약관",
    description: "pdfpick(피디에프픽) 무료 온라인 PDF 유틸리티 서비스 이용약관 안내입니다.",
    canonical: "https://pdfpick.kr/terms",
    keywords: ["pdfpick 이용약관"],
  },
  "contact": {
    title: "고객지원 및 문의하기",
    description: "pdfpick(피디에프픽) 관련 기능 제안, 오류 제보, 비즈니스 제휴 문의 안내입니다.",
    canonical: "https://pdfpick.kr/contact",
    keywords: ["pdfpick 고객지원", "문의하기"],
  },
};

export function constructToolMetadata(toolKey: string): Metadata {
  const data = TOOLS_SEO_MAP[toolKey];
  if (!data) return {};

  const ogImageUrl = `https://pdfpick.kr/api/og?title=${encodeURIComponent(data.title.trim())}&subtitle=${encodeURIComponent(data.description)}&badge=${encodeURIComponent("무료 PDF 웹 도구")}`;

  return {
    title: data.title.trim(),
    description: data.description,
    keywords: data.keywords,
    alternates: {
      canonical: data.canonical,
      languages: {
        "ko-KR": data.canonical,
        "x-default": data.canonical,
      },
    },
    openGraph: {
      title: `${data.title.trim()} | pdfpick`,
      description: data.description,
      url: data.canonical,
      siteName: "피디에프픽 (pdfpick)",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: data.title.trim(),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title.trim()} | pdfpick`,
      description: data.description,
      images: [ogImageUrl],
    },
  };
}

export function constructToolSchemas(toolKey: string) {
  const data = TOOLS_SEO_MAP[toolKey];
  if (!data) return [];

  const cleanTitle = data.title.trim();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "pdfpick 홈",
        item: "https://pdfpick.kr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cleanTitle,
        item: data.canonical,
      },
    ],
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${cleanTitle} - pdfpick`,
    url: data.canonical,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows, macOS, Android, iOS, Web Browser",
    description: data.description,
    inLanguage: "ko-KR",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
    },
  };

  return [breadcrumbSchema, softwareAppSchema];
}
