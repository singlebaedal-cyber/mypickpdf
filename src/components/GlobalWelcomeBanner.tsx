"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Globe, ShieldCheck, X } from "lucide-react";
import { useLanguage, Language } from "@/lib/i18n";

interface BannerLocale {
  title: string;
  desc: string;
  badgePrivacy: string;
}

const BANNER_LOCALES: Record<Language, BannerLocale> = {
  ko: {
    title: "100% 무료 & 보안 온라인 PDF 유틸리티",
    desc: "서버 업로드 없이 브라우저 로컬 메모리(Wasm)에서 안전하게 처리됩니다.",
    badgePrivacy: "서버 전송 0%",
  },
  en: {
    title: "100% Free & Private Online PDF Tools",
    desc: "Zero Server Upload: Processed 100% locally in your browser memory via WebAssembly. Your files never leave your device.",
    badgePrivacy: "🔒 Zero Server Upload",
  },
  fr: {
    title: "Outils PDF 100% Gratuits & Privés",
    desc: "Zéro Envoi Serveur : Vos fichiers sont traités 100% localement dans votre navigateur via WebAssembly.",
    badgePrivacy: "🔒 Zéro Envoi Serveur",
  },
  es: {
    title: "Herramientas PDF 100% Gratuitas y Privadas",
    desc: "Sin subida al servidor: todos sus archivos se procesan 100% localmente en el navegador mediante WebAssembly.",
    badgePrivacy: "🔒 Sin Subida al Servidor",
  },
  de: {
    title: "100% kostenlose & private PDF-Tools",
    desc: "Kein Server-Upload: Alle Dateien werden 100% lokal im Arbeitsspeicher Ihres Browsers verarbeitet.",
    badgePrivacy: "🔒 Kein Server-Upload",
  },
  ja: {
    title: "完全無料＆安全なオンラインPDFツール",
    desc: "サーバーへの送信ゼロ：すべてのファイルはWebAssemblyによりブラウザのローカルメモリ上で安全に処理されます。",
    badgePrivacy: "🔒 サーバー送信ゼロ",
  },
  zh: {
    title: "100% 免费且私密的在线 PDF 工具",
    desc: "零服务器上传：所有文件均在浏览器本地内存中通过 WebAssembly 安全处理，文件绝不离开您的设备。",
    badgePrivacy: "🔒 零服务器上传",
  },
  "zh-TW": {
    title: "100% 免費且高隱私的線上 PDF 工具",
    desc: "零伺服器上傳：所有檔案皆在瀏覽器本地記憶體透過 WebAssembly 處理，檔案絕不外流。",
    badgePrivacy: "🔒 零伺服器上傳",
  },
  it: {
    title: "Strumenti PDF 100% gratuiti e sicuri",
    desc: "Zero caricamenti sul server: tutti i file vengono elaborati localmente nel browser.",
    badgePrivacy: "🔒 Zero Invio a Server",
  },
  pt: {
    title: "Ferramentas de PDF 100% gratuitas e seguras",
    desc: "Zero envio para o servidor: todos os arquivos são processados localmente no seu navegador via WebAssembly.",
    badgePrivacy: "🔒 Zero Envio ao Servidor",
  },
  ru: {
    title: "100% бесплатные и безопасные PDF-инструменты",
    desc: "Без загрузки на сервер: все файлы обрабатываются локально в памяти вашего браузера с помощью WebAssembly.",
    badgePrivacy: "🔒 Без Отправки на Сервер",
  },
  vi: {
    title: "Công cụ PDF 100% miễn phí & bảo mật",
    desc: "Không tải lên máy chủ: Tất cả tệp được xử lý 100% cục bộ trong trình duyệt qua WebAssembly.",
    badgePrivacy: "🔒 Không Tải Lên Máy Chủ",
  },
  th: {
    title: "เครื่องมือ PDF ฟรี 100% และปลอดภัย",
    desc: "ไม่อัปโหลดไปยังเซิร์ฟเวอร์: ไฟล์ทั้งหมดได้รับการประมวลผลในเบ라우เซอร์ของคุณ 100%",
    badgePrivacy: "🔒 ไม่อัปโหลดไฟล์",
  },
  id: {
    title: "Alat PDF 100% gratis & aman",
    desc: "Tanpa unggah ke server: Semua berkas diproses 100% secara lokal di peramban Anda via WebAssembly.",
    badgePrivacy: "🔒 Tanpa Unggah ke Server",
  },
  hi: {
    title: "100% मुफ़्त और सुरक्षित ऑनलाइन PDF टूल्स",
    desc: "शून्य सर्वर अपलोड: आपकी फ़ाइलें ब्राउज़र की स्थानीय मेमोरी में WebAssembly द्वारा सुरक्षित प्रोसेस होती हैं।",
    badgePrivacy: "🔒 कोई सर्वर अपलोड नहीं",
  },
  ar: {
    title: "أدوات PDF مجانية وآمنة بنسبة 100%",
    desc: "بدون رفع إلى الخادم: تتم معالجة جميع الملفات محليًا في ذاكرة المتصفح بأمان تام عبر WebAssembly.",
    badgePrivacy: "🔒 بدون رفع إلى الخادم",
  },
  tr: {
    title: "%100 ücretsiz ve güvenli çevrim içi PDF araçları",
    desc: "Sunucuya yükleme yok: Tüm dosyalar tarayıcınızın yerel belleğinde WebAssembly ile işlenir.",
    badgePrivacy: "🔒 Sıfır Sunucu Yüklemesi",
  },
  nl: {
    title: "100% gratis & veilige online PDF-tools",
    desc: "Geen server-upload: alle bestanden worden 100% lokaal in uw browser verwerkt via WebAssembly.",
    badgePrivacy: "🔒 Geen Server-Upload",
  },
};

export default function GlobalWelcomeBanner() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Only show on home page for non-Korean users who haven't dismissed it
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("pdfpick_welcome_dismissed") === "1";
      if (!isDismissed && lang !== "ko" && pathname === "/") {
        setDismissed(false);
      } else {
        setDismissed(true);
      }
    }
  }, [lang, pathname]);

  // Don't render on non-home pages, for Korean users, or when dismissed
  if (dismissed || lang === "ko" || pathname !== "/") {
    return null;
  }

  const locale = BANNER_LOCALES[lang] || BANNER_LOCALES.en;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pdfpick_welcome_dismissed", "1");
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white border-b border-rose-500/20 py-2 sm:py-2.5 px-3 sm:px-6 z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Global Trust Signals (Single clean line) */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0 text-rose-300">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
            <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight shrink-0">
              {locale.title}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-3 h-3" />
              {locale.badgePrivacy}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 truncate">
              {locale.desc}
            </span>
          </div>
        </div>

        {/* Right: Only Dismiss Button (No duplicate language selector) */}
        <div className="flex items-center shrink-0">
          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Dismiss banner"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
