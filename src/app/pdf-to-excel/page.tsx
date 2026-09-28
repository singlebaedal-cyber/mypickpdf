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
import { pdfToExcelXlsx, downloadBlob, getPDFPageCount } from "@/lib/pdf-utils";
import { FileSpreadsheet, Download, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function PdfToExcelPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [excelBlob, setExcelBlob] = useState<Blob | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setExcelBlob(null);

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
      setProgress(20);

      const result = await pdfToExcelXlsx(file, (p) => setProgress(p));
      setExcelBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `${file.name.replace(/\.[^/.]+$/, "")}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    } catch (err) {
      console.error(err);
      alert("PDF를 Excel로 변환하는 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "PDF 업로드",
      desc: "표나 숫자 데이터가 포함된 PDF 문서를 선택합니다.",
    },
    {
      step: 2,
      title: "행/열 데이터 파싱",
      desc: "문서 내 표와 데이터 셀을 자동으로 분석하여 엑셀 시트 그리드로 매핑합니다.",
    },
    {
      step: 3,
      title: "Excel 다운로드",
      desc: "계산과 편집이 가능한 .xlsx 엑셀 파일로 즉시 저장합니다.",
    },
  ];

  const faqItems = [
    {
      question: "엑셀 수식이나 필터를 바로 적용할 수 있나요?",
      answer: "네! PDF 내의 표 내용이 엑셀 셀 데이터로 분리되어 들어가므로, SUM 함수나 정렬/필터 기능을 바로 적용할 수 있습니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="pdf_to_excel"
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
                setExcelBlob(null);
              }}
            />

            <div className="flex justify-end">
              <button
                onClick={handleConvert}
                className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Excel (.xlsx)로 변환 시작</span>
              </button>
            </div>

            {excelBlob && (
              <div className="space-y-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title="PDF ➔ Excel 변환이 성공적으로 완료되었습니다!"
                  description="스프레드시트 데이터 추출이 끝났습니다. 내 컴퓨터에 바로 저장하세요."
                  actionHint="아래 [Excel 다시 다운로드] 버튼을 눌러 저장하세요!"
                />
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">Excel 시트 다운로드 준비 완료</h4>
                      <p className="text-xs text-emerald-700">다운로드가 시작되지 않았다면 버튼을 클릭하세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadBlob(excelBlob, `${file.name.replace(/\.[^/.]+$/, "")}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Excel 다시 다운로드</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="PDF ➔ Excel 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="PDF 엑셀 변환 자주 묻는 질문"
        subtitle="PDF 데이터를 스프레드시트로 추출하는 안내입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="표 데이터를 분석하여 Excel 행/열로 매핑하고 있습니다..."
      />
    </div>
  );
}
