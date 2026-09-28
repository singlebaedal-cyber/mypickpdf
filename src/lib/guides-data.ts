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
  },

  // 21. 합격률을 높이는 이력서·자기소개서·포트폴리오 PDF 하나로 합치는 법
  {
  "id": 21,
  "slug": "how-to-merge-resume-portfolio-pdf",
  "category": "edit",
  "categoryLabel": {
    "ko": "PDF 편집 팁",
    "en": "PDF Tips",
    "es": "Consejos PDF",
    "ja": "PDFヒント",
    "zh-CN": "PDF技巧"
  },
  "toolHref": "/merge-pdf",
  "toolName": {
    "ko": "PDF 합치기",
    "en": "Merge PDF",
    "es": "Unir PDF",
    "ja": "PDF結合",
    "zh-CN": "合并PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "cheering",
  "keywords": [
    "이력서 포트폴리오 PDF 합치기",
    "입사지원서 PDF 묶기",
    "자소서 자격증 PDF 병합",
    "merge resume and portfolio pdf",
    "combine job application pdf",
    "履歴書 ポートフォリオ PDF 結合",
    "unir curriculum y portafolio pdf"
  ],
  "translations": {
    "ko": {
      "title": "합격률을 높이는 이력서·자기소개서·포트폴리오 PDF 하나로 합치는 법",
      "summary": "채용 담당자가 한눈에 보기 편하도록 낱개로 분리된 입사지원서, 포트폴리오, 자격증 사본을 단 1개의 고화질 PDF로 정돈하여 병합하는 실무 가이드입니다.",
      "sections": [
        {
          "heading": "왜 지원 서류를 단일 PDF로 제출해야 할까요?",
          "body": [
            "인사담당자는 수백 통의 지원서를 검토하기 때문에 여러 개로 흩어진 첨부파일을 일일이 열어보는 것을 선호하지 않습니다.",
            "특히 ZIP 압축 파일로 제출하면 모바일에서 열람하기 번거롭고 보안 필터에 걸릴 위험이 있습니다.",
            "이력서, 자기소개서, 포트폴리오를 하나의 완성도 높은 PDF로 깔끔하게 묶어 전달하면 준비된 인재라는 전문적인 인상을 줄 수 있습니다."
          ],
          "tip": "래서팬더 꿀팁: 서류 순서는 [이력서 ➔ 자기소개서 ➔ 포트폴리오 ➔ 자격증 사본] 순으로 배치하는 것이 가장 표준적인 구성입니다!"
        },
        {
          "heading": "mypickpdf로 순서 맞추고 3초 만에 병합하기",
          "body": [
            "1단계: mypickpdf [PDF 합치기] 도구에 준비된 PDF 서류들을 한 번에 드래그하여 등록합니다.",
            "2단계: 목록에서 화살표를 눌러 이력서가 맨 위에 오도록 순서를 손쉽게 정렬합니다.",
            "3단계: [PDF 합치기]를 클릭하면 서버 전송 없이 내 컴퓨터에서 1초 만에 깔끔한 단일 문서로 완성됩니다."
          ]
        }
      ],
      "ctaText": "지금 바로 취업 지원서 PDF 하나로 묶기"
    },
    "en": {
      "title": "How to Merge Your Resume, Cover Letter, and Portfolio into One PDF",
      "summary": "Make a powerful first impression on hiring managers by combining your resume, cover letter, and work samples into a single polished PDF.",
      "sections": [
        {
          "heading": "Why Recruiters Prefer a Single Consolidated PDF",
          "body": [
            "Recruiters review hundreds of candidate submissions and strongly prefer reviewing a single continuous document rather than opening multiple scattered attachments.",
            "Submitting multiple disjointed files or ZIP folders creates friction and risks important certificates being overlooked.",
            "Consolidating your application into one coherent PDF demonstrates organizational diligence and attention to detail."
          ],
          "tip": "Panda Tip: The ideal document order is: Resume first, Cover Letter second, followed by Portfolio highlights and certificates!"
        },
        {
          "heading": "How to Merge in 3 Simple Steps",
          "body": [
            "Step 1: Open the mypickpdf [Merge PDF] tool and drag your application files into the dropzone.",
            "Step 2: Use the sequence arrows to order your resume, cover letter, and portfolio.",
            "Step 3: Click [Merge PDF] to generate and download your finalized job application document instantly."
          ]
        }
      ],
      "ctaText": "Merge Your Resume & Portfolio Now"
    }
  }
},

  // 22. 주민등록등본·신분증 PDF 개인정보 유출 방지 및 워터마크 보호법
  {
  "id": 22,
  "slug": "how-to-mask-resident-number-pdf",
  "category": "security",
  "categoryLabel": {
    "ko": "보안 & 프라이버시",
    "en": "Security",
    "es": "Seguridad",
    "ja": "セキュリティ",
    "zh-CN": "安全与隐私"
  },
  "toolHref": "/add-watermark",
  "toolName": {
    "ko": "워터마크 추가",
    "en": "Add Watermark",
    "es": "Marca de agua",
    "ja": "透かし追加",
    "zh-CN": "添加水印"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "ready",
  "keywords": [
    "주민등록등본 주민번호 가리기",
    "신분증 사본 워터마크",
    "신분증 도용 방지",
    "대출 서류 개인정보 보호",
    "mask ssn id card pdf watermark",
    "protect id card scan pdf",
    "身分証明書 透かし コピー防止"
  ],
  "translations": {
    "ko": {
      "title": "주민등록등본·신분증 PDF 개인정보 유출 방지 및 워터마크 보호법",
      "summary": "은행 대출, 부동산 계약, 채용 서류 제출 시 주민등록번호 뒷자리 노출이나 신분증 사본 도용을 막기 위해 '제출용' 워터마크를 투명하게 삽입하는 필수 보안 팁입니다.",
      "sections": [
        {
          "heading": "신분증 사본 무단 도용 및 보이스피싱 위험 차단",
          "body": [
            "부동산 계약이나 금융 기관에 제출한 신분증 사본이 유출되면 대포통장 개설이나 불법 대출 등 심각한 2차 피해로 이어질 수 있습니다.",
            "이를 방지하기 위해 금융감독원과 경찰청은 서류 제출 시 'OO은행 제출용' 또는 '재사용 불가'라는 워터마크를 반드시 명시할 것을 권고합니다.",
            "mypickpdf는 문서를 외부 서버로 전송하지 않고 사용자의 브라우저 내부에서만 워터마크를 각인하므로 주민등록번호 유출 위험이 0%입니다."
          ],
          "tip": "래서팬더 꿀팁: 워터마크 문구에 [2026.09 OO기관 제출용 / 타 용도 사용 금지]처럼 목적과 날짜를 구체적으로 적어두면 안전합니다!"
        },
        {
          "heading": "가독성을 해치지 않는 워터마크 투명도 설정법",
          "body": [
            "1단계: [워터마크 추가] 페이지에서 등본이나 신분증 PDF 문서를 불러옵니다.",
            "2단계: 워터마크 문구에 제출 목적을 입력하고, 투명도를 20~25% 수준의 차분한 회색으로 설정합니다.",
            "3단계: 대각선 45도 회전 각도를 선택한 뒤 [워터마크 삽입하기]를 누르면 안전한 보안 사본이 완성됩니다."
          ]
        }
      ],
      "ctaText": "내 신분증 PDF에 도용 방지 워터마크 넣기"
    },
    "en": {
      "title": "How to Protect Scanned ID Cards and Documents with Anti-Fraud Watermarks",
      "summary": "Prevent identity theft and fraud when submitting government IDs or certificates by stamping custom submission-purpose watermarks.",
      "sections": [
        {
          "heading": "Why Plain ID Scans Are Vulnerable to Fraud",
          "body": [
            "Submitting unwatermarked copies of your passport, driver's license, or national ID exposes you to risks of unauthorized reuse and identity fraud.",
            "Security experts recommend overlaying a clear, semi-transparent watermark specifying the exact purpose and recipient institution.",
            "mypickpdf processes your sensitive identity documents purely within local browser memory, ensuring zero cloud upload."
          ],
          "tip": "Panda Tip: Stamp 'FOR [BANK NAME] APPLICATION ONLY - NO REUSE' diagonally across the ID scan to deter fraudsters!"
        },
        {
          "heading": "Creating a Protected Document in Seconds",
          "body": [
            "Step 1: Open [Add Watermark] and select your scanned ID or certificate PDF.",
            "Step 2: Enter your purpose text and adjust opacity to 20-25% for subtle yet indelible protection.",
            "Step 3: Click [Add Watermark] to download your secure, theft-proof verification file."
          ]
        }
      ],
      "ctaText": "Protect Your ID PDF with Watermark"
    }
  }
},

  // 23. 연말정산 간소화 PDF에서 민감 항목 제외하고 필요한 페이지만 쏙쏙 분할하기
  {
  "id": 23,
  "slug": "how-to-split-tax-settlement-pdf",
  "category": "edit",
  "categoryLabel": {
    "ko": "PDF 편집 팁",
    "en": "PDF Tips",
    "es": "Consejos PDF",
    "ja": "PDFヒント",
    "zh-CN": "PDF技巧"
  },
  "toolHref": "/split-pdf",
  "toolName": {
    "ko": "PDF 나누기",
    "en": "Split PDF",
    "es": "Dividir PDF",
    "ja": "PDF分割",
    "zh-CN": "拆分PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "idea",
  "keywords": [
    "연말정산 PDF 분할",
    "홈택스 간소화 PDF 특정 페이지만",
    "의료비 교육비 페이지만 추출",
    "split tax return pdf pages",
    "extract tax pdf pages",
    "年末調整 PDF 分割 ページ抽出"
  ],
  "translations": {
    "ko": {
      "title": "연말정산 간소화 PDF에서 민감 항목 제외하고 필요한 페이지만 쏙쏙 분할하기",
      "summary": "국세청 홈택스에서 내려받은 수십 페이지의 연말정산 간소화 PDF 중 회사에 제출할 의료비, 교육비, 기부금 등 특정 페이지만 골라서 새 파일로 추출하는 방법입니다.",
      "sections": [
        {
          "heading": "전체 연말정산 서류 제출 시 불필요한 사생활 노출 방지",
          "body": [
            "홈택스 연말정산 간소화 PDF에는 본인의 질병 치료비 내역, 민감한 가족관계, 개인 신용카드 소비 항목 등 사생활 정보가 모두 들어있습니다.",
            "회사 인사팀이나 세무 대리인에게 이 모든 페이지를 통째로 넘길 필요 없이, 실제 공제 신청에 필요한 증빙 페이지만 선별하여 제출하는 것이 안전합니다.",
            "mypickpdf의 [PDF 나누기] 도구는 원하는 페이지 번호만 입력하면 원본의 전자서명과 바코드 손상 없이 1초 만에 분리 추출합니다."
          ],
          "tip": "래서팬더 꿀팁: 페이지 입력창에 '1-3, 7, 12'처럼 콤마와 하이픈을 섞어 적으면 여러 구간을 한 번에 뽑아낼 수 있어요!"
        },
        {
          "heading": "초간단 3단계 페이지 추출 절차",
          "body": [
            "1단계: 홈택스에서 내려받은 연말정산 간소화 PDF를 업로드합니다.",
            "2단계: 화면에서 확인한 전체 페이지 중 제출하고 싶은 페이지 번호(예: 1, 4-6)를 적어 넣습니다.",
            "3단계: [페이지 추출하기] 버튼을 누르면 민감 정보가 제외된 산뜻한 맞춤 PDF가 즉시 다운로드됩니다."
          ]
        }
      ],
      "ctaText": "연말정산 PDF에서 필요한 페이지만 추출하기"
    },
    "en": {
      "title": "How to Split and Extract Only Necessary Pages from Tax Filing PDFs",
      "summary": "Protect your personal financial privacy by extracting only the required deduction pages from lengthy annual tax documentation.",
      "sections": [
        {
          "heading": "Keep Sensitive Personal Expenses Confidential",
          "body": [
            "Full annual tax reports often contain private medical records and personal transaction details irrelevant to your employer's tax deduction audit.",
            "Instead of submitting a massive 40-page report, extract only the specific deduction pages requested by HR.",
            "mypickpdf extracts chosen pages instantly without altering digital signatures or security barcodes."
          ],
          "tip": "Panda Tip: Use range notations like '1-4, 8, 15' to bundle non-contiguous pages into a clean new document!"
        },
        {
          "heading": "Extracting Tax Pages in Seconds",
          "body": [
            "Step 1: Open [Split PDF] and upload your tax statement.",
            "Step 2: Enter the exact page numbers you wish to preserve.",
            "Step 3: Click [Extract Pages] to save your streamlined, privacy-protected submission PDF."
          ]
        }
      ],
      "ctaText": "Extract Tax Deduction Pages Now"
    }
  }
},

  // 24. 공공기관 표준 HWPX 문서와 PDF 상호 변환 완벽 가이드
  {
  "id": 24,
  "slug": "hwpx-to-pdf-best-conversion-guide",
  "category": "convert",
  "categoryLabel": {
    "ko": "파일 변환 노하우",
    "en": "Conversion",
    "es": "Conversión",
    "ja": "変換ノウハウ",
    "zh-CN": "格式转换"
  },
  "toolHref": "/pdf-to-hwp",
  "toolName": {
    "ko": "PDF 한글(HWPX) 변환",
    "en": "PDF to HWPX",
    "es": "PDF a HWPX",
    "ja": "PDF HWPX変換",
    "zh-CN": "PDF转HWPX"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "4분 읽기",
    "en": "4 min read",
    "es": "Lectura de 4 min",
    "ja": "4分で読める",
    "zh-CN": "4分钟阅读"
  },
  "mascotMood": "welcome",
  "keywords": [
    "HWPX PDF 변환",
    "한글 HWPX 변환 프로그램 없이",
    "공공기관 공문서 HWPX 변환",
    "convert hwpx to pdf free",
    "korean hangul word processor hwpx converter",
    "HWPX PDF 変換 オンライン"
  ],
  "translations": {
    "ko": {
      "title": "공공기관 표준 HWPX 문서와 PDF 상호 변환 완벽 가이드",
      "summary": "정부 공문서, 조달청 나라장터 입찰, 학교 행정에서 쓰이는 최신 개방형 한글 포맷인 HWPX와 PDF 간의 손실 없는 상호 변환 노하우를 안내합니다.",
      "sections": [
        {
          "heading": "구형 HWP와 차세대 개방형 표준 HWPX의 차이",
          "body": [
            "HWPX는 2021년부터 정부 및 공공기관의 공식 기본 문서 형식으로 지정된 XML 기반의 개방형 표준 규격입니다.",
            "구형 바이너리 .hwp 형식과 달리 웹 호환성과 데이터 파싱 능력이 월등하여 최신 행정 업무의 표준으로 자리잡았습니다.",
            "mypickpdf는 별도의 한컴오피스 프로그램 구매나 무거운 뷰어 설치 없이 맥(Mac), 윈도우, 모바일 어디서나 HWPX를 지원합니다."
          ],
          "tip": "래서팬더 꿀팁: mypickpdf는 한글 문서의 문단 스타일과 텍스트 레이어를 정밀하게 분석하여 깨짐 없는 양방향 변환을 제공합니다!"
        },
        {
          "heading": "누구나 쉬운 HWPX/PDF 변환 절차",
          "body": [
            "1단계: mypickpdf [PDF 한글(HWP/HWPX) 변환] 메뉴로 들어갑니다.",
            "2단계: 변환할 문서를 드롭존에 업로드하고 원하는 변환 모드를 선택합니다.",
            "3단계: 변환 시작을 클릭하면 브라우저 가속으로 빠르게 완성되어 다운로드됩니다."
          ]
        }
      ],
      "ctaText": "한글 HWPX ➔ PDF 도구 바로가기"
    },
    "en": {
      "title": "Comprehensive Guide to Converting Korean HWPX Documents and PDF",
      "summary": "Master bidirectional conversion between Korean Standard HWPX files and universal PDF without purchasing Hangul Word Processor software.",
      "sections": [
        {
          "heading": "Understanding the Modern HWPX Standard",
          "body": [
            "HWPX is an open XML-based document standard adopted by Korean governmental agencies and educational institutions since 2021.",
            "Unlike legacy proprietary .hwp binaries, HWPX offers superior web interoperability and data extraction capabilities.",
            "mypickpdf enables macOS and international users without Korean word processor software to seamlessly convert documents."
          ],
          "tip": "Panda Tip: You can convert government notices, tenders, and official forms right inside Google Chrome!"
        },
        {
          "heading": "Simple Conversion Without Software Installation",
          "body": [
            "Step 1: Open [PDF to HWP/HWPX] and upload your document.",
            "Step 2: Choose your desired conversion output format.",
            "Step 3: Click convert to retrieve your fully formatted document instantly."
          ]
        }
      ],
      "ctaText": "Convert HWPX Documents Now"
    }
  }
},

  // 25. 비즈니스 계약서 및 견적서에 대외비(CONFIDENTIAL) 워터마크 넣는 법
  {
  "id": 25,
  "slug": "how-to-watermark-business-contract",
  "category": "security",
  "categoryLabel": {
    "ko": "보안 & 프라이버시",
    "en": "Security",
    "es": "Seguridad",
    "ja": "セキュリティ",
    "zh-CN": "安全与隐私"
  },
  "toolHref": "/add-watermark",
  "toolName": {
    "ko": "워터마크 추가",
    "en": "Add Watermark",
    "es": "Marca de agua",
    "ja": "透かし追加",
    "zh-CN": "添加水印"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "success",
  "keywords": [
    "계약서 대외비 워터마크",
    "견적서 CONFIDENTIAL 워터마크",
    "비즈니스 PDF 워터마크 넣기",
    "add confidential watermark to contract pdf",
    "business pdf watermark protection",
    "契約書 機密 透かし 追加"
  ],
  "translations": {
    "ko": {
      "title": "비즈니스 계약서 및 견적서에 대외비(CONFIDENTIAL) 워터마크 넣는 법",
      "summary": "외주 계약, 기업 간 비밀유지계약서(NDA), 단가 견적서 배포 시 무단 외부 유출 및 복제를 방지하는 워터마크 각인 실무 팁을 정리했습니다.",
      "sections": [
        {
          "heading": "문서 유출 분쟁 시 강력한 법적·심리적 보호 장치",
          "body": [
            "협력사나 외부 파트너에게 미공개 사업계획서나 단가표를 전송할 때 워터마크가 없으면 캡처 후 무단 유포될 위험이 상존합니다.",
            "대각선 45도로 [대외비 / CONFIDENTIAL] 문구가 각인되어 있으면 상대방에게 고도의 주의 의무를 부여하며 고의 유출 시 명백한 증거가 됩니다.",
            "mypickpdf는 100% 브라우저 메모리 안에서만 워터마크를 굽기 때문에 계약서 단가나 내부 기밀이 외부 서버로 새어나갈 염려가 전혀 없습니다."
          ],
          "tip": "래서팬더 꿀팁: 견적서 초안을 전송할 때는 [초안 (DRAFT)] 워터마크 프리셋을 선택하여 최종 확정본과의 혼선을 방지하세요!"
        },
        {
          "heading": "본문 글자를 가리지 않는 황금 투명도 세팅",
          "body": [
            "1단계: [워터마크 추가]에서 계약서나 견적서 PDF를 첨부합니다.",
            "2단계: 빠른 프리셋에서 '대외비' 또는 'CONFIDENTIAL'을 클릭합니다.",
            "3단계: 투명도 25%, 그레이 색상을 선택하여 본문 글자를 가리지 않으면서도 인쇄 시 선명하게 복사 방지가 되도록 적용합니다."
          ]
        }
      ],
      "ctaText": "계약서에 대외비 워터마크 즉시 적용하기"
    },
    "en": {
      "title": "How to Add Confidential Watermarks to Business Contracts and Quotes",
      "summary": "Safeguard NDAs, commercial proposals, and proprietary pricing sheets by stamping legal confidentiality watermarks across every page.",
      "sections": [
        {
          "heading": "Deter Leaks and Establish Document Ownership",
          "body": [
            "Distributing unprotected draft proposals or confidential contracts carries significant operational and legal risks.",
            "A crisp diagonal 'CONFIDENTIAL' watermark immediately reminds recipients of non-disclosure agreements and deters unauthorized sharing.",
            "mypickpdf isolates all processing within your browser, ensuring trade secrets never touch cloud infrastructure."
          ],
          "tip": "Panda Tip: Use the 'DRAFT' watermark preset when distributing preliminary quotes to prevent premature contractual commitments!"
        },
        {
          "heading": "Applying the Watermark in 3 Steps",
          "body": [
            "Step 1: Upload your agreement or proposal to the [Add Watermark] tool.",
            "Step 2: Select 'CONFIDENTIAL' or enter a bespoke security notice.",
            "Step 3: Keep opacity around 25% for unobtrusive text readability and click download."
          ]
        }
      ],
      "ctaText": "Add Confidential Watermark Now"
    }
  }
},

  // 26. 폰 카메라로 찍은 영수증 여러 장을 한 번에 정돈된 A4 PDF로 만드는 법
  {
  "id": 26,
  "slug": "how-to-convert-receipts-to-pdf",
  "category": "convert",
  "categoryLabel": {
    "ko": "파일 변환 노하우",
    "en": "Conversion",
    "es": "Conversión",
    "ja": "変換ノウハウ",
    "zh-CN": "格式转换"
  },
  "toolHref": "/image-to-pdf",
  "toolName": {
    "ko": "JPG PDF 변환",
    "en": "Image to PDF",
    "es": "JPG a PDF",
    "ja": "JPG PDF変換",
    "zh-CN": "图片转PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "idea",
  "keywords": [
    "영수증 사진 PDF 합치기",
    "법인카드 영수증 모아서 PDF",
    "출장 영수증 A4 정리",
    "convert receipts photos to single pdf",
    "combine expense receipts pdf",
    "領収書 写真 PDF まとめる"
  ],
  "translations": {
    "ko": {
      "title": "폰 카메라로 찍은 영수증 여러 장을 한 번에 정돈된 A4 PDF로 만드는 법",
      "summary": "법인카드 정산이나 출장비 청구 시 스마트폰으로 낱낱이 촬영한 영수증 사진들을 날짜순으로 묶어 깔끔한 단일 A4 PDF로 생성하는 꿀팁입니다.",
      "sections": [
        {
          "heading": "흩어진 사진 20장 대신 1개의 PDF 보고서가 주는 편리함",
          "body": [
            "경리부서나 회계팀에 낱개 JPG 사진을 카톡이나 메일로 쏟아부으면 누락되거나 순서가 뒤섞여 결재가 반려되기 십상입니다.",
            "영수증 사진들을 시간 순서대로 정렬해 단 1개의 A4 규격 PDF로 묶어 제출하면 검토 시간이 단축되고 비용 승인이 즉시 이루어집니다.",
            "mypickpdf는 스마트폰으로 촬영한 고화질 사진들도 용량 낭비 없이 완벽하게 A4 전자문서 규격으로 레이아웃합니다."
          ],
          "tip": "래서팬더 꿀팁: 영수증 사진을 올린 뒤 드래그하여 날짜순으로 순서를 정렬하고 [세로(Portrait)] 방향을 선택하세요!"
        },
        {
          "heading": "영수증 PDF 리포트 완성 절차",
          "body": [
            "1단계: [JPG PDF 변환] 페이지에 촬영한 영수증 사진들을 모두 선택해 올립니다.",
            "2단계: 위/아래 화살표를 눌러 결제 일자 순서대로 사진 위치를 맞춥니다.",
            "3단계: [PDF로 변환하기]를 누르면 깨끗한 영수증 정산 리포트 PDF가 완성됩니다."
          ]
        }
      ],
      "ctaText": "영수증 사진들 A4 PDF로 묶기"
    },
    "en": {
      "title": "How to Combine Multiple Receipt Photos into a Single A4 Expense PDF",
      "summary": "Effortlessly bundle scattered smartphone receipt snapshots into one organized, chronologically sorted A4 PDF for corporate expense reimbursements.",
      "sections": [
        {
          "heading": "Simplify Accounting Approvals with One Unified Report",
          "body": [
            "Submitting a flurry of loose JPEG images to accounting creates administrative delays and leads to lost expense claims.",
            "Consolidating all receipt snapshots into a single chronological PDF accelerates review times and guarantees quick reimbursements.",
            "mypickpdf standardizes varied camera dimensions into uniform high-resolution A4 portrait sheets."
          ],
          "tip": "Panda Tip: Arrange receipts by purchase date and export in portrait orientation for standard accounting binder printing!"
        },
        {
          "heading": "3 Steps to Create Your Expense PDF",
          "body": [
            "Step 1: Drop all your camera receipts into [Image to PDF].",
            "Step 2: Rearrange their sequence to match your corporate expense form.",
            "Step 3: Click [Convert to PDF] to download your ready-to-submit expense report."
          ]
        }
      ],
      "ctaText": "Bundle Receipts into PDF Now"
    }
  }
},

  // 27. 전자세금계산서 PDF 표 데이터를 엑셀(XLSX)로 추출해 회계 장부 자동화하기
  {
  "id": 27,
  "slug": "convert-tax-invoice-pdf-to-excel",
  "category": "convert",
  "categoryLabel": {
    "ko": "파일 변환 노하우",
    "en": "Conversion",
    "es": "Conversión",
    "ja": "変換ノウハウ",
    "zh-CN": "格式转换"
  },
  "toolHref": "/pdf-to-excel",
  "toolName": {
    "ko": "PDF 엑셀 변환",
    "en": "PDF to Excel",
    "es": "PDF a Excel",
    "ja": "PDF Excel変換",
    "zh-CN": "PDF转Excel"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "welcome",
  "keywords": [
    "세금계산서 PDF 엑셀 변환",
    "견적서 표 엑셀로 추출",
    "PDF 표 데이터 엑셀 시트",
    "convert tax invoice pdf to excel xlsx",
    "extract table from invoice pdf",
    "請求書 PDF Excel 抽出 変換"
  ],
  "translations": {
    "ko": {
      "title": "전자세금계산서 PDF 표 데이터를 엑셀(XLSX)로 추출해 회계 장부 자동화하기",
      "summary": "수십 장의 거래처 세금계산서나 견적서 PDF 속 품목, 단가, 공급가액, 부가세 테이블을 일일이 타이핑하지 않고 엑셀 시트로 자동 변환하는 방법입니다.",
      "sections": [
        {
          "heading": "수기 입력 오타와 야근을 없애는 스마트 테이블 추출",
          "body": [
            "거래처에서 받은 전자세금계산서의 숫자 데이터를 엑셀에 손으로 옮겨 적다 보면 '0' 하나를 잘못 입력해 결산 오차가 발생하곤 합니다.",
            "mypickpdf의 엑셀 변환 엔진은 PDF 내부의 테이블 그리드와 셀 데이터를 정밀 분석하여 계산 가능한 엑셀 셀로 고스란히 복원합니다.",
            "회사 재무제표나 매출 매입 장부 정리 시간이 90% 이상 단축됩니다."
          ],
          "tip": "래서팬더 꿀팁: 엑셀 파일로 추출된 후 =SUM() 함수를 적용해 공급가액 합계를 바로 검산할 수 있습니다!"
        },
        {
          "heading": "PDF 표를 엑셀 파일로 추출하는 3단계",
          "body": [
            "1단계: [PDF 엑셀 변환] 도구에 세금계산서나 견적서 PDF를 등록합니다.",
            "2단계: [Excel (.xlsx)로 변환 시작] 버튼을 누르면 브라우저 파서가 표 구조를 자동 인식합니다.",
            "3단계: 완성된 .xlsx 엑셀 파일을 다운로드하여 사내 회계 서식에 복사 붙여넣기합니다."
          ]
        }
      ],
      "ctaText": "세금계산서 PDF 엑셀로 추출하기"
    },
    "en": {
      "title": "How to Extract Tables from Tax Invoices and Quotes into Excel (XLSX)",
      "summary": "Eliminate manual data entry errors by parsing PDF invoices and purchase orders directly into editable Microsoft Excel spreadsheets.",
      "sections": [
        {
          "heading": "Automate Financial Bookkeeping Without Typo Risks",
          "body": [
            "Manually re-typing invoice figures, tax amounts, and line items into accounting software is tedious and error-prone.",
            "mypickpdf identifies table cell coordinates inside the PDF stream and maps text and numerical values directly into genuine Excel spreadsheet columns.",
            "Reconcile monthly vendor bills and purchase ledgers in a fraction of the usual time."
          ],
          "tip": "Panda Tip: Once extracted into .xlsx, standard Excel functions like SUM and VLOOKUP work instantly across all data rows!"
        },
        {
          "heading": "Extracting Tables in 3 Quick Steps",
          "body": [
            "Step 1: Upload your digital invoice or quotation PDF to [PDF to Excel].",
            "Step 2: Let the browser engine parse line items and cost columns.",
            "Step 3: Download the clean .xlsx file ready for spreadsheet integration."
          ]
        }
      ],
      "ctaText": "Extract PDF Tables to Excel Now"
    }
  }
},

  // 28. IR 발표 및 회사소개서 PPT를 폰트 깨짐 없는 고화질 PDF로 변환하기
  {
  "id": 28,
  "slug": "powerpoint-to-pdf-presentation-tips",
  "category": "convert",
  "categoryLabel": {
    "ko": "파일 변환 노하우",
    "en": "Conversion",
    "es": "Conversión",
    "ja": "変換ノウハウ",
    "zh-CN": "格式转换"
  },
  "toolHref": "/powerpoint-to-pdf",
  "toolName": {
    "ko": "파워포인트 PDF 변환",
    "en": "PowerPoint to PDF",
    "es": "PowerPoint a PDF",
    "ja": "PPT PDF変換",
    "zh-CN": "PPT转PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "cheering",
  "keywords": [
    "PPT PDF 변환 폰트 깨짐 방지",
    "발표자료 PDF 슬라이드 와이드",
    "파워포인트 PDF 변환 무료",
    "convert powerpoint pptx to pdf free",
    "presentation slides to pdf wide",
    "パワーポイント PDF 変換 フォント崩れ防止"
  ],
  "translations": {
    "ko": {
      "title": "IR 발표 및 회사소개서 PPT를 폰트 깨짐 없는 고화질 PDF로 변환하기",
      "summary": "발표 현장 빔프로젝터 컴퓨터에 전용 폰트가 설치되어 있지 않아 슬라이드 줄바꿈이 엉망이 되는 대참사를 막는 필수 사전 준비법입니다.",
      "sections": [
        {
          "heading": "발표 당일 슬라이드 서식이 망가지는 이유",
          "body": [
            "파워포인트(.pptx) 파일은 열람하는 컴퓨터에 설치된 폰트에 의존하므로, 다른 컴퓨터에서 열면 대체 폰트가 적용되어 텍스트 상자가 삐져나오는 참사가 흔히 발생합니다.",
            "반면 PDF는 디자인과 문자 배치를 고정하여 렌더링하므로 윈도우, 맥북, 스마트폰, 빔프로젝터 어디서 열어도 원작자의 화면 그대로 완벽하게 투사됩니다.",
            "투자사나 클라이언트에게 소개서를 메일로 전달할 때도 수정 불가능한 고화질 PDF로 전송하는 것이 신뢰도를 높여줍니다."
          ],
          "tip": "래서팬더 꿀팁: mypickpdf의 PPT 변환 엔진은 16:9 와이드 비율을 완벽 보존하여 프로젝터 화면에 꽉 찬 고화질을 선사합니다!"
        },
        {
          "heading": "PPT 슬라이드 PDF 변환 단계",
          "body": [
            "1단계: [파워포인트 PDF 변환] 메뉴로 이동하여 작성한 .pptx 파일을 추가합니다.",
            "2단계: [PDF로 변환 시작]을 누르면 슬라이드 구성 요소를 가로형 PDF로 깨끗하게 레이아웃합니다.",
            "3단계: 완성된 PDF 파일을 USB에 담거나 메일로 첨부하여 안심하고 발표장에 들어서세요."
          ]
        }
      ],
      "ctaText": "PPT 슬라이드 고화질 PDF로 변환하기"
    },
    "en": {
      "title": "How to Convert PowerPoint Presentations to PDF Without Font Issues",
      "summary": "Eliminate presentation anxiety by locking in typography, margins, and 16:9 widescreen layout into universal, unalterable PDF slides.",
      "sections": [
        {
          "heading": "Why Native PPT Files Fail on External Projector PCs",
          "body": [
            "Original .pptx files depend on host system font libraries. Opening them on podium PCs often causes ugly font substitutions and broken text wraps.",
            "Converting your slides to PDF guarantees that your visual hierarchy, embedded graphics, and slide margins render identically on any hardware.",
            "Sending company pitch decks as PDFs also prevents accidental client edits or formatting disruptions."
          ],
          "tip": "Panda Tip: PDF slides open in full screen on Mac Keynote, Adobe Acrobat, and Chrome with instantaneous slide switching!"
        },
        {
          "heading": "Fast 3-Step Presentation Conversion",
          "body": [
            "Step 1: Upload your .pptx presentation to [PowerPoint to PDF].",
            "Step 2: Let the engine render each slide into widescreen high-res PDF pages.",
            "Step 3: Download your foolproof presentation file."
          ]
        }
      ],
      "ctaText": "Convert Slides to PDF Now"
    }
  }
},

  // 29. 대학 과제 리포트 및 학위 논문 PDF에 규격 페이지 번호 깔끔하게 넣기
  {
  "id": 29,
  "slug": "how-to-number-academic-thesis-pdf",
  "category": "edit",
  "categoryLabel": {
    "ko": "PDF 편집 팁",
    "en": "PDF Tips",
    "es": "Consejos PDF",
    "ja": "PDFヒント",
    "zh-CN": "PDF技巧"
  },
  "toolHref": "/add-page-numbers",
  "toolName": {
    "ko": "페이지 번호 추가",
    "en": "Add Page Numbers",
    "es": "Número de página",
    "ja": "ページ番号追加",
    "zh-CN": "添加页码"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で读める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "ready",
  "keywords": [
    "논문 PDF 페이지 번호 매기기",
    "대학 과제 리포트 쪽번호",
    "PDF 하단 중앙 페이지 번호",
    "add page numbers to academic thesis pdf",
    "number thesis research paper pdf",
    "論文 PDF ページ番号 下部中央"
  ],
  "translations": {
    "ko": {
      "title": "대학 과제 리포트 및 학위 논문 PDF에 규격 페이지 번호 깔끔하게 넣기",
      "summary": "서론, 본론, 결론, 참고문헌이 합쳐지면서 꼬여버린 페이지 번호를 규격 가이드라인에 맞추어 하단 중앙에 일괄 번호 매기기 하는 팁입니다.",
      "sections": [
        {
          "heading": "교수님과 심사위원이 가장 먼저 확인하는 문서 기본기",
          "body": [
            "학술 리포트나 졸업 논문 심사에서 페이지 번호 누락이나 불일치는 가장 빈번하게 지적받는 감점 사유입니다.",
            "여러 소스에서 발췌한 PDF 자료를 하나로 합치면 페이지 번호가 제각각이거나 아예 사라지는 문제가 생깁니다.",
            "mypickpdf는 문서 전체를 일괄 재스캔하여 모든 페이지 하단에 일정한 폰트 크기와 정렬로 규격 쪽번호를 새겨 넣습니다."
          ],
          "tip": "래서팬더 꿀팁: '1 / 30' 형태의 전체 페이지 병기 옵션(n / total)을 선택하면 심사위원이 전체 분량을 가늠하기 훨씬 좋습니다!"
        },
        {
          "heading": "페이지 번호 맞춤 설정 및 적용법",
          "body": [
            "1단계: [페이지 번호 추가] 도구에 합쳐진 논문이나 리포트 PDF를 업로드합니다.",
            "2단계: 위치를 '하단 중앙(Bottom Center)'으로 선택하고, 선호하는 번호 양식을 고릅니다.",
            "3단계: [페이지 번호 삽입하기]를 누르면 논문 제출 규격에 완벽히 부합하는 새 PDF가 생성됩니다."
          ]
        }
      ],
      "ctaText": "논문 PDF에 페이지 번호 일괄 삽입하기"
    },
    "en": {
      "title": "How to Add Standard Page Numbers to Academic Dissertations and Reports",
      "summary": "Ensure full compliance with university thesis submission guidelines by stamping clean, uniform bottom-center pagination across all pages.",
      "sections": [
        {
          "heading": "Avoid Critical Submission Penalties for Broken Pagination",
          "body": [
            "Academic evaluation boards and journal reviewers strictly mandate coherent sequential page numbering throughout submitted manuscripts.",
            "When merging diverse research drafts and bibliography appendices, native page numbers frequently desynchronize.",
            "mypickpdf recalibrates pagination across the entire document, placing crisp numbers with proportional margins."
          ],
          "tip": "Panda Tip: The 'Page N of Total' format (e.g. 'Page 5 of 30') provides clear structural context for academic committee reviews!"
        },
        {
          "heading": "Adding Page Numbers in 3 Steps",
          "body": [
            "Step 1: Open [Add Page Numbers] and drop in your academic paper.",
            "Step 2: Choose 'Bottom Center' alignment and select your preferred numbering format.",
            "Step 3: Click [Add Page Numbers] to download your ready-to-submit dissertation."
          ]
        }
      ],
      "ctaText": "Add Page Numbers to Thesis Now"
    }
  }
},

  // 30. 아이패드 굿노트·갤럭시탭 노타빌리티 필기용 PDF 용량 최적화 노하우
  {
  "id": 30,
  "slug": "optimize-pdf-for-goodnotes-notability",
  "category": "mobile",
  "categoryLabel": {
    "ko": "모바일 활용",
    "en": "Mobile Tips",
    "es": "Consejos Móvil",
    "ja": "モバイルヒント",
    "zh-CN": "移动技巧"
  },
  "toolHref": "/compress-pdf",
  "toolName": {
    "ko": "PDF 압축",
    "en": "Compress PDF",
    "es": "Comprimir PDF",
    "ja": "PDF圧縮",
    "zh-CN": "压缩PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "2분 읽기",
    "en": "2 min read",
    "es": "Lectura de 2 min",
    "ja": "2分で読める",
    "zh-CN": "2分钟阅读"
  },
  "mascotMood": "cheering",
  "keywords": [
    "굿노트 PDF 용량 줄이기",
    "노타빌리티 튕김 방지",
    "아이패드 전공서적 PDF 최적화",
    "optimize pdf for goodnotes notability",
    "compress textbook pdf ipad",
    "GoodNotes PDF 圧縮 動作軽量化"
  ],
  "translations": {
    "ko": {
      "title": "아이패드 굿노트·갤럭시탭 노타빌리티 필기용 PDF 용량 최적화 노하우",
      "summary": "수백 페이지짜리 전공 원서나 스터디 플래너 서식이 태블릿 필기 앱에서 버벅거리거나 튕길 때, 텍스트 선명도는 유지하며 용량을 가볍게 만드는 법입니다.",
      "sections": [
        {
          "heading": "태블릿 필기 앱이 렉 걸리거나 종료되는 원인",
          "body": [
            "두꺼운 수험서나 전공 스캔본 PDF는 300MB~500MB에 달해 아이패드나 갤럭시탭의 작업 메모리(RAM)를 순식간에 고갈시킵니다.",
            "필기 앱에서 펜슬을 그을 때 반응 속도가 느려지거나 화면이 멈추는 현상은 과도한 파일 용량 때문입니다.",
            "mypickpdf의 스마트 벡터 압축 기술은 글자와 수식의 선명함을 온전히 유지하면서 불필요한 고해상도 메타데이터를 제거하여 용량을 70% 이상 줄여줍니다."
          ],
          "tip": "래서팬더 꿀팁: 300MB 파일을 [권장 압축]으로 변환하면 약 40MB로 가벼워져 필기 딜레이가 완전히 사라집니다!"
        },
        {
          "heading": "태블릿 쾌속 필기를 위한 압축 적용법",
          "body": [
            "1단계: 태블릿 브라우저(사파리 또는 크롬)에서 [PDF 압축] 도구로 이동합니다.",
            "2단계: 전공 서적이나 필기용 PDF 파일을 첨부하고 '권장 압축' 옵션을 선택합니다.",
            "3단계: 압축 완료된 파일을 굿노트나 노타빌리티로 [공유 ➔ 열기]하면 쾌적한 필기가 가능해집니다."
          ]
        }
      ],
      "ctaText": "태블릿 필기용 PDF 가볍게 다이어트하기"
    },
    "en": {
      "title": "How to Optimize Heavy Textbook PDFs for iPad GoodNotes & Notability",
      "summary": "Prevent tablet app crashes and stylus input lag by slimming down massive PDF textbooks without losing sharp vector typography.",
      "sections": [
        {
          "heading": "Why Bulky PDFs Cause Apple Pencil Lag and App Crashes",
          "body": [
            "Massive 400MB+ scanned textbook PDFs overwhelm tablet RAM, resulting in sluggish page turns and abrupt app terminations.",
            "Active stylus handwriting demands responsive rendering buffers that heavy PDF background streams choke.",
            "mypickpdf strips invisible bloated redundancies while preserving crisp text contrast for effortless tablet note-taking."
          ],
          "tip": "Panda Tip: A 300MB medical or engineering textbook easily compresses to ~45MB with zero noticeable degradation under high zoom!"
        },
        {
          "heading": "Streamline Your Study PDFs in Seconds",
          "body": [
            "Step 1: Open [Compress PDF] directly in iPad Safari or Galaxy Chrome.",
            "Step 2: Select 'Recommended Compression' for the optimal balance of resolution and speed.",
            "Step 3: Import the trimmed file into GoodNotes or Notability for buttery-smooth writing."
          ]
        }
      ],
      "ctaText": "Compress Textbook for GoodNotes Now"
    }
  }
},

  // 31. 두꺼운 수험서·시험 족보 PDF에서 필요한 챕터 페이지만 쏙 뽑아내기
  {
  "id": 31,
  "slug": "how-to-extract-exam-chapters-pdf",
  "category": "edit",
  "categoryLabel": {
    "ko": "PDF 편집 팁",
    "en": "PDF Tips",
    "es": "Consejos PDF",
    "ja": "PDFヒント",
    "zh-CN": "PDF技巧"
  },
  "toolHref": "/split-pdf",
  "toolName": {
    "ko": "PDF 나누기",
    "en": "Split PDF",
    "es": "Dividir PDF",
    "ja": "PDF分割",
    "zh-CN": "拆分PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "welcome",
  "keywords": [
    "시험 족보 PDF 챕터 분할",
    "공무원 수험서 단원별 나누기",
    "전공 서적 범위별 분할 저장",
    "split exam book chapters pdf",
    "extract study chapters pdf",
    "試験問題集 PDF 単元別 分割"
  ],
  "translations": {
    "ko": {
      "title": "두꺼운 수험서·시험 족보 PDF에서 필요한 챕터 페이지만 쏙 뽑아내기",
      "summary": "공무원 시험, 자격증, 중간고사 대비 1,000페이지가 넘는 방대한 PDF 수험서에서 이번 주 공부할 핵심 단원 페이지만 스마트하게 분할 저장하는 방법입니다.",
      "sections": [
        {
          "heading": "매번 무거운 전체 파일을 스크롤하는 시간 낭비 해결",
          "body": [
            "1,000페이지가 넘는 두꺼운 수험서 PDF를 태블릿에서 매번 열면 로딩도 오래 걸리고 원하는 페이지를 찾느라 스크롤에 시간을 허비하게 됩니다.",
            "이번 주 진도에 해당하는 단원(예: 3단원 120~165페이지)만 쏙 뽑아 별도 파일로 분리해 두면 집중력이 배가됩니다.",
            "mypickpdf는 페이지 범위를 콤마나 하이픈으로 입력하기만 하면 1초 만에 깔끔한 전용 서브 노트를 만들어 줍니다."
          ],
          "tip": "래서팬더 꿀팁: 시험 직전 오답 노트 페이지만 따로 추출하여 [PDF 합치기]로 묶으면 세상에 하나뿐인 나만의 파이널 단권화 요약집이 완성됩니다!"
        },
        {
          "heading": "단원별 챕터 추출 3단계",
          "body": [
            "1단계: [PDF 나누기] 도구에 방대한 수험서 PDF를 등록합니다.",
            "2단계: 페이지 범위에 '120-165'처럼 이번 주 공부할 단원 페이지를 입력합니다.",
            "3단계: [페이지 추출하기]를 누르면 가벼운 단원별 PDF가 생성되어 즉시 공부를 시작할 수 있습니다."
          ]
        }
      ],
      "ctaText": "수험서 PDF에서 핵심 챕터 추출하기"
    },
    "en": {
      "title": "How to Split Heavy Exam Prep Books and Study Guides by Chapter",
      "summary": "Extract specific weekly study chapters from 1,000-page prep books into handy, lightweight PDFs for focused test preparation.",
      "sections": [
        {
          "heading": "Stop Scrolling Through Endless 1,000-Page Documents",
          "body": [
            "Navigating colossal certification study guides on mobile devices drains battery life and distracts your study flow.",
            "Segmenting massive prep manuals into dedicated chapter modules keeps your weekly learning milestones clean and organized.",
            "mypickpdf extracts precise page slices in milliseconds without corrupting text bookmarks."
          ],
          "tip": "Panda Tip: Extract your incorrectly answered quiz pages and merge them into a dedicated 'Final Review Cram Booklet'!"
        },
        {
          "heading": "Extracting Chapters in Seconds",
          "body": [
            "Step 1: Upload your heavy study guide to [Split PDF].",
            "Step 2: Type in your chapter page ranges (e.g. '120-165').",
            "Step 3: Click [Extract Pages] to produce your focused weekly module."
          ]
        }
      ],
      "ctaText": "Extract Study Chapters Now"
    }
  }
},

  // 32. 영문 논문·해외 원서 PDF에서 글자만 긁어모아 파파고·DeepL 번역기 돌리는 법
  {
  "id": 32,
  "slug": "extract-foreign-paper-text-for-translation",
  "category": "convert",
  "categoryLabel": {
    "ko": "파일 변환 노하우",
    "en": "Conversion",
    "es": "Conversión",
    "ja": "変換ノウハウ",
    "zh-CN": "格式转换"
  },
  "toolHref": "/ocr-pdf",
  "toolName": {
    "ko": "PDF 텍스트 추출 (OCR)",
    "en": "PDF Text OCR",
    "es": "OCR de PDF",
    "ja": "PDFテキスト抽出",
    "zh-CN": "PDF文字识别"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "idea",
  "keywords": [
    "영문 논문 텍스트 추출 번역",
    "스캔 논문 글자 복사",
    "PDF 텍스트 파파고 DeepL",
    "extract research paper text for translation",
    "copy text from scanned pdf for deepl",
    "論文 テキスト 抽出 翻訳"
  ],
  "translations": {
    "ko": {
      "title": "영문 논문·해외 원서 PDF에서 글자만 긁어모아 파파고·DeepL 번역기 돌리는 법",
      "summary": "드래그가 안 되거나 스캔되어 마우스 복사가 막힌 해외 학술지 논문 PDF에서 완벽하게 텍스트를 추출하여 번역기에 붙여넣는 비법입니다.",
      "sections": [
        {
          "heading": "복사 방지 및 스캔 논문의 텍스트 장벽 극복하기",
          "body": [
            "해외 학술 데이터베이스에서 다운로드한 오래된 논문이나 이미지 스캔 PDF는 마우스 드래그가 먹히지 않아 번역기를 돌리기 어렵습니다.",
            "일일이 손으로 키보드를 타이핑하면 전문 용어 철자가 틀리기 쉽고 시간이 턱없이 부족해집니다.",
            "mypickpdf [텍스트 추출 (OCR)] 도구는 문서 전체의 텍스트 레이어를 순서대로 디코딩하여 원클릭 복사 가능한 텍스트로 전환합니다."
          ],
          "tip": "래서팬더 꿀팁: 추출된 텍스트를 DeepL이나 ChatGPT에 넣고 [자연스러운 한국어 논문체로 번역해줘]라고 요청하면 번역 품질이 극대화됩니다!"
        },
        {
          "heading": "원클릭 논문 텍스트 추출 방법",
          "body": [
            "1단계: [PDF 텍스트 추출 (OCR)] 도구에 영문 논문 PDF를 업로드합니다.",
            "2단계: [텍스트 추출 시작]을 누르면 모든 페이지의 글자가 문맥 순서대로 정리됩니다.",
            "3단계: [전체 복사] 버튼을 눌러 번역기나 메모장에 바로 붙여넣어 활용하세요."
          ]
        }
      ],
      "ctaText": "영문 논문 PDF 텍스트 추출하기"
    },
    "en": {
      "title": "How to Extract Text from Foreign Academic Papers for DeepL & ChatGPT Translation",
      "summary": "Unlock non-selectable, scanned foreign journal PDFs by extracting clean text streams ready for instant AI and machine translation.",
      "sections": [
        {
          "heading": "Overcoming Text Selection Blocks on Scanned Research Papers",
          "body": [
            "Legacy academic papers from JSTOR or research repositories often exist purely as flat bitmap scans where text selection is impossible.",
            "Re-typing complex mathematical and scientific terminology by hand is impractical and error-prone.",
            "mypickpdf decodes document text blocks sequentially into formatted plain text ready for clipboard copy."
          ],
          "tip": "Panda Tip: Paste extracted text straight into DeepL or ChatGPT with the prompt: 'Translate this academic passage into fluent prose'!"
        },
        {
          "heading": "Extracting Paper Text in 3 Steps",
          "body": [
            "Step 1: Upload your academic paper to [PDF Text OCR].",
            "Step 2: Run the extraction engine to gather clean sentence structures.",
            "Step 3: Click [Copy All] to paste immediately into your translation workflow."
          ]
        }
      ],
      "ctaText": "Extract Paper Text Now"
    }
  }
},

  // 33. 이메일 첨부 파일 용량 초과(10MB/25MB) 해결: PDF 고화질 다이어트
  {
  "id": 33,
  "slug": "fix-email-attachment-size-limit-pdf",
  "category": "security",
  "categoryLabel": {
    "ko": "보안 & 프라이버시",
    "en": "Security",
    "es": "Seguridad",
    "ja": "セキュリティ",
    "zh-CN": "安全与隐私"
  },
  "toolHref": "/compress-pdf",
  "toolName": {
    "ko": "PDF 압축",
    "en": "Compress PDF",
    "es": "Comprimir PDF",
    "ja": "PDF圧縮",
    "zh-CN": "压缩PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "ready",
  "keywords": [
    "이메일 첨부파일 용량 초과 해결",
    "지메일 25MB 제한 PDF 압축",
    "네이버 메일 대용량 다운로드 만료 방지",
    "bypass email attachment limit 25mb pdf",
    "compress pdf for email attachment",
    "メール 添付 容量オーバー PDF 圧縮"
  ],
  "translations": {
    "ko": {
      "title": "이메일 첨부 파일 용량 초과(10MB/25MB) 해결: PDF 고화질 다이어트",
      "summary": "네이버 메일, 지메일(Gmail), 아웃룩(Outlook)으로 대용량 PDF를 보낼 때 '용량 한도 초과' 에러가 뜰 때 화질 손상 없이 즉시 용량을 줄이는 해결책입니다.",
      "sections": [
        {
          "heading": "대용량 다운로드 링크 대신 '직접 첨부'를 고집해야 하는 이유",
          "body": [
            "네이버나 다음 메일의 '대용량 첨부 링크'는 30일이 지나면 파일이 자동 삭제되어 상대방이 나중에 열어보지 못하는 업무 사고가 발생합니다.",
            "지메일(25MB)이나 사내 인트라넷 메일(10MB)의 수신 제한을 통과하도록 영구 보존 가능한 일반 첨부 파일로 다이어트하는 것이 중요합니다.",
            "mypickpdf의 클라이언트 로컬 압축 기술은 문서 속 폰트와 표의 선명도를 100% 유지하면서 무거운 이미지 스트림을 똑똑하게 다듬어 줍니다."
          ],
          "tip": "래서팬더 꿀팁: 서버에 파일이 업로드되지 않으므로 사내 기밀 보고서도 회사 감사팀 지적 없이 안심하고 압축할 수 있습니다!"
        },
        {
          "heading": "메일 전송 통과를 위한 초고속 압축법",
          "body": [
            "1단계: [PDF 압축] 도구에 용량이 큰 PDF 문서를 끌어다 놓습니다.",
            "2단계: '권장 압축' 또는 '초강력 압축'을 선택해 용량을 50~80% 대폭 줄입니다.",
            "3단계: 25MB 이하로 슬림해진 완성본을 다운로드하여 이메일에 일반 첨부로 발송합니다."
          ]
        }
      ],
      "ctaText": "이메일 전송용 PDF 용량 줄이기"
    },
    "en": {
      "title": "How to Bypass 25MB Email Attachment Limits for PDF Documents",
      "summary": "Send heavy PDF reports via Gmail, Outlook, or Apple Mail without encountering bounced messages or relying on temporary cloud drive links.",
      "sections": [
        {
          "heading": "Why Direct Attachments Beat Expiring Cloud Links",
          "body": [
            "Temporary download links often expire within 14-30 days, causing embarrassing follow-ups from clients and colleagues.",
            "Enterprise mail servers typically bounce incoming attachments over 20-25MB, halting urgent deal closings.",
            "mypickpdf optimizes redundant color profiles and downsamples oversized DPIs directly inside your browser."
          ],
          "tip": "Panda Tip: Local browser execution means sensitive internal quarterly reports are never uploaded to unknown servers!"
        },
        {
          "heading": "Slashing File Size in 3 Steps",
          "body": [
            "Step 1: Drag your oversized PDF into [Compress PDF].",
            "Step 2: Choose 'Recommended Compression' to preserve pristine typography.",
            "Step 3: Attach the newly slimmed (<10MB) PDF directly to your email."
          ]
        }
      ],
      "ctaText": "Compress PDF for Email Now"
    }
  }
},

  // 34. 스캐너나 폰으로 거꾸로 찍힌 PDF 문서 90도 회전하여 영구 저장하기
  {
  "id": 34,
  "slug": "how-to-fix-upside-down-scanned-pdf",
  "category": "edit",
  "categoryLabel": {
    "ko": "PDF 편집 팁",
    "en": "PDF Tips",
    "es": "Consejos PDF",
    "ja": "PDFヒント",
    "zh-CN": "PDF技巧"
  },
  "toolHref": "/rotate-pdf",
  "toolName": {
    "ko": "PDF 회전",
    "en": "Rotate PDF",
    "es": "Rotar PDF",
    "ja": "PDF回転",
    "zh-CN": "旋转PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "2분 읽기",
    "en": "2 min read",
    "es": "Lectura de 2 min",
    "ja": "2分で読める",
    "zh-CN": "2分钟阅读"
  },
  "mascotMood": "welcome",
  "keywords": [
    "스캔 PDF 거꾸로 회전",
    "PDF 90도 회전 저장",
    "뒤집힌 문서 바로잡기",
    "rotate upside down scanned pdf 90 degrees",
    "permanently rotate pdf pages",
    "スキャン PDF 上下反転 90度回転 保存"
  ],
  "translations": {
    "ko": {
      "title": "스캐너나 폰으로 거꾸로 찍힌 PDF 문서 90도 회전하여 영구 저장하기",
      "summary": "복합기 양면 스캔 실수로 거꾸로 뒤집히거나 옆으로 누워버린 PDF 문서를 영구적으로 90도/180도 회전시켜 똑바로 바로잡는 방법입니다.",
      "sections": [
        {
          "heading": "단순 뷰어 화면 회전과 '영구 파일 회전 저장'의 차이점",
          "body": [
            "아크로뱃 리더 뷰어에서 마우스 우클릭으로 회전시키면 내 화면에서만 잠깐 돌아갈 뿐, 파일을 저장해서 다른 사람에게 보내면 여전히 거꾸로 열립니다.",
            "상대방 컴퓨터나 모바일에서도 올바르게 보이게 하려면 PDF 내부의 페이지 회전 좌표 메타데이터 자체를 영구 갱신해야 합니다.",
            "mypickpdf는 시계 방향 90도, 180도, 270도 회전 각도를 파일 구조에 완벽하게 각인하여 저장합니다."
          ],
          "tip": "래서팬더 꿀팁: 회전 버튼을 누르면 즉시 미리보기로 올바른 각도를 확인하고 1초 만에 저장할 수 있어요!"
        },
        {
          "heading": "누구나 쉬운 PDF 각도 바로잡기",
          "body": [
            "1단계: [PDF 회전] 도구에 뒤집힌 문서를 끌어다 놓습니다.",
            "2단계: [오른쪽 90° 회전] 또는 [180° 회전] 버튼을 눌러 글자가 똑바로 서도록 맞춥니다.",
            "3단계: [회전된 PDF 저장하기]를 클릭하면 영구적으로 바로잡힌 완성 파일이 다운로드됩니다."
          ]
        }
      ],
      "ctaText": "거꾸로 된 PDF 문서 바로잡기"
    },
    "en": {
      "title": "How to Permanently Rotate Upside-Down Scanned PDF Pages",
      "summary": "Fix inverted and sideways scanned pages once and for all by embedding permanent 90-degree and 180-degree rotation tags into the PDF file.",
      "sections": [
        {
          "heading": "Temporary Viewer Rotation vs. Permanent File Encoding",
          "body": [
            "Simply rotating the display view in Acrobat Reader only alters your local screen session—recipients will still open an inverted document.",
            "Permanent fixes require altering the PDF's internal page dictionary `/Rotate` parameter.",
            "mypickpdf instantly updates the internal orientation tags in milliseconds."
          ],
          "tip": "Panda Tip: Rotate all pages clockwise or counterclockwise with a single tap!"
        },
        {
          "heading": "Correcting Page Orientation in 3 Steps",
          "body": [
            "Step 1: Upload your sideways document to [Rotate PDF].",
            "Step 2: Click the 90° or 180° rotation button until text aligns upright.",
            "Step 3: Click [Save Rotated PDF] to download your permanently corrected document."
          ]
        }
      ],
      "ctaText": "Rotate PDF Pages Now"
    }
  }
},

  // 35. 공채 채용 포털 업로드 제한(5MB/10MB) 맞춤 PDF 초고속 다이어트
  {
  "id": 35,
  "slug": "reduce-job-application-pdf-under-5mb",
  "category": "mobile",
  "categoryLabel": {
    "ko": "모바일 활용",
    "en": "Mobile Tips",
    "es": "Consejos Móvil",
    "ja": "モバイルヒント",
    "zh-CN": "移动技巧"
  },
  "toolHref": "/compress-pdf",
  "toolName": {
    "ko": "PDF 압축",
    "en": "Compress PDF",
    "es": "Comprimir PDF",
    "ja": "PDF圧縮",
    "zh-CN": "压缩PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "2분 읽기",
    "en": "2 min read",
    "es": "Lectura de 2 min",
    "ja": "2分で読める",
    "zh-CN": "2分钟阅读"
  },
  "mascotMood": "cheering",
  "keywords": [
    "채용 사이트 5MB 이하 PDF 압축",
    "사람인 잡코리아 지원서 용량 초과",
    "포트폴리오 10MB 줄이기",
    "compress job application pdf under 5mb",
    "shrink portfolio pdf for career portal",
    "採用エントリー PDF 容量削減 5MB以下"
  ],
  "translations": {
    "ko": {
      "title": "공채 채용 포털 업로드 제한(5MB/10MB) 맞춤 PDF 초고속 다이어트",
      "summary": "사람인, 잡코리아, 공기업 채용 홈페이지에서 '첨부파일 크기는 5MB를 초과할 수 없습니다' 에러가 떴을 때 마감 5분 전 초고속으로 통과하는 비법입니다.",
      "sections": [
        {
          "heading": "마감 직전 입사지원자를 당황시키는 '용량 초과' 에러",
          "body": [
            "포토샵이나 일러스트레이터에서 정성껏 제작한 포트폴리오 PDF는 고화질 비트맵 이미지로 인해 파일 크기가 30MB~50MB에 달하기 일쑤입니다.",
            "하지만 대기업 및 공기업 채용 시스템은 서버 부하 방지를 위해 첨부파일 용량을 5MB나 10MB로 엄격히 제한하고 있습니다.",
            "mypickpdf는 마감 직전 로그인이나 회원가입 절차 없이, 브라우저에서 즉시 80% 이상 용량을 깎아내어 합격 제출을 보장합니다."
          ],
          "tip": "래서팬더 꿀팁: [초강력 압축] 옵션을 적용하면 25MB 포트폴리오가 3.8MB로 슬림해지면서도 면접관 모니터에서 글자와 디자인이 선명하게 유지됩니다!"
        },
        {
          "heading": "5MB 통과를 위한 초고속 압축",
          "body": [
            "1단계: [PDF 압축] 도구에 대용량 입사지원 포트폴리오를 드롭합니다.",
            "2단계: '초강력 압축(용량 최소화)'을 선택합니다.",
            "3단계: 5MB 미만으로 줄어든 완성본을 받아 채용 포털에 성공적으로 접수하세요."
          ]
        }
      ],
      "ctaText": "입사지원서 PDF 5MB 이하로 줄이기"
    },
    "en": {
      "title": "How to Shrink Your Job Application & Portfolio PDF Under 5MB Fast",
      "summary": "Beat strict recruitment portal upload size limits (5MB / 10MB) minutes before the deadline without compromising visual portfolio clarity.",
      "sections": [
        {
          "heading": "Overcoming Career Portal Upload File Size Errors",
          "body": [
            "Portfolios designed in InDesign or Illustrator often balloon to 40MB+ due to uncompressed assets.",
            "Corporate HR portals strictly enforce 5MB or 10MB ceiling limits to prevent server bottlenecks, blocking panicked applicants at the deadline.",
            "mypickpdf resamples oversized imagery to optimal web display DPIs instantly inside your browser without login barriers."
          ],
          "tip": "Panda Tip: The 'Extreme Compression' mode easily trims a 30MB portfolio down to 3.5MB while maintaining flawless typography!"
        },
        {
          "heading": "Sub-5MB Compression in 3 Steps",
          "body": [
            "Step 1: Drop your heavy portfolio into [Compress PDF].",
            "Step 2: Choose 'Extreme Compression' for maximum size reduction.",
            "Step 3: Download the sub-5MB PDF and submit your application with confidence."
          ]
        }
      ],
      "ctaText": "Shrink Application PDF Now"
    }
  }
},

  // 36. 스캔본 PDF의 인쇄 글자를 복사 가능한 텍스트로 추출하는 완벽 가이드
  {
  "id": 36,
  "slug": "free-scanned-pdf-to-text-guide",
  "category": "convert",
  "categoryLabel": {
    "ko": "파일 변환 노하우",
    "en": "Conversion",
    "es": "Conversión",
    "ja": "変換ノウハウ",
    "zh-CN": "格式转换"
  },
  "toolHref": "/ocr-pdf",
  "toolName": {
    "ko": "PDF 텍스트 추출 (OCR)",
    "en": "PDF Text OCR",
    "es": "OCR de PDF",
    "ja": "PDFテキスト抽出",
    "zh-CN": "PDF文字识别"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "welcome",
  "keywords": [
    "스캔 PDF 텍스트 추출",
    "문서 사진 글자 복사 OCR",
    "PDF 한글 워드 텍스트 추출",
    "extract text from scanned pdf free",
    "scanned document to editable text",
    "スキャン PDF テキスト 抽出 無料"
  ],
  "translations": {
    "ko": {
      "title": "스캔본 PDF의 인쇄 글자를 복사 가능한 텍스트로 추출하는 완벽 가이드",
      "summary": "책, 신문 기사, 영수증, 계약서를 복합기 스캔한 이미지 PDF에서 원하는 문단을 긁어내 워드나 한글 문서로 옮겨 적는 가장 간편한 테크닉입니다.",
      "sections": [
        {
          "heading": "스캔 이미지 PDF와 텍스트 PDF의 구조적 차이점",
          "body": [
            "복합기로 스캔한 PDF는 컴퓨터 입장에서 글자가 아니라 하나의 거대한 '사진'에 불과합니다.",
            "따라서 마우스로 글자를 긁을 수도 없고, Ctrl+F 단어 검색도 되지 않아 문서 재활용에 큰 제약이 따릅니다.",
            "mypickpdf의 텍스트 추출 엔진은 문서 내부의 텍스트 스트림과 활자 블록을 정밀하게 추출하여 편집 가능한 디지털 텍스트로 복원합니다."
          ],
          "tip": "래서팬더 꿀팁: 표 형식으로 이루어진 데이터는 [PDF ➔ Excel] 도구를 활용하면 표 구조까지 완벽하게 추출할 수 있습니다!"
        },
        {
          "heading": "스캔 문서 텍스트 추출 실무 절차",
          "body": [
            "1단계: [PDF 텍스트 추출 (OCR)] 도구에 스캔된 문서를 추가합니다.",
            "2단계: [텍스트 추출 시작] 버튼을 누르면 브라우저가 각 페이지를 판독합니다.",
            "3단계: 추출된 결과를 [복사]하거나 [.txt 파일로 다운로드]하여 워드나 한글에 붙여넣습니다."
          ]
        }
      ],
      "ctaText": "스캔 PDF에서 글자 추출하기"
    },
    "en": {
      "title": "The Complete Guide to Extracting Editable Text from Scanned PDFs",
      "summary": "Turn unselectable scanned book pages, legal papers, and receipts into copyable, searchable text streams in seconds.",
      "sections": [
        {
          "heading": "Why Scanned Documents Block Text Selection",
          "body": [
            "Scanners create graphic image containers rather than indexed typographic characters.",
            "This prevents keyword searching (Ctrl+F), content copying, and easy quote referencing.",
            "mypickpdf extracts underlying text characters and organizes them chronologically for instant copying into Word or Google Docs."
          ],
          "tip": "Panda Tip: If your scanned document contains tables, use [PDF to Excel] instead to retain perfect grid formatting!"
        },
        {
          "heading": "Extracting Content in 3 Easy Steps",
          "body": [
            "Step 1: Upload your scanned PDF to [PDF Text OCR].",
            "Step 2: Let the client parser decode text characters.",
            "Step 3: Click [Copy to Clipboard] or download the formatted .txt file."
          ]
        }
      ],
      "ctaText": "Extract Scanned Text Now"
    }
  }
},

  // 37. 법률 계약서·전자등기 10년 이상 변형 없이 보관하는 PDF/A 표준 규격의 모든 것
  {
  "id": 37,
  "slug": "why-use-pdfa-for-legal-archives",
  "category": "security",
  "categoryLabel": {
    "ko": "보안 & 프라이버시",
    "en": "Security",
    "es": "Seguridad",
    "ja": "セキュリティ",
    "zh-CN": "安全与隐私"
  },
  "toolHref": "/pdf-to-pdfa",
  "toolName": {
    "ko": "PDF/A 변환",
    "en": "PDF to PDF/A",
    "es": "PDF a PDF/A",
    "ja": "PDF/A変換",
    "zh-CN": "转换为PDF/A"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "ready",
  "keywords": [
    "PDF/A 규격 변환",
    "법률 전자등기 장기 보관 PDF",
    "ISO 19005-1 표준 문서",
    "why use pdf/a for legal archives",
    "iso standard long term document preservation",
    "PDF/A 規格 変換 長期保存"
  ],
  "translations": {
    "ko": {
      "title": "법률 계약서·전자등기 10년 이상 변형 없이 보관하는 PDF/A 표준 규격의 모든 것",
      "summary": "ISO 19005-1 국제 표준인 PDF/A 규격이 왜 장기 보관용 문서의 필수 조건인지, 일반 PDF와 무엇이 다른지 법률·기업 실무 관점에서 살펴봅니다.",
      "sections": [
        {
          "heading": "일반 PDF가 수년 뒤 열리지 않거나 폰트가 깨지는 이유",
          "body": [
            "일반 PDF 문서는 컴퓨터 시스템 외부의 폰트나 자바스크립트 등 동적 요소에 의존하는 경우가 많습니다.",
            "이로 인해 5년, 10년 뒤 뷰어 소프트웨어가 업데이트되거나 운영체제가 바뀌면 글자가 깨지거나 서식이 틀어지는 문제가 발생합니다.",
            "국제 표준인 PDF/A(PDF for Archiving)는 폰트, 색상 프로파일, 이미지 데이터를 문서 파일 내부에 100% 영구 임베딩하여 50년 후에도 완벽히 동일한 출력을 보장합니다."
          ],
          "tip": "래서팬더 꿀팁: 법원 전자소송, 특허청 출원, 공공기관 기록물 관리 규정은 PDF/A 준수 문서를 공식 권장하고 있습니다!"
        },
        {
          "heading": "간편한 PDF/A 보관용 규격 변환법",
          "body": [
            "1단계: [PDF PDF/A로 변환] 도구에 장기 보관할 계약서나 문서를 첨부합니다.",
            "2단계: [PDF/A 규격으로 변환 시작]을 누르면 메타데이터와 폰트 스트림이 표준화됩니다.",
            "3단계: 변환된 영구 보관용 PDF를 다운로드하여 사내 아카이브나 클라우드 스토리지에 안전하게 보관하세요."
          ]
        }
      ],
      "ctaText": "장기 보관용 PDF/A 규격으로 변환하기"
    },
    "en": {
      "title": "Why Legal and Archival Documents Require the ISO PDF/A Standard",
      "summary": "Discover why courts, patent offices, and compliance auditors mandate ISO 19005-1 PDF/A for permanent, 100% reproducible document preservation.",
      "sections": [
        {
          "heading": "Why Standard PDFs Can Break Over Decades",
          "body": [
            "Regular PDFs often rely on system font references and external script dependencies.",
            "As operating systems and PDF readers evolve over 10-20 years, missing fonts result in corrupted glyphs and altered layout structures.",
            "The ISO PDF/A standard strictly mandates self-contained font embedding, standardized device-independent color spaces, and zero dynamic scripts."
          ],
          "tip": "Panda Tip: Courts, archival registries, and patent offices around the globe require PDF/A compliance for permanent electronic filings!"
        },
        {
          "heading": "Converting to PDF/A in 3 Steps",
          "body": [
            "Step 1: Open [PDF to PDF/A] and upload your target document.",
            "Step 2: Initiate archival normalization to embed required color profiles and tags.",
            "Step 3: Save your compliant archive file for worry-free decadal storage."
          ]
        }
      ],
      "ctaText": "Convert to Archival PDF/A Now"
    }
  }
},

  // 38. 광고 많은 웹페이지 뉴스 기사를 깨끗한 인쇄용 PDF로 소장하는 방법
  {
  "id": 38,
  "slug": "webpage-article-to-clean-pdf",
  "category": "convert",
  "categoryLabel": {
    "ko": "파일 변환 노하우",
    "en": "Conversion",
    "es": "Conversión",
    "ja": "変換ノウハウ",
    "zh-CN": "格式转换"
  },
  "toolHref": "/html-to-pdf",
  "toolName": {
    "ko": "HTML PDF 변환",
    "en": "HTML to PDF",
    "es": "HTML a PDF",
    "ja": "HTML PDF変換",
    "zh-CN": "HTML转PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "welcome",
  "keywords": [
    "웹페이지 PDF 저장 광고 없이",
    "인터넷 기사 PDF 소장",
    "HTML 코드 PDF 변환",
    "convert webpage article to clean pdf",
    "save web page without ads to pdf",
    "ウェブ記事 広告なし PDF 保存"
  ],
  "translations": {
    "ko": {
      "title": "광고 많은 웹페이지 뉴스 기사를 깨끗한 인쇄용 PDF로 소장하는 방법",
      "summary": "인터넷 기사나 기술 블로그의 유용한 정보를 열람할 때 화면을 어지럽히는 광고 팝업과 배너를 걷어내고 본문 텍스트와 핵심 이미지만 A4 PDF로 영구 저장하는 노하우입니다.",
      "sections": [
        {
          "heading": "인터넷 링크는 언젠가 사라지지만 PDF는 평생 남습니다",
          "body": [
            "북마크해 둔 뉴스 기사나 기술 튜토리얼 웹페이지는 사이트 개편이나 서비스 종료로 어느 날 갑자기 사라질 수 있습니다.",
            "웹 브라우저의 일반 인쇄 기능은 사이드바 광고, 댓글창, 쿠키 배너까지 덕지덕지 인쇄되어 가독성이 떨어집니다.",
            "mypickpdf [HTML PDF 변환]을 이용하면 핵심 HTML 본문만 깔끔한 A4 규격 레이아웃으로 렌더링하여 영구 소장할 수 있습니다."
          ],
          "tip": "래서팬더 꿀팁: 코딩 튜토리얼이나 요리 레시피도 PDF로 저장해 두면 비행기 안이나 오프라인에서도 언제든 읽을 수 있어요!"
        },
        {
          "heading": "웹페이지 PDF 변환 실천 가이드",
          "body": [
            "1단계: 저장하고 싶은 기사나 웹페이지의 HTML 코드 또는 본문 텍스트를 복사합니다.",
            "2단계: [HTML PDF 변환] 편집창에 붙여넣고 서식을 정돈합니다.",
            "3단계: [PDF로 변환 시작]을 클릭하면 책처럼 깔끔한 고화질 A4 전자문서가 완성됩니다."
          ]
        }
      ],
      "ctaText": "웹페이지 HTML 코드로 PDF 만들기"
    },
    "en": {
      "title": "How to Save Online Articles and Webpages as Clean, Ad-Free PDFs",
      "summary": "Archive valuable online tutorials and news stories without annoying ad banners, popups, or tracking cookies into neat reading PDFs.",
      "sections": [
        {
          "heading": "Web Links Break, but Archived PDFs Last Forever",
          "body": [
            "Bookmarks often lead to 404 dead links when web domains expire or restructure article directories.",
            "Standard browser printing typically captures bloated sidebars, invasive banner advertisements, and cluttered comment widgets.",
            "mypickpdf renders crisp HTML structures directly into clean, proportional A4 reading sheets."
          ],
          "tip": "Panda Tip: Great for building your own offline library of coding documentation and technical research papers!"
        },
        {
          "heading": "Converting Web Content in 3 Steps",
          "body": [
            "Step 1: Copy your desired HTML article snippet or upload your .html file.",
            "Step 2: Paste it into the [HTML to PDF] text editor.",
            "Step 3: Click convert to download a beautiful, ad-free reader PDF."
          ]
        }
      ],
      "ctaText": "Convert HTML to Clean PDF Now"
    }
  }
},

  // 39. 5월 종합소득세 및 부가세 신고용 지출 증빙 PDF 깔끔하게 묶는 법
  {
  "id": 39,
  "slug": "combine-receipts-invoices-tax-filing",
  "category": "convert",
  "categoryLabel": {
    "ko": "파일 변환 노하우",
    "en": "Conversion",
    "es": "Conversión",
    "ja": "変換ノウハウ",
    "zh-CN": "格式转换"
  },
  "toolHref": "/merge-pdf",
  "toolName": {
    "ko": "PDF 합치기",
    "en": "Merge PDF",
    "es": "Unir PDF",
    "ja": "PDF結合",
    "zh-CN": "合并PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "cheering",
  "keywords": [
    "종합소득세 증빙서류 PDF 합치기",
    "부가세 매입 세금계산서 병합",
    "세무사 제출 서류 PDF 정리",
    "combine tax deduction receipts into single pdf",
    "merge business tax filing documents",
    "確定申告 領収書 PDF まとめて提出"
  ],
  "translations": {
    "ko": {
      "title": "5월 종합소득세 및 부가세 신고용 지출 증빙 PDF 깔끔하게 묶는 법",
      "summary": "개인사업자, 프리랜서, 법인 담당자가 세무사 사무실에 제출할 수십 개의 전자계산서, 카드 영수증, 이체확인증 PDF를 일자별로 가지런히 병합하는 노하우입니다.",
      "sections": [
        {
          "heading": "세무 대리인이 가장 환영하는 증빙 서류 정리법",
          "body": [
            "종합소득세 신고철마다 수십 통의 이메일과 메신저로 증빙 서류를 낱개로 보내면 세무사가 누락하여 절세 혜택을 놓칠 위험이 있습니다.",
            "카드 영수증, 은행 송금 확인증, 매입 계산서를 월별/일자별로 순서대로 정렬해 단 1개의 단일 PDF로 묶어 제출하면 세무 검토가 즉각 완료됩니다.",
            "mypickpdf는 금융 거래 내역이 외부 서버로 전송되지 않으므로 회사 계좌 정보나 매출 내역 유출 걱정 없이 안전합니다."
          ],
          "tip": "래서팬더 꿀팁: 파일명을 '2026_1분기_지출증빙_홍길동.pdf'처럼 명확하게 작성하면 세무사 사무실과의 소통이 10배 수월해집니다!"
        },
        {
          "heading": "세무 증빙 서류 원스톱 병합 3단계",
          "body": [
            "1단계: [PDF 합치기] 도구에 준비된 지출 증빙 PDF들을 한꺼번에 드래그하여 올립니다.",
            "2단계: 위/아래 순서 조정 화살표를 눌러 1월부터 12월까지 일자순으로 정렬합니다.",
            "3단계: [PDF 합치기]를 클릭하면 세무사 제출용 단일 증빙 패키지가 완성됩니다."
          ]
        }
      ],
      "ctaText": "세무 증빙 PDF 파일 하나로 합치기"
    },
    "en": {
      "title": "How to Merge All Tax Deduction Receipts & Invoices for Annual Filing",
      "summary": "Help your accountant maximize your tax returns by combining diverse vendor invoices, card receipts, and bank slips into a unified audit-ready PDF.",
      "sections": [
        {
          "heading": "Why Accountants Love Single Consolidated Tax Packages",
          "body": [
            "Sending dozens of individual image attachments during tax season causes friction and risks missed deductions.",
            "Submitting a neatly organized, chronologically stacked PDF package ensures every business expense is properly categorized.",
            "Client-side processing guarantees your private financial ledger stays strictly confidential."
          ],
          "tip": "Panda Tip: Rename your merged file with your name and tax year (e.g. '2026_Tax_Deductions_JohnDoe.pdf')!"
        },
        {
          "heading": "Consolidating Tax Papers in 3 Steps",
          "body": [
            "Step 1: Drag all your expense PDFs into [Merge PDF].",
            "Step 2: Align them chronologically from January to December.",
            "Step 3: Click [Merge PDF] to generate your accountant-ready tax filing package."
          ]
        }
      ],
      "ctaText": "Merge Tax Documents Now"
    }
  }
},

  // 40. 내 지적재산권 지키기: 무단 배포 방지용 투명 워터마크 삽입 완벽 가이드
  {
  "id": 40,
  "slug": "complete-guide-watermarking-confidential-pdf",
  "category": "security",
  "categoryLabel": {
    "ko": "보안 & 프라이버시",
    "en": "Security",
    "es": "Seguridad",
    "ja": "セキュリティ",
    "zh-CN": "安全与隐私"
  },
  "toolHref": "/add-watermark",
  "toolName": {
    "ko": "워터마크 추가",
    "en": "Add Watermark",
    "es": "Marca de agua",
    "ja": "透かし追加",
    "zh-CN": "添加水印"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "ready",
  "keywords": [
    "전자책 무단 배포 방지 워터마크",
    "지적재산권 PDF 복사금지",
    "제안서 워터마크 삽입 팁",
    "protect intellectual property pdf watermark",
    "anti piracy ebook watermark",
    "電子書籍 無断転載防止 透かし"
  ],
  "translations": {
    "ko": {
      "title": "내 지적재산권 지키기: 무단 배포 방지용 투명 워터마크 삽입 완벽 가이드",
      "summary": "내가 직접 작성한 전자책, 디자인 도면, 사업계획서, 기획 제안서가 인터넷에 무단 유포되는 것을 방지하기 위해 보이지 않는 방패인 워터마크를 심는 방법입니다.",
      "sections": [
        {
          "heading": "디지털 워터마크가 불법 공유를 막는 심리적·법적 원리",
          "body": [
            "정성껏 만든 유료 전자책이나 기업 기획서가 단톡방이나 웹 커뮤니티에 불법 업로드되는 사례가 빈번합니다.",
            "문서의 모든 페이지 중앙에 [무단 전재 및 재배포 금지] 또는 구매자 이메일 주소를 연하게 박아두면, 유출자가 신원 노출을 두려워해 공유를 단념하게 됩니다.",
            "mypickpdf는 벡터 그래픽 렌더링으로 워터마크를 텍스트 레이어 아래에 완벽 결합하여 캡처나 재편집을 어렵게 만듭니다."
          ],
          "tip": "래서팬더 꿀팁: 워터마크 폰트 크기를 48pt 전후, 투명도를 20%로 세팅하면 본문을 편안하게 읽으면서도 유출 방지 효과는 극대화됩니다!"
        },
        {
          "heading": "지적재산권 보호 워터마크 세팅 순서",
          "body": [
            "1단계: [워터마크 추가] 도구에 전자책이나 기획서 PDF를 등록합니다.",
            "2단계: 워터마크 텍스트에 '무단 복제 금지' 또는 'SAMPLE' 문구를 입력합니다.",
            "3단계: 45도 회전 각도와 적절한 투명도를 확인한 뒤 완성본을 안전하게 다운로드합니다."
          ]
        }
      ],
      "ctaText": "내 창작물 PDF에 복제 방지 워터마크 심기"
    },
    "en": {
      "title": "How to Protect Your E-books and Intellectual Property with Watermarks",
      "summary": "Prevent unauthorized distribution and piracy of your digital books, design blueprints, and pitch proposals with smart semi-transparent watermarks.",
      "sections": [
        {
          "heading": "Psychological and Legal Deterrence Against Digital Piracy",
          "body": [
            "Valuable digital products like training manuals, whitepapers, and e-books are vulnerable to unauthorized re-sharing across forums.",
            "Embedding subtle diagonal watermarks such as 'UNAUTHORIZED REPRODUCTION PROHIBITED' drastically discourages illegal leaks.",
            "mypickpdf embeds the watermark vector deeply into the PDF page stream without uploading your valuable content to remote servers."
          ],
          "tip": "Panda Tip: A 48pt font size at 20% opacity ensures reader comfort while rendering screenshots unmistakably watermarked!"
        },
        {
          "heading": "Securing Your Creations in 3 Steps",
          "body": [
            "Step 1: Open [Add Watermark] and upload your creative PDF.",
            "Step 2: Enter your copyright notice or recipient identity tag.",
            "Step 3: Preview the 45-degree angle and save your protected publication."
          ]
        }
      ],
      "ctaText": "Protect Your Intellectual Property Now"
    }
  }
},

  // 41. 회의 녹화 영상이나 프로그램 사용법을 5초 만에 설명용 움직이는 짤(GIF)로 만들기
  {
  "id": 41,
  "slug": "convert-meeting-video-to-gif-guide",
  "category": "media",
  "categoryLabel": {
    "ko": "미디어 툴",
    "en": "Media Tools",
    "es": "Medios",
    "ja": "メディアツール",
    "zh-CN": "多媒体工具"
  },
  "toolHref": "/video-to-gif",
  "toolName": {
    "ko": "동영상 GIF 변환",
    "en": "Video to GIF",
    "es": "Video a GIF",
    "ja": "動画GIF変換",
    "zh-CN": "视频转GIF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "idea",
  "keywords": [
    "동영상 GIF 변환 프로그램 없이",
    "회의 녹화 움짤 만들기",
    "노션 슬랙용 설명 GIF",
    "convert meeting video to gif loop",
    "make gif from screen recording notion slack",
    "動画 GIF 変換 ノーション スラック"
  ],
  "translations": {
    "ko": {
      "title": "회의 녹화 영상이나 프로그램 사용법을 5초 만에 설명용 움직이는 짤(GIF)로 만들기",
      "summary": "노션(Notion), 슬랙(Slack), 잔디, 사내 위키에 첨부할 무거운 동영상 대신 재생 버튼 없이도 즉시 보이는 고화질 루프 GIF 움짤을 브라우저에서 만드는 법입니다.",
      "sections": [
        {
          "heading": "동영상 대신 움직이는 GIF가 협업 도구에서 사랑받는 이유",
          "body": [
            "업무 매뉴얼이나 버그 리포트에 동영상을 첨부하면 수신자가 재생 버튼을 누르고 플레이어가 로딩될 때까지 기다려야 합니다.",
            "반면 움직이는 짤(GIF)은 노션이나 슬랙 문서 안에서 무한 반복 재생되어 핵심 동작을 단 3초 만에 직관적으로 이해시킵니다.",
            "mypickpdf의 브라우저 비디오 인코더는 무거운 외부 프로그램 없이 스마트폰이나 PC 화면 녹화 영상을 고화질 GIF로 즉시 렌더링합니다."
          ],
          "tip": "래서팬더 꿀팁: 프레임 레이트(FPS)를 15FPS 수준으로 맞추면 용량은 가벼우면서도 마우스 커서 움직임이 아주 부드럽습니다!"
        },
        {
          "heading": "초간단 3단계 GIF 생성법",
          "body": [
            "1단계: [동영상 GIF 변환] 메뉴에 MP4, MOV 화면 녹화 영상을 추가합니다.",
            "2단계: 원하는 영상 구간과 화질 옵션을 지정합니다.",
            "3단계: [GIF로 변환하기]를 누르면 노션이나 슬랙에 바로 붙여넣을 수 있는 고화질 움짤이 다운로드됩니다."
          ]
        }
      ],
      "ctaText": "화면 녹화 영상 GIF 움짤로 변환하기"
    },
    "en": {
      "title": "How to Turn Video Screen Recordings into Smooth GIFs for Notion & Slack",
      "summary": "Replace bulky video files in your company knowledge base with lightweight, auto-playing looping GIFs that explain features in seconds.",
      "sections": [
        {
          "heading": "Why Looping GIFs Beat Video Players in Documentation",
          "body": [
            "Embedding raw MP4 videos in Notion or Slack documentation requires viewers to manually click play and wait for buffering.",
            "Looping GIFs instantly illustrate UI workflows, software bug reproductions, and visual walkthroughs without any interaction.",
            "mypickpdf renders smooth GIFs directly in your browser using hardware acceleration."
          ],
          "tip": "Panda Tip: Setting 15 FPS delivers a silky smooth mouse cursor animation while keeping file size well under 3MB!"
        },
        {
          "heading": "Generating GIFs in 3 Simple Steps",
          "body": [
            "Step 1: Upload your MP4 or MOV screen recording to [Video to GIF].",
            "Step 2: Adjust your duration and resolution preferences.",
            "Step 3: Click convert to retrieve your auto-playing documentation GIF."
          ]
        }
      ],
      "ctaText": "Convert Video to GIF Now"
    }
  }
},

  // 42. 워드(Word .docx) 문서의 줄바꿈과 표 서식을 100% 유지하며 PDF로 변환하기
  {
  "id": 42,
  "slug": "word-docx-to-pdf-formatting-guide",
  "category": "convert",
  "categoryLabel": {
    "ko": "파일 변환 노하우",
    "en": "Conversion",
    "es": "Conversión",
    "ja": "変換ノウハウ",
    "zh-CN": "格式转换"
  },
  "toolHref": "/word-to-pdf",
  "toolName": {
    "ko": "워드 PDF 변환",
    "en": "Word to PDF",
    "es": "Word a PDF",
    "ja": "Word PDF変換",
    "zh-CN": "Word转PDF"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "3분 읽기",
    "en": "3 min read",
    "es": "Lectura de 3 min",
    "ja": "3分で読める",
    "zh-CN": "3分钟阅读"
  },
  "mascotMood": "welcome",
  "keywords": [
    "워드 PDF 변환 서식 유지",
    "DOCX PDF 줄바꿈 깨짐 방지",
    "워드 문서 무료 PDF 변환",
    "convert word docx to pdf keep formatting",
    "ms word to pdf font preserve",
    "Word PDF 変換 書式崩れなし"
  ],
  "translations": {
    "ko": {
      "title": "워드(Word .docx) 문서의 줄바꿈과 표 서식을 100% 유지하며 PDF로 변환하기",
      "summary": "마이크로소프트 워드로 정성껏 작성한 제안서나 기안문을 PDF로 변환할 때 폰트가 깨지거나 표 테두리가 어긋나는 현상을 방지하는 최적의 변환 가이드입니다.",
      "sections": [
        {
          "heading": "워드 변환 시 서식이 깨지는 이유와 최신 해결책",
          "body": [
            "기존 구형 변환 엔진은 한글이나 특수 문자셋의 2바이트 인코딩을 제대로 처리하지 못해 글자가 물음표(???)로 변하거나 표 간격이 어긋나곤 했습니다.",
            "mypickpdf는 2D Canvas 고해상도 벡터 렌더링 파이프라인을 도입하여 원본 .docx 문서의 단락 구조, 글자 크기, 여백을 픽셀 단위로 정확하게 재현합니다.",
            "윈도우나 맥북 어디서 만든 워드 문서든 A4 인쇄 규격에 맞춰 단정한 전자문서로 즉시 변환됩니다."
          ],
          "tip": "래서팬더 꿀팁: 변환된 PDF의 용량이 크다면 바로 [PDF 압축] 도구와 연계해 이메일 전송에 최적화된 크기로 줄여보세요!"
        },
        {
          "heading": "워드 문서 3단계 무손실 PDF 변환",
          "body": [
            "1단계: [워드 PDF 변환] 메뉴에 .docx 문서를 끌어다 놓습니다.",
            "2단계: [PDF로 변환 시작] 버튼을 누르면 1초 만에 A4 규격 레이아웃으로 렌더링됩니다.",
            "3단계: 완성된 고화질 PDF를 다운로드하여 상대방에게 깔끔하게 전달하세요."
          ]
        }
      ],
      "ctaText": "워드 문서 손실 없이 PDF로 변환하기"
    },
    "en": {
      "title": "How to Convert Word (.docx) to PDF While Preserving Exact Formatting",
      "summary": "Prevent font corruption, broken tables, and scrambled line breaks by using high-fidelity Canvas vector rendering for your Word documents.",
      "sections": [
        {
          "heading": "Why Outdated Converters Mangle Word Typography",
          "body": [
            "Older conversion engines struggle with modern OpenXML styles, resulting in missing international characters and misaligned tables.",
            "mypickpdf leverages modern 2D Canvas typography rendering, preserving font weights, line heights, and margins with pixel-level precision.",
            "Documents created across Windows and macOS convert identically into standardized A4 publication PDFs."
          ],
          "tip": "Panda Tip: If your Word file contains high-res photography, pair it with our [Compress PDF] tool for fast email delivery!"
        },
        {
          "heading": "Lossless Conversion in 3 Steps",
          "body": [
            "Step 1: Upload your .docx document to [Word to PDF].",
            "Step 2: Let the client engine map paragraphs and formatting styles.",
            "Step 3: Download your publication-ready A4 PDF document."
          ]
        }
      ],
      "ctaText": "Convert Word to PDF Now"
    }
  }
},

  // 43. 기업 비밀 문서 유출 걱정 끝: 서버 저장 0% 브라우저 격리 기술의 원리와 안전성
  {
  "id": 43,
  "slug": "zero-server-storage-privacy-faq",
  "category": "security",
  "categoryLabel": {
    "ko": "보안 & 프라이버시",
    "en": "Security",
    "es": "Seguridad",
    "ja": "セキュリティ",
    "zh-CN": "安全与隐私"
  },
  "toolHref": "/",
  "toolName": {
    "ko": "마이픽 홈",
    "en": "mypickpdf Home",
    "es": "Inicio",
    "ja": "ホーム",
    "zh-CN": "首页"
  },
  "date": "2026-09-28",
  "readTime": {
    "ko": "4분 읽기",
    "en": "4 min read",
    "es": "Lectura de 4 min",
    "ja": "4分で読める",
    "zh-CN": "4分钟阅读"
  },
  "mascotMood": "idea",
  "keywords": [
    "PDF 서버 저장 없는 사이트",
    "100% 브라우저 로컬 PDF 변환",
    "문서 보안 유출 0% 원리",
    "zero server upload pdf editor private",
    "client side webassembly pdf security",
    "サーバー保存なし PDF 変換 安全性"
  ],
  "translations": {
    "ko": {
      "title": "기업 비밀 문서 유출 걱정 끝: 서버 저장 0% 브라우저 격리 기술의 원리와 안전성",
      "summary": "기존 해외 유명 PDF 사이트들의 서버 파일 저장 논란과 대조적으로, mypickpdf가 어떻게 단 1바이트의 문서도 외부 서버로 전송하지 않고 모든 작업을 처리하는지 상세히 밝힙니다.",
      "sections": [
        {
          "heading": "기존 무료 PDF 사이트들의 충격적인 데이터 저장 실태",
          "body": [
            "대부분의 무료 온라인 PDF 편집 사이트는 사용자가 올린 문서를 원격 해외 클라우드 서버에 업로드한 뒤 변환 작업을 처리합니다.",
            "이 과정에서 계약서, 주민등록등본, 재무제표와 같은 민감한 사내 비밀 문서가 외부 서버 임시 폴더에 저장되어 보안 감사 지적이나 유출 사고로 이어질 위험이 큽니다.",
            "mypickpdf는 발상의 전환을 통해, 모든 PDF 연산 엔진을 사용자의 웹 브라우저 안에서 직접 구동하도록 설계했습니다."
          ],
          "tip": "래서팬더 꿀팁: 개발자 도구(F12)의 네트워크 탭을 확인해 보세요. 파일을 변환하고 합치는 동안 외부 서버로 파일이 단 1바이트도 업로드되지 않는 것을 눈으로 직접 확인할 수 있습니다!"
        },
        {
          "heading": "WebAssembly와 오프스크린 캔버스가 이뤄낸 혁신",
          "body": [
            "1. 브라우저 메모리 격리: 문서 파일은 사용자의 개인 컴퓨터 RAM 메모리 상에서만 즉시 처리됩니다.",
            "2. 영구 삭제 불필요: 브라우저 탭을 닫는 순간 처리되던 모든 메모리 데이터는 흔적도 없이 완전히 휘발되어 증발합니다.",
            "3. 비행기 모드에서도 작동: 핵심 엔진이 로컬에서 구동되므로 비행기 안이나 보안 격리망(망분리 PC) 환경에서도 안전하게 사용할 수 있습니다."
          ]
        }
      ],
      "ctaText": "100% 안심 로컬 PDF 도구 체험하기"
    },
    "en": {
      "title": "Zero-Server Storage: How Client-Side Browser Sandboxing Eliminates Data Leaks",
      "summary": "Understand the revolutionary WebAssembly architecture behind mypickpdf that guarantees zero byte upload to external servers for sensitive enterprise files.",
      "sections": [
        {
          "heading": "The Latent Security Risks of Traditional Cloud PDF Services",
          "body": [
            "Conventional online PDF converters require transferring your sensitive files to remote third-party cloud servers.",
            "This pipeline creates serious compliance vulnerabilities for enterprise NDAs, financial audits, and personal identity documents.",
            "mypickpdf executes 100% of PDF rendering, merging, and compression directly within your local browser execution sandbox."
          ],
          "tip": "Panda Tip: Open your browser's Developer Tools (F12) Network tab to verify that zero file payloads leave your machine during conversion!"
        },
        {
          "heading": "How Browser-Side WebAssembly Protects Your Confidentiality",
          "body": [
            "1. RAM-Only Processing: Your files are parsed strictly inside your workstation's local memory buffer.",
            "2. Instant Ephemerality: The moment you close or refresh the browser tab, all residual memory states evaporate completely.",
            "3. Offline Air-Gap Capability: Because the engine runs locally, once cached, tools function even under strict air-gapped networks."
          ]
        }
      ],
      "ctaText": "Experience True Local Privacy at mypickpdf"
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
