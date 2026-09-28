export interface GuideSection {
  heading: string;
  body: string[];
  tip?: string;
}

export interface GuideArticle {
  id: number;
  slug: string;
  category: "edit" | "convert" | "security" | "media" | "mobile";
  categoryLabel: { [lang: string]: string };
  toolHref: string;
  toolName: { [lang: string]: string };
  date: string;
  readTime: { [lang: string]: string };
  mascotMood: "welcome" | "cheering" | "idea" | "ready" | "success";
  keywords: string[];
  translations: {
    [lang: string]: {
      title: string;
      summary: string;
      sections: GuideSection[];
      ctaText: string;
    };
  };
}

export const GUIDE_ARTICLES: GuideArticle[] = [
  // 1. PDF 합치기
  {
    id: 1,
    slug: "how-to-merge-pdf-free",
    category: "edit",
    categoryLabel: { ko: "PDF 편집 팁", en: "PDF Tips", es: "Consejos PDF", ja: "PDFヒント", "zh-CN": "PDF技巧" },
    toolHref: "/merge-pdf",
    toolName: { ko: "PDF 합치기", en: "Merge PDF", es: "Unir PDF", ja: "PDF結合", "zh-CN": "合并PDF" },
    date: "2026-09-28",
    readTime: { ko: "3분 읽기", en: "3 min read", es: "Lectura de 3 min", ja: "3分で読める", "zh-CN": "3分钟阅读" },
    mascotMood: "cheering",
    keywords: [
      "PDF 합치기",
      "무료 PDF 병합",
      "프로그램 없이 PDF 합치기",
      "merge pdf free online",
      "combine pdf files",
      "PDF 結合 無料",
      "unir pdf gratis online",
      "PDF合并 免费"
    ],
    translations: {
      ko: {
        title: "프로그램 설치 없이 여러 PDF 하나로 합치는 가장 쉬운 방법",
        summary: "비싼 유료 프로그램이나 무거운 소프트웨어 설치 없이 웹 브라우저에서 1초 만에 여러 개의 PDF 파일을 순서대로 병합하는 꿀팁을 소개합니다.",
        sections: [
          {
            heading: "왜 PDF 합치기 프로그램 설치가 번거로울까요?",
            body: [
              "회사나 학교에서 과제물, 보고서, 계약서 등을 취합할 때 여러 장의 PDF를 하나의 파일로 합쳐야 하는 경우가 많습니다.",
              "하지만 어도비 애크로뱃(Adobe Acrobat)이나 알PDF 등은 설치 과정이 번거롭고, 최근에는 유료 결제를 유도하는 경우가 대부분입니다.",
              "mypickpdf는 별도의 프로그램 설치나 회원가입 없이 브라우저에서 드래그 앤 드롭만으로 즉시 PDF를 합칠 수 있습니다."
            ],
            tip: "래서팬더 꿀팁: 파일 순서를 마우스로 끌어서 원하는 대로 자유롭게 변경할 수 있어요!"
          },
          {
            heading: "mypickpdf로 3단계 만에 PDF 합치는 방법",
            body: [
              "1단계: mypickpdf의 [PDF 합치기] 도구 페이지로 이동합니다.",
              "2단계: 합치고 싶은 여러 개의 PDF 파일을 끌어다 놓거나 [파일 선택하기]를 클릭하여 등록합니다.",
              "3단계: 문서 순서를 확인한 뒤 [PDF 합치기] 버튼을 누르면 즉시 하나로 합쳐진 완성본이 다운로드됩니다."
            ]
          }
        ],
        ctaText: "지금 바로 무료로 PDF 합치기"
      },
      en: {
        title: "How to Merge Multiple PDF Files into One for Free Without Installing Software",
        summary: "Learn how to combine multiple PDF documents into a single organized file in seconds directly in your web browser—100% free and private.",
        sections: [
          {
            heading: "Why Installing Desktop PDF Software is Outdated",
            body: [
              "Combining contracts, school reports, or research papers is a daily necessity for professionals and students.",
              "Traditional desktop software often requires costly monthly subscriptions or complex installation procedures.",
              "mypickpdf runs entirely inside your browser using client-side WebAssembly, merging documents instantly without sending any data to external servers."
            ],
            tip: "Panda Tip: You can drag and drop file cards to rearrange the merge order anytime!"
          },
          {
            heading: "3 Simple Steps to Merge Your PDFs",
            body: [
              "Step 1: Open the mypickpdf [Merge PDF] tool.",
              "Step 2: Drag and drop all PDF files you want to combine.",
              "Step 3: Arrange their sequence and click [Merge PDF] to download your combined document instantly."
            ]
          }
        ],
        ctaText: "Merge PDFs for Free Now"
      },
      ja: {
        title: "インストール不要で複数のPDFをひとつに結合する最も簡単な方法",
        summary: "高価な有料ソフトのインストール不要で、ブラウザ上でドラッグ＆ドロップするだけで複数のPDFファイルを順番通りに無料結合する裏技を解説します。",
        sections: [
          {
            heading: "なぜデスクトップ専用PDFソフトの導入は不要なのか？",
            body: [
              "契約書やレポート、申請書類などをまとめる際、複数のPDFを1つのファイルに統合する機会は非常に多くあります。",
              "従来のAdobe Acrobatなどは導入手順が複雑で月額費用もかかりますが、mypickpdfなら完全無料でブラウザから即座に結合できます。",
              "ファイルは外部サーバーへ送信されず、端末内ローカルで暗号化処理されるため機密文書も安心です。"
            ],
            tip: "レッサーパンダの小ワザ: マウス操作でカードをドラッグして結合順序を自由に入れ替えられます！"
          },
          {
            heading: "3ステップで完了するPDF結合手順",
            body: [
              "ステップ1: mypickpdfの「PDF結合」ツールページを開きます。",
              "ステップ2: 結合したい複数のPDFファイルを画面にドラッグ＆ドロップします。",
              "ステップ3: ページの並び順を確認して「PDFを結合」をクリックすれば即座にダウンロードできます。"
            ]
          }
        ],
        ctaText: "今すぐ無料でPDFを結合する"
      },
      es: {
        title: "Cómo unir varios archivos PDF en uno gratis sin instalar programas",
        summary: "Descubre el método más rápido y seguro para combinar documentos PDF en el orden deseado directamente desde tu navegador, 100% privado y sin límites.",
        sections: [
          {
            heading: "¿Por qué ya no necesitas software pesado de pago?",
            body: [
              "Unir contratos, facturas o tareas académicas es una necesidad habitual en el trabajo y los estudios.",
              "mypickpdf funciona íntegramente en tu navegador sin enviar datos a servidores externos, garantizando privacidad total y máxima rapidez."
            ],
            tip: "Consejo Panda: ¡Arrastra y suelta las tarjetas de archivos para ordenar la secuencia exacta!"
          },
          {
            heading: "Pasos sencillos para unir tus PDFs",
            body: [
              "Paso 1: Entra en la herramienta [Unir PDF] de mypickpdf.",
              "Paso 2: Arrastra y suelta todos los archivos PDF que deseas juntar.",
              "Paso 3: Organiza el orden y pulsa [Unir PDF] para descargarlo al instante."
            ]
          }
        ],
        ctaText: "Unir PDFs gratis ahora"
      }
    }
  },

  // 2. PDF 용량 줄이기
  {
    id: 2,
    slug: "how-to-compress-pdf-80-percent",
    category: "edit",
    categoryLabel: { ko: "PDF 편집 팁", en: "PDF Tips", es: "Consejos PDF", ja: "PDFヒント", "zh-CN": "PDF技巧" },
    toolHref: "/compress-pdf",
    toolName: { ko: "PDF 압축", en: "Compress PDF", es: "Comprimir PDF", ja: "PDF圧縮", "zh-CN": "压缩PDF" },
    date: "2026-09-28",
    readTime: { ko: "3분 읽기", en: "3 min read", es: "Lectura de 3 min", ja: "3分で読める", "zh-CN": "3分钟阅读" },
    mascotMood: "idea",
    keywords: [
      "PDF 용량 줄이기",
      "PDF 압축",
      "대용량 PDF 줄이기",
      "compress pdf online",
      "reduce pdf file size",
      "PDF 圧縮 容量 軽くする",
      "comprimir pdf gratis sin perder calidad",
      "PDF压缩 减小文件大小"
    ],
    translations: {
      ko: {
        title: "화질 저하 없이 PDF 용량 80% 줄이는 초고속 압축법",
        summary: "이메일 첨부 용량 초과나 공공기관 웹사이트 업로드 제한(10MB 등)에 걸렸을 때, 텍스트와 이미지 선명도를 유지하며 용량을 대폭 줄이는 방법입니다.",
        sections: [
          {
            heading: "이메일 첨부 불가! PDF 용량 초과의 해결책",
            body: [
              "고해상도 이미지나 도표가 많이 포함된 PDF는 파일 크기가 수십 메가바이트(MB)에 달해 이메일 발송이나 전자결재 첨부가 불가능한 경우가 많습니다.",
              "단순히 이미지 화질을 뭉개는 구형 방식과 달리, mypickpdf는 스마트 압축 알고리즘을 통해 폰트와 벡터 그래픽을 최적화하여 글씨는 또렷하게 유지하면서 불필요한 메타데이터만 쏙 빼냅니다."
            ],
            tip: "래서팬더 꿀팁: 30MB가 넘는 무거운 제안서도 단 2초 만에 5MB 이하로 다이어트할 수 있어요!"
          },
          {
            heading: "누구나 할 수 있는 초간단 PDF 압축 순서",
            body: [
              "1단계: mypickpdf [PDF 압축] 페이지에 접속합니다.",
              "2단계: 용량을 줄이고 싶은 대용량 PDF 파일을 끌어다 놓습니다.",
              "3단계: [PDF 압축하기] 버튼을 누르면 즉시 용량이 최대 80% 절감된 최적화 파일이 저장됩니다."
            ]
          }
        ],
        ctaText: "지금 바로 PDF 용량 줄이기"
      },
      en: {
        title: "How to Reduce PDF File Size by up to 80% Without Losing Quality",
        summary: "Overcome email attachment limits and web upload quotas with our lightning-fast browser-based PDF compression tool.",
        sections: [
          {
            heading: "Beat Email Attachment Limits with Smart PDF Compression",
            body: [
              "High-resolution graphics and scans often inflate PDF documents beyond 25MB, blocking them from email gateways and portals.",
              "mypickpdf employs intelligent stream optimization, removing redundant data while preserving razor-sharp text and crisp illustrations."
            ],
            tip: "Panda Tip: Experience lightning compression with zero upload waiting times!"
          },
          {
            heading: "How to Compress in 3 Easy Steps",
            body: [
              "Step 1: Navigate to the [Compress PDF] tool on mypickpdf.",
              "Step 2: Upload your large PDF file by dragging it into the dropzone.",
              "Step 3: Click [Compress PDF] and download your compact, high-quality document."
            ]
          }
        ],
        ctaText: "Compress PDF Online Now"
      },
      ja: {
        title: "画質を落とさずにPDF容量を最大80%軽量化する圧縮テクニック",
        summary: "メール添付の容量オーバーやWeb申請の上限をクリア！テキストや画像の鮮明さを保ちながら超高速でPDFファイルサイズを削減する方法です。",
        sections: [
          {
            heading: "メール添付制限を瞬時にクリアするスマート圧縮",
            body: [
              "高解像度画像が含まれたPDFは数十メガバイトになりがちで、メール送信エラーの原因になります。",
              "mypickpdfは文字や図形のクリアさを維持したまま、余計な内部データのみを効率的に圧縮最適化します。"
            ],
            tip: "レッサーパンダの小ワザ: 30MB超の重いファイルも数秒で5MB以下にスリム化できます！"
          },
          {
            heading: "簡単3ステップの圧縮手順",
            body: [
              "ステップ1: 「PDF圧縮」ツールページにアクセスします。",
              "ステップ2: 圧縮したいファイルをドロップします。",
              "ステップ3: 「PDFを圧縮」をクリックして軽量化されたファイルを保存します。"
            ]
          }
        ],
        ctaText: "今すぐPDF容量を圧縮する"
      },
      es: {
        title: "Cómo reducir el tamaño de un PDF hasta un 80% sin perder calidad",
        summary: "Supera los límites de subida y envío por correo electrónico comprimiendo tus documentos PDF con la máxima nitidez directamente en tu navegador.",
        sections: [
          {
            heading: "Solución definitiva para PDFs demasiado pesados",
            body: [
              "Los documentos escaneados o con fotos suelen superar los 25MB permitidos por el correo.",
              "mypickpdf optimiza los flujos de datos internos sin emborronar el texto ni las ilustraciones clave."
            ],
            tip: "Consejo Panda: ¡Comprime archivos pesados en pocos segundos con total seguridad!"
          },
          {
            heading: "Pasos para comprimir en 3 clics",
            body: [
              "Paso 1: Abre la herramienta [Comprimir PDF] en mypickpdf.",
              "Paso 2: Arrastra tu documento PDF al área de trabajo.",
              "Paso 3: Haz clic en [Comprimir PDF] y guarda tu archivo optimizado."
            ]
          }
        ],
        ctaText: "Comprimir PDF gratis ahora"
      }
    }
  },

  // 3. PDF 나누기 / 분할
  {
    id: 3,
    slug: "how-to-split-pdf-pages",
    category: "edit",
    categoryLabel: { ko: "PDF 편집 팁", en: "PDF Tips", es: "Consejos PDF", ja: "PDFヒント", "zh-CN": "PDF技巧" },
    toolHref: "/split-pdf",
    toolName: { ko: "PDF 나누기", en: "Split PDF", es: "Dividir PDF", ja: "PDF分割", "zh-CN": "拆分PDF" },
    date: "2026-09-28",
    readTime: { ko: "2분 읽기", en: "2 min read", es: "Lectura de 2 min", ja: "2分で読める", "zh-CN": "2分钟阅读" },
    mascotMood: "ready",
    keywords: [
      "PDF 나누기",
      "PDF 분할",
      "PDF 페이지만 추출",
      "split pdf free",
      "extract pdf pages",
      "PDF 分割 ページ抽出",
      "dividir pdf gratis",
      "PDF拆分"
    ],
    translations: {
      ko: {
        title: "100페이지 대용량 PDF에서 원하는 페이지만 쏙 뽑아내는 방법",
        summary: "수십~수백 장의 방대한 문서 중 필요한 페이지만 낱장으로 분할하거나 특정 구간(예: 3~7페이지)만 추출하여 새 파일로 만드는 팁입니다.",
        sections: [
          {
            heading: "불필요한 페이지는 버리고 필요한 내용만 깔끔하게!",
            body: [
              "논문, 매뉴얼, 계약서 전체를 다 공유할 필요 없이 특정 조항이나 요약 페이지만 따로 떼어내어 전송해야 할 때가 있습니다.",
              "mypickpdf의 [PDF 나누기] 도구는 원하는 페이지 번호를 입력하거나 범위를 지정하여 몇 초 만에 분리해 줍니다."
            ],
            tip: "래서팬더 꿀팁: 낱장 분할 모드를 선택하면 모든 페이지가 개별 파일로 분할되어 압축파일(ZIP)로 한 번에 다운로드됩니다."
          }
        ],
        ctaText: "지금 바로 PDF 페이지 추출하기"
      },
      en: {
        title: "How to Extract Specific Pages or Split Large PDF Documents",
        summary: "Extract select pages or split multi-page reports into individual standalone files quickly and securely in your browser.",
        sections: [
          {
            heading: "Extract Only What You Need",
            body: [
              "Sharing a 200-page manual when your client only needs pages 5 through 10 is inefficient and cluttered.",
              "With mypickpdf Split PDF, you can type precise page ranges or split every single page into distinct documents."
            ],
            tip: "Panda Tip: Choose batch split to get all pages cleanly packed into a convenient ZIP archive!"
          }
        ],
        ctaText: "Split PDF for Free Now"
      }
    }
  },

  // 4. PDF 한글(HWPX) 변환
  {
    id: 4,
    slug: "how-to-convert-pdf-to-hwp",
    category: "convert",
    categoryLabel: { ko: "오피스 변환", en: "Office Convert", es: "Conversión Office", ja: "オフィス変換", "zh-CN": "文档转换" },
    toolHref: "/pdf-to-hwp",
    toolName: { ko: "PDF 한글 변환", en: "PDF to HWP", es: "PDF a HWP", ja: "PDFからHWPへ", "zh-CN": "PDF转HWP" },
    date: "2026-09-28",
    readTime: { ko: "4분 읽기", en: "4 min read", es: "Lectura de 4 min", ja: "4分で読める", "zh-CN": "4分钟阅读" },
    mascotMood: "success",
    keywords: [
      "PDF HWP 변환",
      "PDF HWPX 변환",
      "공공기관 한글 서식",
      "알PDF 한글 변환 대체",
      "pdf to hwp free",
      "convert pdf to hwpx",
      "PDFからHWPへ"
    ],
    translations: {
      ko: {
        title: "공공기관 제출용 서식 완벽 호환! PDF 문서를 한글(HWPX)로 변환하는 법",
        summary: "정부24, 학교, 공공기관 서식 파일이 PDF로 되어 있어 편집하기 곤란하셨나요? 표 서식과 텍스트를 그대로 유지하며 한컴오피스(.hwpx) 파일로 즉시 변환하는 솔루션입니다.",
        sections: [
          {
            heading: "국내 공공기관 및 교육계 필수: PDF를 HWP로 변환하기",
            body: [
              "국내 공공기관, 초중고교, 대학교에서는 여전히 한컴오피스(.hwp / .hwpx) 포맷이 표준입니다.",
              "하지만 배포되는 양식은 PDF인 경우가 많아 일일이 타이핑하거나 표를 다시 그리는 불편함이 있었습니다.",
              "mypickpdf는 최신 개방형 표준 규격인 HWPX 구조 분석 엔진을 내장하여, 문서 내 표와 텍스트를 한컴오피스에서 바로 타이핑하고 수정할 수 있도록 정밀 변환합니다."
            ],
            tip: "래서팬더 꿀팁: 변환된 HWPX 파일은 한컴오피스 2014 이상 모든 버전과 폴라리스 오피스, 한컴 웹 한글에서 완벽히 열립니다!"
          }
        ],
        ctaText: "지금 바로 PDF를 한글로 변환하기"
      },
      en: {
        title: "How to Convert PDF Documents to Editable Korean Hangul (HWP/HWPX) Format",
        summary: "Essential guide for Korean government agencies, schools, and business forms: convert read-only PDFs into editable HWPX documents.",
        sections: [
          {
            heading: "Bridge the Gap Between PDF and Korean Hangul Documents",
            body: [
              "The Hangul Word Processor format (.hwp/.hwpx) is the official documentation standard across Korean administrative organizations.",
              "mypickpdf converts PDF tables and typography directly into editable HWPX components without formatting distortion."
            ],
            tip: "Panda Tip: Enjoy native HWPX files compatible with Hancom Office and Hancom Docs web suite!"
          }
        ],
        ctaText: "Convert PDF to HWP Now"
      }
    }
  },

  // 5. JPG 이미지 PDF 변환
  {
    id: 5,
    slug: "how-to-convert-jpg-to-pdf",
    category: "convert",
    categoryLabel: { ko: "오피스 변환", en: "Office Convert", es: "Conversión Office", ja: "オフィス変換", "zh-CN": "文档转换" },
    toolHref: "/image-to-pdf",
    toolName: { ko: "JPG PDF 변환", en: "JPG to PDF", es: "JPG a PDF", ja: "JPGからPDFへ", "zh-CN": "JPG转PDF" },
    date: "2026-09-28",
    readTime: { ko: "2분 읽기", en: "2 min read", es: "Lectura de 2 min", ja: "2分で読める", "zh-CN": "2分钟阅读" },
    mascotMood: "ready",
    keywords: [
      "JPG PDF 변환",
      "사진 PDF 변환",
      "이미지 PDF 묶기",
      "image to pdf converter",
      "jpg to pdf free",
      "画像 PDF 変換",
      "pasar fotos a pdf",
      "图片转PDF"
    ],
    translations: {
      ko: {
        title: "스마트폰 사진(JPG/PNG)을 깔끔한 단일 PDF 문서로 묶는 방법",
        summary: "영수증, 신분증, 강의 필기 등 스마트폰으로 찍은 여러 장의 사진을 순서대로 깔끔하게 정리된 고화질 PDF 전자문서로 만드는 방법입니다.",
        sections: [
          {
            heading: "사진 여러 장을 한 번에 정돈된 보고서 PDF로!",
            body: [
              "회사 경비 처리용 영수증 사진 여러 장이나 강의 필기 사진들을 카톡이나 메일로 하나하나 보내면 정리하기 어렵습니다.",
              "mypickpdf [JPG PDF 변환]을 이용하면 여러 장의 사진을 한 번에 드래그하여 A4 규격의 깔끔한 하나의 PDF 책으로 묶을 수 있습니다."
            ],
            tip: "래서팬더 꿀팁: 가로 사진과 세로 사진이 섞여 있어도 자동으로 보기 좋게 비율을 맞춰줍니다!"
          }
        ],
        ctaText: "지금 바로 사진을 PDF로 묶기"
      },
      en: {
        title: "How to Convert Smartphone Photos (JPG/PNG) into Clean Single PDF Documents",
        summary: "Combine receipts, lecture notes, and ID scans into a professional PDF portfolio in seconds right on your phone or laptop.",
        sections: [
          {
            heading: "Turn Cluttered Photos into Clean Electronic Documents",
            body: [
              "Sending multiple individual photo files via messaging apps creates disorganization for recipients.",
              "With mypickpdf Image to PDF, select as many JPGs or PNGs as you like and compile them into a paginated PDF document instantly."
            ],
            tip: "Panda Tip: Both portrait and landscape images are automatically aligned for optimal readability!"
          }
        ],
        ctaText: "Convert Images to PDF Now"
      }
    }
  },

  // 6. PDF 워드(DOCX) 변환
  {
    id: 6,
    slug: "how-to-convert-pdf-to-word",
    category: "convert",
    categoryLabel: { ko: "오피스 변환", en: "Office Convert", es: "Conversión Office", ja: "オフィス変換", "zh-CN": "文档转换" },
    toolHref: "/pdf-to-word",
    toolName: { ko: "PDF 워드 변환", en: "PDF to Word", es: "PDF a Word", ja: "PDFからWordへ", "zh-CN": "PDF转Word" },
    date: "2026-09-28",
    readTime: { ko: "3분 읽기", en: "3 min read", es: "Lectura de 3 min", ja: "3分で読める", "zh-CN": "3分钟阅读" },
    mascotMood: "idea",
    keywords: [
      "PDF 워드 변환",
      "PDF docx 변환",
      "PDF 수정하는 법",
      "pdf to word editable free",
      "convert pdf to word docx",
      "PDF ワード 変換",
      "convertir pdf a word",
      "PDF转Word"
    ],
    translations: {
      ko: {
        title: "PDF 글자 수정이 필요할 때! 편집 가능한 Word(.docx)로 변환하는 법",
        summary: "원본 워드 파일이 유실되었거나 오타를 수정해야 할 때, PDF 내 서식과 문단을 그대로 보존하며 마이크로소프트 워드 문서로 바꾸는 비결을 공유합니다.",
        sections: [
          {
            heading: "PDF는 수정할 수 없다? Word로 바꾸면 1초 만에 해결!",
            body: [
              "PDF 문서는 원래 출력을 목적으로 설계되어 텍스트 직접 수정이 매우 까다롭습니다.",
              "mypickpdf [PDF 워드 변환]은 문서의 제목, 본문, 글꼴 크기, 여백 구조를 분석하여 MS Word(.docx) 형식으로 재구성해 주므로 바로 워드에서 글자를 고치고 서식을 변경할 수 있습니다."
            ],
            tip: "래서팬더 꿀팁: 변환 후 Word, 한컴오피스, Google Docs 모두에서 자유롭게 편집 가능합니다."
          }
        ],
        ctaText: "지금 바로 PDF를 워드로 변환하기"
      },
      en: {
        title: "How to Convert PDF Files into Fully Editable Microsoft Word Documents",
        summary: "Recover lost source files and fix typos by converting read-only PDFs into editable Microsoft Word (.docx) files without retyping.",
        sections: [
          {
            heading: "Edit Any PDF by Converting to DOCX",
            body: [
              "PDFs are built for visual consistency rather than editing, making quick corrections frustrating without source documents.",
              "mypickpdf reconstructs paragraphs, fonts, and tables into genuine Microsoft Word structures for seamless editing."
            ],
            tip: "Panda Tip: Open the resulting DOCX seamlessly in MS Word, Google Docs, or LibreOffice!"
          }
        ],
        ctaText: "Convert PDF to Word Now"
      }
    }
  },

  // 7. PDF 엑셀(XLSX) 변환
  {
    id: 7,
    slug: "how-to-convert-pdf-to-excel",
    category: "convert",
    categoryLabel: { ko: "오피스 변환", en: "Office Convert", es: "Conversión Office", ja: "オフィス変換", "zh-CN": "文档转换" },
    toolHref: "/pdf-to-excel",
    toolName: { ko: "PDF 엑셀 변환", en: "PDF to Excel", es: "PDF a Excel", ja: "PDFからExcelへ", "zh-CN": "PDF转Excel" },
    date: "2026-09-28",
    readTime: { ko: "3분 읽기", en: "3 min read", es: "Lectura de 3 min", ja: "3分で読める", "zh-CN": "3分钟阅读" },
    mascotMood: "ready",
    keywords: [
      "PDF 엑셀 변환",
      "PDF 표 추출",
      "재무제표 PDF 엑셀",
      "pdf to excel table extractor",
      "convert pdf to xlsx",
      "PDF エクセル 変換",
      "convertir pdf a excel",
      "PDF转Excel"
    ],
    translations: {
      ko: {
        title: "복잡한 표와 수치 데이터도 한 번에! PDF를 엑셀(XLSX)로 추출하는 법",
        summary: "재무제표, 통계 자료, 견적서 PDF에 담긴 수많은 행과 열 데이터를 하나하나 복사-붙여넣기 하지 않고 즉시 엑셀 스프레드시트로 옮기는 법을 알아봅니다.",
        sections: [
          {
            heading: "일일이 복사해서 붙여넣던 노가다는 이제 그만!",
            body: [
              "PDF 문서 속 표를 일반 복사해서 엑셀에 붙여넣으면 행과 열이 뒤엉켜 엉망이 되기 일쑤입니다.",
              "mypickpdf [PDF 엑셀 변환]은 표의 테두리와 셀 좌표를 지능적으로 감지하여 온전한 엑셀 그리드 셀 구조로 정확히 배치해 줍니다."
            ],
            tip: "래서팬더 꿀팁: 변환 즉시 SUM, AVERAGE 등 엑셀 함수를 바로 적용할 수 있습니다!"
          }
        ],
        ctaText: "지금 바로 PDF 표 엑셀로 추출하기"
      },
      en: {
        title: "How to Extract Tables and Financial Data from PDF into Excel (XLSX)",
        summary: "Stop manual retyping: convert complex tabular reports, balance sheets, and receipts into accurate Excel spreadsheets with one click.",
        sections: [
          {
            heading: "No More Broken Paste Formatting in Excel",
            body: [
              "Standard copy-and-paste from PDF tables splits data across awkward rows and corrupts cell alignment.",
              "mypickpdf identifies table borders and column delimiters, restoring data into clean, calculate-ready Excel spreadsheets."
            ],
            tip: "Panda Tip: Calculate formulas like SUM and VLOOKUP right away on the extracted tables!"
          }
        ],
        ctaText: "Extract PDF to Excel Now"
      }
    }
  },

  // 8. PDF 파워포인트(PPTX) 변환
  {
    id: 8,
    slug: "how-to-convert-pdf-to-powerpoint",
    category: "convert",
    categoryLabel: { ko: "오피스 변환", en: "Office Convert", es: "Conversión Office", ja: "オフィス変換", "zh-CN": "文档转换" },
    toolHref: "/pdf-to-powerpoint",
    toolName: { ko: "PDF PPT 변환", en: "PDF to PPT", es: "PDF a PPT", ja: "PDFからPPTへ", "zh-CN": "PDF转PPT" },
    date: "2026-09-28",
    readTime: { ko: "3분 읽기", en: "3 min read", es: "Lectura de 3 min", ja: "3分で読める", "zh-CN": "3分钟阅读" },
    mascotMood: "cheering",
    keywords: [
      "PDF PPT 변환",
      "PDF 파워포인트 변환",
      "발표자료 PDF 슬라이드",
      "pdf to powerpoint slides",
      "convert pdf to pptx",
      "PDF パワーポイント 変換",
      "convertir pdf a powerpoint",
      "PDF转PPT"
    ],
    translations: {
      ko: {
        title: "발표 자료 재활용: PDF 문서를 파워포인트(PPTX) 슬라이드로 변환하기",
        summary: "이전에 발표했던 자료나 외부에서 받은 PDF 강연 슬라이드를 다시 프레젠테이션용 PPTX 슬라이드로 되살리는 노하우입니다.",
        sections: [
          {
            heading: "PDF 발표 자료를 다시 살아있는 프레젠테이션으로!",
            body: [
              "PDF로 저장된 멋진 슬라이드를 다음 발표에서 일부만 수정하여 다시 사용하고 싶을 때가 많습니다.",
              "mypickpdf [PDF PPT 변환]은 각 페이지를 파워포인트 개별 슬라이드로 정확히 매핑하여 새 발표 자료 제작 시간을 대폭 단축시켜 줍니다."
            ],
            tip: "래서팬더 꿀팁: 16:9 와이드 슬라이드와 4:3 표준 슬라이드 비율을 모두 깔끔하게 유지합니다."
          }
        ],
        ctaText: "지금 바로 PDF를 PPT로 변환하기"
      },
      en: {
        title: "How to Convert PDF Presentations Back into PowerPoint (PPTX) Slides",
        summary: "Turn static slide decks and seminar handouts back into dynamic PowerPoint presentations ready for your next big meeting.",
        sections: [
          {
            heading: "Reuse and Refresh Slide Content with Ease",
            body: [
              "When you need to update an archived PDF slide deck, recreating every slide from scratch wastes hours.",
              "mypickpdf converts every PDF page into a designated PowerPoint slide with native presentation aspect ratios."
            ],
            tip: "Panda Tip: Works smoothly with Microsoft PowerPoint, Apple Keynote, and Google Slides!"
          }
        ],
        ctaText: "Convert PDF to PPT Now"
      }
    }
  },

  // 9. 동영상 압축 (카카오톡/이메일용)
  {
    id: 9,
    slug: "how-to-compress-video-for-kakaotalk",
    category: "media",
    categoryLabel: { ko: "미디어 꿀팁", en: "Media Tips", es: "Consejos Multimedia", ja: "メディアヒント", "zh-CN": "媒体技巧" },
    toolHref: "/compress-video",
    toolName: { ko: "동영상 압축", en: "Compress Video", es: "Comprimir Video", ja: "動画圧縮", "zh-CN": "视频压缩" },
    date: "2026-09-28",
    readTime: { ko: "3분 읽기", en: "3 min read", es: "Lectura de 3 min", ja: "3分で読める", "zh-CN": "3分钟阅读" },
    mascotMood: "idea",
    keywords: [
      "동영상 용량 줄이기",
      "카카오톡 동영상 압축",
      "MP4 용량 줄이기",
      "compress video for email",
      "reduce mp4 size online",
      "動画 圧縮 無料",
      "comprimir video mp4",
      "视频压缩"
    ],
    translations: {
      ko: {
        title: "카카오톡·이메일 전송용 대용량 동영상 용량 80% 줄이는 꿀팁",
        summary: "스마트폰으로 촬영한 4K·FHD 대용량 동영상이 카톡 전송 제한(300MB)이나 이메일 첨부 용량(25MB)을 넘을 때, 화질 손상 없이 가볍게 압축하는 방법입니다.",
        sections: [
          {
            heading: "스마트폰 촬영 영상이 너무 커서 안 보내질 때!",
            body: [
              "요즘 스마트폰 카메라는 화질이 매우 뛰어나 몇 초만 찍어도 수백 메가바이트(MB)를 훌쩍 넘습니다.",
              "mypickpdf [동영상 압축]은 최신 H.264/WebM 하드웨어 가속 비디오 인코딩 기술을 적용하여, 사람 눈에 보이는 화질 차이는 최소화하면서 데이터 용량은 최대 80%까지 시원하게 다이어트해 줍니다."
            ],
            tip: "래서팬더 꿀팁: 동영상이 외부 서버로 업로드되지 않고 내 기기 안에서 직접 압축되므로 데이터 요금이 들지 않고 사생활 유출 위험이 없습니다!"
          }
        ],
        ctaText: "지금 바로 동영상 용량 줄이기"
      },
      en: {
        title: "How to Compress Large MP4/MOV Videos for Messaging and Email Transfers",
        summary: "Shrink heavy 4K and FHD phone recordings up to 80% smaller without noticeable blur or pixelation—all inside your browser.",
        sections: [
          {
            heading: "Never Hit Video Transfer Size Limits Again",
            body: [
              "Modern mobile video files quickly exceed email attachment quotas and social chat file restrictions.",
              "mypickpdf employs hardware-accelerated client-side encoding, reducing file sizes drastically while maintaining crisp visuals."
            ],
            tip: "Panda Tip: Your personal videos never leave your device, ensuring total privacy!"
          }
        ],
        ctaText: "Compress Video Online Now"
      }
    }
  },

  // 10. 동영상 GIF 움짤 변환
  {
    id: 10,
    slug: "how-to-make-gif-from-video",
    category: "media",
    categoryLabel: { ko: "미디어 꿀팁", en: "Media Tips", es: "Consejos Multimedia", ja: "メディアヒント", "zh-CN": "媒体技巧" },
    toolHref: "/video-to-gif",
    toolName: { ko: "동영상 GIF 변환", en: "Video to GIF", es: "Video a GIF", ja: "動画GIF変換", "zh-CN": "视频转GIF" },
    date: "2026-09-28",
    readTime: { ko: "2분 읽기", en: "2 min read", es: "Lectura de 2 min", ja: "2分で読める", "zh-CN": "2分钟阅读" },
    mascotMood: "cheering",
    keywords: [
      "동영상 GIF 변환",
      "움짤 만들기",
      "카톡 움짤",
      "convert video to animated gif",
      "make gif from video",
      "動画 GIF 変換",
      "crear gif de video",
      "视频转GIF动图"
    ],
    translations: {
      ko: {
        title: "동영상 클립으로 1초 만에 고화질 움직이는 짤(GIF) 만들기",
        summary: "반려동물 영상이나 재밌는 하이라이트 동영상을 블로그나 커뮤니티, 단톡방에 바로 재생되는 고화질 GIF 움짤로 변환하는 가장 빠른 방법입니다.",
        sections: [
          {
            heading: "클릭 한 번으로 탄생하는 생생한 움짤!",
            body: [
              "동영상은 재생 버튼을 눌러야 하지만, GIF 움짤은 카톡이나 블로그에서 자동으로 움직여 시선을 사로잡습니다.",
              "mypickpdf [동영상 GIF 변환]에 영상을 올리면 별도의 편집 프로그램(포토샵 등) 없이도 원하는 프레임 레이트와 화질의 부드러운 GIF를 즉시 만들어 줍니다."
            ],
            tip: "래서팬더 꿀팁: 반려동물의 귀여운 순간을 1초 만에 카톡용 짤로 만들어 친구들에게 자랑해보세요!"
          }
        ],
        ctaText: "지금 바로 고화질 GIF 움짤 만들기"
      },
      en: {
        title: "How to Turn Video Clips into Smooth Animated GIFs in Seconds",
        summary: "Transform cute pet moments and highlight reels into high-framerate animated GIFs perfect for blog posts and social messaging.",
        sections: [
          {
            heading: "Create Eye-Catching GIFs Without Complex Editing Suites",
            body: [
              "Animated GIFs play automatically across forums, social media feeds, and messengers without requiring video players.",
              "mypickpdf converts your favorite video snippets into optimized, lightweight GIFs with balanced color palettes."
            ],
            tip: "Panda Tip: Share your animated memes and tutorials anywhere with zero compatibility issues!"
          }
        ],
        ctaText: "Create Animated GIF Now"
      }
    }
  },

  // 11. 서버 저장 0% 보안 가이드
  {
    id: 11,
    slug: "client-side-pdf-security",
    category: "security",
    categoryLabel: { ko: "보안 가이드", en: "Security Guide", es: "Guía de Seguridad", ja: "セキュリティガイド", "zh-CN": "安全指南" },
    toolHref: "/compress-pdf",
    toolName: { ko: "안심 보안 체험", en: "Experience Safe PDF", es: "PDF Seguro", ja: "安心セキュリティ体験", "zh-CN": "安全体验" },
    date: "2026-09-28",
    readTime: { ko: "4분 읽기", en: "4 min read", es: "Lectura de 4 min", ja: "4分で読める", "zh-CN": "4分钟阅读" },
    mascotMood: "ready",
    keywords: [
      "PDF 보안",
      "서버 전송 없는 PDF",
      "회사 기밀 문서 PDF",
      "secure client side pdf converter",
      "private pdf tools no server",
      "ローカル PDF 変換 安全",
      "pdf privado sin servidor"
    ],
    translations: {
      ko: {
        title: "회사 기밀 문서도 안심! 서버 전송 0% 클라이언트 사이드 변환의 원리",
        summary: "온라인 무료 PDF 사이트에 회계 자료나 개인정보 문서를 올리기 꺼려지셨나요? mypickpdf가 왜 해킹이나 유출 걱정 없이 100% 안전한지 기술적 원리를 밝힙니다.",
        sections: [
          {
            heading: "기존 온라인 PDF 변환 사이트의 숨겨진 위험",
            body: [
              "일반적인 온라인 변환 사이트는 사용자가 올린 문서를 해외 클라우드 서버로 업로드한 뒤 서버에서 변환하여 다시 내려줍니다.",
              "이 과정에서 회사의 재무 정보, 계약서, 신분증 사본 등이 제3자 서버에 저장되거나 유출될 위험이 존재합니다."
            ],
            tip: "래서팬더 꿀팁: mypickpdf는 비행기 모드나 인터넷을 끊은 상태에서도 문서 변환이 동작할 정도로 완벽한 로컬 환경을 제공합니다!"
          },
          {
            heading: "mypickpdf의 100% Client-Side WebAssembly 기술",
            body: [
              "mypickpdf는 최신 WebAssembly 기술을 채택하여 모든 암호화, 파싱, 렌더링 엔진이 사용자의 PC/스마트폰 메모리 안에서만 구동됩니다.",
              "귀하의 파일은 인터넷망을 단 1바이트도 통과하지 않으므로, 은행이나 대기업 보안 감사 규정에도 완벽히 부합합니다."
            ]
          }
        ],
        ctaText: "안전한 100% 로컬 PDF 도구 써보기"
      },
      en: {
        title: "Why Zero-Server Transmission Matters: Complete Privacy for Confidential Documents",
        summary: "Understand the technology behind 100% client-side WebAssembly processing and why your confidential enterprise documents never leak.",
        sections: [
          {
            heading: "The Hidden Security Risks of Conventional Online PDF Converters",
            body: [
              "Most free web services silently transmit your uploaded files to third-party overseas cloud datacenters for remote conversion.",
              "This workflow poses acute compliance liabilities for sensitive financial data, legal contracts, and personal identity records."
            ],
            tip: "Panda Tip: mypickpdf operates even in offline mode because all processing happens on your local device CPU/RAM!"
          },
          {
            heading: "100% Client-Side Architecture Guarantee",
            body: [
              "mypickpdf utilizes cutting-edge WebAssembly binaries running inside your browser sandbox.",
              "Not a single byte of your document is transferred over the wire, satisfying the strictest enterprise confidentiality policies."
            ]
          }
        ],
        ctaText: "Experience Zero-Leakage PDF Tools"
      }
    }
  },

  // 12. PDF 페이지 번호 매기기
  {
    id: 12,
    slug: "how-to-add-page-numbers-to-pdf",
    category: "edit",
    categoryLabel: { ko: "PDF 편집 팁", en: "PDF Tips", es: "Consejos PDF", ja: "PDFヒント", "zh-CN": "PDF技巧" },
    toolHref: "/add-page-numbers",
    toolName: { ko: "페이지 번호", en: "Page Numbers", es: "Números de Página", ja: "ページ番号追加", "zh-CN": "添加页码" },
    date: "2026-09-28",
    readTime: { ko: "2분 읽기", en: "2 min read", es: "Lectura de 2 min", ja: "2分で読める", "zh-CN": "2分钟阅读" },
    mascotMood: "idea",
    keywords: [
      "PDF 페이지 번호",
      "PDF 쪽번호",
      "논문 쪽번호 매기기",
      "add page numbers to pdf online",
      "number pdf pages free",
      "PDF ページ番号 追加",
      "numerar paginas pdf online",
      "PDF添加页码"
    ],
    translations: {
      ko: {
        title: "논문·보고서 제출 필수: PDF에 쪽번호/페이지 번호 일괄 삽입하기",
        summary: "여러 문서를 합쳤거나 원본에 쪽번호가 누락되었을 때, 원하는 위치(하단 중앙, 우측 하단 등)에 깔끔하게 페이지 번호를 일괄 부여하는 방법입니다.",
        sections: [
          {
            heading: "제출용 문서의 완성도를 높이는 페이지 번호 삽입",
            body: [
              "보고서나 과제물을 제출할 때 페이지 번호가 없으면 채점관이나 독자가 원하는 페이지를 찾기 어렵습니다.",
              "mypickpdf [PDF 페이지 번호] 도구를 사용하면 1초 만에 하단 중앙, 우측 상단 등 원하는 위치와 폰트 스타일로 쪽번호를 매길 수 있습니다."
            ],
            tip: "래서팬더 꿀팁: 표지(1페이지)를 제외하고 2페이지부터 번호가 시작되도록 설정할 수도 있어요!"
          }
        ],
        ctaText: "지금 바로 PDF 페이지 번호 매기기"
      },
      en: {
        title: "How to Add Page Numbers to PDF Reports and Theses in Seconds",
        summary: "Stamp clean, consistent pagination onto all pages of your merged reports, academic theses, and business presentations effortlessly.",
        sections: [
          {
            heading: "Polish Your Documents with Proper Pagination",
            body: [
              "Submitting formal reports without page numbering complicates reviewing and referencing.",
              "mypickpdf lets you specify numbering formats, font dimensions, and corner alignments with one click."
            ],
            tip: "Panda Tip: You can easily skip cover pages and start counting from page 2 onwards!"
          }
        ],
        ctaText: "Add Page Numbers to PDF Now"
      }
    }
  },

  // 13. PDF 워터마크 추가
  {
    id: 13,
    slug: "how-to-add-watermark-to-pdf",
    category: "security",
    categoryLabel: { ko: "보안 가이드", en: "Security Guide", es: "Guía de Seguridad", ja: "セキュリティガイド", "zh-CN": "安全指南" },
    toolHref: "/add-watermark",
    toolName: { ko: "PDF 워터마크", en: "Add Watermark", es: "Marca de Agua", ja: "透かし追加", "zh-CN": "添加水印" },
    date: "2026-09-28",
    readTime: { ko: "2분 읽기", en: "2 min read", es: "Lectura de 2 min", ja: "2分で読める", "zh-CN": "2分钟阅读" },
    mascotMood: "ready",
    keywords: [
      "PDF 워터마크",
      "대외비 표시",
      "PDF 기밀 워터마크",
      "add watermark to pdf document",
      "watermark pdf free online",
      "PDF 透かし 追加",
      "marca de agua pdf gratis",
      "PDF添加水印"
    ],
    translations: {
      ko: {
        title: "대외비·기밀 문서 무단 유출 방지: PDF 반투명 워터마크 추가법",
        summary: "견적서, 제안서, 사내 대외비 문서를 외부에 배포할 때 무단 복제와 도용을 방지하기 위해 'CONFIDENTIAL' 또는 회사 로고 워터마크를 삽입하는 가이드입니다.",
        sections: [
          {
            heading: "문서 보안의 첫걸음, 워터마크 삽입",
            body: [
              "배포된 PDF 문서는 쉽게 스크린샷되거나 공유될 수 있어 지적재산권과 기밀 보호 장치가 필수적입니다.",
              "mypickpdf [PDF 워터마크]를 이용하면 대각선 반투명 텍스트(예: 대외비, 복제금지)나 원하는 이미지를 전 페이지에 균일하게 스탬프할 수 있습니다."
            ],
            tip: "래서팬더 꿀팁: 투명도를 20~30%로 설정하면 본문 글씨를 가리지 않으면서도 보안 표시는 선명하게 남습니다!"
          }
        ],
        ctaText: "지금 바로 PDF에 워터마크 넣기"
      },
      en: {
        title: "How to Add Confidential Watermarks to Protect Sensitive PDF Files",
        summary: "Stamp customizable 'CONFIDENTIAL', 'DRAFT', or company copyright watermarks diagonally across your PDFs to prevent unauthorized copying.",
        sections: [
          {
            heading: "Safeguard Intellectual Property on Distributed Documents",
            body: [
              "Once shared, PDF documents can be reshared without credit unless watermarked with ownership identifiers.",
              "mypickpdf allows you to customize opacity, rotation angle, and text sizing for elegant, non-intrusive document protection."
            ],
            tip: "Panda Tip: Setting 25% opacity ensures text remains legible while keeping security markings prominent!"
          }
        ],
        ctaText: "Watermark PDF for Free Now"
      }
    }
  },

  // 14. PDF 회전
  {
    id: 14,
    slug: "how-to-rotate-pdf-pages",
    category: "edit",
    categoryLabel: { ko: "PDF 편집 팁", en: "PDF Tips", es: "Consejos PDF", ja: "PDFヒント", "zh-CN": "PDF技巧" },
    toolHref: "/rotate-pdf",
    toolName: { ko: "PDF 회전", en: "Rotate PDF", es: "Rotar PDF", ja: "PDF回転", "zh-CN": "旋转PDF" },
    date: "2026-09-28",
    readTime: { ko: "2분 읽기", en: "2 min read", es: "Lectura de 2 min", ja: "2分で読める", "zh-CN": "2分钟阅读" },
    mascotMood: "ready",
    keywords: [
      "PDF 회전",
      "거꾸로 스캔된 PDF",
      "PDF 90도 회전",
      "rotate pdf permanently",
      "rotate pdf pages online free",
      "PDF 回転 永久保存",
      "rotar pdf online",
      "旋转PDF页面"
    ],
    translations: {
      ko: {
        title: "거꾸로 스캔된 문서 바로잡기: PDF 90도/180도 회전 및 영구 저장법",
        summary: "스캐너로 복사할 때 옆으로 눕거나 상하가 뒤집힌 채 생성된 PDF 페이지의 각도를 정방향으로 회전하여 깔끔하게 영구 저장하는 방법입니다.",
        sections: [
          {
            heading: "목 아프게 고개 돌려 볼 필요 없이 클릭 한 번으로 회전!",
            body: [
              "가로 문서와 세로 문서가 뒤섞여 있거나 거꾸로 스캔된 문서는 PDF 뷰어에서 임시로 돌려도 저장하면 다시 원래대로 돌아가는 문제가 있습니다.",
              "mypickpdf [PDF 회전]은 전체 페이지 혹은 특정 페이지만 시계 방향, 반시계 방향으로 돌려 파일 자체에 영구 반영해 줍니다."
            ],
            tip: "래서팬더 꿀팁: 특정 페이지만 선택해서 돌릴 수도 있어 표나 가로 차트만 똑바로 세우기에 안성맞춤입니다!"
          }
        ],
        ctaText: "지금 바로 PDF 페이지 회전하기"
      },
      en: {
        title: "How to Rotate Upside-Down or Sideways PDF Pages Permanently",
        summary: "Fix inverted scanner pages and landscape charts by rotating pages 90 or 180 degrees with permanent file saving.",
        sections: [
          {
            heading: "Fix Orientation Misalignment in Scanned Documents",
            body: [
              "Rotating pages in basic desktop readers often only changes view modes without updating the file itself.",
              "mypickpdf permanently adjusts the internal orientation metadata so pages display upright across all PDF readers."
            ],
            tip: "Panda Tip: Rotate individual pages or all pages simultaneously with single-click ease!"
          }
        ],
        ctaText: "Rotate PDF Pages Now"
      }
    }
  },

  // 15. PDF OCR 텍스트 추출
  {
    id: 15,
    slug: "how-to-extract-text-ocr-pdf",
    category: "convert",
    categoryLabel: { ko: "오피스 변환", en: "Office Convert", es: "Conversión Office", ja: "オフィス変換", "zh-CN": "文档转换" },
    toolHref: "/ocr-pdf",
    toolName: { ko: "PDF OCR", en: "PDF OCR", es: "OCR de PDF", ja: "PDF OCR", "zh-CN": "PDF OCR" },
    date: "2026-09-28",
    readTime: { ko: "3분 읽기", en: "3 min read", es: "Lectura de 3 min", ja: "3分で読める", "zh-CN": "3分钟阅读" },
    mascotMood: "idea",
    keywords: [
      "PDF OCR",
      "스캔 문서 글자 복사",
      "PDF 텍스트 추출",
      "extract text from scanned pdf ocr",
      "free online pdf ocr converter",
      "PDF 文字認識 OCR 無料",
      "reconocimiento ocr pdf gratis",
      "PDF文字识别提取"
    ],
    translations: {
      ko: {
        title: "스캔 문서에서 글자 복사하기: 이미지형 PDF OCR 텍스트 추출 꿀팁",
        summary: "책이나 서류를 스캔하여 이미지로 굳어진 PDF는 마우스로 드래그해도 글자가 선택되지 않습니다. 이를 복사 가능한 진짜 텍스트로 인식시키는 OCR 기술 사용법입니다.",
        sections: [
          {
            heading: "드래그가 안 되는 먹통 PDF에서 글자만 쏙!",
            body: [
              "스캔 복사기로 만들어진 PDF는 컴퓨터 입장에서는 글자가 아니라 하나의 커다란 '사진'입니다.",
              "mypickpdf [PDF OCR]은 최첨단 광학 문자 인식(OCR) 신경망 엔진을 통해 한글, 영어, 숫자를 실시간 판독하여 복사 가능한 텍스트 파일(.txt)로 추출해 줍니다."
            ],
            tip: "래서팬더 꿀팁: 서류 전체를 일일이 손으로 타이핑할 필요 없이 10초 만에 전문을 추출해 업무 효율을 10배 높이세요!"
          }
        ],
        ctaText: "지금 바로 스캔 PDF 텍스트 추출하기"
      },
      en: {
        title: "How to Extract Text from Scanned PDFs and Images with Online OCR",
        summary: "Unlock unselectable text in scanned books, invoices, and image-based PDFs into copyable, searchable plain text.",
        sections: [
          {
            heading: "Convert Flat Scanned Images into Searchable Characters",
            body: [
              "When you cannot select or copy text in a PDF, the document consists of flattened pixel scans rather than font streams.",
              "mypickpdf OCR recognizes Latin and East Asian character glyphs in real-time, delivering clean editable text directly to your clipboard."
            ],
            tip: "Panda Tip: Save hours of tedious typing by extracting entire book chapters in a single run!"
          }
        ],
        ctaText: "Extract Text with OCR Now"
      }
    }
  },

  // 16. 알PDF/어도비 무료 대체
  {
    id: 16,
    slug: "best-free-alternative-to-adobe-alpdf",
    category: "security",
    categoryLabel: { ko: "보안 가이드", en: "Security Guide", es: "Guía de Seguridad", ja: "セキュリティガイド", "zh-CN": "安全指南" },
    toolHref: "/merge-pdf",
    toolName: { ko: "무료 PDF 시작", en: "Start Free PDF", es: "PDF Gratis", ja: "無料PDFを体験", "zh-CN": "体验免费PDF" },
    date: "2026-09-28",
    readTime: { ko: "4분 읽기", en: "4 min read", es: "Lectura de 4 min", ja: "4分で読める", "zh-CN": "4分钟阅读" },
    mascotMood: "welcome",
    keywords: [
      "알PDF 무료 대체",
      "어도비 애크로뱃 대체",
      "무료 PDF 프로그램",
      "free adobe acrobat alternative",
      "best free pdf editor online no sign up",
      "無料 PDF 編集 Adobe 代替",
      "alternativa gratis a adobe acrobat",
      "Adobe Acrobat免费替代工具"
    ],
    translations: {
      ko: {
        title: "어도비·알PDF 유료화 결제창 없이 평생 무료로 쓰는 최고의 대체재",
        summary: "간단한 PDF 합치기나 변환 하나 하려고 할 때마다 결제창이 뜨거나 설치 시 제휴 프로그램이 깔려 불편하셨던 분들을 위한 100% 무설치 무료 웹 솔루션 추천입니다.",
        sections: [
          {
            heading: "유료화와 광고에 지친 사용자들을 위한 완벽한 해답",
            body: [
              "기존 데스크톱 PDF 프로그램들은 매월 정기 결제를 요구하거나 설치 과정에서 불필요한 툴바와 광고 프로그램을 함께 설치하도록 유도합니다.",
              "mypickpdf는 회원가입도 없고, 결제 유도도 없으며, 귀여운 래서팬더와 함께 브라우저에서 모든 핵심 기능을 평생 무제한 무료로 제공합니다."
            ],
            tip: "래서팬더 꿀팁: 회사 사내 PC에서 보안 정책상 프로그램 설치가 차단되어 있을 때 mypickpdf를 북마크해두고 쓰시면 최고예요!"
          }
        ],
        ctaText: "결제 없이 평생 무료로 PDF 쓰기"
      },
      en: {
        title: "The Best Free Alternative to Adobe Acrobat and Costly PDF Subscriptions",
        summary: "Tired of recurring monthly fees and paywalls just to merge or compress a document? Discover mypickpdf—the 100% free web utility.",
        sections: [
          {
            heading: "Say Goodbye to Heavy Software and Monthly Subscriptions",
            body: [
              "Everyday document tasks shouldn't require \$20/month enterprise subscription commitments.",
              "mypickpdf brings you the core essential features of desktop PDF suites right in your web browser—free, fast, and completely safe."
            ],
            tip: "Panda Tip: Bookmark mypickpdf for instant access on any shared work computer or laptop!"
          }
        ],
        ctaText: "Enjoy Unlimited Free PDF Tools"
      }
    }
  },

  // 17. HTML 웹페이지 PDF 변환
  {
    id: 17,
    slug: "how-to-convert-html-to-pdf",
    category: "convert",
    categoryLabel: { ko: "오피스 변환", en: "Office Convert", es: "Conversión Office", ja: "オフィス変換", "zh-CN": "文档转换" },
    toolHref: "/html-to-pdf",
    toolName: { ko: "HTML PDF 변환", en: "HTML to PDF", es: "HTML a PDF", ja: "HTMLからPDFへ", "zh-CN": "HTML转PDF" },
    date: "2026-09-28",
    readTime: { ko: "3분 읽기", en: "3 min read", es: "Lectura de 3 min", ja: "3分で読める", "zh-CN": "3分钟阅读" },
    mascotMood: "ready",
    keywords: [
      "HTML PDF 변환",
      "웹페이지 PDF 저장",
      "웹사이트 캡처 PDF",
      "convert html to pdf web page",
      "save webpage as pdf high quality",
      "HTML PDF 変換 Webページ保存",
      "convertir html a pdf gratis",
      "网页转PDF"
    ],
    translations: {
      ko: {
        title: "웹페이지 전체 레이아웃을 깨짐 없이 깔끔한 PDF로 저장하기",
        summary: "HTML 코드나 웹페이지 서식을 그대로 살려 문서 규격에 맞는 인쇄용 PDF 파일로 변환하는 실전 팁입니다.",
        sections: [
          {
            heading: "웹페이지의 스타일과 폰트를 그대로 박제하여 보관하기",
            body: [
              "웹 브라우저의 일반 인쇄 기능으로 PDF를 만들면 여백이 잘리거나 배경 그래픽이 날아가는 경우가 빈번합니다.",
              "mypickpdf [HTML PDF 변환]은 CSS 스타일시트와 글꼴을 정밀 렌더링하여 모니터에서 보던 웹페이지의 시각적 형태 그대로 고품질 PDF로 전환합니다."
            ],
            tip: "래서팬더 꿀팁: 온라인 영수증이나 기술 블로그 글을 아카이빙할 때 유용합니다!"
          }
        ],
        ctaText: "지금 바로 HTML을 PDF로 변환하기"
      },
      en: {
        title: "How to Save Complete HTML Web Pages into Polished PDF Documents",
        summary: "Capture web layouts, CSS styles, and typography faithfully into print-ready PDF format for offline archiving and sharing.",
        sections: [
          {
            heading: "Preserve Web Content with Exact Styling",
            body: [
              "Native browser print dialogs often break CSS grids and omit background colors when saving web pages.",
              "mypickpdf renders HTML assets faithfully into standard A4 and Letter pages."
            ],
            tip: "Panda Tip: Great for archiving receipts, documentation guides, and project dashboards!"
          }
        ],
        ctaText: "Convert HTML to PDF Now"
      }
    }
  },

  // 18. PDF/A 장기 보관 규격
  {
    id: 18,
    slug: "how-to-convert-pdf-to-pdfa-archive",
    category: "convert",
    categoryLabel: { ko: "오피스 변환", en: "Office Convert", es: "Conversión Office", ja: "オフィス変換", "zh-CN": "文档转换" },
    toolHref: "/pdf-to-pdfa",
    toolName: { ko: "PDF/A 변환", en: "PDF to PDF/A", es: "PDF a PDF/A", ja: "PDF/A変換", "zh-CN": "PDF转PDF/A" },
    date: "2026-09-28",
    readTime: { ko: "3분 읽기", en: "3 min read", es: "Lectura de 3 min", ja: "3分で読める", "zh-CN": "3分钟阅读" },
    mascotMood: "idea",
    keywords: [
      "PDF/A 변환",
      "ISO 장기보관 PDF",
      "공공기관 10년 보관 서식",
      "convert pdf to pdfa iso compliance",
      "pdf to pdfa converter free",
      "PDF/A 変換 長期保存規格",
      "convertir pdf a pdfa archivo",
      "PDF转PDFA长期保存"
    ],
    translations: {
      ko: {
        title: "공공기관·연구소 10년 이상 장기 보관 필수: ISO 표준 PDF/A 규격 변환법",
        summary: "세월이 지나 폰트가 유실되거나 소프트웨어가 변경되어도 10년, 20년 뒤 원본 그대로 열람할 수 있는 국제 표준 전자문서 장기 보관 규격(ISO 19005-1) 안내입니다.",
        sections: [
          {
            heading: "일반 PDF와 장기 보관용 PDF/A의 차이점",
            body: [
              "일반 PDF는 컴퓨터에 해당 폰트가 설치되어 있지 않으면 글씨가 깨질 수 있습니다.",
              "PDF/A 규격은 문서에 쓰인 모든 글꼴과 색상 프로필을 파일 내부에 100% 임베딩하여, 50년 후 미래의 기기에서도 정확하게 동일한 형태로 열람을 보장합니다."
            ],
            tip: "래서팬더 꿀팁: 국가기록원, 특허청, 법원 제출 문서의 필수 인증 규격입니다."
          }
        ],
        ctaText: "지금 바로 PDF/A 보관 규격으로 변환하기"
      },
      en: {
        title: "How to Convert PDF to ISO-Standard PDF/A for Long-Term Digital Archival",
        summary: "Ensure your institutional reports, legal contracts, and historical research can be opened faithfully decades from now with ISO 19005-1.",
        sections: [
          {
            heading: "Why Long-Term Archiving Requires PDF/A",
            body: [
              "Standard PDFs often link external font files that may vanish when opened on different operating systems years later.",
              "PDF/A strictly embeds all font definitions and color profiles, guaranteeing identical visual rendering across decades."
            ],
            tip: "Panda Tip: Mandated by legal registries and government archives worldwide!"
          }
        ],
        ctaText: "Convert to PDF/A Standard Now"
      }
    }
  },

  // 19. 아이폰/아이패드 사파리 모바일 활용법
  {
    id: 19,
    slug: "how-to-manage-pdf-on-iphone-ipad",
    category: "mobile",
    categoryLabel: { ko: "모바일 활용", en: "Mobile Tips", es: "Consejos Móvil", ja: "モバイルヒント", "zh-CN": "移动技巧" },
    toolHref: "/merge-pdf",
    toolName: { ko: "모바일 PDF 체험", en: "Mobile PDF Tool", es: "PDF en Móvil", ja: "モバイルPDF体験", "zh-CN": "手机体验PDF" },
    date: "2026-09-28",
    readTime: { ko: "2분 읽기", en: "2 min read", es: "Lectura de 2 min", ja: "2分で読める", "zh-CN": "2分钟阅读" },
    mascotMood: "welcome",
    keywords: [
      "아이폰 PDF 합치기",
      "아이패드 PDF 변환",
      "사파리 PDF 합치기",
      "iphone merge pdf safari free",
      "combine pdfs on ipad no app",
      "iPhone PDF 結合 アプリ不要",
      "unir pdf iphone sin app",
      "苹果手机合并PDF"
    ],
    translations: {
      ko: {
        title: "아이폰·아이패드 사파리에서 앱 설치 없이 PDF 합치고 용량 줄이기",
        summary: "앱스토어에서 광고 가득한 유료 앱을 다운로드할 필요 없이, 아이폰 사파리(Safari) 브라우저에서 터치 몇 번으로 손쉽게 PDF를 편집하는 꿀팁입니다.",
        sections: [
          {
            heading: "모바일 사파리에서도 PC처럼 완벽하게 동작!",
            body: [
              "이동 중에 급하게 계약서나 증명서 PDF를 합쳐서 제출해야 할 때가 많습니다.",
              "mypickpdf는 모바일 터치 제스처에 최적화된 반응형 인터페이스를 지원하여, 아이폰 [파일] 앱에 저장된 문서를 불러와 손쉽게 합치고 즉시 다운로드할 수 있습니다."
            ],
            tip: "래서팬더 꿀팁: 아이폰 사파리 하단의 [공유] ➔ [홈 화면에 추가]를 눌러두시면 앱처럼 편리하게 실행됩니다!"
          }
        ],
        ctaText: "아이폰에서 바로 PDF 다루기"
      },
      en: {
        title: "How to Merge and Compress PDFs on iPhone & iPad Without App Store Downloads",
        summary: "No need to download ad-filled subscription apps on iOS: use Safari to manage and combine PDF documents directly in touch mode.",
        sections: [
          {
            heading: "Full PDF Desktop Power in Your iPhone Pocket",
            body: [
              "When you need to send an urgent application while commuting, finding a free iOS app without paywalls is stressful.",
              "mypickpdf is fully touch-optimized, letting you select documents straight from the iOS Files app or camera roll."
            ],
            tip: "Panda Tip: Tap Safari's Share button and select 'Add to Home Screen' for one-tap app-like convenience!"
          }
        ],
        ctaText: "Use Mobile PDF Tools on iOS"
      }
    }
  },

  // 20. 갤럭시/안드로이드 모바일 활용법
  {
    id: 20,
    slug: "how-to-manage-pdf-on-galaxy-android",
    category: "mobile",
    categoryLabel: { ko: "모바일 활용", en: "Mobile Tips", es: "Consejos Móvil", ja: "モバイルヒント", "zh-CN": "移动技巧" },
    toolHref: "/compress-pdf",
    toolName: { ko: "갤럭시 PDF 체험", en: "Android PDF Tool", es: "PDF en Android", ja: "Android PDF体験", "zh-CN": "安卓体验PDF" },
    date: "2026-09-28",
    readTime: { ko: "2분 읽기", en: "2 min read", es: "Lectura de 2 min", ja: "2分で読める", "zh-CN": "2分钟阅读" },
    mascotMood: "cheering",
    keywords: [
      "갤럭시 PDF 합치기",
      "안드로이드 PDF 용량 줄이기",
      "스마트폰 PDF 변환",
      "android merge compress pdf free",
      "samsung galaxy compress pdf chrome",
      "Android PDF 圧縮 スマホ",
      "comprimir pdf en celular android",
      "安卓手机压缩PDF"
    ],
    translations: {
      ko: {
        title: "갤럭시 스마트폰에서 다운로드 없이 초고속으로 PDF 변환 및 압축하기",
        summary: "삼성 인터넷, 크롬, 카카오톡 인앱 브라우저 어디서나 별도 어플 설치 없이 대용량 PDF를 가볍게 압축하고 즉시 카톡으로 전송하는 방법입니다.",
        sections: [
          {
            heading: "삼성 내 파일(My Files)과 완벽 연동되는 초간편 웹 PDF",
            body: [
              "갤럭시 스마트폰의 [내 파일]이나 카카오톡 다운로드 폴더에 저장된 PDF 파일을 그대로 선택하여 몇 초 만에 용량을 줄이고 합칠 수 있습니다.",
              "불필요한 스마트폰 저장 공간을 차지하는 앱 설치 없이 북마크 하나로 모든 문서 작업을 해결하세요."
            ],
            tip: "래서팬더 꿀팁: 카카오톡 단톡방에서 바로 링크를 눌러 들어와도 완벽하게 변환 및 다운로드가 지원됩니다!"
          }
        ],
        ctaText: "갤럭시에서 지금 바로 PDF 변환하기"
      },
      en: {
        title: "How to Convert and Compress PDFs on Android and Samsung Galaxy Phones",
        summary: "Work seamlessly with Samsung My Files and Google Chrome on Android to compress and convert PDFs on the go with zero storage waste.",
        sections: [
          {
            heading: "Zero-Footprint Document Productivity on Android",
            body: [
              "Skip intrusive third-party APK installations that drain battery life and memory.",
              "mypickpdf runs inside Chrome and Samsung Internet with full mobile touch responsiveness and instant file downloads."
            ],
            tip: "Panda Tip: Open PDFs directly from your downloads folder or WhatsApp/Telegram attachments!"
          }
        ],
        ctaText: "Use Mobile PDF Tools on Android"
      }
    }
  }
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDE_ARTICLES.find((a) => a.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return GUIDE_ARTICLES.map((a) => a.slug);
}

export function getArticleTranslation(article: GuideArticle, lang: string) {
  if (article.translations[lang]) {
    return article.translations[lang];
  }
  const base = lang.split("-")[0];
  if (article.translations[base]) {
    return article.translations[base];
  }
  if (lang === "ko") {
    return article.translations.ko;
  }
  return article.translations.en || article.translations.ko;
}

export function getArticleCategory(article: GuideArticle, lang: string): string {
  if (article.categoryLabel[lang]) return article.categoryLabel[lang];
  const base = lang.split("-")[0];
  if (article.categoryLabel[base]) return article.categoryLabel[base];
  return article.categoryLabel.ko || article.categoryLabel.en || "PDF 팁";
}

export function getArticleToolName(article: GuideArticle, lang: string): string {
  if (article.toolName[lang]) return article.toolName[lang];
  const base = lang.split("-")[0];
  if (article.toolName[base]) return article.toolName[base];
  return article.toolName.ko || article.toolName.en || "도구 열기";
}

export function getArticleReadTime(article: GuideArticle, lang: string): string {
  if (article.readTime[lang]) return article.readTime[lang];
  const base = lang.split("-")[0];
  if (article.readTime[base]) return article.readTime[base];
  return article.readTime.ko || article.readTime.en || "3분 읽기";
}
