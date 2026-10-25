"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import { powerpointToPdf, downloadBlob } from "@/lib/pdf-utils";
import { Presentation, Download, CheckCircle, RefreshCw } from "lucide-react";

export default function PowerpointToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);

  const handleFileSelected = (files: File[]) => {
    const pptFile = files.find((f) => f.name.endsWith(".pptx") || f.name.endsWith(".ppt"));
    if (!pptFile) {
      alert("PowerPoint (.pptx) 파일을 선택해 주세요.");
      return;
    }
    setFile(pptFile);
    setPdfBlob(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(30);

      const result = await powerpointToPdf(file, (p) => setProgress(p));
      setPdfBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("PowerPoint 문서를 PDF로 변환하는 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "PPT 파일 업로드",
      desc: "발표용 파워포인트 (.pptx) 문서를 선택합니다.",
    },
    {
      step: 2,
      title: "슬라이드 렌더링",
      desc: "각 슬라이드를 16:9 와이드 비율의 고화질 가로형 PDF로 변환합니다.",
    },
    {
      step: 3,
      title: "PDF 다운로드",
      desc: "모바일이나 태블릿에서 바로 발표 가능한 전자문서로 다운로드합니다.",
    },
  ];

  const faqItems = [
    {
      question: "폰트가 없는 컴퓨터에서도 슬라이드가 똑같이 보이나요?",
      answer: "네! PDF로 변환하면 모든 컴퓨터, 아이폰, 안드로이드 기기에서 글꼴 깨짐 없이 발표자료 원본 그대로 열람할 수 있습니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="ppt_to_pdf"
      />

      <AdBanner format="horizontal" />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
        {!file ? (
          <FileDropzone
            onFilesSelected={handleFileSelected}
            accept=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            multiple={false}
          />
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Presentation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm truncate max-w-sm">{file.name}</h4>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>

              <MascotActionNotice
                mood="ready"
                title="PowerPoint 슬라이드가 안전하게 준비되었습니다!"
                description="슬라이드 텍스트 및 개체를 분석하여 가로형 고품질 PDF로 즉시 변환합니다."
                actionHint="우측 하단 [PDF로 변환 시작] 버튼을 눌러주세요!"
              />

              <button
                onClick={() => {
                  setFile(null);
                  setPdfBlob(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> 다른 슬라이드 선택
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleConvert}
                className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Presentation className="w-5 h-5" />
                <span>PDF로 변환 시작</span>
              </button>
            </div>

            {pdfBlob && (
              <div className="space-y-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="PowerPoint ➔ PDF 변환이 완료되었습니다!"
                  description="슬라이드가 전자문서 PDF로 성공적으로 변환되었습니다."
                  actionHint="아래 [PDF 다시 다운로드] 버튼을 눌러 저장하세요!"
                />
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">PDF 다운로드 준비 완료</h4>
                      <p className="text-xs text-emerald-700">다운로드가 시작되지 않았다면 버튼을 클릭하세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadBlob(pdfBlob, `${file.name.replace(/\.[^/.]+$/, "")}.pdf`)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF 다시 다운로드</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="PPT ➔ PDF 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="파워포인트 PDF 변환 자주 묻는 질문"
        subtitle="프레젠테이션 문서를 PDF로 변환하는 팁입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="슬라이드를 프레젠테이션 PDF로 렌더링하고 있습니다..."
      />
    </div>
  );
}
