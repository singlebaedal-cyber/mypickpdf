"use client";

import Link from "next/link";
import { 
  Files, 
  Split, 
  Image as ImageIcon, 
  FileText, 
  RotateCw, 
  FileSearch, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Presentation,
  Code2,
  Archive,
  Minimize2,
  Hash,
  Shield,
  Video,
  FileVideo
} from "lucide-react";
import AdBanner from "@/components/AdBanner";
import FaqSection from "@/components/FaqSection";
import RedPanda from "@/components/RedPanda";
import ShareBar from "@/components/ShareBar";
import { useLanguage } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useLanguage();

  const coreTools = [
    { title: t("tool_merge"), desc: t("tool_merge_desc"), href: "/merge-pdf", icon: Files, color: "from-rose-500 to-red-600", badge: "BEST" },
    { title: t("tool_split"), desc: t("tool_split_desc"), href: "/split-pdf", icon: Split, color: "from-amber-500 to-orange-600", badge: "POPULAR" },
    { title: t("tool_compress"), desc: t("tool_compress_desc"), href: "/compress-pdf", icon: Minimize2, color: "from-emerald-500 to-teal-600", badge: "HOT" },
    { title: t("tool_page_numbers"), desc: t("tool_page_numbers_desc"), href: "/add-page-numbers", icon: Hash, color: "from-blue-600 to-indigo-600", badge: "NEW" },
    { title: t("tool_watermark"), desc: t("tool_watermark_desc"), href: "/add-watermark", icon: Shield, color: "from-rose-600 to-pink-600", badge: t("badge_security") },
    { title: t("tool_rotate"), desc: t("tool_rotate_desc"), href: "/rotate-pdf", icon: RotateCw, color: "from-purple-500 to-violet-600", badge: "FAST" },
    { title: t("tool_ocr"), desc: t("tool_ocr_desc"), href: "/ocr-pdf", icon: FileSearch, color: "from-cyan-500 to-sky-600", badge: "OCR" },
  ];

  const mediaTools = [
    { title: t("tool_compress_video"), desc: t("tool_compress_video_desc"), href: "/compress-video", icon: Video, color: "from-purple-600 to-indigo-600", badge: "NEW" },
    { title: t("tool_video_to_gif"), desc: t("tool_video_to_gif_desc"), href: "/video-to-gif", icon: Sparkles, color: "from-pink-500 to-rose-600", badge: "HOT" },
  ];

  const toPdfTools = [
    { title: t("tool_img_to_pdf"), desc: t("tool_img_to_pdf_desc"), href: "/image-to-pdf", icon: ImageIcon, color: "from-blue-500 to-indigo-600", badge: "JPG/PNG" },
    { title: t("tool_word_to_pdf"), desc: t("tool_word_to_pdf_desc"), href: "/word-to-pdf", icon: FileText, color: "from-blue-600 to-sky-600", badge: "WORD" },
    { title: t("tool_ppt_to_pdf"), desc: t("tool_ppt_to_pdf_desc"), href: "/powerpoint-to-pdf", icon: Presentation, color: "from-orange-500 to-amber-600", badge: "PPT" },
    { title: t("tool_excel_to_pdf"), desc: t("tool_excel_to_pdf_desc"), href: "/excel-to-pdf", icon: FileSpreadsheet, color: "from-emerald-500 to-teal-600", badge: "EXCEL" },
    { title: t("tool_html_to_pdf"), desc: t("tool_html_to_pdf_desc"), href: "/html-to-pdf", icon: Code2, color: "from-amber-500 to-red-500", badge: "HTML" },
  ];

  const fromPdfTools = [
    { title: t("tool_pdf_to_hwp"), desc: t("tool_pdf_to_hwp_desc"), href: "/pdf-to-hwp", icon: FileText, color: "from-blue-600 to-cyan-600", badge: "HWPX" },
    { title: t("tool_pdf_to_word"), desc: t("tool_pdf_to_word_desc"), href: "/pdf-to-word", icon: FileText, color: "from-blue-600 to-indigo-600", badge: "TO DOCX" },
    { title: t("tool_pdf_to_img"), desc: t("tool_pdf_to_img_desc"), href: "/pdf-to-image", icon: ImageIcon, color: "from-amber-500 to-rose-600", badge: "TO JPG" },
    { title: t("tool_pdf_to_ppt"), desc: t("tool_pdf_to_ppt_desc"), href: "/pdf-to-powerpoint", icon: Presentation, color: "from-orange-600 to-red-600", badge: "TO PPTX" },
    { title: t("tool_pdf_to_excel"), desc: t("tool_pdf_to_excel_desc"), href: "/pdf-to-excel", icon: FileSpreadsheet, color: "from-emerald-600 to-teal-700", badge: "TO XLSX" },
    { title: t("tool_pdf_to_pdfa"), desc: t("tool_pdf_to_pdfa_desc"), href: "/pdf-to-pdfa", icon: Archive, color: "from-indigo-600 to-purple-600", badge: "PDF/A" },
  ];

  const globalFaqs = [
    {
      question: t("home_faq_q1"),
      answer: t("home_faq_a1"),
    },
    {
      question: t("home_faq_q2"),
      answer: t("home_faq_a2"),
    },
    {
      question: t("home_faq_q3"),
      answer: t("home_faq_a3"),
    },
  ];

  return (
    <div className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-4 pb-10 flex flex-col items-center">
        {/* Red Panda Mascot Welcome */}
        <div className="mb-3 hover:scale-105 transition-transform duration-300">
          <RedPanda
            mood="welcome"
            size={135}
            withSpeechBubble={t("home_mascot_bubble")}
          />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-5 border border-rose-100 shadow-xs">
          <Sparkles className="w-4 h-4" />
          <span>{t("home_hero_tag")}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2] mb-6 [text-wrap:balance]">
          <span className="inline-block">{t("home_hero_title1")}</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-rose-700 inline-block">
            {t("home_hero_title2")}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto [text-wrap:pretty]">
          {t("home_hero_desc")}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t("nav_privacy_badge")}</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>{t("nav_free_badge")}</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t("badge_client_engine")}</span>
          </span>
        </div>
      </section>

      {/* Top Ad Slot */}
      <AdBanner format="horizontal" />

      {/* Share and Bookmark Referral Bar */}
      <ShareBar />

      {/* Section 1: Core Tools */}
      <section className="my-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Files className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
            <span>{t("nav_core_tools")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {coreTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-rose-300 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <tool.icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all sm:hidden" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
                  {tool.title}
                </h3>
                <p className="hidden sm:block text-[11px] text-slate-500 leading-relaxed mt-1">{tool.desc}</p>
              </div>
              <div className="hidden sm:flex mt-4 pt-3 border-t border-slate-100 items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-rose-600">
                <span>{t("home_use_now")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section: 동영상 & 미디어 도구 (Video & Media Tools) */}
      <section className="my-10">
        <div className="mb-4 sm:mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-purple-600 mb-1">
            Video & Media Tools
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Video className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            <span>{t("nav_media_tools")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {mediaTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <tool.icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all sm:hidden" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors leading-tight">
                  {tool.title}
                </h3>
                <p className="hidden sm:block text-[11px] text-slate-500 leading-relaxed mt-1">{tool.desc}</p>
              </div>
              <div className="hidden sm:flex mt-4 pt-3 border-t border-slate-100 items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-purple-600">
                <span>{t("home_use_now")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 2: PDF로 변환 (Convert TO PDF) */}
      <section className="my-12">
        <div className="mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-rose-600 mb-1">Convert TO PDF</div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t("nav_to_pdf")} {t("home_to_pdf_sub")}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {toPdfTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-rose-300 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <tool.icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all sm:hidden" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">{tool.title}</h3>
                <p className="hidden sm:block text-[11px] text-slate-500 leading-normal mt-1">{tool.desc}</p>
              </div>
              <div className="hidden sm:flex mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-rose-600 items-center justify-between">
                <span>{t("home_convert_btn")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mid Ad Slot */}
      <AdBanner format="horizontal" />

      {/* Section 3: PDF에서 변환 (Convert FROM PDF) */}
      <section className="my-12">
        <div className="mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Convert FROM PDF</div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t("nav_from_pdf")} {t("home_from_pdf_sub")}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {fromPdfTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-rose-300 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <tool.icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all sm:hidden" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">{tool.title}</h3>
                <p className="hidden sm:block text-[11px] text-slate-500 leading-normal mt-1">{tool.desc}</p>
              </div>
              <div className="hidden sm:flex mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-rose-600 items-center justify-between">
                <span>{t("home_extract_btn")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="my-16 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Why mypickpdf?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {t("home_why_title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{t("home_why_sec1_title")}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("home_why_sec1_desc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{t("home_why_sec2_title")}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("home_why_sec2_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <AdBanner format="responsive" />

      <FaqSection
        title={t("home_faq_title")}
        subtitle={t("home_faq_subtitle")}
        items={globalFaqs}
      />
    </div>
  );
}
