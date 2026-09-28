"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, FileUp, ArrowDownCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import RedPanda from "./RedPanda";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function FileDropzone({
  onFilesSelected,
  accept = ".pdf,application/pdf",
  multiple = true,
  title,
  subtitle,
  buttonText,
}: FileDropzoneProps) {
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const displayTitle = title || t("drop_title_default");
  const displaySubtitle = subtitle || t("drop_subtitle_default");
  const displayButtonText = buttonText || t("btn_select_files");

  // Prevent browser default window drop (which opens the PDF in a new tab)
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
    };
    window.addEventListener("dragover", preventDefaults);
    window.addEventListener("drop", preventDefaults);
    return () => {
      window.removeEventListener("dragover", preventDefaults);
      window.removeEventListener("drop", preventDefaults);
    };
  }, []);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      e.target.value = "";
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      className={`relative group cursor-pointer transition-all duration-200 border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center select-none outline-none focus:ring-4 focus:ring-rose-200 ${
        isDragOver
          ? "border-rose-500 bg-rose-50/90 ring-4 ring-rose-300/40 shadow-2xl shadow-rose-200/60 scale-[1.01]"
          : "border-slate-300 hover:border-rose-400 bg-white hover:bg-slate-50/60 shadow-xs hover:shadow-md"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Top Friendly Badge with Red Panda */}
      <div className="pointer-events-none absolute top-4 right-4 hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50/95 border border-amber-200/80 rounded-full text-xs font-bold text-amber-900 shadow-xs">
        <RedPanda mood="ready" size={20} />
        <span>{t("drop_badge_secure")}</span>
      </div>

      {/* Fixed Height Mascot/Icon Area (112px) to prevent layout jumping */}
      <div className="pointer-events-none h-28 flex items-center justify-center mb-4 transition-all">
        {isDragOver ? (
          <div className="scale-105 animate-pulse">
            <RedPanda
              mood="ready"
              size={96}
              withSpeechBubble={t("drop_mascot_bubble")}
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-md shadow-rose-100">
            <UploadCloud className="w-10 h-10 stroke-[2]" />
          </div>
        )}
      </div>

      {/* Dynamic Title and Subtitle with pointer-events-none */}
      <div className="pointer-events-none">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight transition-colors">
          {isDragOver ? t("drop_drag_title") : displayTitle}
        </h3>
        <p className="text-sm text-slate-500 mb-6 max-w-md transition-colors">
          {isDragOver
            ? t("drop_drag_desc")
            : displaySubtitle}
        </p>
      </div>

      {/* Dynamic Action Button State: Switches clearly between File Picker and Drop Action */}
      <div className="pointer-events-none">
        <div
          className={`px-8 py-4 font-bold text-base rounded-2xl shadow-lg transition-all flex items-center gap-2.5 ${
            isDragOver
              ? "bg-emerald-600 text-white shadow-emerald-500/30 scale-105 ring-4 ring-emerald-200 animate-pulse"
              : "bg-gradient-to-r from-rose-600 to-red-600 group-hover:from-rose-700 group-hover:to-red-700 text-white shadow-rose-600/30 group-hover:shadow-xl group-hover:shadow-rose-600/40 group-hover:-translate-y-0.5"
          }`}
        >
          {isDragOver ? (
            <>
              <ArrowDownCircle className="w-5 h-5 animate-bounce" />
              <span>{t("drop_action_drop")}</span>
            </>
          ) : (
            <>
              <FileUp className="w-5 h-5" />
              <span>{displayButtonText}</span>
            </>
          )}
        </div>
      </div>

      {/* Privacy and limit notes */}
      <div className="pointer-events-none mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <span>{t("drop_note_privacy")}</span>
        <span>•</span>
        <span>{t("drop_note_limit")}</span>
      </div>

      {/* Visual glowing border overlay when dragging */}
      {isDragOver && (
        <div className="absolute inset-0 rounded-3xl border-2 border-rose-500 bg-rose-500/5 pointer-events-none z-10" />
      )}
    </div>
  );
}
