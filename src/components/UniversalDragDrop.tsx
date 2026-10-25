"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UploadCloud, FileText, Files, Minimize2, PenTool, X, ArrowRight } from "lucide-react";
import RedPanda from "@/components/RedPanda";
import { useLanguage } from "@/lib/i18n";

export default function UniversalDragDrop() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFileName, setDroppedFileName] = useState<string | null>(null);

  useEffect(() => {
    // Only enable on homepage
    if (pathname !== "/") return;

    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer && Array.from(e.dataTransfer.types).includes("Files")) {
        dragCounter++;
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDragging(false);
        dragCounter = 0;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragging(false);

      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        setDroppedFileName(file.name);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  const quickTools = [
    { name: lang === "ko" ? "PDF 편집기" : "Edit PDF", href: "/edit-pdf", icon: PenTool, color: "from-rose-500 to-pink-600" },
    { name: lang === "ko" ? "PDF 합치기" : "Merge PDF", href: "/merge-pdf", icon: Files, color: "from-rose-500 to-red-600" },
    { name: lang === "ko" ? "PDF 압축" : "Compress PDF", href: "/compress-pdf", icon: Minimize2, color: "from-emerald-500 to-teal-600" },
    { name: lang === "ko" ? "PDF to Word/한글" : "PDF to Word/HWP", href: "/pdf-to-word", icon: FileText, color: "from-blue-600 to-indigo-600" },
  ];

  return (
    <>
      {/* 1. Drag Overlay while hovering */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-200 pointer-events-none">
          <div className="w-24 h-24 mb-4 animate-bounce">
            <RedPanda mood="hooray" size={96} />
          </div>
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2 tracking-tight">
            {lang === "ko" ? "파일을 여기에 놓아주세요!" : "Drop your files here!"}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 text-center max-w-md">
            {lang === "ko"
              ? "파일을 놓으시면 바로 원하는 PDF 도구로 안전하게 이동합니다."
              : "Drop anywhere to pick your preferred PDF tool."}
          </p>
        </div>
      )}

      {/* 2. Tool picker modal after dropping */}
      {droppedFileName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                <span className="font-extrabold text-sm text-slate-800 truncate max-w-[220px]">
                  {droppedFileName}
                </span>
              </div>
              <button
                onClick={() => setDroppedFileName(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
              {lang === "ko" ? "어떤 작업을 진행할까요?" : "Choose an action:"}
            </p>

            <div className="space-y-2">
              {quickTools.map((tool) => (
                <button
                  key={tool.href}
                  onClick={() => {
                    setDroppedFileName(null);
                    router.push(tool.href);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-2xs`}>
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800 group-hover:text-rose-600">
                      {tool.name}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
