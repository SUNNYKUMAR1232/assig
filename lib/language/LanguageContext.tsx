"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, Language, TranslationKey } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: TranslationKey, fallback?: string) => fallback || String(key),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("janseva_lang") as Language | null;
      if (saved === "hi" || saved === "en") {
        setLanguageState(saved);
      } else {
        setLanguageState("en");
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("janseva_lang", lang);
    } catch {
      // Ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === "hi" ? "en" : "hi";
      try {
        localStorage.setItem("janseva_lang", next);
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      const dict = translations[language] || translations.hi;
      return dict[key] || translations.hi[key] || fallback || String(key);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

