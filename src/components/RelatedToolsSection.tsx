"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { TOOLS_REGISTRY } from "@/lib/tools-registry";
import { getLocalizedArticles } from "@/lib/guides-data";

interface RelatedToolsSectionProps {
  currentToolId?: string;
}

const WORKFLOW_PAIRS: Record<string, string[]> = {
  "merge-pdf": ["compress-pdf", "add-page-numbers", "edit-pdf", "split-pdf"],
  "split-pdf": ["merge-pdf", "compress-pdf", "pdf-to-image", "edit-pdf"],
  "compress-pdf": ["merge-pdf", "edit-pdf", "pdf-to-word", "pdf-to-hwp"],
  "edit-pdf": ["compress-pdf", "merge-pdf", "add-watermark", "pdf-to-hwp"],
  "translate-pdf": ["edit-pdf", "pdf-to-word", "pdf-to-hwp", "compress-pdf"],
  "pdf-to-hwp": ["pdf-to-word", "edit-pdf", "ocr-pdf", "compress-pdf"],
  "pdf-to-word": ["word-to-pdf", "pdf-to-hwp", "edit-pdf", "translate-pdf"],
  "word-to-pdf": ["pdf-to-word", "merge-pdf", "compress-pdf", "edit-pdf"],
  "pdf-to-excel": ["excel-to-pdf", "pdf-to-word", "pdf-to-hwp", "ocr-pdf"],
  "excel-to-pdf": ["pdf-to-excel", "merge-pdf", "compress-pdf", "add-page-numbers"],
  "pdf-to-powerpoint": ["powerpoint-to-pdf", "compress-pdf", "pdf-to-image", "edit-pdf"],
  "powerpoint-to-pdf": ["pdf-to-powerpoint", "compress-pdf", "merge-pdf", "add-watermark"],
  "image-to-pdf": ["pdf-to-image", "compress-pdf", "merge-pdf", "ocr-pdf"],
  "pdf-to-image": ["image-to-pdf", "split-pdf", "compress-pdf", "edit-pdf"],
  "rotate-pdf": ["merge-pdf", "split-pdf", "add-page-numbers", "compress-pdf"],
  "ocr-pdf": ["pdf-to-word", "pdf-to-hwp", "translate-pdf", "edit-pdf"],
  "add-page-numbers": ["merge-pdf", "add-watermark", "compress-pdf", "edit-pdf"],
  "add-watermark": ["edit-pdf", "add-page-numbers", "compress-pdf", "pdf-to-pdfa"],
  "html-to-pdf": ["compress-pdf", "edit-pdf", "merge-pdf", "pdf-to-image"],
  "pdf-to-pdfa": ["compress-pdf", "add-page-numbers", "merge-pdf", "add-watermark"],
  "compress-video": ["video-to-gif", "compress-pdf", "image-to-pdf", "edit-pdf"],
  "video-to-gif": ["compress-video", "image-to-pdf", "pdf-to-image", "compress-pdf"],
};

export default function RelatedToolsSection({ currentToolId }: RelatedToolsSectionProps) {
  const { t, lang } = useLanguage();

  const pairIds = (currentToolId && WORKFLOW_PAIRS[currentToolId]) || [
    "edit-pdf",
    "merge-pdf",
    "compress-pdf",
    "pdf-to-hwp",
  ];

  const recommendedTools = pairIds
    .map((id) => TOOLS_REGISTRY.find((tool) => tool.id === id))
    .filter(Boolean) as typeof TOOLS_REGISTRY;

  const otherPopularTools = TOOLS_REGISTRY.filter(
    (tool) => tool.id !== currentToolId && !pairIds.includes(tool.id)
  ).slice(0, 6);

  const allGuides = getLocalizedArticles(lang);
  const matchingGuides = currentToolId
    ? allGuides.filter((g) => g.relatedToolHref === `/${currentToolId}`)
    : [];
  const displayGuides =
    matchingGuides.length >= 2
      ? matchingGuides.slice(0, 3)
      : [...matchingGuides, ...allGuides.filter((g) => !matchingGuides.includes(g))].slice(0, 3);

  return (
    <section className="my-14 max-w-5xl mx-auto px-4 space-y-10">
      {/* 1. Next Step Workflow Tools */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === "ko" ? "연속 작업 추천 워크플로우" : "Recommended Next Workflow"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {lang === "ko"
                ? "이 작업과 함께 가장 많이 사용하는 도구"
                : "Frequently Used Together With This Tool"}
            </h2>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 self-start sm:self-center"
          >
            <span>{t("nav_all_tools")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {recommendedTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group p-4 rounded-2xl bg-slate-50/80 hover:bg-rose-50/40 border border-slate-200/80 hover:border-rose-300 transition-all flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${tool.colorGradient} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    {tool.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                    {t(tool.titleKey)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {t(tool.descKey)}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-rose-600">
                  <span>{t("home_use_now")}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Pills for Other Tools */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">
            {lang === "ko" ? "인기 바로가기:" : "Quick Links:"}
          </span>
          {otherPopularTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-colors"
            >
              {t(tool.titleKey)}
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Related Practical Guides */}
      {displayGuides.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-5">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <span>
                {lang === "ko"
                  ? "알아두면 칼퇴하는 실무 PDF 활용 가이드"
                  : "Practical PDF Guides & Tips"}
              </span>
            </h3>
            <Link
              href="/guides"
              className="text-xs font-bold text-orange-600 hover:text-rose-600 inline-flex items-center gap-1 shrink-0"
            >
              <span>{lang === "ko" ? "전체 가이드 보기" : "All Guides"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group p-4 rounded-2xl bg-slate-50/70 hover:bg-orange-50/40 border border-slate-200/70 hover:border-orange-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-orange-100/80 text-orange-700 text-[10px] font-bold mb-2">
                    {guide.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-bold text-orange-600 group-hover:text-rose-600">
                  <span>{t("guides_read_more")}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
