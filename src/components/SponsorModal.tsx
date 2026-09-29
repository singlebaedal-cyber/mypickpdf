"use client";

import React, { useState } from "react";
import { X, Heart, Coffee, Copy, Check, Sparkles, ExternalLink, QrCode, Smartphone, CreditCard } from "lucide-react";
import RedPanda from "./RedPanda";
import { useLanguage } from "@/lib/i18n";

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SponsorModal({ isOpen, onClose }: SponsorModalProps) {
  const { t } = useLanguage();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<number>(3000);
  const [activeTab, setActiveTab] = useState<"easy" | "email">("easy");

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const getTierLabel = () => {
    if (selectedTier === 3000) return "☕ 시원한 아메리카노 1잔 (3,000원)";
    if (selectedTier === 5000) return "🍎 래서팬더 사과 바구니 (5,000원)";
    return "🚀 mypickpdf 무한 응원 (자유 금액)";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Graphic */}
        <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/15 hover:bg-black/25 text-white/90 hover:text-white transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-16 h-16 mx-auto mb-2.5 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <RedPanda mood="success" size={46} />
          </div>

          <h3 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>{t("sponsor_modal_title")}</span>
            <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
          </h3>
          <p className="text-xs text-orange-100 mt-1 font-medium leading-relaxed">
            {t("sponsor_modal_desc")}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-slate-800">
          {/* Interactive Donation Tier Cards */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              후원할 간식 선택 (원하시는 항목을 클릭해 보세요)
            </label>
            <div className="space-y-2">
              {/* Tier 1 */}
              <button
                type="button"
                onClick={() => setSelectedTier(3000)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  selectedTier === 3000
                    ? "bg-orange-50/90 border-orange-500 ring-2 ring-orange-400/40 shadow-sm"
                    : "bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">☕</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>시원한 아메리카노 1잔</span>
                      {selectedTier === 3000 && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-orange-500 text-white rounded-md font-extrabold">
                          선택됨
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500">열정 넘치는 개발자에게 카페인 충전</p>
                  </div>
                </div>
                <span className="text-xs font-black text-rose-600">3,000원</span>
              </button>

              {/* Tier 2 */}
              <button
                type="button"
                onClick={() => setSelectedTier(5000)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  selectedTier === 5000
                    ? "bg-rose-50/90 border-rose-500 ring-2 ring-rose-400/40 shadow-sm"
                    : "bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍎</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>래서팬더 사과 한 바구니</span>
                      {selectedTier === 5000 && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-rose-500 text-white rounded-md font-extrabold">
                          선택됨
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500">밤샘 작업하는 래서팬더 마스코트 특식</p>
                  </div>
                </div>
                <span className="text-xs font-black text-rose-600">5,000원</span>
              </button>

              {/* Tier 3 */}
              <button
                type="button"
                onClick={() => setSelectedTier(0)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  selectedTier === 0
                    ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/40 shadow-sm"
                    : "bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>mypickpdf 무한 응원</span>
                      {selectedTier === 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-white rounded-md font-extrabold">
                          선택됨
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500">서버 유지비 지원 및 평생 발전 후원</p>
                  </div>
                </div>
                <span className="text-xs font-black text-rose-600">자유 금액</span>
              </button>
            </div>
          </div>

          {/* Global Overseas & Credit Card / Apple Pay via Buy Me a Coffee */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50 to-rose-50 border-2 border-amber-300/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>글로벌 & 간편 카드 후원 (Buy Me a Coffee)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-900 font-extrabold">
                카드 / 애플페이
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-tight">
              해외 및 국내 모든 신용카드, 체크카드, 애플페이, 구글페이로 회원가입 없이 3초 만에 커피를 후원하실 수 있습니다.
            </p>

            <a
              href="https://www.buymeacoffee.com/fbihan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#FFDD00] hover:bg-[#FACC15] text-slate-900 font-black rounded-xl text-xs shadow-md shadow-amber-500/20 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Coffee className="w-4 h-4 text-slate-900 fill-slate-900" />
              <span>☕ Buy Me a Coffee로 커피 한 잔 후원하기</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Payment Guidance Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>국내 계좌 / 카카오페이 직접 후원 문의</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-semibold">
                수수료 0원
              </span>
            </div>

            {/* Quick Copy Contact Row */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] text-slate-400 block font-medium">공식 후원 / 계좌 문의 메일</span>
                <span className="font-mono font-black text-xs text-slate-800 truncate block">fbihan@naver.com</span>
              </div>
              <button
                onClick={() => handleCopy("fbihan@naver.com", "email")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                  copiedField === "email"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:scale-102"
                }`}
              >
                {copiedField === "email" ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>이메일 복사</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-slate-600 leading-relaxed bg-orange-50/70 p-2.5 rounded-xl border border-orange-100 space-y-1">
              <p className="font-semibold text-orange-950 flex items-center gap-1">
                <span>💡 국내 계좌이체 및 직접 후원 문의 안내</span>
              </p>
              <p className="text-slate-600">
                국내 은행 계좌이체 등 직접 후원을 희망하시는 경우 공식 후원 메일(<strong className="text-slate-800">fbihan@naver.com</strong>) 또는 우측 하단 AI 실시간 상담소에 남겨주시면 즉시 안내해 드립니다!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
