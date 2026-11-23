"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import { downloadBlob } from "@/lib/pdf-utils";
import type { HwpOutputFormat, ParsedHwpDocument } from "@/lib/hwp-to-any";
import {
  FileText,
  Download,
  CheckCircle,
  RefreshCw,
  FileSpreadsheet,
  FileType2,
  AlignLeft,
  Table2,
  Image as ImageIcon,
  Layers,
} from "lucide-react";

const OUTPUT_FORMATS: {
  id: HwpOutputFormat;
  label: string;
  ext: string;
  mime: string;
  desc: string;
  badge: string;
  icon: typeof FileText;
}[] = [
  {
    id: "pdf",
    label: "PDF 문서 (.pdf)",
    ext: "pdf",
    mime: "application/pdf",
    desc: "세로/가로 구역, 표, 이미지를 그대로 유지한 고해상도 PDF",
    badge: "추천",
    icon: FileText,
  },
  {
    id: "docx",
    label: "Word 워드 (.docx)",
    ext: "docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    desc: "MS 워드에서 바로 편집 가능한 표·이미지 포함 문서",
    badge: "편집용",
    icon: FileType2,
  },
  {
    id: "xlsx",
    label: "Excel 엑셀 (.xlsx)",
    ext: "xlsx",
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    desc: "한글 문서 속 모든 표 데이터를 엑셀 시트로 일괄 추출",
    badge: "표 추출",
    icon: FileSpreadsheet,
  },
  {
    id: "txt",
    label: "텍스트 (.txt)",
    ext: "txt",
    mime: "text/plain;charset=utf-8",
    desc: "복사·요약·AI 입력용 순수 텍스트 파일",
    badge: "초고속",
    icon: AlignLeft,
  },
];

