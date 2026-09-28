"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import SponsorModal from "@/components/SponsorModal";
import UploadedFileCard from "@/components/UploadedFileCard";
import StepBadge from "@/components/StepBadge";
import { addPageNumbersToPDF, downloadBlob, getPDFPageCount, PageNumberOptions } from "@/lib/pdf-utils";
import { Hash, Download, CheckCircle, RefreshCw, FileText, Coffee } from "lucide-react";
import { reportAppError } from "@/lib/app-events";

export default function AddPageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [position, setPosition] = useState<PageNumberOptions["position"]>("bottom-center");
  const [format, setFormat] = useState<PageNumberOptions["format"]>("n");
  const [fontSize, setFontSize] = useState<number>(11);
  const [startNumber, setStartNumber] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Uint8Array | null>(null);
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);

  const handleFileSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setResultBlob(null);

    try {
      const count = await getPDFPageCount(pdfFile);
      setPageCount(count);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(20);

      const result = await addPageNumbersToPDF(
        file,
        {
          position,
          format,
          fontSize,
          startNumber,
        },
        (prog) => setProgress(prog)
      );

      setResultBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `numbered_${file.name}`);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      reportAppError({
        toolId: "add-page-numbers",
        toolName: "PDF 페이지 번호 매기기",
        errorMessage: "페이지 번호 추가 처리 중 오류가 발생했습니다.",
        technicalDetails: err?.message || String(err),
        suggestedAction: "페이지 번호 렌더링 파이프라인 자동 복구",
        onRetry: () => handleAddPageNumbers(),
      });
    }
  };

  const resetAll = () => {
    setFile(null);
    setResultBlob(null);
    setPageCount(0);
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 업로드",
      desc: "페이지 번호를 추가할 PDF 문서를 드래그하여 업로드합니다.",
    },
    {
      step: 2,
      title: "번호 위치 및 서식 선택",
      desc: "하단 중앙, 우측 하단 등 원하는 위치와 번호 표기 형식(1, 1/N 등)을 선택합니다.",
    },
    {
      step: 3,
      title: "즉시 다운로드",
      desc: "[페이지 번호 추가하기]를 누르면 번호가 선명하게 찍힌 새 PDF가 1초 만에 저장됩니다.",
    },
  ];

  const faqItems = [
    {
      question: "문서 내용 위에 글자가 겹쳐서 가려지지 않나요?",
      answer: "페이지 번호는 문서 상하단 여백(기본 25pt) 위치에 안전하게 인쇄되므로 본문 글자나 표를 가리지 않습니다.",
    },
    {
      question: "원본 PDF 파일이 서버로 전송되어 유출될 위험은 없나요?",
      answer: "mypickpdf는 100% 브라우저 메모리(Client-Side)에서 직접 번호를 인쇄하므로 파일이 외부 서버로 전송되지 않아 기밀 문서도 완벽하게 안전합니다.",
    },
    {
      question: "총 페이지 수 형식(예: 1 / 15)으로도 매길 수 있나요?",
      answer: "네! 번호 형식 옵션에서 '1 / N'을 선택하시면 전체 페이지 수까지 한 번에 깔끔하게 표기됩니다.",
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <ToolHeader
        toolKey="page_numbers"
      />

      <MascotActionNotice
        mood="ready"
        title="보고서와 공문서에 깔끔하게 쪽번호를 매겨드려요! 🐾"
        description="하단 중앙, 우측 등 원하는 위치와 1/N 서식을 선택하면 래서팬더가 1초 만에 인쇄합니다."
        actionHint="100% 브라우저 로컬 안전 처리"
      />

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        {!file ? (
          <FileDropzone
            onFilesSelected={handleFileSelected}
            accept=".pdf,application/pdf"
            multiple={false}
          />
        ) : (
          <div className="space-y-6">
            {/* 1. In-Place Upload Success Confirmation without popups */}
            <UploadedFileCard
              file={file}
              pageCount={pageCount}
              onReset={resetAll}
              nextStepTitle="PDF 문서가 안전하게 등록되었습니다!"
              nextStepHint="번호 위치와 서식을 선택하신 후 아래 버튼을 눌러주세요."
            />

            {/* Configuration Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Position Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  번호 위치 선택
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  {[
                    { id: "top-left", label: "상단 좌측" },
                    { id: "top-center", label: "상단 중앙" },
                    { id: "top-right", label: "상단 우측" },
                    { id: "bottom-left", label: "하단 좌측" },
                    { id: "bottom-center", label: "하단 중앙 (추천)" },
                    { id: "bottom-right", label: "하단 우측" },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setPosition(pos.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        position === pos.id
                          ? "bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format & Size Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    번호 표기 형식
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: "n", label: "1, 2, 3..." },
                      { id: "n_of_total", label: "1 / N (총 페이지)" },
                      { id: "page_n", label: "Page 1" },
                      { id: "page_n_of_total", label: "Page 1 of N" },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setFormat(fmt.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          format === fmt.id
                            ? "bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-2xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">글꼴 크기</label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value={9}>작게 (9 pt)</option>
                      <option value={11}>보통 (11 pt - 기본)</option>
                      <option value={14}>크게 (14 pt)</option>
                    </select>
                  </div>

                  <div className="w-28 space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">시작 번호</label>
                    <input
                      type="number"
                      min={1}
                      value={startNumber}
                      onChange={(e) => setStartNumber(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!resultBlob ? (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <StepBadge step={1} label="1단계: 아래 버튼을 누르면 즉시 번호가 삽입됩니다!" isCurrent={true} />
                  <span className="text-xs text-slate-500">지정한 위치 및 서식으로 선명하게 인쇄</span>
                </div>
                <button
                  onClick={handleAddPageNumbers}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 via-rose-600 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black rounded-2xl shadow-xl shadow-rose-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 text-base ring-4 ring-rose-400/40 animate-pulse hover:scale-105"
                >
                  <Hash className="w-5 h-5" />
                  <span>👉 페이지 번호 매기기 & 다운로드 시작</span>
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-emerald-950">페이지 번호 삽입 완료!</h4>
                  <p className="text-xs text-emerald-700 mt-1">다운로드가 시작되지 않았다면 아래 버튼을 눌러주세요.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => downloadBlob(resultBlob, `numbered_${file.name}`)}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>다시 다운로드</span>
                  </button>
                  <button
                    onClick={resetAll}
                    className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>다른 파일 작업하기</span>
                  </button>
                  <button
                    onClick={() => setIsSponsorOpen(true)}
                    className="w-full sm:w-auto px-4 py-3 bg-orange-100 hover:bg-orange-200 text-orange-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Coffee className="w-4 h-4 text-orange-600" />
                    <span>래서팬더 간식 후원 ☕</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="PDF 페이지 번호 매기기" steps={howToSteps} />
      <FaqSection items={faqItems} />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="페이지 번호를 정밀하게 인쇄하는 중입니다..."
      />

      <SponsorModal isOpen={isSponsorOpen} onClose={() => setIsSponsorOpen(false)} />
    </div>
  );
}
