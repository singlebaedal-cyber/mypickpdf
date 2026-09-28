"use client";

import { useEffect } from "react";
import { SITE_CONFIG } from "@/lib/seo-config";

interface AdBannerProps {
  slotId?: string;
  format?: "auto" | "horizontal" | "rectangle" | "responsive";
  className?: string;
}

export default function AdBanner({ slotId = "0000000000", format = "auto", className = "" }: AdBannerProps) {
  const isProductionAd = SITE_CONFIG.googleAdSensePublisherId !== "ca-pub-XXXXXXXXXXXXXXXX";

  useEffect(() => {
    if (isProductionAd) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense push error", e);
      }
    }
  }, [isProductionAd]);

  return (
    <div className={`my-6 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
        광고 / ADVERTISEMENT
      </span>

      {isProductionAd ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client={SITE_CONFIG.googleAdSensePublisherId}
          {...(slotId && slotId !== "0000000000" ? { "data-ad-slot": slotId } : {})}
          data-ad-format={format === "responsive" ? "auto" : format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="w-full max-w-3xl min-h-[90px] p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Google AdSense 수익화 광고 최적화 영역
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-md">
            구글 애드센스 승인 후 게시자 ID와 슬롯 번호를 입력하면 이 자리에 반응형 고수익 광고가 자동으로 게재됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
