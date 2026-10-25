"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import DeepGuideSection from "@/components/DeepGuideSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { compressPdf, downloadBlob, CompressionLevel, CompressionResult } from "@/lib/pdf-utils";
import { 
  Minimize2, 
  Download, 
  RotateCcw, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Gauge, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Smartphone,
  Globe
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { getToolContent } from "@/lib/tool-content-data";
import RedPanda from "@/components/RedPanda";
import MascotActionNotice from "@/components/MascotActionNotice";
import UploadedFileCard from "@/components/UploadedFileCard";
import StepBadge from "@/components/StepBadge";
import { reportAppError } from "@/lib/app-events";

export default function CompressPdfPage() {
  const { t, lang } = useLanguage();
  const toolContent = getToolContent("compress-pdf", lang);
  const ui = toolContent.ui || {};
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("recommended");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfFile) {
      setFile(pdfFile);
      setResult(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleCompress = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(10);

      const res = await compressPdf(file, level, (p) => setProgress(p));
      setResult(res);
      setIsProcessing(false);

      const downloadName = `${file.name.replace(/\.[^/.]+$/, "")}_compressed.pdf`;
      downloadBlob(res.data, downloadName);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      reportAppError({
        toolId: "compress-pdf",
        toolName: "PDF 압축",
        errorMessage: "PDF 압축 중 오류가 발생했습니다. 암호가 걸려있거나 손상된 파일인지 확인해 주세요.",
        technicalDetails: err?.message || String(err),
        suggestedAction: "초고압축 Extreme 엔진 세션 활성화 및 복구",
        onRetry: () => handleCompress(),
      });
    }
  };



  const compressionOptions = [
    {
      id: "extreme" as CompressionLevel,
      title: "강력 압축",
      subtitle: "Extreme Compression",
      desc: "최소 파일 크기 • 최대 용량 절감 (약 60~80% 축소)",
      badge: "최대 절감",
      badgeColor: "bg-rose-100 text-rose-700",
      recommended: false,
    },
    {
      id: "recommended" as CompressionLevel,
      title: "권장 압축",
      subtitle: "Recommended",
      desc: "우수한 화질 유지 & 높은 용량 절감의 황금 균형",
      badge: "가장 추천",
      badgeColor: "bg-emerald-100 text-emerald-700",
      recommended: true,
    },
    {
      id: "less" as CompressionLevel,
      title: "가벼운 압축",
      subtitle: "Less Compression",
      desc: "고화질 인쇄 품질 유지 • 불필요한 메타데이터/스트림 정리",
      badge: "고화질",
      badgeColor: "bg-blue-100 text-blue-700",
      recommended: false,
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="compress"
      />

      <AdBanner format="horizontal" />

      {/* Main Tool Area */}
      <div className="my-8">
        {!file ? (
          <FileDropzone
            onFilesSelected={handleFilesSelected}
            accept=".pdf,application/pdf"
            multiple={false}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            {/* 1. In-Place Upload Success Confirmation without popups */}
            <UploadedFileCard
              file={file}
              onReset={() => {
                setFile(null);
                setResult(null);
              }}
              nextStepTitle="PDF 문서가 안전하게 등록되었습니다!"
              nextStepHint={`압축 모드를 선택하신 후 아래 [${ui.btn_compress || "PDF 압축하기"}] 버튼을 눌러주세요.`}
            />

            {/* Mascot Action Guide */}
            {!result && (
              <MascotActionNotice
                mood="ready"
                title="PDF 파일이 정상적으로 첨부되었어요!"
                description={`원하시는 압축 강도를 선택하신 후, 아래 [${ui.btn_compress || "PDF 압축하기"}] 버튼을 눌러 다음 단계로 진행하세요.`}
                actionHint={`압축 모드 선택 후 [${ui.btn_compress || "PDF 압축하기"}] 버튼을 클릭하세요`}
              />
            )}

            {/* Compression Options Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                압축 강도 선택
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {compressionOptions.map((opt) => {
                  const isSelected = level === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLevel(opt.id)}
                      className={`relative p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-rose-500 bg-rose-50/40 shadow-md ring-2 ring-rose-200/50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${opt.badgeColor}`}>
                            {opt.badge}
                          </span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-rose-600" />}
                        </div>
                        <h4 className="font-black text-slate-900 text-base">{opt.title}</h4>
                        <div className="text-[11px] text-slate-400 font-medium mb-2">{opt.subtitle}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action or Result Area */}
            {!result ? (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <StepBadge step={1} label="1단계: 아래 버튼을 누르면 즉시 초고속 압축이 시작됩니다!" isCurrent={true} />
                  <span className="text-xs text-slate-500 hidden sm:inline">100% 브라우저 메모리 안에서 안전 처리</span>
                </div>
                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-700 hover:to-red-700 text-white rounded-2xl font-black text-base shadow-xl shadow-rose-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 ring-4 ring-rose-400/40 animate-pulse hover:scale-105"
                >
                  <Minimize2 className="w-5 h-5" />
                  <span>👉 PDF 압축 시작하기</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* Success & Compression Stats Card */
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 space-y-6">
                <MascotActionNotice
                  mood="hooray"
                  title="PDF 압축이 성공적으로 완료되었습니다! 🎉"
                  description={`파일 용량이 ${result.ratio}% 절감되어 아주 가벼워졌습니다! (${formatFileSize(result.originalSize)} ➔ ${formatFileSize(result.compressedSize)}) 아래 버튼을 눌러 결과 파일을 스마트폰 또는 PC에 저장하세요.`}
                  actionHint="초록색 [파일 다운로드] 버튼을 누르면 즉시 저장됩니다"
                />

                {/* Size stats comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">압축 전 원본 크기</span>
                    <span className="text-lg font-black text-slate-700">{formatFileSize(result.originalSize)}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
                    <span className="text-[11px] font-bold text-emerald-600 block mb-1">압축 후 최종 크기</span>
                    <span className="text-xl font-black text-emerald-700">{formatFileSize(result.compressedSize)}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-xs flex flex-col justify-center">
                    <span className="text-[11px] font-bold text-emerald-100 block mb-0.5">절감률</span>
                    <div className="text-2xl font-black flex items-center gap-1">
                      <TrendingDown className="w-6 h-6 stroke-[3]" />
                      <span>{result.ratio}% 절감</span>
                    </div>
                  </div>
                </div>

                {/* Mobile & Cellular Data Reassurance Notice */}
                <div className="p-4 bg-white/90 border border-emerald-200/90 rounded-2xl flex items-start gap-3 text-left shadow-xs">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                      <span>📱 스마트폰 / 모바일 다운로드 안내</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">데이터 안심</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      와이파이(Wi-Fi)는 물론 <strong>LTE/5G 모바일 데이터(셀룰러)</strong> 환경에서도 안심하고 다운로드하세요. 이미 파일 크기가 대폭 압축되어 데이터 소모가 거의 없습니다. (약 {formatFileSize(result.compressedSize)})
                    </p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      ※ 카카오톡 등 메신저 앱으로 접속하신 경우, 아래 <strong>[다운로드]</strong>를 누르시면 스마트폰의 '내 파일' 또는 '공유' 창을 통해 1초 만에 안전하게 저장됩니다.
                    </p>
                  </div>
                </div>

                {/* Download Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      const downloadName = `${file.name.replace(/\.[^/.]+$/, "")}_compressed.pdf`;
                      downloadBlob(result.data, downloadName);
                    }}
                    className="flex-1 sm:flex-none px-7 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-sm sm:text-base shadow-md shadow-emerald-200 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>📥 압축된 PDF 파일 다운로드</span>
                  </button>
                  <button
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                    }}
                    className="px-5 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>새 파일 압축</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="PDF 파일 크기를 최적화하고 있습니다..."
      />

      <AdBanner format="horizontal" />

      <HowToSection toolSlug="compress-pdf" />

      <DeepGuideSection toolSlug="compress-pdf" />

      <FaqSection toolSlug="compress-pdf" />
    </div>
  );
}
