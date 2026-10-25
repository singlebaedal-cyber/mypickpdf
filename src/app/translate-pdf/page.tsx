"use client";

import React, { useState, useTransition } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import StepBadge from "@/components/StepBadge";
import UploadedFileCard from "@/components/UploadedFileCard";
import { useLanguage, LANGUAGES } from "@/lib/i18n";
import { downloadBlob } from "@/lib/pdf-utils";
import {
  extractPdfPages,
  translatePdfPages,
  generateTranslatedPdf,
  generateTranslatedDocx,
  generateTranslatedTxt,
  TranslatedPage,
  TranslationMeta,
} from "@/lib/pdf-translator";
import {
  Languages,
  ArrowRightLeft,
  Sparkles,
  Download,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Columns,
  Eye,
  AlertCircle,
  FileCheck,
} from "lucide-react";

const SUPPORTED_SOURCE_LANGS = [
  { code: "auto", label: "자동 감지 (Auto Detect)", flag: "🌐" },
  ...LANGUAGES,
];

const TARGET_LANGS = LANGUAGES;

export default function TranslatePdfPage() {
  const { lang, t } = useLanguage();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>(lang === "ko" ? "en" : "ko");

  // Translation execution state
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [translatedPages, setTranslatedPages] = useState<TranslatedPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Handle file select
  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setTranslatedPages([]);
      setErrorMsg(null);
      setProgress(0);
      setActivePageIndex(0);
    }
  };

  // Swap languages
  const handleSwapLanguages = () => {
    if (sourceLang === "auto") {
      setSourceLang(targetLang);
      setTargetLang("ko");
    } else {
      const prevSource = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(prevSource);
    }
  };

  // Quick preset pairs
  const setPresetPair = (src: string, tgt: string) => {
    setSourceLang(src);
    setTargetLang(tgt);
  };

  // Start translation
  const handleStartTranslation = async () => {
    if (!file) return;

    try {
      setIsTranslating(true);
      setErrorMsg(null);
      setProgress(5);
      setProgressMsg("PDF 문서 분석 및 텍스트 추출 준비 중...");

      // 1. Extract text from PDF
      const pages = await extractPdfPages(file, (p, msg) => {
        setProgress(p);
        setProgressMsg(msg);
      });

      if (pages.length === 0) {
        throw new Error("PDF 문서에서 읽을 수 있는 페이지를 찾을 수 없습니다.");
      }

      // Check if all pages are empty/scanned
      const hasContent = pages.some(
        (p) => !p.text.startsWith("[이 페이지") && !p.text.startsWith("[추출 가능한")
      );
      if (!hasContent) {
        setErrorMsg(
          "해당 문서는 이미지/스캔 기반 PDF로 인식되었습니다. 텍스트 레이어가 있는 일반 PDF 문서를 업로드해 주세요."
        );
      }

      // 2. Translate text pages
      const translated = await translatePdfPages(
        pages,
        sourceLang,
        targetLang,
        (p, msg) => {
          setProgress(p);
          setProgressMsg(msg);
        }
      );

      setTranslatedPages(translated);
      setActivePageIndex(0);
      setProgress(100);
      setProgressMsg("번역이 완료되었습니다!");
    } catch (err: any) {
      console.error("Translation failed:", err);
      setErrorMsg(err.message || "번역 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Helper metadata
  const getMeta = (): TranslationMeta => {
    const srcObj = SUPPORTED_SOURCE_LANGS.find((l) => l.code === sourceLang);
    const tgtObj = TARGET_LANGS.find((l) => l.code === targetLang);
    return {
      sourceLang,
      targetLang,
      sourceLangLabel: srcObj ? `${srcObj.flag} ${srcObj.label}` : sourceLang,
      targetLangLabel: tgtObj ? `${tgtObj.flag} ${tgtObj.label}` : targetLang,
      filename: file?.name || "document.pdf",
    };
  };

  // Download translated PDF
  const handleDownloadPdf = async (mode: "translated" | "comparison") => {
    if (!file || translatedPages.length === 0) return;
    try {
      setIsDownloading(mode);
      const meta = getMeta();
      const pdfBytes = await generateTranslatedPdf(translatedPages, mode, meta);
      const prefix = mode === "translated" ? "translated_" : "comparison_";
      const downloadName = `${prefix}${file.name.replace(/\.pdf$/i, "")}_${targetLang}.pdf`;
      await downloadBlob(pdfBytes, downloadName);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      alert("PDF 생성 중 문제가 발생했습니다: " + (err.message || "오류"));
    } finally {
      setIsDownloading(null);
    }
  };

  // Download Word (.docx)
  const handleDownloadDocx = async (mode: "translated" | "comparison") => {
    if (!file || translatedPages.length === 0) return;
    try {
      setIsDownloading("docx");
      const meta = getMeta();
      const docxBlob = await generateTranslatedDocx(translatedPages, mode, meta);
      const downloadName = `translated_${file.name.replace(/\.pdf$/i, "")}_${targetLang}.docx`;
      await downloadBlob(
        docxBlob,
        downloadName,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
    } catch (err: any) {
      console.error("Docx generation failed:", err);
      alert("Word 문서 생성 중 문제가 발생했습니다: " + (err.message || "오류"));
    } finally {
      setIsDownloading(null);
    }
  };

  // Download TXT
  const handleDownloadTxt = (mode: "translated" | "comparison") => {
    if (!file || translatedPages.length === 0) return;
    const meta = getMeta();
    const txtContent = generateTranslatedTxt(translatedPages, mode, meta);
    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
    const downloadName = `translated_${file.name.replace(/\.pdf$/i, "")}_${targetLang}.txt`;
    downloadBlob(blob, downloadName, "text/plain");
  };

  // Copy text helper
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Update edited translated text in live preview
  const handleTranslatedTextChange = (newText: string) => {
    setTranslatedPages((prev) => {
      const copy = [...prev];
      if (copy[activePageIndex]) {
        copy[activePageIndex] = {
          ...copy[activePageIndex],
          translatedText: newText,
        };
      }
      return copy;
    });
  };

  const activePage = translatedPages[activePageIndex];

  // How-To Steps
  const howToSteps = [
    {
      step: 1,
      title: "PDF 파일 업로드",
      desc: "번역하고자 하는 PDF 문서를 화면에 끌어다 놓거나 파일 선택 버튼을 클릭하여 업로드합니다.",
    },
    {
      step: 2,
      title: "출발어 및 도착어 선택",
      desc: "원문 언어(자동 감지 또는 직접 선택)와 변환하고자 하는 번역 목표 언어(한국어, 영어, 일본어 등 18개 언어)를 지정합니다.",
    },
    {
      step: 3,
      title: "고정밀 신경망 AI 번역",
      desc: "번역 시작 버튼을 누르면 문맥과 문단 구조를 정밀하게 분석하여 실시간으로 고속 번역이 수행됩니다.",
    },
    {
      step: 4,
      title: "번역본 및 원문 대조본 PDF 다운로드",
      desc: "완성된 단일 번역본 PDF, 학술/업무용 원문-번역 2열 대조본 PDF 또는 Word 파일로 원하는 형식을 즉시 저장합니다.",
    },
  ];

  // FAQ Items
  const faqItems = [
    {
      question: "PDF 번역 서비스는 무료인가요? 페이지나 횟수 제한이 있나요?",
      answer: "네! PDFPick의 PDF 번역 기능은 100% 무료이며 회원가입이나 로그인 없이 즉시 이용하실 수 있습니다. 일일 이용 횟수 제한 없이 자유롭게 번역할 수 있습니다.",
    },
    {
      question: "업로드한 PDF 문서와 번역 데이터는 안전하게 보호되나요?",
      answer: "모든 텍스트 추출과 최종 PDF/워드 문서 렌더링은 사용자의 브라우저 로컬에서 직접 실행되며, 번역 서버에 문서 파일 자체가 영구 저장되지 않고 번역 처리 직후 즉시 폐기되므로 기업 기밀과 개인정보가 안전하게 보호됩니다.",
    },
    {
      question: "원문과 번역문을 나란히 비교할 수 있는 '대조본 PDF'는 무엇인가요?",
      answer: "대조본 PDF는 왼쪽 열에 원본 문장, 오른쪽 열에 번역된 문장을 2열(Two-column) 레이아웃으로 배치하여 한눈에 원문과 번역을 교차 검증할 수 있는 서식입니다. 해외 논문 검토, 계약서 번역, 어학 학습 시 매우 유용합니다.",
    },
    {
      question: "번역된 PDF를 다운로드할 때 외국어나 한글 폰트가 깨지지 않나요?",
      answer: "PDFPick은 고해상도 안티앨리어싱 캔버스 렌더러와 브라우저 네이티브 폰트 엔진을 결합하여 한국어, 영어, 일본어, 중국어, 아랍어, 키릴 문자 등 모든 언어를 문자 깨짐(???) 현상 없이 깨끗하고 선명하게 인코딩합니다.",
    },
    {
      question: "번역된 내용을 다운로드 전에 직접 수정할 수 있나요?",
      answer: "네! 번역이 완료되면 화면 우측의 실시간 번역문 뷰어에서 텍스트를 자유롭게 직접 수정할 수 있으며, 수정된 내용이 그대로 반영된 번역본 PDF를 다운로드하실 수 있습니다.",
    },
  ];

  return (
    <div className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Tool Header */}
      <ToolHeader
        toolKey="translate"
        tag="AI 18개 언어 신경망 초고속 번역"
      />

      <AdBanner format="horizontal" />

      {/* Main Translation Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-sm my-8">
        {/* Stage 1: Upload and Configuration */}
        {!translatedPages.length && (
          <div className="space-y-6">
            {!file ? (
              <div>
                <div className="flex justify-center mb-6">
                  <StepBadge step={1} label="번역할 PDF 파일 선택 또는 드래그" />
                </div>
                <div className="max-w-xl mx-auto">
                  <FileDropzone
                    onFilesSelected={handleFilesSelected}
                    accept=".pdf,application/pdf"
                    multiple={false}
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex justify-center mb-2">
                  <StepBadge step={2} label="번역할 언어 선택 및 변환 시작" />
                </div>

                <UploadedFileCard
                  file={file}
                  onReset={() => {
                    setFile(null);
                    setTranslatedPages([]);
                    setErrorMsg(null);
                  }}
                />

                {/* Language Picker Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-center">
                    {/* Source Lang */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">
                        원문 언어 (출발어)
                      </label>
                      <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 cursor-pointer"
                      >
                        {SUPPORTED_SOURCE_LANGS.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.flag} {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center pt-2 sm:pt-5">
                      <button
                        onClick={handleSwapLanguages}
                        type="button"
                        title="언어 맞바꾸기"
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-all shadow-sm"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Target Lang */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">
                        번역 언어 (도착어)
                      </label>
                      <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 cursor-pointer"
                      >
                        {TARGET_LANGS.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.flag} {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preset Buttons */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-xs font-medium text-slate-500 mr-2">자주 쓰는 번역:</span>
                    <div className="inline-flex flex-wrap gap-1.5 mt-1 sm:mt-0">
                      <button
                        type="button"
                        onClick={() => setPresetPair("ko", "en")}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-700 font-medium transition"
                      >
                        🇰🇷 한국어 ➔ 🇺🇸 영어
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetPair("en", "ko")}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-700 font-medium transition"
                      >
                        🇺🇸 영어 ➔ 🇰🇷 한국어
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetPair("ja", "ko")}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-700 font-medium transition"
                      >
                        🇯🇵 일본어 ➔ 🇰🇷 한국어
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetPair("zh", "ko")}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-700 font-medium transition"
                      >
                        🇨🇳 중국어 ➔ 🇰🇷 한국어
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">안내</p>
                      <p>{errorMsg}</p>
                    </div>
                  </div>
                )}

                {/* Translating Progress State */}
                {isTranslating ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-rose-600 font-bold text-base animate-pulse">
                      <Sparkles className="w-5 h-5" />
                      <span>{progressMsg || "번역 진행 중..."}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      진행률: {progress}% (문서 분량에 따라 약 5~15초 소요됩니다)
                    </p>
                  </div>
                ) : (
                  /* Action CTA Button */
                  <button
                    onClick={handleStartTranslation}
                    type="button"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                  >
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>AI 실시간 PDF 번역 시작하기</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stage 2: Translation Completed Studio */}
        {translatedPages.length > 0 && (
          <div className="space-y-6">
            {/* Top Success Bar & Actions */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                    <span>PDF 번역이 성공적으로 완료되었습니다!</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      총 {translatedPages.length}페이지
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {getMeta().sourceLangLabel} ➔ {getMeta().targetLangLabel} | {file?.name}
                  </p>
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={() => {
                  setTranslatedPages([]);
                  setFile(null);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5 self-end md:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다른 문서 번역하기</span>
              </button>
            </div>

            {/* Download Buttons Palette */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Translated PDF */}
              <button
                type="button"
                onClick={() => handleDownloadPdf("translated")}
                disabled={isDownloading !== null}
                className="p-4 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between group disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <Download className="w-4 h-4 text-white/80 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base">
                    {isDownloading === "translated" ? "생성 중..." : "번역본 PDF 다운로드"}
                  </div>
                  <p className="text-xs text-rose-100 mt-1">
                    번역된 내용만 깔끔하게 정돈된 표준 A4 문서
                  </p>
                </div>
              </button>

              {/* 2. Side-by-Side Dual Comparison PDF */}
              <button
                type="button"
                onClick={() => handleDownloadPdf("comparison")}
                disabled={isDownloading !== null}
                className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between group disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                    <Columns className="w-5 h-5 text-white" />
                  </div>
                  <Download className="w-4 h-4 text-white/80 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base">
                    {isDownloading === "comparison" ? "생성 중..." : "원문-번역 대조본 PDF"}
                  </div>
                  <p className="text-xs text-indigo-100 mt-1">
                    좌측 원문 / 우측 번역문 2열 대조 비교 문서
                  </p>
                </div>
              </button>

              {/* 3. Word (.docx) */}
              <button
                type="button"
                onClick={() => handleDownloadDocx("translated")}
                disabled={isDownloading !== null}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 shadow-sm transition-all text-left flex flex-col justify-between group disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base text-slate-900">
                    {isDownloading === "docx" ? "생성 중..." : "Word (.docx) 다운로드"}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    워드나 한글에서 즉시 편집 가능한 문서
                  </p>
                </div>
              </button>

              {/* 4. Text (.txt) */}
              <button
                type="button"
                onClick={() => handleDownloadTxt("translated")}
                disabled={isDownloading !== null}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 shadow-sm transition-all text-left flex flex-col justify-between group disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base text-slate-900">
                    텍스트 (.txt) 다운로드
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    가볍고 빠른 순수 텍스트 파일 저장
                  </p>
                </div>
              </button>
            </div>

            {/* Interactive Dual Previewer & Live Text Editor */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              {/* Page Selector Tabs */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between overflow-x-auto gap-2">
                <div className="flex items-center gap-1.5 flex-nowrap">
                  <span className="text-xs font-bold text-slate-500 mr-2 flex-shrink-0">
                    페이지 선택:
                  </span>
                  {translatedPages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePageIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                        activePageIndex === idx
                          ? "bg-rose-600 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      P.{idx + 1}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-bold text-slate-500 flex-shrink-0">
                  {activePageIndex + 1} / {translatedPages.length} 페이지
                </span>
              </div>

              {/* Side-by-Side Dual Content */}
              {activePage && (
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                  {/* Left: Original Text */}
                  <div className="p-4 sm:p-6 flex flex-col">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        <h4 className="text-sm font-bold text-slate-700">
                          원문 [ {getMeta().sourceLangLabel} ]
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(activePage.originalText, "orig")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition"
                      >
                        {copiedType === "orig" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>원문 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex-1 bg-slate-50 rounded-xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap max-h-[500px] overflow-y-auto border border-slate-200/60">
                      {activePage.originalText}
                    </div>
                  </div>

                  {/* Right: Translated Text (Editable!) */}
                  <div className="p-4 sm:p-6 flex flex-col">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <h4 className="text-sm font-bold text-rose-700">
                          AI 번역문 [ {getMeta().targetLangLabel} ]
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-medium">
                          직접 편집 가능
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(activePage.translatedText, "trans")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition"
                      >
                        {copiedType === "trans" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>번역문 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      value={activePage.translatedText}
                      onChange={(e) => handleTranslatedTextChange(e.target.value)}
                      rows={18}
                      className="w-full flex-1 bg-white rounded-xl p-4 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none resize-y"
                      placeholder="번역된 텍스트가 표시됩니다..."
                    />

                    <p className="text-[11px] text-slate-400 mt-2">
                      💡 문장을 직접 수정하면 다운로드할 번역본 PDF 및 Word 파일에 수정사항이 실시간으로 반영됩니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Educational & SEO Sections */}
      <HowToSection toolName="PDF 번역" steps={howToSteps} />
      <FaqSection items={faqItems} title="PDF 번역 자주 묻는 질문 (FAQ)" />

      <AdBanner format="horizontal" />
    </div>
  );
}
