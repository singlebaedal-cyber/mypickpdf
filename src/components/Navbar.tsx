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
  Sparkles
} from "lucide-react";
import { useLanguage, LANGUAGES } from "@/lib/i18n";
import RedPanda from "@/components/RedPanda";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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
              my<span className="text-orange-500">pick</span><span className="text-rose-600">pdf</span>
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
          </nav>

          {/* Right Actions: Language Switcher (Hover & Click Supported) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>Select Language</span>
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                        lang === item.code
                          ? "bg-rose-50 text-rose-600 font-extrabold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{item.flag}</span>
                        <span className="font-extrabold text-xs text-slate-800">{item.initial}</span>
                        <span className="text-slate-400 font-normal text-xs">({item.label})</span>
                      </span>
                      {lang === item.code && <Check className="w-3.5 h-3.5 text-rose-600" />}
                    </button>
                  ))}
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
        </div>
      )}
    </header>
  );
}
