"use client";

import { useState, useEffect } from "react";
import { Download, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function PwaInstallPrompt() {
  const { lang } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Register PWA service worker for offline capabilities
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker.register("/sw.js").catch(() => {});
        });
      }

      // Check if dismissed in this session
      const dismissed = sessionStorage.getItem("pdfpick_pwa_dismissed") === "1";
      if (dismissed) {
        setIsDismissed(true);
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
      });

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pdfpick_pwa_dismissed", "1");
    }
  };

  if (!deferredPrompt || isDismissed || isInstalled) {
    return null;
  }

  const titleText =
    lang === "ko"
      ? "pdfpick 앱을 설치하여 데스크톱/모바일에서 더 빠르게 사용하세요!"
      : "Install pdfpick app for faster offline and desktop access!";
  const btnText = lang === "ko" ? "앱 설치하기" : "Install App";

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 animate-bounce" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold truncate text-white">{btnText}</p>
          <p className="text-[11px] text-slate-300 line-clamp-1">{titleText}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs active:scale-95"
        >
          {btnText}
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
