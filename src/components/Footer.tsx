"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FileText, ShieldCheck, Sparkles, Coffee, Globe, ChevronDown, Check } from "lucide-react";
import RedPanda from "./RedPanda";
import SponsorModal from "./SponsorModal";
import { useLanguage, LANGUAGES } from "@/lib/i18n";

export default function Footer() {
  const { lang, setLang, t } = useLanguage();
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
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
              <li className="pt-2 mt-1 border-t border-slate-800/80">
                <Link href="/guides" className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5">
                  <span>📖</span>
                  <span>{t("nav_guides")} (40+)</span>
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
              <li>100% Client-Side WebAssembly</li>
              <li>SSL/TLS 256-bit Encryption</li>
              <li>Zero Remote Server Storage</li>
              <li>Mobile &amp; Tablet Friendly</li>
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

        {/* Bottom Row (Exact iLovePDF Layout with 3-Column Language Selector) */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-4">
            {/* iLovePDF-Style Language Selector Button with 3-Column Modal */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700/80 flex items-center gap-2 transition-colors shadow-xs"
                title="Change language / Select language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentLang.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Exact iLovePDF 3-Column Floating Language Card */}
              {isLangOpen && (
                <div className="absolute bottom-full mb-3 left-0 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-5 z-50 animate-in fade-in zoom-in-95 min-w-[310px] sm:min-w-[620px] max-h-[85vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-6 text-left">
                    {/* Column 1 */}
                    <div className="space-y-0.5">
                      {LANGUAGES.filter((l) => l.column === 1).map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                            lang === l.code
                              ? "font-extrabold text-slate-900 bg-slate-100"
                              : "text-slate-600 hover:text-rose-600 hover:bg-slate-50 font-normal"
                          }`}
                        >
                          <span className="w-3.5 text-center shrink-0">
                            {lang === l.code ? <Check className="w-3.5 h-3.5 text-rose-600 stroke-[3]" /> : null}
                          </span>
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-6">
                      {LANGUAGES.filter((l) => l.column === 2).map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                            lang === l.code
                              ? "font-extrabold text-slate-900 bg-slate-100"
                              : "text-slate-600 hover:text-rose-600 hover:bg-slate-50 font-normal"
                          }`}
                        >
                          <span className="w-3.5 text-center shrink-0">
                            {lang === l.code ? <Check className="w-3.5 h-3.5 text-rose-600 stroke-[3]" /> : null}
                          </span>
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-6">
                      {LANGUAGES.filter((l) => l.column === 3).map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                            lang === l.code
                              ? "font-extrabold text-slate-900 bg-slate-100"
                              : "text-slate-600 hover:text-rose-600 hover:bg-slate-50 font-normal"
                          }`}
                        >
                          <span className="w-3.5 text-center shrink-0">
                            {lang === l.code ? <Check className="w-3.5 h-3.5 text-rose-600 stroke-[3]" /> : null}
                          </span>
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <p>© {new Date().getFullYear()} mypickpdf. {t("footer_rights")}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSponsorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-rose-500/20 hover:from-orange-500/30 hover:to-rose-500/30 text-orange-300 hover:text-orange-200 border border-orange-500/40 rounded-full text-[11px] font-bold transition-all shadow-xs"
            >
              <Coffee className="w-3.5 h-3.5 text-orange-400" />
              <span>{t("sponsor_snack_btn")}</span>
            </button>
            <Link href="/privacy-policy" className="hover:underline">{t("footer_privacy_link")}</Link>
            <Link href="/terms" className="hover:underline">{t("footer_terms_link")}</Link>
            <Link href="/contact" className="hover:underline">{t("footer_contact_link")}</Link>
          </div>
        </div>
      </div>

      <SponsorModal isOpen={isSponsorOpen} onClose={() => setIsSponsorOpen(false)} />
    </footer>
  );
}
