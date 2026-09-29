"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, TranslationKey, TranslationDictionary } from "./translations";

export { translations };
export type { TranslationKey, TranslationDictionary };

export type Language =
  | "en" | "es" | "fr" | "de" | "it" | "pt" | "ja" | "ru" | "ko"
  | "zh-CN" | "zh-TW" | "ar" | "bg" | "ca" | "nl" | "el" | "hi" | "id"
  | "ms" | "pl" | "sv" | "th" | "tr" | "uk" | "vi" | "sw"
  | "zh";

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  initial: string;
  column: 1 | 2 | 3;
}

export const LANGUAGES: LanguageOption[] = [
  // Column 1
  { code: "en", label: "English", flag: "🇺🇸", initial: "EN", column: 1 },
  { code: "es", label: "Español", flag: "🇪🇸", initial: "ES", column: 1 },
  { code: "fr", label: "Français", flag: "🇫🇷", initial: "FR", column: 1 },
  { code: "de", label: "Deutsch", flag: "🇩🇪", initial: "DE", column: 1 },
  { code: "it", label: "Italiano", flag: "🇮🇹", initial: "IT", column: 1 },
  { code: "pt", label: "Português", flag: "🇧🇷", initial: "PT", column: 1 },
  { code: "ja", label: "日本語", flag: "🇯🇵", initial: "JA", column: 1 },
  { code: "ru", label: "Русский", flag: "🇷🇺", initial: "RU", column: 1 },
  { code: "ko", label: "한국어", flag: "🇰🇷", initial: "KO", column: 1 },

  // Column 2
  { code: "zh-CN", label: "中文 (简体)", flag: "🇨🇳", initial: "ZH", column: 2 },
  { code: "zh-TW", label: "中文 (繁體)", flag: "🇹🇼", initial: "TW", column: 2 },
  { code: "ar", label: "العربية", flag: "🇸🇦", initial: "AR", column: 2 },
  { code: "bg", label: "Български", flag: "🇧🇬", initial: "BG", column: 2 },
  { code: "ca", label: "Català", flag: "🇪🇸", initial: "CA", column: 2 },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", initial: "NL", column: 2 },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷", initial: "EL", column: 2 },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", initial: "HI", column: 2 },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩", initial: "ID", column: 2 },

  // Column 3
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾", initial: "MS", column: 3 },
  { code: "pl", label: "Polski", flag: "🇵🇱", initial: "PL", column: 3 },
  { code: "sv", label: "Svenska", flag: "🇸🇪", initial: "SV", column: 3 },
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭", initial: "TH", column: 3 },
  { code: "tr", label: "Türkçe", flag: "🇹🇷", initial: "TR", column: 3 },
  { code: "uk", label: "Українська", flag: "🇺🇦", initial: "UK", column: 3 },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳", initial: "VI", column: 3 },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪", initial: "SW", column: 3 },
];

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey | string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ko",
  setLang: () => {},
  t: (key) => (translations.ko as any)[key] || (key as string),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>("ko");

  useEffect(() => {
    const saved = localStorage.getItem("mypickpdf_lang") as Language;
    if (saved && (LANGUAGES.some((l) => l.code === saved) || saved === "zh")) {
      setLangState(saved);
      if (typeof document !== "undefined") {
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      }
    } else {
      const browserLang = navigator.language.toLowerCase();
      const matched = LANGUAGES.find(
        (l) => browserLang.startsWith(l.code.toLowerCase()) || l.code.toLowerCase().startsWith(browserLang.slice(0, 2))
      );
      const initial: Language = matched ? matched.code : "ko";
      setLangState(initial);
      if (typeof document !== "undefined") {
        document.documentElement.lang = initial;
        document.documentElement.dir = initial === "ar" ? "rtl" : "ltr";
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("mypickpdf_lang", newLang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    }
  };

  const t = (key: TranslationKey | string): string => {
    const dict =
      translations[lang] ||
      (lang === "zh-CN" ? translations["zh-CN"] : undefined) ||
      (lang === "zh-TW" ? translations["zh-TW"] : undefined) ||
      (lang === "zh" ? translations["zh-CN"] : undefined) ||
      translations.en ||
      translations.ko;
    return (
      (dict as any)?.[key] ||
      (translations.en as any)?.[key] ||
      (translations.ko as any)?.[key] ||
      (key as string)
    );
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
