"use client";

import { useState, useRef, useEffect } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import UploadedFileCard from "@/components/UploadedFileCard";
import StepBadge from "@/components/StepBadge";
import { reportAppError } from "@/lib/app-events";
import { mergePDFs, downloadBlob } from "@/lib/pdf-utils";
import { FileText, ArrowUp, ArrowDown, Trash2, Download, CheckCircle, Plus, UploadCloud } from "lucide-react";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedBlob, setMergedBlob] = useState<Uint8Array | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSlotDragOver, setIsSlotDragOver] = useState(false);
  const slotDragCounter = useRef(0);

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

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    setFiles((prev) => [...prev, ...pdfFiles]);
    setMergedBlob(null);
  };

  const handleSlotDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    slotDragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsSlotDragOver(true);
    }
  };

  const handleSlotDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
    if (!isSlotDragOver) {
      setIsSlotDragOver(true);
    }
  };

  const handleSlotDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    slotDragCounter.current -= 1;
    if (slotDragCounter.current <= 0) {
      slotDragCounter.current = 0;
      setIsSlotDragOver(false);
    }
  };

  const handleSlotDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    slotDragCounter.current = 0;
    setIsSlotDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      reportAppError({
        toolId: "merge-pdf",
        toolName: "PDF 합치기",
        errorMessage: "최소 2개 이상의 PDF 파일이 필요합니다.",
        technicalDetails: "현재 1개의 파일만 선택되어 있습니다. [파일 추가하기]를 눌러 합칠 문서를 더 추가해 주세요.",
        suggestedAction: "파일 추가 안내",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(10);

      const result = await mergePDFs(files, (p) => setProgress(p));
      setMergedBlob(result);
      setIsProcessing(false);

      // 자동 다운로드 트리거
      downloadBlob(result, `merged_${Date.now()}.pdf`);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      reportAppError({
        toolId: "merge-pdf",
        toolName: "PDF 합치기",
        errorMessage: "PDF 병합 중 오류가 발생했습니다. 파일이 손상되었거나 암호가 걸려있는지 확인해 주세요.",
        technicalDetails: err?.message || String(err),
        suggestedAction: "PDF 병합 파이프라인 자동 복구",
        onRetry: () => handleMerge(),
      });
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 파일 업로드",
      desc: "합치고 싶은 2개 이상의 PDF 파일을 드래그 앤 드롭하거나 파일 선택 버튼을 눌러 추가합니다.",
    },
    {
      step: 2,
      title: "문서 순서 조절",
      desc: "화면에 표시된 목록에서 화살표 버튼을 이용해 원하는 문서 순서대로 자유롭게 재배치합니다.",
    },
    {
      step: 3,
      title: "합치기 & 다운로드",
      desc: "[PDF 합치기] 버튼을 누르면 브라우저에서 1초 만에 병합되어 완성된 파일이 자동 저장됩니다.",
    },
  ];

  const faqItems = [
    {
      question: "PDF 합치기 기능은 정말 100% 무료인가요?",
      answer: "네, mypickpdf의 모든 PDF 도구는 회원가입이나 유료 결제 없이 평생 100% 무료로 무제한 사용하실 수 있습니다.",
    },
    {
      question: "업로드한 중요 문서가 유출될 위험은 없나요?",
      answer: "전혀 없습니다. mypickpdf는 일반 사이트와 달리 사용자의 파일을 외부 서버로 전송하지 않고 사용자의 웹 브라우저 메모리(Client-side) 안에서만 처리합니다. 따라서 어떠한 개인정보나 문서 데이터도 서버에 남지 않습니다.",
    },
    {
      question: "몇 개의 파일까지 한 번에 합칠 수 있나요?",
      answer: "개수 제한 없이 원하는 만큼 파일을 추가하여 하나로 합칠 수 있습니다. 사용자의 PC 메모리 성능에 따라 수십 개의 대용량 파일도 원활히 병합됩니다.",
    },
    {
      question: "스마트폰이나 태블릿에서도 합치기가 가능한가요?",
      answer: "네! 아이폰(Safari), 갤럭시(Chrome), 아이패드 등 모든 모바일 기기의 웹 브라우저에서 동일하게 간편하게 사용하실 수 있습니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="merge"
      />

      {/* Top High-CTR Ad Slot */}
      <AdBanner format="horizontal" />

      {/* Main Interactive Tool Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
        {files.length === 0 ? (
          <FileDropzone
            onFilesSelected={handleFilesSelected}
          />
        ) : (
          <div className="space-y-6">
            {/* 1. In-Place Upload Success Confirmation without popups */}
            <UploadedFileCard
              files={files}
              file={null}
              onReset={() => setFiles([])}
              nextStepTitle={files.length < 2 ? "첫 번째 PDF가 안전하게 등록되었습니다!" : "PDF 문서들이 안전하게 등록되었습니다!"}
              nextStepHint={
                files.length < 2
                  ? "합치기를 진행하려면 문서를 1개 더 추가해 주세요. 🐾"
                  : "순서를 확인하신 후 아래 [합치기 시작] 버튼을 눌러주세요."
              }
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>선택된 문서 ({files.length}개)</span>
                  {files.length < 2 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700 animate-pulse">
                      ⚠️ 1개 더 필요
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-slate-500">
                      위/아래 화살표를 눌러 병합 순서를 바꿀 수 있습니다.
                    </span>
                  )}
                </h3>
              </div>

              {/* Add more files button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-xl transition-all shrink-0 ${
                  files.length < 2
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-300 animate-pulse"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{files.length < 2 ? "두 번째 파일 추가하기" : "파일 추가하기"}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => {
                  if (e.target.files) handleFilesSelected(Array.from(e.target.files));
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>

            {/* Mascot Action Guide */}
            {!mergedBlob && (
              files.length < 2 ? (
                <MascotActionNotice
                  mood="ready"
                  title="합칠 문서를 1개 더 추가해 주세요! 🐾"
                  description="PDF 합치기는 최소 2개 이상의 문서를 결합하는 기능입니다. 아래 [+ 두 번째 PDF 추가하기] 카드를 클릭하거나 파일을 끌어다 놓으세요!"
                  actionHint="합칠 다음 PDF 문서를 1개 더 선택하세요"
                  className="bg-gradient-to-r from-amber-50/90 via-rose-50/70 to-orange-50/80 border border-amber-300/80"
                />
              ) : (
                <MascotActionNotice
                  mood="ready"
                  title={`PDF 문서 ${files.length}개가 안전하게 첨부되었습니다!`}
                  description="화살표를 눌러 병합 순서를 원하는 대로 조정한 후, 아래 [PDF 합치기 시작] 버튼을 눌러주세요!"
                  actionHint={`순서 확인 후 [👉 PDF ${files.length}개 하나로 합치기 시작] 클릭`}
                />
              )
            )}

            {/* File List */}
            <div className="grid grid-cols-1 gap-3 max-h-[480px] overflow-y-auto pr-1">
              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{file.name}</div>
                      <div className="text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>

                  {/* Order controls & delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveFile(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="위로 이동"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFile(idx, "down")}
                      disabled={idx === files.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="아래로 이동"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(idx)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 ml-1"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Slot 2 Invitation Card when only 1 file is present */}
              {files.length === 1 && (
                <div
                  onDragEnter={handleSlotDragEnter}
                  onDragOver={handleSlotDragOver}
                  onDragLeave={handleSlotDragLeave}
                  onDrop={handleSlotDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative cursor-pointer border-2 border-dashed rounded-2xl p-5 sm:p-6 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md ${
                    isSlotDragOver
                      ? "border-rose-500 bg-rose-100/90 ring-4 ring-rose-400 scale-[1.01]"
                      : "border-rose-400 bg-gradient-to-r from-rose-50/90 via-amber-50/50 to-rose-50/90 hover:border-rose-500 hover:bg-rose-100/60 ring-4 ring-rose-300/60 animate-pulse"
                  }`}
                >
                  <div className="flex items-center gap-3.5 pointer-events-none min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-rose-600/30 group-hover:scale-110 transition-transform shrink-0">
                      2
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 flex-wrap">
                        <span>➕ 합칠 두 번째 PDF 파일 추가하기</span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white">
                          필수 (1개 더 필요)
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        여기를 클릭하거나 파일을 끌어다 놓으세요. (여러 개를 한 번에 추가해도 됩니다)
                      </p>
                    </div>
                  </div>

                  <div className="pointer-events-none shrink-0 w-full sm:w-auto">
                    <span className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 group-hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5">
                      <UploadCloud className="w-4 h-4" />
                      <span>두 번째 파일 선택하기</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Compact dashed card when 2 or more files are present to easily add more */}
              {files.length >= 2 && (
                <div
                  onDragEnter={handleSlotDragEnter}
                  onDragOver={handleSlotDragOver}
                  onDragLeave={handleSlotDragLeave}
                  onDrop={handleSlotDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group cursor-pointer border-2 border-dashed rounded-2xl p-3.5 transition-all flex items-center justify-center gap-2 text-xs font-bold ${
                    isSlotDragOver
                      ? "border-rose-500 bg-rose-100 text-rose-700"
                      : "border-slate-200 hover:border-rose-400 bg-slate-50/50 hover:bg-rose-50/50 text-slate-500 hover:text-rose-600"
                  }`}
                >
                  <Plus className="w-4 h-4 pointer-events-none" />
                  <span className="pointer-events-none">문서 더 추가하기 (클릭 또는 파일 드래그)</span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <StepBadge
                  step={1}
                  label={
                    files.length < 2
                      ? "1단계: 합칠 두 번째 PDF 파일을 등록해 주세요"
                      : `1단계: 아래 버튼을 누르면 ${files.length}개 문서가 하나로 합쳐집니다!`
                  }
                  isCurrent={true}
                  isCompleted={false}
                />
                <button
                  onClick={() => setFiles([])}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors ml-2"
                >
                  전체 초기화
                </button>
              </div>

              {files.length < 2 ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-base rounded-2xl shadow-xl shadow-rose-600/30 ring-4 ring-rose-400/50 animate-pulse hover:scale-105 transition-all flex items-center justify-center gap-2.5"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>👉 두 번째 PDF 파일 추가하기 (클릭)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleMerge}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-base rounded-2xl shadow-xl shadow-rose-600/30 ring-4 ring-rose-400/50 animate-pulse hover:scale-105 transition-all flex items-center justify-center gap-2.5"
                >
                  <FileText className="w-5 h-5" />
                  <span>👉 PDF {files.length}개 하나로 합치기 시작</span>
                </button>
              )}
            </div>

            {/* Success Download Box */}
            {mergedBlob && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="PDF 병합이 성공적으로 완료되었습니다!"
                  description="모든 문서들이 지정한 순서대로 하나로 합쳐졌습니다. 아래 [합쳐진 PDF 다운로드] 버튼을 눌러 새 문서를 저장하세요!"
                  actionHint="[합쳐진 PDF 다시 다운로드] 버튼을 클릭하세요"
                  className="border-0 bg-transparent p-0 flex-1 shadow-none"
                />
                <button
                  onClick={() => downloadBlob(mergedBlob, `merged_${Date.now()}.pdf`)}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4" />
                  <span>합쳐진 PDF 다시 다운로드</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mid Page Ad Slot */}
      <AdBanner format="horizontal" />

      {/* SEO & AEO Optimized How-To Section */}
      <HowToSection toolName="PDF 합치기" steps={howToSteps} />

      {/* Bottom Ad Slot */}
      <AdBanner format="responsive" />

      {/* AEO Optimized FAQ Section (JSON-LD FAQPage included) */}
      <FaqSection
        title="PDF 합치기 자주 묻는 질문"
        subtitle="로그인 없이 안전하게 문서를 병합하는 방법에 대한 궁금증을 풀어드립니다."
        items={faqItems}
      />

      {/* Loading Modal with In-Process Ad */}
      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="PDF 문서들을 안전하게 병합하고 있습니다..."
      />
    </div>
  );
}
