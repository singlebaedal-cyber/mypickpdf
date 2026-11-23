"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import DeepGuideSection from "@/components/DeepGuideSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import { downloadBlob, getPDFPageCount, parsePageRange } from "@/lib/pdf-utils";
import type { OcrLanguage, OcrMode, PdfOcrResult } from "@/lib/pdf-ocr";
import { FileSearch, Copy, Download, Check, RefreshCw, FileText, Sparkles, ScanLine, Zap, Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { getToolContent } from "@/lib/tool-content-data";

const OCR_LANGUAGES: { value: OcrLanguage; label: string }[] = [
  { value: "kor+eng", label: "한국어 + 영어 (추천)" },
  { value: "kor", label: "한국어 전용" },
  { value: "eng", label: "영어 전용" },
  { value: "jpn+eng", label: "일본어 + 영어" },
  { value: "chi_sim+eng", label: "중국어(간체) + 영어" },
];

export default function OcrPdfPage() {
  const { lang } = useLanguage();
  getToolContent("ocr-pdf", lang);

  const [file, setFile] = useState<File | null>(null);
  const [isImageFile, setIsImageFile] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [ocrMode, setOcrMode] = useState<OcrMode>("smart");
  const [ocrLang, setOcrLang] = useState<OcrLanguage>("kor+eng");
  const [pageRange, setPageRange] = useState<string>("");
  const [ocrResult, setOcrResult] = useState<PdfOcrResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("PDF 텍스트 및 스캔 이미지를 분석하고 있습니다...");
  const [isCopied, setIsCopied] = useState(false);

  const handleFileSelected = async (files: File[]) => {
    const picked = files.find((f) => {
      const lower = f.name.toLowerCase();
      return (
        f.type === "application/pdf" ||
        lower.endsWith(".pdf") ||
        f.type.startsWith("image/") ||
        /\.(png|jpe?g|webp|bmp)$/.test(lower)
      );
    });
    if (!picked) {
      alert("PDF 또는 이미지(JPG, PNG, WebP) 파일을 선택해 주세요.");
      return;
    }

    const isImg = picked.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp)$/i.test(picked.name);
    setFile(picked);
    setIsImageFile(isImg);
    setOcrResult(null);
    setPageRange("");

    if (isImg) {
      setPageCount(1);
      setOcrMode("ocr");
      return;
    }

    try {
      const count = await getPDFPageCount(picked);
      setPageCount(count);
    } catch (e) {
      console.error(e);
      setPageCount(0);
    }
  };

  const handleExtract = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(5);
      setProgressMsg("문서 분석 준비 중...");

      let pageIndices: number[] | undefined = undefined;
      if (!isImageFile && pageRange.trim() && pageCount > 0) {
        pageIndices = parsePageRange(pageRange.trim(), pageCount);
        if (pageIndices.length === 0) {
          alert(`유효한 페이지 범위를 입력해 주세요. (예: 1-3 또는 3 / 전체 ${pageCount}페이지)`);
          setIsProcessing(false);
          return;
        }
      }

      const { runPdfOcr } = await import("@/lib/pdf-ocr");
      const result = await runPdfOcr(
        file,
        {
          mode: isImageFile ? "ocr" : ocrMode,
          language: ocrLang,
          pageIndices,
        },
        ({ percent, message }) => {
          setProgress(percent);
          setProgressMsg(message);
        }
      );

      setOcrResult(result);
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "PDF/이미지에서 텍스트를 추출하는 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!ocrResult?.fullText) return;
    navigator.clipboard.writeText(ocrResult.fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!ocrResult?.fullText || !file) return;
    const blob = new Blob([ocrResult.fullText], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${file.name.replace(/\.[^/.]+$/, "")}_ocr_text.txt`, "text/plain");
  };

  const extractedText = ocrResult?.fullText || "";

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader toolKey="ocr" />

      <AdBanner format="horizontal" />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
        {!file ? (
          <FileDropzone
            onFilesSelected={handleFileSelected}
            accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
            multiple={false}
          />
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm truncate max-w-sm">{file.name}</h4>
                  <p className="text-xs text-slate-500">
                    {isImageFile ? "이미지 파일" : `총 ${pageCount}개 페이지`} • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <MascotActionNotice
                mood="ready"
                title="AI 스캔 OCR 및 텍스트 추출이 준비되었습니다!"
                description="서버 전송 없이 브라우저 내 Tesseract AI 엔진으로 스캔본·인증서 이미지 속 한글까지 정확하게 읽어냅니다."
                actionHint="원하는 모드를 선택한 뒤 [텍스트 추출 / OCR 시작] 버튼을 눌러주세요!"
              />

              <button
                onClick={() => {
                  setFile(null);
                  setOcrResult(null);
                  setPageRange("");
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> 다른 문서 선택
              </button>
            </div>

            {/* Mode & Language Controls */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-5">
              {!isImageFile && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2.5">
                    1. 추출 방식 선택
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setOcrMode("smart");
                        setOcrResult(null);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        ocrMode === "smart"
                          ? "bg-rose-50 border-rose-400 ring-2 ring-rose-200"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-rose-600" />
                        <span className="font-extrabold text-xs text-slate-900">스마트 자동 OCR (추천)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        일반 텍스트는 즉시 추출하고, 인증서·스캔 이미지가 포함된 페이지는 AI OCR로 자동 인식합니다.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOcrMode("ocr");
                        setOcrResult(null);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        ocrMode === "ocr"
                          ? "bg-rose-50 border-rose-400 ring-2 ring-rose-200"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <ScanLine className="w-4 h-4 text-indigo-600" />
                        <span className="font-extrabold text-xs text-slate-900">전체 스캔 정밀 OCR</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        모든 페이지를 고해상도 이미지로 렌더링해 스캔 서류·사진·도표 속 글자를 직접 인식합니다.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOcrMode("text");
                        setOcrResult(null);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        ocrMode === "text"
                          ? "bg-rose-50 border-rose-400 ring-2 ring-rose-200"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-amber-600" />
                        <span className="font-extrabold text-xs text-slate-900">초고속 텍스트 추출</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        디지털 PDF의 텍스트 레이어만 1초 만에 추출합니다. (이미지 내부 글자는 제외)
                      </p>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(ocrMode !== "text" || isImageFile) && (
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 mb-1.5">
                      <Languages className="w-3.5 h-3.5 text-rose-600" />
                      OCR 인식 언어
                    </label>
                    <select
                      value={ocrLang}
                      onChange={(e) => setOcrLang(e.target.value as OcrLanguage)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    >
                      {OCR_LANGUAGES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!isImageFile && pageCount > 1 && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      대상 페이지 지정 (선택 • 비워두면 전체 {pageCount}페이지)
                    </label>
                    <input
                      type="text"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      placeholder={`예: 3 또는 1-3, 5 (최대 ${pageCount})`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleExtract}
                  className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>
                    {ocrMode === "text" && !isImageFile ? "텍스트 레이어 빠른 추출 시작" : "AI OCR 텍스트 인식 시작"}
                  </span>
                </button>
              </div>
            </div>

            {ocrResult && (
              <div className="space-y-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="PDF 텍스트 추출 및 스캔 OCR이 완료되었습니다!"
                  description={`총 ${ocrResult.totalPagesProcessed}페이지 처리 완료 (텍스트 레이어 ${ocrResult.textLayerPageCount}p • AI 스캔 OCR ${ocrResult.ocrPageCount}p${ocrResult.avgConfidence !== undefined ? ` • 평균 신뢰도 ${ocrResult.avgConfidence}%` : ""})`}
                  actionHint="[클립보드 복사] 또는 [TXT로 저장]을 눌러 바로 활용하세요!"
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      추출 결과 (총 {extractedText.length.toLocaleString()}자)
                    </span>
                    {ocrResult.ocrPageCount > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200">
                        AI 스캔 OCR {ocrResult.ocrPageCount}페이지 인식
                      </span>
                    )}
                    {ocrResult.avgConfidence !== undefined && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                        평균 정확도 {ocrResult.avgConfidence}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors hover:scale-105"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? "복사됨!" : "클립보드 복사"}</span>
                    </button>
                    <button
                      onClick={handleDownloadTxt}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>TXT로 저장</span>
                    </button>
                  </div>
                </div>

                <textarea
                  readOnly
                  value={extractedText}
                  rows={16}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolSlug="ocr-pdf" />

      <DeepGuideSection toolSlug="ocr-pdf" />

      <AdBanner format="responsive" />
      <FaqSection toolSlug="ocr-pdf" />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message={progressMsg}
      />
    </div>
  );
}
