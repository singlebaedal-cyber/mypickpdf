"use client";

import { ar } from "./ar";
import { bg } from "./bg";
import { ca } from "./ca";
import { de } from "./de";
import { el } from "./el";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { hi } from "./hi";
import { id } from "./id";
import { it } from "./it";
import { ja } from "./ja";
import { ko } from "./ko";
import { ms } from "./ms";
import { nl } from "./nl";
import { pl } from "./pl";
import { pt } from "./pt";
import { ru } from "./ru";
import { sv } from "./sv";
import { sw } from "./sw";
import { th } from "./th";
import { tr } from "./tr";
import { uk } from "./uk";
import { vi } from "./vi";
import { zhCN } from "./zh-CN";
import { zhTW } from "./zh-TW";
import { TranslationKey, TranslationDictionary } from "./types";

export * from "./types";

export const translations: Record<string, TranslationDictionary> = {
  ar,
  bg,
  ca,
  de,
  el,
  en,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  ms,
  nl,
  pl,
  pt,
  ru,
  sv,
  sw,
  th,
  tr,
  uk,
  vi,
  "zh-CN": zhCN,
  zh: zhCN, // alias for standard zh
  "zh-TW": zhTW,
};
