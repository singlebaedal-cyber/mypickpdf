"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import { htmlToPdf, downloadBlob } from "@/lib/pdf-utils";
import { Code2, Download, CheckCircle, Upload } from "lucide-react";

export default function HtmlToPdfPage() {
  const [htmlCode, setHtmlCode] = useState<string>(
    "<h1>안녕하세요! mypickpdf입니다.</h1>\n<p>이곳에 HTML 코드를 입력하거나 .html 파일을 불러와서 인쇄용 PDF로 변환하세요.</p>"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setHtmlCode(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleConvert = async () => {
    if (!htmlCode.trim()) {
      alert("변환할 HTML 코드를 입력해 주세요.");
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(20);

      const result = await htmlToPdf(htmlCode, (p) => setProgress(p));
      setPdfBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `html_document_${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert("HTML 변환 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "HTML 입력 또는 파일 업로드",
      desc: "웹페이지 HTML 코드를 붙여넣거나 .html 파일을 직접 불러옵니다.",
    },
    {
      step: 2,
      title: "PDF 렌더링",
      desc: "HTML 태그와 텍스트 서식을 A4 규격 레이아웃으로 정리합니다.",
    },
    {
      step: 3,
      title: "PDF 저장",
      desc: "생성된 PDF 문서를 즉시 다운로드합니다.",
    },
  ];

  const faqItems = [
    {
      question: "CSS 스타일도 일부 반영되나요?",
      answer: "네! 인라인 스타일 및 표준 HTML 구조 태그(h1, p, table, div 등)를 기반으로 깔끔한 A4 인쇄 레이아웃을 생성합니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="html_to_pdf"
      />

      <AdBanner format="horizontal" />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-rose-600" /> HTML 코드 입력기
          </h3>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors shrink-0">
            <Upload className="w-4 h-4" />
            <span>.html 파일 불러오기</span>
            <input type="file" accept=".html,.htm" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <textarea
          rows={12}
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          placeholder="<html><body><h1>제목</h1><p>내용...</p></body></html>"
          className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />

        <MascotActionNotice
          mood="ready"
          title="HTML 코드를 확인해 주세요!"
          description="입력된 웹페이지 마크업을 가상의 브라우저 뷰포트에서 A4 규격 PDF로 렌더링합니다."
          actionHint="아래 [PDF로 변환 시작] 버튼을 눌러주세요!"
        />

        <div className="flex justify-end">
          <button
            onClick={handleConvert}
            className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Code2 className="w-5 h-5" />
            <span>PDF로 변환 시작</span>
          </button>
        </div>

        {pdfBlob && (
          <div className="space-y-4 animate-in fade-in">
            <MascotActionNotice
              mood="hooray"
              title="HTML ➔ PDF 렌더링이 완료되었습니다!"
              description="웹페이지 코드가 고품질 전자문서로 생성되었습니다. 내 컴퓨터에 바로 저장하세요."
              actionHint="아래 [PDF 다시 다운로드] 버튼을 눌러 저장하세요!"
            />
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-emerald-900">HTML이 PDF로 성공적으로 변환되었습니다!</h4>
                  <p className="text-xs text-emerald-700">다운로드가 시작되지 않았다면 버튼을 클릭하세요.</p>
                </div>
              </div>
              <button
                onClick={() => downloadBlob(pdfBlob, `html_converted_${Date.now()}.pdf`)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>PDF 다시 다운로드</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="HTML ➔ PDF 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="HTML PDF 변환 자주 묻는 질문"
        subtitle="웹 코드를 PDF로 변환하는 방법에 관한 안내입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="HTML 코드를 A4 전자문서로 렌더링하고 있습니다..."
      />
    </div>
  );
}
