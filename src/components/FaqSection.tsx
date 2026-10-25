"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { getFaqMeta } from "@/lib/faqs-data";
import { getToolContent } from "@/lib/tool-content-data";

interface FAQItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  toolSlug?: string;
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export default function FaqSection({
  toolSlug,
  items,
  title,
  subtitle,
}: FaqSectionProps) {
  const { lang } = useLanguage();
  const defaultMeta = getFaqMeta(lang);
  const content = toolSlug ? getToolContent(toolSlug, lang) : null;

  const resolvedItems = (content?.faqItems && content.faqItems.length > 0)
    ? content.faqItems
    : (items || []);
  const displayTitle = (toolSlug && content?.faqTitle)
    ? (lang === "ko" ? (title || content.faqTitle) : content.faqTitle)
    : (title || content?.faqTitle || defaultMeta.title);
  const displaySubtitle = (toolSlug && content?.faqSubtitle)
    ? (lang === "ko" ? (subtitle || content.faqSubtitle) : content.faqSubtitle)
    : (subtitle || content?.faqSubtitle || defaultMeta.subtitle);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const stripMarkdown = (text: string) =>
    text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1").replace(/`/g, "");

  const renderAnswerText = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    const regex = /(\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    let k = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        nodes.push(text.slice(lastIdx, match.index));
      }
      const token = match[0];
      if (token.startsWith("[")) {
        const lm = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (lm) {
          nodes.push(
            <Link
              key={`faq-link-${k++}`}
              href={lm[2]}
              className="text-rose-600 font-bold underline decoration-rose-300 underline-offset-4 hover:text-rose-700"
            >
              {lm[1]}
            </Link>
          );
        } else {
          nodes.push(token);
        }
      } else if (token.startsWith("`") && token.endsWith("`")) {
        nodes.push(
          <code key={`faq-code-${k++}`} className="px-1.5 py-0.5 rounded bg-slate-100 text-rose-600 font-mono text-xs">
            {token.slice(1, -1)}
          </code>
        );
      } else {
        nodes.push(token);
      }
      lastIdx = regex.lastIndex;
    }
    if (lastIdx < text.length) {
      nodes.push(text.slice(lastIdx));
    }
    return nodes;
  };

  // Schema.org FAQPage for AEO (Answer Engine Optimization)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: resolvedItems.map((item) => ({
      "@type": "Question",
      name: stripMarkdown(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripMarkdown(item.answer),
      },
    })),
  };

  return (
    <section className="my-16 max-w-4xl mx-auto px-4">
      {/* Inject AEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-3">
          <HelpCircle className="w-3.5 h-3.5" /> Q&A
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {displayTitle}
        </h2>
        <p className="text-sm text-slate-500 mt-2">{displaySubtitle}</p>
      </div>

      <div className="space-y-3">
        {resolvedItems.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-rose-600 transition-colors"
              >
                <span className="text-base leading-snug">{stripMarkdown(item.question)}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-rose-600" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                  {renderAnswerText(item.answer)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
