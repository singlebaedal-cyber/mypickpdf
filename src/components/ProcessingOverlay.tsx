"use client";

import { Loader2, Sparkles } from "lucide-react";
import AdBanner from "./AdBanner";
import RedPanda from "./RedPanda";
import { useLanguage } from "@/lib/i18n";

interface ProcessingOverlayProps {
  isProcessing: boolean;
  progress: number;
  message?: string;
}

export default function ProcessingOverlay({
  isProcessing,
  progress,
  message,
}: ProcessingOverlayProps) {
  const { t } = useLanguage();

  if (!isProcessing) return null;

  const displayMessage = message || t("processing_title");

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> {t("processing_badge")}
        </div>

        {/* Cute Loading Red Panda with circular progress ring */}
        <div className="mb-4 flex justify-center">
          <RedPanda
            mood="loading"
            size={120}
            withSpeechBubble="초고속으로 문서를 다듬고 있어요! 🐾"
          />
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-2">{displayMessage}</h3>
        <p className="text-xs text-slate-500 mb-6">
          {t("processing_desc")}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 mb-6">
          <div
            className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>
        <div className="text-xs font-extrabold text-slate-700 mb-4">{progress}% 완료</div>

        {/* High CTR Ad slot during processing */}
        <div className="border-t border-slate-100 pt-4">
          <AdBanner format="rectangle" className="my-2" />
        </div>
      </div>
    </div>
  );
}
