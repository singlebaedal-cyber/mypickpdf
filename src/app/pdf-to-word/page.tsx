"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import UploadedFileCard from "@/components/UploadedFileCard";
import StepBadge from "@/components/StepBadge";
import { reportAppError } from "@/lib/app-events";
import { pdfToWordDocx, downloadBlob, getPDFPageCount } from "@/lib/pdf-utils";
import { FileText, Download, CheckCircle, RefreshCw } from "lucide-react";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wordBlob, setWordBlob] = useState<Blob | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setWordBlob(null);

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
      setProgress(15);

      const result = await pdfToWordDocx(file, (p) => setProgress(p));
      setWordBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `${file.name.replace(/\.[^/.]+$/, "")}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      reportAppError({
        toolId: "pdf-to-word",
        toolName: "PDF 워드 변환",
        errorMessage: "PDF를 Word로 변환하는 중 오류가 발생했습니다.",
        technicalDetails: err?.message || String(err),
        suggestedAction: "워드 파싱 엔진 보정 및 재시도",
        onRetry: () => handleConvert(),
      });
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 업로드",
      desc: "워드 문서로 바꾸고 싶은 PDF를 추가합니다.",
    },
    {
      step: 2,
      title: "텍스트 & 레이아웃 파싱",
      desc: "문서 내 단락과 텍스트를 마이크로소프트 워드 (.docx) 서식으로 자동 조립합니다.",
    },
    {
      step: 3,
      title: "Word 파일 다운로드",
      desc: "즉시 편집 가능한 .docx 워드 문서로 다운로드합니다.",
    },
  ];

  const faqItems = [
    {
      question: "변환된 Word 파일에서 글자를 수정할 수 있나요?",
      answer: "네! PDF 내의 텍스트가 일반 텍스트 및 단락으로 추출되어 마이크로소프트 워드나 한글 프로그램에서 자유롭게 편집 및 타이핑이 가능합니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="pdf_to_word"
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
            {/* 1. In-Place Upload Success Confirmation without popups */}
            <UploadedFileCard
              file={file}
              pageCount={pageCount}
              onReset={() => {
                setFile(null);
                setWordBlob(null);
              }}
              nextStepTitle="PDF 문서가 안전하게 등록되었습니다!"
              nextStepHint="아래 [Word (.docx)로 변환 시작] 버튼을 눌러 작업을 완료하세요."
            />

            {/* 2. Step 1 Action Button with Visual Highlighting */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <StepBadge step={1} label="1단계: 아래 버튼을 누르면 즉시 워드 변환이 시작됩니다!" isCurrent={true} />
                <span className="text-xs text-slate-500 hidden sm:inline">문서 서식과 텍스트를 분석하여 .docx 생성</span>
              </div>
              <button
                onClick={handleConvert}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-base rounded-2xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2.5 transition-all ring-4 ring-rose-400/50 animate-pulse hover:scale-105"
              >
                <FileText className="w-5 h-5" />
                <span>👉 Word (.docx)로 변환 시작</span>
              </button>
            </div>

            {wordBlob && (
              <div className="space-y-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="PDF ➔ Word 변환이 성공적으로 완료되었습니다!"
                  description="편집 가능한 Word 문서가 완성되었습니다. 내 컴퓨터에 바로 저장하세요."
                  actionHint="아래 [Word 다시 다운로드] 버튼을 눌러 저장하세요!"
                />
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">Word 파일 다운로드 준비 완료</h4>
                      <p className="text-xs text-emerald-700">다운로드가 시작되지 않았다면 버튼을 클릭하세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadBlob(wordBlob, `${file.name.replace(/\.[^/.]+$/, "")}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Word 다시 다운로드</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="PDF ➔ Word 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="PDF 워드 변환 자주 묻는 질문"
        subtitle="PDF 문서를 Word로 바꾸는 방법에 대한 안내입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="PDF 텍스트를 마이크로소프트 Word 규격으로 재구성 중입니다..."
      />
    </div>
  );
}
