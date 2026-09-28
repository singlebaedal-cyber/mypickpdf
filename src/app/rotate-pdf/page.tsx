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
import { reportAppError } from "@/lib/app-events";
import { rotatePDF, downloadBlob, getPDFPageCount } from "@/lib/pdf-utils";
import { RotateCw, RotateCcw, Download, CheckCircle, RefreshCw, FileText } from "lucide-react";

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotatedBlob, setRotatedBlob] = useState<Uint8Array | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setRotatedBlob(null);
    setRotation(0);

    try {
      const count = await getPDFPageCount(pdfFile);
      setPageCount(count);
    } catch {
      setPageCount(1);
    }
  };

  const handleRotate = async () => {
    if (!file) return;
    if (rotation === 0) {
      reportAppError({
        toolId: "rotate-pdf",
        toolName: "PDF 회전 & 바로잡기",
        errorMessage: "회전 각도가 선택되지 않았습니다.",
        technicalDetails: "각도 버튼을 1회 이상 클릭하여 회전 각도를 지정해 주세요.",
        suggestedAction: "1단계 회전 버튼 클릭 안내",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(30);

      const result = await rotatePDF(file, rotation);
      setProgress(100);
      setRotatedBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `rotated_${file.name}`);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      reportAppError({
        toolId: "rotate-pdf",
        toolName: "PDF 회전 & 바로잡기",
        errorMessage: "PDF 회전 처리 중 오류가 발생했습니다.",
        technicalDetails: err?.message || String(err),
        suggestedAction: "PDF 회전 엔진 자동 복구",
        onRetry: () => handleRotate(),
      });
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 업로드",
      desc: "방향이 돌아가 있거나 거꾸로 스캔된 PDF 문서를 선택합니다.",
    },
    {
      step: 2,
      title: "회전 각도 클릭",
      desc: "시계방향(90°) 또는 반시계방향(90°) 버튼을 클릭하여 바른 방향으로 맞춥니다.",
    },
    {
      step: 3,
      title: "영구 회전 저장",
      desc: "[회전 저장하기]를 누르면 바르게 회전된 새 PDF 문서가 즉시 다운로드됩니다.",
    },
  ];

  const faqItems = [
    {
      question: "회전하여 저장하면 다른 컴퓨터나 스마트폰에서도 바르게 보이나요?",
      answer: "네! 브라우저의 일시적인 보기 설정이 아니라, PDF 문서 내부의 페이지 회전 메타데이터 자체를 영구적으로 수정하여 저장하므로 모든 기기에서 바르게 열립니다.",
    },
    {
      question: "품질 저하가 발생하나요?",
      answer: "아닙니다. 텍스트나 이미지를 재압축하는 것이 아니라 회전 각도 정보만 변경하므로 화질 손실이 0%입니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="rotate"
      />

      <AdBanner format="horizontal" />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
        {!file ? (
          <FileDropzone
            onFilesSelected={handleFileSelected}
            multiple={false}
          />
        ) : (
          <div className="space-y-6">
            {/* 1. In-Place Upload Success Confirmation without popups */}
            <UploadedFileCard
              file={file}
              pageCount={pageCount}
              onReset={() => {
                setFile(null);
                setRotatedBlob(null);
                setRotation(0);
              }}
              nextStepTitle="PDF 문서가 안전하게 등록되었습니다!"
              nextStepHint={rotation === 0 ? "먼저 1단계 회전 버튼을 눌러 각도를 맞춰주세요!" : "2단계 저장 버튼을 눌러 새 PDF를 다운로드하세요."}
            />

            {/* 2. Visual Rotation Preview Box with Step 1 Highlighting */}
            <div className="py-10 px-4 flex flex-col items-center justify-center bg-slate-50/70 rounded-3xl border border-slate-200 space-y-6">
              {/* Step 1 Badge */}
              <div className="flex flex-col items-center gap-1.5">
                <StepBadge
                  step={1}
                  label={rotation === 0 ? "1단계: 먼저 아래 회전 버튼을 클릭하세요!" : `1단계 완료: 회전 각도 (+${rotation}°)`}
                  isCompleted={rotation !== 0}
                  isCurrent={rotation === 0}
                />
                <span className="text-xs text-slate-500 text-center max-w-md">
                  {rotation === 0
                    ? "문서가 바른 방향이 될 때까지 왼쪽 또는 오른쪽 회전 버튼을 눌러주세요."
                    : "원하는 방향으로 알맞게 돌아갔습니다! 이제 아래 2단계 저장 버튼을 누르시면 됩니다."}
                </span>
              </div>

              {/* Centered Preview Sheet */}
              <div
                className="w-44 h-60 bg-white border-2 border-slate-300 rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 transition-transform duration-300 relative select-none"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <FileText className="w-14 h-14 text-rose-500 mb-2" />
                <div className="w-20 h-2 bg-slate-200 rounded-full mb-1.5"></div>
                <div className="w-24 h-2 bg-slate-200 rounded-full mb-1.5"></div>
                <div className="w-16 h-2 bg-slate-200 rounded-full"></div>
                <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                  PDF
                </span>
              </div>

              {/* Rotation Action Buttons with clear visual highlights */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                    rotation === 0
                      ? "bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-300 ring-2 ring-rose-200 hover:scale-105"
                      : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>왼쪽으로 90° 회전</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                    rotation === 0
                      ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white border-2 border-rose-600 ring-4 ring-rose-300 animate-pulse hover:scale-105 shadow-rose-500/30"
                      : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  <RotateCw className={`w-4 h-4 ${rotation === 0 ? "text-white" : "text-rose-600"}`} />
                  <span>오른쪽으로 90° 회전 (가장 많이 씀)</span>
                </button>
              </div>
            </div>

            {/* 3. Step 2 Save Button Area with Dynamic Highlighting */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <StepBadge
                  step={2}
                  label={rotation !== 0 ? "2단계: 최종 저장하기" : "2단계: 회전 선택 후 저장"}
                  isCurrent={rotation !== 0}
                  isCompleted={false}
                />
                <span className="text-xs text-slate-500">
                  {rotation !== 0 ? "방향이 마음에 드시면 저장을 눌러 다운로드하세요!" : "각도를 1회 이상 변경하면 저장 버튼이 활성화됩니다."}
                </span>
              </div>

              <button
                onClick={handleRotate}
                disabled={rotation === 0}
                className={`w-full sm:w-auto px-10 py-4 font-black text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                  rotation !== 0
                    ? "bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-700 hover:to-red-700 text-white ring-4 ring-rose-300 shadow-rose-600/40 hover:scale-105 animate-pulse"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <RotateCw className="w-5 h-5" />
                <span>{rotation !== 0 ? `+${rotation}° 회전 상태로 영구 저장하기` : "회전 상태로 영구 저장하기"}</span>
              </button>
            </div>

            {rotatedBlob && (
              <div className="space-y-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="PDF 회전 저장이 성공적으로 완료되었습니다!"
                  description="올바른 방향으로 회전된 PDF가 준비되었습니다. 내 컴퓨터에 바로 저장하세요."
                  actionHint="아래 [회전 PDF 다시 다운로드] 버튼을 눌러 저장하세요!"
                />
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">회전 저장이 완료되었습니다!</h4>
                      <p className="text-xs text-emerald-700">다운로드가 시작되지 않았다면 버튼을 클릭하세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadBlob(rotatedBlob, `rotated_${file.name}`)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>회전 PDF 다시 다운로드</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="PDF 회전" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="PDF 회전 자주 묻는 질문"
        subtitle="기울어진 문서를 바로잡을 때 참고할 사항입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="PDF 각도 메타데이터를 영구 수정하고 있습니다..."
      />
    </div>
  );
}
