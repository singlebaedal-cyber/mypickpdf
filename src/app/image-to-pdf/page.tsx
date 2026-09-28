"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import { imagesToPDF, downloadBlob } from "@/lib/pdf-utils";
import { Image as ImageIcon, Download, CheckCircle, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

export default function ImageToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);

  const handleImagesSelected = (newFiles: File[]) => {
    const validImages = newFiles.filter((f) => f.type.startsWith("image/"));
    setImages((prev) => [...prev, ...validImages]);
    setPdfBlob(null);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImgs = [...images];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newImgs.length) return;
    const temp = newImgs[index];
    newImgs[index] = newImgs[target];
    newImgs[target] = temp;
    setImages(newImgs);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    try {
      setIsProcessing(true);
      setProgress(10);

      const result = await imagesToPDF(images, { orientation }, (p) => setProgress(p));
      setPdfBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `images_to_pdf_${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert("이미지를 PDF로 변환하는 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "이미지 파일 추가",
      desc: "PDF로 만들고 싶은 JPG, PNG, WebP 사진들을 드래그하여 업로드합니다.",
    },
    {
      step: 2,
      title: "방향 및 순서 설정",
      desc: "세로/가로 용지 방향을 정하고, 사진들의 순서를 알맞게 조정합니다.",
    },
    {
      step: 3,
      title: "PDF 즉시 생성",
      desc: "[PDF로 변환하기]를 누르면 고화질 A4 규격 PDF로 즉시 병합되어 저장됩니다.",
    },
  ];

  const faqItems = [
    {
      question: "어떤 이미지 형식을 지원하나요?",
      answer: "JPG, JPEG, PNG, WebP, GIF 등 웹 브라우저에서 지원하는 모든 대표적인 이미지 형식을 PDF로 변환할 수 있습니다.",
    },
    {
      question: "이미지 화질이 저하되지는 않나요?",
      answer: "아닙니다. mypickpdf는 원본 이미지의 픽셀 해상도와 색감을 최대한 유지하면서 표준 A4 규격에 맞추어 최적화된 고화질 PDF를 생성합니다.",
    },
    {
      question: "여러 장의 사진을 1개의 PDF로 묶을 수 있나요?",
      answer: "네! 수십 장의 사진을 업로드하시면 사진 1장당 PDF 1페이지씩 차례대로 결합된 완성형 전자문서로 생성됩니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="img_to_pdf"
      />

      <AdBanner format="horizontal" />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
        {images.length === 0 ? (
          <FileDropzone
            onFilesSelected={handleImagesSelected}
            accept="image/*,.jpg,.jpeg,.png,.webp"
            multiple={true}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>선택된 이미지 ({images.length}장)</span>
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Orientation Selector */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                  <button
                    onClick={() => setOrientation("portrait")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      orientation === "portrait" ? "bg-white text-rose-600 shadow-xs" : "hover:text-slate-900"
                    }`}
                  >
                    세로 (Portrait)
                  </button>
                  <button
                    onClick={() => setOrientation("landscape")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      orientation === "landscape" ? "bg-white text-rose-600 shadow-xs" : "hover:text-slate-900"
                    }`}
                  >
                    가로 (Landscape)
                  </button>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors shrink-0">
                  <Plus className="w-4 h-4" />
                  <span>사진 추가</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) handleImagesSelected(Array.from(e.target.files));
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Mascot Action Guide */}
            {!pdfBlob && (
              <MascotActionNotice
                mood="ready"
                title={`사진 ${images.length}장이 준비되었습니다!`}
                description="용지 방향(세로/가로)을 선택하고 순서를 확인하신 뒤 [PDF로 변환 시작] 버튼을 눌러주세요."
                actionHint="용지 방향 설정 후 [PDF로 변환 시작] 클릭"
              />
            )}

            {/* Images Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-1">
              {images.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <ImageIcon className="w-5 h-5 text-rose-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveImage(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="앞으로 이동"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveImage(idx, "down")}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="뒤로 이동"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeImage(idx)}
                      className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setImages([])}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
              >
                전체 삭제
              </button>

              <button
                onClick={handleConvert}
                className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-5 h-5" />
                <span>PDF로 변환 시작</span>
              </button>
            </div>

            {/* Success Download */}
            {pdfBlob && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="이미지가 고화질 PDF로 변환 완료되었습니다!"
                  description="A4 규격에 맞춘 고화질 PDF가 완성되었습니다. 아래 다운로드 버튼을 눌러 저장하세요!"
                  actionHint="[PDF 다시 다운로드] 버튼을 클릭하세요"
                  className="border-0 bg-transparent p-0 flex-1 shadow-none"
                />
                <button
                  onClick={() => downloadBlob(pdfBlob, `converted_images_${Date.now()}.pdf`)}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF 다시 다운로드</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="이미지 ➔ PDF 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="이미지 PDF 변환 자주 묻는 질문"
        subtitle="사진을 PDF 문서로 묶는 기능에 대해 가장 많이 묻는 내용입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="이미지들을 고화질 PDF 문서로 패키징하고 있습니다..."
      />
    </div>
  );
}
