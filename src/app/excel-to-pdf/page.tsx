"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import UploadedFileCard from "@/components/UploadedFileCard";
import { excelToPdf, downloadBlob } from "@/lib/pdf-utils";
import { FileSpreadsheet, Download, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function ExcelToPdfPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);

  const handleFileSelected = (files: File[]) => {
    const xlsFile = files.find((f) => f.name.endsWith(".xlsx") || f.name.endsWith(".xls"));
    if (!xlsFile) {
      alert("Excel (.xlsx / .xls) File required.");
      return;
    }
    setFile(xlsFile);
    setPdfBlob(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(20);

      const result = await excelToPdf(file, (p) => setProgress(p));
      setPdfBlob(result);
      setIsProcessing(false);

      downloadBlob(result, `${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Excel 파일을 PDF로 변환하는 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "Excel 파일 선택",
      desc: ".xlsx 또는 .xls 엑셀 스프레드시트 파일을 드래그하여 업로드합니다.",
    },
    {
      step: 2,
      title: "표 데이터 렌더링",
      desc: "시트 안의 모든 셀과 표 데이터를 가로형(Landscape) A4 PDF로 최적화 배치합니다.",
    },
    {
      step: 3,
      title: "PDF 즉시 다운로드",
      desc: "표 서식이 깔끔하게 인쇄용으로 정리된 PDF 파일을 저장합니다.",
    },
  ];

  const faqItems = [
    {
      question: "시트에 표가 넓어서 가로로 긴 경우에도 잘 나오나요?",
      answer: "네! mypickpdf의 엑셀 변환기는 표 서식이 잘리지 않도록 기본적으로 가로(Landscape) A4 규격으로 자동 최적화하여 렌더링합니다.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader
        toolKey="excel_to_pdf"
      />

      <AdBanner format="horizontal" />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
        {!file ? (
          <FileDropzone
            onFilesSelected={handleFileSelected}
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                <FileSpreadsheet className="w-5 h-5" />
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
      <HowToSection toolName="Excel ➔ PDF 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="엑셀 PDF 변환 자주 묻는 질문"
        subtitle="스프레드시트를 전자문서로 변환할 때의 안내입니다."
        items={faqItems}
      />

      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message="Excel 표 데이터를 깔끔한 PDF로 정리하고 있습니다..."
      />
    </div>
  );
}
