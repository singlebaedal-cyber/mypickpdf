"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import UploadedFileCard from "@/components/UploadedFileCard";
import { wordToPdf, downloadBlob } from "@/lib/pdf-utils";
import { FileText, Download, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function WordToPdfPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);

  const handleFileSelected = (files: File[]) => {
    const docFile = files.find((f) => f.name.endsWith(".docx") || f.name.endsWith(".doc"));
    if (!docFile) {
      alert("Word (.docx / .doc) File required.");
      return;
    }
    setFile(docFile);
    setPdfBlob(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(20);

      const result = await wordToPdf(file, (p) => setProgress(p));
      setPdfBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error converting Word document to PDF.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "Word 문서 업로드",
      desc: "변환하고 싶은 .docx 워드 문서를 드래그 앤 드롭으로 선택합니다.",
    },
    {
      step: 2,
      title: "즉시 변환",
      desc: "브라우저 클라이언트 엔진이 서식과 본문을 손실 없이 A4 PDF로 렌더링합니다.",
    },
    {
      step: 3,
      title: "PDF 다운로드",
      desc: "완성된 고화질 PDF 전자문서를 즉시 다운로드하여 보관합니다.",
    },
  ];

  const faqItems = [
    {
      question: "워드 문서의 폰트나 서식이 깨지지 않나요?",
      answer: "mypickpdf는 원본 .docx 문서의 단락 구조, 텍스트 크기, 여백을 그대로 보존하여 깔끔한 PDF로 생성합니다.",
    },
    {
      question: "구형 .doc 파일도 변환되나요?",
      answer: "최신 표준인 .docx 파일에 가장 최적화되어 있습니다. 구형 파일의 경우 워드에서 .docx로 저장 후 변환하시면 완벽한 품질을 얻으실 수 있습니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="word_to_pdf"
      />

      <AdBanner format="horizontal" />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
        {!file ? (
          <FileDropzone
            onFilesSelected={handleFileSelected}
            accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple={false}
          />
        ) : (
          <div className="space-y-6">
            <UploadedFileCard
              file={file}
              onReset={() => {
                setFile(null);
                setPdfBlob(null);
              }}
            />

            <div className="flex justify-end">
              <button
                onClick={handleConvert}
                className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <FileText className="w-5 h-5" />
                <span>PDF로 변환 시작</span>
              </button>
            </div>

            {pdfBlob && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">{t("btn_download_again")}</h4>
                      <p className="text-xs text-emerald-700">mypickpdf 100% Free & Secure</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadBlob(pdfBlob, `${file.name.replace(/\.[^/.]+$/, "")}.pdf`)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t("btn_download_again")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="Word ➔ PDF 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="워드 PDF 변환 자주 묻는 질문"
        subtitle="Word 문서를 PDF로 변환하는 방법에 대한 주요 안내입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="Word 문서를 고품질 A4 PDF로 변환하고 있습니다..."
      />
    </div>
  );
}
