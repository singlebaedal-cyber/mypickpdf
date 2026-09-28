const fs = require('fs');
const path = require('path');

const koOld = require('../temp_ko.json');
const enOld = require('../temp_en.json');

const koExtra = {
  nav_select_lang: "언어 선택 (Select Language)",
  nav_current_lang: "현재 언어",
  badge_client_engine: "100% 브라우저 클라이언트 엔진",
  badge_security: "보안",
  home_why_sec1_title: "100% 클라이언트 로컬 보안",
  home_why_sec1_desc: "mypickpdf는 WebAssembly 및 브라우저 메모리 안에서 직접 문서를 변환하므로 파일이 외부 원격 서버로 전송되지 않아 기밀 문서도 안전합니다.",
  home_why_sec2_title: "대기 없는 즉시 처리",
  home_why_sec2_desc: "네트워크 업로드 대기 시간 없이, 기기 자체 연산력으로 수십 페이지를 1~2초 안에 빠르게 처리합니다.",
  home_faq_title: "자주 묻는 질문 (FAQ)",
  home_faq_subtitle: "mypickpdf 서비스 이용 및 보안 정책 안내",
  home_faq_q1: "mypickpdf는 정말 로그인이나 회원가입 없이 무료인가요?",
  home_faq_a1: "네! mypickpdf는 어떠한 로그인, 개인정보 입력, 유료 결제 유도 없이 평생 100% 무료로 모든 변환 및 편집 도구를 무제한 제공합니다.",
  home_faq_q2: "워드, 엑셀, 파워포인트 문서 변환 시 데이터가 서버에 저장되나요?",
  home_faq_a2: "절대 아닙니다. mypickpdf는 고도의 WebAssembly 및 브라우저 클라이언트 엔진을 사용하여 사용자의 컴퓨터 메모리 안에서 직접 문서를 변환합니다. 파일이 외부 서버로 전송되지 않아 완벽한 기밀을 보장합니다.",
  home_faq_q3: "변환된 오피스 문서(Word, Excel, PPT)는 편집이 가능한가요?",
  home_faq_a3: "네! PDF에서 추출된 Word(.docx), Excel(.xlsx), PowerPoint(.pptx) 파일은 마이크로소프트 오피스 및 한컴오피스 등에서 정상적으로 열리고 자유롭게 편집할 수 있습니다.",
  home_to_pdf_sub: "(Word, Excel, PPT, 이미지 ➔ PDF)",
  home_from_pdf_sub: "(PDF ➔ 한글, Word, Excel, PPT, 이미지, PDF/A)",
  share_title: "친구·동료에게 추천하고 싶으신가요? 🐾",
  share_desc: "링크 1초 복사 & 즐겨찾기로 더 빠르게 이용하세요!",
  share_btn: "카톡/링크 공유",
  share_copied: "복사 완료! 🐾",
  share_bookmark: "즐겨찾기",
  share_bookmark_tip: "키보드에서 Ctrl + D (맥: Cmd + D)를 누르면 바로 즐겨찾기에 추가됩니다!"
};

const enExtra = {
  nav_select_lang: "Select Language",
  nav_current_lang: "Current Language",
  badge_client_engine: "100% Client-Side Engine",
  badge_security: "Security",
  home_why_sec1_title: "100% Client-Side Local Security",
  home_why_sec1_desc: "mypickpdf processes files directly in your browser memory using WebAssembly. Your confidential documents never touch any external server.",
  home_why_sec2_title: "Instant Processing Without Delay",
  home_why_sec2_desc: "No waiting for network uploads. Uses device-level compute to process dozens of pages in 1-2 seconds.",
  home_faq_title: "Frequently Asked Questions (FAQ)",
  home_faq_subtitle: "Usage guidelines and security policies for mypickpdf",
  home_faq_q1: "Is mypickpdf really 100% free with no sign-up required?",
  home_faq_a1: "Yes! mypickpdf is completely free forever. No registration, no login, and no payment prompts whatsoever.",
  home_faq_q2: "Are converted documents saved on any server?",
  home_faq_a2: "Never. Using WebAssembly client-side technology, your documents are processed strictly within your device memory and zero bytes are transferred externally.",
  home_faq_q3: "Are the converted Office files (Word, Excel, PPT) editable?",
  home_faq_a3: "Yes! Extracted Word (.docx), Excel (.xlsx), and PowerPoint (.pptx) files are fully editable in Microsoft Office, Google Workspace, and Hancom Office.",
  home_to_pdf_sub: "(Word, Excel, PPT, Images ➔ PDF)",
  home_from_pdf_sub: "(PDF ➔ Word, Excel, PPT, Images, PDF/A, HWP)",
  share_title: "Want to recommend to friends & colleagues? 🐾",
  share_desc: "Copy link in 1 second & bookmark for instant access!",
  share_btn: "Share Link",
  share_copied: "Copied! 🐾",
  share_bookmark: "Bookmark",
  share_bookmark_tip: "Press Ctrl + D (Mac: Cmd + D) to instantly bookmark this page!"
};

const koFull = { ...koOld, ...koExtra };
const enFull = { ...enOld, ...enExtra };

const outDir = path.join(__dirname, '../src/lib/translations');

fs.writeFileSync(
  path.join(outDir, 'ko.ts'),
  `import { TranslationDictionary } from "./types";\n\nexport const ko: TranslationDictionary = ${JSON.stringify(koFull, null, 2)};\n`
);

fs.writeFileSync(
  path.join(outDir, 'en.ts'),
  `import { TranslationDictionary } from "./types";\n\nexport const en: TranslationDictionary = ${JSON.stringify(enFull, null, 2)};\n`
);

console.log('Generated ko.ts & en.ts. Keys:', Object.keys(koFull).length, Object.keys(enFull).length);
