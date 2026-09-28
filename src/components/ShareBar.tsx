"use client";

import { useState } from "react";
import { Share2, Bookmark, Check, Sparkles } from "lucide-react";

export default function ShareBar() {
  const [copied, setCopied] = useState(false);
  const [bookmarkTip, setBookmarkTip] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "mypickpdf - 마이픽피디에프",
      text: "프로그램 설치 없이 브라우저에서 무료로 즐기는 PDF 합치기, 압축, 변환 올인원 툴!",
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
              친구·동료에게 추천하고 싶으신가요? 🐾
            </div>
            <div className="text-[11px] text-slate-500">
              링크 1초 복사 &amp; 즐겨찾기로 더 빠르게 이용하세요!
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
                <span>복사 완료! 🐾</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>카톡/링크 공유</span>
              </>
            )}
          </button>

          <div className="relative">
            <button
              onClick={handleBookmark}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-all duration-200 flex items-center gap-1.5 shadow-2xs hover:scale-105"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>즐겨찾기</span>
            </button>

            {bookmarkTip && (
              <div className="absolute bottom-full mb-2 right-0 sm:left-1/2 sm:-translate-x-1/2 w-64 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-50 text-center animate-in fade-in zoom-in-95">
                <div>키보드에서 <span className="font-bold text-amber-300">Ctrl + D</span> (맥: <span className="font-bold text-amber-300">Cmd + D</span>)를 누르면 바로 즐겨찾기에 추가됩니다!</div>
                <div className="absolute -bottom-1.5 right-6 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
