"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { 
  FileText, 
  Files, 
  Split, 
  Image as ImageIcon, 
  RotateCw, 
  FileSearch, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronDown,
  Globe,
  ArrowRightLeft,
  ArrowRight,
  Check,
  FileSpreadsheet,
  Presentation,
  Code2,
  Archive,
  Minimize2,
  Hash,
  Shield,
  Video,
  Sparkles,
  BookOpen,
  PenTool,
  Languages,
  Search,
  Command
} from "lucide-react";
import { useLanguage, LANGUAGES } from "@/lib/i18n";
import RedPanda from "@/components/RedPanda";
import QuickSearchModal from "@/components/QuickSearchModal";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const convertRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  const convertTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toolsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const langTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleConvertEnter = () => {
    if (convertTimeoutRef.current) clearTimeout(convertTimeoutRef.current);
    if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    setToolsDropdownOpen(false);
    setLangDropdownOpen(false);
    setConvertDropdownOpen(true);
  };
  const handleConvertLeave = () => {
    convertTimeoutRef.current = setTimeout(() => {
      setConvertDropdownOpen(false);
    }, 150);
  };

  const handleToolsEnter = () => {
    if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
    if (convertTimeoutRef.current) clearTimeout(convertTimeoutRef.current);
    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    setConvertDropdownOpen(false);
    setLangDropdownOpen(false);
    setToolsDropdownOpen(true);
  };
  const handleToolsLeave = () => {
    toolsTimeoutRef.current = setTimeout(() => {
      setToolsDropdownOpen(false);
    }, 150);
  };

  const handleLangEnter = () => {
    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    if (convertTimeoutRef.current) clearTimeout(convertTimeoutRef.current);
    if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
    setConvertDropdownOpen(false);
    setToolsDropdownOpen(false);
    setLangDropdownOpen(true);
  };
  const handleLangLeave = () => {
    langTimeoutRef.current = setTimeout(() => {
      setLangDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (convertRef.current && !convertRef.current.contains(event.target as Node)) {
        setConvertDropdownOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (convertTimeoutRef.current) clearTimeout(convertTimeoutRef.current);
      if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
      if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    };
  }, []);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const coreEditTools = [
    { name: t("tool_edit"), href: "/edit-pdf", icon: PenTool, color: "text-rose-600 bg-rose-50" },
    { name: t("tool_translate"), href: "/translate-pdf", icon: Languages, color: "text-blue-600 bg-blue-50" },
    { name: t("tool_merge"), href: "/merge-pdf", icon: Files, color: "text-rose-600 bg-rose-50" },
    { name: t("tool_split"), href: "/split-pdf", icon: Split, color: "text-amber-600 bg-amber-50" },
    { name: t("tool_compress"), href: "/compress-pdf", icon: Minimize2, color: "text-emerald-600 bg-emerald-50" },
    { name: t("tool_rotate"), href: "/rotate-pdf", icon: RotateCw, color: "text-purple-600 bg-purple-50" },
    { name: t("tool_ocr"), href: "/ocr-pdf", icon: FileSearch, color: "text-cyan-600 bg-cyan-50" },
    { name: t("tool_page_numbers"), href: "/add-page-numbers", icon: Hash, color: "text-indigo-600 bg-indigo-50" },
    { name: t("tool_watermark"), href: "/add-watermark", icon: Shield, color: "text-rose-600 bg-rose-50" },
  ];

  const toPdfTools = [
    { name: t("tool_img_to_pdf"), href: "/image-to-pdf", icon: ImageIcon, color: "text-amber-500 bg-amber-50" },
    { name: t("tool_word_to_pdf"), href: "/word-to-pdf", icon: FileText, color: "text-blue-600 bg-blue-50" },
    { name: t("tool_ppt_to_pdf"), href: "/powerpoint-to-pdf", icon: Presentation, color: "text-orange-600 bg-orange-50" },
    { name: t("tool_excel_to_pdf"), href: "/excel-to-pdf", icon: FileSpreadsheet, color: "text-emerald-600 bg-emerald-50" },
    { name: t("tool_html_to_pdf"), href: "/html-to-pdf", icon: Code2, color: "text-amber-600 bg-amber-50" },
  ];

  const fromPdfTools = [
    { name: t("tool_pdf_to_hwp"), href: "/pdf-to-hwp", icon: FileText, color: "text-blue-600 bg-blue-50" },
    { name: t("tool_pdf_to_img"), href: "/pdf-to-image", icon: ImageIcon, color: "text-amber-500 bg-amber-50" },
    { name: t("tool_pdf_to_word"), href: "/pdf-to-word", icon: FileText, color: "text-blue-600 bg-blue-50" },
    { name: t("tool_pdf_to_ppt"), href: "/pdf-to-powerpoint", icon: Presentation, color: "text-orange-600 bg-orange-50" },
    { name: t("tool_pdf_to_excel"), href: "/pdf-to-excel", icon: FileSpreadsheet, color: "text-emerald-600 bg-emerald-50" },
    { name: t("tool_pdf_to_pdfa"), href: "/pdf-to-pdfa", icon: Archive, color: "text-indigo-600 bg-indigo-50" },
  ];

  const mediaTools = [
    { name: t("tool_compress_video"), href: "/compress-video", icon: Video, color: "text-purple-600 bg-purple-50" },
    { name: t("tool_video_to_gif"), href: "/video-to-gif", icon: Sparkles, color: "text-pink-600 bg-pink-50" },
  ];

  const allTools = [
    ...coreEditTools,
    ...mediaTools,
    ...toPdfTools,
    ...fromPdfTools,
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-orange-50 to-amber-100 border border-orange-200/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <RedPanda mood="avatar" size={28} />
            </div>
            <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 flex items-center">
              pdf<span className="text-orange-500">pick</span>
              <span className="ml-1 text-xs">🐾</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 ml-6">
            {/* Preserved in semantic DOM for SEO crawlers (Google, Naver) without visual clutter */}
            <div className="sr-only">
              <Link href="/merge-pdf">{t("tool_merge")}</Link>
              <Link href="/split-pdf">{t("tool_split")}</Link>
            </div>

            {/* Direct core tools */}
            <Link
              href="/compress-pdf"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-rose-600 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {t("tool_compress")}
            </Link>
            <Link
              href="/compress-video"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-1.5"
            >
              <Video className="w-4 h-4 text-purple-600" />
              <span>{t("tool_compress_video")}</span>
            </Link>

            {/* PDF 변환 Mega Dropdown (2-Column) - Hover & Click Supported */}
            <div 
              className="relative" 
              ref={convertRef}
              onMouseEnter={handleConvertEnter}
              onMouseLeave={handleConvertLeave}
            >
              <button
                onClick={() => {
                  setConvertDropdownOpen(!convertDropdownOpen);
                  setToolsDropdownOpen(false);
                  setLangDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-xl transition-colors ${
                  convertDropdownOpen ? "bg-rose-50 text-rose-600" : "text-slate-700 hover:text-rose-600 hover:bg-slate-50"
                }`}
              >
                <ArrowRightLeft className="w-4 h-4 text-rose-600" />
                <span>{t("nav_convert_pdf")}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${convertDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {convertDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[540px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 grid grid-cols-2 gap-6 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* Left Column: PDF로 변환 (5 Tools) */}
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-rose-600 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>{t("nav_to_pdf")}</span>
                    </div>
                    <div className="space-y-1">
                      {toPdfTools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setConvertDropdownOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className={`w-7 h-7 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}>
                            <tool.icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-rose-600">
                            {tool.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: PDF에서 변환 (5 Tools) */}
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t("nav_from_pdf")}</span>
                    </div>
                    <div className="space-y-1">
                      {fromPdfTools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setConvertDropdownOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className={`w-7 h-7 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}>
                            <tool.icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-rose-600">
                            {tool.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 모든 PDF 도구 3열 Mega Dropdown (스크롤 없이 한번에 3열로 정렬) - Hover & Click Supported */}
            <div 
              ref={toolsRef}
              onMouseEnter={handleToolsEnter}
              onMouseLeave={handleToolsLeave}
            >
              <button
                onClick={() => {
                  setToolsDropdownOpen(!toolsDropdownOpen);
                  setConvertDropdownOpen(false);
                  setLangDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-xl transition-colors ${
                  toolsDropdownOpen ? "bg-rose-50 text-rose-600" : "text-slate-700 hover:text-rose-600 hover:bg-slate-50"
                }`}
              >
                <span>{t("nav_all_tools")}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute right-4 sm:right-6 lg:right-8 top-full mt-1 w-[760px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 grid grid-cols-3 gap-5 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* Column 1: PDF 편집 도구 (5 tools) */}
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <Files className="w-3.5 h-3.5 text-rose-600" />
                      <span>{t("nav_core_tools")}</span>
                    </div>
                    <div className="space-y-1">
                      {coreEditTools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setToolsDropdownOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className={`w-7 h-7 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}>
                            <tool.icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-rose-600">
                            {tool.name}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Media Tools */}
                    <div className="text-xs font-black uppercase tracking-wider text-purple-600 mb-2 mt-4 flex items-center gap-1.5 pb-1.5 border-b border-purple-100">
                      <Video className="w-3.5 h-3.5 text-purple-600" />
                      <span>{t("nav_media_tools")}</span>
                    </div>
                    <div className="space-y-1">
                      {mediaTools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setToolsDropdownOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-purple-50 transition-colors group"
                        >
                          <div className={`w-7 h-7 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}>
                            <tool.icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-purple-600">
                            {tool.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: PDF로 변환 (5 tools) */}
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-rose-600 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>{t("nav_to_pdf")}</span>
                    </div>
                    <div className="space-y-1">
                      {toPdfTools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setToolsDropdownOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className={`w-7 h-7 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}>
                            <tool.icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-rose-600">
                            {tool.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: PDF에서 변환 (5 tools) */}
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t("nav_from_pdf")}</span>
                    </div>
                    <div className="space-y-1">
                      {fromPdfTools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setToolsDropdownOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className={`w-7 h-7 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}>
                            <tool.icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-rose-600">
                            {tool.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guides & Tips Link */}
            <Link
              href="/guides"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-orange-600 rounded-xl hover:bg-orange-50/60 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-orange-500" />
              <span>{t("nav_guides")}</span>
            </Link>
          </nav>

          {/* Right Actions: Search & Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Tool Search Button (Ctrl+K) */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-slate-700 transition-colors border border-slate-200/60 text-xs font-bold shrink-0 shadow-2xs group"
              aria-label={lang === "ko" ? "도구 빠른 검색 (Ctrl+K)" : "Quick Tool Search (Ctrl+K)"}
              title={lang === "ko" ? "도구 빠른 검색 (Ctrl+K)" : "Quick Tool Search (Ctrl+K)"}
            >
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600 transition-colors" />
              <span className="hidden sm:inline text-slate-600 font-semibold">
                {lang === "ko" ? "도구 검색" : "Search"}
              </span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-400 font-mono border border-slate-200/80 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Language Switcher Dropdown */}
            <div 
              className="relative" 
              ref={langRef}
              onMouseEnter={handleLangEnter}
              onMouseLeave={handleLangLeave}
            >
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setToolsDropdownOpen(false);
                  setConvertDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-slate-700 transition-colors border border-slate-200/60 flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-2xs"
                aria-label="언어 선택 (Select Language)"
                title="언어 선택 (Select Language)"
              >
                <span className="text-sm leading-none">{currentLangObj.flag}</span>
                <span className="font-extrabold text-[11px] sm:text-xs text-slate-800 tracking-wider">{currentLangObj.initial}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[580px] max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 sm:p-5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                        Select Language
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      18 Languages
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                    {LANGUAGES.map((item) => {
                      const isSelected = lang === item.code;
                      return (
                        <button
                          key={item.code}
                          onClick={() => {
                            setLang(item.code);
                            setLangDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                            isSelected
                              ? "bg-rose-50 text-rose-600 border border-rose-200/80 shadow-2xs font-extrabold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-rose-600 border border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="text-base leading-none shrink-0">{item.flag}</span>
                            <span className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-slate-800 truncate leading-snug">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold leading-none">
                                {item.initial}
                              </span>
                            </span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
            {t("nav_all_tools")}
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
            {allTools.map((tool, idx) => (
              <Link
                key={`${tool.href}-${idx}`}
                href={tool.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 transition-colors"
              >
                <tool.icon className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700 truncate">{tool.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/guides"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 text-orange-950 text-xs font-bold hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-600" />
                <span>{t("nav_guides")}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
            </Link>
          </div>
        </div>
      )}
      {/* Quick Tool Search Modal (Ctrl+K) */}
      <QuickSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
}
