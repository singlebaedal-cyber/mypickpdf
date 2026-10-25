"use client";

import React from "react";
import Link from "next/link";
import { 
  Clock, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Wrench,
  BookOpen,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedArticle, getLocalizedArticles } from "@/lib/guides-data";
import RedPanda from "@/components/RedPanda";
import FaqSection from "@/components/FaqSection";

interface GuideDetailClientViewProps {
  slug: string;
}

export default function GuideDetailClientView({ slug }: GuideDetailClientViewProps) {
  const { lang, t } = useLanguage();
  const article = getLocalizedArticle(slug, lang);
  const allArticles = getLocalizedArticles(lang);
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => (a.category === article.category ? -1 : b.category === article.category ? 1 : 0))
    .slice(0, 3);

  // Inline markdown parser: handles [label](href), **bold**, and `code`
  const renderInline = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith("[") && token.includes("](")) {
        const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          if (href.startsWith("/")) {
            nodes.push(
              <Link
                key={`link-${idx++}`}
                href={href}
                className="text-rose-600 font-bold underline decoration-rose-300 underline-offset-4 hover:text-rose-700 hover:decoration-rose-600 transition-colors"
              >
                {label}
              </Link>
            );
          } else {
            nodes.push(
              <a
                key={`a-${idx++}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-600 font-bold underline decoration-rose-300 underline-offset-4 hover:text-rose-700"
              >
                {label}
              </a>
            );
          }
        } else {
          nodes.push(token);
        }
      } else if (token.startsWith("**") && token.endsWith("**")) {
        nodes.push(
          <strong key={`strong-${idx++}`} className="font-bold text-slate-900">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        nodes.push(
          <code
            key={`code-${idx++}`}
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 text-rose-600 font-mono text-xs border border-slate-200/80"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else {
        nodes.push(token);
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }

    return nodes;
  };

  // Block markdown rendering helper with proper semantic <ul>, <ol>, <table>
  const renderContent = (raw: string) => {
    const lines = raw.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let keyIdx = 0;

    let inTable = false;
    let tableRows: string[] = [];
    let bulletItems: string[] = [];
    let orderedItems: string[] = [];

    const flushBulletList = () => {
      if (bulletItems.length > 0) {
        elements.push(
          <ul key={`ul-${keyIdx++}`} className="my-4 space-y-2 pl-5 list-disc text-sm sm:text-base text-slate-700">
            {bulletItems.map((item, idx) => {
              const isChecked = item.startsWith("[x] ") || item.startsWith("[X] ");
              const cleanItem = isChecked ? item.slice(4) : item;
              if (isChecked) {
                return (
                  <li key={idx} className="list-none -ml-5 flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>{renderInline(cleanItem)}</span>
                  </li>
                );
              }
              return (
                <li key={idx} className="leading-relaxed">
                  {renderInline(cleanItem)}
                </li>
              );
            })}
          </ul>
        );
        bulletItems = [];
      }
    };

    const flushOrderedList = () => {
      if (orderedItems.length > 0) {
        elements.push(
          <ol key={`ol-${keyIdx++}`} className="my-4 space-y-2.5 pl-5 list-decimal text-sm sm:text-base text-slate-700">
            {orderedItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed pl-1">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
        orderedItems = [];
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        const headerCols = tableRows[0].split("|").filter((c) => c.trim() !== "");
        const bodyRows = tableRows.slice(2); // Skip separator row

        elements.push(
          <div key={`table-${keyIdx++}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
              <thead className="bg-slate-50 font-bold text-slate-800">
                <tr>
                  {headerCols.map((c, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      {renderInline(c.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bodyRows.map((r, ri) => {
                  const cols = r.split("|").filter((c) => c.trim() !== "");
                  return (
                    <tr key={ri} className="hover:bg-slate-50/50">
                      {cols.map((col, ci) => (
                        <td key={ci} className="px-4 py-3 text-slate-700 leading-relaxed">
                          {renderInline(col.trim())}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trimEnd();

      if (line.startsWith("|")) {
        flushBulletList();
        flushOrderedList();
        inTable = true;
        tableRows.push(line);
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (line.startsWith("- ")) {
        flushOrderedList();
        bulletItems.push(line.slice(2).trim());
        continue;
      } else {
        flushBulletList();
      }

      const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
      if (orderedMatch) {
        orderedItems.push(orderedMatch[1].trim());
        continue;
      } else {
        flushOrderedList();
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={keyIdx++} className="text-xl sm:text-2xl font-black text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-100">
            {renderInline(line.replace("## ", ""))}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={keyIdx++} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3">
            {renderInline(line.replace("### ", ""))}
          </h3>
        );
      } else if (line.startsWith("---")) {
        elements.push(<hr key={keyIdx++} className="my-8 border-slate-200" />);
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={keyIdx++} className="text-sm sm:text-base text-slate-700 leading-relaxed my-3.5">
            {renderInline(line)}
          </p>
        );
      }
    }
    flushBulletList();
    flushOrderedList();
    flushTable();

    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-slate-700">{t("guides_breadcrumb_home")}</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-slate-700">{t("guides_breadcrumb_main")}</Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate max-w-[200px]">{article.title}</span>
      </nav>

      {/* Article Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-extrabold border border-orange-200">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{t("guides_read_time_label")}: {article.readTime}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{t("guides_published_at_label")}: {article.publishedAt}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed pb-6 border-b border-slate-100">
          {article.summary}
        </p>

        {/* Author / Editorial Info */}
        <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <RedPanda mood="avatar" size={24} />
            </div>
            <div>
              <span className="font-bold text-slate-800">{t("guides_editorial_team")}</span>
              <p className="text-[11px] text-slate-400">{t("guides_editorial_role")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Tool CTA Card */}
      <div className="my-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">
              {t("guides_apply_title")}
            </h3>
            <p className="text-xs text-white/80 mt-0.5">
              {t("guides_apply_desc")}
            </p>
          </div>
        </div>
        <Link
          href={article.relatedToolHref}
          className="px-5 py-2.5 bg-white text-rose-600 hover:bg-slate-100 rounded-xl text-xs font-black transition-all shrink-0 shadow-md flex items-center gap-1.5"
        >
          <span>{article.relatedToolName}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Article Body */}
      <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm mb-12">
        <div className="prose prose-slate max-w-none">
          {renderContent(article.content)}
        </div>

        {/* Tags Cloud for SEO & Context */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Article Specific FAQ Section */}
      {article.faqList && article.faqList.length > 0 && (
        <FaqSection
          items={article.faqList}
          title={t("guides_faq_title")}
          subtitle={t("guides_faq_desc")}
        />
      )}

      {/* Related Articles */}
      <div className="my-12">
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" />
          {t("guides_related_title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedArticles.map((rel) => (
            <Link
              key={rel.slug}
              href={`/guides/${rel.slug}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md mb-2 inline-block">
                  {rel.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mb-2">
                  {rel.title}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-3">
                <span>{t("guides_view_detail")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Back to Guides List */}
      <div className="text-center pt-6">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("guides_back_to_list")}</span>
        </Link>
      </div>
    </div>
  );
}