export default function HwpToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedDoc, setParsedDoc] = useState<ParsedHwpDocument | null>(null);
  const [targetFormat, setTargetFormat] = useState<HwpOutputFormat>("pdf");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("한글(HWP/HWPX) 문서를 분석하고 있습니다...");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputMeta, setOutputMeta] = useState<{ format: HwpOutputFormat; pageCount?: number } | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const picked = files.find((f) => {
      const lower = f.name.toLowerCase();
      return lower.endsWith(".hwpx") || lower.endsWith(".hwp");
    });
    if (!picked) {
      alert("한글 문서 (.hwpx 또는 .hwp) 파일을 선택해 주세요.");
      return;
    }

    setFile(picked);
    setParsedDoc(null);
    setOutputBlob(null);
    setOutputMeta(null);

    try {
      setIsProcessing(true);
      setProgress(15);
      setProgressMsg("한글 문서 구조(구역·표·이미지)를 분석하는 중입니다...");
      const { parseHwpOrHwpx } = await import("@/lib/hwp-to-any");
      const parsed = await parseHwpOrHwpx(picked, (p) => setProgress(p));
      setParsedDoc(parsed);
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "한글 파일을 읽는 중 오류가 발생했습니다.");
      setFile(null);
      setIsProcessing(false);
    }
  };

  const handleConvert = async (formatOverride?: HwpOutputFormat) => {
    if (!file || !parsedDoc) return;
    const fmt = formatOverride || targetFormat;
    const fmtInfo = OUTPUT_FORMATS.find((f) => f.id === fmt)!;

    try {
      setIsProcessing(true);
      setProgress(25);
      setProgressMsg(`한글 문서를 ${fmtInfo.label} 형식으로 변환하고 있습니다...`);

      const { exportHwpToPdf, exportHwpToWord, exportHwpToExcel, exportHwpToText } = await import(
        "@/lib/hwp-to-any"
      );

      let resultBlob: Blob;
      let pageCount: number | undefined;

      if (fmt === "pdf") {
        const res = await exportHwpToPdf(parsedDoc, (p) => setProgress(p));
        resultBlob = res.blob;
        pageCount = res.pageCount;
      } else if (fmt === "docx") {
        resultBlob = await exportHwpToWord(parsedDoc, (p) => setProgress(p));
      } else if (fmt === "xlsx") {
        resultBlob = await exportHwpToExcel(parsedDoc, (p) => setProgress(p));
      } else {
        resultBlob = exportHwpToText(parsedDoc);
        setProgress(100);
      }

      setOutputBlob(resultBlob);
      setOutputMeta({ format: fmt, pageCount });
      setIsProcessing(false);

      const outName = `${file.name.replace(/\.[^/.]+$/, "")}.${fmtInfo.ext}`;
      await downloadBlob(resultBlob, outName, fmtInfo.mime);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "한글 파일 변환 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    {
      step: 1,
      title: "HWP / HWPX 파일 업로드",
      desc: "관공서 공고문, 제안요청서, 계약서 등 .hwpx 또는 .hwp 한글 문서를 첨부합니다.",
    },
    {
      step: 2,
      title: "변환 형식 선택 (PDF·Word·Excel·TXT)",
      desc: "PDF 인쇄본, MS 워드(.docx) 편집본, 엑셀(.xlsx) 표 데이터, 텍스트(.txt) 중 원하는 포맷을 선택합니다.",
    },
    {
      step: 3,
      title: "즉시 다운로드",
      desc: "서버 전송 없이 브라우저에서 안전하게 변환된 결과 파일을 바로 저장합니다.",
    },
  ];

  const faqItems = [
    {
      question: "HWPX와 구형 HWP 파일 모두 변환되나요?",
      answer:
        "네! 최신 국가표준 OWPML(.hwpx) 파일은 구역별 가로/세로 방향, 모든 표, 내장 이미지(JPG/PNG/BMP)까지 완벽 지원하며, 구형 HWP 5.0(.hwp) 파일의 본문 텍스트 변환도 함께 지원합니다.",
    },
    {
      question: "제안요청서나 공고문에 들어 있는 수많은 표도 깨지지 않나요?",
      answer:
        "네! HWPX의 OWPML 표 구조(병합 셀 colSpan, 헤더 음영, 줄바꿈)를 정밀 파싱하여 PDF·Word 표로 복원하며, Excel(.xlsx)로 변환하면 문서 내 모든 표를 별도 시트에 깔끔하게 모아 추출할 수 있습니다.",
    },
    {
      question: "공공기관 보안 문서인데 서버에 파일이 업로드되나요?",
      answer:
        "아니요! 모든 파싱과 변환이 100% 사용자 PC·모바일 브라우저 메모리 안에서 로컬 실행되므로 외부 서버로 단 1바이트도 전송되지 않습니다.",
    },
  ];

  const activeFmtInfo = OUTPUT_FORMATS.find((f) => f.id === (outputMeta?.format || targetFormat))!;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <ToolHeader toolKey="hwp_to_pdf" />

      <AdBanner format="horizontal" />

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
        {!file || !parsedDoc ? (
          <FileDropzone
            onFilesSelected={handleFileSelected}
            accept=".hwpx,.hwp,application/hwp+zip,application/x-hwp"
            multiple={false}
          />
        ) : (
          <div className="space-y-6">
            {/* Uploaded File & Parsed Stats */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-black text-xs">
                    {parsedDoc.format.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm truncate max-w-md">{file.name}</h4>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(0)} KB • 총 {parsedDoc.stats.charCount.toLocaleString()}자 분석 완료
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setParsedDoc(null);
                    setOutputBlob(null);
                    setOutputMeta(null);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> 다른 한글 파일 선택
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-500">문서 구역</div>
                    <div className="text-sm font-extrabold text-slate-900">{parsedDoc.stats.sectionCount}개</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2.5">
                  <AlignLeft className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-500">문단 수</div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {parsedDoc.stats.paragraphCount.toLocaleString()}개
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2.5">
                  <Table2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-500">인식된 표</div>
                    <div className="text-sm font-extrabold text-slate-900">{parsedDoc.stats.tableCount}개</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-500">내장 이미지</div>
                    <div className="text-sm font-extrabold text-slate-900">{parsedDoc.stats.imageCount}개</div>
                  </div>
                </div>
              </div>
            </div>

            <MascotActionNotice
              mood="ready"
              title="한글(HWP/HWPX) 문서 분석이 완료되었습니다!"
              description="아래에서 원하는 출력 형식(PDF, Word, Excel, 텍스트)을 선택해 즉시 변환하세요."
              actionHint="변환 형식을 고른 뒤 [변환 시작] 버튼을 눌러주세요!"
            />

            {/* Output Format Selector */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-3">
                변환할 파일 형식 선택 (4종 무료 지원)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {OUTPUT_FORMATS.map((fmt) => {
                  const Icon = fmt.icon;
                  const active = targetFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setTargetFormat(fmt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        active
                          ? "bg-rose-50 border-rose-500 ring-2 ring-rose-200 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${active ? "text-rose-600" : "text-slate-600"}`} />
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            active ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {fmt.badge}
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-slate-900 mb-1">{fmt.label}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{fmt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview snippet */}
            {parsedDoc.previewLines.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-extrabold text-slate-600 mb-2">문서 내용 미리보기</div>
                <div className="text-xs text-slate-700 space-y-1 max-h-28 overflow-y-auto leading-relaxed font-mono">
                  {parsedDoc.previewLines.slice(0, 6).map((line, idx) => (
                    <div key={idx} className="truncate">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => handleConvert()}
                className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <FileText className="w-5 h-5" />
                <span>{OUTPUT_FORMATS.find((f) => f.id === targetFormat)?.label}로 변환 시작</span>
              </button>
            </div>

            {outputBlob && outputMeta && (
              <div className="space-y-4 animate-in fade-in">
                <MascotActionNotice
                  mood="hooray"
                  title={`한글 ➔ ${activeFmtInfo.label} 변환이 완료되었습니다!`}
                  description={
                    outputMeta.pageCount
                      ? `총 ${outputMeta.pageCount}페이지의 고화질 PDF가 성공적으로 생성되었습니다.`
                      : "변환된 문서가 준비되었습니다. 다른 형식으로도 바로 추가 변환할 수 있습니다."
                  }
                  actionHint="아래 [다시 다운로드] 버튼을 눌러 저장하세요!"
                />
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-900">
                        {activeFmtInfo.label} 다운로드 준비 완료{" "}
                        {outputMeta.pageCount ? `(총 ${outputMeta.pageCount}페이지)` : ""}
                      </h4>
                      <p className="text-xs text-emerald-700">
                        {(outputBlob.size / 1024).toFixed(0)} KB • 다운로드가 시작되지 않았다면 버튼을 클릭하세요.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      downloadBlob(
                        outputBlob,
                        `${file.name.replace(/\.[^/.]+$/, "")}.${activeFmtInfo.ext}`,
                        activeFmtInfo.mime
                      )
                    }
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>다시 다운로드</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner format="horizontal" />
      <HowToSection toolName="한글(HWP/HWPX) 변환" steps={howToSteps} />
      <AdBanner format="responsive" />
      <FaqSection
        title="한글(HWP·HWPX) 파일 변환 자주 묻는 질문"
        subtitle="공공기관·관공서 한글 문서를 PDF, Word, Excel로 변환하는 안내입니다."
        items={faqItems}
      />

      <ProcessingOverlay isProcessing={isProcessing} progress={progress} message={progressMsg} />
    </div>
  );
}
