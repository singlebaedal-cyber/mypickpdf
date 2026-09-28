"use client";

import { useState, useRef } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { 
  compressVideo, 
  downloadVideoBlob, 
  VideoCompressionLevel, 
  VideoCompressionResult 
} from "@/lib/video-utils";
import { 
  Video, 
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
  PlayCircle
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import RedPanda from "@/components/RedPanda";
import MascotActionNotice from "@/components/MascotActionNotice";
import UploadedFileCard from "@/components/UploadedFileCard";
import StepBadge from "@/components/StepBadge";
import { reportAppError } from "@/lib/app-events";

export default function CompressVideoPage() {
  const { t, lang } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<VideoCompressionLevel>("recommended");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoCompressionResult | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const videoFile = files.find((f) => 
      f.type.startsWith("video/") || 
      /\.(mp4|mov|webm|mkv|avi)$/i.test(f.name)
    );
    if (videoFile) {
      setFile(videoFile);
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
      setProgress(5);

      const res = await compressVideo(file, {
        level,
        onProgress: (p) => setProgress(p),
      });

      setResult(res);
      setIsProcessing(false);

      // Auto trigger download
      downloadVideoBlob(res.blob, res.downloadName);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      reportAppError({
        toolId: "compress-video",
        toolName: t("tool_compress_video"),
        errorMessage: "Error compressing video. Please verify the video file is valid and playable.",
        technicalDetails: err?.message || String(err),
        suggestedAction: "Retry standard compression",
        onRetry: () => handleCompress(),
      });
    }
  };

  const howToSteps = lang === "ko" ? [
    {
      step: 1,
      title: "동영상 파일 선택",
      desc: "용량을 줄이고 싶은 MP4, MOV, WebM 동영상을 화면에 끌어다 놓거나 파일 선택 버튼으로 추가합니다.",
    },
    {
      step: 2,
      title: "압축 강도 선택",
      desc: "카카오톡/이메일 전송용(초강력 압축), 권장 압축(최적 밸런스), 고화질 보존(가벼운 압축) 중 원하는 수준을 선택합니다.",
    },
    {
      step: 3,
      title: "압축 & 다운로드",
      desc: "[동영상 압축하기]를 누르면 브라우저 하드웨어 가속으로 안전하게 압축되며 완성된 파일이 즉시 저장됩니다.",
    },
  ] : [
    {
      step: 1,
      title: "Select Video File",
      desc: "Drag & drop MP4, MOV, WebM or MKV videos into the box, or click the button to browse from your device.",
    },
    {
      step: 2,
      title: "Select Compression Level",
      desc: "Choose from Extreme (Chat & Email), Recommended (Optimal Balance), or High Quality (Light Compression).",
    },
    {
      step: 3,
      title: "Compress & Download",
      desc: "Click [Compress Video Now] and your browser will securely encode and download the reduced file immediately.",
    },
  ];

  const faqItems = lang === "ko" ? [
    {
      question: "동영상 압축 후 화질이 많이 깨지나요?",
      answer: "권장 압축 모드를 사용하시면 스마트폰 화면이나 PC 모니터에서 차이를 느끼기 어려운 높은 선명도를 유지하면서 불필요하게 높은 비트레이트와 해상도를 지능적으로 최적화합니다.",
    },
    {
      question: "업로드한 개인 동영상이 외부 서버로 유출되지 않나요?",
      answer: "절대 아닙니다! mypickpdf는 100% 브라우저 로컬 하드웨어 가속 인코딩 엔진을 사용하여 사용자의 기기 메모리 안에서만 영상을 압축합니다. 어떠한 동영상 데이터도 서버로 전송되지 않아 가족, 일상, 기밀 영상도 안심하고 사용할 수 있습니다.",
    },
    {
      question: "카카오톡 300MB 용량 제한이나 이메일 첨부파일 제한을 통과할 수 있나요?",
      answer: "네! '카카오톡/이메일 전송용 (초강력 압축)' 옵션을 선택하시면 최대 70~85%까지 용량을 대폭 줄여 메신저 전송이나 대용량 메일 첨부 기준을 가볍게 통과할 수 있습니다.",
    },
    {
      question: "스마트폰(아이폰/갤럭시)에서도 동영상 압축이 가능한가요?",
      answer: "네! 아이폰 Safari 및 안드로이드 Chrome 등 모바일 브라우저에서도 별도 앱 설치 없이 스마트폰 갤러리의 영상을 바로 선택하여 초고속으로 압축할 수 있습니다.",
    },
  ] : [
    {
      question: "Will video quality be severely degraded after compression?",
      answer: "With our Recommended mode, unnecessary high bitrates are intelligently optimized while maintaining crisp resolution and clarity that is virtually indistinguishable on phone and PC screens.",
    },
    {
      question: "Is my personal video uploaded to any external server?",
      answer: "Never! mypickpdf uses 100% in-browser client-side hardware-accelerated encoding. Your video never leaves your device memory, keeping personal and business videos completely safe and private.",
    },
    {
      question: "Can this pass messaging app and email attachment size limits?",
      answer: "Yes! Choose the 'Extreme (Chat & Email)' option to shrink video sizes by up to 70-85%, allowing you to breeze through file size limits.",
    },
    {
      question: "Does this work on mobile smartphones (iPhone & Android)?",
      answer: "Yes! You can use Safari on iPhone or Chrome on Android to select videos directly from your photo library without installing any third-party apps.",
    },
  ];

  const compressionOptions = [
    {
      id: "extreme",
      title: t("video_opt_extreme_title"),
      subtitle: t("video_opt_extreme_sub"),
      desc: t("video_opt_extreme_desc"),
      badge: t("video_opt_extreme_badge"),
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      icon: Zap,
    },
    {
      id: "recommended",
      title: t("video_opt_rec_title"),
      subtitle: t("video_opt_rec_sub"),
      desc: t("video_opt_rec_desc"),
      badge: t("video_opt_rec_badge"),
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: Gauge,
    },
    {
      id: "less",
      title: t("video_opt_less_title"),
      subtitle: t("video_opt_less_sub"),
      desc: t("video_opt_less_desc"),
      badge: t("video_opt_less_badge"),
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Sparkles,
    },
  ];

  return (
    <div className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <ToolHeader
        title={
          <span>
            {t("tool_compress_video")}{" "}
            <span className="inline-block text-slate-500 font-bold text-xl sm:text-2xl lg:text-3xl">
              ({t("video_header_sub")})
            </span>
          </span>
        }
        description={t("video_desc")}
        tag={t("video_tag")}
      />

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
        {!file ? (
          <div>
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              accept="video/*,.mp4,.mov,.webm,.mkv,.avi"
              multiple={false}
              title={t("video_drop_title")}
              subtitle={t("video_drop_subtitle")}
            />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {t("video_badge_local")}
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                {t("video_badge_hardware")}
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-500" />
                {t("video_badge_mobile")}
              </span>
            </div>
          </div>
        ) : !result ? (
          <div className="space-y-6">
            {/* Uploaded File Info */}
            <UploadedFileCard
              file={file}
              onReset={() => setFile(null)}
            />

            {/* Compression Options */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <StepBadge step={2} label={t("video_step_level")} />
                <span className="text-xs font-semibold text-slate-500">
                  {t("video_step_level_desc")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {compressionOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = level === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLevel(opt.id as VideoCompressionLevel)}
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                            {opt.badge}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-0.5">
                          {opt.title}
                        </h4>
                        <div className="text-xs font-bold text-rose-600 mb-2">
                          {opt.subtitle}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-rose-200/60 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t("video_selected")}</span>
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
              title={lang === "ko" ? "마이픽 래서팬더가 대기 중이에요!" : "Red Panda is ready to help!"}
              description={lang === "ko" ? "동영상을 화질 손실 없이 최적화하여 카카오톡이나 메일로 바로 보낼 수 있게 다이어트해 드릴게요." : "We'll optimize your video without losing quality so you can share it anywhere."}
            />

            {/* Compress CTA Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleCompress}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Zap className="w-5 h-5" />
                <span>{t("video_btn_compress")}</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => setFile(null)}
                className="py-4 px-6 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t("btn_reset")}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Compression Complete View */
          <div className="text-center py-6">
            <div className="mb-4 inline-flex">
              <RedPanda mood="success" size={130} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-3 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("video_result_title")}</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {lang === "ko" ? "용량이 대폭 줄어들었습니다! 🎉" : "Video Size Greatly Reduced! 🎉"}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              {t("video_result_desc")}
            </p>

            {/* Size Comparison Card */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left mb-4">
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-1">{t("video_original")}</div>
                  <div className="text-lg font-bold text-slate-700">
                    {formatFileSize(result.originalSize)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-emerald-600 font-medium mb-1">{t("video_compressed")}</div>
                  <div className="text-2xl font-black text-emerald-600">
                    {formatFileSize(result.compressedSize)}
                  </div>
                </div>
              </div>

              {/* Progress gauge visual */}
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${Math.max(10, 100 - result.ratio)}%` }} 
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  {t("video_saved")}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-sm font-black">
                  -{result.ratio}%
                </span>
              </div>
            </div>

            {/* Video Preview */}
            <div className="max-w-md mx-auto mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video flex items-center justify-center">
              <video
                src={result.url}
                controls
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Download & Reset Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => downloadVideoBlob(result.blob, result.downloadName)}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Download className="w-5 h-5" />
                <span>{t("btn_download_again")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="py-4 px-6 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t("video_btn_reset")}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message={t("video_compressing")}
      />

      {/* Ad slot */}
      <AdBanner format="horizontal" />

      {/* How To Steps */}
      <HowToSection
        toolName={t("tool_compress_video")}
        steps={howToSteps}
      />

      {/* FAQ */}
      <FaqSection
        title={lang === "ko" ? "동영상 압축 자주 묻는 질문 (FAQ)" : "Video Compression FAQ"}
        subtitle={lang === "ko" ? "압축 화질, 보안, 지원 형식에 대한 궁금증을 풀어드립니다." : "Answers about video quality, privacy, and supported formats."}
        items={faqItems}
      />
    </div>
  );
}
