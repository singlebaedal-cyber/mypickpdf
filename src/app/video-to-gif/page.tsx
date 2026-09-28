"use client";

import { useState, useRef } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { encodeGif, GifFrame } from "@/lib/gif-encoder";
import { 
  FileVideo, 
  Download, 
  RotateCcw, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sliders,
  Smartphone
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import RedPanda from "@/components/RedPanda";
import MascotActionNotice from "@/components/MascotActionNotice";
import UploadedFileCard from "@/components/UploadedFileCard";
import StepBadge from "@/components/StepBadge";
import { reportAppError } from "@/lib/app-events";

export default function VideoToGifPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [durationSec, setDurationSec] = useState(3);
  const [targetWidth, setTargetWidth] = useState(360);
  const [fps, setFps] = useState(12);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    const videoFile = files.find((f) => 
      f.type.startsWith("video/") || 
      /\.(mp4|mov|webm|mkv|avi)$/i.test(f.name)
    );
    if (videoFile) {
      setFile(videoFile);
      setGifUrl(null);

      // Measure duration
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      const url = URL.createObjectURL(videoFile);
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        const d = Math.round(tempVideo.duration) || 5;
        setVideoDuration(d);
        setDurationSec(Math.min(5, d));
        URL.revokeObjectURL(url);
      };
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(5);

      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      const fileUrl = URL.createObjectURL(file);
      video.src = fileUrl;

      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve();
        video.onerror = () => reject(new Error("동영상 데이터를 불러올 수 없습니다."));
      });

      const origW = video.videoWidth || 640;
      const origH = video.videoHeight || 360;
      const aspect = origH / origW;

      const finalW = targetWidth;
      const finalH = Math.round((finalW * aspect) / 2) * 2;

      const canvas = document.createElement("canvas");
      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) {
        throw new Error("캔버스 컨텍스트를 생성할 수 없습니다.");
      }

      const totalFrames = Math.round(durationSec * fps);
      const intervalSec = 1 / fps;
      const frames: GifFrame[] = [];
      const delayMs = Math.round(1000 / fps);

      for (let i = 0; i < totalFrames; i++) {
        const targetTime = startTime + i * intervalSec;
        if (targetTime > video.duration) break;

        video.currentTime = targetTime;
        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            video.removeEventListener("seeked", onSeeked);
            resolve();
          };
          video.addEventListener("seeked", onSeeked);
        });

        ctx.drawImage(video, 0, 0, finalW, finalH);
        const imgData = ctx.getImageData(0, 0, finalW, finalH);
        frames.push({
          data: imgData,
          delayMs,
        });

        setProgress(Math.round(((i + 1) / totalFrames) * 80));
      }

      setProgress(85);
      // Encode GIF
      const gifBlob = encodeGif(finalW, finalH, frames);
      const url = URL.createObjectURL(gifBlob);

      setGifUrl(url);
      setGifSize(gifBlob.size);
      setProgress(100);
      setIsProcessing(false);
      URL.revokeObjectURL(fileUrl);

      // Auto download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.[^/.]+$/, "")}_mypick.gif`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      reportAppError({
        toolId: "video-to-gif",
        toolName: "동영상 GIF 변환",
        errorMessage: "GIF 변환 중 오류가 발생했습니다. 지원되는 영상(MP4, MOV, WebM)인지 확인해 주세요.",
        technicalDetails: err?.message || String(err),
        suggestedAction: "구간 길이를 3초 이하로 줄여 재시도",
        onRetry: () => handleConvert(),
      });
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "동영상 파일 선택",
      desc: "움짤(GIF)로 만들고 싶은 MP4, MOV, WebM 영상을 화면에 올립니다.",
    },
    {
      step: 2,
      title: "구간 및 프레임 설정",
      desc: "원하는 재생 시작 시간, 길이(초), 해상도(320px~480px), FPS를 간편하게 조절합니다.",
    },
    {
      step: 3,
      title: "GIF 생성 및 저장",
      desc: "[GIF 변환하기]를 누르면 브라우저에서 실시간으로 프레임을 인코딩하여 GIF 파일이 자동 다운로드됩니다.",
    },
  ];

  const faqItems = [
    {
      question: "GIF 변환 시 권장하는 길이와 해상도는 얼마인가요?",
      answer: "웹 커뮤니티나 카카오톡 전송 시에는 3~5초 길이, 360px 해상도, 12 FPS 설정이 5MB 미만으로 가장 빠르고 부드럽게 잘 작동합니다.",
    },
    {
      question: "동영상이 서버로 업로드되나요?",
      answer: "아닙니다! 100% 사용자의 브라우저 메모리(HTML5 Canvas)에서 프레임을 직접 추출하여 GIF89a 표준으로 인코딩하므로 어떤 영상도 외부로 전송되지 않습니다.",
    },
    {
      question: "스마트폰에서도 GIF 움짤 생성이 되나요?",
      answer: "네! 아이폰 및 갤럭시 등 모든 모바일 기기 브라우저에서 갤러리 영상을 선택하여 별도 앱 없이 바로 GIF를 만들 수 있습니다.",
    },
  ];

  return (
    <div className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <ToolHeader
        toolKey="video_to_gif"
      />

      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
        {!file ? (
          <div>
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              accept="video/*,.mp4,.mov,.webm,.mkv,.avi"
              multiple={false}
            />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% 기기 로컬 처리 (서버 저장 없음)
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                무한 반복(Loop) GIF89a 표준 규격
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-500" />
                모바일(아이폰/갤럭시) 완벽 지원
              </span>
            </div>
          </div>
        ) : !gifUrl ? (
          <div className="space-y-6">
            <UploadedFileCard
              file={file}
              onReset={() => setFile(null)}
            />

            {/* GIF Settings */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Sliders className="w-4 h-4 text-rose-600" />
                <span>GIF 변환 옵션 설정</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Start Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    시작 시점 (초)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, videoDuration - 1)}
                    step="0.5"
                    value={startTime}
                    onChange={(e) => setStartTime(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-rose-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">전체 영상: {videoDuration}초</span>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    GIF 길이 (초)
                  </label>
                  <select
                    value={durationSec}
                    onChange={(e) => setDurationSec(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-rose-500"
                  >
                    <option value={2}>2초 (초경량 짤)</option>
                    <option value={3}>3초 (가장 추천)</option>
                    <option value={5}>5초 (표준 길이)</option>
                    <option value={7}>7초 (긴 영상)</option>
                  </select>
                </div>

                {/* Target Width */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    해상도 (가로 너비)
                  </label>
                  <select
                    value={targetWidth}
                    onChange={(e) => setTargetWidth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-rose-500"
                  >
                    <option value={280}>280px (댓글/메신저용)</option>
                    <option value={360}>360px (표준 추천)</option>
                    <option value={480}>480px (고화질 블로그용)</option>
                  </select>
                </div>

                {/* FPS */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    초당 프레임 (FPS)
                  </label>
                  <select
                    value={fps}
                    onChange={(e) => setFps(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-rose-500"
                  >
                    <option value={8}>8 FPS (가장 가벼운 용량)</option>
                    <option value={12}>12 FPS (자연스러운 움직임)</option>
                    <option value={15}>15 FPS (매우 부드러움)</option>
                  </select>
                </div>
              </div>
            </div>

            <MascotActionNotice
              mood="ready"
              title="움직이는 GIF 움짤로 변환할 준비 완료!"
              description="동영상에서 프레임을 캡처하여 끊김 없는 무한 루프 GIF를 생성합니다."
            />

            {/* Convert CTA Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleConvert}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Sparkles className="w-5 h-5" />
                <span>GIF 움짤 생성하기</span>
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
              <span>GIF 변환 완료!</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              움직이는 GIF 생성이 완료되었습니다! 🎉
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              완성된 GIF 파일 크기: <span className="font-bold text-slate-900">{formatFileSize(gifSize)}</span>
            </p>

            {/* GIF Preview */}
            <div className="max-w-md mx-auto mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-3 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gifUrl}
                alt="Generated GIF"
                className="max-h-[360px] rounded-xl object-contain shadow-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <a
                href={gifUrl}
                download={`${file.name.replace(/\.[^/.]+$/, "")}_mypick.gif`}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Download className="w-5 h-5" />
                <span>GIF 다시 다운로드</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setGifUrl(null);
                }}
                className="py-4 px-6 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다른 영상 변환</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="동영상 프레임을 캡처하고 GIF89a 표준 애니메이션을 생성하고 있습니다."
      />

      <AdBanner format="horizontal" />

      <HowToSection
        toolName="동영상 GIF 변환"
        steps={howToSteps}
      />

      <FaqSection
        title="동영상 GIF 변환 자주 묻는 질문 (FAQ)"
        subtitle="재생 시간, 용량, 화질 설정에 대한 안내입니다."
        items={faqItems}
      />
    </div>
  );
}
