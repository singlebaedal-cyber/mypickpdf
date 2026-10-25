import type { Language } from "./i18n";
import faqsTranslationsRaw from "./faqs-translations.json";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FaqMeta {
  title: string;
  subtitle: string;
}

export interface MainPageExtraContent {
  hub_tag: string;
  hub_title: string;
  hub_subtitle: string;
  hub_view_all: string;
  hub_read_btn: string;
  why_security_title: string;
  why_security_desc: string;
  why_speed_title: string;
  why_speed_desc: string;
}

interface FaqLanguageBlock {
  title: string;
  subtitle: string;
  hub_tag: string;
  hub_title: string;
  hub_subtitle: string;
  hub_view_all: string;
  hub_read_btn: string;
  why_security_title: string;
  why_security_desc: string;
  why_speed_title: string;
  why_speed_desc: string;
  items: FAQItem[];
}

const faqsTranslations: Record<string, FaqLanguageBlock> = faqsTranslationsRaw as any;

export function getGlobalFaqs(lang: Language): FAQItem[] {
  const block = faqsTranslations[lang] || faqsTranslations["en"] || faqsTranslations["ko"];
  return block.items || faqsTranslations.ko.items;
}

export function getFaqMeta(lang: Language): FaqMeta {
  const block = faqsTranslations[lang] || faqsTranslations["en"] || faqsTranslations["ko"];
  return {
    title: block.title || faqsTranslations.ko.title,
    subtitle: block.subtitle || faqsTranslations.ko.subtitle,
  };
}

export function getMainPageExtraContent(lang: Language): MainPageExtraContent {
  const block = faqsTranslations[lang] || faqsTranslations["en"] || faqsTranslations["ko"];
  const koBlock = faqsTranslations.ko;
  return {
    hub_tag: block.hub_tag || koBlock.hub_tag,
    hub_title: block.hub_title || koBlock.hub_title,
    hub_subtitle: block.hub_subtitle || koBlock.hub_subtitle,
    hub_view_all: block.hub_view_all || koBlock.hub_view_all,
    hub_read_btn: block.hub_read_btn || koBlock.hub_read_btn,
    why_security_title: block.why_security_title || koBlock.why_security_title,
    why_security_desc: block.why_security_desc || koBlock.why_security_desc,
    why_speed_title: block.why_speed_title || koBlock.why_speed_title,
    why_speed_desc: block.why_speed_desc || koBlock.why_speed_desc,
  };
}
