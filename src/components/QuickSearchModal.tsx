"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Command } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { TOOLS_REGISTRY, ToolDefinition } from "@/lib/tools-registry";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K and Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter tools based on query
  const filteredTools = TOOLS_REGISTRY.filter((tool) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const title = t(tool.titleKey).toLowerCase();
    const desc = t(tool.descKey).toLowerCase();
    const matchesTitle = title.includes(q);
    const matchesDesc = desc.includes(q);
    const matchesKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
    const matchesId = tool.id.toLowerCase().includes(q);
    return matchesTitle || matchesDesc || matchesKeywords || matchesId;
  });

  const handleSelectTool = (tool: ToolDefinition) => {
    // Record in recent tools
    try {
      const recent = JSON.parse(localStorage.getItem("pdfpick_recent_tools") || "[]");
      const updated = [tool.id, ...recent.filter((id: string) => id !== tool.id)].slice(0, 5);
      localStorage.setItem("pdfpick_recent_tools", JSON.stringify(updated));
    } catch (e) {}

    onClose();
    router.push(tool.href);
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === "Enter" && filteredTools.length > 0) {
      e.preventDefault();
      handleSelectTool(filteredTools[selectedIndex] || filteredTools[0]);
    }
  };

  if (!isOpen) return null;

  const placeholderText =
    lang === "ko"
      ? "도구 검색... (예: 합치기, 압축, 워드, 서명, 회전)"
      : "Search tools... (e.g. merge, compress, edit, convert)";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-rose-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInInput}
            placeholder={placeholderText}
            className="flex-1 text-sm sm:text-base font-semibold text-slate-800 placeholder-slate-400 bg-transparent outline-none"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-bold">
              <Command className="w-3 h-3" /> K
            </span>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">
                {lang === "ko" ? "일치하는 도구가 없습니다" : "No matching tools found"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === "ko" ? "다른 검색어로 찾아보세요" : "Try searching with different keywords"}
              </p>
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                    isSelected
                      ? "bg-rose-50 text-rose-900 shadow-2xs border border-rose-100"
                      : "hover:bg-slate-50 text-slate-700 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? `bg-gradient-to-tr ${tool.colorGradient} text-white shadow-xs`
                          : tool.colorLight
                      }`}
                    >
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 truncate">
                          {t(tool.titleKey)}
                        </span>
                        {tool.badge && (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-600 text-[10px] font-extrabold shrink-0">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {t(tool.descKey)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isSelected ? (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                        <span>{lang === "ko" ? "열기" : "Open"}</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
          <div className="flex items-center gap-3">
            <span>↑↓ {lang === "ko" ? "탐색" : "Navigate"}</span>
            <span>↵ {lang === "ko" ? "선택" : "Select"}</span>
            <span>Esc {lang === "ko" ? "닫기" : "Close"}</span>
          </div>
          <span className="text-rose-500 font-bold">100% In-Browser Private</span>
        </div>
      </div>
    </div>
  );
}
