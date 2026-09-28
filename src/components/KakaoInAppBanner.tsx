"use client";

import { useEffect, useState } from "react";
import { Globe, X } from "lucide-react";

export default function KakaoInAppBanner() {
  const [isKakao, setIsKakao] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || "";
      if (/KAKAOTALK/i.test(ua)) {
        setIsKakao(true);
      }
    }
  }, []);

  if (!isKakao || isDismissed) return null;

  const handleOpenExternal = () => {
    if (typeof window !== "undefined") {
      window.location.href =
        "kakaotalk://web/openExternal?url=" + encodeURIComponent(window.location.href);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2.5 text-xs text-amber-950 flex items-center justify-between gap-2 shadow-xs sticky top-0 z-50 animate-in fade-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm shrink-0">💬</span>
        <div className="truncate">
          <span className="font-bold">카카오톡 접속 감지: </span>
          <span className="text-amber-900">
            원활한 파일 다운로드를 위해 크롬이나 기본 인터넷 브라우저 사용을 권장합니다.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleOpenExternal}
          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs active:scale-95"
        >
          <Globe className="w-3 h-3" />
          <span>크롬으로 열기</span>
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 hover:bg-amber-200/60 rounded text-amber-700 transition-colors"
          aria-label="닫기"
          title="안내 닫기"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
