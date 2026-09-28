"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, ShieldCheck, Sparkles, Coffee } from "lucide-react";
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
                my<span className="text-orange-500">pick</span><span className="text-rose-500">pdf</span> 🐾
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

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} mypickpdf. {t("footer_rights")}</p>
            <button
              onClick={() => setIsSponsorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-rose-500/20 hover:from-orange-500/30 hover:to-rose-500/30 text-orange-300 hover:text-orange-200 border border-orange-500/40 rounded-full text-[11px] font-bold transition-all shadow-xs"
            >
              <Coffee className="w-3.5 h-3.5 text-orange-400" />
              <span>{t("sponsor_snack_btn")}</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
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
