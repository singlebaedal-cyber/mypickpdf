"use client";

import React from "react";
import { CheckCircle2, FileText, RefreshCw, ShieldCheck, Sparkles, Layers } from "lucide-react";
import RedPanda from "./RedPanda";
import { useLanguage } from "@/lib/i18n";

interface UploadedFileCardProps {
  file: File | null;
  files?: File[];
  pageCount?: number;
  onReset: () => void;
  nextStepTitle?: string;
  nextStepHint?: string;
  className?: string;
}

export default function UploadedFileCard({
  file,
  files,
  pageCount,
  onReset,
  nextStepTitle,
  nextStepHint,
  className = "",
}: UploadedFileCardProps) {
  const { t } = useLanguage();
  const fileList = files && files.length > 0 ? files : file ? [file] : [];
  if (fileList.length === 0) return null;

  const primaryFile = fileList[0];
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const defaultTitle = nextStepTitle || t("uploaded_card_success");
  const defaultHint = nextStepHint || t("drop_drag_desc");

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-emerald-400/80 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-5 sm:p-7 shadow-lg shadow-emerald-500/10 animate-in fade-in zoom-in-98 duration-300 ${className}`}
    >
      {/* Top Banner: In-Place Success Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-200/80">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="h-4 w-4 stroke-[3]" />
          </span>
          <span className="text-xs sm:text-sm font-black text-emerald-950 tracking-tight">
            {defaultTitle}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            {t("uploaded_card_local_badge")}
          </span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300 text-xs font-bold transition-all shadow-2xs hover:scale-102 active:scale-98"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t("uploaded_card_change_file")}</span>
        </button>
      </div>

      {/* Main File Details Body */}
      <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
            <FileText className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base truncate" title={primaryFile.name}>
                {primaryFile.name}
              </h4>
              {fileList.length > 1 && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold shrink-0">
                  {t("uploaded_card_and_more").replace("{count}", String(fileList.length - 1))}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
              {pageCount !== undefined && pageCount > 0 && (
                <span className="flex items-center gap-1 text-rose-600 font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t("uploaded_card_total_pages").replace("{count}", String(pageCount))}</span>
                </span>
              )}
              <span>{t("uploaded_card_file_size")}: {formatBytes(primaryFile.size)}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t("uploaded_card_no_server")}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Friendly Mascot Confirmation Bubble */}
        <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 border border-emerald-200/90 shadow-2xs shrink-0">
          <RedPanda mood="ready" size={32} />
          <div className="text-[11px] leading-tight max-w-[220px]">
            <span className="font-bold text-slate-800 block">mypickpdf 🐾</span>
            <span className="text-slate-500 truncate block">{defaultHint}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
