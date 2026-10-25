import type { Language } from "./i18n";
import { translations } from "./i18n";

import pdfToHwpData from "./tool-content/pdf-to-hwp.json";
import mergePdfData from "./tool-content/merge-pdf.json";
import splitPdfData from "./tool-content/split-pdf.json";
import compressPdfData from "./tool-content/compress-pdf.json";
import imageToPdfData from "./tool-content/image-to-pdf.json";
import ocrPdfData from "./tool-content/ocr-pdf.json";
import rotatePdfData from "./tool-content/rotate-pdf.json";

export interface ToolModeOption {
  id: string;
  title: string;
  badge: string;
  badgeColor?: string;
  desc: string;
}

export interface ToolHowToStep {
  step: number;
  title: string;
  desc: string;
}

export interface ToolGuideFeature {
  title: string;
  description: string;
  badge?: string;
}

export interface ToolDeepGuide {
  toolName: string;
  tagline: string;
  features: ToolGuideFeature[];
  proTips: string[];
  securityNote: string;
  relatedGuideSlug?: string;
  relatedGuideTitle?: string;
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolContentBundle {
  toolName: string;
  tagline?: string;
  modes?: ToolModeOption[];
  howToSteps: ToolHowToStep[];
  deepGuide?: ToolDeepGuide;
  faqTitle?: string;
  faqSubtitle?: string;
  faqItems: ToolFaqItem[];
  ui: Record<string, string>;
}

export const TOOL_CONTENTS: Record<string, Record<string, ToolContentBundle>> = {
  "pdf-to-hwp": pdfToHwpData as any,
  "merge-pdf": mergePdfData as any,
  "split-pdf": splitPdfData as any,
  "compress-pdf": compressPdfData as any,
  "image-to-pdf": imageToPdfData as any,
  "ocr-pdf": ocrPdfData as any,
  "rotate-pdf": rotatePdfData as any,
};

export const GENERIC_STEPS: Record<string, ToolHowToStep[]> = {
  ko: [
    { step: 1, title: "파일 업로드", desc: "처리하고 싶은 문서를 화면에 끌어다 놓거나 파일 선택 버튼을 클릭합니다." },
    { step: 2, title: "옵션 및 서식 설정", desc: "원하는 작업 모드와 세부 설정을 선택합니다." },
    { step: 3, title: "작업 완료 및 저장", desc: "처리가 완료되면 브라우저에서 안전하게 새 문서를 즉시 다운로드합니다." }
  ],
  en: [
    { step: 1, title: "Upload File", desc: "Drag and drop your document or click to browse files." },
    { step: 2, title: "Configure Settings", desc: "Choose your desired processing options and settings." },
    { step: 3, title: "Process & Download", desc: "Once processed, instantly and safely download your completed file." }
  ],
  ja: [
    { step: 1, title: "ファイルをアップロード", desc: "処理したい文書をドラッグ＆ドロップまたはファイル選択ボタンから追加します。" },
    { step: 2, title: "オプション設定", desc: "ご希望の処理モードや詳細設定を選択します。" },
    { step: 3, title: "処理完了＆保存", desc: "処理が完了したら、ブラウザ内で安全に即座にファイルをダウンロードします。" }
  ],
  zh: [
    { step: 1, title: "上传文件", desc: "将要处理的文档拖放至页面或点击选择文件。" },
    { step: 2, title: "配置选项", desc: "选择所需的处理模式和详细设置。" },
    { step: 3, title: "处理完成并保存", desc: "处理完成后，在浏览器中安全、即时下载新文件。" }
  ],
  "zh-TW": [
    { step: 1, title: "上傳檔案", desc: "將要處理的文件拖放至頁面或點擊選擇檔案。" },
    { step: 2, title: "配置選項", desc: "選擇所需的處理模式與詳細設定。" },
    { step: 3, title: "處理完成並儲存", desc: "處理完成後，在瀏覽器中安全、即時下載新檔案。" }
  ],
  es: [
    { step: 1, title: "Subir archivo", desc: "Arrastra y suelta tu documento o haz clic para seleccionarlo." },
    { step: 2, title: "Configurar opciones", desc: "Elige el modo de procesamiento y ajustes deseados." },
    { step: 3, title: "Procesar y descargar", desc: "Una vez procesado, descarga tu archivo de forma segura e instantánea." }
  ],
  fr: [
    { step: 1, title: "Téléverser le fichier", desc: "Glissez-déposez votre document ou cliquez pour parcourir." },
    { step: 2, title: "Configurer les options", desc: "Choisissez le mode de traitement et les réglages souhaités." },
    { step: 3, title: "Traiter et télécharger", desc: "Une fois terminé, téléchargez votre fichier en toute sécurité." }
  ],
  de: [
    { step: 1, title: "Datei hochladen", desc: "Ziehen Sie Ihr Dokument hierher oder klicken Sie zum Auswählen." },
    { step: 2, title: "Optionen anpassen", desc: "Wählen Sie den gewünschten Verarbeitungsmodus und die Einstellungen." },
    { step: 3, title: "Verarbeiten & Herunterladen", desc: "Laden Sie die fertige Datei nach der Verarbeitung sofort sicher herunter." }
  ],
  it: [
    { step: 1, title: "Carica file", desc: "Trascina e rilascia il documento o fai clic per selezionare." },
    { step: 2, title: "Configura opzioni", desc: "Scegli la modalità di elaborazione e le impostazioni desiderate." },
    { step: 3, title: "Elabora e scarica", desc: "Al termine, scarica subito il file completato in sicurezza." }
  ],
  pt: [
    { step: 1, title: "Enviar arquivo", desc: "Arraste e solte seu documento ou clique para selecionar." },
    { step: 2, title: "Configurar opções", desc: "Escolha o modo de processamento e os ajustes desejados." },
    { step: 3, title: "Processar e baixar", desc: "Após o processamento, baixe seu arquivo com total segurança." }
  ],
  ru: [
    { step: 1, title: "Загрузить файл", desc: "Перетащите документ или нажмите для выбора файла." },
    { step: 2, title: "Настроить параметры", desc: "Выберите нужный режим обработки и параметры." },
    { step: 3, title: "Обработать и скачать", desc: "После обработки скачайте готовый файл безопасно в браузере." }
  ],
  vi: [
    { step: 1, title: "Tải tệp lên", desc: "Kéo và thả tài liệu của bạn hoặc nhấp để chọn tệp." },
    { step: 2, title: "Cấu hình tùy chọn", desc: "Chọn chế độ xử lý và cài đặt mong muốn." },
    { step: 3, title: "Xử lý & Tải về", desc: "Sau khi xử lý xong, tải tệp hoàn thành về an toàn ngay lập tức." }
  ],
  th: [
    { step: 1, title: "อัปโหลดไฟล์", desc: "ลากและวางเอกสารของคุณหรือคลิกเพื่อเลือกไฟล์." },
    { step: 2, title: "กำหนดค่าตัวเลือก", desc: "เลือกโหมดการประมวลผลและการตั้งค่าที่คุณต้องการ." },
    { step: 3, title: "ประมวลผลและดาวน์โหลด", desc: "เมื่อเสร็จสิ้น ดาวน์โหลดไฟล์ใหม่ของคุณได้อย่างปลอดภัยทันที." }
  ],
  id: [
    { step: 1, title: "Unggah file", desc: "Seret dan lepas dokumen Anda atau klik untuk memilih file." },
    { step: 2, title: "Atur opsi", desc: "Pilih mode pemrosesan dan pengaturan yang diinginkan." },
    { step: 3, title: "Proses & Unduh", desc: "Setelah selesai, unduh file Anda dengan aman dan instan." }
  ],
  hi: [
    { step: 1, title: "फ़ाइल अपलोड करें", desc: "अपना दस्तावेज़ खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें।" },
    { step: 2, title: "विकल्प सेट करें", desc: "अपना इच्छित प्रसंस्करण मोड और सेटिंग्स चुनें।" },
    { step: 3, title: "प्रक्रिया और डाउनलोड", desc: "प्रक्रिया पूरी होने पर अपनी फ़ाइल सुरक्षित रूप से तुरंत डाउनलोड करें।" }
  ],
  ar: [
    { step: 1, title: "تحميل الملف", desc: "اسحب المستند وأفلته أو انقر لاختيار الملف." },
    { step: 2, title: "ضبط الخيارات", desc: "اختر وضع المعالجة والإعدادات المطلوبة." },
    { step: 3, title: "معالجة وتنزيل", desc: "بمجرد الانتهاء، قم بتنزيل ملفك بأمان على الفور." }
  ],
  tr: [
    { step: 1, title: "Dosya Yükle", desc: "Belgenizi sürükleyip bırakın veya seçmek için tıklayın." },
    { step: 2, title: "Seçenekleri Ayarla", desc: "İstediğiniz işlem modunu ve ayarları seçin." },
    { step: 3, title: "İşle ve İndir", desc: "İşlem bittiğinde tamamlanan dosyayı güvenle hemen indirin." }
  ],
  nl: [
    { step: 1, title: "Bestand uploaden", desc: "Sleep uw document hierheen of klik om een bestand te kiezen." },
    { step: 2, title: "Opties instellen", desc: "Kies de gewenste verwerkingsmodus en instellingen." },
    { step: 3, title: "Verwerken & Downloaden", desc: "Download uw voltooide bestand na verwerking veilig en direct." }
  ]
};

export const GENERIC_FAQS: Record<string, ToolFaqItem[]> = {
  ko: [
    { question: "업로드한 문서가 외부 서버로 유출될 위험은 없나요?", answer: "pdfpick는 100% 브라우저 로컬 메모리(WebAssembly) 안에서만 처리하므로 파일이 외부 서버로 전송되지 않아 완벽하게 안전합니다." },
    { question: "회원가입이나 유료 결제가 필요한가요?", answer: "아니요, 로그인이나 결제 없이 100% 무제한 무료로 모든 기능을 이용하실 수 있습니다." },
    { question: "스마트폰이나 태블릿에서도 사용할 수 있나요?", answer: "네! iOS, Android, 태블릿, PC 등 모든 최신 웹 브라우저에서 별도 프로그램 설치 없이 즉시 실행됩니다." },
    { question: "변환된 문서의 화질이나 서식이 깨지지 않나요?", answer: "원본 벡터 그래픽과 텍스트 레이아웃을 100% 보존하여 손실 없이 선명하게 변환됩니다." }
  ],
  en: [
    { question: "Is my document secure against server leakage?", answer: "pdfpick processes files 100% locally in your browser memory (WebAssembly). Documents are never uploaded to any external server." },
    { question: "Do I need to sign up or pay?", answer: "No, all features are 100% free with no registration or payment required." },
    { question: "Can I use this on mobile phones and tablets?", answer: "Yes! It works smoothly across smartphones (iOS/Android), tablets, and computers without installing any app." },
    { question: "Will the formatting or quality be degraded?", answer: "Original vector text, graphics, and layouts are 100% preserved with crystal clear output." }
  ],
  ja: [
    { question: "アップロードした文書が外部サーバーに漏洩する心配はありませんか？", answer: "pdfpickは100%ブラウザメモリ（WebAssembly）内でのみ処理するため、文書が外部サーバーに送信されることはなく完全に安全です。" },
    { question: "会員登録や有料課金は必要ですか？", answer: "いいえ、ログインや料金の支払いは一切不要で、完全無料で無制限にご利用いただけます。" },
    { question: "スマホやタブレットでも利用できますか？", answer: "はい！iOS、Android、タブレット、PCなど最新のウェブブラウザであればアプリのインストールなしでご利用いただけます。" },
    { question: "変換後のレイアウトや画質が崩れることはありませんか？", answer: "原本のベクターテキストや画像品質を100%保持するため、鮮明な仕上がりを維持します。" }
  ],
  zh: [
    { question: "上传的文档是否存在泄露到外部服务器的风险？", answer: "pdfpick 100% 在您的浏览器本地内存（WebAssembly）中处理，文档绝不会上传到外部服务器，绝对安全。" },
    { question: "需要注册账号或付费吗？", answer: "不需要，无需登录或付款，所有功能均完全免费无限制使用。" },
    { question: "可以在手机或平板上使用吗？", answer: "可以！支持 iOS、Android、平板及电脑上的所有现代浏览器，无需安装任何软件即可即时运行。" },
    { question: "转换后排版或画质会受损吗？", answer: "100% 保持原始矢量文字与图形排版，输出文件清晰无损。" }
  ],
  "zh-TW": [
    { question: "上傳的文件是否存在洩露到外部伺服器的風險？", answer: "pdfpick 100% 在您的瀏覽器本地記憶體（WebAssembly）中處理，文件絕不會上傳到外部伺服器，絕對安全。" },
    { question: "需要註冊帳號或付費嗎？", answer: "不需要，無需登入或付款，所有功能均完全免費無限制使用。" },
    { question: "可以在手機或平板上使用嗎？", answer: "可以！支援 iOS、Android、平板及電腦上的所有現代瀏覽器，無需安裝任何軟體即可即時運行。" },
    { question: "轉換後排版或畫質會受損嗎？", answer: "100% 保持原始向量文字與圖形排版，輸出檔案清晰無損。" }
  ],
  es: [
    { question: "¿Existe riesgo de fuga de datos a servidores externos?", answer: "pdfpick procesa archivos 100% localmente en la memoria de su navegador (WebAssembly). Ningún documento se sube a servidores externos." },
    { question: "¿Necesito registrarme o pagar?", answer: "No, todas las funciones son 100% gratuitas y sin necesidad de registro ni pago." },
    { question: "¿Puedo usarlo en teléfonos móviles y tabletas?", answer: "¡Sí! Funciona perfectamente en smartphones (iOS/Android), tabletas y ordenadores sin instalar aplicaciones." },
    { question: "¿Se pierde calidad o formato?", answer: "Los gráficos vectoriales y el formato original se conservan al 100% sin pérdida de calidad." }
  ],
  fr: [
    { question: "Y a-t-il un risque de fuite de documents sur un serveur externe ?", answer: "pdfpick traite les fichiers à 100% localement dans la mémoire de votre navigateur (WebAssembly). Aucun document n'est envoyé vers des serveurs distants." },
    { question: "Dois-je créer un compte ou payer ?", answer: "Non, toutes les fonctionnalités sont 100% gratuites, sans inscription ni paiement requis." },
    { question: "Puis-je l'utiliser sur smartphone et tablette ?", answer: "Oui ! Cela fonctionne parfaitement sur smartphone (iOS/Android), tablette et ordinateur sans installation." },
    { question: "La mise en page ou la qualité est-elle préservée ?", answer: "Le texte vectoriel et les mises en page d'origine sont préservés à 100% pour un résultat net." }
  ],
  de: [
    { question: "Besteht die Gefahr von Datenlecks auf externen Servern?", answer: "pdfpick verarbeitet Dateien zu 100% lokal im Arbeitsspeicher Ihres Browsers (WebAssembly). Keine Dokumente werden jemals auf externe Server übertragen." },
    { question: "Muss ich mich registrieren oder bezahlen?", answer: "Nein, alle Funktionen sind zu 100% kostenlos und ohne Anmeldung nutzbar." },
    { question: "Funktioniert dies auch auf Smartphones und Tablets?", answer: "Ja! Es läuft einwandfrei auf Smartphones (iOS/Android), Tablets und PCs, ohne dass eine App installiert werden muss." },
    { question: "Bleiben Formatierung und Qualität erhalten?", answer: "Vektortext und ursprüngliches Layout bleiben zu 100% gestochen scharf erhalten." }
  ]
};

export function getToolContent(toolSlug: string, lang: Language): ToolContentBundle {
  const toolData = TOOL_CONTENTS[toolSlug];
  const langKey = lang as string;

  if (toolData) {
    const localized = toolData[langKey] || toolData["en"] || toolData["ko"];
    const fallback = toolData["en"] || toolData["ko"];

    return {
      toolName: localized.toolName || fallback.toolName,
      tagline: localized.tagline || fallback.tagline,
      modes: localized.modes || fallback.modes,
      ui: { ...(fallback.ui || {}), ...(localized.ui || {}) },
      howToSteps: (localized.howToSteps && localized.howToSteps.length > 0) ? localized.howToSteps : fallback.howToSteps || [],
      deepGuide: localized.deepGuide || fallback.deepGuide,
      faqTitle: localized.faqTitle || fallback.faqTitle,
      faqSubtitle: localized.faqSubtitle || fallback.faqSubtitle,
      faqItems: (localized.faqItems && localized.faqItems.length > 0) ? localized.faqItems : fallback.faqItems || [],
    };
  }

  // Synthesize localized content for tools without dedicated JSON
  const trans = (translations as any)[langKey] || (translations as any)["en"] || (translations as any)["ko"];
  const toolKey = "tool_" + toolSlug.replace(/-/g, "_");
  const toolName = trans[toolKey] || toolSlug;
  const toolDesc = trans[toolKey + "_desc"] || "";

  const steps = GENERIC_STEPS[langKey] || GENERIC_STEPS["en"] || GENERIC_STEPS["ko"];
  const faqs = GENERIC_FAQS[langKey] || GENERIC_FAQS["en"] || GENERIC_FAQS["ko"];

  return {
    toolName,
    tagline: toolDesc,
    howToSteps: steps,
    faqTitle: trans.faq_title || "FAQ",
    faqSubtitle: trans.faq_subtitle || "",
    faqItems: faqs,
    ui: {},
  };
}
