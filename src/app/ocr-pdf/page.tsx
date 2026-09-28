"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import UploadedFileCard from "@/components/UploadedFileCard";
import { extractTextFromPDF, downloadBlob, getPDFPageCount } from "@/lib/pdf-utils";
import { FileSearch, Copy, Download, Check, FileText } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function OcrPdfPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const handleFileSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setExtractedText("");

    try {
      const count = await getPDFPageCount(pdfFile);
      setPageCount(count);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExtract = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(10);

      const text = await extractTextFromPDF(file, (p) => setProgress(p));
      setExtractedText(text);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      alert("PDF에서 텍스트를 추출하는 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!extractedText || !file) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${file.name.replace(/\.[^/.]+$/, "")}_extracted_text.txt`, "text/plain");
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 문서 추가",
      desc: "글자를 추출하고 싶은 문서를 업로드 영역에 끌어다 놓습니다.",
    },
    {
      step: 2,
      title: "텍스트 추출 클릭",
      desc: "브라우저 엔진이 문서의 모든 페이지에서 텍스트 요소를 신속하게 읽어들입니다.",
    },
    {
      step: 3,
      title: "복사 또는 메모장 저장",
      desc: "추출된 내용을 원클릭으로 클립보드에 복사하거나 TXT 텍스트 파일로 다운로드합니다.",
    },
  ];

  const faqItems = [
    {
      question: "표나 양식에 들어있는 글자도 추출되나요?",
      answer: "네! PDF 내부에 텍스트 레이어로 입력되어 있는 표, 단락, 목록의 모든 텍스트를 페이지 순서대로 정렬하여 추출합니다.",
    },
    {
      question: "텍스트 추출 데이터도 서버로 전송되지 않나요?",
      answer: "네, 완전히 안전합니다. 브라우저 메모리 상에서 직접 텍스트 레이어를 디코딩하므로 어떤 민감한 계약서나 개인 문서도 외부로 노출되지 않습니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="ocr"
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
                setExtractedText("");
              }}
            />

            {!extractedText ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileSearch className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 mb-2">텍스트 추출 준비 완료</h4>
                <p className="text-xs text-slate-500 mb-6">
                  아래 버튼을 누르면 {pageCount}개 페이지의 모든 텍스트 레이어를 읽어옵니다.
                </p>
                <button
                  onClick={handleExtract}
                  className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>텍스트 추출 시작</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                {extractedText.trim().length === 0 ? (
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center space-y-4 animate-in fade-in">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-2xl shadow-xs">
                      📷
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                        스캔본 또는 이미지 기반 PDF 감지됨
                      </h4>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                        이 문서는 텍스트 레이어가 내장되어 있지 않고 고해상도 이미지/인쇄물(브로슈어, 카탈로그, 스캔 서류 등)로 구성되어 있습니다.<br />
                        이미지가 포함된 문서는 아래 도구들을 통해 완벽하게 변환하여 활용하실 수 있습니다:
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                      <a
                        href="/pdf-to-word"
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-xs hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        <span>📄 Word (.docx)로 고화질 변환</span>
                      </a>
                      <a
                        href="/pdf-to-image"
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-xs hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        <span>🖼️ JPG 이미지로 고화질 추출</span>
                      </a>
                      <a
                        href="/pdf-to-powerpoint"
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        <span>📊 PowerPoint 슬라이드로 변환</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <MascotActionNotice
                      mood="hooray"
                      title="PDF 텍스트 추출이 완료되었습니다!"
                      description="문서 속 텍스트가 모두 추출되었습니다. 클립보드에 복사하거나 TXT 파일로 저장하세요."
                      actionHint="[클립보드 복사] 또는 [TXT 다운로드]를 눌러 활용하세요!"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        추출 결과 (총 {extractedText.length.toLocaleString()}자)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopy}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors hover:scale-105"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? "복사됨!" : "클립보드 복사"}</span>
                        </button>
                        <button
                          onClick={handleDownloadTxt}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>TXT로 저장</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      readOnly
                      value={extractedText}
                      rows={14}
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="PDF 텍스트 추출" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="PDF 텍스트 추출 자주 묻는 질문"
        subtitle="문서 안의 글자를 복사하는 편리한 기능에 관한 안내입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="PDF 텍스트 레이어를 읽고 디코딩하는 중입니다..."
      />
    </div>
  );
}
