"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-lg hover:shadow-xl border border-slate-200/80 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-rose-500/40"
      aria-label={lang === "ko" ? "맨 위로 이동" : "Back to top"}
      title={lang === "ko" ? "맨 위로 이동" : "Back to top"}
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
