"use client";

import React from "react";
import Link from "next/link";
import { 
  Clock, 
  ArrowRight, 
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedArticles } from "@/lib/guides-data";
import RedPanda from "@/components/RedPanda";

export default function GuidesClientView() {
  const { lang, t } = useLanguage();
  const articles = getLocalizedArticles(lang);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-orange-950/60 p-8 sm:p-12 text-white mb-12 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold mb-4 border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>{t("guides_hero_badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
            {t("guides_hero_title")}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {t("guides_hero_desc")}
          </p>
        </div>

        {/* Mascot decoration */}
        <div className="absolute -bottom-6 -right-4 sm:right-8 opacity-90 pointer-events-none hidden sm:block">
          <RedPanda mood="thinking" size={160} />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {articles.map((art) => (
          <article
            key={art.slug}
            className="group flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              {/* Category & Read Time */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[11px] font-bold border border-orange-200/60">
                  {art.category}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{art.readTime}</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2.5">
                <Link href={`/guides/${art.slug}`}>
                  {art.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                {art.summary}
              </p>
            </div>

            <div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 mb-4">
                {art.tags.slice(0, 3).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Read More Link */}
              <Link
                href={`/guides/${art.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors"
              >
                <span>{t("guides_read_more")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Tool Conversion CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-50 via-rose-50 to-amber-50 border border-orange-200/70 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white border border-orange-200 flex items-center justify-center shrink-0 shadow-xs">
            <RedPanda mood="hooray" size={42} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {t("guides_bottom_cta_title")}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {t("guides_bottom_cta_desc")}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="px-6 py-3 bg-slate-900 hover:bg-rose-600 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <span>{t("guides_bottom_cta_btn")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
