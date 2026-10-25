"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Lightbulb, 
  FileCheck, 
  ArrowRight, 
  Lock, 
  Cpu, 
  Sparkles,
  BookOpen
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { getToolContent } from "@/lib/tool-content-data";

interface GuideFeature {
  title: string;
  description: string;
  badge?: string;
}

interface DeepGuideSectionProps {
  toolSlug?: string;
  toolName?: string;
  tagline?: string;
  features?: GuideFeature[];
  proTips?: string[];
  securityNote?: string;
  relatedGuideSlug?: string;
  relatedGuideTitle?: string;
}

export default function DeepGuideSection({
  toolSlug,
  toolName,
  tagline,
  features,
  proTips,
  securityNote,
  relatedGuideSlug,
  relatedGuideTitle,
}: DeepGuideSectionProps) {
  const { t, lang } = useLanguage();
  const content = toolSlug ? getToolContent(toolSlug, lang) : null;
  const guide = content?.deepGuide;

  const resolvedToolName = (toolSlug && guide?.toolName)
    ? (lang === "ko" ? (toolName || guide.toolName) : guide.toolName)
    : (toolName || guide?.toolName || content?.toolName || "");
  const resolvedTagline = (toolSlug && guide?.tagline)
    ? (lang === "ko" ? (tagline || guide.tagline) : guide.tagline)
    : (tagline || guide?.tagline || "");
  const resolvedFeatures = (guide?.features && guide.features.length > 0)
    ? guide.features
    : (features || []);
  const resolvedProTips = (guide?.proTips && guide.proTips.length > 0)
    ? guide.proTips
    : (proTips || []);
  const resolvedSecurityNote = guide?.securityNote || securityNote || "";
  const resolvedRelatedGuideSlug = guide?.relatedGuideSlug || relatedGuideSlug;
  const resolvedRelatedGuideTitle = guide?.relatedGuideTitle || relatedGuideTitle;

  return (
    <section className="my-16 max-w-5xl mx-auto px-4">
      {/* Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-2">
              <Lightbulb className="w-3.5 h-3.5" /> {t("deep_guide_badge")}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {resolvedToolName} - {resolvedTagline}
            </h2>
          </div>
          {resolvedRelatedGuideSlug && (
            <Link
              href={`/guides/${resolvedRelatedGuideSlug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-center"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{resolvedRelatedGuideTitle || t("deep_guide_read_article")}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
          {resolvedFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center text-xs font-black text-slate-700 shadow-2xs">
                    0{idx + 1}
                  </span>
                  {feat.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600">
                      {feat.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips Box */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200/60">
          <h4 className="font-bold text-amber-900 text-sm mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            {resolvedToolName} {t("deep_guide_knowhow_suffix")}
          </h4>
          <ul className="space-y-2 text-xs text-amber-950/80 leading-relaxed">
            {resolvedProTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security & Client-side Assurance */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h5 className="font-bold text-emerald-950 text-xs sm:text-sm">
              {t("deep_guide_security_title")}
            </h5>
            <p className="text-xs text-emerald-900/80 mt-0.5 leading-relaxed">
              {resolvedSecurityNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
