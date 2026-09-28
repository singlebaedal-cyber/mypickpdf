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
import { addWatermarkToPDF, downloadBlob, getPDFPageCount, WatermarkOptions } from "@/lib/pdf-utils";
import { Shield, Download, CheckCircle, RefreshCw, FileText, Coffee, Sparkles } from "lucide-react";
import { reportAppError } from "@/lib/app-events";

export default function AddWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [watermarkText, setWatermarkText] = useState<string>("대외비");
  const [opacity, setOpacity] = useState<number>(0.25);
  const [fontSize, setFontSize] = useState<number>(48);
  const [rotation, setRotation] = useState<number>(45);
  const [color, setColor] = useState<WatermarkOptions["color"]>("gray");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Uint8Array | null>(null);
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);

  const quickPresets = ["대외비", "CONFIDENTIAL", "복사금지", "SAMPLE", "개인정보보호", "초안 (DRAFT)"];

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

  const handleAddWatermark = async () => {
    if (!file || !watermarkText.trim()) {
      alert("워터마크로 삽입할 문구를 입력해 주세요.");
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(20);

      const result = await addWatermarkToPDF(
        file,
        {
          text: watermarkText.trim(),
          opacity,
          fontSize,
          rotation,
          color,
        },
        (prog) => setProgress(prog)
      );

      setResultBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `watermarked_${file.name}`);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      reportAppError({
        toolId: "add-watermark",
        toolName: "PDF 워터마크 추가",
        errorMessage: "워터마크 삽입 중 오류가 발생했습니다.",
        technicalDetails: err?.message || String(err),
        suggestedAction: "래서팬더 AI 고해상도 2D 캔버스 그래픽 가속 모드로 즉각 자동 복구",
        onRetry: () => handleAddWatermark(),
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
      desc: "워터마크를 삽입할 회사 문서, 계약서, 기밀 PDF를 선택합니다.",
    },
    {
      step: 2,
      title: "문구 및 스타일 설정",
      desc: "'대외비', '복사금지' 등 원하는 문구와 투명도(은은하게/진하게), 각도를 조절합니다.",
    },
    {
      step: 3,
      title: "보안 PDF 다운로드",
      desc: "[워터마크 추가하기]를 누르면 안전하게 보호된 새 PDF 문서가 즉시 다운로드됩니다.",
    },
  ];

  const faqItems = [
    {
      question: "워터마크 때문에 원본 본문 글자가 안 읽히면 어떡하죠?",
      answer: "투명도를 15%~25%(기본값)로 설정하시면 배경에 은은하게 인쇄되어 본문 가독성에 전혀 지장을 주지 않습니다.",
    },
    {
      question: "대외비나 기밀 문서인데 외부에 유출되지 않나요?",
      answer: "mypickpdf는 100% 브라우저 메모리 로컬에서 작동하므로 파일이 어떤 서버로도 전송되지 않아 보안 감사에도 안심입니다.",
    },
    {
      question: "한글과 영문 모두 지원되나요?",
      answer: "네! 한글('대외비', '복사금지' 등)과 영문('CONFIDENTIAL', 'SAMPLE' 등) 모두 깨끗하게 삽입됩니다.",
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <ToolHeader
        toolKey="watermark"
      />

      <MascotActionNotice
        mood="ready"
        title="회사 대외비나 중요 문서를 래서팬더가 튼튼하게 보호해 드려요! 🐾🛡️"
        description="'대외비', '복사금지' 등 문구와 반투명 각도를 조절하여 1초 만에 워터마크를 인쇄합니다."
        actionHint="100% 브라우저 로컬 기밀 보장"
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
              nextStepHint="문구와 스타일을 확인하신 후 아래 버튼을 눌러주세요."
            />

            {/* Watermark Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Left Column: Text & Presets */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    워터마크 문구 입력
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="예: 대외비, CONFIDENTIAL, 복사금지"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">자주 쓰는 추천 문구:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setWatermarkText(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          watermarkText === preset
                            ? "bg-rose-50 border-rose-400 text-rose-700 font-bold"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time Visual Mini Preview Box */}
                <div className="p-4 rounded-2xl bg-slate-100 border border-dashed border-slate-300 relative h-32 flex items-center justify-center overflow-hidden select-none">
                  <span className="text-[10px] text-slate-400 absolute top-2 left-2.5 font-mono">미리보기 프리뷰</span>
                  <div
                    className="font-black text-center transition-all duration-200 pointer-events-none"
                    style={{
                      transform: `rotate(${rotation === 45 ? "-25deg" : "0deg"})`,
                      opacity: opacity,
                      fontSize: `${Math.min(32, fontSize * 0.55)}px`,
                      color:
                        color === "red"
                          ? "#dc2626"
                          : color === "blue"
                          ? "#2563eb"
                          : color === "black"
                          ? "#0f172a"
                          : "#64748b",
                    }}
                  >
                    {watermarkText || "워터마크 미리보기"}
                  </div>
                </div>
              </div>

              {/* Right Column: Style Options */}
              <div className="space-y-4">
                {/* Opacity Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    투명도 선택 (은은함 조절)
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { val: 0.15, label: "은은하게 (15%)" },
                      { val: 0.25, label: "보통 (25% - 추천)" },
                      { val: 0.45, label: "진하게 (45%)" },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setOpacity(item.val)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          opacity === item.val
                            ? "bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-2xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rotation Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    회전 각도
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { val: 45, label: "45° 대각선 (기본)" },
                      { val: 0, label: "0° 수평 (가로)" },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setRotation(item.val)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          rotation === item.val
                            ? "bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-2xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    색상
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[
                      { id: "gray", label: "회색", bg: "bg-slate-500" },
                      { id: "red", label: "빨강", bg: "bg-red-500" },
                      { id: "blue", label: "파랑", bg: "bg-blue-500" },
                      { id: "black", label: "검정", bg: "bg-slate-900" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setColor(item.id as any)}
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                          color === item.id
                            ? "bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-2xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${item.bg}`}></span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!resultBlob ? (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <StepBadge step={1} label="1단계: 아래 버튼을 누르면 즉시 워터마크가 삽입됩니다!" isCurrent={true} />
                  <span className="text-xs text-slate-500">한글/영문 고해상도 2D 그래픽 가속 인쇄</span>
                </div>
                <button
                  onClick={handleAddWatermark}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 via-rose-600 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black rounded-2xl shadow-xl shadow-rose-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 text-base ring-4 ring-rose-400/40 animate-pulse hover:scale-105"
                >
                  <Shield className="w-5 h-5" />
                  <span>👉 워터마크 삽입 & 다운로드 시작</span>
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-emerald-950">워터마크 삽입 완료!</h4>
                  <p className="text-xs text-emerald-700 mt-1">다운로드가 시작되지 않았다면 아래 버튼을 눌러주세요.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => downloadBlob(resultBlob, `watermarked_${file.name}`)}
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
      <HowToSection toolName="PDF 워터마크 추가" steps={howToSteps} />
      <FaqSection items={faqItems} />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="문서 전체에 정밀 워터마크를 렌더링하는 중입니다..."
      />

      <SponsorModal isOpen={isSponsorOpen} onClose={() => setIsSponsorOpen(false)} />
    </div>
  );
}
