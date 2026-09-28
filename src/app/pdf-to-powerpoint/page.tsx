"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import UploadedFileCard from "@/components/UploadedFileCard";
import { pdfToPowerpointPptx, downloadBlob, getPDFPageCount } from "@/lib/pdf-utils";
import { Presentation, Download, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function PdfToPowerpointPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pptBlob, setPptBlob] = useState<Blob | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setPptBlob(null);

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
      setProgress(10);

      const result = await pdfToPowerpointPptx(file, (p) => setProgress(p));
      setPptBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `${file.name.replace(/\.[^/.]+$/, "")}.pptx`, "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    } catch (err) {
      console.error(err);
      alert("PDF를 PowerPoint로 변환하는 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 업로드",
      desc: "프레젠테이션 슬라이드로 만들고 싶은 PDF를 추가합니다.",
    },
    {
      step: 2,
      title: "슬라이드 변환",
      desc: "각 페이지를 16:9 규격의 마이크로소프트 파워포인트 (.pptx) 슬라이드로 생성합니다.",
    },
    {
      step: 3,
      title: "PPTX 다운로드",
      desc: "발표 준비가 완료된 파워포인트 파일을 즉시 저장합니다.",
    },
  ];

  const faqItems = [
    {
      question: "파워포인트에서 발표자 도구를 그대로 사용할 수 있나요?",
      answer: "네! 변환된 .pptx 파일을 열고 슬라이드 쇼(F5)를 누르면 일반 파워포인트와 완벽하게 동일하게 발표할 수 있습니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="pdf_to_ppt"
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
            <UploadedFileCard
              file={file}
              pageCount={pageCount}
              onReset={() => {
                setFile(null);
                setPptBlob(null);
              }}
            />

            <div className="flex justify-end">
              <button
                onClick={handleConvert}
                className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Presentation className="w-5 h-5" />
                <span>PowerPoint (.pptx)로 변환 시작</span>
              </button>
            </div>

            {pptBlob && (
              <div className="space-y-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="PDF ➔ PowerPoint 변환이 완료되었습니다!"
                  description="프레젠테이션 슬라이드가 생성되었습니다. 내 컴퓨터에 바로 저장하세요."
                  actionHint="아래 [PowerPoint 다시 다운로드] 버튼을 눌러 저장하세요!"
                />
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">PowerPoint 슬라이드 다운로드 준비 완료</h4>
                      <p className="text-xs text-emerald-700">다운로드가 시작되지 않았다면 버튼을 클릭하세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadBlob(pptBlob, `${file.name.replace(/\.[^/.]+$/, "")}.pptx`, "application/vnd.openxmlformats-officedocument.presentationml.presentation")}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>PowerPoint 다시 다운로드</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="PDF ➔ PowerPoint 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="PDF 파워포인트 변환 자주 묻는 질문"
        subtitle="PDF 문서를 발표 슬라이드로 변경하는 방법입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="각 페이지를 16:9 프레젠테이션 슬라이드로 렌더링하고 있습니다..."
      />
    </div>
  );
}
