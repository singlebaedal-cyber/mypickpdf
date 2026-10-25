"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import { pdfToImageZip, downloadBlob, getPDFPageCount } from "@/lib/pdf-utils";
import { FileText, Download, CheckCircle, RefreshCw, Archive } from "lucide-react";

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setZipBlob(null);

    try {
      const count = await getPDFPageCount(pdfFile);
      setPageCount(count);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(5);

      const resultBlob = await pdfToImageZip(file, (p) => setProgress(p));
      setZipBlob(resultBlob);
      setIsProcessing(false);

      const zipFilename = `${file.name.replace(/\.[^/.]+$/, "")}_images.zip`;
      downloadBlob(resultBlob, zipFilename, "application/zip");
    } catch (err) {
      console.error(err);
      alert("PDF를 이미지로 변환하는 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 파일 선택",
      desc: "이미지로 변환할 문서를 드래그 앤 드롭으로 업로드합니다.",
    },
    {
      step: 2,
      title: "고화질 렌더링",
      desc: "브라우저 엔진이 PDF의 각 페이지를 2배 고해상도 JPG 이미지로 신속하게 렌더링합니다.",
    },
    {
      step: 3,
      title: "ZIP 압축 다운로드",
      desc: "변환된 모든 페이지가 담긴 깔끔한 ZIP 압축 파일이 자동으로 다운로드됩니다.",
    },
  ];

  const faqItems = [
    {
      question: "변환된 이미지의 화질은 선명한가요?",
      answer: "네, 일반 웹 캡처와 달리 2배 확대 고해상도(Retina 급 2x Scale)로 렌더링하여 작은 글씨와 도표도 흐려짐 없이 깨끗하게 저장됩니다.",
    },
    {
      question: "페이지가 수십 장인 대용량 PDF도 가능한가요?",
      answer: "네! 브라우저 메모리 안에서 페이지별로 순차 처리하여 ZIP 압축하므로 수십 페이지 문서도 무리 없이 변환됩니다.",
    },
    {
      question: "압축 파일(ZIP)은 스마트폰에서도 바로 열리나요?",
      answer: "네, 최신 iOS 및 안드로이드 기기는 기본 파일 앱에서 ZIP 파일을 터치 한 번으로 즉시 압축 해제하여 사진 갤러리에 저장할 수 있습니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="pdf_to_img"
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
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm truncate max-w-sm">{file.name}</h4>
                  <p className="text-xs text-slate-500">
                    총 <span className="font-extrabold text-rose-600">{pageCount}</span>개 페이지 • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFile(null);
                  setZipBlob(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> 다른 문서 선택
              </button>
            </div>

            <MascotActionNotice
              mood="ready"
              title="PDF 문서가 준비되었습니다!"
              description="각 페이지를 고화질 JPG 이미지로 렌더링한 후 ZIP 파일로 묶어 다운로드할 준비가 되었습니다."
              actionHint="우측 [이미지 변환 시작] 버튼을 눌러주세요!"
            />

            <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-100/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                  <Archive className="w-4 h-4 text-rose-600" /> 모든 페이지를 고화질 JPG(ZIP)로 변환
                </h4>
                <p className="text-xs text-slate-500">
                  총 {pageCount}장의 이미지가 생성되며 ZIP 파일로 일괄 다운로드됩니다.
                </p>
              </div>

              <button
                onClick={handleConvert}
                className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                <span>이미지 변환 시작</span>
              </button>
            </div>

            {zipBlob && (
              <div className="space-y-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="PDF ➔ JPG 변환 및 압축이 완료되었습니다!"
                  description="고해상도 이미지 ZIP 파일이 준비되었습니다. 내 컴퓨터에 바로 저장하세요."
                  actionHint="아래 [ZIP 다시 다운로드] 버튼을 눌러 저장하세요!"
                />
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">이미지 ZIP 다운로드 준비 완료</h4>
                      <p className="text-xs text-emerald-700">다운로드가 시작되지 않았다면 버튼을 클릭하세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadBlob(zipBlob, `${file.name}_images.zip`, "application/zip")}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>ZIP 다시 다운로드</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="PDF ➔ 이미지 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="PDF 이미지 변환 자주 묻는 질문"
        subtitle="문서를 이미지로 변환하여 보관하는 팁입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="PDF 각 페이지를 고화질 이미지로 렌더링하고 압축하는 중입니다..."
      />
    </div>
  );
}
