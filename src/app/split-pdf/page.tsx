"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import { getPDFPageCount, parsePageRange, extractPDFPages, downloadBlob } from "@/lib/pdf-utils";
import { Split, Download, CheckCircle, FileText, RefreshCw } from "lucide-react";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitBlob, setSplitBlob] = useState<Uint8Array | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setSplitBlob(null);

    try {
      const count = await getPDFPageCount(pdfFile);
      setPageCount(count);
      setRangeInput(count > 1 ? `1-${Math.min(count, 3)}` : "1");
    } catch (e) {
      console.error(e);
      alert("PDF 페이지 수를 읽는 중 문제가 발생했습니다.");
    }
  };

  const handleSplit = async () => {
    if (!file || pageCount === 0) return;

    const pageIndices = parsePageRange(rangeInput, pageCount);
    if (pageIndices.length === 0) {
      alert(`올바른 페이지 번호나 범위를 입력해 주세요. (1 ~ ${pageCount} 페이지 가능)`);
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(20);

      const result = await extractPDFPages(file, pageIndices);
      setProgress(100);
      setSplitBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `split_${file.name.replace(/\.[^/.]+$/, "")}_pages.pdf`);
    } catch (err) {
      console.error(err);
      alert("페이지 추출 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 문서 선택",
      desc: "분할하거나 특정 페이지만 추출하고 싶은 PDF 문서를 추가합니다.",
    },
    {
      step: 2,
      title: "추출할 페이지 범위 지정",
      desc: "'1-5' 같은 연속 범위나 '1, 3, 7'처럼 쉼표로 구분하여 필요한 페이지만 지정합니다.",
    },
    {
      step: 3,
      title: "분할 실행 & 저장",
      desc: "[페이지 추출하기]를 누르면 즉시 선택한 페이지만 깔끔하게 새 PDF로 다운로드됩니다.",
    },
  ];

  const faqItems = [
    {
      question: "특정 페이지만 골라서 추출할 수 있나요?",
      answer: "네! 예를 들어 '1, 4, 7-10'과 같이 입력하시면 1페이지, 4페이지, 그리고 7페이지부터 10페이지까지만 묶어서 새 PDF 문서로 즉시 생성됩니다.",
    },
    {
      question: "페이지를 나누면 화질이나 서식이 깨지나요?",
      answer: "전혀 깨지지 않습니다. mypickpdf는 원본 PDF의 텍스트, 벡터 그래픽, 고해상도 이미지를 100% 손실 없이 그대로 보존하여 추출합니다.",
    },
    {
      question: "비밀번호가 걸린 암호화 PDF도 분할 가능한가요?",
      answer: "암호가 설정된 문서는 보안상의 이유로 브라우저에서 읽지 못할 수 있습니다. 암호를 해제하신 후 업로드하시면 원활하게 분할 가능합니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="split"
      />

      {/* Top Ad Slot */}
      <AdBanner format="horizontal" />

      {/* Main Interactive Tool Area */}
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
                  setSplitBlob(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> 다른 파일 선택
              </button>
            </div>

            {/* Mascot Action Guide */}
            {!splitBlob && (
              <MascotActionNotice
                mood="ready"
                title={`총 ${pageCount}페이지 문서가 정상적으로 준비되었어요!`}
                description="추출하고자 하는 페이지 번호나 범위를 입력한 뒤, [선택 페이지 분할하기] 버튼을 눌러주세요."
                actionHint="페이지 범위 입력 후 [선택 페이지 분할하기] 클릭"
              />
            )}

            {/* Split Options */}
            <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-100/80 space-y-4">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Split className="w-4 h-4 text-rose-600" /> 추출할 페이지 범위 지정
              </h4>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="예: 1-3, 5, 8-10"
                    className="w-full px-4 py-3 bg-white border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 rounded-xl font-mono text-sm text-slate-800"
                  />
                </div>
                <button
                  onClick={handleSplit}
                  className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 shrink-0 transition-all hover:shadow-lg"
                >
                  <Split className="w-4 h-4" />
                  <span>선택 페이지 분할하기</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">빠른 선택 예시:</span>
                <button
                  onClick={() => setRangeInput(`1`)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-rose-300 hover:text-rose-600"
                >
                  첫 페이지만 (1)
                </button>
                <button
                  onClick={() => setRangeInput(pageCount > 1 ? `1-${Math.ceil(pageCount / 2)}` : "1")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-rose-300 hover:text-rose-600"
                >
                  전반부 (1-{Math.ceil(pageCount / 2)})
                </button>
                <button
                  onClick={() => setRangeInput(`1-${pageCount}`)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-rose-300 hover:text-rose-600"
                >
                  전체 페이지 (1-{pageCount})
                </button>
              </div>
            </div>

            {/* Split Success Download */}
            {splitBlob && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="페이지 추출 및 분할이 성공적으로 완료되었습니다!"
                  description="선택하신 페이지만 분리된 새로운 PDF가 생성되었습니다. 아래 다운로드 버튼을 눌러 저장하세요!"
                  actionHint="[분할된 PDF 다시 다운로드] 버튼을 클릭하세요"
                  className="border-0 bg-transparent p-0 flex-1 shadow-none"
                />
                <button
                  onClick={() => downloadBlob(splitBlob, `split_${file.name}`)}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4" />
                  <span>분할된 PDF 다시 다운로드</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mid Page Ad Slot */}
      <AdBanner format="horizontal" />

      {/* How To Section */}
      <HowToSection toolName="PDF 나누기" steps={howToSteps} />

      {/* Bottom Ad Slot */}
      <AdBanner format="responsive" />

      {/* FAQ Section */}
      <FaqSection
        title="PDF 분할 및 추출 자주 묻는 질문"
        subtitle="원하는 페이지만 안전하게 추출하는 방법에 대한 정보입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="지정된 페이지를 새 PDF로 추출하고 있습니다..."
      />
    </div>
  );
}
