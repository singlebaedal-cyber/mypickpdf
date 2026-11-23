"use client";

import { useState, useEffect } from "react";
import type { Language } from "./i18n";
import {
  GuideArticle,
  getLocalizedArticle,
  getLocalizedArticles,
  loadGuidesTranslations,
  hasGuidesTranslationsLoaded,
} from "./guides-data";

export function useLocalizedArticles(lang: Language): GuideArticle[] {
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (lang === "ko" || hasGuidesTranslationsLoaded()) return;
    let active = true;
    loadGuidesTranslations().then(() => {
      if (active) setVersion((v) => v + 1);
    });
    return () => {
      active = false;
    };
  }, [lang]);

  return getLocalizedArticles(lang);
}

export function useLocalizedArticle(slug: string, lang: Language): GuideArticle {
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (lang === "ko" || hasGuidesTranslationsLoaded()) return;
    let active = true;
    loadGuidesTranslations().then(() => {
      if (active) setVersion((v) => v + 1);
    });
    return () => {
      active = false;
    };
  }, [lang]);

  return getLocalizedArticle(slug, lang);
}
