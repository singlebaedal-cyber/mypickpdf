"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ArrowRight, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { TOOLS_REGISTRY, ToolDefinition } from "@/lib/tools-registry";

export default function RecentToolsBar() {
  const { t, lang } = useLanguage();
  const [recentTools, setRecentTools] = useState<ToolDefinition[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("pdfpick_recent_tools");
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        const matched = ids
          .map((id) => TOOLS_REGISTRY.find((tool) => tool.id === id))
          .filter((t): t is ToolDefinition => Boolean(t));
        setRecentTools(matched);
      }
    } catch (e) {}
  }, []);

  const handleClear = () => {
    try {
      localStorage.removeItem("pdfpick_recent_tools");
      setRecentTools([]);
    } catch (e) {}
  };

  if (!mounted || recentTools.length === 0) return null;

  const barTitle = lang === "ko" ? "최근 사용한 도구" : "Recently Used Tools";

  return (
    <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/90 shadow-2xs">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Clock className="w-3.5 h-3.5 text-rose-500" />
          <span>{barTitle}</span>
        </div>
        <button
          onClick={handleClear}
          className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-0.5"
          title={lang === "ko" ? "최근 기록 지우기" : "Clear recent history"}
        >
          <X className="w-3 h-3" />
          <span>{lang === "ko" ? "지우기" : "Clear"}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {recentTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold border border-slate-200/60 hover:border-rose-200 transition-colors shrink-0 group"
          >
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${tool.colorLight}`}>
              <tool.icon className="w-3 h-3" />
            </div>
            <span>{t(tool.titleKey)}</span>
            <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
