"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  BookOpen, 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Zap,
  Filter,
  X
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { 
  GUIDE_ARTICLES, 
  GuideArticle, 
  getArticleTranslation, 
  getArticleCategory,
  getArticleReadTime,
  getArticleToolName 
} from "@/lib/guides-data";

export default function GuidesPage() {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: t("guides_cat_all") },
    { id: "edit", label: t("guides_cat_edit") },
    { id: "convert", label: t("guides_cat_convert") },
    { id: "security", label: t("guides_cat_security") },
    { id: "media", label: t("guides_cat_media") },
    { id: "mobile", label: t("guides_cat_mobile") },
  ];

  const filteredArticles = useMemo(() => {
    return GUIDE_ARTICLES.filter((article) => {
      // Category filter
      if (selectedCategory !== "all" && article.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const tr = getArticleTranslation(article, lang);
      const cat = getArticleCategory(article, lang).toLowerCase();

      const titleMatch = tr.title.toLowerCase().includes(q);
      const summaryMatch = tr.summary.toLowerCase().includes(q);
      const catMatch = cat.includes(q);
      const keywordMatch = article.keywords.some((k) => k.toLowerCase().includes(q));

      return titleMatch || summaryMatch || catMatch || keywordMatch;
    });
  }, [searchQuery, selectedCategory, lang]);

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

  const getCategoryColor = (cat: GuideArticle["category"]) => {
    switch (cat) {
      case "edit":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "convert":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "security":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "media":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "mobile":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/80";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-amber-50/30 to-slate-50/70 pt-12 pb-14 border-b border-orange-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-orange-600 border border-orange-200 shadow-2xs text-xs font-black mb-5 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>{t("guides_portal_badge")}</span>
            <span className="bg-orange-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">20</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto mb-4">
            {t("guides_portal_title")}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            {t("guides_portal_subtitle")}
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("guides_search_placeholder")}
                className="w-full pl-12 pr-10 py-3.5 sm:py-4 bg-white rounded-2xl border-2 border-orange-200/90 focus:border-rose-500 focus:outline-hidden text-sm sm:text-base text-slate-800 shadow-md transition-all placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label="검색어 지우기"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-3xl mx-auto">
            {categories.map((cat) => {
              const count = cat.id === "all" 
                ? GUIDE_ARTICLES.length 
                : GUIDE_ARTICLES.filter((a) => a.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs scale-105"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-black text-slate-900">
              {categories.find((c) => c.id === selectedCategory)?.label || t("guides_cat_all")}
            </h2>
            <span className="text-xs font-bold text-slate-500">
              ({filteredArticles.length}개)
            </span>
          </div>

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
          )}
        </div>

        {/* Empty state */}
        {filteredArticles.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-8">
            <div className="w-24 h-24 mx-auto mb-4">
              <img
                src="/mascot/mascot_thinking.png"
                alt="검색 결과 없음"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              입력하신 검색어 &quot;{searchQuery}&quot;에 해당하는 가이드를 찾을 수 없습니다. 다른 키워드로 검색해보세요.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              전체 가이드 목록 보기
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const tr = getArticleTranslation(article, lang);
            const catLabel = getArticleCategory(article, lang);
            const readTime = getArticleReadTime(article, lang);
            const toolName = getArticleToolName(article, lang);
            const mascotSrc = getMascotSrc(article.mascotMood);

            return (
              <article
                key={article.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Top Header Card */}
                <div className="p-6">
                  {/* Category and Mascot Mood */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {catLabel}
                    </span>

                    <div className="w-9 h-9 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <img
                        src={mascotSrc}
                        alt="래서팬더"
                        className="w-7 h-7 object-contain drop-shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/guides/${article.slug}`}>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug mb-2.5">
                      {tr.title}
                    </h3>
                  </Link>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {tr.summary}
                  </p>

                  {/* Meta Chips */}
                  <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{readTime}</span>
                    </span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>

                  {/* Keyword Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {article.keywords.slice(0, 3).map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-50 text-[10px] font-medium text-slate-500 border border-slate-100"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  {/* Direct Tool Link */}
                  <Link
                    href={article.toolHref}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
                    title={`${toolName} 바로가기`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>{toolName}</span>
                  </Link>

                  {/* Read Article Link */}
                  <Link
                    href={`/guides/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-rose-600 hover:text-rose-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{t("guides_read_article")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bottom Privacy & Value Assurance */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <img
                src="/mascot/mascot_hooray.png"
                alt="래서팬더 만세"
                className="w-12 h-12 object-contain drop-shadow-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                  100% Client-Side Privacy Guarantee
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                모든 가이드의 기능은 100% 무료 & 로그인 없이 즉시 사용 가능합니다
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                mypickpdf는 고객님의 소중한 문서와 사진을 절대 원격 서버로 전송하지 않습니다. 브라우저 WebAssembly 로컬 엔진에서 안전하게 처리됩니다.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              href="/compress-pdf"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black text-sm shadow-lg hover:shadow-orange-500/25 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>지금 PDF 압축 체험하기</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
