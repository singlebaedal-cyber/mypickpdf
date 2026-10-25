"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Sparkles, Coffee } from "lucide-react";
import RedPanda from "./RedPanda";
import SponsorModal from "./SponsorModal";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Guarantee Banner */}
        <div className="mb-12 p-6 rounded-3xl bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">{t("footer_security_title")}</h4>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                {t("footer_security_desc")}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {t("footer_privacy_leak")}
            </span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-950/60 border border-orange-500/30 flex items-center justify-center shadow-xs">
                <RedPanda mood="avatar" size={26} />
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                pdf<span className="text-orange-500">pick</span> 🐾
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t("footer_about")}
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              {t("footer_col_tools")}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/edit-pdf" className="hover:text-rose-400 transition-colors font-bold text-rose-400">
                  {t("tool_edit")}
                </Link>
              </li>
              <li>
                <Link href="/translate-pdf" className="hover:text-blue-400 transition-colors font-bold text-blue-400">
                  {t("tool_translate")}
                </Link>
              </li>
              <li>
                <Link href="/merge-pdf" className="hover:text-rose-400 transition-colors">
                  {t("tool_merge")}
                </Link>
              </li>
              <li>
                <Link href="/split-pdf" className="hover:text-rose-400 transition-colors">
                  {t("tool_split")}
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf" className="hover:text-rose-400 transition-colors font-bold text-rose-400">
                  {t("tool_compress")}
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-hwp" className="hover:text-rose-400 transition-colors font-bold text-blue-400">
                  {t("tool_pdf_to_hwp")}
                </Link>
              </li>
              <li>
                <Link href="/image-to-pdf" className="hover:text-rose-400 transition-colors">
                  {t("tool_img_to_pdf")}
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-image" className="hover:text-rose-400 transition-colors">
                  {t("tool_pdf_to_img")}
                </Link>
              </li>
              <li>
                <Link href="/add-page-numbers" className="hover:text-rose-400 transition-colors">
                  {t("tool_page_numbers")}
                </Link>
              </li>
              <li>
                <Link href="/add-watermark" className="hover:text-rose-400 transition-colors">
                  {t("tool_watermark")}
                </Link>
              </li>
              <li>
                <Link href="/rotate-pdf" className="hover:text-rose-400 transition-colors">
                  {t("tool_rotate")}
                </Link>
              </li>
              <li>
                <Link href="/ocr-pdf" className="hover:text-rose-400 transition-colors">
                  {t("tool_ocr")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              {t("footer_col_tech")}
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>WebAssembly Client Engine</li>
              <li>SSL/TLS 256-bit Encryption</li>
              <li>Zero Remote Server Storage</li>
              <li>Mobile & Tablet Friendly</li>
              <li>100% Free for Commercial Use</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              {t("footer_col_legal")}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/guides" className="hover:text-rose-400 transition-colors font-bold text-orange-400">
                  PDF 실무 가이드 & 꿀팁
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-rose-400 transition-colors">
                  {t("footer_privacy_link")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-rose-400 transition-colors">
                  {t("footer_terms_link")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-400 transition-colors">
                  {t("footer_contact_link")}
                </Link>
              </li>
              <li className="pt-1">
                <a href="mailto:fbihan@naver.com" className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 font-mono">
                  <span>✉</span> fbihan@naver.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean Semantic Internal Link Hub for Practical Guides & Workflows (No Duplicate URL Spam) */}
        <div className="pt-8 pb-8 border-t border-slate-800/80 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📌</span> 상황별 PDF 실무 해결 가이드 바로가기
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
            <Link href="/guides/pdf-stamp-and-signature-free" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors font-bold text-rose-400">
              PDF 도장 찍기·전자서명 넣기
            </Link>
            <Link href="/guides/pdf-redact-personal-info-whiteout" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors font-medium text-rose-300">
              PDF 주민번호·개인정보 가리기
            </Link>
            <Link href="/guides/public-institution-hwp-pdf-guide" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors text-blue-300">
              공공기관·정부24 HWP·HWPX 변환
            </Link>
            <Link href="/guides/translate-english-paper-pdf-korean" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors font-bold text-blue-400">
              영어 논문·계약서 PDF 대조본 번역
            </Link>
            <Link href="/guides/email-attachment-pdf-compression" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              이메일 첨부용 PDF 용량 80% 줄이기
            </Link>
            <Link href="/guides/gov24-nara-pdf-size-and-hwp-tips" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              나라장터·홈택스 제출 서류 변환 팁
            </Link>
            <Link href="/guides/scanned-pdf-ocr-text-extraction" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              스캔 이미지 PDF 글자 복사(OCR)
            </Link>
            <Link href="/guides/portfolio-merge-and-page-numbering" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              포트폴리오 PDF 합치기 & 쪽번호 매기기
            </Link>
            <Link href="/guides/smartphone-photo-to-clean-pdf" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              스마트폰 영수증 사진 A4 PDF 묶기
            </Link>
            <Link href="/guides/how-to-convert-pdf-to-excel" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              PDF 표·재무제표 엑셀(XLSX) 추출
            </Link>
            <Link href="/guides/how-to-compress-video-for-kakaotalk" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors text-amber-300">
              카카오톡 대용량 동영상 용량 줄이기
            </Link>
            <Link href="/guides/how-to-manage-pdf-on-iphone-ipad" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              아이폰·아이패드 무설치 PDF 편집
            </Link>
            <Link href="/guides/how-to-manage-pdf-on-galaxy-android" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              갤럭시 카톡 PDF 압축·변환
            </Link>
            <Link href="/guides/court-ecfs-pdf-page-numbers-merge" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors text-emerald-300 font-bold">
              법원 전자소송 PDF 합치기·쪽번호
            </Link>
            <Link href="/guides/cheongyak-lh-housing-pdf-merge-compress" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors text-emerald-400">
              청약홈·LH·은행 대출서류 PDF 병합
            </Link>
            <Link href="/guides/thesis-dissertation-pdfa-conversion-guide" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              대학원 학위논문 도서관 제출 PDF/A 변환
            </Link>
            <Link href="/guides/job-resume-portfolio-pdf-merge-compress" className="hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors">
              취업 포트폴리오·자소서 10MB 압축
            </Link>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} pdfpick. {t("footer_rights")}</p>
            <button
              onClick={() => setIsSponsorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-rose-500/20 hover:from-orange-500/30 hover:to-rose-500/30 text-orange-300 hover:text-orange-200 border border-orange-500/40 rounded-full text-[11px] font-bold transition-all shadow-xs"
            >
              <Coffee className="w-3.5 h-3.5 text-orange-400" />
              <span>{t("sponsor_snack_btn")}</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/guides" className="hover:underline text-orange-400 font-bold">가이드 & 팁</Link>
            <Link href="/privacy-policy" className="hover:underline">{t("footer_privacy_link")}</Link>
            <Link href="/terms" className="hover:underline">{t("footer_terms_link")}</Link>
            <Link href="/contact" className="hover:underline">{t("footer_contact_link")}</Link>
            <a href="mailto:fbihan@naver.com" className="hover:text-rose-400 font-mono">fbihan@naver.com</a>
          </div>
        </div>
      </div>

      <SponsorModal isOpen={isSponsorOpen} onClose={() => setIsSponsorOpen(false)} />
    </footer>
  );
}
