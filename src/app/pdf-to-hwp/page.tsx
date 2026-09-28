"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import UploadedFileCard from "@/components/UploadedFileCard";
import StepBadge from "@/components/StepBadge";
import RedPanda from "@/components/RedPanda";
import { reportAppError } from "@/lib/app-events";
import { getPDFPageCount } from "@/lib/pdf-utils";
import { convertPdfToHwpx, HwpxConversionResult } from "@/lib/hwpx-utils";
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  FileCheck,
  Building2,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function PdfToHwpPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<"hybrid" | "textOnly" | "imageOnly">("hybrid");
  const [targetExt, setTargetExt] = useState<"hwpx" | "hwp">("hwpx");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<HwpxConversionResult | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setResult(null);

    try {
      const count = await getPDFPageCount(pdfFile);
      setPageCount(count);
    } catch (e) {
      console.error("PDF page count check error:", e);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(5);

      const convResult = await convertPdfToHwpx(
        file,
        {
          mode,
          fontSize: 10.5,
          fontName: "함초롬바탕",
          includePageHeader: true,
        },
        (p) => setProgress(p)
      );

      setResult(convResult);
      setIsProcessing(false);

      // 자동 다운로드 실행
      downloadResultFile(convResult, targetExt);
    } catch (err: any) {
      console.error("PDF to HWPX conversion error:", err);
      setIsProcessing(false);
      reportAppError({
        toolId: "pdf-to-hwp",
        toolName: "PDF 한글(HWP/HWPX) 변환",
        errorMessage: "PDF를 한글 문서로 변환하는 중 오류가 발생했습니다.",
        technicalDetails: err?.message || String(err),
        suggestedAction: "텍스트 전용 모드 또는 다른 PDF 파일로 재시도",
        onRetry: () => handleConvert(),
      });
    }
  };

  const downloadResultFile = (res: HwpxConversionResult, ext: "hwpx" | "hwp") => {
    if (!file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const blob = ext === "hwpx" ? res.hwpxBlob : res.hwpBlob;
    const fileName = `${baseName}.${ext}`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 공문서 / 보고서 파일 선택",
      desc: "한글 문서(HWP/HWPX)로 변환하고 싶은 PDF 파일을 화면에 끌어다 놓거나 파일 선택 버튼을 클릭합니다.",
    },
    {
      step: 2,
      title: "변환 모드 및 확장자 선택",
      desc: "글자 수정과 원본 레이아웃을 모두 보존하는 [하이브리드 권장 모드]와 공공기관 표준 확장자(.hwpx 또는 .hwp)를 선택합니다.",
    },
    {
      step: 3,
      title: "한글 문서 변환 및 다운로드",
      desc: "[한글 문서로 변환하기]를 누르면 브라우저에서 안전하게 OWPML 표준 한글 파일로 변환되어 즉시 다운로드됩니다.",
    },
  ];

  const faqItems = [
    {
      question: "HWP와 HWPX 파일은 어떤 차이가 있나요?",
      answer: "HWPX는 2021년 4월부터 국가기술표준원(KS X 6101) 및 행정안전부 공공기관 전자문서 표준으로 지정된 차세대 개방형 한글 문서(OWPML) 포맷입니다. 한글 2014 이상, 한컴독스(Hancom Docs), 폴라리스 오피스, 온-나라 전자문서 시스템에서 기본으로 지원하며, 구형 관공서 제출용 시스템에는 .hwp 확장자로도 저장하여 제출할 수 있습니다.",
    },
    {
      question: "변환된 한글 문서에서 텍스트 수정 및 편집이 가능한가요?",
      answer: "네! PDF 내부의 텍스트가 한글 표준 문단으로 완벽히 추출되므로, 한글 프로그램에서 열어 오탈자 수정, 글자 서식 변경, 문단 추가 등 일반 한글 문서와 동일하게 자유롭게 편집할 수 있습니다.",
    },
    {
      question: "정부24, 나라장터, 공공기관 제출 서류도 유출 없이 안전한가요?",
      answer: "100% 안전합니다! mypickpdf는 변환 작업을 외부 서버로 전송하지 않고 사용자의 웹 브라우저 메모리 안에서만 로컬 처리합니다. 공공기관 제출 공문서, 계약서, 주민등록 등초본, 사업자등록증 등 민감한 개인정보나 기밀 문서도 안심하고 변환하실 수 있습니다.",
    },
    {
      question: "표나 관공서 직인(도장), 서명 이미지도 보존되나요?",
      answer: "네! '하이브리드 모드 (권장)'를 사용하시면 편집 가능한 텍스트 문단과 함께 고해상도 원본 레이아웃 스냅샷이 한글 문서 내에 함께 포함되어, 복잡한 표 서식이나 직인, 도장, 그래프 등의 시각적 요소가 완벽하게 유지됩니다.",
    },
  ];

  const conversionModes = [
    {
      id: "hybrid" as const,
      title: "하이브리드 모드 (강력 추천)",
      badge: "가장 추천",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      desc: "편집 가능한 텍스트 문단과 원본 서식/표/직인 고해상도 이미지를 함께 조립하여 서식 깨짐 없이 글자 수정 가능",
    },
    {
      id: "textOnly" as const,
      title: "텍스트 전용 모드 (초경량)",
      badge: "용량 최소화",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      desc: "이미지 없이 본문 텍스트만 추출하여 가장 가볍고 타이핑 및 레이아웃 재구성에 최적화된 한글 파일 생성",
    },
    {
      id: "imageOnly" as const,
      title: "스캔본 / 서식 보존형",
      badge: "원본 100%",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      desc: "글자가 깨지는 스캔본이나 복잡한 관공서 신청서 양식을 고화질 한글 문서 형태로 100% 원본 그대로 보존",
    },
  ];

  return (
    <div className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <ToolHeader
        toolKey="pdf_to_hwp"
      />

      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
        {!file ? (
          <div>
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              accept=".pdf,application/pdf"
              multiple={false}
            />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% 기기 로컬 처리 (공문서 유출 0%)
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                공공기관 온-나라 시스템 및 한글 2014~2024 호환
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                텍스트 편집 + 원본 서식 보존
              </span>
            </div>
          </div>
        ) : !result ? (
          <div className="space-y-6">
            {/* Uploaded File Info */}
            <UploadedFileCard
              file={file}
              pageCount={pageCount}
              onReset={() => setFile(null)}
            />

            {/* Step 2: Conversion Mode & Format Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <StepBadge step={2} label="변환 옵션 및 포맷 선택" />
                <span className="text-xs font-semibold text-slate-500">
                  원하는 변환 방식과 확장자를 선택하세요
                </span>
              </div>

              {/* Format Switcher (HWPX vs HWP) */}
              <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-rose-600" />
                    <span>저장할 파일 형식 선택</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    공공기관 공식 표준은 .hwpx이며, 구형 포털 제출용은 .hwp를 선택하세요.
                  </p>
                </div>

                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setTargetExt("hwpx")}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                      targetExt === "hwpx"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    .HWPX (공공기관 표준) 🌟
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetExt("hwp")}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                      targetExt === "hwp"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    .HWP (구버전 호환)
                  </button>
                </div>
              </div>

              {/* Mode Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {conversionModes.map((opt) => {
                  const isSelected = mode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMode(opt.id)}
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                            {opt.badge}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                          {opt.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-rose-200/60 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>선택됨</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Notice */}
            <MascotActionNotice
              mood="ready"
              title="마이픽 래서팬더가 한글 문서 조립을 준비했어요!"
              description="PDF의 문단, 줄바꿈, 제목을 공공기관 OWPML 표준 한글 규격으로 안전하게 변환해 드립니다."
            />

            {/* Convert CTA Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleConvert}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <FileText className="w-5 h-5" />
                <span>한글({targetExt.toUpperCase()}) 문서로 변환하기</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => setFile(null)}
                className="py-4 px-6 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>취소</span>
              </button>
            </div>
          </div>
        ) : (
          /* Conversion Complete View */
          <div className="text-center py-6">
            <div className="mb-4 inline-flex">
              <RedPanda mood="success" size={130} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-3 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>한글 문서 변환 완료!</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              편집 가능한 한글 문서가 생성되었습니다! 🎉
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              총 {result.pageCount}페이지({result.textLength.toLocaleString()}자)가 OWPML 한글 표준 문서로 안전하게 변환되었습니다.
            </p>

            {/* Text Preview Snippet */}
            {result.previewLines.length > 0 && (
              <div className="max-w-xl mx-auto mb-6 text-left p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>추출된 본문 텍스트 미리보기</span>
                </div>
                <div className="space-y-1 text-xs text-slate-700 font-mono bg-white p-3 rounded-xl border border-slate-200/60 max-h-36 overflow-y-auto">
                  {result.previewLines.slice(0, 6).map((line, idx) => (
                    <p key={idx} className="truncate">
                      {line}
                    </p>
                  ))}
                  {result.previewLines.length > 6 && (
                    <p className="text-slate-400 text-[11px] italic">... 외 다수 문단</p>
                  )}
                </div>
              </div>
            )}

            {/* Dual Download Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => downloadResultFile(result, "hwpx")}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-base shadow-lg shadow-rose-600/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>.HWPX 다운로드 (공식 표준)</span>
              </button>

              <button
                type="button"
                onClick={() => downloadResultFile(result, "hwp")}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>.HWP 다운로드 (구버전 호환)</span>
              </button>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors py-2 px-4 rounded-xl hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다른 PDF 문서 변환하기</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="PDF 문단을 분석하고 공공기관 OWPML 한글 문서를 조립하고 있습니다..."
      />

      {/* Ad slot */}
      <AdBanner format="horizontal" />

      {/* How To Steps */}
      <HowToSection
        toolName="PDF 한글(HWP/HWPX) 변환"
        steps={howToSteps}
      />

      {/* FAQ */}
      <FaqSection
        title="PDF 한글 변환 자주 묻는 질문 (FAQ)"
        subtitle="공공기관 공문서, 한컴오피스 한글 호환성에 대한 궁금증을 풀어드립니다."
        items={faqItems}
      />
    </div>
  );
}
