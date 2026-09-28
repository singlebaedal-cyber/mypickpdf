"use client";

import { useState } from "react";
import { Share2, Bookmark, Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function ShareBar() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [bookmarkTip, setBookmarkTip] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "mypickpdf",
      text: t("home_hero_desc"),
      url: "https://mypickpdf.vercel.app",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if user cancelled or failed
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://mypickpdf.vercel.app");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleBookmark = () => {
    setBookmarkTip(true);
    setTimeout(() => setBookmarkTip(false), 4000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-3">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-rose-500 shadow-2xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-800">
              {t("share_title")}
            </div>
            <div className="text-[11px] text-slate-500">
              {t("share_desc")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-xs ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 hover:bg-rose-700 text-white hover:scale-105"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t("share_copied")}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{t("share_btn")}</span>
              </>
            )}
          </button>

          <div className="relative">
            <button
              onClick={handleBookmark}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-all duration-200 flex items-center gap-1.5 shadow-2xs hover:scale-105"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>{t("share_bookmark")}</span>
            </button>

            {bookmarkTip && (
              <div className="absolute bottom-full mb-2 right-0 sm:left-1/2 sm:-translate-x-1/2 w-64 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-50 text-center animate-in fade-in zoom-in-95">
                <div>{t("share_bookmark_tip")}</div>
                <div className="absolute -bottom-1.5 right-6 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
