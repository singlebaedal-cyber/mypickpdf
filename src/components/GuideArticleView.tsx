"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Share2, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Zap,
  BookOpen
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { 
  GuideArticle, 
  GUIDE_ARTICLES, 
  getArticleTranslation, 
  getArticleCategory,
  getArticleReadTime,
  getArticleToolName 
} from "@/lib/guides-data";

interface GuideArticleViewProps {
  article: GuideArticle;
}

export default function GuideArticleView({ article }: GuideArticleViewProps) {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const tr = getArticleTranslation(article, lang);
  const catLabel = getArticleCategory(article, lang);
  const readTime = getArticleReadTime(article, lang);
  const toolName = getArticleToolName(article, lang);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: tr.title,
          text: tr.summary,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const getMascotSrc = (mood: GuideArticle["mascotMood"]) => {
    switch (mood) {
      case "cheering":
        return "/mascot/mascot_cheering.png";
      case "idea":
        return "/mascot/mascot_idea.png";
      case "ready":
        return "/mascot/mascot_ready.png";
      case "success":
        return "/mascot/mascot_success.png";
      default:
        return "/mascot/mascot_main.png";
    }
  };

  // 2-3 Related Articles
  const relatedArticles = GUIDE_ARTICLES.filter(
    (a) => a.id !== article.id && (a.category === article.category || Math.abs(a.id - article.id) <= 2)
  ).slice(0, 3);

  return (
    <article className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("guides_back_to_list")}</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
            title={t("guides_share")}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-extrabold">{t("guides_copied")}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{t("guides_share")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Article Header Card */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          {/* Breadcrumb badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200/80">
              {catLabel}
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{readTime}</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">{article.date}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4 [text-wrap:balance]">
            {tr.title}
          </h1>

          {/* Lead Summary */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 mb-6 [text-wrap:pretty]">
            {tr.summary}
          </p>

          {/* Top Quick Tool CTA Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 border border-orange-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-orange-100 flex items-center justify-center shrink-0">
                <img
                  src={getMascotSrc(article.mascotMood)}
                  alt="래서팬더"
                  className="w-9 h-9 object-contain drop-shadow-xs"
                />
              </div>
              <div>
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider">
                  {t("guides_quick_cta_title")}
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {toolName} 도구를 브라우저에서 바로 사용해보세요
                </div>
              </div>
            </div>

            <Link
              href={article.toolHref}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md hover:shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{tr.ctaText || `${toolName} 바로가기`}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Article Body Content */}
        <main className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8 space-y-8">
          {tr.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-100 [text-wrap:balance]">
                <span className="w-2 h-6 rounded-full bg-rose-500 inline-block" />
                <span>{section.heading}</span>
              </h2>

              <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed">
                {section.body.map((para, pIdx) => (
                  <p key={pIdx} className="[text-wrap:pretty]">{para}</p>
                ))}
              </div>

              {section.tip && (
                <div className="my-4 p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 fill-amber-600 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 mb-1">
                      래서팬더 꿀팁 (Panda Tip)
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium [text-wrap:pretty]">
                      {section.tip}
                    </p>
                  </div>
                </div>
              )}
            </section>
          ))}

          {/* Keywords Tag Cloud */}
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              관련 키워드 & 태그
            </h4>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/60"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </main>

        {/* Big Bottom Tool CTA Banner */}
        <section className="bg-gradient-to-tr from-slate-900 via-slate-800 to-rose-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-12 border border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                <img
                  src="/mascot/mascot_hooray.png"
                  alt="래서팬더"
                  className="w-12 h-12 object-contain drop-shadow-md"
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-500/40 inline-block mb-1">
                  100% Free & No Sign-up
                </span>
                <h3 className="text-lg sm:text-xl font-black">
                  지금 바로 {toolName} 도구를 무료로 실행해보세요!
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-md">
                  별도 프로그램 설치 없이 웹 브라우저에서 안전하고 빠르게 처리됩니다.
                </p>
              </div>
            </div>

            <Link
              href={article.toolHref}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black text-sm shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{tr.ctaText || `${toolName} 시작하기`}</span>
            </Link>
          </div>
        </section>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" />
                <span>함께 읽으면 좋은 추천 가이드</span>
              </h3>
              <Link
                href="/guides"
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                전체보기 &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => {
                const relTr = getArticleTranslation(rel, lang);
                const relCat = getArticleCategory(rel, lang);

                return (
                  <Link
                    key={rel.id}
                    href={`/guides/${rel.slug}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1 block">
                        {relCat}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-600 line-clamp-2 leading-snug">
                        {relTr.title}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{rel.date}</span>
                      <span className="text-rose-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                        읽기 &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
