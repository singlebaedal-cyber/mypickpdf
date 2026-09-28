"use client";

import React from "react";

export type RedPandaMood = 
  | "welcome" 
  | "working" 
  | "success" 
  | "avatar" 
  | "compress"
  | "loading"
  | "ready"
  | "hooray"
  | "thinking"
  | "error";

interface RedPandaProps {
  mood?: RedPandaMood;
  size?: number | string;
  className?: string;
  withSpeechBubble?: string;
}

export default function RedPanda({
  mood = "welcome",
  size = 120,
  className = "",
  withSpeechBubble,
}: RedPandaProps) {
  const pixelSize = typeof size === "number" ? `${size}px` : size;

  // New Image-based Mascot States from User Asset Kit

  // A. Loading State (Circular Progress Ring Pandy - for waiting / uploading / converting)
  if (mood === "loading") {
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        {withSpeechBubble && (
          <div className="relative mb-3 px-4 py-1.5 bg-white text-rose-600 rounded-2xl text-xs font-black shadow-lg border border-rose-100 flex items-center gap-1.5 animate-bounce">
            <span>🐾</span>
            <span>{withSpeechBubble}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
          </div>
        )}
        <div 
          className="relative flex items-center justify-center"
          style={{ width: pixelSize, height: pixelSize }}
        >
          {/* Subtle spinning aura */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-400/20 via-orange-300/20 to-teal-400/20 animate-spin blur-xs" />
          <img
            src="/mascot/mascot_loading.png"
            alt="문서 처리 중인 래서팬더"
            className="w-full h-full object-contain relative z-10 animate-pulse drop-shadow-md"
          />
        </div>
      </div>
    );
  }

  // B. Action Ready State (Friendly Waving with Sparkle - when files are attached & waiting for user click)
  if (mood === "ready") {
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        {withSpeechBubble && (
          <div className="relative mb-2.5 px-3.5 py-1.5 bg-white text-slate-800 rounded-2xl text-xs font-bold shadow-md border border-orange-100 flex items-center gap-1.5 animate-in fade-in">
            <span className="text-orange-500 font-black">🐾</span>
            <span>{withSpeechBubble}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
          </div>
        )}
        <div 
          className="hover:scale-105 transition-transform duration-200 cursor-pointer"
          style={{ width: pixelSize, height: pixelSize }}
        >
          <img
            src="/mascot/mascot_ready.png"
            alt="준비 완료된 래서팬더"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>
    );
  }

  // C. Hooray / Complete Celebration State (Arms up with Confetti - for completed action/download)
  if (mood === "hooray") {
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        {withSpeechBubble && (
          <div className="relative mb-3 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-200 flex items-center gap-1.5 animate-bounce">
            <span>🎉</span>
            <span>{withSpeechBubble}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-emerald-500" />
          </div>
        )}
        <div 
          className="animate-in zoom-in-95 duration-300 hover:scale-105 transition-transform"
          style={{ width: pixelSize, height: pixelSize }}
        >
          <img
            src="/mascot/mascot_hooray.png"
            alt="축하하는 래서팬더"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
      </div>
    );
  }

  // D. Success State (Pointing with Star)
  if (mood === "success") {
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        {withSpeechBubble && (
          <div className="relative mb-2.5 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md shadow-emerald-200 flex items-center gap-1.5 animate-bounce">
            <span>🌟</span>
            <span>{withSpeechBubble}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-emerald-500" />
          </div>
        )}
        <div 
          className="hover:scale-105 transition-transform"
          style={{ width: pixelSize, height: pixelSize }}
        >
          <img
            src="/mascot/mascot_success.png"
            alt="성공한 래서팬더"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>
    );
  }

  // E. Thinking State (Finger to Chin - for option selection)
  if (mood === "thinking") {
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        {withSpeechBubble && (
          <div className="relative mb-2 px-3 py-1 bg-white text-slate-700 rounded-xl text-xs font-bold shadow-sm border border-slate-200 flex items-center gap-1">
            <span>🤔</span>
            <span>{withSpeechBubble}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
          </div>
        )}
        <div style={{ width: pixelSize, height: pixelSize }}>
          <img
            src="/mascot/mascot_thinking.png"
            alt="고민하는 래서팬더"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
      </div>
    );
  }

  // F. Error State (With computer & red X)
  if (mood === "error") {
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        {withSpeechBubble && (
          <div className="relative mb-2 px-3 py-1 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 flex items-center gap-1">
            <span>⚠️</span>
            <span>{withSpeechBubble}</span>
          </div>
        )}
        <div style={{ width: pixelSize, height: pixelSize }}>
          <img
            src="/mascot/mascot_error.png"
            alt="오류 상태 래서팬더"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
      </div>
    );
  }

  // 1. Avatar (Navbar & Small Icons)
  if (mood === "avatar") {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          {/* Ears */}
          <path d="M 18,34 Q 10,8 36,18 Z" fill="#D9531E" stroke="#B83808" strokeWidth="2.5" />
          <path d="M 22,30 Q 17,14 32,22 Z" fill="#FFF2E8" />
          
          <path d="M 82,34 Q 90,8 64,18 Z" fill="#D9531E" stroke="#B83808" strokeWidth="2.5" />
          <path d="M 78,30 Q 83,14 68,22 Z" fill="#FFF2E8" />

          {/* Head Base */}
          <ellipse cx="50" cy="56" rx="38" ry="34" fill="#E85D26" stroke="#B83808" strokeWidth="2.5" />

          {/* White Cheek Tufts */}
          <path d="M 12,58 Q 20,68 28,64 Q 16,50 18,44 Z" fill="#FFFFFF" />
          <path d="M 88,58 Q 80,68 72,64 Q 84,50 82,44 Z" fill="#FFFFFF" />

          {/* White Brow Markings */}
          <ellipse cx="36" cy="38" rx="5" ry="4" fill="#FFFFFF" />
          <ellipse cx="64" cy="38" rx="5" ry="4" fill="#FFFFFF" />

          {/* Eyes */}
          <circle cx="37" cy="52" r="5.5" fill="#261208" />
          <circle cx="39" cy="50" r="2" fill="#FFFFFF" />
          <circle cx="63" cy="52" r="5.5" fill="#261208" />
          <circle cx="65" cy="50" r="2" fill="#FFFFFF" />

          {/* White Muzzle */}
          <ellipse cx="50" cy="67" rx="14" ry="10" fill="#FFFFFF" />

          {/* Cute Nose */}
          <path d="M 47,62 L 53,62 L 50,66 Z" fill="#261208" />

          {/* Smile */}
          <path d="M 46,68 Q 50,72 54,68" fill="none" stroke="#261208" strokeWidth="2" strokeLinecap="round" />

          {/* Rosy Blushing Cheeks */}
          <ellipse cx="26" cy="62" rx="4.5" ry="3" fill="#FF8A8A" opacity="0.7" />
          <ellipse cx="74" cy="62" rx="4.5" ry="3" fill="#FF8A8A" opacity="0.7" />
        </svg>
      </div>
    );
  }

  // 2. Working (Processing Overlay / Busy sorting papers)
  if (mood === "working") {
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        {withSpeechBubble && (
          <div className="mb-2 px-3.5 py-1.5 bg-white text-rose-600 rounded-2xl text-xs font-black shadow-lg border border-rose-100 animate-bounce">
            {withSpeechBubble}
          </div>
        )}
        <div style={{ width: pixelSize, height: pixelSize }}>
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Bushy Striped Tail */}
            <path d="M 120,110 Q 155,90 148,60 Q 130,55 118,85 Z" fill="#D9531E" />
            <path d="M 132,70 Q 142,65 140,78 Z" fill="#8C2C05" />
            <path d="M 124,88 Q 134,83 130,95 Z" fill="#8C2C05" />

            {/* Body */}
            <ellipse cx="80" cy="115" rx="36" ry="32" fill="#2E1810" />
            <ellipse cx="80" cy="118" rx="20" ry="22" fill="#3D2015" />

            {/* Ears */}
            <path d="M 44,48 Q 28,14 64,28 Z" fill="#D9531E" stroke="#A83005" strokeWidth="3" />
            <path d="M 50,44 Q 40,24 58,34 Z" fill="#FFF2E8" />
            <path d="M 116,48 Q 132,14 96,28 Z" fill="#D9531E" stroke="#A83005" strokeWidth="3" />
            <path d="M 110,44 Q 120,24 102,34 Z" fill="#FFF2E8" />

            {/* Head */}
            <ellipse cx="80" cy="68" rx="46" ry="40" fill="#E85D26" stroke="#A83005" strokeWidth="3" />

            {/* White Face Markings */}
            <path d="M 38,72 Q 48,84 56,80 Q 42,62 44,56 Z" fill="#FFFFFF" />
            <path d="M 122,72 Q 112,84 104,80 Q 118,62 116,56 Z" fill="#FFFFFF" />
            <ellipse cx="64" cy="48" rx="6" ry="5" fill="#FFFFFF" />
            <ellipse cx="96" cy="48" rx="6" ry="5" fill="#FFFFFF" />

            {/* Cute Glasses */}
            <circle cx="65" cy="66" r="11" fill="none" stroke="#261208" strokeWidth="2.5" />
            <circle cx="95" cy="66" r="11" fill="none" stroke="#261208" strokeWidth="2.5" />
            <line x1="76" y1="66" x2="84" y2="66" stroke="#261208" strokeWidth="2.5" />

            {/* Eyes with focus sparkle */}
            <circle cx="66" cy="66" r="5" fill="#261208" />
            <circle cx="68" cy="64" r="2" fill="#FFFFFF" />
            <circle cx="94" cy="66" r="5" fill="#261208" />
            <circle cx="96" cy="64" r="2" fill="#FFFFFF" />

            {/* Muzzle */}
            <ellipse cx="80" cy="80" rx="16" ry="12" fill="#FFFFFF" />
            <path d="M 76,75 L 84,75 L 80,79 Z" fill="#261208" />
            <path d="M 77,81 Q 80,84 83,81" fill="none" stroke="#261208" strokeWidth="2" strokeLinecap="round" />

            {/* Cheeks */}
            <ellipse cx="50" cy="76" rx="5" ry="3.5" fill="#FF8A8A" opacity="0.8" />
            <ellipse cx="110" cy="76" rx="5" ry="3.5" fill="#FF8A8A" opacity="0.8" />

            {/* Paws holding a paper document */}
            <rect x="58" y="98" width="44" height="42" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" transform="rotate(-4 80 120)" />
            <path d="M 66,108 L 94,108 M 66,116 L 94,116 M 66,124 L 84,124" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
            {/* Paws */}
            <ellipse cx="58" cy="116" rx="9" ry="8" fill="#1C0E07" />
            <ellipse cx="102" cy="116" rx="9" ry="8" fill="#1C0E07" />
          </svg>
        </div>
      </div>
    );
  }

  // 3. Welcome / Default (Hero & General Placement, Waving Mascot)
  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {withSpeechBubble && (
        <div className="relative mb-3 px-4 py-2 bg-white text-slate-800 rounded-2xl text-xs sm:text-sm font-bold shadow-xl border border-rose-100 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-1">
          <span className="text-rose-500 font-black">🐾</span>
          <span>{withSpeechBubble}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
        </div>
      )}
      <div 
        className="hover:scale-105 transition-transform duration-300 cursor-pointer"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <img
          src="/mascot/mascot_ready.png"
          alt="마이픽 래서팬더"
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>
    </div>
  );
}
