"use client";

import React from "react";
import { ShieldCheck, Zap, Lock } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface ToolHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  tag?: React.ReactNode;
  toolKey?: string;
}

export default function ToolHeader({
  title,
  description,
  tag,
  toolKey,
}: ToolHeaderProps) {
  const { t } = useLanguage();

  const resolvedTitle = title || (toolKey ? t(`tool_${toolKey}` as any) : "");
  const resolvedDesc = description || (toolKey ? t(`tool_${toolKey}_desc` as any) : "");
  const displayTag = tag || t("badge_free_utility");

  return (
    <div className="text-center max-w-4xl mx-auto mb-8 px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-3 border border-rose-100">
        <Zap className="w-3.5 h-3.5 fill-rose-600" />
        <span>{displayTag}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4 break-keep [text-wrap:balance] max-w-3xl mx-auto">
        {resolvedTitle}
      </h1>

      <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto break-keep [text-wrap:balance]">
        {resolvedDesc}
      </p>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t("badge_no_server")}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>{t("badge_no_login")}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{t("badge_unlimited_free")}</span>
        </span>
      </div>
    </div>
  );
}
