"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import { pdfToPdfA, downloadBlob } from "@/lib/pdf-utils";
import { Archive, Download, CheckCircle, RefreshCw, ShieldCheck } from "lucide-react";

export default function PdfToPdfaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfaBlob, setPdfaBlob] = useState<Uint8Array | null>(null);

  const handleFileSelected = (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setPdfaBlob(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(20);

      const result = await pdfToPdfA(file, (p) => setProgress(p));
      setPdfaBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `${file.name.replace(/\.[^/.]+$/, "")}_PDFA.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF/A 변환 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "일반 PDF 문서 업로드",
      desc: "공공기관 제출용 또는 장기 보관이 필요한 PDF를 선택합니다.",
    },
    {
      step: 2,
      title: "ISO 19005-1 규격 검증",
      desc: "문서 내 메타데이터와 색상 프로파일을 국제 보존 표준(PDF/A-1b)에 맞추어 보정합니다.",
    },
    {
      step: 3,
      title: "PDF/A 파일 다운로드",
      desc: "수십 년 후에도 동일하게 열람 가능한 공인 보존용 PDF를 저장합니다.",
    },
  ];

  const faqItems = [
    {
      question: "PDF/A 규격이란 무엇인가요?",
      answer: "PDF/A(ISO 19005)는 전자문서의 영구 보존을 목적으로 개발된 국제 표준입니다. 글꼴과 색상 정보를 완전히 내장하여 향후 소프트웨어 버전이 달라져도 문서 원본이 완벽하게 보존됩니다.",
    },
    {
      question: "정부 기관이나 법원 제출용으로 인정되나요?",
      answer: "네! 국내외 대부분의 공공기관, 법원, 대학교 등에서 장기 보관용 표준으로 요구하는 규격입니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="pdf_to_pdfa"
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
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm truncate max-w-sm">{file.name}</h4>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>

              <MascotActionNotice
                mood="ready"
                title="PDF 문서가 안전하게 준비되었습니다!"
                description="국제 표준 장기 보관 규격인 PDF/A 형식으로 메타데이터 및 폰트를 안전하게 임베딩합니다."
                actionHint="우측 하단 [PDF/A 규격으로 변환 시작] 버튼을 눌러주세요!"
              />

              <button
                onClick={() => {
                  setFile(null);
                  setPdfaBlob(null);
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
                <ShieldCheck className="w-5 h-5" />
                <span>PDF/A 규격으로 변환 시작</span>
              </button>
            </div>

            {pdfaBlob && (
              <div className="space-y-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="PDF/A 규격 변환이 성공적으로 완료되었습니다!"
                  description="장기 보관용 표준 PDF/A 문서가 생성되었습니다. 내 컴퓨터에 바로 저장하세요."
                  actionHint="아래 [PDF/A 다시 다운로드] 버튼을 눌러 저장하세요!"
                />
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">PDF/A 규격 변환이 완료되었습니다!</h4>
                      <p className="text-xs text-emerald-700">다운로드가 시작되지 않았다면 버튼을 클릭하세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadBlob(pdfaBlob, `${file.name.replace(/\.[^/.]+$/, "")}_PDFA.pdf`)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF/A 다시 다운로드</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="PDF ➔ PDF/A 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="PDF/A 변환 자주 묻는 질문"
        subtitle="장기 보관 규격에 관한 상세 안내입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="국제 표준 ISO 19005-1 보존 메타데이터를 주입하고 있습니다..."
      />
    </div>
  );
}
