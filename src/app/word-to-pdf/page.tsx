"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import { wordToPdf, downloadBlob } from "@/lib/pdf-utils";
import { FileText, Download, CheckCircle, RefreshCw } from "lucide-react";

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);

  const handleFileSelected = (files: File[]) => {
    const docFile = files.find((f) => f.name.endsWith(".docx") || f.name.endsWith(".doc"));
    if (!docFile) {
      alert("Word 문서 (.docx) 파일을 선택해 주세요.");
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
      alert("Word 문서를 PDF로 변환하는 중 오류가 발생했습니다.");
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
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm truncate max-w-sm">{file.name}</h4>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>

              <MascotActionNotice
                mood="ready"
                title="Word 문서가 안전하게 첨부되었습니다!"
                description="서버 전송 없이 브라우저 메모리에서 안전하게 즉시 PDF로 변환됩니다."
                actionHint="우측 하단 [PDF로 변환 시작] 버튼을 눌러주세요!"
              />

              <button
                onClick={() => {
                  setFile(null);
                  setPdfBlob(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> 다른 문서 선택
              </button>
            </div>

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
                <MascotActionNotice
                  mood="hooray"
                  title="Word ➔ PDF 변환이 완료되었습니다!"
                  description="고화질 PDF 문서가 성공적으로 생성되었습니다. 내 컴퓨터에 안전하게 저장하세요."
                  actionHint="아래 [PDF 다시 다운로드] 버튼을 눌러 저장하세요!"
                />
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">PDF 다운로드 준비 완료</h4>
                      <p className="text-xs text-emerald-700">자동으로 다운로드가 시작되지 않았다면 버튼을 클릭하세요.</p>
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
